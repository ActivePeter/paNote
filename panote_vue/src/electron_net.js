import {TcpPackConstructor} from "@/electron_net_ts";
import {Buffer} from "buffer";
import {SendState} from "@/electron_net_ts";
import {NetPackRecv} from "@/net_pack_recv";
import {_ipc} from "@/ipc";

const net = require("net")



//client
export class NetManager {
    try_send_str(str){
        // let make=[]
        const buf1=Buffer.from(str)
        let make = Buffer.alloc(4);
        make.writeUInt32BE(buf1.length);
        make=Buffer.concat([make,buf1])
        // make.subarray(4).write(buf1);
        // console.log("send",str,make)
        return new Promise(
            (resolve)=>{
                const _this=this;
                this.client.write(make,()=>{
                    if(_this.client.bytesWritten===make.length){
                        resolve(SendState.Succ)
                    }else{
                        resolve(SendState.Fail)
                    }
                })
            }
        )
    }

    constructor() {

        this.connected=false
        this.tcp_pack_constructor = new TcpPackConstructor()
        this.tcp_pack_constructor.set_one_pack_callback((buf) => {
            // console.log("pack data:", buf.toString())
            NetPackRecv.handle(buf.toString())
        })
        let PORT = 12357
        let HOST =// "192.168.137.133"
        "127.0.0.1"
        let new_client = () => {
            this.client = new net.Socket();
            let _this = this;

            this.client.on('error', function () {
                _this.connected=false
                console.log('tcp_client error!');
                _this.client.destroy();
                // setTimeout(conn,10000 );
            })
            this.client.on('close', function () {
                _this.connected=false
                console.log('服务器端下线了');
                _this.client.destroy();
                setTimeout(conn, 10000);//重连
                _ipc.MainCallRender.tasks.net_state_change.call(false)
            });
            this.client.on('data', (data) => {
                this.tcp_pack_constructor.handle_one_slice(data, data.length)
                // console.log('data from server:', data)
            })

            return this.client;
        }
        let conn = () => {
            const _this = this;
            new_client()
                .connect(PORT, HOST, () => {
                    _this.connected=true
                    _ipc.MainCallRender.tasks.net_state_change.call(true)
                    console.log("连接成功: " + HOST + ":" + PORT);
                    _this.try_send_str("helloworld")
                    // 建立连接后立即向服务器发送数据，服务器将收到这些数据
                    // this.sendMsgToTcp('hellow TCP,Fuck you!')
                });
        }

        // try {
        conn()
        // }catch (e){
        //     console.log(e)

        // }

    }
}

let net_man_single = null;
export default {
    get_net_manager() {
        if (net) {
            if (!net_man_single) {
                net_man_single = new NetManager()
            }
            return net_man_single;
        } else {
            return null
        }
    }
}