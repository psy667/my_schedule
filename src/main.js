import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'spectre.css'
import 'spectre.css/dist/spectre-icons.min.css'

import vSelect from 'vue-select'
// import firebase from 'firebase'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
Vue.component('v-select', vSelect)
