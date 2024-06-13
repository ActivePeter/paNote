import {AppFuncTs} from "@/logic/app_func";
import {LoginArg, VerifyTokenArg} from "@/logic/commu/api_caller";
import {_PaUtilTs} from "@/3rd/pa_util_ts";
import {ElNotification} from "element-plus";

export class AuthorityMan{
    private verified=false;
    verify_token_when_first_load(){
        let token=window.localStorage["panote_token"]
        if(token&&_PaUtilTs._JudgeType.is_string(token)){
            this.ctx.api_caller
                .verify_token(new VerifyTokenArg(token),(r)=>{
                    if(r.if_success){
                        this.verified=true
                        this.ctx.app.showlogbtn=false
                        window.localStorage["panote_token"]=r.new_token
                        ElNotification({
                            title: 'Success',
                            message: 'token 已更新',
                            type: 'success',
                        })
                    }else{
                        delete window.localStorage["panote_token"]
                    }
                })
        }
    }
    is_logged_in(){
        return this.verified
    }
    login(id:string,pw:string,cb:(succ:boolean)=>void){
        this.ctx.api_caller
            .login(new LoginArg(id,pw),(r)=>{
                if(r.if_success==1){
                    this.verified=true
                    this.ctx.app.showlogbtn=false
                    window.localStorage["panote_token"]=r.token

                    ElNotification({
                        title: 'Success',
                        message: '登录成功',
                        type: 'success',
                    })
                    cb(true)
                }else{
                    cb(false)
                }
            })
    }
    constructor(private ctx:AppFuncTs.Context) {
    }
}