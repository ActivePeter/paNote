import AppFunc, {AppFuncTs} from "@/AppFunc";
// import RightMenuFunc from "@/components/RightMenuFunc";
import EditorBarViewListFunc from "@/components/reuseable/EditorBarViewListFunc";
import {NoteCanvasTs} from "@/components/NoteCanvasTs";
import Storage from "@/storage/Storage";
import {NoteListFuncTs} from "@/components/NoteListFuncTs";
import {bus_events} from "@/bus";
import {RightMenuFuncTs} from "@/components/RightMenuFuncTs";
import {ElMessage} from "element-plus";
import {_ReviewPartSyncAnki} from "@/components/ReviewPartSyncAnki";
import {_PaUtilTs} from "@/3rd/pa_util_ts";
import {note} from "@/note";
// import {NoteContentData} from "@/components/NoteCanvasFunc";




export namespace ReviewPartFunc{
    import Context = AppFuncTs.Context;
    import NoteContentData = note.NoteContentData;

    export class Card{
        id

        //.bartype 相关可看EditorBarViewList
        //   ===1 脑图块
        //   ===0
        front
        back
        constructor(id:string,front:object[],back:object[]) {
            this.id=id;
            this.back=back;
            this.front=front;
        }
    }
   export class CardSet{
        value:string=""
        next_card_id:number=0
        cards:any={}
        constructor(name:string) {
            this.value=name
        }
        static del_card(_this:CardSet,card_key:string):boolean{
            if(card_key in _this.cards){
                delete _this.cards[card_key]
                return true
            }
            return false
        }
        static get_card(_this:CardSet,card_key:string):null|Card{
            if(card_key in _this.cards){
                return _this.cards[card_key]
            }
            return null
        }
        static add_card(_this:CardSet,front:object[],back:object[]){
            if(front.length>0&&back.length>0){
                _this.cards[_this.next_card_id+""]=new Card(_this.next_card_id+"",front,back);
                _this.next_card_id+=1;
                return (_this.next_card_id-1)+"";
            }
            return null;
        }
        static set_card(_this:CardSet,card_key:string,front:object[],back:object[]):boolean{
            if(card_key in _this.cards){
                const card:Card=_this.cards[card_key];
                card.front=front
                card.back=back
                return true
            }
            return false
        }
    }
    export class CardSetManager{//cards data 2 store in one note
        cardsets:any={}

        static get_cardset(_this:CardSetManager,cardset_key:string):CardSet|null{

            if(cardset_key in _this.cardsets){
                return _this.cardsets[cardset_key]
            }
            return null
        }
        static add_card_set(_this:CardSetManager,reviewPartManager:ReviewPartManager,name:string){
            if(name in _this.cardsets){
                return;
            }
            _this.cardsets[name]=new CardSet(name);

            const ctx=reviewPartManager.context
            if(ctx){
                ctx.storage_manager.note_data_change(reviewPartManager.note_id)
                // ctx.storage_manager.
                // memory_holder.hold_note(reviewPartManager.note_id,NoteContentData.of_canvas(ctx.ui_refs().cur_canvas()))
                // // AppFunc.get_ctx()?.storage_manager.buffer_save_note_reviewinfo(reviewPartManager.note_id,reviewPartManager.card_set_man)
                // bus_events.events.note_data_change.call(reviewPartManager.note_id)
            }
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

        static try_change_card(_this:CardSetManager,
                               set:string,
                               card_key:string,
                               front:object[],
                               back:object[]){
            if(set in _this.cardsets){
                return CardSet.set_card(_this.cardsets[set],card_key,front,back);
            }
            return null;
        }
    }

