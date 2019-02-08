<template>
  <div id="app">
    <img class="logo" alt="Vue logo" src="./assets/logo.png">
    <iframe src="https://www.baidu.com" frameborder="0" width="100%" height="400"></iframe>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <component :is="isScreenshot" :css="screenshotStyles" />
    <button @click="doScreenshot">开启/关闭截图</button>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Screenshot from "@/components/Screenshot";

export default {
  name: 'app',
  components: {
    // HelloWorld,
    Screenshot
  },
  data() {
    return {
      isScreenshot: 'screenshot',
      screenshotStyles: {
        zIndex: 9999
      }
    }
  },
  methods: {
    doScreenshot() {
      this.isScreenshot = this.isScreenshot?'':'screenshot';
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#app .logo {
  transform: translate3d(20px, 20px, 0);
}
#app .logo:hover {
  transition: all 2s;
  transform: rotate(-180deg);
}
</style>
