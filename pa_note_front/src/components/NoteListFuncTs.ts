import { AppFuncTs } from "@/logic/app_func";
//import {_ipc} from "@/ipc";
import { ipcRenderer } from "electron";
import { _PaUtilTs } from "@/3rd/pa_util_ts";
import { ElMessageBox } from "element-plus";
import { Buffer } from "buffer";
// import {bus, bus_event_names} from "@/bus";
// import Storage from "@/storage/Storage";
import { note } from "@/logic/note/note";
import { CreateNewNoteReq, RenameNoteReq, apis } from "@/logic/gen_api_list";
// import {NoteContentData} from "@/components/NoteCanvasFunc";
// import {NoteStoreToFileStruct} from "@/storage/Storage";

export namespace NoteListFuncTs {
    import Context = AppFuncTs.Context;
    // import NoteContentData = note.NoteContentData;

    export class NoteConfigInfo {
        bind_file: string | null = null
    }

    class NoteListDataToStore {
        pub_notes: any = {}//存储NoteConfigInfo
        next_id = 0
    }

    const getNoteDataModel = (name: string = "hh", bind_file: string | null = null) => {
        if (bind_file) {
            return {
                name,
                bind_file
                //bind_file 有绑定时存在属性，没绑定时该属性不存在
            }
        } else {
            return {
                name
                //bind_file 有绑定时存在属性，没绑定时该属性不存在
            }
        }

    }

    export class NoteListManager {
        uibind = {
            notelist: [] as any[] //[[id,name],....]
        }
        update_notelist(notelist: any[]) {
            this.uibind.notelist = notelist
            // console.log(this.uibind)
        }
        rename_note(noteid: string, newname: string, listcomp: any) {
            for (const key in this.uibind.notelist) {
                let id_name = this.uibind.notelist[key]
                if (id_name[0] == noteid) {
                    if (id_name[1] != newname) {
                        apis.rename_note(new RenameNoteReq(noteid, newname)).then(r => {
                            let res = r.succ()
                            if (!res) return
                            this.uibind.notelist[key][1] = newname
                            listcomp.$forceUpdate();
                            console.log("rename_note succ")
                        })
                    }
                    return
                }
            }
        }
        //不要直接修改数据结构，通过notelist manager修改
        data_to_storage = new NoteListDataToStore()

        pub_note_list_mounted(context: AppFuncTs.Context, notelist: any) {
            // this.context=context;
        }

        pub_set_notes() {

        }

        pub_set_note_newedited_flag(noteid: string) {
            this.data_to_storage.pub_notes[noteid].new_edit = true;
        }

        //打开窗口选择文件并加载笔记


        //修改NoteStoreToFileStruct后
        // 改变文件中的数据
        // 创建笔记
        // new_note_changefile_from_NoteStoreToFileStruct(
        //     ctx: AppFuncTs.Context, fpath: string,
        //     store: NoteStoreToFileStruct) {
        //     // this.new_note_from_loaded_NoteStoreToFileStruct(ctx,fpath,store)
        //     // ctx.storage_manager.save_note_2_file(store.note_id,fpath)
        // }

        //新建笔记，并且写入到文件
        new_note_bind_file(ctx: AppFuncTs.Context, fpath: string) {
            // const newid=this._new_note_id()
            // const struct=new NoteStoreToFileStruct(newid,note.NoteContentData.get_default())
            // this.new_note_changefile_from_NoteStoreToFileStruct(ctx,fpath,struct)
        }

        //从刚刚加载的文件数据中新建笔记
        // new_note_from_loaded_NoteStoreToFileStruct(ctx: AppFuncTs.Context, fbind: string, store: NoteStoreToFileStruct) {
        //     // this.data_to_storage.pub_notes[store.note_id] = getNoteDataModel(store.note_id, fbind)
        //     // ctx.storage_manager.save_notelist(this);
        //     // // ctx.storage_manager.save_note_2_buffer_from_NoteStoreToFileStruct(store)
        // }

        _new_note_id(): string {
            const now = new Date()
            return now.getUTCFullYear() + ":" +
                now.getUTCMonth() + ":" +
                now.getUTCDay() + ":" +
                now.getUTCHours() + ":" +
                now.getUTCMinutes() + ":" +
                now.getUTCSeconds() + ":" +
                now.getUTCMilliseconds()
        }

        add_new_note() {
            apis.create_new_note(new CreateNewNoteReq()).then(r => {
                console.log("created new note", r)
            })
        }

