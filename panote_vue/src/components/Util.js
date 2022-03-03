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
    }
}