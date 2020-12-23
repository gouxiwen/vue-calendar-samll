import Calendar from './Calendar.vue'

const install = function (Vue) {
    Vue.component(Calendar.name, Calendar)
  }
  
  const VueCalendar = { Calendar, install }
  
  export default VueCalendar
  export { Calendar, install }