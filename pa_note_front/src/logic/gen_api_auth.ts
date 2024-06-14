import axios from "axios"



export class LoginRespSucc {
    constructor(
        public token:string,
    ){}
}

export class LoginRespFail {
    constructor(
        public msg:string,
    ){}
}

export class LoginResp{
    constructor(
        private kernel: any,
        private id: number
    ) {}
    
    succ():undefined| LoginRespSucc{
        if(this.id==1){
            return this.kernel
        }
        return undefined
    }
    
    fail():undefined| LoginRespFail{
        if(this.id==2){
            return this.kernel
        }
        return undefined
    }
    
}


export class LoginReq {
    constructor(
        public id:string,
        public pw:string,
    ){}
}

export namespace apis {
    export async function login(req:LoginReq):Promise<LoginResp>{
        let res:any = await axios.post("/api/panote_auth/login", req)
        return new LoginResp(res.data.kernel,res.data.id)
    }
}




export class VerifyTokenRespSucc {
    constructor(
        public new_token:string,
    ){}
}

export class VerifyTokenRespFail {
    constructor(
        public msg:string,
    ){}
}

export class VerifyTokenResp{
    constructor(
        private kernel: any,
        private id: number
    ) {}
    
    succ():undefined| VerifyTokenRespSucc{
        if(this.id==1){
            return this.kernel
        }
        return undefined
    }
    
    fail():undefined| VerifyTokenRespFail{
        if(this.id==2){
            return this.kernel
        }
        return undefined
    }
    
}


export class VerifyTokenReq {
    constructor(
        public token:string,
    ){}
}

export namespace apis {
    export async function verify_token(req:VerifyTokenReq):Promise<VerifyTokenResp>{
        let res:any = await axios.post("/api/panote_auth/verify_token", req)
        return new VerifyTokenResp(res.data.kernel,res.data.id)
    }
}


