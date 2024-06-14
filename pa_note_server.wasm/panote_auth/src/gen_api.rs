
use serde_json::{json,Value};
use serde::{Serialize, Deserialize};




#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum LoginResp{
    Succ{
       token:String,
},
    Fail{
       msg:String,
},

}

impl LoginResp {
    fn id(&self)->u32 {
        match self {
                LoginResp::Succ{..}=>1,
    LoginResp::Fail{..}=>2,

        }
    }
    pub fn serialize(&self)->Value {
        json!({
            "id": self.id(),
            "kernel": serde_json::to_value(self).unwrap(),
        })
    }
}


#[derive(Debug, Serialize, Deserialize)]
pub struct LoginReq {
       pub id:String,
       pub pw:String,
}



#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum VerifyTokenResp{
    Succ{
       new_token:String,
},
    Fail{
       msg:String,
},

}

impl VerifyTokenResp {
    fn id(&self)->u32 {
        match self {
                VerifyTokenResp::Succ{..}=>1,
    VerifyTokenResp::Fail{..}=>2,

        }
    }
    pub fn serialize(&self)->Value {
        json!({
            "id": self.id(),
            "kernel": serde_json::to_value(self).unwrap(),
        })
    }
}


#[derive(Debug, Serialize, Deserialize)]
pub struct VerifyTokenReq {
       pub token:String,
}



pub trait ApiHandler {
    
     fn handle_login(&self, req:LoginReq)->LoginResp;
            
     fn handle_verify_token(&self, req:VerifyTokenReq)->VerifyTokenResp;
            
}

#[no_mangle]
fn login(http_json_ptr: i32, http_json_len: i32) {
    let json_str = unsafe {
        String::from_raw_parts(
            http_json_ptr as *mut u8,
            http_json_len as usize,
            http_json_len as usize,
        )
    };
    if let Ok(req) = serde_json::from_str(&json_str) {
        let resp = super::Impl.handle_login(req).serialize();
        let resp_str = serde_json::to_string(&resp).unwrap();
        unsafe { super::write_result(resp_str.as_ptr(), resp_str.len() as i32) }
    }
}
#[no_mangle]
fn verify_token(http_json_ptr: i32, http_json_len: i32) {
    let json_str = unsafe {
        String::from_raw_parts(
            http_json_ptr as *mut u8,
            http_json_len as usize,
            http_json_len as usize,
        )
    };
    if let Ok(req) = serde_json::from_str(&json_str) {
        let resp = super::Impl.handle_verify_token(req).serialize();
        let resp_str = serde_json::to_string(&resp).unwrap();
        unsafe { super::write_result(resp_str.as_ptr(), resp_str.len() as i32) }
    }
}



