import {AppFuncTs} from "@/AppFunc";
import {ipcRenderer} from "electron";
import {_ipc} from "@/ipc";
// import {ReviewPartFunc} from "@/components/ReviewPartFunc";
import {ElMessageBox, ElNotification} from "element-plus";
import {auto_update as _auto_update}  from "@/auto_update";

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
                console.log("auto update:",msg)
                const bl=context.get_bottom_line()
                if(bl){
                    const update_state_ref=bl.$refs.bar_update_state.$refs.update_state_ref
                    switch (msg){
                        case _auto_update.event_names.update_downloaded:
                            context.element_plus()._ElMessageBox.confirm(
                                '新版本安装包已下载完成',
                                'Title',
                                {
                                    confirmButtonText: '立即关闭并安装',
                                    cancelButtonText: '后续关闭后静默安装',
                                    type: 'info',
                                }
                            )
                                .then(() => {
                                    _ipc.Tasks.tasks.auto_update_render_call_main.call(
                                        // _ipc.Tasks.tasks.auto_update_render_call_main,
                                        "quit_and_install"
                                    )

                                    // _auto_update.quit_and_install()
                                })
                                .catch(() => {

                                    bl.$refs.bar_update_state.event_click();
                                    update_state_ref.install_after_close=true
                                    update_state_ref.set_state(update_state_ref.states.downloaded)

                                    _ipc.Tasks.tasks.auto_update_render_call_main.call(
                                        // _ipc.Tasks.tasks.auto_update_render_call_main,
                                        "set_quiet_install"
                                    )
                                    // _auto_update.set_quiet_install()
                                })


                            // bl.$refs.bar_update_state.event_click();
                            // update_state_ref.set_state(update_state_ref.states.downloaded)
                            // update_state_ref.set_state(update_state_ref.states.)
                            break;
                        case _auto_update.event_names.update_available:
                            // bl.$refs.bar_update_state.event_click();
                            update_state_ref.set_state(update_state_ref.states.downloading)
                            break;
                        case _auto_update.event_names.update_not_available:
                            // bl.$refs.bar_update_state.event_click();
                            update_state_ref.set_state(update_state_ref.states.already)
                            break;
                        case _auto_update.event_names.error:
                            // bl.$refs.bar_update_state.event_click();
                            update_state_ref.set_state(update_state_ref.states.need)
                            break;
                        case _auto_update.event_names.checking_for_update:
                            // bl.$refs.bar_update_state.event_click();
                            update_state_ref.set_state(update_state_ref.states.checking)
                            break;
                        case _auto_update.event_names.download_progress:
                            // bl.$refs.bar_update_state.event_click();
                            update_state_ref.set_state(update_state_ref.states.downloading)
                            break;
                    }

                    // bl.$refs.bar_update_state.$refs.update_state_ref.set_state()
                    // bl.$refs.bar_update_state.event_click();
                }
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