use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        TypedHeader,
    },
    http::StatusCode,
    response::IntoResponse,
    routing::{get, get_service},
    Router,
};
use serde::Serialize;
use crate::note_man::{NoteManager};
use crate::gen_distribute::distribute;
use std::borrow::Borrow;
// use futures_util::stream::stream::StreamExt;
use futures::{StreamExt,SinkExt};
use std::sync::atomic::{AtomicI32, Ordering};

pub struct ToClientSender{
    sender:  tokio::sync::mpsc::Sender<String>,
    connid:i32
}
impl ToClientSender{
    pub fn get_connid(&self) -> i32 {
        self.connid
    }
    pub fn create(sender: tokio::sync::mpsc::Sender<String>,connid:i32) -> ToClientSender {
        ToClientSender{
            sender,
            connid
        }
    }
    pub async fn send<T>(&mut self, value:&T)
        where
            T: ?Sized + Serialize,{

        self.sender.send((serde_json::to_string(value).unwrap())).await.unwrap();
    }
}

static NEXT_CONN_ID:AtomicI32 =AtomicI32::new(0);

pub async fn handle_socket(mut socket: WebSocket) {
    let conn_id=NEXT_CONN_ID.fetch_add(1,Ordering::Relaxed);
    let (mut sink,mut stream)=socket.split();
    let (tx,mut r)=tokio::sync::mpsc::channel::<String>(100);
    tokio::spawn(async move{
        while let a=r.recv().await{
            match a{
                None => {break;}
                Some(s) => {
                    sink.send(Message::Text(s)).await.unwrap();
                }
            }
        }
    });
    while let Some(msg) = stream.next().await {
        if let Ok(msg) = msg {
            match msg {
                Message::Text(t) => {
                    println!("recv text {}",t);
                    let res:serde_json::Value= serde_json::from_str(&*t).unwrap();
                    if res.is_object() {
                        let res_obj=res.as_object().unwrap();

                        let msg_type=if let Some(msg_type_)=res_obj.get("msg_type"){
                            if msg_type_.is_string(){
                                Some(String::from(msg_type_.as_str().unwrap()))
                            }else{
                                None
                            }
                        }else{
                            None
                        };
                        if msg_type.is_some() {
                            let txclone=tx.clone();
                            tokio::spawn(async move{
                                distribute(&*msg_type.unwrap(),
                                           res,
                                           ToClientSender::create(txclone,conn_id)).await;
                            });
                        }
                    }
                    // println!("client sent str: {:?}", t);
                }
                Message::Binary(_) => {
                    println!("client sent binary data");
                }
                Message::Ping(_) => {
                    println!("socket ping");
                }
                Message::Pong(_) => {
                    println!("socket pong");
                }
                Message::Close(_) => {
                    println!("client disconnected");
                    break;
                }
            }
        } else {
            println!("client disconnected");
            break;
        }
    }
    NoteManager::get().connection_end(conn_id);
    // loop {
    //     if socket
    //         .send(Message::Text(String::from("Hi!")))
    //         .await
    //         .is_err()
    //     {
    //         println!("client disconnected");
    //         return;
    //     }
    //     tokio::time::sleep(std::time::Duration::from_secs(3)).await;
    // }
}