<template>
  <div class="tools-box">
    <!-- <div v-show="currentOperatorType" :style="{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0,zIndex: zIndex }" class="screenshotLayout"></div> -->
    <!-- 截图动态面板入口 -->
    <div ref="circleBtn" :class="circleBtnCls()" :style="circleBtnStyles()" class="circle-btn" @click="circleBtnSwitchHandler">
      <!-- 截图工具 -->
      <div v-show="showOperatorTools" class="tools">
        <div :class="toolsCommentsBtnCls()" title="批注" class="comments" @click="switchOperatorType(operatorType.BRUSH)">
          <i class="fa fa-pencil" aria-hidden="true"></i>
        </div>
        <div :class="toolsEraserBtnCls()" class="rubber-wipe" @click="switchOperatorType(operatorType.ERASER)">
          <i class="fa fa-eraser fa-6" aria-hidden="true"></i>
        </div>
        <div :class="toolsClipBtnCls()" class="screenshots" @click="switchOperatorType(operatorType.CLIP)">
          <i class="fa fa-scissors" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <!-- <font-awesome-icon icon="coffee" /> -->
    <dir ref="canvasPad" :is="canvasComponent" :brush-type="currentOperatorType" :background="background" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"></dir>
    <div :is="clipperComponent" :style="clipperComponentStyles()" @do-screenshot="afterScreenshot"></div>
    <drawing-tool></drawing-tool>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import Canvas from './Canvas'
import Clipper from './Clipper'
import DrawingTool from './DrawingTool'

