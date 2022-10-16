import {note} from "./note/note";
// import {NetPackRecv} from "@/net_pack_recv";
import {EditorBar} from "@/components/editor_bar/EditorBarFunc";
import {ReviewPartFunc} from "@/components/review_part/ReviewPartFunc";
import {NoteOutlineTs} from "@/components/NoteOutlineTs";
import {_PaUtilTs} from "@/3rd/pa_util_ts";
import {AppFuncTs} from "./AppFunc";
import {PathStruct} from "@/components/note_canvas/NoteCanvasFunc";
import {
    AddPathArg,
    AddPathReply,
    DeleteBarArg, RemovePathArg,
    UpdateBarContentArg,
    UpdateBarTransformArg
} from "@/logic/commu/api_caller";
import {PathStructProxy} from "@/components/PathTS";
// import {_ReviewPartSyncAnki} from "@/components/review_part/ReviewPartSyncAnki";

export namespace NoteLog {

    export namespace SubTrans {
        // import NoteHandlePathProxy = note.NoteHandlePathProxy;

        export interface ITrans {
            doable(handle: note.NoteHandle,log:NoteLogger, ctx: AppFuncTs.Context): boolean

            redo(handle: note.NoteHandle,log:NoteLogger, ctx: AppFuncTs.Context): void

            undo(handle: note.NoteHandle,log:NoteLogger, ctx: AppFuncTs.Context): void
        }

        //ok
        export class EbAdd implements ITrans {
            ebid = ""

            constructor(
                public eb: EditorBar
            ) {
            }

            redo(handle: note.NoteHandle,log:NoteLogger,  ctx: AppFuncTs.Context): void {
                console.log("EbAdd","redo")
                if(this.ebid==""){
                    this.ebid = handle.ebman().onlydata_add_eb(this.eb)
                }else{
                    handle.ebman().onlydata_add_eb_with_id(this.eb,this.ebid)
                }
                //变更完后重新
                if(ctx.cur_canvasproxy?.get_content_manager().notehandle.note_id
                    ==handle.note_id
                ){
                    ctx.cur_canvasproxy?.get_content_manager().chunkhelper
                        .eb_add(this.eb)
                        .update_canvas_chunkpadding()
                }
            }

            undo(handle: note.NoteHandle,log:NoteLogger, ctx: AppFuncTs.Context): void {
                console.log("EbAdd","undo")
                if (this.ebid != "") {
                    handle.ebman().onlydata_del_eb(this.ebid)
                }

                if(ctx.cur_canvasproxy?.get_content_manager().notehandle.note_id
                    ==handle.note_id
                ){
                    ctx.cur_canvasproxy?.get_content_manager().chunkhelper
                        .eb_remove(this.eb)
                        .update_canvas_chunkpadding()
                }
            }

            doable(handle: note.NoteHandle,log:NoteLogger,  ctx: AppFuncTs.Context): boolean {
                return true;
            }
        }

        export class EbTransState{
            constructor(public x:number,
                        public y:number,
                        public w:number,
                        public h:number) {
            }
            set2data(data:EditorBar){
                data.pos_x=this.x
                data.pos_y=this.y
                data.width=this.w
                data.height=this.h
            }
            copyfromdata(data:EditorBar){
                this.x=data.pos_x
                this.y=data.pos_y
                this.w=data.width
                this.h=data.height
            }
            clone():EbTransState{
                return new EbTransState(this.x,
                this.y,
                this.w,
                this.h)
            }
            static makefrom_data(data:EditorBar):EbTransState{
                return new EbTransState(data.pos_x,data.pos_y,data.width,data.height)
            }
        }
        //文本块拖拽 ok
        export class EbTrans implements ITrans{
            state:EbTransState
            old_state:EbTransState|null=null
            constructor(public ebid:string,
                        public x:number,
                        public y:number,
                        public w:number,
                        public h:number) {
                this.state=new EbTransState(x,y,w,h)
            }
            doable(handle: note.NoteHandle,log:NoteLogger,  ctx: AppFuncTs.Context): boolean {
                return true;
            }

