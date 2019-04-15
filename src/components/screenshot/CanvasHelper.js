/* eslint-disable no-console */

class CanvasTools {
  constructor() {

    this.quan = 3; //马赛克的大小
    this.num = 9; //一次操作包含马赛克的个数
    this.drawLine = this.drawLine.bind(this);
    this.drawMosaic = this.drawMosaic.bind(this);
  }
  drawLine(from, to) {
    this.context.beginPath();
    this.context.moveTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.stroke();
  }
  // https://github.com/yomonah/mosaic-js
  drawMosaic(position) {
    let { x: dx, y: dy } = position
    //原始图像
    let originalImgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    let originalPxData = originalImgData.data;

    //用于循环修改  
    let modifyImgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    let modifyPxData = modifyImgData.data;
    for (let i = dx - this.quan * this.num; i < dx + this.quan * this.num; i = i + 2 * this.quan + 1) {
      for (let j = dy - this.quan * this.num; j < dy + this.quan * this.num; j = j + 2 * this.quan + 1) {
        //中心点(dx,dy)
        // if(Math.pow(i-dx,2)+Math.pow(j-dy,2) <= Math.pow(this.quan*this.num/2,2)){
        if (!((i == dx - this.quan * this.num && j == dy - this.quan * this.num) || (i == dx - this.quan * this.num && j == dy - this.quan * this.num + 2 * this.quan + 1) ||
            (i == dx - this.quan * this.num && j == dy - this.quan * this.num + 4 * this.quan + 2) || (i == dx - this.quan * this.num && j == dy - this.quan * this.num + 12 * this.quan + 6) ||
            (i == dx - this.quan * this.num && j == dy - this.quan * this.num + 14 * this.quan + 7) || (i == dx - this.quan * this.num && j == dy - this.quan * this.num + 16 * this.quan + 8) ||
            (i == dx - this.quan * this.num + 16 * this.quan + 8 && j == dy - this.quan * this.num) || (i == dx - this.quan * this.num + 16 * this.quan + 8 && j == dy - this.quan * this.num + 2 * this.quan + 1) ||
            (i == dx - this.quan * this.num + 16 * this.quan + 8 && j == dy - this.quan * this.num + 4 * this.quan + 2) || (i == dx - this.quan * this.num + 16 * this.quan + 8 && j == dy - this.quan * this.num + 12 * this.quan + 6) ||
            (i == dx - this.quan * this.num + 16 * this.quan + 8 && j == dy - this.quan * this.num + 14 * this.quan + 7) || (i == dx - this.quan * this.num + 16 * this.quan + 8 && j == dy - this.quan * this.num + 16 * this.quan + 8) ||
            (i == dx - this.quan * this.num + 2 * this.quan + 1 && j == dy - this.quan * this.num) || (i == dx - this.quan * this.num + 4 * this.quan + 2 && j == dy - this.quan * this.num) ||
            (i == dx - this.quan * this.num + 12 * this.quan + 6 && j == dy - this.quan * this.num) || (i == dx - this.quan * this.num + 14 * this.quan + 7 && j == dy - this.quan * this.num) ||
            (i == dx - this.quan * this.num + 2 * this.quan + 1 && j == dy - this.quan * this.num + 16 * this.quan + 8) || (i == dx - this.quan * this.num + 4 * this.quan + 2 && j == dy - this.quan * this.num + 16 * this.quan + 8) ||
            (i == dx - this.quan * this.num + 12 * this.quan + 6 && j == dy - this.quan * this.num + 16 * this.quan + 8) || (i == dx - this.quan * this.num + 14 * this.quan + 7 && j == dy - this.quan * this.num + 16 * this.quan + 8))) {
          let sumR = 0;
          let sumG = 0;
          let sumB = 0;
          //找他周围的元素 
          for (let x = -this.quan; x <= this.quan; x++) {
            for (let y = -this.quan; y <= this.quan; y++) {
                let xx = i + x;
                let yy = j + y;
                let pp = yy * this.canvas.width + xx; //周围的元素。  
                sumR += originalPxData[pp * 4 + 0];
                sumG += originalPxData[pp * 4 + 1];
                sumB += originalPxData[pp * 4 + 2];
            }
          }

          let totlal = (2 * this.quan + 1) * (2 * this.quan + 1);
          let avgR = sumR / totlal;
          let avgG = sumG / totlal;
          let avgB = sumB / totlal;

          for (let x = -this.quan; x <= this.quan; x++) {
            for (let y = -this.quan; y <= this.quan; y++) {
                let xx = i + x;
                let yy = j + y;
                let pp = yy * this.canvas.width + xx; //周围的元素。  
                modifyPxData[pp * 4 + 0] = avgR;
                modifyPxData[pp * 4 + 1] = avgG;
                modifyPxData[pp * 4 + 2] = avgB;
            }
          }
        }
      }
    }
    this.context.putImageData(modifyImgData, 0, 0, 0, 0, this.canvas.width, this.canvas.height);
  }
}
class CanvasEvents extends CanvasTools {
  constructor() {
    super();

    this.handleGestureStart = this.handleGestureStart.bind(this);
    this.handleGestureMove = this.handleGestureMove.bind(this);
    this.handleGestureEnd = this.handleGestureEnd.bind(this);
  }
  getGesturePointFromEvent(evt) {
    if (evt.targetTouches) {
      let [firstTouch] = evt.targetTouches;
      return firstTouch ? { x: parseInt(firstTouch.clientX), y: parseInt(firstTouch.clientY) } : {};
    } else {
      return { x: parseInt(evt.clientX), y: (evt.clientY) };
    }
  }
  handleGestureStart(evt) {
    if (this.isEventCompleted) {
      return;
    }
    evt.preventDefault();
    this.initialPosition = this.getGesturePointFromEvent(evt);
    // console.log(`${evt.type} to x: ${this.initialPosition.x} y: ${this.initialPosition.y}`);
    if (evt.type === "pointerdown") {
      this.canvas.onpointermove = this.handleGestureMove;
      this.canvas.onpointerup = this.handleGestureEnd;
      this.canvas.onpointercancel = this.handleGestureEnd;
    } else if (evt.type === "touchstart") {
      this.canvas.ontouchmove = this.handleGestureMove;
      this.canvas.ontouchend = this.handleGestureEnd;
      this.canvas.ontouchcancel = this.handleGestureEnd;
    } else {
      this.canvas.onmousemove = this.handleGestureMove;
      this.canvas.onmouseup = this.handleGestureEnd;
    }
    this.isEventCompleted = true;
  }
  handleGestureMove(evt) {
    evt.preventDefault();
    let position = this.getGesturePointFromEvent(evt);
    if (this.brushType === 'brush') {
      this.drawLine(this.initialPosition, position);
    } else if (this.brushType === 'mosaic') {
      this.drawMosaic(position)
    }
    // console.log(`${evt.type} to x: ${position.x} y: ${position.y}`);
    this.initialPosition = position;
  }
  handleGestureEnd(evt) {
    evt.preventDefault();
    this.snapshot()
    // let position = this.getGesturePointFromEvent(evt);
    // console.log(`${evt.type} to x: ${position.x} y: ${position.y}`);
    if (evt.type === "pointerup") {
      this.canvas.onpointermove = null;
      this.canvas.onpointerup = null;
      this.canvas.onpointercancel = null;
    } else if (evt.type === "touchend") {
      this.canvas.ontouchmove = null;
      this.canvas.ontouchend = null;
      this.canvas.ontouchcancel = null;
    } else {
      this.canvas.onmousemove = null;
      this.canvas.onmouseup = null;
    }
    this.isEventCompleted = false;
  }
}
export default class CanvasHelper extends CanvasEvents {
  constructor(config) {
    super();
    const {
      id = this.requiredConfig("id"),
      width = this.requiredConfig("width"),
      height = this.requiredConfig("height"),
      lineWidth = 5,
      strokeStyle = "#ff0000",
      brushType = "brush"
    } = config;

    this.id = id;
    this.canvas = document.getElementById(this.id);
    // this.setDimensions();
    this.context = this.canvas.getContext("2d");
    this.width = width;
    this.height = height;

    this.lineWidth = lineWidth;
    this.strokeStyle = strokeStyle;
    this.brushType = brushType;

    this.history = [];
    this.stepNumber = 0;
    this.snapshot()
  }

