// @ts-ignore
import $ from "jquery";
import AppFunc from "@/AppFunc";

module EditorBarViewListFunc{
     export class EditorBarViewListHelper{
        bars:any=[]

         //for link
         linkingbar:null|BarData=null
         //for drag
        offset:any=[]
        draggingbar:any=null
        draggingbar_height=0
        start_drag_event:MouseEvent|null=null
         // linking_bar=null
        bar_start_drag(list:any,bar:any,event:MouseEvent){
            console.log("bar_start_drag")

            this.draggingbar=bar
            this.draggingbar_height=
                list.$refs['bar'+this.draggingbar.index][0].$el.offsetHeight
            console.log(this.draggingbar_height)
                // $("#bar"+this.draggingbar.index).height()

            this.start_drag_event=event;
        }
        bar_end_drag(){
            console.log("bar_end_drag")
            if(this.draggingbar){
                this.draggingbar.trans(0,0)
                const cpy=this.bars[this.draggingbar.index]
                let tar=-1;
                for(let i=this.bars.length;i>=0;i--){
                    if(this.offset[i]===1){
                        this.bars[i+1]=this.bars[i]
                            tar=i;
                    }
                }
                for(let i=0;i<this.bars.length;i++){
                     if(this.offset[i]===-1){
                        this.bars[i-1]=this.bars[i]
                            tar=i
                    }
                    this.offset[i]=0
                }
                if(tar!==-1){
                    this.bars[tar]=cpy
                }
                console.log(this.bars)
                this.draggingbar=null
            }
        }
        mouse_move(list:any,event:MouseEvent){
            if(this.draggingbar&&this.start_drag_event){
                const dx=event.clientX-this.start_drag_event.clientX
                const dy=event.clientY-this.start_drag_event.clientY
                this.draggingbar.trans(dx,dy)

                let height_sum=0;
                for(let i=this.draggingbar.index-1;i>=0;i--){
                    // console.log(list.$refs.)

                    height_sum+=
                        // $("#bar"+i).height()
                        list.$refs['bar'+i][0].$el.offsetHeight
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

                    height_sum+= $("#bar"+i).height()
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
        export namespace AddDelete{
            export const add_text_bar=(helper:EditorBarViewListHelper)=>{
                helper.bars.push(
                    new BarData("new",BarType.Text)
                    // {text:"new"}
                )
                helper.offset.push(0)
            }
            export const add_link_bar=(helper:EditorBarViewListHelper)=>{
                helper.bars.push(
                    new BarData(null,BarType.Link)
                    // {text:"new"}
                )
                helper.offset.push(0)
                Linking.set_linking_list_bar(helper.bars[helper.bars.length-1],helper)
                // helper.linking_bar=helper.bars[helper.bars.length-1]
            }

        }
        export namespace Linking{
            export const set_linking_list_bar=(bar:BarData,helper:EditorBarViewListHelper)=>{
                const canvas=AppFunc.get_ctx().app.app_ref_getter.get_note_canvas(AppFunc.get_ctx().app)
                canvas.content_manager.linkBarToListView.start_link(helper)
                helper.linkingbar=bar;
            }
            export const stop_linking_list_bar=(helper:EditorBarViewListHelper)=>{
                console.log("stop_linking_list_bar")
                const canvas=AppFunc.get_ctx().app.app_ref_getter.get_note_canvas(AppFunc.get_ctx().app)
                canvas.content_manager.linkBarToListView.end_link();
                helper.linkingbar=null;
            }
            export const link_canvas_bar_2_list_bar=(canvas:any,canvas_bar:any,helper:EditorBarViewListHelper)=>{
                if(helper.linkingbar){
                    helper.linkingbar.linking_info=new LinkingInfo(
                        canvas.content_manager.cur_note_id,canvas_bar.ebid
                    )
                }
            }
        }
    }
}
export default EditorBarViewListFunc