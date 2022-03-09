import AppFunc from "@/AppFunc";
import RightMenuFunc from "@/components/RightMenuFunc";
import EditorBarViewListFunc from "@/components/reuseable/EditorBarViewListFunc";
class AddNewCardHelper{
    front_content:string=""
    construct_right_menu(list:any){
        const con=new RightMenuFunc.RightMenuContent()
        const list_helper:EditorBarViewListFunc.EditorBarViewListHelper=list.helper

        con.add_one_selection("添加文本段",()=>{
            EditorBarViewListFunc.HelperFuncs.AddDelete.add_text_bar(list_helper)
        })
        con.add_one_selection("连接脑图文本块",()=>{
            EditorBarViewListFunc.HelperFuncs.AddDelete.add_link_bar(list_helper)
        })

        return con;
    }
    add_btn_click(list:any,event:MouseEvent){
        console.log("add btn",AppFunc.get_ctx())
        if(AppFunc.get_ctx().app){
            const app=AppFunc.get_ctx().app


            const con=this.construct_right_menu(list);
            app.app_ref_getter.get_right_menu(app)
                .right_menu(event,"review_part_add_new_card",con)
        }
    }
}
class CardSet{
    value:string=""
    next_card_id:Number=0
    cards:any={}
    constructor(name:string) {
        this.value=name
    }
}

class CardSetManager{
    cardsets:any={}//:Map<string,CardSet>=new Map();
    add_card_set(name:string){
        if(name in this.cardsets){
            return;
        }
        this.cardsets[name]=new CardSet(name);
    }

    // eslint-disable-next-line no-unused-vars
    new_card_in_card_set(cardfront:Object,cardback:Object){

    }
}
class ReviewPartManager{
    card_set_man
    constructor() {
        this.card_set_man=new CardSetManager()
    }
}
const ReviewPartGuiMode={
    ReviewCards:'review_cards',
    AddCardSet:'add_card_set',
    AddNewCard:'add_new_card'
}
export namespace ReviewPartFuncNew{
    export const Enum: any = {ReviewPartGuiMode}
    export namespace AddNewCard{
        export const Class={
            AddNewCardHelper
        }
        export namespace Funcs{
            export const emit_cancel_add_new_card=(rpan:any)=>{
                rpan.$emit("cancel_add_new_card")
            }
        }
    }
}
export default {
    ReviewPartManager,
    ReviewPartGuiMode,
    AddNewCardHelper
}