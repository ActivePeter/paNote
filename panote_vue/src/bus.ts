import mitt from "mitt";

export namespace bus_event_names{
    export const delete_note="delete_note"
    export const start_bind_note_2_file="start_bind_note_2_file" //参数 noteid
    export const open_note_in_main_canvas="open_note_in_main_canvas" //参数 noteid
}

export const bus=mitt();


