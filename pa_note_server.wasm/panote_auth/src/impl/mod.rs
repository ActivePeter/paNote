use self::authority::AuthorityMan;
use crate::gen_api::{ApiHandler, LoginReq, LoginResp, VerifyTokenReq, VerifyTokenResp};
use crate::*;

mod authority;

impl ApiHandler for Impl {
    fn handle_login(&self, req: LoginReq) -> LoginResp {
        let auth_man = AuthorityMan::new();
        if let Ok(_) = auth_man.check_id_and_pw(&*(req.id), &*(req.pw)) {
            LoginResp::Succ {
                token: auth_man.gen_token(),
            }
        } else {
            LoginResp::Fail { msg: "".to_owned() }
        }
    }
    fn handle_verify_token(&self, req: VerifyTokenReq) -> VerifyTokenResp {
        let auth_man = AuthorityMan::new();
        if auth_man.check_token(req.token).is_ok() {
            VerifyTokenResp::Succ {
                new_token: auth_man.gen_token(),
            }
        } else {
            VerifyTokenResp::Fail { msg: "".to_owned() }
        }
    }
}
