
import {NoteCanvasTs} from "@/components/note_canvas/NoteCanvasTs";
import {EditorBarTs} from "@/components/editor_bar/EditorBarTs";
import {EditorBar} from "@/components/editor_bar/EditorBarFunc";
import {PathStruct} from "@/components/note_canvas/NoteCanvasFunc";
import {ReviewPartFunc} from "@/components/review_part/ReviewPartFunc";
import {NoteOutlineTs} from "@/components/NoteOutlineTs";
;
import {NoteLog} from "../log";
// import {NetPackRecv} from "@/net_pack_recv";
import {_path} from "./path";
import {ElMessage} from "element-plus/es";
import {GetChunkNoteIdsArg, GetNoteBarInfoArg, GetNoteBarInfoReply} from "@/logic/commu/api_caller";
import {_PaUtilTs} from "@/3rd/pa_util_ts";
import {_bridge_gui_canvas_handle} from "@/logic/bridge_gui/canvas_handle";
import {AppFuncTs} from "@/logic/app_func";

export namespace note{
    import OutlineStorageStruct = NoteOutlineTs.OutlineStorageStruct;
    import OutlineStorageStructOneTreeHelper = NoteOutlineTs.OutlineStorageStructOneTreeHelper;
    // import handle = NetPackRecv.handle;
    export class NoteHandlePathProxy{
        static create(eb:PathStruct){
            return new NoteHandlePathProxy(eb)
        }
        get_pathkey():string{
            return this.path.b_bar+","+this.path.e_bar
        }
        set_pos(bx:number, by:number, ex:number, ey:number) {
            const path=this.path
            path.w = Math.abs(bx - ex)
            path.h = Math.abs(by - ey)
            path.ox = Math.min(ex, bx)
            path.oy = Math.min(ey, by)

            path.ex = ex - path.ox;
            path.ey = ey - path.oy;
            path.bx = bx - path.ox;
            path.by = by - path.oy;
            return path
        }
        change_end_pos(ex:number, ey:number) {
            const path=this.path
            // this.path.bx=
            this.set_pos(path.ox + path.bx, path.oy + path.by, ex, ey)
        }
        change_begin_pos(bx:number, by:number) {
            const path=this.path
            this.set_pos(bx, by, path.ox + path.ex, path.oy + path.ey)
        }
        onlydata_update_with_eb(ebid:string,eb:EditorBar){
            // console.log("onlydata_update_with_eb")
            if(this.path.e_bar==ebid){
                this.change_end_pos(eb.pos_x,eb.pos_y)
            }else if(this.path.b_bar==ebid){
                this.change_begin_pos(eb.pos_x,eb.pos_y)
                // this.path.bx=eb.pos_x
                // this.path.by=eb.pos_y
            }else{
                console.error("onlydata_update_with_eb","invalid")
            }
        }
        get_pathprop(){
            return _path.LogTrans.PathProp.frompath(this)
        }
        fix(){
            // @ts-ignore
            if(!("type" in this.path)||!this.path.type){
                this.path.type=_path.PathType.solid
            }
        }
        constructor(public path:PathStruct) {
        }
    }
    export class NoteHandlePathMan{
        constructor(public handle:NoteHandle) {
        }
        setpath(pathkey:string,path:PathStruct){
            this.handle.content_data.paths[pathkey]=path
        }
        getpathproxy(pathkey:string):NoteHandlePathProxy|null{
            const p=this.getpath(pathkey)
            if(p){
                return NoteHandlePathProxy.create(p)
            }
            return null
        }
        getpath(pathkey:string):PathStruct|null{
            if(!(pathkey in this.handle.content_data.paths)){
                return null
            }
            return this.handle.content_data.paths[pathkey]
        }
        withlog_changeprop(pathproxy:NoteHandlePathProxy,pathprop:_path.LogTrans.PathProp):null|NoteLog.NoteLogger{
            const log=AppFuncTs.appctx.logctx.get_log_by_noteid(this.handle.note_id)
            const rec=NoteLog.Rec.create()
                .add_trans(new _path.LogTrans.PathPropChange(
                    pathproxy.get_pathkey(),pathprop
                ))
            console.log("withlog_changeprop",pathprop)
            if(log.try_do_ope(rec,this.handle)){
                console.log("withlog_changeprop",pathprop)
                return log
            }
            return null
        }
        withlog_del_path(pathkey:string):null|NoteLog.NoteLogger{
            const log=AppFuncTs.appctx.logctx.get_log_by_noteid(this.handle.note_id)
            const rec=NoteLog.Rec.create()
                .add_trans(new NoteLog.SubTrans.EbDisConn([pathkey]))
            if(log.try_do_ope(rec,this.handle)){
                return log
            }
            return null
        }
        onlydata_remove(pathkey:string):PathStruct{
            const p=this.handle.content_data.paths[pathkey]
            delete this.handle.content_data.paths[pathkey]
            return p
        }
        onlydata_update_after_ebmove(ebid:string){
            // console.log("onlydata_update_after_ebmove")
            const eb=this.handle.ebman().get_ebdata_by_ebid(ebid)
            eb.conns.forEach((pid:any)=>{
                const path=this.getpathproxy(pid)
                console.log("onlydata_update_after_ebmove",pid,path)
                path?.onlydata_update_with_eb(ebid,eb)
            })
        }
    }
    export class NoteHandleEbProxy{
        static create(eb:EditorBar){
            return new NoteHandleEbProxy(eb)
        }
        add_conn(pathkey:string){
            this.eb.conns.push(pathkey)
        }
        remove_conn(pathkey:string){
            this.eb.conns=this.eb.conns.filter((v:any)=>{
                return v!=pathkey
            })
        }
        constructor(public eb:EditorBar) {
        }
    }
    export class NoteHandleEbMan{
        constructor(public handle:NoteHandle) {
        }
        get_ebproxy_by_ebid(ebid:string):NoteHandleEbProxy{
            return NoteHandleEbProxy.create(this.handle.content_data.editor_bars[ebid])
        }
        get_ebdata_by_ebid(ebid:string):EditorBar{
            return this.handle.content_data.editor_bars[ebid]
        }
        onlydata_add_eb_with_id(eb:EditorBar,ebid:string){
            const content=this.handle.content_data
            if(ebid in content.editor_bars){
                console.error("onlydata_add_eb_with_id","id exist")
                return
            }
            content.editor_bars[ebid]=eb
        }
        onlydata_add_eb(eb:EditorBar):string{
            const content=this.handle.content_data
            const ebid=content.next_editor_bar_id+""
            content.editor_bars[ebid]=eb;
            content.next_editor_bar_id++;
            return ebid
        }
        onlydata_del_eb(ebid:string):EditorBar{
            const del=this.handle.content_data.editor_bars[ebid]
            delete this.handle.content_data.editor_bars[ebid]
            return del
        }
        // withlog_eb_move(ebid:string,x:number,y:number){
        //     const eb=this.get_ebdata_by_ebid(ebid)
        //     const log=AppFuncTs.appctx.logctx.get_log_by_noteid(this.handle.note_id)
        //     const rec=new NoteLog.Rec()
        //         .add_trans(new NoteLog.SubTrans.EbTrans(ebid,x,y,eb.width,eb.height))
        //     log.try_do_ope(rec,this.handle)
        // }
        //update_rela：更新相关内容{path}
        onlydata_ebs_move_with_first(firstid:string,ebids:string[],x:number,y:number,update_rela:boolean){
            const first=this.get_ebdata_by_ebid(firstid)
            const dx=x-first.pos_x
            const dy=y-first.pos_y
            first.pos_x=x
            first.pos_y=y
            if(update_rela){
                this.handle.pathman().onlydata_update_after_ebmove(firstid)
            }
            for(let i=0;i<ebids.length;i++){
                if(ebids[i]!=firstid){
                    const eb=this.get_ebdata_by_ebid(ebids[i])
                    eb.pos_x+=dx
                    eb.pos_y+=dy

                    if(update_rela){
                        this.handle.pathman().onlydata_update_after_ebmove(ebids[i])
                    }
                }
            }

        }
        withlog_ebs_move_with_first(firstid:string,ebids:string[],x:number,y:number){
            const log=AppFuncTs.appctx.logctx.get_log_by_noteid(this.handle.note_id)
            const rec=new NoteLog.Rec()
            const first=this.get_ebdata_by_ebid(firstid)
            const dx=x-first.pos_x
            const dy=y-first.pos_y
            rec.add_trans(new NoteLog.SubTrans.EbTrans(
                firstid,x,y,first.width,first.height
            ))
            for(let i=0;i<ebids.length;i++){
                if(ebids[i]!=firstid){
                    const eb=this.get_ebdata_by_ebid(ebids[i])
                    rec.add_trans(new NoteLog.SubTrans.EbTrans(
                        firstid,eb.pos_x+dx,eb.pos_y+dy,eb.width,eb.height
                    ))
                }
            }
            log.try_do_ope(rec,this.handle)
        }
        withlog_eb_edit(ebid:string,content:string){
            const eb=this.get_ebdata_by_ebid(ebid)
            const log=AppFuncTs.appctx.logctx.get_log_by_noteid(this.handle.note_id)

            console.log("withlog_eb_edit",eb.content,content)
                const rec=new NoteLog.Rec()
                    .add_trans(new NoteLog.SubTrans.EbEdit(
                        ebid,eb.content,content
                    ))

            log.try_do_ope(rec,this.handle)

        }
        // onlydata_conn_eb(conns:[string, string][]){
        //     const paths=this.handle.content_data.paths
        //     conns.forEach((v)=>{
        //         const eb1=this.get_ebdata_by_ebid(v[0])
        //         const eb2=this.get_ebdata_by_ebid(v[1])
        //
        //     })
        // }
        // onlydata_disconn_eb(conns:[string, string][]){
        //
        // }
    }
    export class NoteHandleReviewCardSetProxy{
        constructor(public set:ReviewPartFunc.CardSet) {
        }
        add_card(front:object[],back:object[]):string{
            const _this=this.set
            // if(front.length>0&&back.length>0){
                _this.cards[_this.next_card_id+""]=new ReviewPartFunc.Card(_this.next_card_id+"",front,back);
                _this.next_card_id+=1;
                return (_this.next_card_id-1)+"";
            // }
            // return null;
        }
        add_card_deleted(card:ReviewPartFunc.Card){
            if(card.id in this.set.cards){
                console.log("add_card_deleted","added")
                return
            }
            this.set.cards[card.id]=card
        }
        del_card(card_id:string):ReviewPartFunc.Card{
            const card=this.set.cards[card_id]
            delete this.set.cards[card_id]
            return card
        }
    }
    export class NoteHandleReviewMan{
        constructor(public handle:NoteHandle) {
        }

