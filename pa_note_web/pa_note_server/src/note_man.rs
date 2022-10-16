use tokio::fs::File;
use tokio::io::AsyncReadExt;
use tokio::sync::RwLock;
use std::ops::DerefMut;
use std::collections::{HashSet, HashMap};
use serde_json::{Deserializer, Serializer, Value};
// use crate::server::{ApiGetNoteBarInfoArg, ApiGetChunkNoteIdsArg, ApiGetNoteMetaArg};
use std::future::Future;
use pakv_kernel::PaKVCtx;
use serde::{Serialize, Deserialize};

use crate::server::ToClientSender;
use crate::gen_distribute::{ApiHandler, GetNoteMataArg, GetChunkNoteIdsArg, GetNoteBarInfoArg, GetNotesMataArg, GetNotesMataReply, CreateNewNoteArg, CreateNewNoteReply, GetNoteMataReply, GetChunkNoteIdsReply, CreateNewBarArg, GetNoteBarInfoReply, CreateNewBarReply, UpdateBarContentArg, UpdateBarTransformArg, RedoArg, UpdateBarTransformReply, UpdateBarContentReply, AddPathArg, AddPathReply, DeleteBarArg, DeleteBarReply, GetPathInfoArg, SetPathInfoArg, GetPathInfoReply, SetPathInfoReply, RemovePathArg, RemovePathReply, LoginArg, VerifyTokenArg, LoginReply, VerifyTokenReply};
use crate::gen_send;
use crate::gen_distribute;
use crate::authority::AuthorityMan;

lazy_static::lazy_static! {
    pub static ref G_NOTE_MAN : NoteManager = NoteManager::new();
}

const CHUNK_W:i32=300;
const CHUNK_H:i32=400;

enum NoteLog{

}
#[derive(Serialize,Deserialize)]
struct ChunkNoteIds{
    pub noteids:Vec<String>
}
impl ChunkNoteIds{
    pub fn collect_vec_value(&self) -> Vec<Value> {
        let mut vec=Vec::new();
        vec.reserve(self.noteids.len());
        for v in &self.noteids{
            vec.push(Value::String(v.clone()));
        }
        vec
    }
    pub fn create_from_vec_value(mut vec_value:Vec<Value>) -> ChunkNoteIds {
        let mut vec=Vec::new();
        vec.reserve(vec_value.len());
        for v in &mut vec_value{
            // let mut s=String::new();
            // std::mem::swap(&mut s,)
            vec.push(String::from(v.as_str().unwrap()))
        }
        ChunkNoteIds{
            noteids:vec
        }
    }
}

struct NoteManagerLocked{
    opened_notes:HashMap<String,NoteInfo>
}
impl NoteManagerLocked{
    pub fn create() -> NoteManagerLocked {
        NoteManagerLocked{
            opened_notes: Default::default(),
        }
    }
    pub fn get_note_info(&mut self, connid:i32, noteid:&str) -> &mut NoteInfo {
        self.opened_notes.entry(noteid.to_string()).or_insert(NoteInfo::create(connid))
    }
}

// enum PathType{
//     Solid,
//     Dashed,
//     // dotted,
//
// }
// impl PathType{
//     pub fn from_i32(i:i32) -> PathType {
//         match i{
//             0=>PathType::Solid,
//             1=>PathType::Dashed,
//             _=>PathType::Solid,
//         }
//     }
//     pub fn to_i32(&self)->i32{
//         match self{
//             PathType::Solid => 0,
//             PathType::Dashed => 1
//         }
//     }
// }

#[derive(Serialize,Deserialize)]
struct PathInfo{
    pathtype:i32
}

