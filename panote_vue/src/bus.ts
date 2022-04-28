import mitt from "mitt";
import {RightMenuFuncTs} from "@/components/RightMenuFuncTs";

export namespace bus_event_names{
    export const delete_note="delete_note"
    export const start_bind_note_2_file="start_bind_note_2_file" //参数 noteid
    export const open_note_in_main_canvas="open_note_in_main_canvas" //参数 noteid
}

export namespace bus_events{
    interface IEvent{
        event_name:string

        listen(callback:()=>{}):void
        cancel(callback:()=>{}):void
    }
    export namespace note_canvas_data_loaded{
        export class Class implements IEvent{
            call(note_canvas:any){
                bus.emit(this.event_name,note_canvas)
            }

            event_name: string="note_canvas_data_loaded"

            cancel(callback: (note_canvas:any) => {}): void {
                bus.off(this.event_name,callback)
            }

            listen(callback: (note_canvas:any) => {}): void {
                bus.on(this.event_name,callback)
            }
        }
    }
    export namespace note_data_change{
        export class Class implements IEvent{
            call(note_id:string){
                bus.emit(this.event_name,note_id)
            }

            event_name: string="note_data_change"

            cancel(callback: (note_id:string) => {}): void {
                // @ts-ignore
                bus.off(this.event_name,callback)
            }

            listen(callback: (note_id:string) => {}): void {
                // @ts-ignore
                bus.on(this.event_name,callback)
            }
        }
    }
    export namespace right_menu_open{
        export interface IArg{
            event:MouseEvent
            content:RightMenuFuncTs.RightMenuContent
        }
        export class Class implements IEvent{
            call(arg:IArg){
                bus.emit(this.event_name,arg)
            }

            event_name: string="right_menu_open"

            cancel(callback: (arg:IArg) => {}): void {
                // @ts-ignore
                bus.off(this.event_name,callback)
            }

            listen(callback: (arg:IArg) => {}): void {
                // @ts-ignore
                bus.on(this.event_name,callback)
            }
        }
    }
    export const events={
        note_canvas_data_loaded:new note_canvas_data_loaded.Class(),
        note_data_change:new note_data_change.Class(),
        right_menu_open:new right_menu_open.Class()
    }


    // export const cancel_listen_all=()=>{
    //     for(const key in events){
    //         bus.off(events[key].event_name)
    //     }
    // }
}
export const bus=mitt();



