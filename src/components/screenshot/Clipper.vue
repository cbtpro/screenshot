<template>
    <div>
      <div ref="clipperMask" class="clipper-mask"></div>
      <div :style="clipperDragableStyle()" class="dragable-resizable"></div>
      <div ref="operatorBtns" :style="operatorBtnsStyles()" class="operatorBtns">
        <button @click="cancel()">取消</button>
        <button @click="clipper()">分享</button>
      </div>
    </div>
  </template>
  
  <script>

  export default {
    components: {
    },
    props: {},
    data() {
      return {
        clipperPosition: {
          x: 0,
          y: 0,
          x1: 0,
          y1: 0,
          width: 0,
          height: 0
        },
        isClipperDrag: false
      }
    },
    mounted() {
      this.initClipper()
    },
    methods: {
      operatorBtnsStyles() {
        let operatorBtns = this.$refs.operatorBtns
        let operatorBtnsOffsetWidth = operatorBtns ? operatorBtns.offsetWidth : 0
        let operatorBtnsOffsetHeight = operatorBtns
          ? operatorBtns.offsetHeight
          : 0
        let operatorBtnsTop = this.clipperPosition.y + this.clipperPosition.height
        let operatorBtnsLeft = this.clipperPosition.x + this.clipperPosition.width
        let left = operatorBtnsLeft - operatorBtnsOffsetWidth
        left = left < 0 ? 0 : left
        let top =
          operatorBtnsTop + operatorBtnsOffsetHeight > document.body.clientHeight
            ? operatorBtnsTop - operatorBtnsOffsetHeight
            : operatorBtnsTop
        let display = '',
          pointerEvents
        if (
          this.clipperPosition.width === 0 ||
          this.clipperPosition.height === 0
        ) {
          display = 'none'
        }
        if (this.isClipperDrag) {
          pointerEvents = 'all'
        }
        return {
          top: top + 'px',
          left: left + 'px',
          display,
          pointerEvents
        }
      },
      clipperDragableStyle() {
        return {
          left: this.clipperPosition.x + 'px',
          top: this.clipperPosition.y + 'px',
          width: this.clipperPosition.width + 'px',
          height: this.clipperPosition.height + 'px'
        }
      },
      clipperMousedown() {
        this.isClipperDrag = true
        // event.buttons相关文档 https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/buttons
        this.clipperPosition.width = 0
        this.clipperPosition.height = 0
        if (event.type === 'mousedown' && event.buttons === 1) {
          const { pageX, pageY } = event
          this.clipperPosition.x = pageX
          this.clipperPosition.x1 = pageX
          this.clipperPosition.y = pageY
          this.clipperPosition.y1 = pageY
        }
        if (event.type === 'touchstart' && event.changedTouches.length > 0) {
          const { pageX, pageY, identifier } = event.changedTouches[0]
          this.clipperPosition.x = pageX
          this.clipperPosition.x1 = pageX
          this.clipperPosition.y = pageY
          this.clipperPosition.y1 = pageY
          this.touchIdentifier = identifier
        }
        event.stopPropagation()
      },
      clipperMousemove() {
        if (event.type === 'mousemove' && event.buttons === 1) {
          const { pageX, pageY } = event
          let mouseMoveDistanceX = pageX - this.clipperPosition.x
          let mouseMoveDistanceY = pageY - this.clipperPosition.y
          if (mouseMoveDistanceX < 0) {
            this.clipperPosition.x = pageX
            this.clipperPosition.width =
              this.clipperPosition.x1 - this.clipperPosition.x
          } else {
            this.clipperPosition.width = mouseMoveDistanceX
          }
          if (mouseMoveDistanceY < 0) {
            this.clipperPosition.y = pageY
            this.clipperPosition.height =
              this.clipperPosition.y1 - this.clipperPosition.y
          } else {
            this.clipperPosition.height = mouseMoveDistanceY
          }
        } else if (
          event.type === 'touchmove' &&
          event.changedTouches.length > 0
        ) {
          const { pageX, pageY, identifier } = event.changedTouches[0]
          if (identifier !== this.touchIdentifier) return
          let mouseMoveDistanceX = pageX - this.clipperPosition.x
          let mouseMoveDistanceY = pageY - this.clipperPosition.y
          if (mouseMoveDistanceX < 0) {
            this.clipperPosition.x = pageX
            this.clipperPosition.width =
              this.clipperPosition.x1 - this.clipperPosition.x
          } else {
            this.clipperPosition.width = mouseMoveDistanceX
          }
          if (mouseMoveDistanceY < 0) {
            this.clipperPosition.y = pageY
            this.clipperPosition.height =
              this.clipperPosition.y1 - this.clipperPosition.y
          } else {
            this.clipperPosition.height = mouseMoveDistanceY
          }
        }
        event.stopPropagation()
      },
      clipperMouseup() {
        this.isClipperDrag = false
        // this.destoryClipperEvent()
        event.stopPropagation()
      },
      initClipper() {
        let clipperMaskEl = this.$refs.clipperMask
        clipperMaskEl.addEventListener('mousedown', this.clipperMousedown)
        clipperMaskEl.addEventListener('mousemove', this.clipperMousemove)
        clipperMaskEl.addEventListener('mouseup', this.clipperMouseup)
        clipperMaskEl.addEventListener('touchstart', this.clipperMousedown)
        clipperMaskEl.addEventListener('touchmove', this.clipperMousemove)
        clipperMaskEl.addEventListener('touchend', this.clipperMouseup)
      },
      destoryClipperEvent() {
        let clipperMaskEl = this.$refs.clipperMask
        clipperMaskEl.removeEventListener('mousedown', this.clipperMousedown)
        clipperMaskEl.removeEventListener('mousemove', this.clipperMousemove)
        clipperMaskEl.removeEventListener('mouseup', this.clipperMouseup)
        clipperMaskEl.removeEventListener('touchstart', this.clipperMousedown)
        clipperMaskEl.removeEventListener('touchmove', this.clipperMousemove)
        clipperMaskEl.removeEventListener('touchend', this.clipperMouseup)
      },
      resetClipperPosition() {
        this.clipperPosition.x = 0
        this.clipperPosition.x1 = 0
        this.clipperPosition.y = 0
        this.clipperPosition.y1 = 0
        this.clipperPosition.width = 0
        this.clipperPosition.height = 0
      },
      cancel() {
        this.resetClipperPosition()
        event.stopPropagation()
      },
      clipper() {
        this.$emit('do-screenshot', this.clipperPosition)
        event.stopPropagation()
      }
    }
  }
  </script>
  
  <style lang="less">
  .clipper-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .dragable-resizable {
    pointer-events: none;
    position: absolute;
    border: 2px dashed gray;
    box-sizing: border-box;
    background-clip: padding-box;
  }
  .operatorBtns {
    position: absolute;
    .hae-button {
      button {
        margin: 18px 0 0 8px;
      }
    }
  }
  </style>