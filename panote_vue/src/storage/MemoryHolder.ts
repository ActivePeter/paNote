// import {NoteContentData} from "@/components/NoteCanvasFunc";

import {note} from "@/note";
import NoteContentData = note.NoteContentData;

export class MemoryHolder{
    _changed_notes:any={}//noteid - note datas
    //未写入文件，持有note，
    hold_note(noteid:string,dt:NoteContentData){
        this._changed_notes[noteid]=dt
    }

    //取出hold的note 引用，取出后必须存储
    cosume_holded_note(noteid:string):NoteContentData|null{
        if(noteid in this._changed_notes){
            const ret=this._changed_notes[noteid]
            delete this._changed_notes[noteid]

            return ret
        }
        return null
    }
}