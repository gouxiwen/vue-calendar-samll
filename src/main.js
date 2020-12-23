import Vue from 'vue'
// import Calendar from './Calendar.vue'
import { Calendar } from '../dist/Calendar'

Vue.config.productionTip = false

new Vue({
  render: h => h(Calendar),
}).$mount('#app')
