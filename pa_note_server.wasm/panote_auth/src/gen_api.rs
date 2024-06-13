
use serde_json::{json,Value};
use serde::{Serialize, Deserialize};
use axum::{http::StatusCode, routing::post, Json, Router};
use async_trait::async_trait;
use crate::general::network::http_handler::ApiHandlerImpl;


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


#[async_trait]
pub trait ApiHandler {
    
    async fn handle_login(&self, req:LoginReq)->LoginResp;
            
    async fn handle_verify_token(&self, req:VerifyTokenReq)->VerifyTokenResp;
            
}


pub fn add_routers(mut router:Router)->Router
{
    
    async fn login(Json(req):Json<LoginReq>)-> (StatusCode, Json<Value>){
        (StatusCode::OK, Json(ApiHandlerImpl.handle_login(req).await.serialize()))
    }
    router=router
        .route("/login", post(login));
                             
    async fn verify_token(Json(req):Json<VerifyTokenReq>)-> (StatusCode, Json<Value>){
        (StatusCode::OK, Json(ApiHandlerImpl.handle_verify_token(req).await.serialize()))
    }
    router=router
        .route("/verify_token", post(verify_token));
                             
    
    router
}