struct NoteInfo{
    holding_connections:HashSet<i32>,//为空时从hashmap移除
    chunkmap:HashMap<String,ChunkNoteIds>//chunk noteids
}
impl NoteInfo{
    pub fn create(connid:i32) -> NoteInfo {
        let mut ret=NoteInfo{
            holding_connections: HashSet::new(),
            chunkmap: Default::default()
        };
        ret.holding_connections.insert(connid);
        ret
    }
    pub fn get_chunk_noteids_mut(&mut self, chunkid:&str) -> Option<&mut ChunkNoteIds> {
        self.chunkmap.get_mut(chunkid)
    }
    pub fn get_chunk_noteids(&self, chunkid:&str) -> Option<&ChunkNoteIds> {
        self.chunkmap.get(chunkid)
    }

    pub fn set_chunk_noteids(&mut self,chunkid:&str, noteids:Vec<Value>){
        self.chunkmap.insert(chunkid.to_string(),ChunkNoteIds::create_from_vec_value(noteids));
    }
}

mod note_bar_info_funcs{
    use crate::gen_distribute::GetNoteBarInfoReply;

    pub fn remove_path_in_info(pathid:&str, info:&mut GetNoteBarInfoReply){
        info.connected.retain(|s|{
            s.as_str().unwrap()!=pathid
        })
    }
}

pub struct NoteManager{
    root_name :String,
    kernel:PaKVCtx,
    locked_data:parking_lot::RwLock<NoteManagerLocked>
}

