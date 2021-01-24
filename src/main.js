// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
import VueClipboard from "vue-clipboard2";
import Calendar from 'vue-mobile-calendar'
import _ from 'lodash'
import echarts from "echarts";
import axios from 'axios';

Vue.use(ElementUI, { moment })
Vue.use(VueClipboard)
Vue.use(Calendar)
Vue.prototype._ = _
Vue.prototype.$echarts = echarts;
Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