export default {
  components: {
    CanvasPad: Canvas,
    Clipper,
    DrawingTool
  },
  props: {
    zIndex: {
      type: Number,
      required: false,
      default: 2399 // 因为aurora弹窗提示的z-index是2400
    }
  },
  data() {
    let circleBtnPos =
      JSON.parse(window.localStorage.getItem('circleBtnPos')) || {}
    return {
      showOperatorTools: false,
      currentOperatorType: null,
      operatorType: {
        BRUSH: 'brush',
        ERASER: 'eraser',
        CLIP: 'clip'
      },
      circleBtnPos: {
        top: circleBtnPos.top || 200,
        right: circleBtnPos.right || 40
      },
      canvasComponent: null,
      clipperComponent: null,
      clipperZIndex: this.zIndex - 1,
      sendMailComponent: null,
      background: null,
      screenshotBase64Img: null,
      sendMailZIndex: this.zIndex - 1
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    this.destoryScreenshot()
  },
  methods: {
    init() {
      this.renderScreenshot()
    },
    renderScreenshot() {
      let circleBtn = this.$refs.circleBtn
      circleBtn.addEventListener('mousedown', this.screenshotBtnMoveStart)
      circleBtn.addEventListener('mousemove', this.screenshotBtnMove)
      circleBtn.addEventListener('mouseup', this.screenshotBtnMoveEnd)
      circleBtn.addEventListener('touchstart', this.screenshotBtnMoveStart)
      circleBtn.addEventListener('touchmove', this.screenshotBtnMove)
      circleBtn.addEventListener('touchend', this.screenshotBtnMoveEnd)
    },
    /**
     * @description 销毁截图批注和插件、发送邮件的组件，并启用卡片容器部分的交互事件
     */
    destoryScreenshot() {
      this.currentOperatorType = null
      this.canvasComponent = null
      this.clipperComponent = null
      this.sendMailComponent = null
      // this.switchScreenPointerEvent(true)
    },
    /**
     * 截图批注组件销毁前的事件
     */
    beforeDestroy() {
      let circleBtn = this.$refs.circleBtn
      circleBtn.removeEventListener('mousedown', this.screenshotBtnMoveStart)
      circleBtn.removeEventListener('mousemove', this.screenshotBtnMove)
      circleBtn.removeEventListener('mouseup', this.screenshotBtnMoveEnd)
      circleBtn.removeEventListener('touchstart', this.screenshotBtnMoveStart)
      circleBtn.removeEventListener('touchmove', this.screenshotBtnMove)
      circleBtn.removeEventListener('touchend', this.screenshotBtnMoveEnd)
    },
    circleBtnSwitchHandler() {
      this.showOperatorTools = !this.showOperatorTools
      if (!this.showOperatorTools) {
        this.destoryScreenshot()
      }
    },
    circleBtnCls: function() {
      return [{ 'circle-btn-active': this.showOperatorTools }]
    },
    circleBtnStyles() {
      return {
        top: this.circleBtnPos.top + 'px',
        right: this.circleBtnPos.right + 'px',
        zIndex: this.zIndex
      }
    },
    toolsCommentsBtnCls: function() {
      return [
        {
          'tools-active': this.currentOperatorType === this.operatorType.BRUSH
        }
      ]
    },
    toolsEraserBtnCls: function() {
      return [
        {
          'tools-active': this.currentOperatorType === this.operatorType.ERASER
        }
      ]
    },
    toolsClipBtnCls: function() {
      return [
        {
          'tools-active': this.currentOperatorType === this.operatorType.CLIP
        }
      ]
    },
    /**
     * @description 截屏按钮拖动事件，用于mousestart/touchstart/pointerdown
     */
    screenshotBtnMoveStart() {
      // event.buttons相关文档 https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/buttons
      if (event.type === 'mousedown' && event.buttons === 1) {
        const { pageX, pageY } = event
        this.previousX = pageX
        this.previousY = pageY
      }
      if (event.type === 'touchstart' && event.changedTouches.length > 0) {
        const { pageX, pageY, identifier } = event.changedTouches[0]
        this.previousX = pageX
        this.previousY = pageY
        this.touchIdentifier = identifier
      }
      event.stopPropagation()
    },
    /**
     * @description 截屏按钮拖动事件，用于mousemove/touchmove/pointermove
     */
    screenshotBtnMove() {
      if (event.type === 'mousemove' && event.buttons === 1) {
        const { pageX, pageY } = event
        let moveX = pageX - this.previousX
        let moveY = pageY - this.previousY
        this.circleBtnPos.top = this.circleBtnPos.top + moveY
        this.circleBtnPos.right = this.circleBtnPos.right - moveX
        this.previousX = pageX
        this.previousY = pageY
      }
      if (event.type === 'touchmove' && event.changedTouches.length > 0) {
        const { pageX, pageY, identifier } = event.changedTouches[0]
        if (identifier !== this.touchIdentifier) return
        let moveX = pageX - this.previousX
        let moveY = pageY - this.previousY
        this.circleBtnPos.top = this.circleBtnPos.top + moveY
        this.circleBtnPos.right = this.circleBtnPos.right - moveX
        this.previousX = pageX
        this.previousY = pageY
      }
      event.stopPropagation()
    },
    /**
     * @description 截屏按钮拖动事件，用于mouseup/touchend/pointerup
     */
    screenshotBtnMoveEnd() {
      if (event.type === 'mouseup') {
        if (this.circleBtnPos.right > 40) {
          this.circleBtnPos.right = 40
        }
        if (this.circleBtnPos.top < 0) {
          this.circleBtnPos.top = 200
        }
        if (this.circleBtnPos.right < 40) {
          this.circleBtnPos.right = 40
        }
        if (this.circleBtnPos.top > window.screen.availHeight) {
          this.circleBtnPos.top = 200
        }
        window.localStorage.setItem(
          'circleBtnPos',
          JSON.stringify({
            top: this.circleBtnPos.top,
            right: this.circleBtnPos.right
          })
        )
      }
      if (event.type === 'touchend' && event.changedTouches.length > 0) {
        if (this.circleBtnPos.right > 40) {
          this.circleBtnPos.right = 40
        }
        if (this.circleBtnPos.top < 0) {
          this.circleBtnPos.top = 200
        }
        if (this.circleBtnPos.right < 40) {
          this.circleBtnPos.right = 40
        }
        if (this.circleBtnPos.top > window.screen.availHeight) {
          this.circleBtnPos.top = 200
        }
        window.localStorage.setItem(
          'circleBtnPos',
          JSON.stringify({
            top: this.circleBtnPos.top,
            right: this.circleBtnPos.right
          })
        )
      }
      event.stopPropagation()
    },
    switchOperatorType(operatorType) {
      if (!operatorType) {
        this.destoryScreenshot()
        return
      }
      // this.switchScreenPointerEvent(false)
      this.currentOperatorType = operatorType
      if (this.currentOperatorType === this.operatorType.BRUSH) {
        this.doBrush()
      }
      if (this.currentOperatorType === this.operatorType.ERASER) {
        this.doBrush()
      }
      if (this.currentOperatorType === this.operatorType.CLIP) {
        this.doClip()
      } else {
        if (this.clipperComponent) this.clipperComponent = null
      }
      event.stopPropagation()
    },
    switchScreenPointerEvent(bool) {
      let screenOperaterArea = document.querySelector('.screen-preview')
      if (bool === undefined || bool === null) {
        screenOperaterArea.style.pointerEvents =
          screenOperaterArea.style.pointerEvents === 'none' ? '' : 'none'
      } else {
        screenOperaterArea.style.pointerEvents = bool ? '' : 'none'
      }
    },
    doBrush() {
      if (this.canvasComponent === null) {
        let { availWidth: width, availHeight: height } = window.screen
        let html2canvasOptions = { x: 0, y: 0, width, height }
        let html2canvasEl = document.querySelector('body')
        this.doScreenshot(html2canvasEl, html2canvasOptions, canvas => {
          this.background = canvas
          this.canvasComponent = 'canvas-pad'
        })
      } else {
        let canvasPad = this.$refs.canvasPad
        if (this.currentOperatorType === this.operatorType.ERASER) {
          // canvasPad.setEraserSize(20)
          // canvasPad.setStrokeStyle('rgba(255,255,0,255)')
          canvasPad.setBrushType(this.operatorType.ERASER)
        } else {
          canvasPad.setBrushType(this.operatorType.BRUSH)
          // canvasPad.setLineWidth(5)
          // canvasPad.setStrokeStyle('rgba(255, 0, 0, 255)')
        }
      }
    },
    doClip() {
      this.clipperComponent = 'clipper'
      // this.initClipper()
    },
    clipperComponentStyles() {
      return {
        zIndex: this.clipperZIndex,
        top: 0,
        left: 0,
        position: 'absolute',
        width: '100%',
        height: '100%'
      }
    },
    afterScreenshot(clipperPosition) {
      let { x, y, width, height } = clipperPosition
      let html2canvasOptions = { x, y, width, height }
      let html2canvasEl = document.querySelector('body')
      this.doScreenshot(html2canvasEl, html2canvasOptions, canvas => {
        this.screenshotBase64Img = canvas.toDataURL()
        alert(this.screenshotBase64Img)
      })
    },
    doScreenshot(html2canvasEl, html2canvasOptions, screenShotCallback) {
      html2canvas(html2canvasEl, html2canvasOptions).then(screenShotCallback)
    }
  }
}
</script>

<style lang="less" scope>
.circle-btn {
  position: absolute;
  width: 32px;
  height: 32px;
  display: block;
  top: 100px;
  right: 20px;
  background: #516c96;
  border-radius: 4px;
  opacity: 0.4;
  transition: all 0.5s ease;
  cursor: pointer;
  &:before {
    content: '';
    width: 48px;
    height: 48px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: block;
    border-radius: 100%;
    background: #6585b6;
  }
  &:after {
    content: '';
    width: 34px;
    height: 34px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: block;
    border-radius: 100%;
    background: #7c9dd1;
    box-shadow: 0 0 10px 0 #19437d, inset 0 0 4px 0 rgba(255, 255, 255, 0.84);
  }
  &:hover {
    opacity: 0.8;
  }
}
.circle-btn.circle-btn-active {
  opacity: 0.8;
}
.tools-box {
  .tools {
    position: absolute;
    top: 80px;
    z-index: 999999999;
    border: none;
    padding: 0;
    .comments,
    .rubber-wipe,
    .screenshots {
      width: 64px;
      height: 64px;
      background: #516c96;
      border-radius: 4px;
      font-size: 30px;
      color: #fff;
      margin: 0 0 8px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      cursor: pointer;
      &:hover {
        background: #2566d2;
      }
    }
    .tools-active {
      background: #2566d2;
    }
  }
}
</style>