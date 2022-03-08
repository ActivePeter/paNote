let DataType={
    Obj:1,
        Array:2,
        Number:3,
        String:4,
}
export default {
    remove_one_in_arr(arr,target){
        let found=-1;
        for (let i in arr) {
            if(arr[i]==target){
                found=i;
                break;
            }
        }
        if(found>-1){
            arr.splice(found,1);
        }
    },
    DataType,
    get_type_of(obj){
        if(typeof obj==='string'){
            return DataType.String
        }else if(typeof obj==='number'){
            return DataType.Number
        }else if(Object.prototype.toString.call(obj)==='[object Array]'){
            return DataType.Array
        }else if(Object.prototype.toString.call(obj)==='[object Object]'){
            return DataType.Obj
        }
        return null;
    }
}