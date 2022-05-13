import {autoUpdater} from "electron-updater";
import {_ipc} from "@/ipc";

export namespace auto_update{
    export const regist=()=>{
        const message = {
            error: '检查更新出错',
            checking: '正在检查更新……',
            updateAva: '检测到新版本，正在下载……',
            updateNotAva: '现在使用的就是最新版本，不用更新',
        };
        //设置更新包的地址
        autoUpdater.setFeedURL(feedUrl);
        //监听升级失败事件
        autoUpdater.on('error', function (error) {
            _ipc.MainCallRender.tasks.auto_update.call(
                'error',error
            )
        });
        //监听开始检测更新事件
        autoUpdater.on('checking-for-update', function (message) {
            _ipc.MainCallRender.tasks.auto_update.call(
                'checking-for-update',message
            )
        });
        //监听发现可用更新事件
        autoUpdater.on('update-available', function (message) {
            _ipc.MainCallRender.tasks.auto_update.call(
                'update-available',message
            )
        });
        //监听没有可用更新事件
        autoUpdater.on('update-not-available', function (message) {
            _ipc.MainCallRender.tasks.auto_update.call(
                'update-not-available',message
            )
        });

        // 更新下载进度事件
        autoUpdater.on('download-progress', function (progressObj) {
            _ipc.MainCallRender.tasks.auto_update.call(
                'download-progress',progressObj
            )
        });
        //监听下载完成事件
        autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl) {
            _ipc.MainCallRender.tasks.auto_update.call(
                'download-progress',{
                    releaseNotes,
                    releaseName,
                    releaseDate,
                    updateUrl
                }
            )
            //退出并安装更新包
            autoUpdater.quitAndInstall();
        });
    }
}