import {bus_events} from "@/bus";

export namespace RightMenuFuncTs{
    export class Ope{
        constructor(private comp:any) {}
        static with(comp:any):Ope{
            return new Ope(comp)
        }
        ////右键菜单bus回调
        on_bus_right_menu(args:bus_events.right_menu_open.IArg){
            console.log("bus_right_menu",args.event.clientX,args.event.clientY)
            this.comp.show=true;
            this.comp.pos_x=args.event.clientX
            this.comp.pos_y=args.event.clientY
            this.comp.content=args.content.arr
        }
    }
    export const emitbus=(event:MouseEvent,right_menu_content:RightMenuContent)=>{
        bus_events.events.right_menu_open.call({content: right_menu_content, event})
    }
    export const if_right_click_then_emit_bus=(event:MouseEvent,right_menu_content:RightMenuContent)=>{
        if(event.button===2){
            console.log("if_right_click_then_emit_bus")
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
        add_one_selection(text:string,callback:()=>void):RightMenuContent{
            this.arr.push({
                text:text,
                callback:callback
            })
            return this
        }
        static create(){
            return new RightMenuContent()
        }
    }
}

