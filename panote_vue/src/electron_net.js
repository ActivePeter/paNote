const net = require("net")

class NetManager{
    constructor() {

        let PORT=12359
        let HOST="127.0.0.1"
        let new_client=()=>{
            this.client = new net.Socket();
            let _this=this;
            this.client.on('error', function () {
                console.log('tcp_client error!');
                _this.client.destroy();
                // setTimeout(conn,10000 );
            })
            this.client.on('close',function(){
                console.log('服务器端下线了');
                _this.client.destroy();
                setTimeout(conn,10000 );
            });
        }
        let conn=()=>{
           new_client();
            this.client.connect(PORT, HOST, () => {
                console.log("连接成功: " + HOST + ":" + PORT);
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
    load_net_manager(){
        if(net){
            return new NetManager();
        }else{
            return null
        }
    }
}