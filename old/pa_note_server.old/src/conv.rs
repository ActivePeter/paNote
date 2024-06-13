use crate::gen_distribute::GetChunkNoteIdsReply;

pub(crate) fn get_chunk_note_ids_reply_to_noteids_strvec(mut reply:GetChunkNoteIdsReply) -> Vec<String> {
    let mut res=vec![];
    while let Some(noteid)=reply.noteids.pop(){
        res.push(noteid.as_str().unwrap().to_owned());
    }
    res
}