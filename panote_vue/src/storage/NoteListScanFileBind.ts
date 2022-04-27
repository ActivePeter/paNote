import {AppFuncTs} from "@/AppFunc";
import {NoteListFuncTs} from "@/components/NoteListFuncTs";
import Storage from "@/storage/Storage";

// let started = false
export namespace NoteListScanFileBind {

    export const start = (ctx: AppFuncTs.Context) => {
        const tick = () => {
            // console.log("NoteListScanFileBind hhh")
            if (!ctx) {
                return;
            }
            const nlman = ctx.get_notelist_manager()
            if (nlman) {

                // console.log("NoteListScanFileBind",nlman)
                for (const key in nlman.data_to_storage.pub_notes) {
                    const item = nlman.data_to_storage.pub_notes[key]
                    const conf = NoteListFuncTs.get_note_config_info(nlman, key)

                    // console.log(conf,item)
                    if (conf && conf.bind_file) {
                        // console.log("NoteListScanFileBind",conf)
                        //绑定到文件
                        if (conf && conf.bind_file && "new_edit" in item && item["new_edit"]) {
                            item["new_edit"] = false
                            console.log("note new edit and save",)
                            ctx.storage_manager.save_note_2_file(key,conf.bind_file)
                        }
                    }
                }
            }
            setTimeout(
                tick
                , 10000)
        }
        // if (!started) {
            // started = true;
            tick()
        // }
    }


}