        get_cardsetproxy(cardset_key:string):null|NoteHandleReviewCardSetProxy{
            const cs=this.get_cardset(cardset_key)
            if(cs){
                return  new NoteHandleReviewCardSetProxy(cs)
            }
            return null
        }
        get_cardset(cardset_key:string):ReviewPartFunc.CardSet|null{
            const rvcardsetman=this.handle.content_data.part.review_card_set_man
            if(cardset_key in rvcardsetman.cardsets){
                return rvcardsetman.cardsets[cardset_key]
            }
            console.log("get_cardset","not found")
            return null
        }
        onlydata_add_cardset(name:string){
            const rvcardsetman=this.handle.content_data.part.review_card_set_man
            if(name in rvcardsetman.cardsets){
                console.error("onlydata_add_cardset","cardset exist")
                return;
            }
            rvcardsetman.cardsets[name]=new ReviewPartFunc.CardSet(name);
        }
        onlydata_del_cardset(name:string){
            const rvcardsetman=this.handle.content_data.part.review_card_set_man
            if(!(name in rvcardsetman.cardsets)){
                console.error("onlydata_del_cardset","cardset not exist")
                return;
            }
            delete rvcardsetman.cardsets[name]
        }
    }
    export class NoteHandleOutlineMan{

        constructor(public handle:NoteHandle) {
        }
        onlydata_removeebtag(ebid:string){
            this.handle.content_data.part.note_outline.trees.forEach((t)=>{
                if(ebid in t.all_ebs){
                    delete t.all_ebs[ebid]
                }
            })
        }
        withlog_ins2alltree(ebid:string):NoteLog.NoteLogger|null{
            const log=AppFuncTs.appctx.logctx.get_log_by_noteid(this.handle.note_id)
            const rec=new NoteLog.Rec()
                .add_trans(new NoteLog.SubTrans.OlAddNode(ebid))
            if(log.try_do_ope(rec,this.handle)){
                return log
            }
            return null
        }
        onlydata_ins2alltree(ebid:string):NoteOutlineTs.OutlineStorageStructOneTreeNode[]{
            const insnodes:NoteOutlineTs.OutlineStorageStructOneTreeNode[]=[]
            const ol=this.handle.content_data.part.note_outline
            ol.trees.forEach((v)=>{
                const treep=OutlineStorageStructOneTreeHelper.create(v)
                const res=treep.join(ebid,this.handle.content_data.editor_bars)
                if(res){
                    insnodes.push(res)
                }
            })
            return insnodes
        }
        ins2alltree_able(ebid:string){
            const ol=this.handle.content_data.part.note_outline
            let able=false
            ol.trees.forEach((v)=>{
                const treep=OutlineStorageStructOneTreeHelper.create(v)
                const [res]=treep.joinable(ebid,this.handle.content_data.editor_bars)
                if(res){
                    able=true
                }
            })
            return able
        }