impl NoteManager{
    pub fn get() -> &'static NoteManager {
        return &G_NOTE_MAN;
    }

    pub fn new() -> NoteManager {
        NoteManager{
            root_name:"panote".to_string(),
            // note: RwLock::new(serde_json::Value::Null)
            kernel: PaKVCtx::create(),
            locked_data: parking_lot::RwLock::new(NoteManagerLocked::create())
        }
    }

    pub fn connection_end(&self,connid:i32){
        let mut hold=self.locked_data.write();

        hold.opened_notes.retain(|k,v|{
            v.holding_connections.remove(&connid);
            return v.holding_connections.len()!=0 //==0 就移除
        });
    }

    pub fn set_notelist(&self,list:Vec<Value>){
        self.kernel.set("notes_meta".to_string(),serde_json::to_string(&list).unwrap());
    }
    pub fn get_note_list(&self) -> Vec<Value> {
        let s=self.kernel.get("notes_meta".to_string());
        let mut node_id_name_list:Vec<serde_json::Value>=Vec::new();
        if s.is_none(){
            self.kernel.set("notes_meta".to_string(),serde_json::to_string(&node_id_name_list).unwrap());
        }else if let Some(s)=s{
            // println!("saved data {}",s);
            node_id_name_list=serde_json::from_str(&*s).unwrap();
        }
        node_id_name_list
    }

    pub fn set_note_meta(&self,noteid:&str,meta:&GetNoteMataReply){
        self.kernel.set(format!("{}|meta",noteid),serde_json::to_string(meta).unwrap());
    }
    pub fn get_note_meta(&self,noteid:&str)->gen_distribute::GetNoteMataReply{
        let s=self.kernel.get(format!("{}|meta",noteid));
        match s{
            None => {
                let ret=GetNoteMataReply{
                    next_noteid: 0,
                    max_chunkx: 0,
                    max_chunky: 0,
                    min_chunkx: 0,
                    min_chunky: 0
                };
                self.kernel.set(format!("{}|meta",noteid),serde_json::to_string(&ret).unwrap());
                ret
            }
            Some(s) => {
                serde_json::from_str::<GetNoteMataReply>(&s).unwrap()
            }
        }
    }

    pub fn get_note_chunk_ids(&self,connid:i32,arg:GetChunkNoteIdsArg) -> GetChunkNoteIdsReply {
        let chunkid=self.chunkpos_to_chunkid(arg.chunkx, arg.chunky);
        {//try read from mem
            let mut hold = self.locked_data.write();
            let noteinfo = hold.get_note_info(connid, &*arg.noteid);
            if let Some(v) = noteinfo.get_chunk_noteids(&*chunkid) {
                return GetChunkNoteIdsReply {
                    noteids: v.collect_vec_value()
                };
            }
        }

        //mem no, load from kv
        let key=format!("{}|chunk|{}|{}",arg.noteid,arg.chunkx,arg.chunky);
        let s=self.kernel.get(key.clone());

        let kvres= match s{
            None => {
                let ret=GetChunkNoteIdsReply{
                    noteids:Vec::new()
                };
                self.kernel.set(key,serde_json::to_string(&ret).unwrap());
                ret
            }
            Some(s) => {
                serde_json::from_str::<GetChunkNoteIdsReply>(&s).unwrap()
            }
        };
        //save to mem store
        {
            let mut hold = self.locked_data.write();
            let noteinfo = hold.get_note_info(connid, &*arg.noteid);
            noteinfo.set_chunk_noteids(&*chunkid,kvres.noteids.clone());
        }
        return kvres;
    }

    pub fn set_note_chunk_ids(&self,connid:i32,noteid:&str,cx:i32,cy:i32,ids:&GetChunkNoteIdsReply){
        let chunkid=self.chunkpos_to_chunkid(cx, cy);
        {//mem
            let mut hold = self.locked_data.write();
            let noteinfo = hold.get_note_info(connid, noteid);
            noteinfo.set_chunk_noteids(&*chunkid,ids.noteids.clone());
        }
        //kv
        let key=format!("{}|chunk|{}|{}",noteid,cx,cy);
        self.kernel.set(key,serde_json::to_string(ids).unwrap());
    }
    pub fn note_pos_to_chunkpos(&self, x:f32,y:f32)->(i32,i32){
        (if(x>0.0){
            x as i32/CHUNK_W
        }else{
            x as i32/CHUNK_W-1
        },if(y>0.0){
            y as i32/CHUNK_H
        }else{
            y as i32/CHUNK_H-1
        })
    }
    pub fn chunkpos_to_chunkid(&self, x:i32, y:i32) -> String {
        format!("{}_{}",x,y)
    }

    //return if range changed
    pub fn fitup_chunk_range_in_notemeta_for_newck(&self, ckx:i32, cky:i32, meta_:&mut GetNoteMataReply) -> bool {
        let mut changed=false;
        if meta_.max_chunkx<ckx{
            meta_.max_chunkx=ckx;
            changed=true;
        }else if meta_.min_chunkx>ckx{
            meta_.min_chunkx=ckx;
            changed=true;
        }
        if meta_.max_chunky<cky{
            meta_.max_chunky=cky;
            changed=true;
        }else if meta_.min_chunky>cky{
            meta_.min_chunky=cky;
            changed=true;
        }

        changed
    }
    pub fn fitdown_chunk_range_in_notemeta_if_ck_is_on_edge(&self, noteid:&str, connid:i32, ckx:i32, cky:i32, meta_:&mut GetNoteMataReply) -> bool {
        fn y_empty(man:&NoteManager,x:i32, meta_:&GetNoteMataReply,noteid:&str,connid:i32)->bool{
            let mut line_empty=true;
            for y in meta_.min_chunky..meta_.max_chunky+1{
                if man.get_note_chunk_ids(connid,GetChunkNoteIdsArg{
                    noteid: noteid.to_string(),
                    chunkx: x,
                    chunky: y
                }).noteids.len()!=0 {//如果有非空的chunk
                    line_empty=false;
                    break;
                }
            }
            line_empty
        };
        fn x_empty(man:&NoteManager,y:i32, meta_:&GetNoteMataReply,noteid:&str,connid:i32)->bool{
            let mut line_empty=true;
            for x in meta_.min_chunkx..meta_.max_chunkx+1{
                if man.get_note_chunk_ids(connid,GetChunkNoteIdsArg{
                    noteid: noteid.to_string(),
                    chunkx: x,
                    chunky: y
                }).noteids.len()!=0 {//如果有非空的chunk
                    line_empty=false;
                    break;
                }
            }
            line_empty
        };
        let mut changed=false;
        if ckx==meta_.max_chunkx{
            let mut new_max_chunkx=meta_.max_chunkx;
            //从大到小压缩
            for x in (1..meta_.max_chunkx+1).rev(){
                if y_empty(self,x,meta_,noteid,connid){
                    new_max_chunkx=x-1;
                }else{
                    break;
                }
            }
            if meta_.max_chunkx!=new_max_chunkx{
                changed=true;
            }
            meta_.max_chunkx=new_max_chunkx;
        }else if ckx==meta_.min_chunkx{
            let mut new_min_chunkx=meta_.min_chunkx;
            //从xiao到大压缩
            for x in meta_.min_chunkx..0{
                if y_empty(self,x,meta_,noteid,connid){
                    new_min_chunkx=x+1;
                }else{
                    break;
                }
            }
            if meta_.min_chunkx!=new_min_chunkx{
                changed=true
            }
            meta_.min_chunkx=new_min_chunkx;
        }
        if cky==meta_.max_chunky{
            let mut new_max_chunky=meta_.max_chunky;
            //从大到小压缩
            for y in (1..meta_.max_chunky+1).rev(){
                if x_empty(self,y,meta_,noteid,connid){
                    new_max_chunky=y-1;
                }else{
                    break;
                }
            }
            if meta_.max_chunky!=new_max_chunky{
                changed=true;
            }
            meta_.max_chunky=new_max_chunky;
        }else if cky==meta_.min_chunky{
            let mut new_min_chunky=meta_.min_chunky;
            //从xiao到大压缩
            for y in meta_.min_chunky..0{
                if x_empty(self,y,meta_,noteid,connid){
                    new_min_chunky=y+1;
                }else{
                    break;
                }
            }
            if meta_.min_chunky!=new_min_chunky{
                changed=true;
            }
            meta_.min_chunky=new_min_chunky;
        }
        changed
    }

    pub fn create_notebar(&self,connid:i32,x:f32,y:f32,noteid:String)->(GetNoteBarInfoReply,(i32,i32)){
        //1.读取元数据
        let mut meta =self.get_note_meta(&*noteid);
        let next=meta.next_noteid;
        meta.next_noteid+=1;
        let ret={//notebar 信息
            let ret = GetNoteBarInfoReply {
                x,
                y,
                w: 150.0,
                h: 150.0,
                text: "".to_string(),
                formatted: "".to_string(),
                connected: vec![],
            };//保存笔记信息
            let key = format!("{}|bar|{}", noteid, next);
            self.kernel.set(key,
                            serde_json::to_string(&ret).unwrap());
            ret
        };

        let (cx, cy) = self.note_pos_to_chunkpos(x, y);
        {// chunk ids 信息
            let mut chunk_noteids = self.get_note_chunk_ids(connid,GetChunkNoteIdsArg {
                noteid: noteid.clone(),
                chunkx: cx,
                chunky: cy,
            });
            chunk_noteids.noteids.push(Value::String(next.to_string()));
            self.set_note_chunk_ids(connid,&noteid,cx,cy,&chunk_noteids);
        }

        //meta fit 一下chunk
        self.fitup_chunk_range_in_notemeta_for_newck(cx,cy, &mut meta);
        self.set_note_meta(&*noteid,&meta);

        (ret,(cx,cy))
    }
    pub fn set_notebar_info(&self,noteid:&str,barid:&str,newinfo:&GetNoteBarInfoReply){
        let key=format!("{}|bar|{}",noteid,barid);
        // println!("get_notebar_info {}",key);
        self.kernel.set(key,serde_json::to_string(newinfo).unwrap() );
    }
    pub fn get_notebar_info(&self,noteid:String,barid:String)->Option<GetNoteBarInfoReply>{
        let key=format!("{}|bar|{}",noteid,barid);
        println!("get_notebar_info {}",key);
        let s=self.kernel.get(key.clone());
        //create if not exist
        match s{
            None => {
                None
            }
            Some(s) => {
                Some(serde_json::from_str::<GetNoteBarInfoReply>(&s).unwrap())
            }
        }
    }
    //变化完后需要检查是否发生收缩，
    // return 区块范围
    pub fn change_notebar_chunk(&self, connid:i32, noteid:&str, barid:&str, ck1:(i32,i32), ck2:(i32,i32)) -> GetNoteMataReply {
        //改变两个chunk中的noteids
        //chunk1中移除
        let mut ck1data =self.get_note_chunk_ids(connid,GetChunkNoteIdsArg{
            noteid: noteid.to_string(),
            chunkx: ck1.0,
            chunky: ck1.1
        });
        let mut found= ck1data.noteids.len();
        for i in 0..ck1data.noteids.len(){
            if ck1data.noteids[i]==barid{
                found=i
            }
        }
        ck1data.noteids.remove(found);

        //chunk2中放入
        let mut ck2data=self.get_note_chunk_ids(connid,GetChunkNoteIdsArg{
            noteid:noteid.to_string(),
            chunkx:ck2.0,
            chunky:ck2.1,
        });
        ck2data.noteids.push(serde_json::Value::String(barid.to_string()));
        self.set_note_chunk_ids(connid,noteid,ck1.0,ck1.1,&ck1data);
        self.set_note_chunk_ids(connid,noteid,ck2.0,ck2.1,&ck2data);

        let mut meta=self.get_note_meta(noteid);
        let mut range_changed=self.fitup_chunk_range_in_notemeta_for_newck(ck2.0,ck2.1,&mut meta);
        range_changed=self.fitdown_chunk_range_in_notemeta_if_ck_is_on_edge(noteid,connid,ck1.0,ck1.1,&mut meta)||range_changed;
        if range_changed{
            self.set_note_meta(noteid,&meta);
        }
        meta
    }

    pub fn add_path(&self,noteid:&str,ebid1:&str,ebid2:&str){
        if let (Some(mut n1),Some(mut n2))=
            (self.get_notebar_info(noteid.to_string(), ebid1.to_string()),
             self.get_notebar_info(noteid.to_string(),ebid2.to_string())){
            // todo 
            //  检查是否已经有path
            n1.connected.push(Value::String(format!("{}_{}",ebid1,ebid2)));
            n2.connected.push(Value::String(format!("{}_{}",ebid1,ebid2)));
            self.set_notebar_info(noteid,ebid1,&n1);
            self.set_notebar_info(noteid,ebid2,&n2);
            self.set_note_path_info(noteid, &*format!("{}_{}", ebid1, ebid2), &PathInfo { pathtype: 0 });
            // let v1=Value::String()
            // n1.connected.binary_search(&)
        }else{
            eprintln!("error, add path ebid not found")
        }
    }
    fn get_note_path_info(&self,noteid:&str,pathid:&str)->Option<PathInfo>{
        let key=format!("{}|path|{}",noteid,pathid);
        let s=self.kernel.get(key);
        match s{
            None => None,
            Some(s) => {
                Some(serde_json::from_str(&*s).unwrap())
            }
        }
    }
    fn set_note_path_info(&self,noteid:&str,pathid:&str,info:&PathInfo){
        let key=format!("{}|path|{}",noteid,pathid);
        self.kernel.set(key,serde_json::to_string(info).unwrap());
    }
    pub fn remove_note_path_info(&self,noteid:&str,pathid:&str){
        let key=format!("{}|path|{}",noteid,pathid);
        self.kernel.del(key);
    }
    pub fn delete_bar(&self, connid:i32, noteid:&str, ebid:&str) -> GetNoteMataReply {
        let mut meta=self.get_note_meta(noteid);
        if let Some(mut n1)=self.get_notebar_info(noteid.to_string(), ebid.to_string()){
            let(cx,cy)=self.note_pos_to_chunkpos(n1.x,n1.y);
            let mut ck=self.get_note_chunk_ids(connid,GetChunkNoteIdsArg{
                noteid: noteid.to_string(),
                chunkx: cx,
                chunky: cy
            });
            //1.chunk 移除 bar
            ck.noteids.retain(|v|{
                v.as_str().unwrap()!=ebid
            });
            self.set_note_chunk_ids(connid,noteid,cx,cy,&ck);
            //2.相连bar 移除
            for v in &n1.connected{
                let mut sp=v.as_str().unwrap().split("_");
                let mut a=sp.next().unwrap().to_string();
                let mut b=sp.next().unwrap().to_string();
                if b==ebid{
                    std::mem::swap(&mut a,&mut b);
                }
                let mut notebar =self.get_notebar_info(noteid.to_string(), b.clone()).unwrap();
                notebar.connected.retain(|v1|{
                    v1.as_str().unwrap()!=v.as_str().unwrap()
                });
                self.set_notebar_info(noteid,&*b,&notebar);
                self.remove_note_path_info(noteid,v.as_str().unwrap());
            }

            if self.fitdown_chunk_range_in_notemeta_if_ck_is_on_edge(noteid,connid,cx,cy,&mut meta){
                self.set_note_meta(noteid,&meta);
            }

        }else{
            eprintln!("error, delete bar ebid not found")
        }

        meta
    }
}

