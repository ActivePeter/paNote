import {AppFuncTs} from "@/AppFunc";

export namespace StorageInterface
{
    export class INoteContentDataChanger{
        constructor(public noteid:string) {
        }
        data_changed(ctx:AppFuncTs.Context){
            ctx.storage_manager.note_data_change(this.noteid)
        }
    }
}