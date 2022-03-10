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