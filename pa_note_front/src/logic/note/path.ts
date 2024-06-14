import { NoteLog } from "@/logic/log";
import { note } from "@/logic/note/note";
import { AppFuncTs } from "@/logic/app_func";
import { SetPathInfoReq, apis } from "../gen_api_content";

export namespace _path {
    export namespace LogTrans {

        export class PathProp {
            constructor(public type: PathType) {
            }
            clone() {
                return new PathProp(this.type)
            }
            static frompath(p: note.NoteHandlePathProxy): PathProp {
                return new PathProp(p.path.type)
            }
            setpath(p: note.NoteHandlePathProxy) {
                p.path.type = this.type
                console.log(p)
            }

        }
        export class PathPropChange implements NoteLog.SubTrans.ITrans {
            oldprop: null | PathProp = null
            constructor(public pathkey: string, public newprop: PathProp) {
            }

            get_pathkey_with_line() {
                let sp = this.pathkey.split(",")
                return sp[0] + "_" + sp[1]
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
                const pp = handle.pathman().getpathproxy(this.pathkey)
                console.log(pp)
                if (!this.oldprop) {
                    if (pp) {
                        this.oldprop = PathProp.frompath(pp)
                        this.newprop.setpath(pp)
                    }
                } else {
                    if (pp) {
                        this.newprop.setpath(pp)
                    }
                }
                apis.set_path_info(new SetPathInfoReq(
                    handle.note_id,
                    this.get_pathkey_with_line(),
                    this.newprop.type
                ))

                console.log(pp)
            }

            undo(handle: note.NoteHandle, log: NoteLog.NoteLogger, ctx: AppFuncTs.Context): void {
                const pp = handle.pathman().getpathproxy(this.pathkey)
                if (pp) {
                    this.oldprop?.setpath(pp)
                }
            }

        }
    }
    export enum PathType {
        solid,
        dashed,
        // dotted,
        end
    }
}