        has_root_node(ebid:string){
            const ol=this.handle.content_data.part.note_outline
            // let has=false;
            return ol.trees.length>0
            // ol.trees.forEach((v)=>{
            //     if(v.root_node.cur_ebid==ebid){
            //         has=true
            //     }
            // })
            // return has
        }
        withlog_add_root(ebid:string):NoteLog.NoteLogger|null {
            const log=AppFuncTs.appctx.logctx.get_log_by_noteid(this.handle.note_id)
            const rec=new NoteLog.Rec()
            rec.add_trans(new NoteLog.SubTrans.OlAddRootNode(ebid))
            if (log.try_do_ope(rec,this.handle)){
                return log
            }
            ElMessage.error('根节点已存在')
            return null
        }
        onlydata_add_root(ebid:string):null|OutlineStorageStructOneTreeHelper{
            const ol=this.handle.content_data.part.note_outline
            let has=false;
            for(const i in ol.trees){
                if(ol.trees[i].root_node.cur_ebid==ebid){
                    has=true
                    break
                }
            }
            if(has){
                return null;
            }
            const newtree=new NoteOutlineTs.OutlineStorageStructOneTree(ebid)
            ol.trees.push(newtree)

            return OutlineStorageStructOneTreeHelper.create(newtree)
        }
        onlydata_add_existed_rootnode(root_node:NoteOutlineTs.OutlineStorageStructOneTreeNode){
            const tree=new NoteOutlineTs.OutlineStorageStructOneTree(root_node.cur_ebid)
            tree.root_node=root_node
            NoteOutlineTs.OutlineStorageStructOneTreeHelper.create(tree).recalc_all_eb()
        }
        onlydata_remove_tree_withroot(ebid:string):null|NoteOutlineTs.OutlineStorageStructOneTree{
            const ol=this.handle.content_data.part.note_outline
            let removed=null
            ol.trees=ol.trees.filter((v)=>{
                if(ebid!=v.root_node.cur_ebid){
                    removed=v
                }
                return ebid!=v.root_node.cur_ebid
            })
            return removed
        }
    }
    export class NoteChunk{
        private noteids:string[]=[]
        private fetchedids:any={}
        foreach_notebar(cb:(barid:string,barinfo:GetNoteBarInfoReply)=>void){
            for(const key in this.fetchedids){
                cb(key,this.fetchedids[key])
            }
        }
        load(handle:NoteHandle){
            AppFuncTs.get_ctx().api_caller.get_chunk_note_ids(
                new GetChunkNoteIdsArg(
                    handle.note_id,this.posx,this.posy
                ),(r)=>{
                    console.log(this.posx+","+this.posy,"chunk nids",r)
                    this.noteids=r.noteids
                    const check_loaded=()=>{
                        if(this.noteids.length==Object.keys(this.fetchedids).length){
                            // console.log("   loaded ",this.posx+","+this.posy)
                            handle.noteloader.chunk_loaded(this)
                        }else{
                            // console.log("chunk not loaded",this.noteids.length,Object.keys(this.fetchedids).length)
                        }
                    }
                    check_loaded()
                    this.noteids.forEach((v)=>{
                        AppFuncTs.get_ctx().api_caller.get_note_bar_info(
                            new GetNoteBarInfoArg(
                                handle.note_id,v
                            ),(r)=>{
                                console.log("receive note bar info")
                                this.fetchedids[v]=r
                                handle.noteloader.latest_loaded_notebar_map[v]=r
                                console.log("fetched",this.fetchedids)
                                check_loaded()
                            }
                        )
                    })
                    // handle.chunk_loaded(this)
                }
            )
        }
        remove_ebid(ebid:string){
            this.noteids=this.noteids.filter((v)=>{
                return v!=ebid
            })
            delete this.fetchedids[ebid]
        }
        add_ebid(ebid:string){
            let cont=false;
            this.noteids.forEach((v)=>{
                if(v==ebid){
                    cont=true
                }
            })
            if(cont){
                console.error("ebid shoulded exit in this chunk",this.posx,this.posy)
            }else{
                this.noteids.push(ebid)
            }
        }
        constructor(
            public posx:number,public posy:number) {
        }
        static calc_chunk_pos(x:number, y:number) {
            let cx = 0, cy = 0;
            cx = Math.floor(x / 300);
            cy = Math.floor(y / 400);
            return {cx , cy}
        }
        static chunk_key_to_x_y(key:string):{x:number,y:number}{
            let res=key.split("_")
            return {
                x:parseInt(res[0]),
                y:parseInt(res[1])
            }
        }
    }
    export class NoteLoader{
        constructor(
            public handle:NoteHandle
        ) {
        }
        //要有in view chunks，
        private loaded_chunks:any={

        }
        loading_chunks:undefined|NoteChunk[]=undefined
        chunk_range_change_flag:undefined|{minx:number,maxx:number,miny:number,maxy:number}=undefined
        chunk_loaded(chunk:NoteChunk){
            let x=chunk.posx
            let y=chunk.posy
            this.loaded_chunks[x+"_"+y]=chunk
            this.loading_chunks=this.loading_chunks?.filter((v)=>{
                return v.posx!=x||v.posy!=y
            })
            if(this.loading_chunks?.length==0){
                this.loading_chunks=undefined
            }
            console.log("chunk_"+x+"_"+y,"loaded")
        }
        get_chunk(x:number,y:number):NoteChunk|undefined{
            if (x+"_"+y in this.loaded_chunks){
                return this.loaded_chunks[x+"_"+y]
            }
            return undefined
        }
        is_chunk_loaded(x:number,y:number){
            if (x+"_"+y in this.loaded_chunks){
                return true
            }
            return false
        }
        get_loaded_chunk(ck:string):undefined|NoteChunk{
            return this.loaded_chunks[ck]
        }
        set_chunk_dirty(x:number,y:number){
            let range_changed=false
            let rangechange_flag={
                minx:this.handle.content_data.chunkminx,
                maxx:this.handle.content_data.chunkmaxx,
                miny:this.handle.content_data.chunkminy,
                maxy:this.handle.content_data.chunkmaxy}
            if(x>this.handle.content_data.chunkmaxx){
                rangechange_flag.maxx=x
                range_changed=true
            }else if(x<this.handle.content_data.chunkminx){
                rangechange_flag.minx=x
                range_changed=true
            }
            if(y>this.handle.content_data.chunkmaxy){
                rangechange_flag.maxy=y
                range_changed=true
            }else if(y<this.handle.content_data.chunkminy){
                rangechange_flag.miny=y
                range_changed=true
            }
            if(range_changed){
                this.chunk_range_change_flag=rangechange_flag
            }
            delete this.loaded_chunks[x+"_"+y]
        }
        // called by tick
        syncrange_if_chunkrange_changed(){
            if(this.chunk_range_change_flag){
                this.handle.content_data.chunkmaxx=this.chunk_range_change_flag.maxx
                this.handle.content_data.chunkmaxy=this.chunk_range_change_flag.maxy
                this.handle.content_data.chunkminx=this.chunk_range_change_flag.minx
                this.handle.content_data.chunkminy=this.chunk_range_change_flag.miny
                this.chunk_range_change_flag=undefined
                return true
            }
            return false
        }

