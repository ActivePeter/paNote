import {Buffer} from "buffer";
import {_PaUtilTs} from "@/3rd/pa_util_ts";
export enum SendState{
    Succ,
    Fail
}
export class TcpPackConstructor {
    HEAD_BUF_LEN=4

    cb=(buf:Buffer)=>{}
    head_rec_cnt = 0
    body_rec_cnt = 0
    body_buf =Buffer.alloc(0)
    head_buf = Buffer.alloc(this.HEAD_BUF_LEN)
    packlen = 0

    set_one_pack_callback(cb:(buf:Buffer)=>void) {
        this.cb = cb;
    }
    handle_one_slice(buffset:Buffer,_byte_cnt:number){
        let handled_offset = 0;

        while (handled_offset < _byte_cnt) {
            const byte_cnt_left = _byte_cnt - handled_offset;
            //头本次还是未收全
            if( this.head_rec_cnt < this.HEAD_BUF_LEN ){
                if (byte_cnt_left + (this.head_rec_cnt) < this.HEAD_BUF_LEN) {
                    for( let i =0;i<byte_cnt_left;i++ ){
                        this.head_buf[(this.head_rec_cnt ) + i]
                            = buffset[handled_offset + i];
                    }
                    this.head_rec_cnt += byte_cnt_left ;
                }//头本次收全
                else {
                    const cpylen = this.HEAD_BUF_LEN - this.head_rec_cnt;
                    for (let i=0;i<cpylen;i++) {
                        this.head_buf[(this.head_rec_cnt + i) ] =
                            buffset[handled_offset + i ];
                    }
                    handled_offset += (this.HEAD_BUF_LEN - this.head_rec_cnt);
                    this._calc_pack_head();
                    this.head_rec_cnt = this.HEAD_BUF_LEN;
                    //扩大缓冲区
                    if (this.packlen > this.body_buf.length) {
                        this.body_buf=_PaUtilTs._NodeJs._Buffer.EfficentExpand(
                            this.body_buf,this.packlen
                        )
                        // console.log("expand buf size",this.body_buf.length)
                    }
                    // continue;
                }
            }

            // 1.剩余数据小于需要读的字节数量(不够
            if( byte_cnt_left <
            (this.packlen - this.body_rec_cnt)) {
                this._write_data_2_body(buffset.subarray(handled_offset), byte_cnt_left);
                return;
            } else {
                //完成读包
                const len = this.packlen - this.body_rec_cnt;
                this._write_data_2_body(buffset.subarray(handled_offset), len);
                handled_offset += len;

                //回调处理片段
                this.cb(this.body_buf.subarray(0,this.packlen))

                this._reset();
            }
        }
    }
    _reset() {
        this.head_rec_cnt = 0;
        this.body_rec_cnt = 0;
    }
    _write_data_2_body(buffset:Buffer, byte_cnt_left:number) {
        for(let i = 0;i<byte_cnt_left;i++ ){
            this.body_buf[this.body_rec_cnt + i] =buffset[i];
        }
    }
    _calc_pack_head() {
        this.packlen=this.head_buf.readUInt32BE()
        console.log("pack len:",this.packlen)
    }
}
