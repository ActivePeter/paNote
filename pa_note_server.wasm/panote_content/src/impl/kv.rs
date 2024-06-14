use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct NoteMataKv {
    pub next_noteid: i32,
    pub max_chunkx: i32,
    pub max_chunky: i32,
    pub min_chunkx: i32,
    pub min_chunky: i32,
}

#[derive(Debug, Serialize, Deserialize)]

pub struct ChunkNoteIdsKv {
    pub noteids: Vec<String>,
}
