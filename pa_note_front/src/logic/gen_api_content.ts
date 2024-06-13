import axios from "axios"



export class GetNoteMataRespSucc {
    constructor(
        public next_noteid:number,
        public max_chunkx:number,
        public max_chunky:number,
        public min_chunkx:number,
        public min_chunky:number,
    ){}
}

export class GetNoteMataResp{
    constructor(
        private kernel: any,
        private id: number
    ) {}
    
    succ():undefined| GetNoteMataRespSucc{
        if(this.id==1){
            return this.kernel
        }
        return undefined
    }
    
}


export class GetNoteMataReq {
    constructor(
        public noteid:string,
    ){}
}

export namespace apis {
    export async function get_note_mata(req:GetNoteMataReq):Promise<GetNoteMataResp>{
        let res:any = await axios.post("/api/get_note_mata", req)
        return new GetNoteMataResp(res.data.kernel,res.data.id)
    }
}




export class GetChunkNoteIdsRespSucc {
    constructor(
        public noteids:string[],
    ){}
}

export class GetChunkNoteIdsResp{
    constructor(
        private kernel: any,
        private id: number
    ) {}
    
    succ():undefined| GetChunkNoteIdsRespSucc{
        if(this.id==1){
            return this.kernel
        }
        return undefined
    }
    
}


export class GetChunkNoteIdsReq {
    constructor(
        public noteid:string,
        public chunkx:number,
        public chunky:number,
    ){}
}

export namespace apis {
    export async function get_chunk_note_ids(req:GetChunkNoteIdsReq):Promise<GetChunkNoteIdsResp>{
        let res:any = await axios.post("/api/get_chunk_note_ids", req)
        return new GetChunkNoteIdsResp(res.data.kernel,res.data.id)
    }
}




export class GetNoteBarInfoRespExist {
    constructor(
        public x:number,
        public y:number,
        public w:number,
        public h:number,
        public text:string,
        public formatted:string,
        public connected:string[],
        public epoch:number,
    ){}
}

export class GetNoteBarInfoResp{
    constructor(
        private kernel: any,
        private id: number
    ) {}
    
    exist():undefined| GetNoteBarInfoRespExist{
        if(this.id==1){
            return this.kernel
        }
        return undefined
    }
    
}


export class GetNoteBarInfoReq {
    constructor(
        public noteid:string,
        public notebarid:string,
    ){}
}

export namespace apis {
    export async function get_note_bar_info(req:GetNoteBarInfoReq):Promise<GetNoteBarInfoResp>{
        let res:any = await axios.post("/api/get_note_bar_info", req)
        return new GetNoteBarInfoResp(res.data.kernel,res.data.id)
    }
}




export class CreateNewBarRespSucc {
    constructor(
        public chunkx:number,
        public chunky:number,
        public noteids:string[],
    ){}
}

export class CreateNewBarResp{
    constructor(
        private kernel: any,
        private id: number
    ) {}
    
    succ():undefined| CreateNewBarRespSucc{
        if(this.id==1){
            return this.kernel
        }
        return undefined
    }
    
}


export class CreateNewBarReq {
    constructor(
        public noteid:string,
        public x:number,
        public y:number,
    ){}
}

export namespace apis {
    export async function create_new_bar(req:CreateNewBarReq):Promise<CreateNewBarResp>{
        let res:any = await axios.post("/api/create_new_bar", req)
        return new CreateNewBarResp(res.data.kernel,res.data.id)
    }
}




export class UpdateBarContentRespSucc {
    constructor(
        public new_epoch:number,
    ){}
}

export class UpdateBarContentResp{
    constructor(
        private kernel: any,
        private id: number
    ) {}
    
    succ():undefined| UpdateBarContentRespSucc{
        if(this.id==1){
            return this.kernel
        }
        return undefined
    }
    
}


export class UpdateBarContentReq {
    constructor(
        public noteid:string,
        public barid:string,
        public text:string,
        public formatted:string,
    ){}
}

export namespace apis {
    export async function update_bar_content(req:UpdateBarContentReq):Promise<UpdateBarContentResp>{
        let res:any = await axios.post("/api/update_bar_content", req)
        return new UpdateBarContentResp(res.data.kernel,res.data.id)
    }
}




