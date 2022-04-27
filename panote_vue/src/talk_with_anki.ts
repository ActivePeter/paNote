import electron_net from "@/electron_net";
import {SendState} from "@/electron_net_ts";

export namespace TalkWithAnki{
    export enum TalkState{
        Succ,
        Fail,
    }
    const _send_str=async (str:string):Promise<TalkState>=>{
        const netman=electron_net.get_net_manager()
        if(!netman){
            return TalkState.Fail
        }
        const res=await netman.try_send_str(str);
        if(res==SendState.Succ){
            return TalkState.Succ
        }
        return TalkState.Fail
    }
    export const new_card_in_cardset=async (
        card_name:string,//(panote对应笔记中的唯一id)
        pa_note_id:string//(笔记名称加上创建时时间戳,确保不重复)
    ):Promise<TalkState>=>{
        const packobj={
            id:0,
            card_name,
            pa_note_id
        }
        return _send_str(JSON.stringify(packobj));
    }
    export const note_name_changed_sync=async (
        from:string,//原笔迹名称+时间戳
        to:string//新笔记名称+时间戳
    )=>{
        return _send_str(JSON.stringify({
            id:1,
            from,
            to
        }));
    }
}