import {AppFuncTs} from "@/AppFunc";
import {ipcRenderer} from "electron";
import {_ipc} from "@/ipc";
import {ReviewPartFunc} from "@/components/review_part/ReviewPartFunc";


export namespace no_card_2_review{
    export class Class implements _ipc.MainCallRender.ITask{
        channel="no_card_2_review"
        call(note:string,cardset:string){
            if(_ipc.win_ref){
                _ipc.win_ref.webContents.send(this.channel,note,cardset)
            }
            // if(electron_bg.get_win()){
            //     electron_bg.get_win().webContents.send(this.channel,noteid,cardsetid,cardid)
            // }
        }
        cb:any
        regist(context:AppFuncTs.Context){
            this.cb=(event:any,
                     note:string,cardset:string) => {
                const rpman=
                    context.getter().review_part_man()
                rpman.f_from_anki().no_card_to_review(
                    note,cardset
                )
            }
            ipcRenderer.on(this.channel,this.cb)
        }
        unregist() {
            ipcRenderer.off(this.channel,this.cb)
        }
    }
}