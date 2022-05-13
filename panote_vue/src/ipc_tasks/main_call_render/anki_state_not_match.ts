import {AppFuncTs} from "@/AppFunc";
import {ipcRenderer} from "electron";
import {_ipc} from "@/ipc";
import {ReviewPartFunc} from "@/components/ReviewPartFunc";
// import {ElMessage} from "element-plus";
// import {elementplus} from "@/elementplus";

export namespace anki_state_not_match{
    export class Class implements _ipc.MainCallRender.ITask{
        channel="anki_state_not_match"
        call(){
            if(_ipc.win_ref){
                _ipc.win_ref.webContents.send(this.channel)
            }
            // if(electron_bg.get_win()){
            //     electron_bg.get_win().webContents.send(this.channel,noteid,cardsetid,cardid)
            // }
        }
        cb:any
        regist(context:AppFuncTs.Context){
            // import {elementplus} from "@/elementplus";

            this.cb=(event:any) => {
                const rpman=
                    context.getter().review_part_man()
                context.element_plus()._ElMessage(
                    {
                        message: 'anki状态不一致，将停止复习\n（请勿在复习过程中切换anki的界面）！',
                        type: 'error',
                    }
                )
                // elementplus._ElMessage({
                //     message: 'anki状态不一致，将停止复习\n（请勿在复习过程中切换anki的界面）！',
                //     type: 'error',
                // })
                rpman.reviewing_state.stop_reviewing()
                // rpman.f_from_anki().no_card_to_review(
                //     note,cardset
                // )
            }
            ipcRenderer.on(this.channel,this.cb)
        }
        unregist() {
            ipcRenderer.off(this.channel,this.cb)
        }
    }
}