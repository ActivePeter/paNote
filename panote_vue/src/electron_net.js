import {TcpPackConstructor} from "@/electron_net_ts";
import {Buffer} from "buffer";

const net = require("net")

//client
class NetManager {
    try_send_str(str){
        // let make=[]
        let make=Buffer.alloc(4+str.length);
        make.writeUInt32BE(str.length);
        make.subarray(4).write(str);

        this.client.write(make)
    }
    constructor() {
        this.tcp_pack_constructor = new TcpPackConstructor()
        this.tcp_pack_constructor.set_one_pack_callback((buf)=>{
            console.log("pack data:",buf.toString())
        })
        let PORT = 12357
        let HOST = "192.168.137.92"//"127.0.0.1"
        let new_client = () => {
            this.client = new net.Socket();
            let _this = this;
            this.client.on('error', function () {
                console.log('tcp_client error!');
                _this.client.destroy();
                // setTimeout(conn,10000 );
            })
            this.client.on('close', function () {
                console.log('服务器端下线了');
                _this.client.destroy();
                setTimeout(conn, 10000);//重连
            });
            this.client.on('data', (data) => {
                this.tcp_pack_constructor.handle_one_slice(data,data.length)
                // console.log('data from server:', data)
            })

            return this.client;
        }
        let conn = () => {
            const _this=this;
            new_client()
                .connect(PORT, HOST, () => {
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

export default {
    load_net_manager() {
        if (net) {
            return new NetManager();
        } else {
            return null
        }
    }
}