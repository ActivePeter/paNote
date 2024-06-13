import {ICommu, WebCommu} from "@/logic/commu/icommu";
import {AppFuncTs} from "@/logic/app_func";

export class GetNotesMataArg{
constructor(){}
}

export class GetNoteMataArg{
constructor(public noteid:string){}
}

export class GetChunkNoteIdsArg{
constructor(public noteid:string,
public chunkx:number,
public chunky:number){}
}

export class GetNoteBarInfoArg{
constructor(public noteid:string,
public notebarid:string){}
}

export class CreateNewNoteArg{
constructor(){}
}

export class RenameNoteArg{
constructor(public noteid:string,
public name:string){}
}

export class CreateNewBarArg{
constructor(public noteid:string,
public x:number,
public y:number){}
}

export class UpdateBarContentArg{
constructor(public noteid:string,
public barid:string,
public text:string,
public formatted:string){}
}

export class UpdateBarTransformArg{
constructor(public noteid:string,
public barid:string,
public x:number,
public y:number,
public w:number,
public h:number){}
}

export class RedoArg{
constructor(public noteid:string){}
}

export class AddPathArg{
constructor(public noteid:string,
public from:string,
public to:string){}
}

export class GetPathInfoArg{
constructor(public noteid:string,
public pathid_with_line:string){}
}

export class SetPathInfoArg{
constructor(public noteid:string,
public pathid_with_line:string,
public type_:number){}
}

export class RemovePathArg{
constructor(public noteid:string,
public pathid_with_line:string){}
}

export class DeleteBarArg{
constructor(public noteid:string,
public barid:string){}
}

export class LoginArg{
constructor(public id:string,
public pw:string){}
}

export class VerifyTokenArg{
constructor(public token:string){}
}

export class ArticleBinderArg{
constructor(public bind_unbind_rename:string,
public article_name:string,
public barid:string,
public noteid:string){}
}

export class ArticleListArg{
constructor(public noteid:string){}
}

export class FetchAllNoteBarsEpochArg{
constructor(public noteid:string){}
}

export class GetNotesMataReply{
constructor(public node_id_name_list:any[]){}
}

export class GetNoteMataReply{
constructor(public next_noteid:number,
public max_chunkx:number,
public max_chunky:number,
public min_chunkx:number,
public min_chunky:number){}
}

export class GetChunkNoteIdsReply{
constructor(public noteids:any[]){}
}

export class GetNoteBarInfoReply{
constructor(public x:number,
public y:number,
public w:number,
public h:number,
public text:string,
public formatted:string,
public connected:any[],
public epoch:number){}
}

export class CreateNewNoteReply{
constructor(){}
}

export class RenameNoteReply{
constructor(){}
}

export class CreateNewBarReply{
constructor(public chunkx:number,
public chunky:number,
public noteids:any[]){}
}

export class UpdateBarContentReply{
constructor(public new_epoch:number){}
}

export class UpdateBarTransformReply{
constructor(public new_epoch:number,
public chunk_maxx:number,
public chunk_minx:number,
public chunk_maxy:number,
public chunk_miny:number,
public chunk_change:any[]){}
}

export class RedoReply{
constructor(public redotype:string,
public redovalue:any){}
}

export class AddPathReply{
constructor(public _1succ_0fail:number,
public new_epoch_from:number,
public new_epoch_to:number){}
}

export class GetPathInfoReply{
constructor(public type_:number){}
}

export class SetPathInfoReply{
constructor(){}
}

export class RemovePathReply{
constructor(public new_epoch_to:number,
public new_epoch_from:number){}
}

export class DeleteBarReply{
constructor(public chunk_maxx:number,
public chunk_minx:number,
public chunk_maxy:number,
public chunk_miny:number){}
}

export class LoginReply{
constructor(public if_success:number,
public token:string){}
}

export class VerifyTokenReply{
constructor(public if_success:number,
public new_token:string){}
}

export class ArticleBinderReply{
constructor(public if_success:number){}
}

export class ArticleListReply{
constructor(public if_success:number,
public list:any[]){}
}

export class FetchAllNoteBarsEpochReply{
constructor(public bars_id_and_epoch:any[]){}
}



export class ApiCaller{
    private _icommu:ICommu|undefined
    private get_icommu():ICommu{
        return this._icommu as ICommu
    }
    init_web(on_commu_established:()=>void){
        this._icommu=new WebCommu(on_commu_established)
    }

