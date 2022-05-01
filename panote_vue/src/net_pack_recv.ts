import {_PaUtilTs} from "@/3rd/pa_util_ts";
import {bus} from "@/bus";
import {_ipc} from "@/ipc";

export namespace NetPackRecv{
    export const handle=(data:string)=>{
        const obj=_PaUtilTs.try_parse_json(data)
        if(obj){
            for(const key in consumers){
                if(consumers[key](obj)){
                    return
                }
            }
        }
    }
    const consumers=[
        (obj:any):boolean=>{
            if("packid" in obj&&obj.packid=="start_review_card"){

                console.log("start_review_card consumed")
                _ipc.MainCallRender.tasks.start_review_card.call(
                    obj["packobj"].note,
                    obj["packobj"].card_set,
                    obj["packobj"].card
                )
                // bus.emit("test_ipc_main_to_ipc_render")

                return true
            }
            return false
        }
    ]
}