use crate::note_man::NoteManager;
use crate::server::ToClientSender;
use std::future::Future;
use serde::{Serialize, Deserialize};
use serde_json::{Value};

/*
* 由前端项目中的ts脚本自动生成
*   分发来自前端的数据
*/

[types]
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
        [switches]
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