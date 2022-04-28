// @ts-ignore
import NoteCanvasFunc, {NoteContentData} from "@/components/NoteCanvasFunc";
import Util from "../components/reuseable/Util";
import { ElMessage } from 'element-plus'
import {AppFuncTs} from "@/AppFunc";
import {ReviewPartFuncNew, ReviewPartManager} from "@/components/ReviewPartFunc";
import {bus, bus_event_names} from "@/bus";
import {NoteListFuncTs} from "@/components/NoteListFuncTs";
import {NoteListScanFileBind} from "@/storage/NoteListScanFileBind";
import {ipcRenderer} from "electron";
import {_ipc} from "@/ipc";
import {_PaUtilTs} from "@/3rd/pa_util_ts";
// import AppFunc from "@/AppFunc";


/**
 * @param type Number
 * */
const storage_get_raw_str=(obj_id:string)=>{
    if(!localStorage[obj_id]){
        return null
    }
    if(typeof localStorage[obj_id]==='string'){
        return localStorage[obj_id]
    }
    return null;
}
const storage_get=(obj_id:string,type:number)=>{
    // console.log("storage_get",obj_id,localStorage[obj_id])
    if(!localStorage[obj_id]){
        return null
    }
    if(typeof localStorage[obj_id]==='string'){
        try {
            const obj=JSON.parse(localStorage[obj_id])
            if(Util.get_type_of(obj)===type){
                return obj
            }else{
                return null
            }
        }catch (e){
            return null
        }
    }else{
        return null
    }
}
namespace Storage{
    import NoteListManager = NoteListFuncTs.NoteListManager;
    export namespace Tags{
        export const get_note_next_editor_bar_id_tag=(noteid:string)=>{
            return "note"+noteid+"_next_editor_bar_id"
        }
        export const get_note_editor_bars_tag=(noteid:string)=>{
            return "note"+noteid+"_editor_bars"
        }
        export const get_note_paths_tag=(noteid:string)=>{
            return "note"+noteid+"_paths"
        }
    }
    export namespace ReviewPart{
        export const save_all=(man:ReviewPartManager)=>{
            localStorage["review_card_sets"]=
                JSON.stringify(man.card_set_man.cardsets)
        }
        export const load_all=(man:ReviewPartManager)=>{
            if("review_card_sets" in localStorage&& typeof localStorage["review_card_sets"]==="string"){
                man.card_set_man.cardsets=JSON.parse(localStorage["review_card_sets"])
            }
        }
        export const get_export=()=>{
            return localStorage["review_card_sets"];
        }
    }
    export namespace Port{
        // export class OneNotePortData{
        //     notecontent_data:NoteContentData
        //     static construct_by_notecanvas(notecanvas:any){
        //         const ret=new OneNotePortData()
        //         ret.notecontent_data.next_editor_bar_id=notecanvas.next_editor_bar_id
        //         ret.notecontent_data.paths=notecanvas.paths
        //         ret.notecontent_data.editor_bars=notecanvas.editor_bars
        //     }
        // }
        export class PortDataStruct{
            notelist_struct
            noteid_2_jsonstr:any={}
            review_part
            constructor(notelist:any,storeman:StorageManager,review_part:any) {
                this.review_part=review_part
                this.notelist_struct=notelist

                for(const noteid in Object.keys(notelist.pub_notes)){
                    const save={
                        paths:storage_get_raw_str(Tags.get_note_paths_tag(noteid)),
                        editor_bars:storage_get_raw_str(Tags.get_note_editor_bars_tag(noteid)),
                        next_editor_bar_id:storeman.load_note_next_editor_bar_id(noteid)
                    }
                    if(save.paths&&save.editor_bars&&save.next_editor_bar_id){
                        this.noteid_2_jsonstr[noteid]=save;
                    }
                }
            }
        }
        export const export_all_as_file=(ctx:AppFuncTs.Context)=>{
            const storeman=ctx.storage_manager;
            const notelist=storeman.get_notelist()
            if(!notelist){
                return;
            }
            const port_data=new PortDataStruct(notelist,storeman,ReviewPart.get_export())
            console.log(port_data);
            const FileSaver = require('file-saver');
            const blob = new Blob(
                [JSON.stringify(
                    port_data
                )],
                {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, "hello new world.txt");
        }
        export const import_all=(ctx:AppFuncTs.Context,file_obj:any)=>{
            // eslint-disable-next-line no-empty
            if("notelist_struct" in file_obj&& "noteid_2_jsonstr" in file_obj){

            }
            // console.log("PortModule_import_2_cur_file",file_obj)
            // if(("noteid" in file_obj)&&("note" in file_obj)){
            //
            //     const nl=ctx.app.app_ref_getter.get_note_list(ctx.app);
            //     const newid=nl.notelist_manager.add_new_note(ctx)
            //     this.save_note_editor_bars(newid,file_obj.note.editor_bars);
            //     this.save_note_next_editor_bar_id(newid,file_obj.note.next_editor_bar_id)
            //     this.save_note_paths(newid,file_obj.note.paths)
            //     nl.notelist_manager.open_note(ctx,newid);
            // }
        }
    }
    export class NoteStoreToFileStruct {
        note_content_data:NoteContentData
        note_id:string
        static check_obj(obj:any):boolean{
            if("note_id" in obj && _PaUtilTs._JudgeType.is_string(obj.note_id)){
                return true
            }
            return false
        }
        constructor(note_id:string,note_content_data:NoteContentData) {
            this.note_content_data=note_content_data
            this.note_id=note_id
        }
    }
    export class StorageManager{
        constructor(ctx: AppFuncTs.Context) {

        }
        load_notelist(notelist:any){
            if(localStorage.notelist_store){
                if(typeof localStorage.notelist_store==="string"){
                    notelist.notelist_manager.data_to_storage=JSON.parse(
                        localStorage.notelist_store)
                }
            }
        }
        get_notelist(){
            if(localStorage.notelist_store){
                if(typeof localStorage.notelist_store==="string"){
                    return JSON.parse(
                        localStorage.notelist_store)
                }
            }
            return null;
        }
        save_notelist(notelist_man:NoteListManager){
            localStorage.notelist_store=
                JSON.stringify(notelist_man.data_to_storage)
        }