impl ApiHandler for NoteManager{
    type GetNotesMataFuture = impl Future<Output=()>;

    fn api_get_notes_mata(&self, arg: GetNotesMataArg, taskid: String, sender: ToClientSender) -> Self::GetNotesMataFuture {
        let mut node_id_name_list=self.get_note_list();
        async move{
            gen_send::send_get_notes_mata_reply(sender,taskid,GetNotesMataReply{
                node_id_name_list
            }).await;
            ()
        }
    }


    type GetNoteMataFuture = impl Future<Output=()>;

    fn api_get_note_mata(&self, arg: GetNoteMataArg, taskid: String, sender: ToClientSender) -> Self::GetNoteMataFuture {
        let ret=self.get_note_meta(&*arg.noteid);
        async move{
            gen_send::send_get_note_mata_reply(sender,taskid,ret).await;
            ()
        }
    }


    type GetChunkNoteIdsFuture = impl Future<Output=()>;

    fn api_get_chunk_note_ids(&self, arg: GetChunkNoteIdsArg, taskid: String, sender: ToClientSender) -> Self::GetChunkNoteIdsFuture {
        let (x,y)=(arg.chunkx,arg.chunky);
        let ret=self.get_note_chunk_ids(sender.get_connid(),arg);
        if ret.noteids.len()>0{
            println!(" chunk {},{} ids {}",x,y, Value::Array(ret.noteids.clone()))
        }
        async move{
            gen_send::send_get_chunk_note_ids_reply(sender,taskid,ret).await;
            ()
        }
    }


