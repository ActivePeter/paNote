use crate::note_man::NoteManager;
use crate::server::ToClientSender;
use std::future::Future;
use serde::{Serialize, Deserialize};
use serde_json::{Value};

/*
* 由前端项目中的ts脚本自动生成
*   分发来自前端的数据
*/

#[derive(Serialize, Deserialize, Debug)]
pub struct GetNotesMataArg{}
#[derive(Serialize, Deserialize, Debug)]
pub struct GetNoteMataArg{pub noteid:String}
#[derive(Serialize, Deserialize, Debug)]
pub struct GetChunkNoteIdsArg{pub noteid:String,
pub chunkx:i32,
pub chunky:i32}
#[derive(Serialize, Deserialize, Debug)]
pub struct GetNoteBarInfoArg{pub noteid:String,
pub notebarid:String}
#[derive(Serialize, Deserialize, Debug)]
pub struct CreateNewNoteArg{}
#[derive(Serialize, Deserialize, Debug)]
pub struct CreateNewBarArg{pub noteid:String,
pub x:f32,
pub y:f32}
#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateBarContentArg{pub noteid:String,
pub barid:String,
pub text:String,
pub formatted:String}
#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateBarTransformArg{pub noteid:String,
pub barid:String,
pub x:f32,
pub y:f32,
pub w:f32,
pub h:f32}
#[derive(Serialize, Deserialize, Debug)]
pub struct RedoArg{pub noteid:String}
#[derive(Serialize, Deserialize, Debug)]
pub struct AddPathArg{pub noteid:String,
pub from:String,
pub to:String}
#[derive(Serialize, Deserialize, Debug)]
pub struct GetPathInfoArg{pub noteid:String,
pub pathid_with_line:String}
#[derive(Serialize, Deserialize, Debug)]
pub struct SetPathInfoArg{pub noteid:String,
pub pathid_with_line:String,
pub type_:i32}
#[derive(Serialize, Deserialize, Debug)]
pub struct RemovePathArg{pub noteid:String,
pub pathid_with_line:String}
#[derive(Serialize, Deserialize, Debug)]
pub struct DeleteBarArg{pub noteid:String,
pub barid:String}
#[derive(Serialize, Deserialize, Debug)]
pub struct LoginArg{pub id:String,
pub pw:String}
#[derive(Serialize, Deserialize, Debug)]
pub struct VerifyTokenArg{pub token:String}
#[derive(Serialize, Deserialize, Debug)]
pub struct ArticleBinderArg{pub bind_unbind_rename:String,
pub article_name:String,
pub barid:String,
pub noteid:String}
#[derive(Serialize, Deserialize, Debug)]
pub struct ArticleListArg{pub noteid:String}
#[derive(Serialize, Deserialize, Debug)]
pub struct GetNotesMataReply{pub node_id_name_list:Vec<serde_json::Value>}
#[derive(Serialize, Deserialize, Debug)]
pub struct GetNoteMataReply{pub next_noteid:i32,
pub max_chunkx:i32,
pub max_chunky:i32,
pub min_chunkx:i32,
pub min_chunky:i32}
#[derive(Serialize, Deserialize, Debug)]
pub struct GetChunkNoteIdsReply{pub noteids:Vec<serde_json::Value>}
#[derive(Serialize, Deserialize, Debug)]
pub struct GetNoteBarInfoReply{pub x:f32,
pub y:f32,
pub w:f32,
pub h:f32,
pub text:String,
pub formatted:String,
pub connected:Vec<serde_json::Value>}
#[derive(Serialize, Deserialize, Debug)]
pub struct CreateNewNoteReply{}
#[derive(Serialize, Deserialize, Debug)]
pub struct CreateNewBarReply{pub chunkx:i32,
pub chunky:i32,
pub noteids:Vec<serde_json::Value>}
#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateBarContentReply{}
#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateBarTransformReply{pub chunk_maxx:i32,
pub chunk_minx:i32,
pub chunk_maxy:i32,
pub chunk_miny:i32,
pub chunk_change:Vec<serde_json::Value>}
#[derive(Serialize, Deserialize, Debug)]
pub struct RedoReply{pub redotype:String,
pub redovalue:serde_json::Map<String,serde_json::Value>}
#[derive(Serialize, Deserialize, Debug)]
pub struct AddPathReply{}
#[derive(Serialize, Deserialize, Debug)]
pub struct GetPathInfoReply{pub type_:i32}
#[derive(Serialize, Deserialize, Debug)]
pub struct SetPathInfoReply{}
#[derive(Serialize, Deserialize, Debug)]
pub struct RemovePathReply{}
#[derive(Serialize, Deserialize, Debug)]
pub struct DeleteBarReply{pub chunk_maxx:i32,
pub chunk_minx:i32,
pub chunk_maxy:i32,
pub chunk_miny:i32}
#[derive(Serialize, Deserialize, Debug)]
pub struct LoginReply{pub if_success:i32,
pub token:String}
#[derive(Serialize, Deserialize, Debug)]
pub struct VerifyTokenReply{pub if_success:i32,
pub new_token:String}
#[derive(Serialize, Deserialize, Debug)]
pub struct ArticleBinderReply{pub if_success:i32}
#[derive(Serialize, Deserialize, Debug)]
pub struct ArticleListReply{pub if_success:i32,
pub list:Vec<serde_json::Value>}
pub trait ApiHandler{

