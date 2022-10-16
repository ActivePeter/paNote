import {_PaUtilTs} from "@/3rd/pa_util_ts";

export interface ICommu{
    // send_str(str:string):void
    send_obj(obj:any,cb:undefined|any):void
}

export class WebCommu implements ICommu{
    private tasks:any={}//记录回调函数，有结果时调用回调函数
    private ws:WebSocket|undefined
    private connected=false
    constructor(private on_commu_established:()=>void) {
        this.connect()
    }
    connect(){
        this.ws = new WebSocket('ws://localhost:3004/ws');
        this.ws.onmessage=(msg)=>{
            // console.log("ws recv",)
            this.handle_recv(JSON.parse(msg.data))
        }
        let this_=this
        this.ws.onopen=()=>{
            this_.connected=true;
            console.log("on_commu_established")
            this.on_commu_established()
        }
        this.ws.onclose=(reason)=>{
            console.log("on_commu_close",reason)
            this.connected=false;
        }
        this.ws.onerror=(err)=>{
            console.error("ws err",err)
        }
    }
    is_connected(){
        return this.connected;
    }
    // private send_str(str: string): void {
    // }
    private last_time_stamp=""
    private sametime=0 //时间戳重复次数
    send_obj(obj:any,cb:undefined|any):void{
        // const send={
        obj["taskid"]=_PaUtilTs.get_time_stamp()
        if(this.last_time_stamp==obj["taskid"]){
            this.last_time_stamp=obj["taskid"]
            obj["taskid"]+=this.sametime
            this.sametime++;
        }else{
            this.sametime=0;
            this.last_time_stamp=obj["taskid"]
        }


        // console.log("send",obj)
        // }
        if(cb){
            this.tasks[obj.taskid]=cb
        }
        this.ws?.send(JSON.stringify(obj));
    }
    private handle_recv(recv:any){
        let taskid=recv["taskid"]
        if (taskid in this.tasks){
            // console.log("handle responce",recv)
            this.tasks[taskid](recv["msg_value"])
            delete this.tasks[taskid];
        }else{
            // console.error("no match taskid")
        }
    }
}