    type GetNoteBarInfoFuture = impl Future<Output=()>;

    fn api_get_note_bar_info(&self, arg: GetNoteBarInfoArg, taskid: String, sender: ToClientSender) -> Self::GetNoteBarInfoFuture {
        let ans=self.get_notebar_info(arg.noteid,arg.notebarid).unwrap();
        async move{
            gen_send::send_get_note_bar_info_reply(sender,taskid,ans).await;
            ()
        }
    }

    type CreateNewNoteFuture = impl Future<Output=()>;

    fn api_create_new_note(&self, arg: CreateNewNoteArg, taskid: String, sender: ToClientSender) -> Self::CreateNewNoteFuture {
        let mut nl=self.get_note_list();
        let mut one_id_to_name=Vec::new();
        one_id_to_name.reserve(2);
        one_id_to_name.push(Value::String(nl.len().to_string()));
        one_id_to_name.push(Value::String("新的笔记".to_string()));
        nl.push(Value::Array(one_id_to_name));
        self.set_notelist(nl);
        async move{
            gen_send::send_create_new_note_reply(sender,taskid,CreateNewNoteReply{}).await;

            ()
        }
    }

    type CreateNewBarFuture = impl Future<Output=()>;

    fn api_create_new_bar(&self, arg: CreateNewBarArg, taskid: String, sender: ToClientSender) -> Self::CreateNewBarFuture {
        let (_created,(cx,cy))=self.create_notebar(sender.get_connid(),arg.x,arg.y,arg.noteid.clone());
        let ck_noteids=self.get_note_chunk_ids(sender.get_connid(),GetChunkNoteIdsArg{
            noteid: arg.noteid,
            chunkx: cx,
            chunky: cy
        });
        async move{
            gen_send::send_create_new_bar_reply(sender,taskid,CreateNewBarReply{
                chunkx: cx,
                chunky: cy,
                noteids: ck_noteids.noteids
            }).await;
            ()
        }
    }

