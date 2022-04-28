import {Buffer} from "buffer";
import * as buffer from "buffer";

export namespace _PaUtilTs {
    export class MouseDownUpRecord{
        _down:MouseEvent|null=null
        _up:MouseEvent|null=null
        click_callback:()=>void=()=>{}

        set_click_callback(cb:()=>void){
            this.click_callback=cb
        }
        down(e:MouseEvent){
            this._down=e;
        }
        up(e:MouseEvent){
            this._up=e;
            if(this._down&&this._up){
                if(
                    Math.abs(this._down.clientX-this._up.clientX)<2&&
                    Math.abs(this._down.clientY-this._up.clientY)<2
                ){
                    this.click_callback()
                }

                this._down=null
                this._up=null
            }
        }
    }
    export namespace _Conv{
        export const UInt8Array2string=(data1:Uint8Array)=>{
            const data = Buffer.from(data1)
            return data.toString()
        }
    }
    export const try_parse_json=(str:string)=>{
        try {
            return JSON.parse(str)
        }catch (e){
            return null
        }
    }
    export namespace _JudgeType{
        export const is_number=(v:any)=>{
            return typeof v == "number"
        }
        export const is_string=(v:any)=>{
            return typeof v == "string"
        }
    }
    export namespace _NodeJs {
        export namespace _Buffer {
            //old data wouldnt be hold
            export const EfficentExpand = (
                buffer: Buffer,
                target_size_at_least: number):Buffer=> {
                //目标size 比当前小
                if(target_size_at_least<=buffer.length){
                    return buffer;
                }
                let n = target_size_at_least;
                n |= n >> 1;
                n |= n >> 2;
                n |= n >> 4;
                n |= n >> 8;
                n |= n >> 16;
                const new_size= (n < 0) ? 1 : (n >= 2147483647) ? 2147483647 : n + 1;
                // console.log(new_size)
                return Buffer.alloc(new_size)
            }
        }
    }
}