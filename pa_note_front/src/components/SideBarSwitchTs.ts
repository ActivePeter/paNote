export namespace SideBarSwitchTs{
    export class SwitchBarDisc{
        name
        constructor(name:string) {
            this.name=name
        }
    }
    // [
        // new SideBarSwitchTs.SwitchBarDisc("复习卡片"),
    export enum selections{
        "ReviewPart",
        "NoteOutline",
        "CompPropSetting"
    }
    export const bar_rank=[
        "ReviewPart",
        "NoteOutline",
        "CompPropSetting"
    ]
    export const switch_bars={
        NoteOutline:new SwitchBarDisc("笔记大纲"),
        ReviewPart:new SwitchBarDisc("复习卡片"),
        CompPropSetting:new SwitchBarDisc("组件属性")
    }
}