import axios from 'axios'
import {ROOT_PATH} from './server'
export class LoginArg { constructor(public id: string, public pw: string){} }
export class VerifyTokenArg { constructor(public token: string){} }
export class LoginReply { constructor(public if_success: number, public token: string){} }
export class VerifyTokenReply { constructor(public if_success: number, public new_token: string){} }
export class GetNotesMataArg { constructor(){} }
export class CreateNewNoteArg { constructor(){} }
export class RenameNoteArg { constructor(public noteid: string, public name: string){} }
export class GetNotesMataReply { constructor(public node_id_name_list: any[]){} }
export class CreateNewNoteReply { constructor(){} }
export class RenameNoteReply { constructor(){} }
export class GetNoteMataArg { constructor(public noteid: string){} }
export class GetChunkNoteIdsArg { constructor(public noteid: string, public chunkx: number, public chunky: number){} }
export class GetNoteBarInfoArg { constructor(public noteid: string, public notebarid: string){} }
export class CreateNewBarArg { constructor(public noteid: string, public x: number, public y: number){} }
export class UpdateBarContentArg { constructor(public noteid: string, public barid: string, public text: string, public formatted: string){} }
export class UpdateBarTransformArg { constructor(public noteid: string, public barid: string, public x: number, public y: number, public w: number, public h: number){} }
export class RedoArg { constructor(public noteid: string){} }
export class AddPathArg { constructor(public noteid: string, public from: string, public to: string){} }
export class GetPathInfoArg { constructor(public noteid: string, public pathid_with_line: string){} }
export class SetPathInfoArg { constructor(public noteid: string, public pathid_with_line: string, public type_: number){} }
export class RemovePathArg { constructor(public noteid: string, public pathid_with_line: string){} }
export class DeleteBarArg { constructor(public noteid: string, public barid: string){} }
export class ArticleBinderArg { constructor(public bind_unbind_rename: string, public article_name: string, public barid: string, public noteid: string){} }
export class ArticleListArg { constructor(public noteid: string){} }
export class FetchAllNoteBarsEpochArg { constructor(public noteid: string){} }
export class GetNoteMataReply { constructor(public next_noteid: number, public max_chunkx: number, public max_chunky: number, public min_chunkx: number, public min_chunky: number){} }
export class GetChunkNoteIdsReply { constructor(public noteids: any[]){} }
export class GetNoteBarInfoReply { constructor(public x: number, public y: number, public w: number, public h: number, public text: string, public formatted: string, public connected: any[], public epoch: number){} }
export class CreateNewBarReply { constructor(public chunkx: number, public chunky: number, public noteids: any[]){} }
export class UpdateBarContentReply { constructor(public new_epoch: number){} }
export class UpdateBarTransformReply { constructor(public new_epoch: number, public chunk_maxx: number, public chunk_minx: number, public chunk_maxy: number, public chunk_miny: number, public chunk_change: any[]){} }
export class RedoReply { constructor(public redotype: string, public redovalue: any){} }
export class AddPathReply { constructor(public _1succ_0fail: number, public new_epoch_from: number, public new_epoch_to: number){} }
export class GetPathInfoReply { constructor(public type_: number){} }
export class SetPathInfoReply { constructor(){} }
export class RemovePathReply { constructor(public new_epoch_from: number, public new_epoch_to: number){} }
export class DeleteBarReply { constructor(public chunk_maxx: number, public chunk_minx: number, public chunk_maxy: number, public chunk_miny: number){} }
export class ArticleBinderReply { constructor(public if_success: number){} }
export class ArticleListReply { constructor(public if_success: number, public list: any[]){} }
export class FetchAllNoteBarsEpochReply { constructor(public bars_id_and_epoch: any[]){} }

        export class ApiCaller{
            init_web(on_commu_established:()=>void){
                setTimeout(on_commu_established,500)
            }
            
                login(arg:LoginArg,cb:(reply:LoginReply)=>void){
                    axios.post<LoginReply>(ROOT_PATH + '/panote_auth/login',arg).then((resp:any)=>{
                        cb(resp.data)
                    })
                }
                
                verify_token(arg:VerifyTokenArg,cb:(reply:VerifyTokenReply)=>void){
                    axios.post<VerifyTokenReply>(ROOT_PATH + '/panote_auth/verify_token',arg).then((resp:any)=>{
                        cb(resp.data)
                    })
                }
                
                get_notes_mata(arg:GetNotesMataArg,cb:(reply:GetNotesMataReply)=>void){
                    axios.post<GetNotesMataReply>(ROOT_PATH + '/panote_list/get_notes_mata',arg).then((resp:any)=>{
                        cb(resp.data)
                    })
                }
                
                create_new_note(arg:CreateNewNoteArg,cb:(reply:CreateNewNoteReply)=>void){
                    axios.post<CreateNewNoteReply>(ROOT_PATH + '/panote_list/create_new_note',arg).then((resp:any)=>{
                        cb(resp.data)
                    })
                }
                
                rename_note(arg:RenameNoteArg,cb:(reply:RenameNoteReply)=>void){
                    axios.post<RenameNoteReply>(ROOT_PATH + '/panote_list/rename_note',arg).then((resp:any)=>{
                        cb(resp.data)
                    })
                }
                
                get_note_mata(arg:GetNoteMataArg,cb:(reply:GetNoteMataReply)=>void){
                    axios.post<GetNoteMataReply>(ROOT_PATH + '/panote_content/get_note_mata',arg).then((resp:any)=>{
                        cb(resp.data)
                    })
                }
                
                get_chunk_note_ids(arg:GetChunkNoteIdsArg,cb:(reply:GetChunkNoteIdsReply)=>void){
                    axios.post<GetChunkNoteIdsReply>(ROOT_PATH + '/panote_content/get_chunk_note_ids',arg).then((resp:any)=>{
                        cb(resp.data)
                    })
                }
                
                get_note_bar_info(arg:GetNoteBarInfoArg,cb:(reply:GetNoteBarInfoReply)=>void){
                    axios.post<GetNoteBarInfoReply>(ROOT_PATH + '/panote_content/get_note_bar_info',arg).then((resp:any)=>{
                        cb(resp.data)
                    })
                }
                
                create_new_bar(arg:CreateNewBarArg,cb:(reply:CreateNewBarReply)=>void){
                    axios.post<CreateNewBarReply>(ROOT_PATH + '/panote_content/create_new_bar',arg).then((resp:any)=>{
                        cb(resp.data)
                    })
                }
                
                update_bar_content(arg:UpdateBarContentArg,cb:(reply:UpdateBarContentReply)=>void){
                    axios.post<UpdateBarContentReply>(ROOT_PATH + '/panote_content/update_bar_content',arg).then((resp:any)=>{
                        cb(resp.data)
                    })
                }
                
                update_bar_transform(arg:UpdateBarTransformArg,cb:(reply:UpdateBarTransformReply)=>void){
                    axios.post<UpdateBarTransformReply>(ROOT_PATH + '/panote_content/update_bar_transform',arg).then((resp:any)=>{
                        cb(resp.data)
                    })
                }
                
                redo(arg:RedoArg,cb:(reply:RedoReply)=>void){
                    axios.post<RedoReply>(ROOT_PATH + '/panote_content/redo',arg).then((resp:any)=>{
                        cb(resp.data)
                    })
                }
                
                add_path(arg:AddPathArg,cb:(reply:AddPathReply)=>void){
                    axios.post<AddPathReply>(ROOT_PATH + '/panote_content/add_path',arg).then((resp:any)=>{
                        cb(resp.data)
                    })
                }
                
                get_path_info(arg:GetPathInfoArg,cb:(reply:GetPathInfoReply)=>void){
                    axios.post<GetPathInfoReply>(ROOT_PATH + '/panote_content/get_path_info',arg).then((resp:any)=>{
                        cb(resp.data)
                    })
                }
                
                set_path_info(arg:SetPathInfoArg,cb:(reply:SetPathInfoReply)=>void){
                    axios.post<SetPathInfoReply>(ROOT_PATH + '/panote_content/set_path_info',arg).then((resp:any)=>{
                        cb(resp.data)
                    })
                }
                
                remove_path(arg:RemovePathArg,cb:(reply:RemovePathReply)=>void){
                    axios.post<RemovePathReply>(ROOT_PATH + '/panote_content/remove_path',arg).then((resp:any)=>{
                        cb(resp.data)
                    })
                }
                
                delete_bar(arg:DeleteBarArg,cb:(reply:DeleteBarReply)=>void){
                    axios.post<DeleteBarReply>(ROOT_PATH + '/panote_content/delete_bar',arg).then((resp:any)=>{
                        cb(resp.data)
                    })
                }
                
                article_binder(arg:ArticleBinderArg,cb:(reply:ArticleBinderReply)=>void){
                    axios.post<ArticleBinderReply>(ROOT_PATH + '/panote_content/article_binder',arg).then((resp:any)=>{
                        cb(resp.data)
                    })
                }
                
                article_list(arg:ArticleListArg,cb:(reply:ArticleListReply)=>void){
                    axios.post<ArticleListReply>(ROOT_PATH + '/panote_content/article_list',arg).then((resp:any)=>{
                        cb(resp.data)
                    })
                }
                
                fetch_all_note_bars_epoch(arg:FetchAllNoteBarsEpochArg,cb:(reply:FetchAllNoteBarsEpochReply)=>void){
                    axios.post<FetchAllNoteBarsEpochReply>(ROOT_PATH + '/panote_content/fetch_all_note_bars_epoch',arg).then((resp:any)=>{
                        cb(resp.data)
                    })
                }
                
        }
        