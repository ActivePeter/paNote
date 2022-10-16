
// import {bus, bus_event_names} from "@/bus";
import {RightMenuFuncTs} from "@/components/RightMenuFuncTs";

export namespace NoteListBarTs{
    export const handle_mouse_down=(notelist_bar:any,event:MouseEvent)=>{
        const _this = notelist_bar;
        if(event.button===0){
            _this.click_detector.click((cnt:number) => {
                console.log("click", cnt);
                if (cnt >= 2) {
                    _this.start_edit();
                } else if (cnt == 1) {
                    // bus.emit(bus_event_names.open_note_in_main_canvas,notelist_bar.id)
                    _this.open_note();
                }
            })
        }
        RightMenuFuncTs.if_right_click_then_emit(event, "notelist_bar", _this);
    }
}