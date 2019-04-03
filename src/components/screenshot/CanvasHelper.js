/* eslint-disable no-console */

function getTouch(touchEvent) {
  let touchs = touchEvent.targetTouches;
  let [touch] = touchs;
  if (!touch) {
    return { pageX: null, pageY: null };
  }
  return touch;
}
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
    this.pointerdown = this.pointerdown.bind(this);
    this.pointermove = this.pointermove.bind(this);
    this.pointerup = this.pointerup.bind(this);

    this.touchstart = this.touchstart.bind(this);
    this.touchmove = this.touchmove.bind(this);
    this.touchend = this.touchend.bind(this);
  }
  pointerdown(evt) {
    evt.preventDefault();
    let { pageX, pageY } = evt;
    console.log(`pointerdown to x: ${pageX} y: ${pageY}`);
    this.position = { x: pageX, y: pageY };
    this.canvas.onpointermove = this.pointermove;
    this.canvas.onpointerup = this.pointerup;
  }
  pointermove(evt) {
    let { pageX, pageY } = evt;
    console.log(`pointermove to x: ${pageX} y: ${pageY}`);
    let position = { x: pageX, y: pageY };
    this.drawLine(this.position, position);
    this.position = position;
  }
  pointerup(evt) {
    let { pageX, pageY } = evt;
    console.log(`pointerup to x: ${pageX} y: ${pageY}`);
    this.canvas.onpointermove = null;
    this.canvas.onpointerup = null;
  }

  touchstart(touchEvent) {
    touchEvent.preventDefault();
    let touch = getTouch(touchEvent);
    let { pageX, pageY } = touch;
    console.log(`touchstart to x: ${pageX} y: ${pageY}`);
    this.position = { x: pageX, y: pageY };
    this.canvas.ontouchmove = this.touchmove;
    this.canvas.ontouchend = this.touchend;
  }
  touchmove(touchEvent) {
    let touch = getTouch(touchEvent);
    let { pageX, pageY } = touch;
    console.log(`touchmove to x: ${pageX} y: ${pageY}`);
    let position = { x: pageX, y: pageY };
    this.drawLine(this.position, position);
    this.position = position;
  }
  touchend(touchEvent) {
    let touch = getTouch(touchEvent);
    let { pageX, pageY } = touch;
    console.log(`pointerup to x: ${pageX} y: ${pageY}`);
    this.canvas.ontouchmove = null;
    this.canvas.ontouchend = null;
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
    // this.canvas.onpointerdown = this.pointerdown
    this.canvas.ontouchstart = this.touchstart;
  }
  destory() {
    if (this.canvas) {
      this.canvas.ontouchstart = null;
      this.canvas.remove();
    }
  }
}
