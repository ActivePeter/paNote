
use serde_json::{json,Value};
use serde::{Serialize, Deserialize};




#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum GetNotesMataResp{
    Succ{
       node_id_name_list:Vec<Vec<String>>,
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
pub struct GetNotesMataReq {}



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
pub struct CreateNewNoteReq {}



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



pub trait ApiHandler {
    
     fn handle_get_notes_mata(&self, req:GetNotesMataReq)->GetNotesMataResp;
            
     fn handle_create_new_note(&self, req:CreateNewNoteReq)->CreateNewNoteResp;
            
     fn handle_rename_note(&self, req:RenameNoteReq)->RenameNoteResp;
            
}

#[no_mangle]
fn get_notes_mata(http_json_ptr: i32, http_json_len: i32) {
    let json_str = unsafe {
        String::from_raw_parts(
            http_json_ptr as *mut u8,
            http_json_len as usize,
            http_json_len as usize,
        )
    };
    if let Ok(req) = serde_json::from_str(&json_str) {
        let resp = super::Impl.handle_get_notes_mata(req).serialize();
        let resp_str = serde_json::to_string(&resp).unwrap();
        unsafe { super::write_result(resp_str.as_ptr(), resp_str.len() as i32) }
    }
}
#[no_mangle]
fn create_new_note(http_json_ptr: i32, http_json_len: i32) {
    let json_str = unsafe {
        String::from_raw_parts(
            http_json_ptr as *mut u8,
            http_json_len as usize,
            http_json_len as usize,
        )
    };
    if let Ok(req) = serde_json::from_str(&json_str) {
        let resp = super::Impl.handle_create_new_note(req).serialize();
        let resp_str = serde_json::to_string(&resp).unwrap();
        unsafe { super::write_result(resp_str.as_ptr(), resp_str.len() as i32) }
    }
}
#[no_mangle]
fn rename_note(http_json_ptr: i32, http_json_len: i32) {
    let json_str = unsafe {
        String::from_raw_parts(
            http_json_ptr as *mut u8,
            http_json_len as usize,
            http_json_len as usize,
        )
    };
    if let Ok(req) = serde_json::from_str(&json_str) {
        let resp = super::Impl.handle_rename_note(req).serialize();
        let resp_str = serde_json::to_string(&resp).unwrap();
        unsafe { super::write_result(resp_str.as_ptr(), resp_str.len() as i32) }
    }
}