        // eslint-disable-next-line no-unused-vars
        load_note_next_editor_bar_id(noteid:string){
            let next_editor_bar_id=2000;

            const num=storage_get(Tags.get_note_next_editor_bar_id_tag(noteid),Util.DataType.Number)
            if(num){
                console.log("load_note_next_editor_bar_id",num);
                next_editor_bar_id=num;
            }else{
                // if(localStorage.next_editor_bar_id){
                //     if(typeof localStorage.next_editor_bar_id==="string"){
                //
                //         next_editor_bar_id
                //             =    parseInt(localStorage.next_editor_bar_id)
                //     }else{
                //
                //         next_editor_bar_id
                //             =    localStorage.next_editor_bar_id
                //     }
                // }
            }

            return next_editor_bar_id;
        }

        // eslint-disable-next-line no-unused-vars
        load_note_editor_bars(noteid:string){
            let load={}
            const obj=storage_get(Tags.get_note_editor_bars_tag(noteid),Util.DataType.Obj)
            if(obj){
                // console.log("load_note_editor_bars",obj);
                load=obj;
            }else{
                // if(typeof localStorage.editor_bars=='string'){
                //     // console.log(localStorage.editor_bars)
                //     try {
                //         let ebs = JSON.parse(localStorage.editor_bars);
                //         if(Array.isArray(ebs)){
                //             // for(let i in ebs){
                //             //     if(ebs[i]){
                //             //         this.canvas.editor_bar_manager.add_editor_bar(ebs[i]);
                //             //     }
                //             // }
                //             // this.canvas.chunk_helper.first_calc_chunks(this.canvas)
                //         }
                //         else if(typeof ebs=='object'){
                //             load= ebs;
                //             // this.canvas.chunk_helper.first_calc_chunks(this.canvas)
                //         }
                //         // if(!Array.isArray(this.canvas.editor_bars)){
                //         //     this.canvas.editor_bars=[]
                //         // }
                //     }catch (e){
                //         console.log(e)
                //     }
                // }
            }
            return load;
        }

