<template>
  <div :style="[{'z-index': zIndex}, css]" class="screenshot-tools-box">
    <div class="tools-manipulation">
      <div :class="['manipulation-btn', { 'active': currentOperatorType }]" @click="start"></div>
      <div
        :style="{display: currentOperatorType ? 'block' : null, zIndex: zIndex}"
        :class="['manipulation-list']"
      >
        <ul>
          <li class="manipulation-basis">
            <div
              :class="['manipulation-brush', 'basis-item', {'basis-item-active': currentOperatorType === operatorType.BRUSH}]"
              title="画笔"
              @click="switchOperator(operatorType.BRUSH)"
            >
              <font-awesome-icon icon="pen"/>
            </div>
            <div
              :class="['manipulation-rubber-wipe', 'basis-item', {'basis-item-active': currentOperatorType === operatorType.PALETTE}]"
              title="颜色"
              @click="switchOperator(operatorType.PALETTE)"
            >
              <font-awesome-icon icon="palette"/>
            </div>
            <div
              :class="['manipulation-mosaic', 'basis-item', {'basis-item-active': currentOperatorType === operatorType.ERASER}]"
              title="橡皮擦"
              @click="switchOperator(operatorType.ERASER)"
            >
              <font-awesome-icon icon="eraser"/>
            </div>
            <div
              :class="['manipulation-redo', 'basis-item', {'basis-item-active': currentOperatorType === operatorType.MOSAIC}]"
              title="马赛克"
              @click="switchOperator(operatorType.MOSAIC)"
            >
              <font-awesome-icon icon="chess-board"/>
            </div>
            <div class="manipulation-repeat basis-item" title="撤销" @click="undo">
              <font-awesome-icon icon="undo"/>
            </div>
            <div class="manipulation-repeat basis-item" title="重复" @click="restore">
              <font-awesome-icon icon="reply"/>
            </div>
          </li>
          <li class="manipulation-screenshot-sharing" title="裁剪">
            <font-awesome-icon icon="cut"/>
          </li>
          <li class="manipulation-shut-down" title="取消" @click="terminal">
            <font-awesome-icon icon="ban"/>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import CanvasHelper from "@/components/screenshot/CanvasHelper";
import utils from './utils'

export default {
  props: {
    css: {
      required: false,
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      zIndex: 2,
      snapshot: null,
      currentOperatorType: null,
      operatorType: {
        BRUSH: "brush",
        PALETTE: "palette",
        ERASER: "eraser",
        MOSAIC: "mosaic",
        CLIP: "clip"
      },
      canvasHelper: null
    };
  },
  mounted() {
    this.initShortcuts();
    this.initScrollEvent();
  },
  beforeDestroy() {
    this.unShortcuts()
  },
  methods: {
    onscroll() {
    },
    initScrollEvent() {
      window.onscroll = utils.debounce(this.onscroll, 500);
    },
    /**
     * @description 键盘快捷方式
     */
    shortcuts(evt) {
      if (evt.ctrlKey && evt.altKey && evt.key === 'a') {
        this.start()
      }
      if (evt.key === 'Escape') {
        this.terminal()
      }
    },
    initShortcuts() {
      document.addEventListener('keydown', this.shortcuts)
    },
    unShortcuts() {
      document.removeEventListener('keydown', this.shortcuts)
    },
    /**
     * @description 截图
     * @param {HTMLElement} 截图区域的HTMLElement
     * @param {Object} html2cavas配置
     * @param {Function} 截图成功的回调函数
     */
    doScreenshot(element, options, callback) {
      let defaultOptions = {
        ignoreElements: element => {
          return element.className === "screenshot-tools-box" || element.className === 'msg';
        },
        logging: false
      };
      options = { ...defaultOptions, ...options };
      html2canvas(element, options).then(callback);
    },
    initCanvas(base64) {
      let snapshot = document.querySelector("#snapshot");
      if (snapshot) {
        document.body.removeChild(snapshot);
      }
      let canvas = document.createElement('canvas')
      canvas.id = "snapshot";
      canvas.style.position = "absolute";
      canvas.style.top = 0;
      canvas.style.left = 0;
      let pageSize = utils.getPageSize();
      canvas.width = pageSize.width;
      canvas.height = pageSize.height;
      canvas.style.touchAction = 'none'
      let context = canvas.getContext('2d')
      let image = new Image()
      image.onload = () => {
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
      }
      image.src = base64
      document.body.appendChild(canvas);
      this.canvasHelper = new CanvasHelper({
        id: "snapshot",
        width: canvas.width,
        height: canvas.height
      });
      this.canvasHelper.init();
    },
    generateSnapshot() {
      this.doScreenshot(document.body, {}, canvas => {
        this.initCanvas(canvas.toDataURL());
      });
    },
    start() {
      if (this.canvasHelper instanceof Object) {
        return
      }
      this.currentOperatorType = this.operatorType.BRUSH;
      this.generateSnapshot();
      window.warnInfo('支持快捷键Esc退出截图');
    },
    switchOperator(operatorType) {
      this.currentOperatorType = operatorType;
      this.canvasHelper.setBrushType(operatorType)
    },
    undo() {
      this.canvasHelper.undo();
    },
    restore() {
      this.canvasHelper.restore();
    },
    terminal() {
      this.currentOperatorType = null;
      this.canvasHelper && this.canvasHelper.destory();
      this.canvasHelper = null
      this.snapshot = null;
    }
  }
}
</script>

<style lang="less" scoped>
.screenshot-tools-box {
  .snapshot {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .tools-manipulation {
    .manipulation-btn {
      position: fixed;
      width: 64px;
      height: 64px;
      display: block;
      top: 100px;
      right: 100px;
      z-index: 999;
      background: #516c96;
      border-radius: 4px;
      opacity: 0.4;
      transition: all 0.5s ease;
      cursor: pointer;
      &:before {
        content: "";
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
        content: "";
        width: 34px;
        height: 34px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: block;
        border-radius: 100%;
        background: #7c9dd1;
        box-shadow: 0 0 10px 0 #19437d,
          inset 0 0 4px 0 rgba(255, 255, 255, 0.84);
      }
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.8;
      }
    }
    .manipulation-btn.manipulation-active {
      opacity: 0.8;
    }
    .manipulation-list {
      display: none;
      position: fixed;
      left: 0;
      right: 0;
      margin: 0 auto;
      bottom: 20%;
      width: 480px;
      height: 80px;
      background-color: rgba(18, 24, 29, 1);
      border-radius: 5px;
      ul {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 10px;
        li.manipulation-basis {
          width: 264px;
          height: 56px;
          background: inherit;
          background-color: rgba(37, 39, 44, 1);
          border-radius: 5px;
          font-weight: 400;
          font-style: normal;
          font-size: 16px;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          .basis-item {
            width: 40px;
            height: 40px;
            border: solid 1px #343d49;
            background: #25272c;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            cursor: pointer;
            &:hover {
              width: 39px;
              height: 39px;
              border: solid 2px #058dcf;
            }
          }
          .basis-item-active {
            background: #058dcf;
          }
        }
        li.manipulation-screenshot-sharing,
        li.manipulation-shut-down {
          width: 56px;
          height: 56px;
          background-color: rgba(37, 39, 44, 1);
          border-radius: 5px;
          font-weight: 400;
          font-style: normal;
          font-size: 16px;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          font-size: 30px;
          cursor: pointer;
          &:hover {
            background: #058dcf;
          }
        }
      }
    }
  }
}
</style>