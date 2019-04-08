/* eslint-disable no-console */

class CanvasTools {
  constructor() {
    
    this.mosaicSize = 9; //马赛克的大小

    this.drawLine = this.drawLine.bind(this);
    this.drawMosaic = this.drawMosaic.bind(this);
  }
  drawLine(from, to) {
    this.context.beginPath();
    this.context.moveTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.stroke();
  }
  drawMosaic(to) {
    let { x, y } = to
    let originalImageData = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);  
    let originalImagePixelData = originalImageData.data; 

    let imageDataTemp = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);
    let imagePixelData = imageDataTemp.data;

    var i = (y * this.canvas.width + x) * 4;
    let centerR = originalImagePixelData[i]
    let centerG = originalImagePixelData[i + 1]
    let centerB = originalImagePixelData[i + 2]
    let centerA = originalImagePixelData[i + 3]
    let centerColor = `rgba( ${centerR}, ${centerG}, ${centerB}, ${centerA})`
    console.log(`centerA color %c${centerColor}`, `color:${centerColor}`)

    // this.context.putImageData(modifyImgData,0,0,0,0,canvas.width,canvas.height);
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
      return firstTouch ? { x: firstTouch.clientX, y: firstTouch.clientY } : {};
    } else {
      return { x: evt.clientX, y: evt.clientY };
    }
  }
  handleGestureStart(evt) {
    if (this.isEventCompleted) {
      return;
    }
    evt.preventDefault();
    this.initialPosition = this.getGesturePointFromEvent(evt);
    console.log(
      `${evt.type} to x: ${this.initialPosition.x} y: ${this.initialPosition.y}`
    );
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
    console.log(`${evt.type} to x: ${position.x} y: ${position.y}`);
    this.initialPosition = position;
  }
  handleGestureEnd(evt) {
    evt.preventDefault();
    let position = this.getGesturePointFromEvent(evt);
    console.log(`${evt.type} to x: ${position.x} y: ${position.y}`);
    if (evt.type === "pointerup") {
      this.canvas.onpointermove = null;
      this.canvas.onpointerup = null;
      // this.canvas.onpointercancel = null;
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
    this.history.push(
      this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
    );
    this.stepNumber = 1;
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
  undo() {
    if (this.history.length > 0) {
      this.context.putImageData(this.history[--this.stepNumber], 0, 0);
    }
  }
  repeat() {
    let current = this.stepNumber + 1;
    if (current < this.history.length) {
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