        // eslint-disable-next-line no-unused-vars
        load_note_paths(noteid:string){
            let load={}
            const obj=storage_get(Tags.get_note_paths_tag(noteid),Util.DataType.Obj)
            if(obj){
                load=obj
            }else{
                // if(typeof localStorage.paths=='string'){
                //     try {
                //         let p = JSON.parse(localStorage.paths);
                //         if(typeof p=='object'){
                //             load=p;
                //         }
                //     }catch (e){
                //         console.log(e)
                //         // this.canvas.editor_bars=[]
                //     }
                // }
            }
            return load;
        }
        // eslint-disable-next-line no-unused-vars
        has_note_saved(noteid:string){
            if(
                storage_get(Tags.get_note_next_editor_bar_id_tag(noteid),Util.DataType.Number)
            ){
                return true;
            }else{
                return false;
            }
        }
        load_note_all_from_buffered(noteid:string){
            const next_editor_bar_id=this.load_note_next_editor_bar_id(noteid)
            const editor_bars=this.load_note_editor_bars(noteid)
            const paths=this.load_note_paths(noteid)
            // console.log("load note all",
            //     next_editor_bar_id,
            //     editor_bars,
            //     paths
            //     )
            return new NoteCanvasFunc.NoteContentData(
                next_editor_bar_id,
                editor_bars,
                paths)
        }
        //根据笔记模式来加载，
        //  如果是绑定文件，则从文件中加载，
        //  如果没绑定，从缓存中加载
        async load_note_all(noteid:string,config:NoteListFuncTs.NoteConfigInfo):Promise<NoteContentData | null>{
            if(config.bind_file){
                try {
                    const loadres=await this._load_note_from_file(config.bind_file)
                    if(loadres){
                        console.log("note load from file")
                        return loadres.note_content_data
                    }
                    ElMessage.error('从绑定的文件中解析数据失败，将从缓存读取')
                }catch (e){
                    console.log(e)
                    ElMessage.error('从绑定的文件中读取数据失败，将从缓存读取，请确保文件权限可读写')
                }
                return this.load_note_all_from_buffered(noteid)
            }else{
                return this.load_note_all_from_buffered(noteid)
            }
        }
        async _load_note_from_file(filepath:string):Promise<NoteStoreToFileStruct | null>{
            const res=await ipcRenderer.invoke(_ipc._channels.read_file_content,filepath)
            if(!res.err){

                const obj=_PaUtilTs.try_parse_json(_PaUtilTs._Conv.UInt8Array2string(res.data))
                if(obj && NoteStoreToFileStruct.check_obj(obj)){
                    return obj
                }
            }
            return null
        }
        save_note_2_file(noteid:string,filepath:string){
            const save=new NoteStoreToFileStruct(noteid,this.load_note_all_from_buffered(noteid))
            ipcRenderer.invoke(_ipc._channels.overwrite_file_str,filepath,JSON.stringify(save)).then(
                ()=>{
                    console.log(noteid,"saved_note_2_file")
                }
            );
        }
        save_note_2_buffer_from_NoteStoreToFileStruct(data:NoteStoreToFileStruct){
            this.save_note_paths(data.note_id,data.note_content_data.paths)
            this.save_note_editor_bars(data.note_id,data.note_content_data.editor_bars)
            this.save_note_next_editor_bar_id(data.note_id,data.note_content_data.next_editor_bar_id)
        }
        save_note_editor_bars(noteid:string,editor_bars:object){
            localStorage[Tags.get_note_editor_bars_tag(noteid)]=JSON.stringify(editor_bars)
        }
        save_note_paths(noteid:string,paths:object){
            localStorage[Tags.get_note_paths_tag(noteid)]=JSON.stringify(paths)
        }
        save_note_next_editor_bar_id(noteid:string,nid:number){
            localStorage[Tags.get_note_next_editor_bar_id_tag(noteid)]=nid
        }
    }
}

export default Storage