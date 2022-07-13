import {RightMenuFuncTs} from "@/components/RightMenuFuncTs";
import {ReviewPartFunc} from "@/components/ReviewPartFunc";

export namespace ReviewPartCardFunc{
    export const construct_right_menu=(review_part:any,review_part_card:any)=>{
        const rpman=ReviewPartFunc.ReviewPartManager.from_review_part(review_part)
        //删除
        //编辑
        const content=new RightMenuFuncTs.RightMenuContent()
        content.add_one_selection("删除",()=>{
            rpman.del_card_curset(review_part_card.card_key)
            // ReviewPartFunc.Funcs.edit_data_with_buffer_change.try_delete_card_in_select_set(
            //     rpman,review_part_card.card_key)
        })
        content.add_one_selection("编辑",()=>{
            ReviewPartFunc.switch_mode.edit_card(review_part,review_part_card.card_key)
        })
        return content
    }
}