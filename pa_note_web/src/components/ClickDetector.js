class ClickDetector{
    click_cnt=0;
    click(callback) {
        if(this.click_cnt===0){
            let _this=this
            setTimeout(() => {
                callback(_this.click_cnt)
                _this.click_cnt=0;
            }, 300)
        }

        this.click_cnt++;
    }
}
export default {
    ClickDetector
}