    export class ReviewPartManFromAnkiFunc{
        start_review(note:string,cardset:string,card:string){
            const rpman=this.rpman
            if(rpman.note_id==note&&rpman.selected_card_set==cardset){
                // const _card_set=ReviewPartFunc.CardSetManager.get_cardset(rpman.card_set_man,cardset)
                rpman.reviewing_state.new_review_card_chosen(card,rpman)
                // rpman.reviewing=true
            }
        }
        answer_showned(answer_selections:string[]){
            console.log("answer_showned",answer_selections)
            this.rpman.reviewing_state.show_answer=true
            this.rpman.reviewing_state.answer_selections=answer_selections;
        }
        no_card_to_review(note:string,cardset:string){
            // if(this.rpman.reviewing_state.)
            if(this.rpman.reviewing_state.try_start_review_flag){
                this.rpman.reviewing_state.try_start_review_flag=false;
                ElMessage({
                    message: '当前卡片为空或已经复习完，明天可再进行复习！',
                    type: 'success',
                })
                // 提示当前没有需要复习的卡片

            }
            else if(this.rpman.reviewing_state.is_reviewing()){
                this.rpman.reviewing_state.stop_reviewing()
                //提示已经复习完
                ElMessage({
                    message: '该卡片组今天已经复习完啦！',
                    type: 'success',
                })
            }
        }
        constructor(private rpman:ReviewPartManager) {
        }
    }
    export class ReviewingState{
        card_id=""
        show_answer=false
        answer_selections:string[]=[]//在接收到客户端的answer showned 后修改
        //正面链接了的卡片,用来在复习模式时，隐藏其余卡片
        front_linked_note_ids:any={} //map:string->dum data
        try_start_review_flag=false //接收到复习卡片组为空时如果该标志位为true.则提示当前卡组没有需要复习的卡片。
        stop_reviewing(){
            this.card_id=""
        }
        is_reviewing():boolean{
            return this.card_id!=""
        }
        new_review_card_chosen(id:string,rpman:ReviewPartManager){
            this.card_id=id;
            this.show_answer=false
            this.front_linked_note_ids={}
            this.try_start_review_flag=false
            const selcardset=rpman.get_selected_card_set()
            if(!selcardset){
                console.error("new_review_card_chosen","no selected cardset")
                return
            }
            const front=CardSet.get_card(selcardset,id)?.front
            if(front){
                for(const key in front){
                    const bar_data=front[key] as EditorBarViewListFunc.BarData
                    if(bar_data.bartype==EditorBarViewListFunc.BarType.Link){
                        // @ts-ignore
                        this.front_linked_note_ids[bar_data.linking_info.barid]=0
                    }
                }
            }
        }
    }
    export class ReviewPartManager{
        card_set_man//对notecanvas中的数据的引用
        note_id=""
        note_id_valid():boolean{
            return this.note_id!=""
        }
        selected_card_set=""
        add_new_card__editing_mode=false
        add_new_card__editing_mode_card:null|Card=null
        sync_anki=new _ReviewPartSyncAnki._StoreStruct.Class()
        note_store_part?:NoteCanvasTs.PartOfNoteContentData
        // reviewing=false
        // reviewing_card_id=""
        // reviewing_card_show_answer=false
        reviewing_state=new ReviewingState()

        context:null|AppFuncTs.Context=null
        constructor() {
            this.card_set_man=new CardSetManager()
        }
        f_from_anki(){
            return new ReviewPartManFromAnkiFunc(this)
        }

        mount(ctx:Context){
            this.context=ctx
            _ReviewPartSyncAnki._StoreStruct.Funcs.LifeTime.mount(
                ctx,this
            )
            this.load_data_if_note_opened()
        }