    type UpdateBarContentFuture = impl Future<Output=()>;

    fn api_update_bar_content(&self, arg: UpdateBarContentArg, taskid: String, sender: ToClientSender) -> Self::UpdateBarContentFuture {
        // todo!()
        let mut nb=self.get_notebar_info(arg.noteid.clone(),arg.barid.clone()).unwrap();
        nb.formatted=arg.formatted;
        nb.text=arg.text;
        self.set_notebar_info(&*(arg.noteid),&*(arg.barid),&nb);
        async move{
            gen_send::send_update_bar_content_reply(sender,taskid,UpdateBarContentReply{}).await;
            ()
        }
    }

    type UpdateBarTransformFuture = impl Future<Output=()>;

    fn api_update_bar_transform(&self, arg: UpdateBarTransformArg, taskid: String, sender: ToClientSender) -> Self::UpdateBarTransformFuture {
        let mut nb=self.get_notebar_info(arg.noteid.clone(),arg.barid.clone()).unwrap();
        let (oldcx,oldcy)=self.note_pos_to_chunkpos(nb.x,nb.y);
        let (newcx,newcy)=self.note_pos_to_chunkpos(arg.x,arg.y);
        let (chunk_change,meta)=if oldcx!=newcx||oldcy!=newcy{
            let meta=self.change_notebar_chunk(sender.get_connid(),&*(arg.noteid),&*(arg.barid),(oldcx,oldcy),(newcx,newcy));//变更区块下的信息
            (vec![Value::String(self.chunkpos_to_chunkid(oldcx,oldcy)),Value::String(self.chunkpos_to_chunkid(newcx,newcy))],meta)
        }else{
            (vec![],self.get_note_meta(&*arg.noteid))
        };
        nb.x=arg.x; nb.y=arg.y; nb.w=arg.w; nb.h=arg.h;
        self.set_notebar_info(&*(arg.noteid),&*(arg.barid),&nb);
        let resp=UpdateBarTransformReply{
            chunk_maxx: meta.max_chunkx,
            chunk_minx: meta.min_chunkx,
            chunk_maxy: meta.max_chunky,
            chunk_miny: meta.min_chunky,
            chunk_change
        };
        async move{
            gen_send::send_update_bar_transform_reply(sender,taskid,resp).await;
            ()
        }
    }