        push_new_loading_chunk(ck:NoteChunk):boolean{
            if(this.loading_chunks==undefined){
                this.loading_chunks=[]
            }
            this.loading_chunks.push(ck)

            return this.loading_chunks.length==10
        }

        latest_loaded_notebar_map:any={}
        try_get_one_latest_loaded():undefined|[string,GetNoteBarInfoReply]{
            let pop:undefined|[string,GetNoteBarInfoReply]=undefined
            for(const key_ in this.latest_loaded_notebar_map){
                pop=[key_,this.latest_loaded_notebar_map[key_]]
                delete this.latest_loaded_notebar_map[key_]
                break;
            }
            return pop
        }

        need_refresh_bars:string[]=[]
        tick_refresh_expire_bars_cnt=0
        tick_refresh_expire_bars(){
            while (true){
                let pop=this.need_refresh_bars.pop()
                if(pop){
                    this.tick_refresh_expire_bars_cnt++
                    AppFuncTs.get_ctx().api_caller.get_note_bar_info(
                        new GetNoteBarInfoArg(this.handle.note_id,pop),
                        (res)=>{
                            // @ts-ignore
                            this.latest_loaded_notebar_map[pop]=res
                        }
                    )
                    if(this.tick_refresh_expire_bars_cnt==10){
                        break
                    }
                }else{
                    break;
                }
            }
        }
        check_all_note_bars_by_epoch(allbars:any[][]){
            // let need_refresh_bars=[]
            let allbarsmap:any={}
            allbars.forEach((bar)=>{
                const id=bar[0]
                const epoch=bar[1]
                allbarsmap[id]=1
                let ebdata:undefined|EditorBar=this.handle.content_data.editor_bars[id]
                if(ebdata){
                    // younger than server
                    // need update
                    if(ebdata.epoch!=epoch){
                        ebdata.need_update=true
                        this.need_refresh_bars.push(id)
                            // [id]=1
                    }
                }
                else{
                    this.need_refresh_bars.push(id)
                        // [id]=1
                }
            })
            let removed=[]
            for(const key in this.handle.content_data.editor_bars){
                if(allbarsmap[key]==undefined){
                    removed.push(key)
                }
            }
            removed.forEach((k)=>{
                delete this.handle.content_data.editor_bars[k]
            })
        }

