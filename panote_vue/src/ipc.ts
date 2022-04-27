// import ipcMain = Electron.Main.ipcMain;
import {dialog, ipcMain} from "electron";
import * as fs from "fs";

export namespace _ipc {
    export namespace _channels {
        export const start_choose_file_bind = "start_choose_file_bind"
        export const read_file_content="read_file_content"
        // export const start
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
                fs.readFile(path,(err,data)=>{
                    resolve({
                        err,data
                    })
                })
            }))
            return res;
        })
    }
}