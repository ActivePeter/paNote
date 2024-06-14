import { AppFuncTs } from "@/logic/app_func";
import { LoginArg, VerifyTokenArg } from "@/logic/commu/api_caller";
import { _PaUtilTs } from "@/3rd/pa_util_ts";
import { ElNotification } from "element-plus";
import { LoginReq, VerifyTokenReq, apis } from "./gen_api_auth";

export class AuthorityMan {
    private verified = false;
    verify_token_when_first_load() {
        let token = window.localStorage["panote_token"]
        if (token && _PaUtilTs._JudgeType.is_string(token)) {
            apis.verify_token(new VerifyTokenReq(token)).then(r => {
                let succ = r.succ()
                let fail = r.fail()
                if (succ) {
                    this.verified = true
                    this.ctx.app.showlogbtn = false
                    window.localStorage["panote_token"] = succ.new_token
                    ElNotification({
                        title: 'Success',
                        message: 'token 已更新',
                        type: 'success',
                    })
                } else {
                    console.warn("token 已过期", fail)
                    ElNotification({
                        title: 'Fail',
                        message: 'token 已过期',
                        type: 'fail',
                    })
                    delete window.localStorage["panote_token"]
                }
            })
            // this.ctx.api_caller
            //     .verify_token(new VerifyTokenArg(token), (r) => {
            //         if (r.if_success) {
            //             this.verified = true
            //             this.ctx.app.showlogbtn = false
            //             window.localStorage["panote_token"] = r.new_token
            //             ElNotification({
            //                 title: 'Success',
            //                 message: 'token 已更新',
            //                 type: 'success',
            //             })
            //         } else {
            //             delete window.localStorage["panote_token"]
            //         }
            //     })
        }
    }
    is_logged_in() {
        return this.verified
    }
    login(id: string, pw: string, cb: (succ: boolean) => void) {
        apis.login(new LoginReq(id, pw)).then(r => {
            let succ = r.succ()
            let fail = r.fail()
            if (succ) {
                this.verified = true
                this.ctx.app.showlogbtn = false
                window.localStorage["panote_token"] = succ.token
                ElNotification({
                    title: 'Success',
                    message: '登录成功',
                    type: 'success',
                })
                cb(true)
            } else {
                ElNotification({
                    title: 'Fail',
                    message: '登录失败',
                    type: 'error',
                })
                cb(false)
            }
        }).catch(e => {
            console.log(e)
            cb(false)
        })
        // this.ctx.api_caller
        //     .login(new LoginArg(id,pw),(r)=>{
        //         if(r.if_success==1){
        //             this.verified=true
        //             this.ctx.app.showlogbtn=false
        //             window.localStorage["panote_token"]=r.token

        //             ElNotification({
        //                 title: 'Success',
        //                 message: '登录成功',
        //                 type: 'success',
        //             })
        //             cb(true)
        //         }else{
        //             cb(false)
        //         }
        //     })
    }
    constructor(private ctx: AppFuncTs.Context) {
    }
}