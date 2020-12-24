import Vue from 'vue'
// import Calendar from './Calendar.vue'
// import { Calendar } from '../dist/Calendar'
import { Calendar } from 'vue-calendar-small'

Vue.config.productionTip = false

new Vue({
  render: h => h(Calendar),
}).$mount('#app')
