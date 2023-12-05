class EditorToolHelper{
    tool_bar_on=false
    switch_tool_bar(canvas,state){
        if(canvas){
            this.tool_bar_on=state;
        }
    }
    choose_tool(canvas,args){
        if(canvas){
            console.log("choose_tool",args)
            if(canvas.editing_editor_bar){
                canvas.editing_editor_bar.choose_tool(args);
            }
        }
    }
}
export default {
    EditorToolHelper
}