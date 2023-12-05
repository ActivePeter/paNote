import {AppFuncTs} from "@/logic/app_func";
import {ArticleBinderArg, ArticleListArg} from "@/logic/commu/api_caller";
import {note} from "@/logic/note/note";
import App from "@/App.vue";

export namespace _article{
   import NoteHandle = note.NoteHandle;

    export class ArticleManager{//包含note handle的引用，因为notehaddle是
        ebid:string=""
        notehandle:NoteHandle|undefined
        articlename=""
        start_set_bar_article(ebid:string,notehandle:NoteHandle){
            this.articlename=""
            AppFuncTs.get_ctx().uiman_article.start_edit(
                ebid,notehandle,this.articlename
            )
            this.notehandle=notehandle;
            this.ebid=ebid
        }
        upload_article_title(articlename:string):Promise<undefined>{
            return new Promise((resolve => {
                if(this.notehandle){
                    console.log("upload_article_title")
                    AppFuncTs.get_ctx().api_caller.article_binder(
                        new ArticleBinderArg(
                            "bind",
                            articlename,this.ebid,this.notehandle?.note_id
                        ),(reply)=>{
                            console.log("bind article title reply",reply)
                            resolve(undefined)
                        }
                    )
                }else{
                    console.error("upload_article_title no notehandle")
                    resolve(undefined)
                }
            }))

        }
        //在笔记被加载之后
        load_article_list_and_update_ui(noteid:string){
            AppFuncTs.get_ctx().api_caller.article_list(new ArticleListArg(
                noteid
            ),(ret)=>{
                console.log("article list get",ret)
                AppFuncTs.get_ctx().uiman_article.update_article_list(ret.list)
            })
            // AppFuncTs.get_ctx().uiman_article.
        }
    }
}