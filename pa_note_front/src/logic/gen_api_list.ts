import axios from "axios"



export class GetNotesMataRespSucc {
    constructor(
        public node_id_name_list:string[][],
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


export class GetNotesMataReq {
    constructor(

    ){}
}

export namespace apis {
    export async function get_notes_mata(req:GetNotesMataReq):Promise<GetNotesMataResp>{
        let res:any = await axios.post("/api/panote_list/get_notes_mata", req)
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


export class CreateNewNoteReq {
    constructor(

    ){}
}

export namespace apis {
    export async function create_new_note(req:CreateNewNoteReq):Promise<CreateNewNoteResp>{
        let res:any = await axios.post("/api/panote_list/create_new_note", req)
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
        let res:any = await axios.post("/api/panote_list/rename_note", req)
        return new RenameNoteResp(res.data.kernel,res.data.id)
    }
}


