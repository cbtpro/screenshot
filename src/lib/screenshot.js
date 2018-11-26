import { concat } from '../util/string';
import { brushLine, setLineWidth, setLineCap, setStrokeStyle, getBrushPosition } from '../util/brush'
const html2canvas = require('html2canvas');

export class Screenshot {
    constructor(elem, options) {
        this.elem = elem;
        this.options = options;
        this.isOnBrush = false;
        this.initialized = false;

        this.brushStart = this.brushStart.bind(this);
        this.brushMove = this.brushMove.bind(this);
        this.brushEnd = this.brushEnd.bind(this);
    }
    init(options) {
        let canvas = document.createElement('canvas');
        this.context = canvas.getContext('2d');
        canvas.setAttribute('width', 500);
        canvas.setAttribute('height', 500);
        this.canvas = this.elem.appendChild(canvas);
        //初始化笔刷
        this.initBrush();
        this.initialized = true;
        return this; //返回自身，可以进行链式操作
    }
    setStrokeStyle(color) {
        setStrokeStyle(this.context, color);
    }
    setLineWidth(lineWidth) {
        setLineWidth(this.context, lineWidth)
    }
    initBrush() {

        this.setLineWidth(this.options.lineWidth);
        this.setStrokeStyle(this.options.strokeStyle);

        this.canvas.addEventListener('mousedown', this.brushStart);
        this.canvas.addEventListener('mousemove', this.brushMove);
        this.canvas.addEventListener('mouseup', this.brushEnd);
        return this;
    }
    brushStart(evt) {
        this.isOnBrush = true;
        this.context.beginPath();
        this.position = getBrushPosition(this.canvas, evt);
        return this;
    }
    brushMove(evt) {
        if (this.isOnBrush) {
            let position = getBrushPosition(this.canvas, evt);
            brushLine(this.context, this.position.x, this.position.y, position.x, position.y);
            this.position = position;
        }
        return this;
    }
    brushEnd(evt) {
        this.isOnBrush = false;
        this.context.stroke();
        return this;
    }
    screenshot(elem, options) {
        return html2canvas(elem, options);
    }
    destory() {
        //移除事件
        this.canvas.removeEventListener();
    }
}