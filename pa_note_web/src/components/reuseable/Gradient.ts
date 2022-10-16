import {walk} from "@vue/compiler-sfc";

export namespace Gradient{
    const common_lerp = (ratio:number) => {
        if(ratio<0){
            return 0
        }
        if(ratio>1){
            return 1;
        }
        if(ratio<0.5){
            ratio*=2;
            return (ratio*ratio/2)
        }
       else if(ratio>=0.5){
            ratio*=2;
            ratio=2-ratio;
            return (1-ratio*ratio/2)
        }
       return 0
    }

    export class Common{
        curvars:number[]=[]
        target_vars:number[]=[]
        walking:boolean=false
        total_step:number=0
        cur_step:number=0
        timer:any=null
        cb:any
        start_walk(begin:number[],end:number[],step:number,cb:any){
            if(begin.length!==end.length){
                return;
            }
            if(this.timer){
                window.clearInterval(this.timer)
            }
            this.target_vars=end;
            this.curvars=begin;
            this.cb=cb;
            this.total_step=step;
            this.cur_step=0;
            const _this=this;
            this.timer=window.setInterval(()=>{
                _this.walk();
            }, 10);
        }
        walk(){
            const lerp_res=[]
            for(let i=0;i<this.target_vars.length;i++){
                const lerp=common_lerp(this.cur_step/this.total_step);
                lerp_res.push(this.curvars[i]+(this.target_vars[i]-this.curvars[i])*lerp);
            }
            this.cb(lerp_res)
            this.cur_step++;
            if(this.cur_step>this.total_step){
                window.clearInterval(this.timer)
                this.timer=null;
            }
        }
    }
}