            redo(handle: note.NoteHandle,log:NoteLogger,  ctx: AppFuncTs.Context): void {
                const eb=handle.ebman().get_ebdata_by_ebid(this.ebid)
                if(!this.old_state){
                    this.old_state=log.get_recent_EbTransState_by_ebid(this.ebid)
                    if(!this.old_state){
                        this.old_state=EbTransState.makefrom_data(eb)
                    }
                }
                this.state.set2data(eb)
                console.log("send trans",this.ebid)
                AppFuncTs.get_ctx().api_caller.update_bar_transform(
                    new UpdateBarTransformArg(
                        handle.note_id,this.ebid,this.state.x,this.state.y,this.state.w,this.state.h
                    ),(r)=>{
                        console.log("send trans succ",r)
                        if(r.chunk_change.length==2){
                            handle.move_chunk_ebid_from_one_to_other(this.ebid,r.chunk_change[0],r.chunk_change[1])
                            handle.set_chunkrange(r.chunk_minx,r.chunk_maxx,r.chunk_miny,r.chunk_maxy,true)
                        }
                    }
                )
                handle.pathman().onlydata_update_after_ebmove(this.ebid)
                log.set_recent_EbTransState_by_ebid(this.ebid,this.state)
            }

            undo(handle: note.NoteHandle,log:NoteLogger,  ctx: AppFuncTs.Context): void {
                const eb=handle.ebman().get_ebdata_by_ebid(this.ebid)
                if(this.old_state){
                    this.old_state.set2data(eb)
                    handle.pathman().onlydata_update_after_ebmove(this.ebid)
                    log.set_recent_EbTransState_by_ebid(this.ebid,this.old_state)
                }
            }
        }

        //文本块编辑 ok
        export class EbEdit implements ITrans{

            constructor(public ebid:string,public from:string,public to:string) {
            }
            doable(handle: note.NoteHandle, log: NoteLog.NoteLogger, ctx: AppFuncTs.Context): boolean {
                if(log.eb_edit_back==this.ebid){
                    log.eb_edit_back=null
                    return false;
                }
                return true;
            }

            redo(handle: note.NoteHandle, log: NoteLog.NoteLogger, ctx: AppFuncTs.Context): void {
                console.log("EbEdit","redo")
                const eb=handle.ebman().get_ebdata_by_ebid(this.ebid)
                eb.content=this.to
                AppFuncTs.get_ctx().api_caller.update_bar_content(new UpdateBarContentArg(handle.note_id,this.ebid,this.to,this.to),
                    (r)=>{})
                if(!log.fisrt_redo){
                    log.eb_edit_back=this.ebid
                }
            }

            undo(handle: note.NoteHandle, log: NoteLog.NoteLogger, ctx: AppFuncTs.Context): void {
                console.log("EbEdit","undo")
                const eb=handle.ebman().get_ebdata_by_ebid(this.ebid)
                // if(eb.content!=this.from){
                    eb.content=this.from
                    log.eb_edit_back=this.ebid
                // }
            }

        }

        //关联存在路径操作 (还有ol
        export class EbDel implements ITrans {
            ebdata: EditorBar | null = null
            rec_conn: EbDisConn | null = null
            rec_ol: OlDelNode | null = null

            constructor(
                public ebid: string
            ) {
            }

