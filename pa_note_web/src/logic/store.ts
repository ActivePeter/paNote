// import {NoteConfigInfo} from "@/components/NoteListFuncTs";

import {NoteListFuncTs} from "@/components/NoteListFuncTs";
import {note} from "@/logic/note/note";
// import {NoteContentData} from "@/logic/note/note";

export namespace _store{
    export interface IStorageManager{
        note_data_change(noteid:string):void
        buffer_save_note_review_syncanki(noteid:string,serial:string):void
        save_notelist(notelist:any):void
        load_note_all(noteid:string,config:NoteListFuncTs.NoteConfigInfo):note.NoteContentData|undefined
    }
    export class WebStorageManager implements IStorageManager{
        note_data_change(noteid:string){

        }
        save_notelist(notelist:any){

        }
        buffer_save_note_review_syncanki(noteid: string, serial: string): void {
        }
        load_note_all(noteid:string,config:NoteListFuncTs.NoteConfigInfo):note.NoteContentData|undefined{
            return undefined
        }
    }
}