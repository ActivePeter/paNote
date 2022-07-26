// @ts-ignore
import $ from "jquery";
import AppFunc from "@/AppFunc";
import {NoteCanvasTs} from "@/components/NoteCanvasTs";

module EditorBarViewListFunc{
     export class EditorBarViewListHelper{
        bars:any=[]
        rank:any=[]
         linkingbar_id:number=-1
         //for link
         linkingbar:null|BarData=null
         //for drag
        offset:any=[]
        draggingbar:any=null
        draggingbar_height=0
        start_drag_event:MouseEvent|null=null
         // linking_bar=null

         static from_EditorBarViewList(editor_bar_view_list:any){
            return editor_bar_view_list.helper
         }
        bar_start_drag(list:any,bar:any,event:MouseEvent){
            console.log("bar_start_drag")

            this.draggingbar=bar

            const bar_id=this.rank[this.draggingbar.index]

            this.draggingbar_height=
                list.$refs['bar'+bar_id][0].$el.offsetHeight
            console.log(this.draggingbar_height)
                // $("#bar"+this.draggingbar.index).height()

            this.start_drag_event=event;
        }
        bar_end_drag(){
            // console.log("bar_end_drag")
            if(this.draggingbar){
                this.draggingbar.trans(0,0)
                const cpy=this.rank[this.draggingbar.index]
                let tar=-1;
                for(let i=this.rank.length;i>=0;i--){
                    if(this.offset[i]===1){
                        this.rank[i+1]=this.rank[i]
                            tar=i;
                    }
                }
                for(let i=0;i<this.rank.length;i++){
                     if(this.offset[i]===-1){
                        this.rank[i-1]=this.rank[i]
                            tar=i
                    }
                    this.offset[i]=0
                }
                if(tar!==-1){
                    this.rank[tar]=cpy
                }
                // console.log(this.rank)
                this.draggingbar=null
            }
            // for(let i=0;i<this.offset.length;i++){
            //     this.offset[i]=0
            // }
            // this.draggingbar=null;
        }
        mouse_move(list:any,event:MouseEvent){
            if(this.draggingbar&&this.start_drag_event){
                const dx=event.clientX-this.start_drag_event.clientX
                const dy=event.clientY-this.start_drag_event.clientY
                this.draggingbar.trans(dx,dy)

                let height_sum=0;
                for(let i=this.draggingbar.index-1;i>=0;i--){
                    // console.log(list.$refs.)
                    const bar_id=this.rank[i]
                    height_sum+=
                        // $("#bar"+i).height()
                        list.$refs['bar'+bar_id][0].$el.offsetHeight
                    // console.log(dy,height_sum)
                    if(-dy>height_sum){
                        this.offset[i]=1
                    }else{
                        this.offset[i]=0
                    }
                }

                 height_sum=0;
                for(let i=this.draggingbar.index+1;
                    i<this.bars.length;i++){
                    // console.log(list.$refs.)

                    const bar_id=this.rank[i]
                    height_sum+=
                        // $("#bar"+i).height()
                        list.$refs['bar'+bar_id][0].$el.offsetHeight
                    // height_sum+= $("#bar"+bar_id).height()
                    // list.$refs['bar'+i].offsetHeight
                    // console.log(dy,height_sum)
                    if(dy>height_sum){
                        this.offset[i]=-1
                    }else{
                        this.offset[i]=0
                    }
                }
            }
        }
        mouse_up(list:any,event:MouseEvent){
            this.bar_end_drag()
        }
        constructor() {
        }
    }
    export const BarType={
         Text:0,
        Link:1,
    }
    export class LinkingInfo{
        noteid
        barid
        constructor(noteid:string,barid:string) {
            this.barid=barid
            this.noteid=noteid
        }
    }
    export class BarData{
         text
        bartype
        linking_info:null|LinkingInfo=null
        constructor(text:string|null,bartype:number) {
             this.text=text
            this.bartype=bartype
        }
    }
     export namespace HelperFuncs{
         export namespace Setter{
             export const set_bars_directly=(helper:EditorBarViewListHelper,bars:object[])=>{
                 helper.bars=bars;
                 helper.rank=[];
                 helper.offset=[];
                 for(let i=0;i<helper.bars.length;i++){
                     helper.rank.push(i);
                     helper.offset.push(0);
                 }
             }
         }
         export namespace Getteer{
             export const get_ranked_bars=(helper:EditorBarViewListHelper)=>{
                 const final=[]
                 for(let i=0;i<helper.rank.length;i++){
                     final.push(helper.bars[helper.rank[i]]);
                 }
                 return final;
             }
         }
        export namespace AddDelete{
            export const add_text_bar=(helper:EditorBarViewListHelper)=>{
                helper.bars.push(
                    new BarData("new",BarType.Text)
                    // {text:"new"}
                )
                helper.rank.push( helper.bars.length-1)
                helper.offset.push(0)
            }
            export const add_link_bar=(helper:EditorBarViewListHelper)=>{
                helper.bars.push(
                    new BarData(null,BarType.Link)
                    // {text:"new"}
                )
                helper.rank.push( helper.bars.length-1)
                helper.offset.push(0)
                Linking.set_linking_list_bar(helper.bars.length-1,helper)
                // helper.linking_bar=helper.bars[helper.bars.length-1]
            }

        }
        export namespace Linking{
            export const set_linking_list_bar=(bar_idx:number,helper:EditorBarViewListHelper)=>{
                const canvas=AppFunc.get_ctx()?.app.app_ref_getter.get_note_canvas(AppFunc.get_ctx()?.app)
                canvas.content_manager.linkBarToListView.start_link(helper)
                // helper.linkingbar=bar;
                helper.linkingbar_id=bar_idx;
            }
            export const try_stop_linking_list_bar=(helper:EditorBarViewListHelper)=>{
                if(!(helper.linkingbar_id>-1&&helper.bars[helper.linkingbar_id].linking_info)){
                    return false;
                }
                console.log("stop_linking_list_bar")
                const canvas=AppFunc.get_ctx()?.app.app_ref_getter.get_note_canvas(AppFunc.get_ctx()?.app)
                canvas.content_manager.linkBarToListView.end_link();

                helper.linkingbar_id=-1;

                return true;
            }
            export const cancel_linking_list_bar=(helper:EditorBarViewListHelper)=>{
                console.log("stop_linking_list_bar")
                const canvas=AppFunc.get_ctx()?.app.app_ref_getter.get_note_canvas(AppFunc.get_ctx()?.app)
                canvas.content_manager.linkBarToListView.end_link();
                if(helper.linkingbar_id>-1){
                    helper.bars[helper.linkingbar_id]
                    // helper.linkingbar
                        .linking_info=null;
                    helper.linkingbar_id=-1;
                }
            }
            export const link_canvas_bar_2_list_bar=(canvas:any,canvas_bar:any,helper:EditorBarViewListHelper)=>{
                if(helper.linkingbar_id>-1){
                    const canvasp=NoteCanvasTs.NoteCanvasDataReacher.create(canvas);
                    helper.bars[helper.linkingbar_id].linking_info=new LinkingInfo(
                        canvasp.get_content_manager().cur_note_id,canvas_bar.ebid
                    )
                }
            }
        }
    }
}
export default EditorBarViewListFunc