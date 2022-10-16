import {ICommu, WebCommu} from "@/logic/commu/icommu";
import {AppFuncTs} from "@/logic/AppFunc";

[api_classes]

export class ApiCaller{
    private _icommu:ICommu|undefined
    private get_icommu():ICommu{
        return this._icommu as ICommu
    }
    init_web(on_commu_established:()=>void){
        this._icommu=new WebCommu(on_commu_established)
    }

    [target]
}