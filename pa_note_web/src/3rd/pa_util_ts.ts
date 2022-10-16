import {Buffer} from "buffer";
import * as buffer from "buffer";
import {_algrithms} from "@/3rd/pa_util_parts/algrithms";

export namespace _PaUtilTs {
    export class Pos2DChange{
        constructor(public f:Pos2D,public t:Pos2D) {
        }
        static create(f:Pos2D,t:Pos2D){
            return new Pos2DChange(f,t)
        }
    }
    export class Pos2D{
        x=0
        y=0
        constructor(x:number,y:number) {
            this.x=x;this.y=y;
        }
        update(x:number,y:number){
            this.x=x;
            this.y=y;
        }
    }
    export const accDiv=(arg1:number,arg2:number)=>{
        return arg1/arg2

    }
    export type Vec2D=Pos2D
    export interface IArea{
        get_area():number
    }
    export class Rect implements IArea{
        x:number
        y:number
        w:number
        h:number
        constructor(x:number,y:number,w:number,h:number){
            this.x=x;this.y=y;this.w=w;this.h=h;
        }

        get_area(): number {
            return this.w*this.h;
        }
        right(){
            return this.x+this.w
        }
        bottom(){
            return this.y+this.h
        }
    }
    export namespace DataStructure {
        export namespace ListSerializable {
            class DoublyNode<T> {
                constructor(
                    public element: T,
                    public next?: DoublyNode<T>,
                    public prev?: DoublyNode<T>
                ) {

                }
            }

            export class Class<T> {
                // 多了一个尾部节点tail，重写了head
                head?: DoublyNode<T>;
                tail?: DoublyNode<T>;
                count = 0;

                constructor() {

                }

                /**
                 * @description: 向双向链表尾部添加一个元素
                 * @param {T} element
                 */
                push(element: T) {
                    const node = new DoublyNode(element);

                    if (this.count==0) {
                        //头和尾一起赋值
                        this.head = node;
                        this.tail = node; //   新增
                    } else {
                        //   修改
                        // 添加到尾部，互相交换指针
                        // @ts-ignore
                        this.tail.next = node;
                        node.prev = this.tail;
                        // 最后把node设为tail
                        this.tail = node;
                    }
                    this.count++;
                }
                pop_tail():T|undefined{
                    if(this.tail){
                        const t=this.tail
                        this.tail=this.tail.prev
                        if(this.tail){
                            this.tail.next=this.tail
                        }
                        this.count--
                        return t.element
                    }
                    return undefined
                }
                pop():T|undefined{
                    if(this.head){
                        const head=this.head
                        this.head=this.head.next
                        this.count--
                        return head.element
                    }
                    return undefined
                }
                remove_node(node: DoublyNode<T>) {
                    if (this.count == 0) {
                        return
                    }
                    const prev = node.prev
                    const next = node.next
                    if (prev && next) {//node不是头也不是尾
                        prev.next = next
                        next.prev = prev
                    } else if (prev) {//有头没尾 node是尾
                        prev.next = undefined
                        this.tail = prev
                    } else if (next) {//有尾没头 node是头
                        next.prev = undefined
                        this.head = next
                    } else {//没头没尾，node既是头又是尾
                        this.head = this.tail = undefined
                    }
                    this.count--;
                }

                /**
                 * @description: 清空链表
                 */
                clear() {
                    this.head = this.tail = undefined
                    this.count = 0
                }

                to_string(): string {
                    let head = this.head
                    let str = '['
                    let first = true
                    while (head) {
                        if (!first) {
                            str += ','
                        }
                        first = false
                        str += JSON.stringify(head.element)
                        head = head.next
                    }
                    str += ']'
                    return str
                }
            }

            export const from_string = <T>(str: string): Class<T> => {
                const arr = JSON.parse(str)
                const list = new Class<T>()
                for (const key in arr) {
                    list.push(arr[key])
                }
                return list
            }
        }
    }
    export const Algrithms=_algrithms
    export class MouseDownUpRecord {
        _down: MouseEvent | null = null
        _up: MouseEvent | null = null
        click_callback: () => void = () => {
        }

        set_click_callback(cb: () => void) {
            this.click_callback = cb
        }

        down(e: MouseEvent) {
            this._down = e;
        }

        up(e: MouseEvent) {
            this._up = e;
            if (this._down && this._up) {
                if (
                    Math.abs(this._down.clientX - this._up.clientX) < 2 &&
                    Math.abs(this._down.clientY - this._up.clientY) < 2
                ) {
                    this.click_callback()
                }

                this._down = null
                this._up = null
            }
        }
    }

    export namespace _Conv {
        export const UInt8Array2string = (data1: Uint8Array) => {
            const data = Buffer.from(data1)
            return data.toString()
        }
    }
    export const try_parse_json = (str: string) => {
        try {
            return JSON.parse(str)
        } catch (e) {
            return null
        }
    }
    export const get_time_stamp = (): string => {
        const now = new Date()
        return now.getUTCFullYear() + ":" +
            now.getUTCMonth() + ":" +
            now.getUTCDay() + ":" +
            now.getUTCHours() + ":" +
            now.getUTCMinutes() + ":" +
            now.getUTCSeconds() + ":" +
            now.getUTCMilliseconds()
    }
    export const time_stamp_number=():number=>{
        return new Date().getTime()
    }
    export namespace _JudgeType {
        export const is_number = (v: any) => {
            return typeof v == "number"
        }
        export const is_string = (v: any) => {
            return typeof v == "string"
        }
    }
    export namespace _NodeJs {
        export namespace _Buffer {
            //old data wouldnt be hold
            export const EfficentExpand = (
                buffer: Buffer,
                target_size_at_least: number): Buffer => {
                //目标size 比当前小
                if (target_size_at_least <= buffer.length) {
                    return buffer;
                }
                let n = target_size_at_least;
                n |= n >> 1;
                n |= n >> 2;
                n |= n >> 4;
                n |= n >> 8;
                n |= n >> 16;
                const new_size = (n < 0) ? 1 : (n >= 2147483647) ? 2147483647 : n + 1;
                // console.log(new_size)
                return Buffer.alloc(new_size)
            }
        }
    }
}