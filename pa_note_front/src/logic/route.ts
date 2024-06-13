import {note} from "@/logic/note/note";
import {AppFuncTs} from "@/logic/app_func";
import {createRouter, createWebHistory} from 'vue-router';
import App from "@/App.vue";

export namespace _route{
    const router=createRouter({
        history: createWebHistory(),
        routes:[
            { path: '/', component: App},
        ],
    })
    export function update_route_when_open_note(noteid:string){
        let old=get_route_info()
        if(old.noteid==noteid){
            return
        }
        router.replace({
            path: '/',
            query:{noteid:noteid}
        })
    }
    export function update_middle_pos(pos:{x:number,y:number}){
        let old:any=get_route_info()
        old.x=Math.round(pos.x);
        old.y=Math.round(pos.y);
        router.replace({
            path:'/',
            query:old}
        )
    }
    // export function update_route_when_selection_change(selected:string[]){
    //     let old=get_route_info()
    //     old.selected=selected
    //
    //     router.replace({
    //         path:'/',
    //         query:
    //             selected.length==0?{
    //                     noteid:old.noteid,
    //                 }:
    //             {
    //             noteid:old.noteid,
    //             selected:serial_array(selected)
    //         }
    //     })
    // }
    // export function serial_array(array:string[]){
    //     let a="["
    //     while (array.length>0){
    //         a+=array.pop()
    //         if(array.length>0){
    //             a+=","
    //         }
    //     }
    //     a+="]"
    //     return a
    // }
    export function deserial_array(array:string){
        return []
    }
    export class RouteInfo{
        constructor(
            public noteid:string,
            public x:number,
            public y:number
            // public selected:string[]
        ) {
        }
    }
    function get_url_params() {
        let query=window.location.search
        let urlParam: any = {};
        if (query) {
            const paramArr = query.split('&');
            for (let i = 0; i < paramArr.length; i++) {

                if (i == 0) paramArr[i] = paramArr[i].substr(1, paramArr[i].length);
                let arr = paramArr[i].split('=');
                urlParam[arr[0]] = arr[1];
            }
        }
        return urlParam;
    }
    export function get_route_info(){
        // let noteid=""
        let params=get_url_params()
        if(!params.noteid){
            params.noteid=""
        }
        if( params.x==undefined){
            params.x=0
        }
        if(params.y==undefined){
            params.y=0
        }

        return new RouteInfo(params.noteid,parseFloat(params.x),parseFloat(params.y))
    }
}