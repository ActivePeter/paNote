import NoteCanvasFunc from "@/components/NoteCanvasFunc";
import Util from "./Util";
import { ElMessage } from 'element-plus'
// import AppFunc from "@/AppFunc";


/**
 * @param type Number
 * */
let storage_get=(obj_id,type)=>{
    console.log("storage_get",obj_id,localStorage[obj_id])
    if(!localStorage[obj_id]){
        return null
    }
    if(typeof localStorage[obj_id]==='string'){
        try {
            let obj=JSON.parse(localStorage[obj_id])
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
class StorageManager{
    /**
     * @param ctx { AppFunc.Context}
     * */
    PortModule_export_cur_file(ctx){

        if(this.has_note_saved(ctx.cur_open_note_id)){
            let note=this.load_note_all(ctx.cur_open_note_id);
            var FileSaver = require('file-saver');
            var blob = new Blob(
                [JSON.stringify({
                    noteid:ctx.cur_open_note_id,
                    note:note
                })],
                {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, "hello world.txt");
        }else{
            ElMessage({
                message: '选中某个笔记后才能导出',
                type: 'warning',
            })
        }
    }
    PortModule_import_2_cur_file(ctx,file_obj){
        console.log("PortModule_import_2_cur_file",file_obj)
        if(("noteid" in file_obj)&&("note" in file_obj)){

            let nl=ctx.app.app_ref_getter.get_note_list(ctx.app);
            let newid=nl.notelist_manager.add_new_note(ctx)
            this.save_note_editor_bars(newid,file_obj.note.editor_bars);
            this.save_note_next_editor_bar_id(newid,file_obj.note.next_editor_bar_id)
            this.save_note_paths(newid,file_obj.note.paths)
            nl.notelist_manager.open_note(ctx,newid);
        }
    }
    load_notelist(notelist){
        if(localStorage.notelist_store){
            if(typeof localStorage.notelist_store==="string"){
                notelist.notelist_manager.data_to_storage=JSON.parse(
                    localStorage.notelist_store)
            }
        }
    }
    save_notelist(notelist_man){
        localStorage.notelist_store=
            JSON.stringify(notelist_man.data_to_storage)
    }
    get_note_next_editor_bar_id_tag(noteid){
        return "note"+noteid+"_next_editor_bar_id"
    }
    get_note_editor_bars_tag(noteid){
        return "note"+noteid+"_editor_bars"
    }
    get_note_paths_tag(noteid){
        return "note"+noteid+"_paths"
    }
    // eslint-disable-next-line no-unused-vars
    load_note_next_editor_bar_id(noteid){
        let next_editor_bar_id=2000;

        let num=storage_get(this.get_note_next_editor_bar_id_tag(noteid),Util.DataType.Number)
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
    load_note_editor_bars(noteid){
        let load={}
        let obj=storage_get(this.get_note_editor_bars_tag(noteid),Util.DataType.Obj)
        if(obj){
            console.log("load_note_editor_bars",obj);
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
    load_note_paths(noteid){
        let load={}
        let obj=storage_get(this.get_note_paths_tag(noteid),Util.DataType.Obj)
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
    has_note_saved(noteid){
        if(
            storage_get(this.get_note_next_editor_bar_id_tag(noteid),Util.DataType.Number)
        ){
            return true;
        }else{
            return false;
        }
    }
    load_note_all(noteid){
        let next_editor_bar_id=this.load_note_next_editor_bar_id(noteid)
        let editor_bars=this.load_note_editor_bars(noteid)
        let paths=this.load_note_paths(noteid)
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
    save_note_editor_bars(noteid,editor_bars){
        localStorage[this.get_note_editor_bars_tag(noteid)]=JSON.stringify(editor_bars)
    }
    save_note_paths(noteid,paths){
        localStorage[this.get_note_paths_tag(noteid)]=JSON.stringify(paths)
    }
    save_note_next_editor_bar_id(noteid,nid){
        localStorage[this.get_note_next_editor_bar_id_tag(noteid)]=nid
    }
}
export default {
    StorageManager
}