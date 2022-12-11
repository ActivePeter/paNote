#![feature(generic_associated_types)]
#![feature(type_alias_impl_trait)]


pub mod note_man;
pub mod server;
pub mod gen_distribute;
pub mod gen_send;
pub mod authority;
pub mod util;

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
use std::{net::SocketAddr, path::PathBuf};
use crate::authority::AuthorityMan;

#[tokio::main]
async fn main() {
    // build our application with some routes
    AuthorityMan::get().load_config();

    let app = Router::new()
        // routes are matched from bottom to top, so we have to put `nest` at the
        // top since it matches all routes
        .route("/ws", get(ws_handler));

    // run it with hyper
    let addr = SocketAddr::from(([127, 0, 0, 1], 3004));
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn ws_handler(
    ws: WebSocketUpgrade,
) -> impl IntoResponse {

    ws.on_upgrade(server::handle_socket)
}