            redo(handle: note.NoteHandle,log:NoteLogger, ctx: AppFuncTs.Context): void {
                console.log("ebdel redo")
                this.ebdata = handle.ebman().get_ebdata_by_ebid(this.ebid);
                this.rec_conn = new EbDisConn(this.ebdata.conns)
                AppFuncTs.get_ctx().api_caller
                    .delete_bar(new DeleteBarArg(handle.note_id,this.ebid),(r)=>{
                        handle.set_chunkrange(r.chunk_minx,r.chunk_maxx,r.chunk_miny,r.chunk_maxy,true)
                        // @ts-ignore
                        handle.remove_ebid_in_chunk(this.ebid,this.ebdata)
                        //先断开路径
                        // @ts-ignore
                        this.rec_conn.redo(handle,log, ctx)
                        handle.ebman().onlydata_del_eb(this.ebid)
                    })

                // if(ctx.cur_canvasproxy?.get_content_manager().notehandle.note_id
                //     ==handle.note_id
                // ){
                //     ctx.cur_canvasproxy?.get_content_manager().chunkhelper
                //         .eb_remove(this.ebdata)
                //         .update_canvas_chunkpadding()
                // }
            }

            undo(handle: note.NoteHandle,log:NoteLogger, ctx: AppFuncTs.Context): void {
                console.log("ebdel undo")
                if (this.ebdata) {
                    //要恢复成原先id 不然路径信息会失效
                    handle.ebman().onlydata_add_eb_with_id(this.ebdata, this.ebid)
                    this.rec_conn?.undo(handle,log, ctx)

                    if(ctx.cur_canvasproxy?.get_content_manager().notehandle.note_id
                        ==handle.note_id
                    ){
                        ctx.cur_canvasproxy?.get_content_manager().chunkhelper
                            .eb_add(this.ebdata)
                            .update_canvas_chunkpadding()
                    }
                }
            }

            doable(handle: note.NoteHandle,log:NoteLogger,  ctx: AppFuncTs.Context): boolean {
                return this.ebid in handle.content_data.editor_bars;
            }
        }

        //文本块连线 ok
        export class EbConn implements ITrans {
            constructor(
                public conn_pairs: [string, string][]
            ) {
            }

            redo(handle: note.NoteHandle,log:NoteLogger,  ctx: AppFuncTs.Context): void {
                this.conn_pairs.forEach(([ebid1,ebid2])=>{
                    const pathkey=ebid1+","+ebid2
                    const ebp1=handle.ebman().get_ebproxy_by_ebid(ebid1)
                    const ebp2=handle.ebman().get_ebproxy_by_ebid(ebid2)
                    const pathp=note.NoteHandlePathProxy.create(new PathStruct())
                    pathp.path.e_bar=ebid2
                    pathp.path.b_bar=ebid1
                    pathp.change_begin_pos(ebp1.eb.pos_x,ebp1.eb.pos_y)
                    pathp.change_end_pos(ebp2.eb.pos_x,ebp2.eb.pos_y)
                    ebp1.add_conn(pathkey)
                    ebp2.add_conn(pathkey)
                    handle.pathman().setpath(pathkey,pathp.path)
                    AppFuncTs.get_ctx().api_caller.add_path(new AddPathArg(
                        handle.note_id,ebid1,ebid2
                    ),(_r)=>{})
                })
            }

            undo(handle: note.NoteHandle,log:NoteLogger, ctx: AppFuncTs.Context): void {
                this.conn_pairs.forEach(([ebid1,ebid2])=>{
                    const pathkey=ebid1+","+ebid2
                    const ebp1=handle.ebman().get_ebproxy_by_ebid(ebid1)
                    const ebp2=handle.ebman().get_ebproxy_by_ebid(ebid2)
                    ebp1.remove_conn(pathkey)
                    ebp2.remove_conn(pathkey)
                    handle.pathman().onlydata_remove(pathkey)
                })
            }

            doable(handle: note.NoteHandle,log:NoteLogger, ctx: AppFuncTs.Context): boolean {
                return true;
            }
        }

        //文本块断连 ok
        export class EbDisConn implements ITrans {
            removed_paths: PathStruct[] = []

            constructor(
                public pathkeys: string[]
            ) {
            }

