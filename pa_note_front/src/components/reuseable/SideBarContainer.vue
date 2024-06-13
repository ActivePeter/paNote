<template>
  <div class="sidebar_container">
    <div v-if="on_left" class="sidebar"
         :style="{width:(width+'px')}"
    >
      <slot name="sidebar"></slot>
    </div>
    <div class="content" :style="{width:('calc(100% - '+width+'px)')}">
      <slot name="content"></slot>
    </div>
    <div v-if="!on_left" class="sidebar"
         :style="{width:(width+'px')}"
    >
      <slot name="sidebar"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideBarContainer",
  mounted() {},
  data() {
    return {};
  },
  methods: {},
  props: {
    on_left:Boolean,
    width:Number
  },
};
</script>

<style scoped>
.sidebar_container{
  display: flex;
}
.content{
  flex: 1;
}
</style>