<template>
  <div class="sidebar_switch">
    <div v-for="(key1,i) in bar_rank"
      :key="i"
         :class="key1===selected_i?'bar selected':'bar'"
         @click="select(key1)"
    >
      {{bars[key1].name}}
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {SideBarSwitchTs} from "@/components/SideBarSwitchTs";

@Options({
  props: {
    selected_i:String
  }
})

export default class SideBarSwitch extends Vue {
  $props!: {

    selected_i:string
  }

  bars=SideBarSwitchTs.switch_bars
  bar_rank=SideBarSwitchTs.bar_rank
  // selected_i=

  select(i:string){
    this.$emit("update:selected_i",i)
    // this.selected_i=i
    // this.$emit("new_sel",i)
  }

}
</script>

t<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sidebar_switch{
  width: 20px;
}
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
.sidebar_switch .bar:hover{

  background: gainsboro;
}
.sidebar_switch .bar.selected{
  background: gainsboro;
}
.sidebar_switch .bar{
  font-size: 13px;
  padding: 5px 3px;
  cursor: pointer;
}

</style>
