import AppFunc from "@/AppFunc";
import RightMenuFunc from "@/components/RightMenuFunc";
import EditorBarViewListFunc from "@/components/reuseable/EditorBarViewListFunc";
import {NoteCanvasTs} from "@/components/NoteCanvasTs";
import Storage from "@/storage/Storage";
import {NoteListFuncTs} from "@/components/NoteListFuncTs";
import {bus_events} from "@/bus";




export namespace ReviewPartFunc{
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
        static add_card(_this:CardSet,front:object[],back:object[]){
            if(front.length>0&&back.length>0){
                // @ts-ignore
                _this.cards[_this.next_card_id+""]=new Card(_this.next_card_id+"",front,back);
                _this.next_card_id+=1;
                return (_this.next_card_id-1)+"";
            }
            return null;
        }
    }
    export class CardSetManager{//cards data 2 store in one note
        cardsets:any={}//:Map<string,CardSet>=new Map();

        static add_card_set(_this:CardSetManager,reviewPartManager:ReviewPartManager,name:string){
            if(name in _this.cardsets){
                return;
            }
            _this.cardsets[name]=new CardSet(name);
            AppFunc.get_ctx()?.storage_manager.buffer_save_note_reviewinfo(reviewPartManager.note_id,reviewPartManager.card_set_man)
            bus_events.events.note_data_change.call(reviewPartManager.note_id)
        }



        static add_card_to_set(_this:CardSetManager,
                               set:string,
                               front:object[],
                               back:object[]
        ){
            if(set in _this.cardsets){
                return CardSet.add_card(_this.cardsets[set],front,back);
            }
            return null;
        }
    }

    export class ReviewPartManager{
        card_set_man//对notecanvas中的数据的引用
        note_id=""
        selected_card_set=""
        constructor() {
            this.card_set_man=new CardSetManager()
        }
        note_canvas_loaded(canvas:any){
            const part=NoteCanvasTs.ContentManager.from_canvas(canvas).part_of_storage_data
            if(part){
                this.selected_card_set=""
                this.note_id=NoteCanvasTs.ContentManager.from_canvas(canvas).cur_note_id
                this.card_set_man=part.review_card_set_man
            }
            // console.log("note_canvas_loaded",canvas,card_set_man)
        }
    }
    export const ReviewPartGuiMode={
        ReviewCards:'review_cards',
        AddCardSet:'add_card_set',
        AddNewCard:'add_new_card'
    }
    export class AddNewCardHelper{
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
}
export namespace ReviewPartFuncNew{
    import ReviewPartGuiMode = ReviewPartFunc.ReviewPartGuiMode;
    import ReviewPartManager = ReviewPartFunc.ReviewPartManager;
    import AddNewCardHelper = ReviewPartFunc.AddNewCardHelper;

    export const Enum: any = {ReviewPartGuiMode}
    export const final_add_new_card_2_selected_set=(reviewPartManager:ReviewPartManager,front:object[],back:object[])=>{
        return ReviewPartFunc.CardSetManager.add_card_to_set(
            reviewPartManager.card_set_man,
            reviewPartManager.selected_card_set,front,back
        )
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