        delete_note(ctx: AppFuncTs.Context, note_id: string) {
            console.log("删除 callback", this.data_to_storage, note_id)

            delete this.data_to_storage.pub_notes[note_id];
            console.log("删除 ", this.data_to_storage)
            ctx.storage_manager.save_notelist(this);
        }

        async open_note(ctx: AppFuncTs.Context, noteid: string) {
            // console.log("id compare", ctx.cur_open_note_id, noteid);
            if (!ctx.cur_canvasproxy ||
                ctx.cur_canvasproxy.get_content_manager().cur_note_id !== noteid) {
                // ctx.cur_open_note_id = noteid
                console.log("open_note", ctx, noteid);
                const nlman = ctx.get_notelist_manager()
                // console.log("nlman")
                if (nlman) {
                    const conf = get_note_config_info(nlman, noteid);
                    // console.log("conf",conf)
                    if (conf) {
                        let _note = await ctx.storage_manager.load_note_all(noteid, conf)
                        if (!_note) {
                            _note = note.NoteContentData.get_default()
                        }
                        const handle = note.NoteHandle.create(noteid, _note)
                        // ctx.note_loaded_and_open(handle)
                        // ctx.cur_open_note_content=note
                        // if (note)
                        {
                            ctx.app.app_ref_getter.get_note_canvas(ctx.app)
                                .content_manager.first_load_set(handle);

                        }
                    }
                }
            }
        }

        change_note_name(ctx: AppFuncTs.Context, noteid: string, name: string) {
            console.log("change_note_name", name)
            if (noteid in this.data_to_storage.pub_notes) {
                this.data_to_storage.pub_notes[noteid].name = name
                ctx.storage_manager.save_notelist(this)
            } else {
                console.log("change note failed", noteid)
            }
        }

        async set_note_config_with_NoteConfigInfo(ctx: AppFuncTs.Context, noteid: string, config_info: NoteConfigInfo) {
            //
            // if (noteid in this.data_to_storage.pub_notes) {
            //     const notes = this.data_to_storage.pub_notes;
            //
            //     //绑定到文件，需要对文件进行内容检查，
            //     // 若原有数据，需要先询问，
            //     // 然后将当前笔记内容写入到文件内
            //     if (config_info.bind_file) {
            //         if (config_info.bind_file != notes[noteid].bind_file) {
            //             const res = await ipcRenderer.invoke(_ipc._channels.read_file_content, config_info.bind_file)
            //             console.log("read res", res)
            //             if (!res.err) {
            //                 //读取正常才应用config
            //                 const datastr = _PaUtilTs._Conv.UInt8Array2string(res.data)
            //                 const parse = _PaUtilTs.try_parse_json(datastr)
            //                 const finalbind = () => {
            //                     notes[noteid].bind_file = config_info.bind_file
            //                     ctx.get_notelist_manager()?.pub_set_note_newedited_flag(noteid)
            //                 }
            //                 console.log(datastr, parse)
            //                 if (parse) {
            //                     //该文件之前不是绑定到此笔记，是否要进行绑定
            //                     if ("noteid" in parse && parse["noteid"] != noteid) {
            //                         try {
            //                             await ElMessageBox.confirm(
            //                                 '该文件之前不是绑定到此笔记，建议新建笔记文件\n，是否要进行绑定?',
            //                                 'Warning',
            //                                 {
            //                                     confirmButtonText: '确认',
            //                                     cancelButtonText: '取消',
            //                                     type: 'warning',
            //                                 })
            //                             finalbind();
            //                         } catch (e) {
            //
            //                             console.log(e)
            //                         }
            //                     }
            //                 } else {//文件为空，直接绑定
            //                     finalbind();
            //                 }
            //             }
            //         }
            //     } else {
            //         delete notes[noteid]["bind_file"]
            //     }
            //     // console.log("set_note_config_with_NoteConfigInfo",notes[noteid])
            //     //修改完成后。做一个存储
            // }
        }

        // eslint-disable-next-line no-unused-vars

    }

    export const get_note_list_from_ctx = (ctx: Context) => {
        return ctx.app.app_ref_getter.get_note_list(ctx.app)
    }
    //获取笔记对应的配置信息，显示到dialog里，
    export const get_note_config_info = (notelistman: NoteListManager, noteid: string): NoteConfigInfo | null => {
        const ret = new NoteConfigInfo();
        if (noteid in notelistman.data_to_storage.pub_notes
        ) {
            const note = notelistman.data_to_storage.pub_notes[noteid]
            // console.log(notelistman.data_to_storage.)
            if ("bind_file" in note) {
                ret.bind_file = note["bind_file"];
            }
            return ret;
        }
        return null
    }
}