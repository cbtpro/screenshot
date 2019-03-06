<template>
  <canvas id="canvasPad">{{ notSupportCanvas }}</canvas>
</template>

<script>
import CanvasHelper from './CanvasHelper'
export default {
  props: {
    background: {
      type: HTMLCanvasElement,
      required: true
    },
    brushType: {
      type: String,
      required: false,
      default: 'bursh'
    }
  },
  data() {
    return {
      notSupportCanvas:
        "Sorry, your browser doesn't support the &lt;canvas&gt; element.",
      canvasPadDrawing: null
    }
  },
  mounted() {
    let canvasPad = document.querySelector('#canvasPad')
    let canvasPadWidth = canvasPad.offsetWidth
    let canvaspadHeight = canvasPad.offsetHeight
    this.canvasPadDrawing = new CanvasHelper({
      id: 'canvasPad',
      width: canvasPadWidth,
      height: canvaspadHeight,
      background: this.background,
      brushType: this.brushType
    })
  },
  methods: {
    setBrushType(brushType = 'brush') {
      this.canvasPadDrawing.setBrushType(brushType)
    },
    setLineWidth(lineWidth = 5) {
      this.canvasPadDrawing.setLineWidth(lineWidth)
    },
    setEraserSize(eraserSize = 20) {
      this.canvasPadDrawing.setEraserSize(eraserSize)
    },
    setStrokeStyle(color) {
      this.canvasPadDrawing.setStrokeStyle(color)
    }
  }
}
</script>

<style lang="less" scoped>
</style>