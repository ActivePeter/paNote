import {NoteCanvasTs} from "@/components/note_canvas/NoteCanvasTs";
import {EditorBarTs} from "@/components/editor_bar/EditorBarTs";

export namespace EditorToolTs{
    export class EditorToolState{
        show=false
        editor_sel={
            index:0,
            length:0
        }//在打开工具栏前保存
        editor_delta:any=null
        constructor(public ui:NoteCanvasTs.UserInteract) {
        }
        clear_sel_rec(){
            this.editor_sel={
                index:0,
                length:0
            }
            this.editor_delta=null
        }
        editor_tool_isshow():boolean{
            return this.ui.canvas.getref_toolbar().is_show
        }
        get_editingeb():null|EditorBarTs.EditorBarCompProxy{
            return this.ui.canvas.get_editorbar_man().editing_ebproxy
        }
        do_select(toolcomp:any):boolean{
            const g=toolcomp.get_select()
            if(g){
                //传递到editorbar里的choosetool函数
                // this.$emit("choose_tool", g);
                this.applyset(g)
                this.hide()
                // this.canvasdr.get_content_manager().user_interact.toolbar_apply(g)
                // this.canvasdr.get_content_manager().user_interact.toolbar_hide()
                return true;
            }else{
                return false;
            }
        }
        before_show_toolbar(){
            const ebp=this.get_editingeb()
            this.editor_sel=
                ebp?.get_quill().getSelection()
            this.editor_delta=
                ebp?.get_quill().getContents()
            ebp?.update_sel_bound_by_range(this.editor_sel)
            ebp?.fakeselection_show()
        }
        tryswitchshown(){
            const canvas=this.ui.canvas
            if (canvas.get_editorbar_man().editing_ebproxy) {
                const rc=canvas.notecanvas
                if(!this.editor_tool_isshow()){
                    this.before_show_toolbar()
                }
                this.show=
                    rc.$refs.editor_tool_ref.switch_show_tool_bar(
                        rc,
                        canvas.get_editorbar_man().editing_ebproxy?.comp
                    );
                // if(this.show){
                //
                //     // ebp?.get_ref_quill().
                // }
            }
        }
        hide(){
            const rc=this.ui.canvas.notecanvas
            rc.$refs.editor_tool_ref.hide_tool_bar()
            this.show=false
            // this.applyafterhide()
            // this.applyafterhide=()=>{}
        }
        //eb使能（停止编辑）后调用
        apply_ifexist(){
            this.applyafterhide()
            this.applyafterhide=()=>{}
        }
        applyafterhide=()=>{}
        applyset(select:any){
            console.log("toolbar_apply",select)
            const ebp=this.ui.canvas.get_editorbar_man().editing_ebproxy
            if(ebp){
                this.applyafterhide=()=>{
                    ebp.apply_toolset(select)
                }
            }
        }
        move(move:number){
            if(move>0){
                this.ui.canvas.getref_toolbar().select_down()
            }
            else
            {
                this.ui.canvas.getref_toolbar().select_up()
            }
        }
        spec_unmount(quill_sel:any){

            // if(quill_sel){
            //     const q=this.canvas.get_editorbar_man().editing_ebproxy
            //         ?.get_quill_proxy()
            //     console.log(q)
            //     q?.get_selection()
            //     // if(q?.is_blur()){
            //     //     q?.set_selection(quill_sel.index,
            //     //         quill_sel.length)
            //     // }
            // }
        }
    }
}