  requiredConfig(param) {
    throw new Error(`${param} is required!`);
  }

  setDimensions() {
    this.canvas.height = this.height;
    this.canvas.width = this.width;
  }
  setBrushType(brushType) {
    this.brushType = brushType
  }
  initCanvas() {
    this.context.strokeStyle = this.strokeStyle;
    this.context.lineWidth = this.lineWidth;
  }
  snapshot() {
    this.history.push(
      this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
    );
    this.stepNumber++
  }
  undo() {
    let current = this.stepNumber - 1
    if (this.history.length > 0 && current >= 0) {
      this.context.putImageData(this.history[--this.stepNumber], 0, 0);
    }
  }
  repeat() {
    let current = this.stepNumber + 1;
    if (this.history.length > 0 && current < this.history.length) {
      this.context.putImageData(this.history[++this.stepNumber], 0, 0);
    }
  }
  init() {
    if (window.PointerEvent) {
      this.canvas.onpointerdown = this.handleGestureStart;
    } else if (window.TouchEvent) {
      this.canvas.ontouchstart = this.handleGestureStart;
    } else {
      this.canvas.onmousedown = this.handleGestureStart;
    }

    // 禁用safari的touchstart事件
    // if(/iP(hone|ad)/.test(window.navigator.userAgent)) {
    //   document.body.addEventListener('touchstart', function() {}, false);
    // }
  }
  destory() {
    if (this.canvas) {
      this.canvas.ontouchstart = null;
      this.canvas.remove();
    }
  }
}
