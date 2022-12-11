// import ipcMain = Electron.Main.ipcMain;
import {dialog, ipcMain, ipcRenderer} from "electron";
import * as fs from "fs";
import electron_net, {NetManager} from "@/electron_net";
import {SendState} from "@/electron_net_ts";
// import {win} from "@/background";
import {AppFuncTs} from "@/AppFunc";

import {start_review_card} from "@/ipc_tasks/main_call_render/start_review_card"
import {answer_showned} from "@/ipc_tasks/main_call_render/answer_showned";
import {no_card_2_review} from "@/ipc_tasks/main_call_render/no_card_2_review";
import {anki_state_not_match} from "@/ipc_tasks/main_call_render/anki_state_not_match";
import {auto_update} from "@/ipc_tasks/main_call_render/auto_update";
import {ReviewPartFunc} from "@/components/review_part/ReviewPartFunc";
import {auto_update as _auto_update} from "@/auto_update"
import {net_state_change} from "@/ipc_tasks/main_call_render/net_state_change";
// import {electron_bg} from "@/background";

export namespace _ipc {
    export let win_ref:any
    export namespace _channels {
        export const start_choose_file_bind = "start_choose_file_bind"
        export const read_file_content="read_file_content" //filepath
        export const overwrite_file_str="overwrite_file_str"
        // export const start
    }
    export namespace MainCallRender{
        export interface ITask{
            channel:string
            regist(context:AppFuncTs.Context):void
            unregist():void
        }
        export const tasks={
            start_review_card:new start_review_card.Class(),
            answer_showned:new answer_showned.Class(),
            no_card_2_review:new no_card_2_review.Class(),
            anki_state_not_match:new anki_state_not_match.Class(),
            auto_update:new auto_update.Class(),
            net_state_change:new net_state_change.Class()
        }
        export const regist=(ctx:AppFuncTs.Context)=>{
            for(const key in tasks){
                // @ts-ignore
                (tasks[key]).regist(ctx);
            }
        }
        export const unregist=()=>{
            for(const key in tasks){
                // @ts-ignore
                (tasks[key]).unregist()
            }
        }
    }
    export namespace Tasks{//RenderCallMain
        export interface ITask{
            channel:string
            regist():void
        }
        namespace get_net_state{
            export class Class implements ITask{
                channel="get_net_state"
                call():Promise<boolean>{
                    return ipcRenderer.invoke(this.channel)
                }
                regist(){
                    ipcMain.handle(this.channel, async () => {
                        return electron_net.get_net_manager().connected
                    })
                }
            }
        }
        namespace start_choose_pa_note_file{
            interface Return{
                canceled: boolean
                filePaths: string[]
            }
            export class Class implements ITask{
                channel="start_choose_pa_note_file"
                call():Promise<Return>{
                    return ipcRenderer.invoke(this.channel)
                }
                regist(){
                    ipcMain.handle(this.channel, async () => {
                        const res = await dialog.showOpenDialog(
                            {
                                properties: ['openFile'],
                                filters: [
                                    { name: 'panote', extensions: ['panote'] }]
                            })
                        return res;
                    })
                }
            }
        }
        namespace send_to_anki{
            interface Return{
                canceled: boolean
                filePaths: string[]
            }
            export class Class implements ITask{
                channel="send_to_anki"
                call(get_serialized_data:string):Promise<Return>{
                    return ipcRenderer.invoke(this.channel,get_serialized_data)
                }
                regist(){
                    ipcMain.handle(this.channel, async (event,get_serialized_data) =>{
                        console.log("send_to_anki",get_serialized_data)
                        const netman:null|NetManager=electron_net.get_net_manager()
                        if(!netman){
                            return false
                        }
                        const res=await netman.try_send_str(get_serialized_data);
                        if(res==SendState.Succ){
                            return true
                        }
                        return false
                    })
                }
            }
        }
        namespace auto_update_render_call_main{

            export class Class implements ITask{
                channel="auto_update_render_call_main"

                //"set_quiet_install"
                //"quit_and_install"
                call(cmds:string){
                    return ipcRenderer.invoke(this.channel,cmds)
                }
                regist(){
                    ipcMain.handle(this.channel, async (event,cmd:string) =>{
                        console.log(cmd)
                        if(cmd=="set_quiet_install"){
                            _auto_update.set_quiet_install()
                        }else if(cmd=="quit_and_install"){
                            _auto_update.quit_and_install()
                        }

                        // console.log("send_to_anki",get_serialized_data)
                        // const netman:null|NetManager=electron_net.get_net_manager()
                        // if(!netman){
                        //     return false
                        // }
                        // const res=await netman.try_send_str(get_serialized_data);
                        // if(res==SendState.Succ){
                        //     return true
                        // }
                        // return false
                    })
                }
            }
        }
        //底下的regist函数会遍历regist
        export const tasks={
            start_choose_pa_note_file:new start_choose_pa_note_file.Class(),
            send_to_anki:new send_to_anki.Class(),//发送前先判断是否连接
            auto_update_render_call_main:new auto_update_render_call_main.Class(),
            get_net_state:new get_net_state.Class()
        }

    }

    //创建窗口时调用，监听来自界面的事件
    export const regist = () => {
        // "render_call_main_registed"
        ipcMain.handle(_channels.start_choose_file_bind, async () => {
            const res = await dialog.showOpenDialog(
                {
                    properties: ['openFile'],
                    filters: [
                        { name: 'panote', extensions: ['panote'] }]
                })
            return res;
        })
        ipcMain.handle(_channels.read_file_content,async (event,path)=>{
            const res=await new Promise((resolve => {
                fs.readFile(path,(err,data:Buffer)=>{
                    resolve({
                        err,data
                    })
                })
            }))
            return res;
        })
        ipcMain.handle(_channels.overwrite_file_str,async (event,path,str)=>{
            const res=await new Promise((resolve => {
                fs.writeFile(path,str,(err)=>{
                    resolve({
                        err
                    })
                })
            }))
            return res;
        })
        for(const key in Tasks.tasks){
            // @ts-ignore
            (Tasks.tasks[key]).regist();
        }
    }
}