        get_selected_card_set():CardSet|null{
            return CardSetManager.get_cardset(this.card_set_man,this.selected_card_set)
        }
        load_data_if_note_opened(){
            if(!this.context){
                return
            }
            if(this.context.cur_open_note_id=="-1"){
                return;
            }
            const content_data=this.context.cur_open_note_content
            this.selected_card_set=""
            this.note_id=this.context.cur_open_note_id
            this.card_set_man=content_data.part.review_card_set_man
            this.note_store_part=content_data.part
            // reviewing_state=this.reviewing_state
            //检查是否存在，
            if(!this.note_store_part.sync_anki_serialized)
            {
                this.note_store_part.sync_anki_serialized="[]"
            }

            this.sync_anki.operation_queue=_PaUtilTs.DataStructure.ListSerializable.from_string(
                this.note_store_part.sync_anki_serialized
            )
        }
        note_canvas_loaded(canvas:any){
            this.load_data_if_note_opened()
            // const part=NoteCanvasTs.ContentManager.from_canvas(canvas).part_of_storage_data
            // if(part){
            //     this.selected_card_set=""
            //     this.note_id=NoteCanvasTs.ContentManager.from_canvas(canvas).cur_note_id
            //     this.card_set_man=part.review_card_set_man
            //     this.note_store_part=part
            //     NoteCanvasTs.ContentManager.from_canvas(canvas).reviewing_state=this.reviewing_state
            //     //检查是否存在，
            //     if(!part.sync_anki_serialized)
            //     {
            //         part.sync_anki_serialized="[]"
            //     }
            //
            //
            //     this.sync_anki.operation_queue=_PaUtilTs.DataStructure.ListSerializable.from_string(
            //         this.note_store_part.sync_anki_serialized
            //     )
            // }
            // console.log("note_canvas_loaded",canvas,card_set_man)
        }

        static from_review_part(review_part:any):ReviewPartManager{
            return review_part.review_part_man
        }
    }
    export const ReviewPartGuiMode={
        ReviewCards:'review_cards',
        AddCardSet:'add_card_set',
        AddNewCard:'add_new_card',
        EditCard:'edit_card'
    }
    export namespace switch_mode{
        export const edit_card=(review_part:any,cardkey:string)=>{

            //编辑卡片，需要将数据给到子组件里，
            // 可以子组件主动获取，也可以
            const rpman=ReviewPartManager.from_review_part(review_part)
            const selected_card_set=rpman.get_selected_card_set()
            if(selected_card_set){
                const card=CardSet.get_card(selected_card_set,cardkey)
                if(card){
                    review_part.mode=ReviewPartGuiMode.EditCard
                    review_part.review_part_man.add_new_card__editing_mode=true;
                    rpman.add_new_card__editing_mode_card=card

                }
            }
        }
    }
    export const Enum: any = {ReviewPartGuiMode}
    export namespace Funcs{

        //这里的为对数据的操作入口,
        // 若操作成功，会将操作记录到syncanki
        export const final_add_new_card_2_selected_set=(reviewPartManager:ReviewPartManager,front:object[],back:object[])=>{
            const res= ReviewPartFunc.CardSetManager.add_card_to_set(
                reviewPartManager.card_set_man,
                reviewPartManager.selected_card_set,front,back
            )
            if(res){
                _ReviewPartSyncAnki._StoreStruct.Funcs.DataSet.push_new_ope(
                    reviewPartManager,
                    new _ReviewPartSyncAnki._OneOperation.OneOperation(
                        _ReviewPartSyncAnki._OneOperation.OpeType.Add,
                        _PaUtilTs.get_time_stamp(),
                        new _ReviewPartSyncAnki._OneOperation.OpeCard(
                            reviewPartManager.note_id,reviewPartManager.selected_card_set,res
                        )
                    )
                )
            }
            return res;
        }