            redo(handle: note.NoteHandle,log:NoteLogger, ctx: AppFuncTs.Context): void {
                this.pathkeys.forEach((v) => {
                    console.log("redopk",v)
                    const path = handle.pathman().getpath(v)
                    if (path) {
                        AppFuncTs.get_ctx().api_caller
                            .remove_path(new RemovePathArg(handle.note_id,
                                path.b_bar+"_"+path.e_bar),(_r)=>{
                                const ebp = handle.ebman().get_ebproxy_by_ebid(path.b_bar + "")
                                const ebp2 = handle.ebman().get_ebproxy_by_ebid(path.e_bar + "")
                                ebp.remove_conn(v)
                                ebp2.remove_conn(v)
                                handle.pathman().onlydata_remove(v)

                                this.removed_paths.push(path)
                            })
                    }
                })
            }

            undo(handle: note.NoteHandle,log:NoteLogger, ctx: AppFuncTs.Context): void {
                this.removed_paths.forEach((path) => {
                    const pathkey = note.NoteHandlePathProxy.create(path).get_pathkey()
                    console.log("undopk",pathkey)
                    const ebp = handle.ebman().get_ebproxy_by_ebid(path.b_bar + "")
                    const ebp2 = handle.ebman().get_ebproxy_by_ebid(path.e_bar + "")
                    ebp.add_conn(pathkey)
                    ebp2.add_conn(pathkey)
                    handle.content_data.paths[pathkey] = path
                })
                this.removed_paths = []
            }

            doable(handle: note.NoteHandle,log:NoteLogger,  ctx: AppFuncTs.Context): boolean {
                let ok = true
                this.pathkeys.forEach((v) => {
                    if (!(v in handle.content_data.paths)) {
                        ok = false
                    }
                })
                return ok;
            }
        }

        //添加复习卡组 ok
        export class RvAddCardSet implements ITrans {
            constructor(
                public name: string
            ) {
            }

            redo(handle: note.NoteHandle,log:NoteLogger,ctx: AppFuncTs.Context): void {
                console.log("RvAddCardSet","redo")
                handle.rvman().onlydata_add_cardset(this.name)
            }

            undo(handle: note.NoteHandle,log:NoteLogger,  ctx: AppFuncTs.Context): void {
                console.log("RvAddCardSet","undo")
                handle.rvman().onlydata_del_cardset(this.name)
            }

            doable(handle: note.NoteHandle,log:NoteLogger,  ctx: AppFuncTs.Context): boolean {
                return true;
            }
        }

        //添加复习卡片 ok
        export class RvAddCard implements ITrans {
            cardid = ""

            constructor(
                public cardset_name: string,
                public cardfront: object[],
                public cardback: object[]
            ) {
            }

            redo(handle: note.NoteHandle,log:NoteLogger, ctx: AppFuncTs.Context): void {
                const setp = handle.rvman().get_cardsetproxy(this.cardset_name)
                if (!setp) {
                    return
                }
                this.cardid = setp.add_card(this.cardfront, this.cardback)
                // {
                //     AppFuncTs.appctx.rewiew_part_man.sync_anki_proxy()
                //         .push_new_ope(
                //             new _ReviewPartSyncAnki._OneOperation.OneOperation(
                //                 _ReviewPartSyncAnki._OneOperation.OpeType.Add,
                //                 _PaUtilTs.get_time_stamp(),
                //                 new _ReviewPartSyncAnki._OneOperation.OpeCard(
                //                     handle.note_id,this.cardset_name,this.cardid
                //                 )
                //             )
                //         )
                // }
                // handle.content_data.part.review_card_set_man;
            }