    type RedoFuture = impl Future<Output=()>;

    fn api_redo(&self, arg: RedoArg, taskid: String, sender: ToClientSender) -> Self::RedoFuture {
        async move{
            ()
        }
    }

    type AddPathFuture = impl Future<Output=()>;

    fn api_add_path(&self, arg: AddPathArg, taskid: String, sender: ToClientSender) -> Self::AddPathFuture {
        self.add_path(&*(arg.noteid),&*(arg.from),&*(arg.to));
        async move{
            gen_send::send_add_path_reply(sender,taskid,AddPathReply{ }).await;
            ()
        }
    }

    type GetPathInfoFuture = impl Future<Output=()>;

    fn api_get_path_info(&self, arg: GetPathInfoArg, taskid: String, sender: ToClientSender) -> Self::GetPathInfoFuture {
        let info=self.get_note_path_info(&*(arg.noteid),&*(arg.pathid_with_line)).unwrap();
        async move{
            gen_send::send_get_path_info_reply(sender,taskid,GetPathInfoReply{ type_: info.pathtype }).await;
            ()
        }
    }

    type SetPathInfoFuture = impl Future<Output=()>;

    fn api_set_path_info(&self, arg: SetPathInfoArg, taskid: String, sender: ToClientSender) -> Self::SetPathInfoFuture {
        self.set_note_path_info(&*(arg.noteid),&*(arg.pathid_with_line),&PathInfo{ pathtype: arg.type_ });
        async move{
            gen_send::send_set_path_info_reply(sender,taskid,SetPathInfoReply{}).await;
            ()
        }
    }

