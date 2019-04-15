import Vue from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faSpinner,
  faPen,
  faPalette,
  faEraser,
  faChessBoard,
  faUndo,
  faReply,
  faCut,
  faBan
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VConsole from 'vconsole'
new VConsole()

library.add(faSpinner)
library.add(faPen)
library.add(faPalette)
library.add(faEraser)
library.add(faChessBoard)
library.add(faUndo)
library.add(faReply)
library.add(faCut)
library.add(faBan)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
