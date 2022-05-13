import {AppFuncTs} from "@/AppFunc";
import {ipcRenderer} from "electron";
import {_ipc} from "@/ipc";
// import {ReviewPartFunc} from "@/components/ReviewPartFunc";
import {ElNotification} from "element-plus";

export namespace auto_update{
    export class Class implements _ipc.MainCallRender.ITask{
        channel="auto_update"
        call(msg:string,obj:any){
            if(_ipc.win_ref){
                _ipc.win_ref.webContents.send(this.channel,msg,obj)
            }
            // if(electron_bg.get_win()){
            //     electron_bg.get_win().webContents.send(this.channel,noteid,cardsetid,cardid)
            // }
        }
        cb:any
        regist(context:AppFuncTs.Context){
            this.cb=(event:any,
                     msg:string,obj:any) => {
                // const r=ElNotification()
                // const rpman=
                //     context.getter().review_part_man()
                // rpman.f_from_anki().answer_showned(
                //     answer_selections
                // )
            }
            ipcRenderer.on(this.channel,this.cb)
        }
        unregist() {
            ipcRenderer.off(this.channel,this.cb)
        }
    }
}