<template>
  <div class="right_part">
    <SideBarSwitch v-model:selected_i="selected"></SideBarSwitch>
    <slot v-if="selected==='ReviewPart'"></slot>
    <NoteOutline v-if="selected==='NoteOutline'"
      ref="note_outline"
    ></NoteOutline>
    <div v-if="selected===selections.CompPropSetting"></div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import SideBarSwitch from "@/components/SideBarSwitch.vue";
import NoteOutline from "@/components/NoteOutline.vue";
import {AppFuncTs} from "@/AppFunc";
import {SideBarSwitchTs} from "@/components/SideBarSwitchTs";

// import {SideBarSwitchTs} from "@/components/SideBarSwitchTs";


@Options({
  components: {NoteOutline, SideBarSwitch},
  props: {
  }
})
export default class RightPart extends Vue {
  $props!: {
  }
  $refs!:{
    note_outline:NoteOutline
  }
  selections=SideBarSwitchTs.selections
  selected="ReviewPart"
  ctx:AppFuncTs.Context=new AppFuncTs.Context(null)
  created(){
    this.ctx=(this.$parent?.$parent?.$parent as any).context as AppFuncTs.Context
    console.log("rightpart ",this.ctx)
  }
  // cursel=
  // new_sel(selection:SideBarSwitchTs.SwitchBarDisc){
  //
  // }
}
</script>

t<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.right_part{
  width: 100%;
  display: flex;
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
</style>
