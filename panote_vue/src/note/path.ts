import {NoteLog} from "@/log";
import {note} from "@/note";
import {AppFuncTs} from "@/AppFunc";

export namespace _path{
    export namespace LogTrans{

        export class PathProp{
            constructor(public type:PathType) {
            }
            clone(){
                return new PathProp(this.type)
            }
            static frompath(p:note.NoteHandlePathProxy):PathProp{
                return new PathProp(p.path.type)
            }
            setpath(p:note.NoteHandlePathProxy){
                p.path.type=this.type
                console.log(p)
            }

        }
        export class PathPropChange implements NoteLog.SubTrans.ITrans{
            oldprop:null|PathProp=null
            constructor(public pathkey:string,public newprop:PathProp) {
            }
            doable(handle: note.NoteHandle, log: NoteLog.NoteLogger, ctx: AppFuncTs.Context): boolean {
                // const pp=handle.pathman().getpathproxy(this.pathkey)
                // if(pp){
                //
                // }else{
                //     return false
                // }
                return true;
            }

            redo(handle: note.NoteHandle, log: NoteLog.NoteLogger, ctx: AppFuncTs.Context): void {
                const pp=handle.pathman().getpathproxy(this.pathkey)
                console.log(pp)
                if(!this.oldprop){
                    if(pp){
                        this.oldprop=PathProp.frompath(pp)
                        this.newprop.setpath(pp)
                    }
                }else{
                    if(pp){
                        this.newprop.setpath(pp)
                    }
                }
                console.log(pp)
            }

            undo(handle: note.NoteHandle, log: NoteLog.NoteLogger, ctx: AppFuncTs.Context): void {
                const pp=handle.pathman().getpathproxy(this.pathkey)
                if(pp){
                    this.oldprop?.setpath(pp)
                }
            }

        }
    }
    export enum PathType{
        solid,
        dashed,
        // dotted,
        end
    }
}