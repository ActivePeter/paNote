import {EditorBarTs} from "@/components/EditorBarTs";
import {StorageInterface} from "@/storage/StorageInterface";
import {AppFuncTs} from "@/AppFunc";

export namespace NoteOutlineTs {
    export class OutlineStorageStructOneTreeNode {
        cur_ebid: string
        child_nodes: OutlineStorageStructOneTreeNode[] = []

        constructor(ebid: string) {
            this.cur_ebid = ebid
        }
    }

    export class OutlineStorageStructOneTreeHelper {
        constructor(public tree: OutlineStorageStructOneTree) {
        }

        static create(tree: OutlineStorageStructOneTree): OutlineStorageStructOneTreeHelper {
            const helper = new OutlineStorageStructOneTreeHelper(tree)
            return helper
        }

        recalc_all_eb(){
            this.tree.all_ebs={}
            const recalc_all_eb_walk=(node:OutlineStorageStructOneTreeNode)=>{
                this.tree.all_ebs[node.cur_ebid]=1
                node.child_nodes.forEach((v)=>{
                    recalc_all_eb_walk(v)
                })
            }
            recalc_all_eb_walk(this.tree.root_node)
        }
        remove_walk(ebid:string,node:OutlineStorageStructOneTreeNode):boolean{
            let find=-1;
            for(let i =0 ;i< node.child_nodes.length;i++){
                if(node.child_nodes[i].cur_ebid==ebid){
                    find=i
                    break;
                }
            }
            if(find==-1){
                for(let i =0 ;i< node.child_nodes.length;i++){
                    if(this.remove_walk(ebid,node.child_nodes[i])){
                        return true
                    }
                }
                return false;
            }
            node.child_nodes=node.child_nodes.filter((v,i)=>{
                return i!=find
            })
            return true
        }
        remove_node(ebid:string):boolean{
            return  this.remove_walk(ebid,this.tree.root_node)
        }
        //判断树有无节点可接入
        joinable(ebid: string,ebars:any):[boolean,string] {
            for (const key in this.tree.all_ebs) {
                if (key == ebid) {
                    return [false,""];//已经介入
                }
            }
            for (const key in this.tree.all_ebs) {
                const proxy = EditorBarTs.EditorBarProxy
                    .create(ebars[key])
                if(proxy.is_connect_eb(ebid)){
                    return [true,key]
                }
            }
            return [false,""]
        }
        find_node_walk(ebid:string,node:OutlineStorageStructOneTreeNode):OutlineStorageStructOneTreeNode|null{
            if(node.cur_ebid==ebid){
                return node;
            }
            for(const key in node.child_nodes){
                const res=this.find_node_walk(ebid,node.child_nodes[key])
                if(res){
                    return res
                }
            }
            return null
        }
        find_node(ebid:string):OutlineStorageStructOneTreeNode|null{
            return this.find_node_walk(ebid,this.tree.root_node)
        }
        //返回插入的父节点
        join(ebid:string,ebars:any):null|OutlineStorageStructOneTreeNode{

            const [able,ebid1]=this.joinable(ebid,ebars)
            if(!able) {
                return null;
            }
            const insnode=this.find_node(ebid1)
            if(!insnode){
                console.log("OutlineStorageStructOneTreeHelper","join node err")
                return null
            }
            insnode.child_nodes.push(
                new OutlineStorageStructOneTreeNode(ebid)
            );
            this.tree.all_ebs[ebid]=1
            return insnode;
        }
    }

    // //存储结构不能有函数
    export class OutlineStorageStructOneTree {
        root_node: OutlineStorageStructOneTreeNode
        all_ebs: any = {}

        constructor(root_eb: string) {
            this.root_node = new OutlineStorageStructOneTreeNode(root_eb)
            this.all_ebs[root_eb] = 1
        }
    }
    export class OutlineStorageStructProxy extends StorageInterface.INoteContentDataChanger{
        create_tree_rooteb(ebid:string):null|OutlineStorageStructOneTreeHelper{
            let has=false;
            for(const i in this.outline.trees){
                if(this.outline.trees[i].root_node.cur_ebid==ebid){
                    has=true
                }
            }
            if(has){
                return null;
            }
            const newtree=new OutlineStorageStructOneTree(ebid)
            this.outline.trees.push(newtree)

            return OutlineStorageStructOneTreeHelper.create(newtree)
        }
        try_ins2tree(index:number,ebid:string,ebman:EditorBarTs.EditorBarManager):boolean{
            const tree=this.outline.trees[index]
            const treeproxy=OutlineStorageStructOneTreeHelper.create(tree)
            return treeproxy.join(ebid,ebman.get_ebid_2_data())!=null
        }
        //return tree indexs
        try_ins2trees(ebid:string,ebman:EditorBarTs.EditorBarManager):number[]{
            const indexs:number[]=[]
            this.outline.trees.forEach((v,i)=>{
                if(this.try_ins2tree(i,ebid,ebman)){
                    indexs.push(i)
                }
            })
            return indexs
        }
        try_remove_in_treei(i:number,ebid:string):boolean{
            const tree=this.outline.trees[i]
            console.log("try_remove_in_treei",tree,i)
            if(tree.root_node.cur_ebid==ebid){
                this.outline.trees=this.outline.trees.filter((v,i1)=>{
                    return i1!=i
                })
                delete tree.all_ebs[ebid]
                return true
            }
            const treeproxy=OutlineStorageStructOneTreeHelper.create(tree)
            const res=treeproxy.remove_node(ebid)
            if(res){
                delete tree.all_ebs[ebid]
            }
            return res
        }

        constructor(public outline:OutlineStorageStruct,public noteid:string) {
            super(noteid);

        }

    }
    //存储结构不能有函数
    export class OutlineStorageStruct {
        trees: OutlineStorageStructOneTree[] = []
        static proxy(outline:OutlineStorageStruct,noteid:string
            ):OutlineStorageStructProxy{
            return new OutlineStorageStructProxy(outline,noteid)
        }
        static fix_old(outline:OutlineStorageStruct){
            outline.trees.forEach((v,i)=>{
                OutlineStorageStructOneTreeHelper.create(v)
                    .recalc_all_eb()
            })
        }
        constructor() {
        }
    }
}