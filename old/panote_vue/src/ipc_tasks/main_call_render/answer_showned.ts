import {AppFuncTs} from "@/AppFunc";
import {ipcRenderer} from "electron";
import {_ipc} from "@/ipc";
import {ReviewPartFunc} from "@/components/review_part/ReviewPartFunc";


export namespace answer_showned{
    export class Class implements _ipc.MainCallRender.ITask{
        channel="answer_showned"
        call(answer_selections:string[]){
            if(_ipc.win_ref){
                _ipc.win_ref.webContents.send(this.channel,answer_selections)
            }
            // if(electron_bg.get_win()){
            //     electron_bg.get_win().webContents.send(this.channel,noteid,cardsetid,cardid)
            // }
        }
        cb:any
        regist(context:AppFuncTs.Context){
            this.cb=(event:any,
                     answer_selections:string[]) => {
                const rpman=
                    context.getter().review_part_man()
                rpman.f_from_anki().answer_showned(
                    answer_selections
                )
            }
            ipcRenderer.on(this.channel,this.cb)
        }
        unregist() {
            ipcRenderer.off(this.channel,this.cb)
        }
    }
}