        export const try_change_card_in_select_set=(reviewPartManager:ReviewPartManager,front:object[],back:object[]):boolean=>{
            if(reviewPartManager.add_new_card__editing_mode_card){
                const res=ReviewPartFunc.CardSetManager.try_change_card(
                    reviewPartManager.card_set_man,
                    reviewPartManager.selected_card_set,reviewPartManager.add_new_card__editing_mode_card.id,
                    front,back
                )
                if(res){
                    return true
                }else{
                    return false
                }
            }
            return false
        }
        export const _try_delete_card_in_select_set=(rpman:ReviewPartManager,cardid:string):boolean=>{
            console.log(rpman)
            const cardset=CardSetManager.get_cardset(rpman.card_set_man,rpman.selected_card_set)
            if(cardset&&CardSet.del_card(cardset,cardid)){
                _ReviewPartSyncAnki._StoreStruct.Funcs.DataSet.push_new_ope(
                    rpman,
                    new _ReviewPartSyncAnki._OneOperation.OneOperation(
                        _ReviewPartSyncAnki._OneOperation.OpeType.Delete,
                        _PaUtilTs.get_time_stamp(),
                        new _ReviewPartSyncAnki._OneOperation.OpeCard(
                            rpman.note_id,rpman.selected_card_set,cardid
                        )
                    )
                )
                return true
            }
            return false
        }
        //编辑数据并且将数据存储到缓存
        export namespace edit_data_with_buffer_change{
            export const final_add_or_edit_card=(review_part:any,front:any[],back:any[])=>{
                const rpman=ReviewPartManager.from_review_part(review_part)
                let res=null
                if(rpman.add_new_card__editing_mode){
                    res=ReviewPartFunc.Funcs.try_change_card_in_select_set(
                        rpman, front, back
                    )
                }else{
                    res = ReviewPartFunc.Funcs.final_add_new_card_2_selected_set(
                        rpman, front, back
                    )
                }
                if (res) {
                    const ctx=rpman.context
                    if(ctx){

                        ctx.storage_manager.note_data_change(rpman.note_id)
                        // ctx.storage_manager.
                        //     memory_holder.hold_note(rpman.note_id,NoteContentData.of_canvas(ctx.ui_refs().cur_canvas()))
                        // // buffer_save_note_reviewinfo(rpman.note_id, rpman.card_set_man)
                        // bus_events.events.note_data_change.call(rpman.note_id)
                        // Storage.ReviewPart.save_all(this.review_part_man)
                        review_part.switch2review_card()
                    }
                } else {
                    ElMessage({
                        message: '无法创建卡片,请检查正反面是否填写完整',
                        type: 'warning',
                    })
                }
            }
            export const try_delete_card_in_select_set=(rpman:ReviewPartManager,cardid:string)=> {
                const ctx=rpman.context
                const res=_try_delete_card_in_select_set(rpman,cardid)
                if(res&&ctx){
                    ctx.storage_manager.note_data_change(rpman.note_id)
                    // ctx.storage_manager.
                    //     memory_holder.hold_note(rpman.note_id,NoteContentData.of_canvas(ctx.ui_refs().cur_canvas()))
                    // // ctx.storage_manager.buffer_save_note_reviewinfo(rpman.note_id,rpman.card_set_man)
                    // ctx.get_notelist_manager()?.pub_set_note_newedited_flag(rpman.note_id)
                }
            }
        }
    }

    export namespace AddNewCard{
        export namespace Funcs{
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
            export const emit_cancel_add_new_card=(rpan:any)=>{
                rpan.$emit("cancel_add_new_card")
            }
            export const emit_final_add_new_card=(rpan:any)=>{
                // frontlist_helper(rpan).bars;
                // frontlist_helper(rpan).rank;
                if(rpan){
                    const front=EditorBarViewListFunc.HelperFuncs.Getteer.get_ranked_bars(frontlist_helper(rpan))
                    const back=EditorBarViewListFunc.HelperFuncs.Getteer.get_ranked_bars(backlist_helper(rpan))

                    rpan.$emit("final_add_new_card",front,back);
                }
            }
        }
    }
    export class AddNewCardHelper{
        front_content:string=""
        set_content_with_card(rpan:any,card:Card){
            const blh=ReviewPartFunc.AddNewCard.Funcs.backlist_helper(rpan)
            const flh=ReviewPartFunc.AddNewCard.Funcs.frontlist_helper(rpan)
            EditorBarViewListFunc.HelperFuncs.Setter.set_bars_directly(blh,card.back)
            EditorBarViewListFunc.HelperFuncs.Setter.set_bars_directly(flh,card.front)
        }
        construct_right_menu(list:any){
            const con=new RightMenuFuncTs.RightMenuContent()
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
