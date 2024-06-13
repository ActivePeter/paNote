import axios from "axios"


export class NodeBasic {
    constructor(
        public name:string,
        public online:boolean,
        public ip:string,
        public ssh_port:string,
        public cpu_sum:number,
        public cpu_cur:number,
        public mem_sum:number,
        public mem_cur:number,
        public passwd:string,
        public system:string,
    ){}
}

export class Action {
    constructor(
        public name:string,
        public cmd:string,
    ){}
}

export class ServiceBasic {
    constructor(
        public name:string,
        public node:string,
        public dir:string,
        public actions:Action[],
    ){}
}


export class GetNotesMataRespSucc {
    constructor(
        public node_id_name_list:string[],
    ){}
}

export class GetNotesMataResp{
    constructor(
        private kernel: any,
        private id: number
    ) {}
    
    succ():undefined| GetNotesMataRespSucc{
        if(this.id==1){
            return this.kernel
        }
        return undefined
    }
    
}


export namespace apis {
    export async function get_notes_mata():Promise<GetNotesMataResp>{
        let res:any = await axios.post("/api/get_notes_mata", )
        return new GetNotesMataResp(res.data.kernel,res.data.id)
    }
}




export class CreateNewNoteRespSucc {
    constructor(

    ){}
}

export class CreateNewNoteResp{
    constructor(
        private kernel: any,
        private id: number
    ) {}
    
    succ():undefined| CreateNewNoteRespSucc{
        if(this.id==1){
            return this.kernel
        }
        return undefined
    }
    
}


export namespace apis {
    export async function create_new_note():Promise<CreateNewNoteResp>{
        let res:any = await axios.post("/api/create_new_note", )
        return new CreateNewNoteResp(res.data.kernel,res.data.id)
    }
}




export class RenameNoteRespSucc {
    constructor(

    ){}
}

export class RenameNoteResp{
    constructor(
        private kernel: any,
        private id: number
    ) {}
    
    succ():undefined| RenameNoteRespSucc{
        if(this.id==1){
            return this.kernel
        }
        return undefined
    }
    
}


export class RenameNoteReq {
    constructor(
        public noteid:string,
        public name:string,
    ){}
}

export namespace apis {
    export async function rename_note(req:RenameNoteReq):Promise<RenameNoteResp>{
        let res:any = await axios.post("/api/rename_note", req)
        return new RenameNoteResp(res.data.kernel,res.data.id)
    }
}