            undo(handle: note.NoteHandle, log:NoteLogger,ctx: AppFuncTs.Context): void {
                const setp = handle.rvman().get_cardsetproxy(this.cardset_name)
                if (!setp) {
                    return
                }
                // if (this.cardid != "") {
                //     setp.del_card(this.cardid)
                //     AppFuncTs.appctx.rewiew_part_man.sync_anki_proxy()
                //         .push_new_ope(
                //             new _ReviewPartSyncAnki._OneOperation.OneOperation(
                //                 _ReviewPartSyncAnki._OneOperation.OpeType.Delete,
                //                 _PaUtilTs.get_time_stamp(),
                //                 new _ReviewPartSyncAnki._OneOperation.OpeCard(
                //                     handle.note_id,this.cardset_name,this.cardid
                //                 )
                //             )
                //         )
                // }
            }

            doable(handle: note.NoteHandle, log:NoteLogger,ctx: AppFuncTs.Context): boolean {
                return true;
            }
        }

        //删除复习卡片 ok
        export class RvDelCard implements ITrans {
            card: ReviewPartFunc.Card | undefined

            constructor(
                public cardset_name: string,
                public cardid: string,//撤销
            ) {
            }

            redo(handle: note.NoteHandle, log:NoteLogger,ctx: AppFuncTs.Context): void {
                const setp = handle.rvman().get_cardsetproxy(this.cardset_name)
                if (!setp) {
                    return
                }
                this.card = setp.del_card(this.cardid)
                // AppFuncTs.appctx.rewiew_part_man.sync_anki_proxy()
                //     .push_new_ope(
                //         new _ReviewPartSyncAnki._OneOperation.OneOperation(
                //             _ReviewPartSyncAnki._OneOperation.OpeType.Delete,
                //             _PaUtilTs.get_time_stamp(),
                //             new _ReviewPartSyncAnki._OneOperation.OpeCard(
                //                 handle.note_id,this.cardset_name,this.cardid
                //             )
                //         )
                //     )
            }

            undo(handle: note.NoteHandle,log:NoteLogger, ctx: AppFuncTs.Context): void {
                const setp = handle.rvman().get_cardsetproxy(this.cardset_name)
                if (!setp) {
                    return
                }
                // if (this.card) {
                //     setp.add_card_deleted(this.card)
                //     AppFuncTs.appctx.rewiew_part_man.sync_anki_proxy()
                //         .push_new_ope(
                //             new _ReviewPartSyncAnki._OneOperation.OneOperation(
                //                 _ReviewPartSyncAnki._OneOperation.OpeType.Add,
                //                 _PaUtilTs.get_time_stamp(),
                //                 new _ReviewPartSyncAnki._OneOperation.OpeCard(
                //                     handle.note_id,this.cardset_name,this.cardid
                //                 )
                //             )
                //         )
                // }
            }

            doable(handle: note.NoteHandle,log:NoteLogger, ctx: AppFuncTs.Context): boolean {
                const setp = handle.rvman().get_cardsetproxy(this.cardset_name)
                if (!setp) {
                    console.log("cardset not found",this.cardset_name)
                    return false
                }
                console.log("card in cardset",this.cardid,setp.set.cards)
                return this.cardid in setp.set.cards
            }
        }

        //大纲添加节点 ok
        export class OlAddNode implements ITrans {
            insnodes: NoteOutlineTs.OutlineStorageStructOneTreeNode[] = []

            constructor(
                public ebid: string
            ) {
            }

            redo(handle: note.NoteHandle,log:NoteLogger, ctx: AppFuncTs.Context): void {
                this.insnodes = handle.olman().onlydata_ins2alltree(this.ebid)
            }

            undo(handle: note.NoteHandle,log:NoteLogger, ctx: AppFuncTs.Context): void {
                // this.insnodes.pop()

                if (this.insnodes.length > 0) {
                    this.insnodes.forEach((v) => {
                        v.child_nodes.pop();
                    })
                }
                handle.olman().onlydata_removeebtag(this.ebid)
            }

            doable(handle: note.NoteHandle, log:NoteLogger,ctx: AppFuncTs.Context): boolean {
                return handle.olman().ins2alltree_able(this.ebid)
            }

        }

        //大纲添加根节点
        export class OlAddRootNode implements ITrans {
            constructor(
                public ebid: string
            ) {
            }

