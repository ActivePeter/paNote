import {Buffer} from "buffer";
import * as buffer from "buffer";

export namespace _PaUtilTs {
    export namespace _Conv{
        export const string2arraybuffer=(str:string)=>{

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
            return typeof v == "number"
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