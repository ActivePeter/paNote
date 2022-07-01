<template>
<!--  <div>{{value}}</div>-->
  <input @click="click" ref="input_ref" class="input" type=text v-model="value_"
         @blur="blur"
  >
<!--  <div v-else  @click="click">{{value}}</div>-->
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Watch} from "vue-property-decorator";


@Options({
  props: {
    value:String,
  }

})
export default class FlatInput extends Vue {
  $props!: {
    value:string
  }
  $refs!:{
    input_ref:HTMLInputElement
  }
  value_:string=""
  editing=false
  @Watch('value')
  w_value(v:string){
    if(this.value_!==v){
      this.value_=v
    }
  }
  @Watch('value_')
  w_value_(v:string){
    if(this.$props.value!=v){
      this.$emit("update:value",v)
    }
    // console.log("value_",v)
  }
  mounted(){
    this.value_=this.$props.value
  }
  click(){
    // console.log("FlatInput click")
    this.$refs.input_ref.focus()
  }
  focus(){

  }
  blur(){

  }
}
</script>

t<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*.cmd_name {*/
/*  display: inline-block;*/
/*  !*height: 32px;*!*/
/*  !*vertical-align: middle;*!*/
/*  position: absolute;*/
/*  top: 50%;*/
/*  transform: translateY(-50%);*/
/*}*/

/*.card {*/
/*  !*position: relative;*!*/
/*  vertical-align: middle;*/
/*}*/

/*.btns {*/
/*  float: right;*/
/*}*/
.input {

  border-style: none;
  border-width: 0;
  outline: 0;
  background: rgba(0, 0, 0, 0);
  font-size: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
