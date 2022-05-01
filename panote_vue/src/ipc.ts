// import ipcMain = Electron.Main.ipcMain;
import {dialog, ipcMain, ipcRenderer} from "electron";
import * as fs from "fs";
import electron_net, {NetManager} from "@/electron_net";
import {SendState} from "@/electron_net_ts";
// import {win} from "@/background";
import {AppFuncTs} from "@/AppFunc";
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
        namespace start_review_card{
            export class Class implements ITask{
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

                    }
                    ipcRenderer.on(this.channel,this.cb)
                }
                unregist() {
                    ipcRenderer.off(this.channel,this.cb)
                }
            }
        }
        export const tasks={
            start_review_card:new start_review_card.Class()
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
                call(get_serialized_data:any):Promise<Return>{
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
        //底下的regist函数会遍历regist
        export const tasks={
            start_choose_pa_note_file:new start_choose_pa_note_file.Class(),
            send_to_anki:new send_to_anki.Class()//发送前先判断是否连接
        }

    }
    export const regist = () => {
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