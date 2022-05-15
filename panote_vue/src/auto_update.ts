import {autoUpdater} from "electron-updater";
import {_ipc} from "@/ipc";
import {app} from "electron";

import * as fs from "fs"
import Storage from "@/storage/Storage";
import * as path from "path";
// import download from "download"
const download = require('download');
const yaml = require('js-yaml');
// const request = require("request")
const axios = require('axios').default;
const { exec } = require('child_process');

export namespace auto_update{
    export const event_names={
        error:'error',
        checking_for_update:'checking-for-update',
        update_available:'update-available',
        update_not_available:'update-not-available',
        download_progress:'download-progress',
        update_downloaded:'update-downloaded'
    }
    let appfpath=""

    let instpath=""
    // const update_url="http://rbuzwxrtx.hn-bkt.clouddn.com/"
    const start_download_setup= async (url:string)=>{

        // Storage.get_app_file_path()
        if (!fs.existsSync(appfpath)) {
            fs.mkdirSync(appfpath);
        }
        // const mypath =
        const writer = fs.createWriteStream(instpath);
        try {

            const response = await axios({
                url,
                method: "GET",
                responseType: "stream"
            });
            console.log(instpath)
            // console.log(response)
            _ipc.MainCallRender.tasks.auto_update.call(
                event_names.download_progress, {}
            )
            response.data.pipe(writer);
            response.data.on('end', () => {
                _ipc.MainCallRender.tasks.auto_update.call(
                    event_names.update_downloaded,{}
                )
                writer.close()
                // writer.end('Goodbye\n');
            });
            response.data.on('error',()=>{
                writer.close()
                _ipc.MainCallRender.tasks.auto_update.call(
                    event_names.error,"文件写入错误"
                )
            })
        }catch (e){
            _ipc.MainCallRender.tasks.auto_update.call(
                event_names.error,e
            )
        }



        // _ipc.MainCallRender.tasks.auto_update.call(
        //     event_names.update_downloaded,{}
        // )
    }
    const download_latest=async ()=>{
        const res= await download("http://s5.nsloop.com:28204/down/Uwd4e79JygA5")
        try {
            const doc = yaml.load(res);
            console.log("yaml",doc);
            if(doc.version!=app.getVersion()){
                _ipc.MainCallRender.tasks.auto_update.call(
                    event_names.update_available,{}
                )
                await start_download_setup(doc.files[0].url)
            }else{
                _ipc.MainCallRender.tasks.auto_update.call(
                    event_names.update_not_available,{}
                )
            }
        } catch (e) {
            _ipc.MainCallRender.tasks.auto_update.call(
                event_names.error,"获取版本信息失败"
            )
            console.log("yamlfail",e);
        }
        // console.log("download",res)
    }
    export const start_check_for_once=()=>{

        download_latest()
        // autoUpdater.checkForUpdatesAndNotify()

    }
    let quiet_install_need=false
    export const quiet_install_if_need=()=>{
        if(quiet_install_need){
            open_install_file();
        }
    }
    const open_install_file=()=>{
        exec("powershell start "+instpath)
    }
    export const quit_and_install=()=>{
        // autoUpdater.quitAndInstall()
        // set_quiet_install();
        open_install_file()
        app.quit()
    }
    export const set_quiet_install=()=>{
        quiet_install_need=true
    }
    export const regist=()=>{

        appfpath=
            app.getAppPath()+"/appfiles"
        instpath=path.resolve(appfpath, "install.exe");
        // app.getAppPath()
        // //设置更新包的地址
        // autoUpdater.setFeedURL(update_url);
        // //监听升级失败事件
        // autoUpdater.on(event_names.error, function (error) {
        //     _ipc.MainCallRender.tasks.auto_update.call(
        //         event_names.error,error
        //     )
        // });
        // //监听开始检测更新事件
        // autoUpdater.on('checking-for-update', function (message) {
        //     _ipc.MainCallRender.tasks.auto_update.call(
        //         event_names.checking_for_update,message
        //     )
        // });
        // //监听发现可用更新事件
        // autoUpdater.on('update-available', function (message) {
        //     _ipc.MainCallRender.tasks.auto_update.call(
        //         event_names.update_available,message
        //     )
        // });
        // //监听没有可用更新事件
        // autoUpdater.on('update-not-available', function (message) {
        //     _ipc.MainCallRender.tasks.auto_update.call(
        //         event_names.update_not_available,message
        //     )
        // });
        //
        // // 更新下载进度事件
        // autoUpdater.on('download-progress', function (progressObj) {
        //     _ipc.MainCallRender.tasks.auto_update.call(
        //         event_names.download_progress,progressObj
        //     )
        // });
        // //监听下载完成事件
        // autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl) {
        //     _ipc.MainCallRender.tasks.auto_update.call(
        //         event_names.update_downloaded,{
        //             releaseNotes,
        //             releaseName,
        //             releaseDate,
        //             updateUrl
        //         }
        //     )
        //
        //     //退出并安装更新包
        //     // autoUpdater.quitAndInstall();
        // });
    }
}