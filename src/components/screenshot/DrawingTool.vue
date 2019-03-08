<template>
  <div class="drawing-tools">
    <a v-for="(tool, $index) in tools" :key="$index" href="javascript:void(0)">
      <i :class="tool.className" aria-hidden="true" @click="tool.handle"></i>
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
            this.autoToggleClass(event);
          }
        },
        {
          name: "brush",
          className: "fa fa-paint-brush",
          handle: () => {
            this.autoToggleClass(event);
          }
        },
        {
          name: "eraser",
          className: "fa fa-eraser",
          handle: () => {
            this.autoToggleClass(event);
          }
        },
        {
          name: "font",
          className: "fa fa-font",
          handle: () => {
            this.autoToggleClass(event);
          }
        },
        {
          className: "fa fa-undo",
          handle: () => {
            this.autoToggleClass(event);
          }
        },
        {
          className: "fa fa-repeat",
          handle: () => {
            this.autoToggleClass(event);
          }
        },
        {
          name: "clipboard",
          className: "fa fa-clipboard",
          handle: () => {
            this.autoToggleClass(event);
          }
        },
        {
          name: "floppy",
          className: "fa fa-floppy-o",
          handle: () => {
            this.autoToggleClass(event);
          }
        },
        {
          name: "spinner",
          className: "fa fa-spinner",
          handle: () => {
            this.autoToggleClass(event);
          }
        },
        {
          name: "refresh",
          className: "fa fa-refresh",
          handle: () => {
            this.autoToggleClass(event);
          }
        }
      ]
    };
  },
  methods: {
    autoToggleClass(event) {
      let target = event.target;
      if (target.dataset["isActive"] === 'true') {
        return
      }
      target.dataset["isActive"] = true;
      let className = target.className;
      target.className = "fa fa-spinner fa-spin";
      setTimeout(() => {
        target.dataset["isActive"] = false;
        target.className = className;
      }, 2000);
    }
  }
};
</script>


<style lang="less" scoped>
* {
  font-size: 16px;
}
div.drawing-tools {
  position: relative;
}
div.drawing-tools i.fa {
  font-size: 1.5rem;
  margin: 10px 8px 0px 4px;
  color: red;
  cursor: pointer;
  position: relative;
}

div.drawing-tools a:hover {
  i.fa {
    color: black;
  }
}
</style>
