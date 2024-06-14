import { note } from "@/logic/note/note";
import { AppFuncTs } from "@/logic/app_func";
import { _route } from "@/logic/route";
import { FetchAllNoteBarsEpochReq, apis as content_apis } from "./gen_api_content";
import { GetNotesMataReq, apis as list_apis } from "./gen_api_list"
export class EventCenter {
    on_commu_established() {
        if (this.ctx.ui_refs().main_canvasproxy().get_content_manager().is_holding_note()) {
            let handle = this.ctx.ui_refs().main_canvasproxy().get_content_manager().notehandle;

            content_apis.fetch_all_note_bars_epoch(
                new FetchAllNoteBarsEpochReq(handle.note_id)
            ).then(r => {
                let res = r.succ()
                if (!res) return
                handle.noteloader.check_all_note_bars_by_epoch(res.bars_id_and_epoch);
            })
        } else {
            //reload note
            list_apis.get_notes_mata(new GetNotesMataReq()).then(_r => {
                let reply = _r.succ()
                if (!reply) { return }
                console.log("reply", reply)
                this.ctx.get_notelist_manager()?.update_notelist(reply.node_id_name_list)
                this.ctx.ui_refs().notelist().$forceUpdate();
                if (reply.node_id_name_list.length > 0) {
                    let routeinfo = _route.get_route_info()
                    let find = false
                    reply.node_id_name_list.forEach((v) => {
                        if (v[0] == routeinfo.noteid) {
                            find = true
                        }
                    })
                    let noteid = find ?
                        routeinfo.noteid : reply.node_id_name_list[0][0]
                    AppFuncTs.get_ctx().start_open_note(noteid)
                }
            })
        }
        this.ctx.authority_man.verify_token_when_first_load()
    }
    on_note_handle_first_hold(notehandle: note.NoteHandle) {
        this.ctx.logic_articleman.load_article_list_and_update_ui(notehandle.note_id)
    }
    constructor(private ctx: AppFuncTs.Context) {
    }
}