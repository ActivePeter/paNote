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
        if(AppFunc.get_ctx()?.app){
            const app=AppFunc.get_ctx()?.app


            const con=this.construct_right_menu(list);
            app.app_ref_getter.get_right_menu(app)
                .right_menu(event,"review_part_add_new_card",con)
        }
    }
}
class Card{
    id
    front
    back
    constructor(id:string,front:object[],back:object[]) {
        this.id=id;
        this.back=back;
        this.front=front;
    }
}
class CardSet{
    value:string=""
    next_card_id:number=0
    cards:object={}
    constructor(name:string) {
        this.value=name
    }
    add_card(front:object[],back:object[]){
        if(front.length>0&&back.length>0){
            // @ts-ignore
            this.cards[this.next_card_id+""]=new Card(this.next_card_id+"",front,back);
            this.next_card_id+=1;
            return (this.next_card_id-1)+"";
        }
        return null;
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

    add_card_to_set(set:string,front:object[],back:object[]){
        if(set in this.cardsets){
            return this.cardsets[set].add_card(front,back);
        }
        return null;
    }
}
export class ReviewPartManager{
    card_set_man
    selected_card_set=""
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
    export const final_add_new_card_2_selected_set=(reviewPartManager:ReviewPartManager,front:object[],back:object[])=>{
        return reviewPartManager.card_set_man.add_card_to_set(reviewPartManager.selected_card_set,front,back);
    }

    export namespace AddNewCard{
        export const Class={
            AddNewCardHelper
        }
        export namespace Funcs{
            export namespace Rpan{
                export const helper=(rpan:any):AddNewCardHelper=>{
                    return rpan.helper
                }
                export const frontlist_helper=(rpan:any):EditorBarViewListFunc.EditorBarViewListHelper=>{
                    // if(rpan){
                        return  rpan.$refs.front_list.helper
                }
                export const backlist_helper=(rpan:any):EditorBarViewListFunc.EditorBarViewListHelper=>{
                    // if(rpan){
                        return  rpan.$refs.back_list.helper
                    // }else{
                    //     return null
                    // }
                }
            }
            export const emit_cancel_add_new_card=(rpan:any)=>{
                rpan.$emit("cancel_add_new_card")
            }
            export const emit_final_add_new_card=(rpan:any)=>{
                // frontlist_helper(rpan).bars;
                // frontlist_helper(rpan).rank;
                if(rpan){
                    const front=EditorBarViewListFunc.HelperFuncs.Getteer.get_ranked_bars(Rpan.frontlist_helper(rpan))
                    const back=EditorBarViewListFunc.HelperFuncs.Getteer.get_ranked_bars(Rpan.backlist_helper(rpan))

                    rpan.$emit("final_add_new_card",front,back);
                }
            }
        }
    }
}
export default {
    ReviewPartManager,
    ReviewPartGuiMode,
    AddNewCardHelper
}