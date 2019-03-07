<template>
  <div class="drawing-tools">
    <!-- <a href="javascript:void(0)">
      <i class="fa fa-pencil" aria-hidden="true"></i>
    </a>
    <a href="javascript:void(0)">
      <i class="fa fa-paint-brush" aria-hidden="true"></i>
    </a>
    <a href="javascript:void(0)">
      <i class="fa fa-eraser" aria-hidden="true"></i>
    </a>
    <a href="javascript:void(0)">
      <i class="fa fa-font" aria-hidden="true"></i>
    </a>
    <a href="javascript:void(0)">
      <i class="fa fa-undo" aria-hidden="true"></i>
    </a>
    <a href="javascript:void(0)">
      <i class="fa fa-clipboard" aria-hidden="true"></i>
    </a>
    <a href="javascript:void(0)">
      <i class="fa fa-floppy-o" aria-hidden="true"></i>
    </a>
    <a href="javascript:void(0)">
      <i class="fa fa-cut" aria-hidden="true"></i>
    </a>
    <a href="javascript:void(0)">
      <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
    </a>
    <a href="javascript:void(0)">
      <i class="fa fa-refresh" aria-hidden="true"></i>
    </a>-->
    <a v-for="tool in tools" :key="tool.name" href="javascript:void(0)" @click="tool.handle">
      <i :class="tool.className" aria-hidden="true"></i>
    </a>
  </div>
</template>

<script>
import "@/assets/font-awesome/css/font-awesome.min.css";

export default {
  data() {
    return {
      tools: [
        {
          name: "pencil",
          className: "fa fa-pencil",
          handle: () => {
            console.log(arguments);
          }
        },
        {
          name: "brush",
          className: "fa fa-paint-brush",
          handle: () => {}
        },
        {
          name: "eraser",
          className: "fa fa-eraser",
          handle: () => {}
        },
        {
          name: "font",
          className: "fa fa-font",
          handle: () => {}
        },
        {
          className: "fa fa-undo",
          handle: () => {}
        },
        {
          className: "fa fa-repeat",
          handle: () => {}
        },
        {
          name: "clipboard",
          className: "fa fa-clipboard",
          handle: () => {}
        },
        {
          name: "floppy",
          className: "fa fa-floppy-o",
          handle: () => {}
        },
        {
          name: "spinner",
          className: "fa fa-spinner fa-spin",
          handle: () => {}
        },
        {
          name: "refresh",
          className: "fa fa-refresh",
          handle: () => {}
        }
      ]
    };
  }
};
</script>


<style lang="less" scoped>
div.drawing-tools i.fa {
  margin: 10px 4px 0px 4px;
  color: red;
  cursor: pointer;
}

div.drawing-tools a:hover {
  i.fa {
    color: black;
  }
}
</style>
