import {AppFuncTs} from "@/AppFunc";
import {NoteListFuncTs} from "@/components/NoteListFuncTs";
let started=false
export namespace NoteListScanFileBind {

    export const start=(ctx:AppFuncTs.Context)=>{
        const tick=()=>{

            // console.log("NoteListScanFileBind")
            const nlman=ctx.get_notelist_manager()
            if(nlman){
                for(const item of nlman.data_to_storage.pub_notes){
                    const conf=NoteListFuncTs.get_note_config_info(nlman,item[0])
                    //绑定到文件
                    if(conf&&conf.bind_file&&"new_edit" in item[1]&&item[1]["new_edit"]){
                        item[1]["new_edit"]=false

                    }
                }
            }
            setTimeout(
                tick
            ,10000)
        }
        if(!started){
            started=true;
            tick()
        }
    }


}