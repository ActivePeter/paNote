
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




