import {NoteCanvasTs} from "@/components/note_canvas/NoteCanvasTs";
import {EditorBar} from "@/components/editor_bar/EditorBarFunc";
import {PathStruct} from "@/components/note_canvas/NoteCanvasFunc";
import {AppFuncTs} from "@/logic/app_func";
import {GetPathInfoArg} from "@/logic/commu/api_caller";
export class PathStructProxy{
    static create(eb:PathStruct){
        return new PathStructProxy(eb)
    }
    set_pos(bx:number, by:number, ex:number, ey:number) {
        const path=this.path
        path.w = Math.abs(bx - ex)
        path.h = Math.abs(by - ey)
        path.ox = Math.min(ex, bx)
        path.oy = Math.min(ey, by)

        path.ex = ex - path.ox;
        path.ey = ey - path.oy;
        path.bx = bx - path.ox;
        path.by = by - path.oy;
        return path
    }
    change_end_pos(ex:number, ey:number) {
        const path=this.path
        // this.path.bx=
        this.set_pos(path.ox + path.bx, path.oy + path.by, ex, ey)
    }
    change_begin_pos(bx:number, by:number) {
        const path=this.path
        this.set_pos(bx, by, path.ox + path.ex, path.oy + path.ey)
    }
    onlydata_update_with_eb(ebid:string,eb:EditorBar){
        // console.log("onlydata_update_with_eb")
        if(this.path.e_bar==ebid){
            this.change_end_pos(eb.pos_x,eb.pos_y)
        }else if(this.path.b_bar==ebid){
            this.change_begin_pos(eb.pos_x,eb.pos_y)
            // this.path.bx=eb.pos_x
            // this.path.by=eb.pos_y
        }else{
            console.error("onlydata_update_with_eb","invalid")
        }
    }
    set_type_by_int(i:number){
        this.path.type=i
    }
    constructor(public path:PathStruct) {
    }
}
export class CanvasPathsProxyMan{
    constructor(private canvas:NoteCanvasTs.NoteCanvasDataReacher) {
    }
    private get_paths(){
        return this.canvas.get_paths()
    }
    private create_path_by_2_eb(ebid1:string,eb1:EditorBar,ebid2:string,eb2:EditorBar){
        let ret=new PathStructProxy(new PathStruct().set_begin(ebid1).set_end(ebid2));
        ret.onlydata_update_with_eb(ebid1,eb1);
        ret.onlydata_update_with_eb(ebid2,eb2);
        return ret;
    }
    gen_path_render_if_2eb_all_rendered(ebid1:string,ebid2:string){
        if(ebid1+","+ebid2 in this.get_paths()){
            return//path is rendered
        }
        console.log("gen path render",ebid1,ebid2)
        let b1=this.canvas.get_editorbar_man().try_get_editor_bar_data_by_ebid(ebid1)
        let b2=this.canvas.get_editorbar_man().try_get_editor_bar_data_by_ebid(ebid2)
        if(b1&&b2){
            let pproxy=this.create_path_by_2_eb(ebid1,b1,ebid2,b2)
            AppFuncTs.get_ctx().api_caller.get_path_info(
                new GetPathInfoArg(this.canvas.get_content_manager().notehandle.note_id,ebid1+"_"+ebid2),
                (r)=>{
                    pproxy.set_type_by_int(r.type_)
                    this.get_paths()[ebid1+","+ebid2]=pproxy.path
            })
        }
    }
    remove_path_render(ebid1:string,ebid:string){
        //todo
    }
}