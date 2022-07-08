import {NoteOutlineTs} from "@/components/NoteOutlineTs";
import {NoteCanvasTs} from "@/components/NoteCanvasTs";

export namespace note{
    import OutlineStorageStruct = NoteOutlineTs.OutlineStorageStruct;

    export class NoteHandle{
        constructor(
            public note_id:string,
            public content_data:NoteContentData
        ) {
        }
        static create(
            note_id:string,
            content_data:NoteContentData):NoteHandle{
            return new NoteHandle(note_id,content_data)
        }
    }
    //会被直接序列化到文件中的结构
    export class NoteContentData{
        static fix_old_version(data:NoteContentData){
            if(!data.part.note_outline){
                data.part.note_outline=new NoteOutlineTs.OutlineStorageStruct()
            }
            //outline_data
            OutlineStorageStruct.fix_old(data.part.note_outline)
        }

        next_editor_bar_id=1000
        editor_bars={}
        paths={}
        part=new NoteCanvasTs.PartOfNoteContentData()
        static get_default(){
            return new NoteContentData(1000,{},{})
        }
        static of_canvas(canvas:any){
            const ret=new NoteContentData(
                canvas.next_editor_bar_id,
                canvas.editor_bars,
                canvas.paths)
            if(canvas.content_manager.part_of_storage_data){
                ret.part=canvas.content_manager.part_of_storage_data
            }
            return ret
        }

        constructor(next_editor_bar_id:number,editor_bars:any,paths:any) {
            this.next_editor_bar_id=next_editor_bar_id
            this.editor_bars=editor_bars
            this.paths=paths
        }
    }
}