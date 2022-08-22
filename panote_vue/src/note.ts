
import {NoteCanvasTs} from "@/components/note_canvas/NoteCanvasTs";
import {EditorBarTs} from "@/components/editor_bar/EditorBarTs";
import {EditorBar} from "@/components/editor_bar/EditorBarFunc";
import {PathStruct} from "@/components/note_canvas/NoteCanvasFunc";
import {ReviewPartFunc} from "@/components/ReviewPartFunc";
import {NoteOutlineTs} from "@/components/NoteOutlineTs";
import {AppFuncTs} from "@/AppFunc";
import {NoteLog} from "@/log";
import {NetPackRecv} from "@/net_pack_recv";
import {_path} from "@/note/path";
import {ElMessage} from "element-plus/es";

export namespace note{
    import OutlineStorageStruct = NoteOutlineTs.OutlineStorageStruct;
    import OutlineStorageStructOneTreeHelper = NoteOutlineTs.OutlineStorageStructOneTreeHelper;
    import handle = NetPackRecv.handle;
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
            eb.conns.forEach((pid)=>{
                const path=this.getpathproxy(pid)
                // console.log("onlydata_update_after_ebmove",pid,path)
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
            this.eb.conns=this.eb.conns.filter((v)=>{
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
    //笔记加载即有，关闭就释放
    // 对笔记的管理核心
    export class NoteHandle{
        constructor(
            public note_id:string,
            public content_data:NoteContentData
        ) {
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
        static create(
            note_id:string,
            content_data:NoteContentData):NoteHandle{
            return new NoteHandle(note_id,content_data)
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