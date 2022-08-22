import {AppFuncTs} from "@/AppFunc";
import {ipcRenderer} from "electron";
import {_ipc} from "@/ipc";
import {ReviewPartFunc} from "@/components/review_part/ReviewPartFunc";


export namespace start_review_card{
    export class Class implements _ipc.MainCallRender.ITask{
        channel="start_review_card"
        call(noteid:string,cardsetid:string,cardid:string){
            if(_ipc.win_ref){
                _ipc.win_ref.webContents.send(this.channel,noteid,cardsetid,cardid)
            }
            // if(electron_bg.get_win()){
            //     electron_bg.get_win().webContents.send(this.channel,noteid,cardsetid,cardid)
            // }
        }
        cb:any
        regist(context:AppFuncTs.Context){
            this.cb=(event:any,noteid:string,cardsetid:string,cardid:string) => {
                console.log("start_review_card cb",
                    noteid,cardsetid,cardid, context.getter().review_part_man(),
                )
                const rpman=
                    context.getter().review_part_man()
                // if(rpman.note_id==noteid&&rpman.selected_card_set==cardsetid){
                //     rpman.reviewing=true
                // }

                // ReviewPartFunc.Funcs.ssssss(
                rpman.f_from_anki().start_review(
                    // rpman,
                    noteid,cardsetid,cardid
                )
            }
            ipcRenderer.on(this.channel,this.cb)
        }
        unregist() {
            ipcRenderer.off(this.channel,this.cb)
        }
    }
}