    get_notes_mata(arg:GetNotesMataArg,cb:(reply:GetNotesMataReply)=>void):void{ this.get_icommu().send_obj({msg_type:'MsgGetNotesMata',msg_value:arg},cb)  }
get_note_mata(arg:GetNoteMataArg,cb:(reply:GetNoteMataReply)=>void):void{ this.get_icommu().send_obj({msg_type:'MsgGetNoteMata',msg_value:arg},cb)  }
get_chunk_note_ids(arg:GetChunkNoteIdsArg,cb:(reply:GetChunkNoteIdsReply)=>void):void{ this.get_icommu().send_obj({msg_type:'MsgGetChunkNoteIds',msg_value:arg},cb)  }
get_note_bar_info(arg:GetNoteBarInfoArg,cb:(reply:GetNoteBarInfoReply)=>void):void{ this.get_icommu().send_obj({msg_type:'MsgGetNoteBarInfo',msg_value:arg},cb)  }
create_new_note(arg:CreateNewNoteArg,cb:(reply:CreateNewNoteReply)=>void):void{if(AppFuncTs.get_ctx().authority_man.is_logged_in()){ this.get_icommu().send_obj({msg_type:'MsgCreateNewNote',msg_value:arg},cb) } }
rename_note(arg:RenameNoteArg,cb:(reply:RenameNoteReply)=>void):void{if(AppFuncTs.get_ctx().authority_man.is_logged_in()){ this.get_icommu().send_obj({msg_type:'MsgRenameNote',msg_value:arg},cb) } }
create_new_bar(arg:CreateNewBarArg,cb:(reply:CreateNewBarReply)=>void):void{if(AppFuncTs.get_ctx().authority_man.is_logged_in()){ this.get_icommu().send_obj({msg_type:'MsgCreateNewBar',msg_value:arg},cb) } }
update_bar_content(arg:UpdateBarContentArg,cb:(reply:UpdateBarContentReply)=>void):void{if(AppFuncTs.get_ctx().authority_man.is_logged_in()){ this.get_icommu().send_obj({msg_type:'MsgUpdateBarContent',msg_value:arg},cb) } }
update_bar_transform(arg:UpdateBarTransformArg,cb:(reply:UpdateBarTransformReply)=>void):void{if(AppFuncTs.get_ctx().authority_man.is_logged_in()){ this.get_icommu().send_obj({msg_type:'MsgUpdateBarTransform',msg_value:arg},cb) } }
redo(arg:RedoArg,cb:(reply:RedoReply)=>void):void{if(AppFuncTs.get_ctx().authority_man.is_logged_in()){ this.get_icommu().send_obj({msg_type:'MsgRedo',msg_value:arg},cb) } }
add_path(arg:AddPathArg,cb:(reply:AddPathReply)=>void):void{if(AppFuncTs.get_ctx().authority_man.is_logged_in()){ this.get_icommu().send_obj({msg_type:'MsgAddPath',msg_value:arg},cb) } }
get_path_info(arg:GetPathInfoArg,cb:(reply:GetPathInfoReply)=>void):void{ this.get_icommu().send_obj({msg_type:'MsgGetPathInfo',msg_value:arg},cb)  }
set_path_info(arg:SetPathInfoArg,cb:(reply:SetPathInfoReply)=>void):void{if(AppFuncTs.get_ctx().authority_man.is_logged_in()){ this.get_icommu().send_obj({msg_type:'MsgSetPathInfo',msg_value:arg},cb) } }
remove_path(arg:RemovePathArg,cb:(reply:RemovePathReply)=>void):void{if(AppFuncTs.get_ctx().authority_man.is_logged_in()){ this.get_icommu().send_obj({msg_type:'MsgRemovePath',msg_value:arg},cb) } }
delete_bar(arg:DeleteBarArg,cb:(reply:DeleteBarReply)=>void):void{if(AppFuncTs.get_ctx().authority_man.is_logged_in()){ this.get_icommu().send_obj({msg_type:'MsgDeleteBar',msg_value:arg},cb) } }
login(arg:LoginArg,cb:(reply:LoginReply)=>void):void{ this.get_icommu().send_obj({msg_type:'MsgLogin',msg_value:arg},cb)  }
verify_token(arg:VerifyTokenArg,cb:(reply:VerifyTokenReply)=>void):void{ this.get_icommu().send_obj({msg_type:'MsgVerifyToken',msg_value:arg},cb)  }
article_binder(arg:ArticleBinderArg,cb:(reply:ArticleBinderReply)=>void):void{if(AppFuncTs.get_ctx().authority_man.is_logged_in()){ this.get_icommu().send_obj({msg_type:'MsgArticleBinder',msg_value:arg},cb) } }
article_list(arg:ArticleListArg,cb:(reply:ArticleListReply)=>void):void{ this.get_icommu().send_obj({msg_type:'MsgArticleList',msg_value:arg},cb)  }
fetch_all_note_bars_epoch(arg:FetchAllNoteBarsEpochArg,cb:(reply:FetchAllNoteBarsEpochReply)=>void):void{ this.get_icommu().send_obj({msg_type:'MsgFetchAllNoteBarsEpoch',msg_value:arg},cb)  }

}