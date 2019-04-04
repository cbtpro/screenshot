<template>
  <canvas id="canvasPad" ref="screenshotCanvas"></canvas>
</template>

<script>
import CanvasHelper from './CanvasHelper'

export default {
  components: {
  },
  data() {
    return {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      canvasPad: null
    };
  },
  created() {
    
  },
  methods: {
    seta() {
      this.canvasPad.set()
    }
  },
  mounted() {
    this.canvasPad = new CanvasHelper({
      id: 'canvasPad',
      width: 300,
      height: 300
    })
  }
};
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
  z-index: 999;
}
</style>
