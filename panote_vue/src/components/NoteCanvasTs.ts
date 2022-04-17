import {ElMessage} from "element-plus";
// @ts-ignore
import {EditorBar} from "@/components/EditorBarFunc";
import {Gradient} from "@/components/reuseable/Gradient";

export module NoteCanvasTs{
    export class NoteCanvasStateTs{
        gradient_scroll=new Gradient.Common()
    }
    export module EditorBar{
        export const get_editor_bar_data=(canvas:object,editor_bar_id:string)=>{
            // @ts-ignore
            if(editor_bar_id in canvas.editor_bars){
                // @ts-ignore
                return canvas.editor_bars[editor_bar_id]
            }
            return null;
        }
    }
    export module UiData{
        export const scroll_range_rec=(canvas:any)=>{
            return canvas.$refs.range_ref.getBoundingClientRect()
        }
        export const canvas_orgin_client_pos=(canvas:any)=>{
            return canvas.get_content_origin_pos()
        }
    }
    export module UiOperation{
        export module DomOperation{
            export const scroll_move=(canvas:any,dx:number,dy:number)=>{
                canvas.state_ts.gradient_scroll.start_walk(
                    [canvas.$refs.range_ref.scrollLeft,canvas.$refs.range_ref.scrollTop],
                    [canvas.$refs.range_ref.scrollLeft+dx,canvas.$refs.range_ref.scrollTop+dy],
                    10,(nums:number[])=>{
                        canvas.$refs.range_ref.scrollLeft=nums[0]
                        canvas.$refs.range_ref.scrollTop=nums[1]
                    }
                )
                // canvas.$refs.range_ref.scrollLeft += dx;
                // canvas.$refs.range_ref.scrollTop+=dy;
            }
        }
        export const final_set_scale=(canvas:any,scale:number,mouse_event:MouseEvent)=>{
            if(canvas.$refs.range_ref){
                const range_rec = canvas.$refs.range_ref.getBoundingClientRect();
                //缩放之后要修改滚动偏移
                const scale_beginx=range_rec.left
                    -canvas.$refs.range_ref.scrollLeft
                    +canvas.edge_size_w;
                const scale_beginy=range_rec.top
                    -canvas.$refs.range_ref.scrollTop
                    +canvas.edge_size_h;
                const msbx=mouse_event.clientX-scale_beginx
                const msby=mouse_event.clientY-scale_beginy

                canvas.$refs.range_ref.scrollLeft-=((msbx)/scale- (msbx)/canvas.scale)*scale;
                canvas.$refs.range_ref.scrollTop-=((msby)/scale- (msby)/canvas.scale)*scale;
                // console.log(mouse_event.clientX,scale_beginx)

                // canvas.$refs.range_ref.scrollLeft+=(mouse_event.clientX-scale_beginx)*(canvas.scale-scale)
                // canvas.$refs.range_ref.scrollTop-=(mouse_event.clientY-scale_beginy)*(canvas.scale-scale)
                //
                canvas.scale = scale;
            }

            // x:
            //     range_rec.left //滚动显示范围边界
            //     - canvas.$refs.range_ref.scrollLeft//滚动偏移量
            //     +canvas.edge_size_w +
            //     canvas.padding_add_left * canvas.scale,
            //         y:
            // range_rec.top -
            // this.$refs.range_ref.scrollTop +
            // this.edge_size_h +
            // this.padding_add_up * this.scale,
        }
        export const locate_editor_bar=(canvas:any, editor_bar_id:string)=>{
            console.log("locate_editor_bar",editor_bar_id)
            const bar_data=EditorBar.get_editor_bar_data(canvas,editor_bar_id)

            const locate=(bar_data:EditorBar)=>{

                const range_rec = UiData.scroll_range_rec(canvas) ;

                //区域中心 client坐标
                const mid_y = (range_rec.top + range_rec.bottom) / 2;
                const mid_x = (range_rec.left + range_rec.right) / 2;

                const origin_pos = UiData.canvas_orgin_client_pos(canvas);
                const bar_client_pos={
                    x:origin_pos.x+(bar_data.pos_x+(bar_data.width)/2)*canvas.scale,
                    y:origin_pos.y+(bar_data.pos_y+(bar_data.height)/2)*canvas.scale
                }
                const dx = bar_client_pos.x- mid_x;
                const dy = bar_client_pos.y-mid_y;
                DomOperation.scroll_move(canvas,dx,dy)

            }

            if(bar_data){
                console.log("add_editor_bar");
                locate(bar_data)
            }else{
                ElMessage({
                    message: '没有在脑图中找到对应的板块',
                    type: 'warning',
                })
            }
        }
    }
}