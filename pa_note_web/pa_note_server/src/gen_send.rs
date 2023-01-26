use crate::gen_distribute;
use crate::server::ToClientSender;
use serde_json::Map;

pub async fn send_get_notes_mata_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::GetNotesMataReply){
    let mut obj=Map::new();
    obj.insert("msg_type".to_string(),serde_json::Value::String("GetNotesMataReply".to_string()));
    obj.insert("msg_value".to_string(),serde_json::to_value(reply).unwrap());
    obj.insert("taskid".to_string(),serde_json::Value::String(taskid));    sender.send(&obj).await;
}
pub async fn send_get_note_mata_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::GetNoteMataReply){
    let mut obj=Map::new();
    obj.insert("msg_type".to_string(),serde_json::Value::String("GetNoteMataReply".to_string()));
    obj.insert("msg_value".to_string(),serde_json::to_value(reply).unwrap());
    obj.insert("taskid".to_string(),serde_json::Value::String(taskid));    sender.send(&obj).await;
}
pub async fn send_get_chunk_note_ids_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::GetChunkNoteIdsReply){
    let mut obj=Map::new();
    obj.insert("msg_type".to_string(),serde_json::Value::String("GetChunkNoteIdsReply".to_string()));
    obj.insert("msg_value".to_string(),serde_json::to_value(reply).unwrap());
    obj.insert("taskid".to_string(),serde_json::Value::String(taskid));    sender.send(&obj).await;
}
pub async fn send_get_note_bar_info_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::GetNoteBarInfoReply){
    let mut obj=Map::new();
    obj.insert("msg_type".to_string(),serde_json::Value::String("GetNoteBarInfoReply".to_string()));
    obj.insert("msg_value".to_string(),serde_json::to_value(reply).unwrap());
    obj.insert("taskid".to_string(),serde_json::Value::String(taskid));    sender.send(&obj).await;
}
pub async fn send_create_new_note_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::CreateNewNoteReply){
    let mut obj=Map::new();
    obj.insert("msg_type".to_string(),serde_json::Value::String("CreateNewNoteReply".to_string()));
    obj.insert("msg_value".to_string(),serde_json::to_value(reply).unwrap());
    obj.insert("taskid".to_string(),serde_json::Value::String(taskid));    sender.send(&obj).await;
}
pub async fn send_rename_note_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::RenameNoteReply){
    let mut obj=Map::new();
    obj.insert("msg_type".to_string(),serde_json::Value::String("RenameNoteReply".to_string()));
    obj.insert("msg_value".to_string(),serde_json::to_value(reply).unwrap());
    obj.insert("taskid".to_string(),serde_json::Value::String(taskid));    sender.send(&obj).await;
}
pub async fn send_create_new_bar_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::CreateNewBarReply){
    let mut obj=Map::new();
    obj.insert("msg_type".to_string(),serde_json::Value::String("CreateNewBarReply".to_string()));
    obj.insert("msg_value".to_string(),serde_json::to_value(reply).unwrap());
    obj.insert("taskid".to_string(),serde_json::Value::String(taskid));    sender.send(&obj).await;
}
pub async fn send_update_bar_content_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::UpdateBarContentReply){
    let mut obj=Map::new();
    obj.insert("msg_type".to_string(),serde_json::Value::String("UpdateBarContentReply".to_string()));
    obj.insert("msg_value".to_string(),serde_json::to_value(reply).unwrap());
    obj.insert("taskid".to_string(),serde_json::Value::String(taskid));    sender.send(&obj).await;
}
pub async fn send_update_bar_transform_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::UpdateBarTransformReply){
    let mut obj=Map::new();
    obj.insert("msg_type".to_string(),serde_json::Value::String("UpdateBarTransformReply".to_string()));
    obj.insert("msg_value".to_string(),serde_json::to_value(reply).unwrap());
    obj.insert("taskid".to_string(),serde_json::Value::String(taskid));    sender.send(&obj).await;
}
pub async fn send_redo_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::RedoReply){
    let mut obj=Map::new();
    obj.insert("msg_type".to_string(),serde_json::Value::String("RedoReply".to_string()));
    obj.insert("msg_value".to_string(),serde_json::to_value(reply).unwrap());
    obj.insert("taskid".to_string(),serde_json::Value::String(taskid));    sender.send(&obj).await;
}
pub async fn send_add_path_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::AddPathReply){
    let mut obj=Map::new();
    obj.insert("msg_type".to_string(),serde_json::Value::String("AddPathReply".to_string()));
    obj.insert("msg_value".to_string(),serde_json::to_value(reply).unwrap());
    obj.insert("taskid".to_string(),serde_json::Value::String(taskid));    sender.send(&obj).await;
}
pub async fn send_get_path_info_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::GetPathInfoReply){
    let mut obj=Map::new();
    obj.insert("msg_type".to_string(),serde_json::Value::String("GetPathInfoReply".to_string()));
    obj.insert("msg_value".to_string(),serde_json::to_value(reply).unwrap());
    obj.insert("taskid".to_string(),serde_json::Value::String(taskid));    sender.send(&obj).await;
}
pub async fn send_set_path_info_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::SetPathInfoReply){
    let mut obj=Map::new();
    obj.insert("msg_type".to_string(),serde_json::Value::String("SetPathInfoReply".to_string()));
    obj.insert("msg_value".to_string(),serde_json::to_value(reply).unwrap());
    obj.insert("taskid".to_string(),serde_json::Value::String(taskid));    sender.send(&obj).await;
}
pub async fn send_remove_path_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::RemovePathReply){
    let mut obj=Map::new();
    obj.insert("msg_type".to_string(),serde_json::Value::String("RemovePathReply".to_string()));
    obj.insert("msg_value".to_string(),serde_json::to_value(reply).unwrap());
    obj.insert("taskid".to_string(),serde_json::Value::String(taskid));    sender.send(&obj).await;
}
pub async fn send_delete_bar_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::DeleteBarReply){
    let mut obj=Map::new();
    obj.insert("msg_type".to_string(),serde_json::Value::String("DeleteBarReply".to_string()));
    obj.insert("msg_value".to_string(),serde_json::to_value(reply).unwrap());
    obj.insert("taskid".to_string(),serde_json::Value::String(taskid));    sender.send(&obj).await;
}
pub async fn send_login_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::LoginReply){
    let mut obj=Map::new();
    obj.insert("msg_type".to_string(),serde_json::Value::String("LoginReply".to_string()));
    obj.insert("msg_value".to_string(),serde_json::to_value(reply).unwrap());
    obj.insert("taskid".to_string(),serde_json::Value::String(taskid));    sender.send(&obj).await;
}
pub async fn send_verify_token_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::VerifyTokenReply){
    let mut obj=Map::new();
    obj.insert("msg_type".to_string(),serde_json::Value::String("VerifyTokenReply".to_string()));
    obj.insert("msg_value".to_string(),serde_json::to_value(reply).unwrap());
    obj.insert("taskid".to_string(),serde_json::Value::String(taskid));    sender.send(&obj).await;
}
pub async fn send_article_binder_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::ArticleBinderReply){
    let mut obj=Map::new();
    obj.insert("msg_type".to_string(),serde_json::Value::String("ArticleBinderReply".to_string()));
    obj.insert("msg_value".to_string(),serde_json::to_value(reply).unwrap());
    obj.insert("taskid".to_string(),serde_json::Value::String(taskid));    sender.send(&obj).await;
}
pub async fn send_article_list_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::ArticleListReply){
    let mut obj=Map::new();
    obj.insert("msg_type".to_string(),serde_json::Value::String("ArticleListReply".to_string()));
    obj.insert("msg_value".to_string(),serde_json::to_value(reply).unwrap());
    obj.insert("taskid".to_string(),serde_json::Value::String(taskid));    sender.send(&obj).await;
}
pub async fn send_fetch_all_note_bars_epoch_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::FetchAllNoteBarsEpochReply){
    let mut obj=Map::new();
    obj.insert("msg_type".to_string(),serde_json::Value::String("FetchAllNoteBarsEpochReply".to_string()));
    obj.insert("msg_value".to_string(),serde_json::to_value(reply).unwrap());
    obj.insert("taskid".to_string(),serde_json::Value::String(taskid));    sender.send(&obj).await;
}