export class UpdateBarTransformRespSucc {
    constructor(
        public new_epoch:number,
        public chunk_maxx:number,
        public chunk_minx:number,
        public chunk_maxy:number,
        public chunk_miny:number,
        public chunk_change:string[],
    ){}
}

export class UpdateBarTransformResp{
    constructor(
        private kernel: any,
        private id: number
    ) {}
    
    succ():undefined| UpdateBarTransformRespSucc{
        if(this.id==1){
            return this.kernel
        }
        return undefined
    }
    
}


export class UpdateBarTransformReq {
    constructor(
        public noteid:string,
        public barid:string,
        public x:number,
        public y:number,
        public w:number,
        public h:number,
    ){}
}

export namespace apis {
    export async function update_bar_transform(req:UpdateBarTransformReq):Promise<UpdateBarTransformResp>{
        let res:any = await axios.post("/api/update_bar_transform", req)
        return new UpdateBarTransformResp(res.data.kernel,res.data.id)
    }
}




export class RedoRespSucc {
    constructor(
        public redotype:string,
        public redovalue:Obj,
    ){}
}

export class RedoResp{
    constructor(
        private kernel: any,
        private id: number
    ) {}
    
    succ():undefined| RedoRespSucc{
        if(this.id==1){
            return this.kernel
        }
        return undefined
    }
    
}


export class RedoReq {
    constructor(
        public noteid:string,
    ){}
}

export namespace apis {
    export async function redo(req:RedoReq):Promise<RedoResp>{
        let res:any = await axios.post("/api/redo", req)
        return new RedoResp(res.data.kernel,res.data.id)
    }
}




export class AddPathRespSucc {
    constructor(
        public new_epoch_from:number,
        public new_epoch_to:number,
    ){}
}

export class AddPathRespFail {
    constructor(

    ){}
}

export class AddPathResp{
    constructor(
        private kernel: any,
        private id: number
    ) {}
    
    succ():undefined| AddPathRespSucc{
        if(this.id==1){
            return this.kernel
        }
        return undefined
    }
    
    fail():undefined| AddPathRespFail{
        if(this.id==2){
            return this.kernel
        }
        return undefined
    }
    
}


export class AddPathReq {
    constructor(
        public noteid:string,
        public from:string,
        public to:string,
    ){}
}

export namespace apis {
    export async function add_path(req:AddPathReq):Promise<AddPathResp>{
        let res:any = await axios.post("/api/add_path", req)
        return new AddPathResp(res.data.kernel,res.data.id)
    }
}




export class GetPathInfoRespSucc {
    constructor(
        public type_:number,
    ){}
}

export class GetPathInfoResp{
    constructor(
        private kernel: any,
        private id: number
    ) {}
    
    succ():undefined| GetPathInfoRespSucc{
        if(this.id==1){
            return this.kernel
        }
        return undefined
    }
    
}


export class GetPathInfoReq {
    constructor(
        public noteid:string,
        public pathid_with_line:string,
    ){}
}

export namespace apis {
    export async function get_path_info(req:GetPathInfoReq):Promise<GetPathInfoResp>{
        let res:any = await axios.post("/api/get_path_info", req)
        return new GetPathInfoResp(res.data.kernel,res.data.id)
    }
}




export class SetPathInfoRespSucc {
    constructor(

    ){}
}

export class SetPathInfoResp{
    constructor(
        private kernel: any,
        private id: number
    ) {}
    
    succ():undefined| SetPathInfoRespSucc{
        if(this.id==1){
            return this.kernel
        }
        return undefined
    }
    
}


export class SetPathInfoReq {
    constructor(
        public noteid:string,
        public pathid_with_line:string,
        public type_:number,
    ){}
}

export namespace apis {
    export async function set_path_info(req:SetPathInfoReq):Promise<SetPathInfoResp>{
        let res:any = await axios.post("/api/set_path_info", req)
        return new SetPathInfoResp(res.data.kernel,res.data.id)
    }
}




