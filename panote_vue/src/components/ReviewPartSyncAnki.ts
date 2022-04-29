import {ReviewPartFunc} from "@/components/ReviewPartFunc";
import {Delete} from "@element-plus/icons-vue";
import {_PaUtilTs} from "@/3rd/pa_util_ts";
import {AppFuncTs} from "@/AppFunc";
import {Timer} from "@/timer/Timer";
import {_ipc} from "@/ipc";
import electron_net, {NetManager} from "@/electron_net";

export namespace _ReviewPartSyncAnki {
    export namespace _OneOperation {
        export enum OpeType {
            Add,
            Delete,
        }

        export class OpeCardSet {
            note_id: string
            card_set_id: string

            constructor(note_id: string, card_set_id: string) {
                this.note_id = note_id
                this.card_set_id = card_set_id
            }
        }

        export class OpeCard {
            note_id: string
            card_set_id: string
            card_id: string

            constructor(
                note_id: string,
                card_set_id: string,
                card_id: string
            ) {
                this.note_id = note_id
                this.card_set_id = card_set_id
                this.card_id = card_id
            }
        }

        export class OneOperation {
            ope_type: OpeType
            time: string
            ope_data: OpeCard | OpeCardSet

            constructor(ope_type: OpeType, time: string, ope_data: OpeCard | OpeCardSet) {
                this.ope_type = ope_type
                this.time = time
                this.ope_data = ope_data
            }

            static same_ope_data(ope1: OneOperation, ope: OneOperation): boolean {
                if ("card_id" in ope.ope_data && "card_id" in ope1.ope_data) {
                    return ope1.ope_data.card_set_id == ope.ope_data.card_set_id &&
                        ope1.ope_data.card_id == ope.ope_data.card_id
                }

                return ope1.ope_data.card_set_id == ope.ope_data.card_set_id
            }
        }
    }
    export namespace _StoreStruct {
        export class Class {
            operation_queue = new _PaUtilTs.DataStructure.ListSerializable.Class<_OneOperation.OneOperation>()
        }

        export namespace Funcs {
            export namespace LifeTime {
                //启动一个定时向anki同步数据的任务
                import ReviewPartManager = ReviewPartFunc.ReviewPartManager;
                export const mount = (ctx: AppFuncTs.Context, rpman: ReviewPartManager) => {
                    Timer._TimerState.regi_1s(ctx.timer, async () => {
                        let cnt = 100
                        const netman: NetManager | null = electron_net.get_net_manager()
                        if (rpman.note_id_valid()) {
                            while (netman && netman.connected && //tcp保持连接
                            rpman.sync_anki.operation_queue.count > 0 && cnt > 0) {
                                const elem = DataSet.pop_one_ope(rpman)
                                console.log("send edit", elem)
                                const res = await _ipc.Tasks.tasks.send_to_anki.call(JSON.stringify(elem))
                                cnt--
                            }
                        }
                    })
                }
                export const unmount = () => {
                }
            }
            export namespace DataSet {//操作队列后，要将队列序列化后存入buffer
                export const push_new_ope = (rpman: ReviewPartFunc.ReviewPartManager, ope: _OneOperation.OneOperation) => {
                    const syncanki = rpman.sync_anki
                    if (ope.ope_type == _OneOperation.OpeType.Delete) {
                        let head = syncanki.operation_queue.head
                        let del = false;
                        while (head) {
                            if (_OneOperation.OneOperation.same_ope_data(head.element, ope)) {
                                syncanki.operation_queue.remove_node(head)
                                del = true
                                break
                            }
                            head = head.next
                        }
                        if (!del) {
                            syncanki.operation_queue.push(ope)
                        }
                    } else {
                        syncanki.operation_queue.push(ope)
                    }
                    if (rpman.note_store_part && rpman.context) {
                        rpman.note_store_part.sync_anki_serialized = syncanki.operation_queue.to_string()
                        rpman.context.storage_manager.buffer_save_note_review_syncanki(rpman.note_id, rpman.note_store_part.sync_anki_serialized)
                        rpman.context.get_notelist_manager()?.pub_set_note_newedited_flag(rpman.note_id)
                    }
                }
                export const pop_one_ope = (rpman: ReviewPartFunc.ReviewPartManager): _OneOperation.OneOperation | undefined => {
                    const syncanki = rpman.sync_anki
                    if (rpman.context && rpman.note_store_part) {
                        const pop = rpman.sync_anki.operation_queue.pop()
                        if (pop) {
                            rpman.note_store_part.sync_anki_serialized = syncanki.operation_queue.to_string()
                            rpman.context.storage_manager.buffer_save_note_review_syncanki(rpman.note_id, rpman.note_store_part.sync_anki_serialized)
                            rpman.context.get_notelist_manager()?.pub_set_note_newedited_flag(rpman.note_id)
                        }
                        return pop
                    }
                    return undefined
                }

            }
        }
    }

}