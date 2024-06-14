import { AppFuncTs } from "@/logic/app_func";
import { note } from "@/logic/note/note";
import App from "@/App.vue";
import { ArticleBinderReq, ArticleListReq, apis } from "../gen_api_content";

export namespace _article {
    import NoteHandle = note.NoteHandle;

    export class ArticleManager {//包含note handle的引用，因为notehaddle是
        ebid: string = ""
        notehandle: NoteHandle | undefined
        articlename = ""
        start_set_bar_article(ebid: string, notehandle: NoteHandle) {
            this.articlename = ""
            AppFuncTs.get_ctx().uiman_article.start_edit(
                ebid, notehandle, this.articlename
            )
            this.notehandle = notehandle;
            this.ebid = ebid
        }
        upload_article_title(articlename: string): Promise<undefined> {
            return new Promise((resolve => {
                if (this.notehandle) {
                    console.log("upload_article_title")

                    apis.article_binder(new ArticleBinderReq(
                        "bind",
                        articlename, this.ebid, this.notehandle?.note_id
                    )).then(r => {
                        console.log("bind article title reply", r)
                        resolve(undefined)
                    })
                } else {
                    console.error("upload_article_title no notehandle")
                    resolve(undefined)
                }
            }))

        }
        //在笔记被加载之后
        load_article_list_and_update_ui(noteid: string) {
            apis.article_list(new ArticleListReq(
                noteid
            )).then(_ret => {
                let ret = _ret.succ()
                if (!ret) {
                    console.error("load article list fail", _ret.fail())
                    return
                }
                console.log("article list get", ret)
                AppFuncTs.get_ctx().uiman_article.update_article_list(ret.list)
            })
            // AppFuncTs.get_ctx().uiman_article.
        }
    }
}