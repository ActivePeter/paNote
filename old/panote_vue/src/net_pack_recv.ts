import {_PaUtilTs} from "@/3rd/pa_util_ts";
import {bus} from "@/bus";
import {_ipc} from "@/ipc";

export namespace NetPackRecv{
    export const handle=(data:string)=>{
        const obj=_PaUtilTs.try_parse_json(data)
        if(obj){
            console.log("pack recv",obj)
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
        },
        (obj:any):boolean=>{
            if("packid" in obj&&obj.packid=="answer_showned"){
                console.log(obj.packobj.btns,"\n")
                const lines=obj.packobj.btns.split('\n')
                console.log(lines)
                const level=[]
                for(let i=1;i<lines.length;i++){
                    console.log(lines[i].split("span")[1])
                    let sub=lines[i].split("span")[1].split(">")[1]
                    sub=sub.substr(0,sub.length-2)

                    level.push(sub)
                }
                console.log(level)

                _ipc.MainCallRender.tasks.answer_showned.call(level)
                // bus.emit("test_ipc_main_to_ipc_render")

                return true
            }
            return false
        },
        (obj:any):boolean=>{
            if("packid" in obj&&obj.packid=="no_card_to_review"){
                _ipc.MainCallRender.tasks.no_card_2_review.call(obj.note,obj.card_set)
                return true
            }
            return false
        },
        (obj:any):boolean=>{
            if("packid" in obj&&obj.packid=="anki_state_not_match"){
                _ipc.MainCallRender.tasks.anki_state_not_match.call()
                return true
            }
            return false
        },
    ]
}