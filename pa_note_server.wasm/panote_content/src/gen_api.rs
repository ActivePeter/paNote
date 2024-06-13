
use serde_json::{json,Value};
use serde::{Serialize, Deserialize};
use axum::{http::StatusCode, routing::post, Json, Router};
use async_trait::async_trait;
use crate::general::network::http_handler::ApiHandlerImpl;


#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum GetNoteMataResp{
    Succ{
       next_noteid:i32,
       max_chunkx:i32,
       max_chunky:i32,
       min_chunkx:i32,
       min_chunky:i32,
},

}

impl GetNoteMataResp {
    fn id(&self)->u32 {
        match self {
                GetNoteMataResp::Succ{..}=>1,

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
pub struct GetNoteMataReq {
       pub noteid:String,
}



#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum GetChunkNoteIdsResp{
    Succ{
       noteids:Vec<String>,
},

}

impl GetChunkNoteIdsResp {
    fn id(&self)->u32 {
        match self {
                GetChunkNoteIdsResp::Succ{..}=>1,

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
pub struct GetChunkNoteIdsReq {
       pub noteid:String,
       pub chunkx:i32,
       pub chunky:i32,
}



#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum GetNoteBarInfoResp{
    Exist{
       x:f64,
       y:f64,
       w:f64,
       h:f64,
       text:String,
       formatted:String,
       connected:Vec<String>,
       epoch:i32,
},

}

impl GetNoteBarInfoResp {
    fn id(&self)->u32 {
        match self {
                GetNoteBarInfoResp::Exist{..}=>1,

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
pub struct GetNoteBarInfoReq {
       pub noteid:String,
       pub notebarid:String,
}



#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum CreateNewBarResp{
    Succ{
       chunkx:i32,
       chunky:i32,
       noteids:Vec<String>,
},

}

impl CreateNewBarResp {
    fn id(&self)->u32 {
        match self {
                CreateNewBarResp::Succ{..}=>1,

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
pub struct CreateNewBarReq {
       pub noteid:String,
       pub x:f64,
       pub y:f64,
}



#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum UpdateBarContentResp{
    Succ{
       new_epoch:i32,
},

}

impl UpdateBarContentResp {
    fn id(&self)->u32 {
        match self {
                UpdateBarContentResp::Succ{..}=>1,

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
pub struct UpdateBarContentReq {
       pub noteid:String,
       pub barid:String,
       pub text:String,
       pub formatted:String,
}



#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum UpdateBarTransformResp{
    Succ{
       new_epoch:i32,
       chunk_maxx:i32,
       chunk_minx:i32,
       chunk_maxy:i32,
       chunk_miny:i32,
       chunk_change:Vec<String>,
},

}

impl UpdateBarTransformResp {
    fn id(&self)->u32 {
        match self {
                UpdateBarTransformResp::Succ{..}=>1,

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
pub struct UpdateBarTransformReq {
       pub noteid:String,
       pub barid:String,
       pub x:f64,
       pub y:f64,
       pub w:f64,
       pub h:f64,
}



#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum RedoResp{
    Succ{
       redotype:String,
       redovalue:Obj,
},

}

impl RedoResp {
    fn id(&self)->u32 {
        match self {
                RedoResp::Succ{..}=>1,

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
pub struct RedoReq {
       pub noteid:String,
}



#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum AddPathResp{
    Succ{
       new_epoch_from:i32,
       new_epoch_to:i32,
},
    Fail{

},

}

impl AddPathResp {
    fn id(&self)->u32 {
        match self {
                AddPathResp::Succ{..}=>1,
    AddPathResp::Fail{..}=>2,

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
pub struct AddPathReq {
       pub noteid:String,
       pub from:String,
       pub to:String,
}



#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum GetPathInfoResp{
    Succ{
       type_:i32,
},

}

impl GetPathInfoResp {
    fn id(&self)->u32 {
        match self {
                GetPathInfoResp::Succ{..}=>1,

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
pub struct GetPathInfoReq {
       pub noteid:String,
       pub pathid_with_line:String,
}



#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum SetPathInfoResp{
    Succ{

},

}

impl SetPathInfoResp {
    fn id(&self)->u32 {
        match self {
                SetPathInfoResp::Succ{..}=>1,

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
pub struct SetPathInfoReq {
       pub noteid:String,
       pub pathid_with_line:String,
       pub type_:i32,
}



#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum RemovePathResp{
    Succ{
       new_epoch_from:i32,
       new_epoch_to:i32,
},

}

impl RemovePathResp {
    fn id(&self)->u32 {
        match self {
                RemovePathResp::Succ{..}=>1,

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
pub struct RemovePathReq {
       pub noteid:String,
       pub pathid_with_line:String,
}



#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum DeleteBarResp{
    Succ{
       chunk_maxx:i32,
       chunk_minx:i32,
       chunk_maxy:i32,
       chunk_miny:i32,
},

}

impl DeleteBarResp {
    fn id(&self)->u32 {
        match self {
                DeleteBarResp::Succ{..}=>1,

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
pub struct DeleteBarReq {
       pub noteid:String,
       pub barid:String,
}



#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum ArticleBinderResp{
    Succ{

},
    Fail{

},

}

impl ArticleBinderResp {
    fn id(&self)->u32 {
        match self {
                ArticleBinderResp::Succ{..}=>1,
    ArticleBinderResp::Fail{..}=>2,

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
pub struct ArticleBinderReq {
       pub bind_unbind_rename:String,
       pub article_name:String,
       pub barid:String,
       pub noteid:String,
}



#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum ArticleListResp{
    Succ{
       list:Vec<String>,
},
    Fail{

},

}

impl ArticleListResp {
    fn id(&self)->u32 {
        match self {
                ArticleListResp::Succ{..}=>1,
    ArticleListResp::Fail{..}=>2,

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
pub struct ArticleListReq {
       pub noteid:String,
}



#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum FetchAllNoteBarsEpochResp{
    Succ{
       bars_id_and_epoch:Vec<String>,
},

}

impl FetchAllNoteBarsEpochResp {
    fn id(&self)->u32 {
        match self {
                FetchAllNoteBarsEpochResp::Succ{..}=>1,

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
pub struct FetchAllNoteBarsEpochReq {
       pub noteid:String,
}


#[async_trait]
pub trait ApiHandler {
    
    async fn handle_get_note_mata(&self, req:GetNoteMataReq)->GetNoteMataResp;
            
    async fn handle_get_chunk_note_ids(&self, req:GetChunkNoteIdsReq)->GetChunkNoteIdsResp;
            
    async fn handle_get_note_bar_info(&self, req:GetNoteBarInfoReq)->GetNoteBarInfoResp;
            
    async fn handle_create_new_bar(&self, req:CreateNewBarReq)->CreateNewBarResp;
            
    async fn handle_update_bar_content(&self, req:UpdateBarContentReq)->UpdateBarContentResp;
            
    async fn handle_update_bar_transform(&self, req:UpdateBarTransformReq)->UpdateBarTransformResp;
            
    async fn handle_redo(&self, req:RedoReq)->RedoResp;
            
    async fn handle_add_path(&self, req:AddPathReq)->AddPathResp;
            
    async fn handle_get_path_info(&self, req:GetPathInfoReq)->GetPathInfoResp;
            
    async fn handle_set_path_info(&self, req:SetPathInfoReq)->SetPathInfoResp;
            
    async fn handle_remove_path(&self, req:RemovePathReq)->RemovePathResp;
            
    async fn handle_delete_bar(&self, req:DeleteBarReq)->DeleteBarResp;
            
    async fn handle_article_binder(&self, req:ArticleBinderReq)->ArticleBinderResp;
            
    async fn handle_article_list(&self, req:ArticleListReq)->ArticleListResp;
            
    async fn handle_fetch_all_note_bars_epoch(&self, req:FetchAllNoteBarsEpochReq)->FetchAllNoteBarsEpochResp;
            
}


pub fn add_routers(mut router:Router)->Router
{
    
    async fn get_note_mata(Json(req):Json<GetNoteMataReq>)-> (StatusCode, Json<Value>){
        (StatusCode::OK, Json(ApiHandlerImpl.handle_get_note_mata(req).await.serialize()))
    }
    router=router
        .route("/get_note_mata", post(get_note_mata));
                             
    async fn get_chunk_note_ids(Json(req):Json<GetChunkNoteIdsReq>)-> (StatusCode, Json<Value>){
        (StatusCode::OK, Json(ApiHandlerImpl.handle_get_chunk_note_ids(req).await.serialize()))
    }
    router=router
        .route("/get_chunk_note_ids", post(get_chunk_note_ids));
                             
    async fn get_note_bar_info(Json(req):Json<GetNoteBarInfoReq>)-> (StatusCode, Json<Value>){
        (StatusCode::OK, Json(ApiHandlerImpl.handle_get_note_bar_info(req).await.serialize()))
    }
    router=router
        .route("/get_note_bar_info", post(get_note_bar_info));
                             
    async fn create_new_bar(Json(req):Json<CreateNewBarReq>)-> (StatusCode, Json<Value>){
        (StatusCode::OK, Json(ApiHandlerImpl.handle_create_new_bar(req).await.serialize()))
    }
    router=router
        .route("/create_new_bar", post(create_new_bar));
                             
    async fn update_bar_content(Json(req):Json<UpdateBarContentReq>)-> (StatusCode, Json<Value>){
        (StatusCode::OK, Json(ApiHandlerImpl.handle_update_bar_content(req).await.serialize()))
    }
    router=router
        .route("/update_bar_content", post(update_bar_content));
                             
    async fn update_bar_transform(Json(req):Json<UpdateBarTransformReq>)-> (StatusCode, Json<Value>){
        (StatusCode::OK, Json(ApiHandlerImpl.handle_update_bar_transform(req).await.serialize()))
    }
    router=router
        .route("/update_bar_transform", post(update_bar_transform));
                             
    async fn redo(Json(req):Json<RedoReq>)-> (StatusCode, Json<Value>){
        (StatusCode::OK, Json(ApiHandlerImpl.handle_redo(req).await.serialize()))
    }
    router=router
        .route("/redo", post(redo));
                             
    async fn add_path(Json(req):Json<AddPathReq>)-> (StatusCode, Json<Value>){
        (StatusCode::OK, Json(ApiHandlerImpl.handle_add_path(req).await.serialize()))
    }
    router=router
        .route("/add_path", post(add_path));
                             
    async fn get_path_info(Json(req):Json<GetPathInfoReq>)-> (StatusCode, Json<Value>){
        (StatusCode::OK, Json(ApiHandlerImpl.handle_get_path_info(req).await.serialize()))
    }
    router=router
        .route("/get_path_info", post(get_path_info));
                             
    async fn set_path_info(Json(req):Json<SetPathInfoReq>)-> (StatusCode, Json<Value>){
        (StatusCode::OK, Json(ApiHandlerImpl.handle_set_path_info(req).await.serialize()))
    }
    router=router
        .route("/set_path_info", post(set_path_info));
                             
    async fn remove_path(Json(req):Json<RemovePathReq>)-> (StatusCode, Json<Value>){
        (StatusCode::OK, Json(ApiHandlerImpl.handle_remove_path(req).await.serialize()))
    }
    router=router
        .route("/remove_path", post(remove_path));
                             
    async fn delete_bar(Json(req):Json<DeleteBarReq>)-> (StatusCode, Json<Value>){
        (StatusCode::OK, Json(ApiHandlerImpl.handle_delete_bar(req).await.serialize()))
    }
    router=router
        .route("/delete_bar", post(delete_bar));
                             
    async fn article_binder(Json(req):Json<ArticleBinderReq>)-> (StatusCode, Json<Value>){
        (StatusCode::OK, Json(ApiHandlerImpl.handle_article_binder(req).await.serialize()))
    }
    router=router
        .route("/article_binder", post(article_binder));
                             
    async fn article_list(Json(req):Json<ArticleListReq>)-> (StatusCode, Json<Value>){
        (StatusCode::OK, Json(ApiHandlerImpl.handle_article_list(req).await.serialize()))
    }
    router=router
        .route("/article_list", post(article_list));
                             
    async fn fetch_all_note_bars_epoch(Json(req):Json<FetchAllNoteBarsEpochReq>)-> (StatusCode, Json<Value>){
        (StatusCode::OK, Json(ApiHandlerImpl.handle_fetch_all_note_bars_epoch(req).await.serialize()))
    }
    router=router
        .route("/fetch_all_note_bars_epoch", post(fetch_all_note_bars_epoch));
                             
    
    router
}
