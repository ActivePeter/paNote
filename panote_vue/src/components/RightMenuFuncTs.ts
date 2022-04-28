import {bus_events} from "@/bus";

export namespace RightMenuFuncTs{

    export const if_right_click_then_emit_bus=(event:MouseEvent,right_menu_content:RightMenuContent)=>{
        if(event.button===2){
            bus_events.events.right_menu_open.call({content: right_menu_content, event})
            // obj.$emit("right_menu", event, tag,obj);
        }
    }
    export const if_right_click_then_emit=(event:MouseEvent,tag:string,obj:any)=>{
        if(event.button===2){
            obj.$emit("right_menu", event, tag,obj);
        }
    }
    export const continue_emit=(event:MouseEvent,tag:string,obj:any,med:any)=>{
        med.$emit("right_menu", event, tag,obj);
    }
    export class RightMenuContent{
        arr:any=[]
        add_one_selection(text:string,callback:()=>void){
            this.arr.push({
                text:text,
                callback:callback
            })
        }
    }
}

