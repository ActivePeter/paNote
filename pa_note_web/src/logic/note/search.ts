import {_PaUtilTs} from "@/3rd/pa_util_ts";
import {EditorBar} from "@/components/editor_bar/EditorBarFunc";
import {EditorBarTs} from "@/components/editor_bar/EditorBarTs";

export namespace search {
    export class SearchInCanvas {
        //ui check

        ui_match_case=false
        ui_keyword_any_or_each=true
        searched_bars:any={}//搜索到的文本块id以及内容
        searching = false

        editor_bars_ref: any
        editor_bar_man:undefined|EditorBarTs.EditorBarManager

        left_bar_ids: string[] = []
        interval_handle = -1
        searchregs :string[]= []
        search_time=0
        // searched_bar:any={}//标记id
        init_refs(editor_bars_ref: any,editor_bar_man:EditorBarTs.EditorBarManager) {
            this.clear_search()
            this.editor_bars_ref = editor_bars_ref
            this.editor_bar_man=editor_bar_man
        }

        //搜索任务可能比较费时
        start_search(searchreg: string) {
            this.clear_search()
            if (searchreg == '') {
                return
            }
            this.searchregs=searchreg.split(' ').filter((v)=>{
                return v!=''
            });
            this.searching = true;
            this.left_bar_ids = Object.keys(this.editor_bars_ref)
            this.interval_handle = _PaUtilTs.time_stamp_number()
            // window.setTimeout(() => {
            this.search_some(this.interval_handle)
            // }, 100)
        }
        search_one_word_in_content(word:string,content:string){
            // console.log("word",word)
            // let reg
            if(this.ui_match_case){
                return content.indexOf(word)!=-1
                // reg = new RegExp(word,'i') ;
            }else{
                return content.toUpperCase().indexOf(word.toUpperCase())!=-1
                // reg=new RegExp(word)
            }
            // return reg.test(content)
        }
        search_one_bar(infos:[string,EditorBar]){
            let has=false

            // console.log(this.editor_bar_man?.ebid_to_ebcomp[infos[0]])

            if(this.ui_keyword_any_or_each){
                for(let i=0;i<this.searchregs.length;i++){
                    if(
                        this.search_one_word_in_content(
                            this.searchregs[i],
                            //infos[1].content
                            this.editor_bar_man?.ebid_to_ebcomp[infos[0]].$refs.quill_editor_ref.get_raw_quill().getText()
                        )
                        ){
                        has=true;
                        break;
                    }
                }
            }else{
                has=true
                for(let i=0;i<this.searchregs.length;i++){
                    if(!this.search_one_word_in_content(
                        this.searchregs[i],
                        this.editor_bar_man?.ebid_to_ebcomp[infos[0]].$refs.quill_editor_ref.get_raw_quill().getText()
                        //infos[1].content
                    )){
                        has=false;
                        break;
                    }
                }
            }
            if(has){
                this.searched_bars[infos[0]]=infos[1].content
            }
        }
        search_some(inthand:number) {

            if(inthand!=this.interval_handle){
                return
            }
            if (this.left_bar_ids.length == 0) {
                return;
            }
            const begintime = _PaUtilTs.time_stamp_number()
            // let curtime=begintime;
            while (this.left_bar_ids.length > 0) {
                if(inthand!=this.interval_handle){
                    return
                }
                const pop = this.left_bar_ids.pop()
                if(pop){//处理
                    this.search_time++;
                    this.search_one_bar([pop,this.editor_bars_ref[pop]])
                }
                const curtime = _PaUtilTs.time_stamp_number()
                if(inthand!=this.interval_handle){
                    return
                }
                if (curtime - begintime > 10) {
                    break;
                }
            }
            if(inthand!=this.interval_handle){
                return
            }
            window.setTimeout(() => {
                this.search_some(inthand)
            }, 300)
        }

        clear_search() {
            this.searching = false;
            this.interval_handle=-1;
            this.search_time=0;
            this.searched_bars={}
            // window.clearInterval(this.interval_handle)
        }
    }
}