            doable(handle: note.NoteHandle,log:NoteLogger, ctx: AppFuncTs.Context): boolean {
                return !handle.olman().has_root_node(this.ebid)
                // return true;
            }

            redo(handle: note.NoteHandle,log:NoteLogger, ctx: AppFuncTs.Context): void {
                handle.olman().onlydata_add_root(this.ebid)
                // handle.olman().
            }

            undo(handle: note.NoteHandle,log:NoteLogger, ctx: AppFuncTs.Context): void {
                handle.olman().onlydata_remove_tree_withroot(this.ebid)
            }
        }

        export class OlDelNode implements ITrans {
            constructor(
                public node: NoteOutlineTs.OutlineStorageStructOneTreeNode,
                public father: NoteOutlineTs.OutlineStorageStructOneTreeNode | null//根据有无father区分是否为父节点
            ) {
            }

            deled: null | NoteOutlineTs.OutlineStorageStructOneTreeNode = null

            doable(handle: note.NoteHandle,log:NoteLogger, ctx: AppFuncTs.Context): boolean {
                if (this.father) {
                    let has = false
                    this.father.child_nodes.forEach((v) => {
                        if (v.cur_ebid == this.node.cur_ebid) {
                            has = true
                        }
                    })
                    return has
                } else {
                    return handle.olman().has_root_node(this.node.cur_ebid)
                }
            }

            redo(handle: note.NoteHandle,log:NoteLogger, ctx: AppFuncTs.Context): void {
                if (this.father) {
                    this.father.child_nodes = this.father.child_nodes.filter((v) => {
                        if (v.cur_ebid == this.node.cur_ebid) {
                            this.deled = this.node
                        }
                        return v.cur_ebid != this.node.cur_ebid
                    })
                } else {
                    const tree = handle.olman().onlydata_remove_tree_withroot(this.node.cur_ebid)
                    if (tree) {
                        this.deled = tree.root_node
                    }
                }
            }

            undo(handle: note.NoteHandle, log:NoteLogger,ctx: AppFuncTs.Context): void {
                if (this.father) {
                    this.father.child_nodes.push(this.node)
                } else {
                    handle.olman().onlydata_add_existed_rootnode(this.node)
                }
            }
        }
    }

    export class Rec {//记录最新一次操作后的状态以及发生的变更
        static create(){
            return new Rec()
        }
        //
        // states: SubStates.IState[] = []
        transs: SubTrans.ITrans[] = []
        // //最新状态
        // state_ebtrans: undefined | SubStates.EbTrans
        // state_ebcontent: undefined | SubStates.EbContent
        //
        // //最新变更
        // trans_ebadd: undefined | SubTrans.EbAdd
        // trans_ebdel: undefined | SubTrans.EbDel
        // trans_ebcon: undefined | SubTrans.EbConn
        // trans_rvaddcard: undefined | SubTrans.RvAddCard
        // trans_rvaddcardset: undefined | SubTrans.RvAddCardSet
        // trans_oladdnode: undefined | SubTrans.OlAddNode
        // trans_oladdroot: undefined | SubTrans.OlAddRootNode
        // trans_oldelnode: undefined | SubTrans.OlDelNode
        doable(handle: note.NoteHandle,log:NoteLogger): boolean {
            // if (this.states.length > 0) {
            //     return true
            // }
            for (let i = 0; i < this.transs.length; i++) {
                if (this.transs[i].doable(handle,log, AppFuncTs.appctx)) {
                    return true
                }
            }
            return false
        }

        // //同样的操作对象
        // find_sametar_state(state
        //               :
        //               SubStates.IState
        // ):null|SubStates.IState {
        //     for(let i=0;i<this.states.length;i++){
        //         if(this.states[i].get_type()==state.get_type()){
        //             return this.states[i]
        //         }
        //     }
        //     return null
        // }

