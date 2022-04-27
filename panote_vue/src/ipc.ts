// import ipcMain = Electron.Main.ipcMain;
import {dialog, ipcMain, ipcRenderer} from "electron";
import * as fs from "fs";

export namespace _ipc {
    export namespace _channels {
        export const start_choose_file_bind = "start_choose_file_bind"
        export const read_file_content="read_file_content" //filepath
        export const overwrite_file_str="overwrite_file_str"
        // export const start
    }
    export namespace Tasks{
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
        export const tasks={
            start_choose_pa_note_file:new start_choose_pa_note_file.Class()
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