    type RemovePathFuture = impl Future<Output=()>;

    fn api_remove_path(&self, arg: RemovePathArg, taskid: String, sender: ToClientSender) -> Self::RemovePathFuture {
        // 对应editor bar 中的信息变更
        let mut split=arg.pathid_with_line.split("_");
        let a=split.next().unwrap().to_string();
        let b=split.next().unwrap().to_string();
        let mut ainfo=self.get_notebar_info(arg.noteid.clone(),a.clone()).unwrap();
        note_bar_info_funcs::remove_path_in_info(&*(arg.pathid_with_line),&mut ainfo);
        self.set_notebar_info(&*(arg.noteid),&*a,&ainfo);
        let mut binfo=self.get_notebar_info(arg.noteid.clone(),b.clone()).unwrap();
        note_bar_info_funcs::remove_path_in_info(&*(arg.pathid_with_line),&mut binfo);
        self.set_notebar_info(&*(arg.noteid),&*b,&binfo);
        // 移除path
        self.remove_note_path_info(&*(arg.noteid),&*(arg.pathid_with_line));
        async move{
            gen_send::send_remove_path_reply(sender,taskid,RemovePathReply{}).await;
            ()
        }
    }

    type DeleteBarFuture = impl Future<Output=()>;

    fn api_delete_bar(&self, arg: DeleteBarArg, taskid: String, sender: ToClientSender) -> Self::DeleteBarFuture {
        let meta=self.delete_bar(sender.get_connid(),&*(arg.noteid),&*(arg.barid));
        async move{
            gen_send::send_delete_bar_reply(sender,taskid,DeleteBarReply{
                chunk_maxx: meta.max_chunkx,
                chunk_minx: meta.min_chunkx,
                chunk_maxy: meta.max_chunky,
                chunk_miny: meta.min_chunky
            }).await;
            ()
        }
    }

    type LoginFuture = impl Future<Output=()>;

    fn api_login(&self, arg: LoginArg, taskid: String, sender: ToClientSender) -> Self::LoginFuture {
        let ok=AuthorityMan::get().check_id_and_pw(&*(arg.id),&*(arg.pw));
        async move{
            gen_send::send_login_reply(sender,taskid,LoginReply{
                if_success: if ok.is_ok(){1}else{0},
                token: if ok.is_ok(){AuthorityMan::get().gen_token()}else{"".to_string()}
            }).await;
            ()
        }
    }

    type VerifyTokenFuture = impl Future<Output=()>;

    fn api_verify_token(&self, arg: VerifyTokenArg, taskid: String, sender: ToClientSender) -> Self::VerifyTokenFuture {
        let ok=AuthorityMan::get().check_token(arg.token);
        async move{
            gen_send::send_verify_token_reply(sender,taskid,VerifyTokenReply{
                if_success: if ok.is_ok(){1}else{0},
                new_token: if ok.is_ok(){AuthorityMan::get().gen_token()}else{"".to_string()}
            }).await;
            ()
        }
    }
}