        // add_state(state
        //               :
        //               SubStates.IState
        // ) {
        //     this.states.push(state)
        //     return this
        // }

        add_trans(trans
                      :
                      SubTrans.ITrans
        ) {
            this.transs.push(trans)
            return this
        }

        constructor() {
        }
    }

    //一个笔记一个log，持久存在,所以不能持有notehandle，只能持有noteid
    export class NoteLogger {
        fisrt_redo=false
        eb_edit_back:null|string=null
        //用链表存储最开始状态以及每一次操作后的状态
        //  尾部为新操作，最短为1，用来确保下一次记录可以记录状态
        rec_list = new _PaUtilTs.DataStructure.ListSerializable.Class<Rec>()
        //  尾部为最新撤回的（时间上最旧的
        undo_list = new _PaUtilTs.DataStructure.ListSerializable.Class<Rec>()
        _ebid_2_recent_EbTransState:any={}
        constructor(public  noteid:string) {
        }
        get_recent_EbTransState_by_ebid(ebid:string):null|SubTrans.EbTransState{
            if(ebid !in this._ebid_2_recent_EbTransState){
                return null
            }
            return this._ebid_2_recent_EbTransState[ebid]
        }
        set_recent_EbTransState_by_ebid(ebid:string,state:SubTrans.EbTransState){
            this._ebid_2_recent_EbTransState[ebid]=state
        }
        //操作后清除后续操作链
        // 首次执行，判断是否有效
        try_do_ope(rec: Rec, handle: note.NoteHandle): boolean {
            this.fisrt_redo=true
            const ctx=AppFuncTs.appctx
            if (rec.doable(handle,this)) {
                this.undo_list.clear()
                rec.transs.forEach((v)=>{
                    console.log("log do",v)
                    v.redo(handle,this,ctx)
                })
                //状态的设置需要确保之前的状态已经被记录下来
                // if(rec.states.length>0){
                //     const lastrec=this.rec_list.tail?.prev?.element
                //     if(lastrec){
                //         rec.states.forEach((v)=>{
                //             const res=lastrec.find_sametype_state(v)
                //             if(!res){
                //
                //             }
                //         })
                //     }
                // }
                // rec.states.forEach()
                this.rec_list.push(rec)
                // ctx.storage_manager.note_data_change(handle.note_id)

                if(this.rec_list.count==201){
                    // 超量
                    this.rec_list.pop()
                }
                return true
            }
            console.error("rec not doable")
            //清除之前的记录
            return false
        }

        redo_ope(handle: note.NoteHandle) :boolean{
            this.fisrt_redo=false
            if(this.undo_list.count>0){
                const redo=this.undo_list.pop_tail()
                if(redo){
                    redo.transs.forEach((v)=>{
                        v.redo(handle,this,AppFuncTs.appctx)
                    })
                    this.rec_list.push(redo)
                    return true
                }
            }
            return false
        }

        undo_ope(handle: note.NoteHandle) :boolean{
            if(this.rec_list.count>0){
                //提出最新的操作
                const undo = this.rec_list.pop_tail()
                if(undo){
                    this.undo_list.push(undo)
                    undo.transs.forEach((v)=>{
                        v.undo(handle,this,AppFuncTs.appctx)
                    })
                }
                // if(undo){
                //
                // }
                return true
            }
            return false
        }
        set_store_flag_after_do(){
            // AppFuncTs.appctx.storage_manager.note_data_change(this.noteid)
        }
    }

    export class LogContext {
        //logger不随笔记的unload清除，所以单独用map存
        _noteid_2_logger: any = {}

        get_log_by_noteid(noteid: string): NoteLogger {
            if(noteid==""){
                console.error("invalid noteid")
            }
            if (!(noteid in this._noteid_2_logger)) {
                this._noteid_2_logger[noteid]=new NoteLogger(noteid)
            }
            return this._noteid_2_logger[noteid]
        }
    }
}