        remove_ebid_in_chunk(ebid:string,ebdata:EditorBar){
            let ck=NoteChunk.calc_chunk_pos(ebdata.pos_x,ebdata.pos_y)
            const ck_=this.get_loaded_chunk(ck.cx+"_"+ck.cy)
            if(ck_){
                console.log("remove ebid in chunk",ck_)
                ck_.remove_ebid(ebid)
            }
        }
        move_chunk_ebid_from_one_to_other(ebid:string,ck:string,ck2:string){
            let a=this.get_loaded_chunk(ck)
            if(a){
                a.remove_ebid(ebid)
            }
            let b=this.get_loaded_chunk(ck2)
            if(b){
                b.add_ebid(ebid)
            }
        }
        set_chunkrange(minx:number,maxx:number,miny:number,maxy:number,sync_canvas:boolean=false){
            this.handle.content_data.chunkmaxy=maxy
            this.handle.content_data.chunkmaxx=maxx
            this.handle.content_data.chunkminy=miny
            this.handle.content_data.chunkminx=minx
            let deleted=[]
            for(const key in this.loaded_chunks){
                let ckpos=NoteChunk.chunk_key_to_x_y(key)
                if(ckpos.y>maxy||ckpos.y<miny||ckpos.x>maxx||ckpos.x<minx){
                    deleted.push(key)
                }
            }
            deleted.forEach((v)=>{
                delete this.loaded_chunks[v]
            })
            if(sync_canvas){
                _bridge_gui_canvas_handle.Handle2Canvas.new()
                    .sync_chunk_range(this.handle)
            }
            return this
        }
    }
    //笔记加载即有，关闭就释放
    // 对笔记的管理核心
    export class NoteHandle{
        noteloader:NoteLoader
        constructor(
            public note_id:string,
            public content_data:NoteContentData
        ) {
            this.noteloader=new NoteLoader(this)
        }
        static create(
            note_id:string,
            content_data:NoteContentData):NoteHandle{
            return new NoteHandle(note_id,content_data)
        }
        pathman():NoteHandlePathMan{
            return new NoteHandlePathMan(this)
        }
        ebman():NoteHandleEbMan{
            return new NoteHandleEbMan(this)
        }
        rvman():NoteHandleReviewMan{
            return new NoteHandleReviewMan(this)
        }
        olman():NoteHandleOutlineMan{
            return new NoteHandleOutlineMan(this)
        }