    type GetNotesMataFuture: Future<Output=()>;
    fn api_get_notes_mata(&self,arg:GetNotesMataArg,taskid:String,sender:ToClientSender)->Self::GetNotesMataFuture;

    type GetNoteMataFuture: Future<Output=()>;
    fn api_get_note_mata(&self,arg:GetNoteMataArg,taskid:String,sender:ToClientSender)->Self::GetNoteMataFuture;

    type GetChunkNoteIdsFuture: Future<Output=()>;
    fn api_get_chunk_note_ids(&self,arg:GetChunkNoteIdsArg,taskid:String,sender:ToClientSender)->Self::GetChunkNoteIdsFuture;

    type GetNoteBarInfoFuture: Future<Output=()>;
    fn api_get_note_bar_info(&self,arg:GetNoteBarInfoArg,taskid:String,sender:ToClientSender)->Self::GetNoteBarInfoFuture;

    type CreateNewNoteFuture: Future<Output=()>;
    fn api_create_new_note(&self,arg:CreateNewNoteArg,taskid:String,sender:ToClientSender)->Self::CreateNewNoteFuture;

    type CreateNewBarFuture: Future<Output=()>;
    fn api_create_new_bar(&self,arg:CreateNewBarArg,taskid:String,sender:ToClientSender)->Self::CreateNewBarFuture;

    type UpdateBarContentFuture: Future<Output=()>;
    fn api_update_bar_content(&self,arg:UpdateBarContentArg,taskid:String,sender:ToClientSender)->Self::UpdateBarContentFuture;

    type UpdateBarTransformFuture: Future<Output=()>;
    fn api_update_bar_transform(&self,arg:UpdateBarTransformArg,taskid:String,sender:ToClientSender)->Self::UpdateBarTransformFuture;

    type RedoFuture: Future<Output=()>;
    fn api_redo(&self,arg:RedoArg,taskid:String,sender:ToClientSender)->Self::RedoFuture;

    type AddPathFuture: Future<Output=()>;
    fn api_add_path(&self,arg:AddPathArg,taskid:String,sender:ToClientSender)->Self::AddPathFuture;

    type GetPathInfoFuture: Future<Output=()>;
    fn api_get_path_info(&self,arg:GetPathInfoArg,taskid:String,sender:ToClientSender)->Self::GetPathInfoFuture;

    type SetPathInfoFuture: Future<Output=()>;
    fn api_set_path_info(&self,arg:SetPathInfoArg,taskid:String,sender:ToClientSender)->Self::SetPathInfoFuture;

    type RemovePathFuture: Future<Output=()>;
    fn api_remove_path(&self,arg:RemovePathArg,taskid:String,sender:ToClientSender)->Self::RemovePathFuture;

    type DeleteBarFuture: Future<Output=()>;
    fn api_delete_bar(&self,arg:DeleteBarArg,taskid:String,sender:ToClientSender)->Self::DeleteBarFuture;

