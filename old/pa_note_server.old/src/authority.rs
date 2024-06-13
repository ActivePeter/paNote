use parking_lot;
use std::fs::OpenOptions;
use std::io::{BufReader, Read};
use serde::{Deserialize, Serialize};
use axum::http::uri::Authority;
use crate::authority::token::CheckTokenRes;

#[derive(Serialize,Deserialize,Default)]
pub struct AuthorityConfig{
    pub id:String,
    pub pw:String,
    pub token_secret:String
}


mod token{
    use serde::{Deserialize, Serialize};
    use serde_json::json;
    use jsonwebtoken::{encode, decode, Header, Algorithm, Validation, EncodingKey, DecodingKey, TokenData};
    use chrono;
    use std::borrow::BorrowMut;
    use parking_lot::RwLock;
    use std::ops::DerefMut;
    use std::mem;
    use jsonwebtoken::errors::Error;
    use lazy_static::lazy_static;
    use axum::response::IntoResponse;
    use axum::http::StatusCode;
    use core::option::Option;

    // Our claims struct, it needs to derive `Serialize` and/or `Deserialize`
    #[derive(Debug, Serialize, Deserialize)]
    struct Claims {
        // connid:i32,
        exp: u64,
    }

    lazy_static! {
        pub static ref TOKEN_SECRET: RwLock<String> =RwLock::new( String::new());
        // pub static ref TEST:Test=Test::new();
    }
    const EXPIRE_SEC:u64=60*60*24*15;//15 day

    pub fn init_token_secret(mut secret:String){
        {
            let mut sec = TOKEN_SECRET.write();
            mem::swap(sec.deref_mut(), &mut secret);
        }
    }

    //需要保证uid有效
    pub fn maketoken() -> String {
        // 用于设置过期时间
        let second=chrono::Local::now().timestamp();

        // 生成JWT，主要用于保存uid
        // 用于加密的key是服务器配置的
        // todo : 安全性思考
        encode(&Header::default(), &Claims{
            exp: second as u64
                +EXPIRE_SEC
        }, &EncodingKey::from_secret(TOKEN_SECRET.read().as_bytes())).unwrap()
    }

    pub enum CheckTokenRes{
        FailParse,
        Valid,
        Expire,
    }
    impl CheckTokenRes{
        pub fn invalid(self) -> (StatusCode, &'static str) {
            (StatusCode::BAD_REQUEST, "token_invalid")
        }
    }

    // 解析token
    pub fn checktoken(token:String)->CheckTokenRes{
        // 解析用于验证的token
        let token = decode::<Claims>(&token,
                                     &DecodingKey::from_secret(TOKEN_SECRET.read().as_bytes()),
                                     &Validation::default());
        match token{
            Ok(data) => {
                let second=chrono::Local::now().timestamp()  as u64;

                println!("{} {}",serde_json::to_string(&data.claims).unwrap(),second);
                // 过期
                if second > data.claims.exp{
                    return CheckTokenRes::Expire;
                }
                CheckTokenRes::Valid
                // Ch
            }
            Err(e) => {
                log::debug!("{}",e);

                CheckTokenRes::FailParse
            }
        }
    }
}

const CONFIG_FILE_PATH:&'static str ="authority_config.json";
lazy_static::lazy_static! {
    pub static ref G_AUTHORITY_MAN : AuthorityMan = AuthorityMan::new();
}
#[derive(Default)]
pub struct AuthorityManLocked{
    pub config:AuthorityConfig
}
pub struct AuthorityMan{
    locked:parking_lot::RwLock<AuthorityManLocked>
}
impl AuthorityMan{
    pub fn new() -> AuthorityMan {
        AuthorityMan{
            locked: parking_lot::RwLock::from(AuthorityManLocked::default())
        }
    }
    pub fn get() ->  &'static AuthorityMan{
        &G_AUTHORITY_MAN
    }
    pub fn load_config(&self){
        let f=OpenOptions::new()
            .write(true)
            .read(true)
            .create(true)
            .open(CONFIG_FILE_PATH).unwrap();
        let mut s=String::new();
        BufReader::new(f).read_to_string(&mut s).unwrap();
        let mut hold=self.locked.write();
        hold.config=serde_json::from_str(&*s).unwrap();
        token::init_token_secret(hold.config.token_secret.clone());
    }
    pub fn check_id_and_pw(&self,id:&str,pw:&str) -> Result<(),()>{
        let read=self.locked.read();
        if read.config.pw==pw&&read.config.id==id{
            return Ok(())
        }
        Err(())
        // (read.config.id.clone(),read.config.pw.clone())
    }
    pub fn gen_token(&self) -> String {
        token::maketoken()
    }
    pub fn check_token(&self,token:String)->Result<(),()>{
        match token::checktoken(token){
            CheckTokenRes::Valid => {
                Result::Ok(())
            }
            _ => {
                Result::Err(())
            }
        }
    }
}
