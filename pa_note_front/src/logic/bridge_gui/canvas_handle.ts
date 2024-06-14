import { _PaUtilTs } from "@/3rd/pa_util_ts";
import { note } from "@/logic/note/note";

export namespace _bridge_gui_canvas_handle {

    export class Canvas2Handle {
        static new() {
            return new Canvas2Handle()
        }
        // called when tick
        // return changed
        updatehandle_range_if_changed(handle: note.NoteHandle): boolean {
            return handle.noteloader.syncrange_if_chunkrange_changed()
        }
        // called when tick
        //传入chunkrange，优先扫描chunkrange是否加载
        tick_load(handle: note.NoteHandle, chunk_range: _PaUtilTs.Rect) {//每100ms调用，检查是否有未load完的chunk
            handle.brige_gui_from_canvas_tickload(chunk_range)
        }

        consume_got_notebars(handle: note.NoteHandle, cb: (bid: string, barinfo: GetNoteBarInfoReply) => void) {
            while (true) {
                let get = handle.noteloader.try_get_one_latest_loaded()
                if (get) {
                    cb(get[0], get[1])
                } else {
                    break;
                }
            }
        }
        // called when tick
        for_each_chunk(handle: note.NoteHandle, cb: (chunk: note.NoteChunk) => void) {
            for (let i = handle.content_data.chunkminx; i <= handle.content_data.chunkmaxx; i++) {
                for (let j = handle.content_data.chunkminy; j <= handle.content_data.chunkmaxy; j++) {
                    if (handle.noteloader.is_chunk_loaded(i, j)) {
                        let ck = handle.noteloader.get_chunk(i, j)
                        if (ck) {
                            cb(ck);
                        } else {
                            console.error("for_each_chunk")
                        }
                    }
                }
            }
        }
    }
    export class Handle2Canvas {
        static new() {
            return new Handle2Canvas()
        }
        sync_chunk_range(handle: note.NoteHandle) {
            handle.foreach_holders((cm) => {
                cm.chunkhelper.set_chunk_range_by_notehandle(handle)
            })
        }
    }
}