export class RemovePathRespSucc {
    constructor(
        public new_epoch_from:number,
        public new_epoch_to:number,
    ){}
}

export class RemovePathResp{
    constructor(
        private kernel: any,
        private id: number
    ) {}
    
    succ():undefined| RemovePathRespSucc{
        if(this.id==1){
            return this.kernel
        }
        return undefined
    }
    
}


export class RemovePathReq {
    constructor(
        public noteid:string,
        public pathid_with_line:string,
    ){}
}

export namespace apis {
    export async function remove_path(req:RemovePathReq):Promise<RemovePathResp>{
        let res:any = await axios.post("/api/remove_path", req)
        return new RemovePathResp(res.data.kernel,res.data.id)
    }
}




export class DeleteBarRespSucc {
    constructor(
        public chunk_maxx:number,
        public chunk_minx:number,
        public chunk_maxy:number,
        public chunk_miny:number,
    ){}
}

export class DeleteBarResp{
    constructor(
        private kernel: any,
        private id: number
    ) {}
    
    succ():undefined| DeleteBarRespSucc{
        if(this.id==1){
            return this.kernel
        }
        return undefined
    }
    
}


export class DeleteBarReq {
    constructor(
        public noteid:string,
        public barid:string,
    ){}
}

export namespace apis {
    export async function delete_bar(req:DeleteBarReq):Promise<DeleteBarResp>{
        let res:any = await axios.post("/api/delete_bar", req)
        return new DeleteBarResp(res.data.kernel,res.data.id)
    }
}




export class ArticleBinderRespSucc {
    constructor(

    ){}
}

export class ArticleBinderRespFail {
    constructor(

    ){}
}

export class ArticleBinderResp{
    constructor(
        private kernel: any,
        private id: number
    ) {}
    
    succ():undefined| ArticleBinderRespSucc{
        if(this.id==1){
            return this.kernel
        }
        return undefined
    }
    
    fail():undefined| ArticleBinderRespFail{
        if(this.id==2){
            return this.kernel
        }
        return undefined
    }
    
}


export class ArticleBinderReq {
    constructor(
        public bind_unbind_rename:string,
        public article_name:string,
        public barid:string,
        public noteid:string,
    ){}
}

export namespace apis {
    export async function article_binder(req:ArticleBinderReq):Promise<ArticleBinderResp>{
        let res:any = await axios.post("/api/article_binder", req)
        return new ArticleBinderResp(res.data.kernel,res.data.id)
    }
}




export class ArticleListRespSucc {
    constructor(
        public list:string[],
    ){}
}

export class ArticleListRespFail {
    constructor(

    ){}
}

export class ArticleListResp{
    constructor(
        private kernel: any,
        private id: number
    ) {}
    
    succ():undefined| ArticleListRespSucc{
        if(this.id==1){
            return this.kernel
        }
        return undefined
    }
    
    fail():undefined| ArticleListRespFail{
        if(this.id==2){
            return this.kernel
        }
        return undefined
    }
    
}


export class ArticleListReq {
    constructor(
        public noteid:string,
    ){}
}

export namespace apis {
    export async function article_list(req:ArticleListReq):Promise<ArticleListResp>{
        let res:any = await axios.post("/api/article_list", req)
        return new ArticleListResp(res.data.kernel,res.data.id)
    }
}




export class FetchAllNoteBarsEpochRespSucc {
    constructor(
        public bars_id_and_epoch:string[],
    ){}
}

export class FetchAllNoteBarsEpochResp{
    constructor(
        private kernel: any,
        private id: number
    ) {}
    
    succ():undefined| FetchAllNoteBarsEpochRespSucc{
        if(this.id==1){
            return this.kernel
        }
        return undefined
    }
    
}


export class FetchAllNoteBarsEpochReq {
    constructor(
        public noteid:string,
    ){}
}

export namespace apis {
    export async function fetch_all_note_bars_epoch(req:FetchAllNoteBarsEpochReq):Promise<FetchAllNoteBarsEpochResp>{
        let res:any = await axios.post("/api/fetch_all_note_bars_epoch", req)
        return new FetchAllNoteBarsEpochResp(res.data.kernel,res.data.id)
    }
}


