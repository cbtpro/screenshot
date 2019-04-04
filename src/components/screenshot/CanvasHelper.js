/* eslint-disable no-console */

// function getTouch(touchEvent) {
//   let touchs = touchEvent.targetTouches;
//   let [touch] = touchs;
//   if (!touch) {
//     return { pageX: null, pageY: null };
//   }
//   return touch;
// }
class CanvasTools {
  constructor() {
    this.drawLine = this.drawLine.bind(this);
  }
  drawLine(from, to) {
    this.context.beginPath();
    this.context.moveTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.stroke();
  }
}
class CanvasEvents extends CanvasTools {
  constructor() {
    super();
    // this.pointerdown = this.pointerdown.bind(this);
    // this.pointermove = this.pointermove.bind(this);
    // this.pointerup = this.pointerup.bind(this);

    // this.touchstart = this.touchstart.bind(this);
    // this.touchmove = this.touchmove.bind(this);
    // this.touchend = this.touchend.bind(this);

    // this.mousedown = this.mousedown.bind(this);
    // this.mousemove = this.mousemove.bind(this);
    // this.mouseup = this.mouseup.bind(this);

    this.handleGestureStart = this.handleGestureStart.bind(this);
    this.handleGestureMove = this.handleGestureMove.bind(this);
    this.handleGestureEnd = this.handleGestureEnd.bind(this);
  }
  // pointerdown(pointerEvent) {
  //   pointerEvent.preventDefault();
  //   let { pageX, pageY } = pointerEvent;
  //   console.log(`pointerdown to x: ${pageX} y: ${pageY}`);
  //   this.position = { x: pageX, y: pageY };
  //   this.canvas.onpointermove = this.pointermove;
  //   this.canvas.onpointerup = this.pointerup;
  // }
  // pointermove(pointerEvent) {
  //   pointerEvent.preventDefault();
  //   let { pageX, pageY } = pointerEvent;
  //   console.log(`pointermove to x: ${pageX} y: ${pageY}`);
  //   let position = { x: pageX, y: pageY };
  //   this.drawLine(this.position, position);
  //   this.position = position;
  // }
  // pointerup(pointerEvent) {
  //   pointerEvent.preventDefault();
  //   let { pageX, pageY } = pointerEvent;
  //   console.log(`pointerup to x: ${pageX} y: ${pageY}`);
  //   this.canvas.onpointermove = null;
  //   this.canvas.onpointerup = null;
  // }

  // // 苹果设备只触发touch事件，安卓设备触发touch+pointer事件
  // touchstart(touchEvent) {
  //   touchEvent.preventDefault();
  //   let touch = getTouch(touchEvent);
  //   let { pageX, pageY } = touch;
  //   console.log(`touchstart to x: ${pageX} y: ${pageY}`);
  //   this.position = { x: pageX, y: pageY };
  //   this.canvas.ontouchmove = this.touchmove;
  //   this.canvas.ontouchend = this.touchend;
  // }
  // touchmove(touchEvent) {
  //   touchEvent.preventDefault();
  //   let touch = getTouch(touchEvent);
  //   let { pageX, pageY } = touch;
  //   console.log(`touchmove to x: ${pageX} y: ${pageY}`);
  //   let position = { x: pageX, y: pageY };
  //   this.drawLine(this.position, position);
  //   this.position = position;
  // }
  // touchend(touchEvent) {
  //   touchEvent.preventDefault();
  //   let touch = getTouch(touchEvent);
  //   let { pageX, pageY } = touch;
  //   console.log(`touchend to x: ${pageX} y: ${pageY}`);
  //   this.canvas.ontouchmove = null;
  //   this.canvas.ontouchend = null;
  // }

  // mousedown(mouseEvent) {
  //   mouseEvent.preventDefault();
  //   let { pageX, pageY } = mouseEvent;
  //   console.log(`mousedown to x: ${pageX} y: ${pageY}`);
  //   this.position = { x: pageX, y: pageY };
  //   this.canvas.onmousemove = this.mousemove;
  //   this.canvas.onmouseup = this.mouseup;
  // }
  // mousemove(mouseEvent) {
  //   mouseEvent.preventDefault();
  //   let { pageX, pageY } = mouseEvent;
  //   console.log(`mousemove to x: ${pageX} y: ${pageY}`);
  //   let position = { x: pageX, y: pageY };
  //   this.drawLine(this.position, position);
  //   this.position = position;
  // }
  // mouseup(mouseEvent) {
  //   mouseEvent.preventDefault();
  //   let { pageX, pageY } = mouseEvent;
  //   console.log(`mouseup to x: ${pageX} y: ${pageY}`);
  //   this.canvas.onmousemove = null;
  //   this.canvas.onmouseup = null;
  // }
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
    // if (evt.type === "pointerdown") {
    //   this.canvas.onpointermove = this.handleGestureMove;
    //   this.canvas.onpointerup = this.handleGestureEnd;
    //   this.canvas.onpointercancel = this.handleGestureEnd;
    // } else 
    if (evt.type === "touchstart") {
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
    this.drawLine(this.initialPosition, position);
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

    this.mosaicSize = 3; //马赛克的大小
    this.mosaicCount = 9; //一次操作包含马赛克的个数

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
    // this.canvas.onpointerdown = this.pointerdown;
    // this.canvas.ontouchstart = this.touchstart;
    // this.canvas.onmousedown = this.mousedown;

    // this.canvas.onpointerdown = this.handleGestureStart;
    this.canvas.ontouchstart = this.handleGestureStart;
    this.canvas.onmousedown = this.handleGestureStart;
    
    // 禁用safari的touchstart事件
    if(/iP(hone|ad)/.test(window.navigator.userAgent)) {
      document.body.addEventListener('touchstart', function() {}, false);
    }
  }
  destory() {
    if (this.canvas) {
      this.canvas.ontouchstart = null;
      this.canvas.remove();
    }
  }
}