        //canvases hold this handle
        private holders:any={}
        add_holder(contentman:NoteCanvasTs.ContentManager){
            this.holders[contentman.hold_notehandle_id]=contentman
        }
        remove_holder(contentman:NoteCanvasTs.ContentManager){
            delete this.holders[contentman.hold_notehandle_id]
        }
        foreach_holders(cb:(contentman:NoteCanvasTs.ContentManager)=>void){
            for(const key in this.holders){
                cb(this.holders[key])
            }
        }

        brige_gui_from_canvas_tickload(chunk_range: _PaUtilTs.Rect){
            this.noteloader.tick_refresh_expire_bars()
            this.noteloader.syncrange_if_chunkrange_changed()
            if(this.noteloader.loading_chunks){
                return;
            }
            //先扫描视野区块，视野未加载完，先加载视野
            // console.log("view ck range",chunk_range)
            for(let i=chunk_range.x;i<=chunk_range.right();i++){
                for(let j=chunk_range.y;j<=chunk_range.bottom();j++){
                    if(!this.noteloader.is_chunk_loaded(i,j)){
                        let newchunk=new note.NoteChunk(i,j)
                        const ret=this.noteloader.push_new_loading_chunk(newchunk)
                        newchunk.load(this)
                        console.log("load in view chunk",i,j)
                        if(ret){
                            return
                        }
                    }
                }
            }
            for(let i=this.content_data.chunkminx;i<=this.content_data.chunkmaxx;i++){
                for(let j=this.content_data.chunkminy;j<=this.content_data.chunkmaxy;j++){
                    if(!this.noteloader.is_chunk_loaded(i,j)){
                        let newchunk=new NoteChunk(i,j)
                        const ret=this.noteloader.push_new_loading_chunk(newchunk)
                        newchunk.load(this)
                        console.log("load all range chunk",i,j)

                        if(ret){
                            return
                        }
                    }
                }
            }
        }
    }
    //会被直接序列化到文件中的结构
    export class NoteContentData{
        static fix_old_version(data:NoteContentData){
            console.log("fix_old_version")

            if(!data.part.note_outline){
                data.part.note_outline=new NoteOutlineTs.OutlineStorageStruct()
            }
            //outline_data
            OutlineStorageStruct.fix_old(data.part.note_outline)

            //next_editor_bar_id
            if(data.next_editor_bar_id<2000){
                data.next_editor_bar_id=2000
            }

            const delk=[]
            // for(const k in data.editor_bars){
            //     const eb=data.editor_bars[k] as EditorBar
            //     if(eb.pos_x>10000){
            //         eb.pos_x=10000
            //     }
            //     if(eb.pos_x<-10000){
            //         eb.pos_x=-10000
            //     }
            //     if(eb.pos_y>10000){
            //         eb.pos_y=10000
            //     }
            //     if(eb.pos_y<-10000){
            //         eb.pos_y=-10000
            //     }
            // }
            //path
            for(const k in data.paths){
                const ks=k.split(",")

                if(!(ks[0] in data.editor_bars)||
                    !(ks[1] in data.editor_bars)
                ){
                    console.error("invalid path",k)
                    delk.push(k)
                }else{
                    const p:PathStruct=data.paths[k]
                    NoteHandlePathProxy.create(p).fix()
                    // const notehandle=new NoteHandle("",data)
                    // const pp=notehandle.pathman().getpathproxy(k)
                    // const e1=notehandle.ebman().get_ebproxy_by_ebid(ks[0])
                    // const e2=notehandle.ebman().get_ebproxy_by_ebid(ks[1])
                    // pp?.onlydata_update_with_eb(ks[0],e1.eb)
                    // pp?.onlydata_update_with_eb(ks[1],e2.eb)
                }
            }

            delk.forEach((k)=>{
                delete data.paths[k]
            })
        }
        chunkminx=0
        chunkminy=0
        chunkmaxx=0
        chunkmaxy=0
        next_editor_bar_id=1000
        editor_bars:any={}
        paths:any={}
        part=new NoteCanvasTs.PartOfNoteContentData()
        static get_default(){
            return new NoteContentData(1000,{},{})
        }
        static of_canvas(canvas:any){
            const ret=new NoteContentData(
                canvas.next_editor_bar_id,
                canvas.editor_bars,
                canvas.paths)
            if(canvas.content_manager.part_of_storage_data){
                ret.part=canvas.content_manager.part_of_storage_data
            }
            return ret
        }

        constructor(next_editor_bar_id:number,editor_bars:any,paths:any) {
            this.next_editor_bar_id=next_editor_bar_id
            this.editor_bars=editor_bars
            this.paths=paths
        }
    }
}