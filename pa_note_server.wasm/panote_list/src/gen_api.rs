
use serde_json::{json,Value};
use serde::{Serialize, Deserialize};
use axum::{http::StatusCode, routing::post, Json, Router};
use async_trait::async_trait;
use crate::general::network::http_handler::ApiHandlerImpl;

#[derive(Debug, Serialize, Deserialize)]
pub struct NodeBasic {
       pub name:String,
       pub online:bool,
       pub ip:String,
       pub ssh_port:String,
       pub cpu_sum:f64,
       pub cpu_cur:f64,
       pub mem_sum:f64,
       pub mem_cur:f64,
       pub passwd:String,
       pub system:String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Action {
       pub name:String,
       pub cmd:String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ServiceBasic {
       pub name:String,
       pub node:String,
       pub dir:String,
       pub actions:Vec<Action>,
}


#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum GetNotesMataResp{
    Succ{
       node_id_name_list:Vec<String>,
},

}

impl GetNotesMataResp {
    fn id(&self)->u32 {
        match self {
                GetNotesMataResp::Succ{..}=>1,

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
#[serde(untagged)]
pub enum CreateNewNoteResp{
    Succ{

},

}

impl CreateNewNoteResp {
    fn id(&self)->u32 {
        match self {
                CreateNewNoteResp::Succ{..}=>1,

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
#[serde(untagged)]
pub enum RenameNoteResp{
    Succ{

},

}

impl RenameNoteResp {
    fn id(&self)->u32 {
        match self {
                RenameNoteResp::Succ{..}=>1,

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
pub struct RenameNoteReq {
       pub noteid:String,
       pub name:String,
}


#[async_trait]
pub trait ApiHandler {
    
    async fn handle_get_notes_mata(&self, )->GetNotesMataResp;
            
    async fn handle_create_new_note(&self, )->CreateNewNoteResp;
            
    async fn handle_rename_note(&self, req:RenameNoteReq)->RenameNoteResp;
            
}


pub fn add_routers(mut router:Router)->Router
{
    
    async fn get_notes_mata()-> (StatusCode, Json<Value>){
        (StatusCode::OK, Json(ApiHandlerImpl.handle_get_notes_mata().await.serialize()))
    }
    router=router
        .route("/get_notes_mata", post(get_notes_mata));
                             
    async fn create_new_note()-> (StatusCode, Json<Value>){
        (StatusCode::OK, Json(ApiHandlerImpl.handle_create_new_note().await.serialize()))
    }
    router=router
        .route("/create_new_note", post(create_new_note));
                             
    async fn rename_note(Json(req):Json<RenameNoteReq>)-> (StatusCode, Json<Value>){
        (StatusCode::OK, Json(ApiHandlerImpl.handle_rename_note(req).await.serialize()))
    }
    router=router
        .route("/rename_note", post(rename_note));
                             
    
    router
}

