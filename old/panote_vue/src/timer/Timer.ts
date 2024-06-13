export namespace Timer{
    export class TimerState{
        int_1s:any
        tasks_1s:any[]=[]
    }
    export namespace _TimerState{
        export namespace LifeTime{
            export const mount=(t:TimerState)=>{
                t.int_1s=setInterval(()=>{
                    for(const key in t.tasks_1s){
                        t.tasks_1s[key]()
                    }
                },1000)
            }
            export const unmount=(t:TimerState)=>{
                clearInterval(t.int_1s)
            }
        }
        export const regi_1s=(t:TimerState,cb:()=>void)=>{
            t.tasks_1s.push(cb)
        }
    }
}