class RightMenuContent{
    arr=[]
    add_one_selection(text,callback){
        this.arr.push({
            text:text,
            callback:callback
        })
    }
}

export default {
    if_right_click_then_emit(event,tag,obj){
        if(event.buttons===2){
            obj.$emit("right_menu", event, tag,obj);
        }
    },
    continue_emit(event,tag,obj,med){
        med.$emit("right_menu", event, tag,obj);
    },
    RightMenuContent,
}