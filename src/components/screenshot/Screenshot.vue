<template>
  <div class="screenshot" :style="css">
    <div
      class="screenshot-btn"
      @click="startScreenshot"
      :style="screenshotBtnStyles()"
    >
      <div class="screenshot-btn-circle"></div>
    </div>
    <screenshot-canvas></screenshot-canvas>
  </div>
</template>

<script>
import Canvas from './Canvas'
// import CanvasFreeDrawing  from 'canvas-free-drawing';

export default {
  name: "Screenshot",
  components: {
    ScreenshotCanvas: Canvas
  },
  props: {
    css: {
      type: Object,
      required: false
    }
  },
  data() {
    let screenshotBtnPos = JSON.parse(window.localStorage.getItem('screenshotBtnPos')) || {};
    return {
      touchIdentifier: null,
      screenshotBtnPos: {
        top: screenshotBtnPos.top || 200,
        right: screenshotBtnPos.right || 40
      }
    }
  },
  methods: {
    screenshotBtnStyles() {
      return {
        top: this.screenshotBtnPos.top + 'px',
        right: this.screenshotBtnPos.right + 'px'
      };
    },
    // 截图按钮拖动位置
    screenshotBtnMoveStart() {
      // event.buttons相关文档 https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/buttons
      if (event.type === 'mousedown' && event.buttons === 1) {
        const { pageX, pageY } = event;
        this.previousX = pageX
        this.previousY = pageY
      }
      if (event.type === 'touchstart' && event.changedTouches.length > 0) {
        const { pageX, pageY, identifier } = event.changedTouches[0];
        this.previousX = pageX;
        this.previousY = pageY;
        this.touchIdentifier = identifier;
      }
      event.preventDefault()
    },
    screenshotBtnMove() {
      if (event.type === 'mousemove' && event.buttons === 1) {
        const { pageX, pageY } = event;
        let moveX = pageX - this.previousX;
        let moveY = pageY - this.previousY;
        this.screenshotBtnPos.top = this.screenshotBtnPos.top + moveY;
        this.screenshotBtnPos.right = this.screenshotBtnPos.right - moveX;
        this.previousX = pageX
        this.previousY = pageY
      }
      if (event.type === 'touchmove' && event.changedTouches.length > 0) {
        const { pageX, pageY, identifier } = event.changedTouches[0];
        if (identifier != this.touchIdentifier) return;
        let moveX = pageX - this.previousX;
        let moveY = pageY - this.previousY;
        this.screenshotBtnPos.top = this.screenshotBtnPos.top + moveY;
        this.screenshotBtnPos.right = this.screenshotBtnPos.right - moveX;
        this.previousX = pageX;
        this.previousY = pageY;
      }
    },
    screenshotBtnMoveEnd() {
      if (event.type === 'mouseup') {
        if (this.screenshotBtnPos.right > 40) { this.screenshotBtnPos.right = 40; }
        if (this.screenshotBtnPos.top < 0) { this.screenshotBtnPos.top = 200; }
        if (this.screenshotBtnPos.right < 40 ) { this.screenshotBtnPos.right = 40; }
        if (this.screenshotBtnPos.top > window.screen.availHeight) { this.screenshotBtnPos.top = 200; }

        window.localStorage.setItem('screenshotBtnPos', JSON.stringify({top: this.screenshotBtnPos.top, right: this.screenshotBtnPos.right}))
      }

      if (event.type === 'touchend' && event.changedTouches.length > 0) {
        if (this.screenshotBtnPos.right > 40) { this.screenshotBtnPos.right = 40; }
        if (this.screenshotBtnPos.top < 0) { this.screenshotBtnPos.top = 200; }
        if (this.screenshotBtnPos.right < 40 ) { this.screenshotBtnPos.right = 40; }
        if (this.screenshotBtnPos.top > window.screen.availHeight) { this.screenshotBtnPos.top = 200; }

        window.localStorage.setItem('screenshotBtnPos', JSON.stringify({top: this.screenshotBtnPos.top, right: this.screenshotBtnPos.right}))
      }
    },
    startScreenshot() {}
  },
  mounted() {
    document.addEventListener('mousedown', this.screenshotBtnMoveStart);
    document.addEventListener('mousemove', this.screenshotBtnMove);
    document.addEventListener('mouseup', this.screenshotBtnMoveEnd);
    document.addEventListener('touchstart', this.screenshotBtnMoveStart);
    document.addEventListener('touchmove', this.screenshotBtnMove);
    document.addEventListener('touchend', this.screenshotBtnMoveEnd);
  },
  beforeDestroy() {
    document.removeEventListener('mousedown', this.screenshotBtnMoveStart);
    document.removeEventListener('mousemove', this.screenshotBtnMove);
    document.removeEventListener('mouseup', this.screenshotBtnMoveEnd);
    document.removeEventListener('touchstart', this.screenshotBtnMoveStart);
    document.removeEventListener('touchmove', this.screenshotBtnMove);
    document.removeEventListener('touchend', this.screenshotBtnMoveEnd);
  }
};
</script>

<style scoped>
.screenshot {
  z-index: 999;
}
.screenshot-btn {
  position: fixed;
  width: 48px;
  height: 48px;
  border-radius: 4px;
  background-color: #c9cdd29c;
  opacity: 0.5;
  cursor: pointer;
  /**transition: all 0.1s ease;*/
}
.screenshot-btn-circle {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #80808080;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0.5;
}
.screenshot-btn:hover,
.screenshot-btn-circle:hover,
screenshot-btn:active,
.screenshot-btn-circle:active {
  opacity: 1;
}
</style>
