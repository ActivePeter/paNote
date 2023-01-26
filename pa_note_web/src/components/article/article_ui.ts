import {AppFuncTs} from "@/logic/app_func";
import {note} from "@/logic/note/note";

export class ArticleUiMan{
    private get_article_list_ref(){
        return this.ctx.ui_refs().article_list()
    }
    constructor(private ctx:AppFuncTs.Context) {
    }
    update_article_list(article_list:
                            {barid:string,artname:string,edittime:number}[]){
        this.get_article_list_ref().article_list=article_list;
    }
    cancel(){
        this.get_article_list_ref().inner_edit_bar_article_show=false;
    }
    start_edit(
        ebid:string,notehandle:note.NoteHandle,articlename:string){
        this.get_article_list_ref().start_edit(
            1,ebid,articlename,notehandle
        )
    }
}