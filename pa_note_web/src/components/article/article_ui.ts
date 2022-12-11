import {AppFuncTs} from "@/logic/AppFunc";

export class ArticleUiMan{
    private get_article_list_ref(){
        this.ctx.ui_refs()
    }
    constructor(private ctx:AppFuncTs.Context) {
    }
    start_edit(_0_edit_1_new:number,
               ebid:string,
               articlename:string){

    }
}