    type LoginFuture: Future<Output=()>;
    fn api_login(&self,arg:LoginArg,taskid:String,sender:ToClientSender)->Self::LoginFuture;

    type VerifyTokenFuture: Future<Output=()>;
    fn api_verify_token(&self,arg:VerifyTokenArg,taskid:String,sender:ToClientSender)->Self::VerifyTokenFuture;

    type ArticleBinderFuture: Future<Output=()>;
    fn api_article_binder(&self,arg:ArticleBinderArg,taskid:String,sender:ToClientSender)->Self::ArticleBinderFuture;

    type ArticleListFuture: Future<Output=()>;
    fn api_article_list(&self,arg:ArticleListArg,taskid:String,sender:ToClientSender)->Self::ArticleListFuture;

}


fn get_obj_and_taskid(mut msg_value: serde_json::Value) -> (Value, String) {
    let taskid = msg_value.as_object().unwrap_or(&serde_json::Map::new()).get("taskid")
        .unwrap_or(&serde_json::Value::Null).as_str().unwrap_or("").to_string();

    let mut objvalue = serde_json::Value::Null;
    std::mem::swap(&mut objvalue, msg_value.as_object_mut()
        .unwrap_or(&mut serde_json::Map::new()).get_mut("msg_value").unwrap_or(&mut serde_json::Value::Null));

    return (objvalue, taskid);
}
pub async fn distribute(msg_type:&str,msg_value:serde_json::Value,mut sender:ToClientSender){
    match msg_type{
        "MsgGetNotesMata"=>{
let (value,taskid)=get_obj_and_taskid(msg_value);            let arg=serde_json::from_value::<GetNotesMataArg>(value);
            if let Ok(arg)=arg{
                 NoteManager::get().api_get_notes_mata(
                     arg,taskid,sender
                 ).await;
            }
}

"MsgGetNoteMata"=>{
let (value,taskid)=get_obj_and_taskid(msg_value);            let arg=serde_json::from_value::<GetNoteMataArg>(value);
            if let Ok(arg)=arg{
                 NoteManager::get().api_get_note_mata(
                     arg,taskid,sender
                 ).await;
            }
}

"MsgGetChunkNoteIds"=>{
let (value,taskid)=get_obj_and_taskid(msg_value);            let arg=serde_json::from_value::<GetChunkNoteIdsArg>(value);
            if let Ok(arg)=arg{
                 NoteManager::get().api_get_chunk_note_ids(
                     arg,taskid,sender
                 ).await;
            }
}

"MsgGetNoteBarInfo"=>{
let (value,taskid)=get_obj_and_taskid(msg_value);            let arg=serde_json::from_value::<GetNoteBarInfoArg>(value);
            if let Ok(arg)=arg{
                 NoteManager::get().api_get_note_bar_info(
                     arg,taskid,sender
                 ).await;
            }
}

"MsgCreateNewNote"=>{
let (value,taskid)=get_obj_and_taskid(msg_value);            let arg=serde_json::from_value::<CreateNewNoteArg>(value);
            if let Ok(arg)=arg{
                 NoteManager::get().api_create_new_note(
                     arg,taskid,sender
                 ).await;
            }
}

"MsgCreateNewBar"=>{
let (value,taskid)=get_obj_and_taskid(msg_value);            let arg=serde_json::from_value::<CreateNewBarArg>(value);
            if let Ok(arg)=arg{
                 NoteManager::get().api_create_new_bar(
                     arg,taskid,sender
                 ).await;
            }
}

"MsgUpdateBarContent"=>{
let (value,taskid)=get_obj_and_taskid(msg_value);            let arg=serde_json::from_value::<UpdateBarContentArg>(value);
            if let Ok(arg)=arg{
                 NoteManager::get().api_update_bar_content(
                     arg,taskid,sender
                 ).await;
            }
}

"MsgUpdateBarTransform"=>{
let (value,taskid)=get_obj_and_taskid(msg_value);            let arg=serde_json::from_value::<UpdateBarTransformArg>(value);
            if let Ok(arg)=arg{
                 NoteManager::get().api_update_bar_transform(
                     arg,taskid,sender
                 ).await;
            }
}

"MsgRedo"=>{
let (value,taskid)=get_obj_and_taskid(msg_value);            let arg=serde_json::from_value::<RedoArg>(value);
            if let Ok(arg)=arg{
                 NoteManager::get().api_redo(
                     arg,taskid,sender
                 ).await;
            }
}

"MsgAddPath"=>{
let (value,taskid)=get_obj_and_taskid(msg_value);            let arg=serde_json::from_value::<AddPathArg>(value);
            if let Ok(arg)=arg{
                 NoteManager::get().api_add_path(
                     arg,taskid,sender
                 ).await;
            }
}

"MsgGetPathInfo"=>{
let (value,taskid)=get_obj_and_taskid(msg_value);            let arg=serde_json::from_value::<GetPathInfoArg>(value);
            if let Ok(arg)=arg{
                 NoteManager::get().api_get_path_info(
                     arg,taskid,sender
                 ).await;
            }
}

"MsgSetPathInfo"=>{
let (value,taskid)=get_obj_and_taskid(msg_value);            let arg=serde_json::from_value::<SetPathInfoArg>(value);
            if let Ok(arg)=arg{
                 NoteManager::get().api_set_path_info(
                     arg,taskid,sender
                 ).await;
            }
}

"MsgRemovePath"=>{
let (value,taskid)=get_obj_and_taskid(msg_value);            let arg=serde_json::from_value::<RemovePathArg>(value);
            if let Ok(arg)=arg{
                 NoteManager::get().api_remove_path(
                     arg,taskid,sender
                 ).await;
            }
}

"MsgDeleteBar"=>{
let (value,taskid)=get_obj_and_taskid(msg_value);            let arg=serde_json::from_value::<DeleteBarArg>(value);
            if let Ok(arg)=arg{
                 NoteManager::get().api_delete_bar(
                     arg,taskid,sender
                 ).await;
            }
}

"MsgLogin"=>{
let (value,taskid)=get_obj_and_taskid(msg_value);            let arg=serde_json::from_value::<LoginArg>(value);
            if let Ok(arg)=arg{
                 NoteManager::get().api_login(
                     arg,taskid,sender
                 ).await;
            }
}

"MsgVerifyToken"=>{
let (value,taskid)=get_obj_and_taskid(msg_value);            let arg=serde_json::from_value::<VerifyTokenArg>(value);
            if let Ok(arg)=arg{
                 NoteManager::get().api_verify_token(
                     arg,taskid,sender
                 ).await;
            }
}

"MsgArticleBinder"=>{
let (value,taskid)=get_obj_and_taskid(msg_value);            let arg=serde_json::from_value::<ArticleBinderArg>(value);
            if let Ok(arg)=arg{
                 NoteManager::get().api_article_binder(
                     arg,taskid,sender
                 ).await;
            }
}

"MsgArticleList"=>{
let (value,taskid)=get_obj_and_taskid(msg_value);            let arg=serde_json::from_value::<ArticleListArg>(value);
            if let Ok(arg)=arg{
                 NoteManager::get().api_article_list(
                     arg,taskid,sender
                 ).await;
            }
}


        // MSG_GET_NOTES_META=>{
        //     sender.send(&NoteManager::get().api_get_notes_mata().await);
        // }
        // MSG_GET_NOTE_META=>{
        //     let arg=serde_json::from_value::<ApiGetNoteMetaArg>(msg_value);
        //     if let Ok(arg)=arg{
        //         sender.send(&NoteManager::get().get_note_meta(
        //             arg
        //         ).await);
        //     }
        // }
        // MSG_GET_CHUNK_NOTEIDS=>{
        //     let arg=serde_json::from_value::<ApiGetChunkNoteIdsArg>(msg_value);
        //     if let Ok(arg)=arg{
        //         sender.send(&NoteManager::get().api_get_note_chunk_info(arg).await);
        //     }
        // }
        // MSG_GET_NOTEBAR_INFO=>{
        //     let arg=serde_json::from_value::<ApiGetNoteBarInfoArg>(msg_value);
        //     if let Ok(arg)=arg{
        //         sender.send(&NoteManager::get().api_get_notebar_info(arg).await);
        //     }
        // }
        _=>{}
    }
}