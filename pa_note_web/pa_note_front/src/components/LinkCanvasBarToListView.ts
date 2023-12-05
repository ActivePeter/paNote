import EditorBarViewListFunc from "@/components/reuseable/EditorBarViewListFunc";

export namespace LinkCanvasBarToListView{
    export class LinkBarToListView{
        linking_list_helper:null|EditorBarViewListFunc.EditorBarViewListHelper=null
        is_linking:Boolean=false
        start_link(listhelper:EditorBarViewListFunc.EditorBarViewListHelper){
            this.is_linking=true;
            this.linking_list_helper=listhelper
        }
        end_link(){
            this.is_linking=false;
            this.linking_list_helper=null
        }
        link_canvas_bar(canvas:any,bar:any){
            if(this.linking_list_helper){
                EditorBarViewListFunc.HelperFuncs.Linking.link_canvas_bar_2_list_bar(
                    canvas,bar,this.linking_list_helper
                )
            }
        }
    }
}