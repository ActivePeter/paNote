import electron_net from "@/electron_net";
import {SendState} from "@/electron_net_ts";
import {_ReviewPartSyncAnki} from "@/components/review_part/ReviewPartSyncAnki";

// export namespace TalkWithAnki{
//     // export enum TalkState{
//     //     Succ,
//     //     Fail,
//     // }
//     // const _send_str=async (str:string):Promise<TalkState>=>{
//     //
//     //     if(res==SendState.Succ){
//     //         return TalkState.Succ
//     //     }
//     //     return TalkState.Fail
//     // }
// }
export namespace TalkPacker{
    export class Serializer{
        obj:any
        serialize():string{
            return JSON.stringify(this.obj)
        }
        constructor(obj:any) {
            this.obj=obj
        }
    }
    export const pack_start_review=(card_set_info:_ReviewPartSyncAnki._OneOperation.OpeCardSet):Serializer=>{
        return new Serializer({packid:"start_review",packobj:card_set_info})
    }
    export const pack_show_answer=():Serializer=>{
        return new Serializer({packid:"show_answer"})
    }
    export const pack_answer=(answeri:number):Serializer=>{
        return new Serializer({packid:"answer",packobj:{answeri:answeri}})
    }
}