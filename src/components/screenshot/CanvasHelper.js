// https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial
/**
 * Canvas工具类
 */
export default class CanvasHelper {
    constructor(config) {
      /** 获取传入参数并设置默认参数 */
      const {
        id = this.requiredParam('id'),
        width = this.requiredParam('width'),
        height = this.requiredParam('height'),
        // background,
        brushType = 'brush',  // 画笔类型,支持 brush 画笔、eraser 橡皮、mosaic 马赛克
        brushSize = 5, // 画笔大小
        strokeStyle = '#ff0000', // 画笔颜色
        eraserSize = 30 // 橡皮擦尺寸
      } = config
  
      /** 初始化值 */
      this.brushType = brushType
      this.brushSize = brushSize
      this.strokeStyle = strokeStyle
      this.eraserSize = eraserSize
  
      /** 当前画布是否就绪 */
      this.readyStatus = false
      this.id = id
      this.canvas = document.getElementById(this.id)
      this.width = width
      this.height = height
      this.canvas.setAttribute('width', this.width)
      this.canvas.setAttribute('height', this.height)
      this.context = this.canvas.getContext('2d')
  
      /** touch标识，用来判断是不是同一个触摸点在操作 */
      this.touchIdentifier = null
  
      // 重新绑定this的指向
      this.brushStart = this.brushStart.bind(this)
      this.brushMove = this.brushMove.bind(this)
      this.brushEnd = this.brushEnd.bind(this)
  
      this.touchStart = this.touchStart.bind(this)
      this.touchMove = this.touchMove.bind(this)
      this.touchEnd = this.touchEnd.bind(this)
  
      // this.initBackground(background)
      this.initCanvasPad()
    }
  
    requiredParam(param) {
      throw new Error(`${param} is required`)
    }
    /**
     * 初始化画板
     */
    initCanvasPad() {
      // 初始化事件
      this.initCanvasPadBrush()
      this.readyStatus = true
    }
    initBackground(canvasImageSource) {
      this.drawImage(canvasImageSource)
    }
    // https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/strokeStyle
    /**
     * @description 设置canvas绘制颜色，支持color、gradient、pattern
     */
    setStrokeStyle(strokeStyle) {
      this.context.strokeStyle = strokeStyle || '#ff0000'
    }
  
    // https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineWidth
    /**
     * @description 设置线段宽度
     * @param {Number} lineWidth
     */
    setLineWidth(lineWidth) {
      this.context.lineWidth = lineWidth || 5
    }
    setEraserSize(eraserDiameter) {
      this.eraserDiameter = eraserDiameter
    }
    // https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineCap
    /**
     * 绘制线段末端的属性
     * @param {String} lineCap
     * @description
     * butt
     * 线段末端以方形结束。
     * round
     * 线段末端以圆形结束。
     * square
     * 线段末端以方形结束，但是增加了一个宽度和线段相同，高度是线段厚度一半的矩形区域。
     */
    setLineCap(lineCap) {
      this.context.lineCap = lineCap || 'round'
    }
    setBrushType(type = 'brush') {
      this.brushType = type
    }
    initCanvasPadBrush() {
      this.setStrokeStyle(this.strokeStyle)
      this.setLineWidth(this.lineWidth)
      this.canvas.addEventListener('mousedown', this.brushStart)
      this.canvas.addEventListener('mousemove', this.brushMove)
      this.canvas.addEventListener('mouseup', this.brushEnd)
  
      this.canvas.addEventListener('touchstart', this.touchStart)
      this.canvas.addEventListener('touchmove', this.touchMove)
      this.canvas.addEventListener('touchend', this.touchEnd)
    }
    copyTouch(touch) {
      return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY }
    }
    touchStart(evt) {
      var touches = evt.changedTouches
      if (touches.length > 1) {  // 判断有几个触点，不允许多个触点绘制
        return
      }
      let touch = touches[0]
      const { identifier } = touch
      this.touchIdentifier = identifier
      this.position = this.getBrushPointerPosition(touch)
    }
    touchMove(evt) {
      var touches = evt.changedTouches
      if (touches.length > 1) {  // 判断有几个触点，不允许多个触点绘制
        return
      }
      let touch = touches[0]
      const { identifier } = touch
      if (identifier !== this.touchIdentifier) { return }
      let position = this.getBrushPointerPosition(touch)
      if (this.brushType === 'brush') {
        this.brushLine(this.position.x, this.position.y, position.x, position.y)
        this.position = position
      } else if (this.brushType === 'eraser') {
        this.eraser(position.x, position.y, this.eraserDiameter)
      }
    }
    touchEnd() {
      this.isOnBrush = false
    }
    brushStart(evt) {
      this.position = this.getBrushPosition(evt)
    }
    brushMove(evt) {
      let position = this.getBrushPosition(evt)
      if (evt.buttons === 1) {
        if (this.brushType === 'brush') {
          this.setStrokeStyle(this.strokeStyle)
          this.setLineWidth(this.lineWidth)
          this.brushLine(this.position.x, this.position.y, position.x, position.y)
          this.position = position
        } else if (this.brushType === 'eraser') {
          this.eraser(position.x, position.y)
        }
      }
    }
    brushEnd() {
      this.isOnBrush = false
    }
    clear() {
      this.context.clearRect(0, 0, this.width, this.height)
    }
    eraser(x, y, diameter = 30) {
      let radius = diameter / 2
      x = x - radius
      y = y - radius
      this.context.clearRect(x, y, diameter, diameter)
    }
  
    brushLine(x, y, x1, y1) {
      this.context.beginPath()
      this.context.moveTo(x, y)
      this.context.lineTo(x1, y1)
      this.context.closePath()
      this.context.stroke()
    }
  
    /**
     * @description 将图片画进canvas中
     * @param {CanvasImageSource} canvasImageSource
     */
    drawImage(canvasImageSource) {
      this.context.drawImage(canvasImageSource, 0, 0, this.width, this.height)// this即是imgObj,保持图片的原始大小
    }
    /**
     * @description 获取触摸屏上canvas上触摸点的相对于canvas左上角的坐标
     * @param {Touch} touch
     */
    getBrushPointerPosition(touch) {
      let rect = this.canvas.getBoundingClientRect()
      let x = touch.pageX - rect.left * (this.canvas.width / rect.width)
      let y = touch.pageY - rect.top * (this.canvas.height / rect.height)
      return { x, y }
    }
    /**
     * @description 获取pc上canvas上鼠标相对于canvas左上角的坐标
     * @param {MouseEvent} evt
     */
    getBrushPosition(evt) {
      var rect = this.canvas.getBoundingClientRect()
      var x = evt.clientX - rect.left * (this.canvas.width / rect.width)
      var y = evt.clientY - rect.top * (this.canvas.height / rect.height)
      return { x, y }
    }
  
    destory() {
      this.clear()
      // 移除事件
      this.canvas.removeEventListener('mousedown', this.brushStart)
      this.canvas.removeEventListener('mousemove', this.brushMove)
      this.canvas.removeEventListener('mouseup', this.brushEnd)
  
      this.canvas.removeEventListener('touchstart', this.touchStart)
      this.canvas.removeEventListener('touchmove', this.touchMove)
      this.canvas.removeEventListener('touchend', this.touchEnd)
    }
  }