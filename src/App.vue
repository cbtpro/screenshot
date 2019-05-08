<template>
  <div id="app">
    <img
      class="logo"
      alt="Vue logo"
      src="./assets/logo.png"
    >
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <component
      :is="isScreenshot"
      :css="screenshotStyles"
    />
		<div id="msg" class="msg">
			<p>欢迎使用收藏管理，您可以使用它来替换您的浏览器书签</p>
		</div>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import Screenshot from "@/components/screenshot/Screenshot";

export default {
  name: "app",
  components: {
    HelloWorld,
    Screenshot
  },
  data() {
    return {
      isScreenshot: "screenshot",
      screenshotStyles: {
        zIndex: 9999
      }
    };
  },
  mounted() {
    this.warnInfo('支持快捷键Ctrl + Alt + a进行截图');
  },
  methods: {
    doScreenshot() {
      this.isScreenshot = this.isScreenshot ? "" : "screenshot";
    },
    warnInfo(msg, delay = 4000) {
			//弹出消息
			var msgDom = document.getElementById('msg');
			msgDom.classList.add('active');
			msgDom.getElementsByTagName('p')[0].innerHTML = msg;
			requestAnimationFrame(function() {
				setTimeout(function() {
					msgDom.classList.remove('active');
				}, delay);
      });
      
      window.warnInfo = this.warnInfo
		}
  }
};
</script>

<style>
* {
  margin: 0;
}
html, body {
  width: 100%;
  height: 100%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
#app .logo {
  transform: translate3d(20px, 20px, 0);
}
#app .logo:hover {
  transition: all 2s;
  transform: rotate(-180deg);
}
.msg.active{
    display:block; 
    transform-origin: 100% 0%; 
    animation: fadeIn 1s ease-in-out; 
} 
.msg {
	display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
.msg p{
  position: relative;
  margin: 0 auto;
  text-align: center; 
  background-color: #1E2021; 
  padding: 20px;
  width: 400px;
  border-radius: 3px; 
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  color: #FFF;
  font-size: 13px;
  line-height: 1.4;
} 
@keyframes fadeIn { 
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
  }
}
</style>
