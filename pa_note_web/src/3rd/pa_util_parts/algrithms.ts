import {_PaUtilTs} from "@/3rd/pa_util_ts";


export namespace _algrithms{
    // namespace Algrithms{
        import Pos2D = _PaUtilTs.Pos2D;
    import Rect = _PaUtilTs.Rect;
    export const distance_2p=(p:Pos2D, p1:Pos2D):number=>{
            const dx=p.x-p1.x
            const dy=p.y-p1.y
            return Math.sqrt(dx*dx+dy*dy)
        }
        export const aabb_test=(r1:Rect,r2:Rect):boolean=>{
            const mx1=r1.x+r1.w/2
            const mx2=r2.x+r2.w/2
            const my1=r1.y+r1.h/2
            const my2=r2.y+r2.h/2
            return Math.abs(mx1-mx2)<(r1.w/2+r2.w/2)&&
                Math.abs(my1-my2)<(r1.h/2+r2.h/2)
        }
        export const rectfitin=(small:Rect,big:Rect)=>{
            const r1=small
            const r2=big

            const mx1=r1.x+r1.w/2
            const mx2=r2.x+r2.w/2
            const my1=r1.y+r1.h/2
            const my2=r2.y+r2.h/2
            if(mx1>mx2){
                if(r1.right()>r2.right()){
                    r1.x-=r1.right()-r2.right()
                }
            }else if(r1.x<r2.x){
                r1.x=r2.x
            }
            if(my1>my2){
                if(r1.bottom()>r2.bottom()){
                    r1.y-=r1.bottom()-r2.bottom()
                }
            }else if(r1.y<r2.y){
                r1.y=r2.y
            }
        }
    // }
}