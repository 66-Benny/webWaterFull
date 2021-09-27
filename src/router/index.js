import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import taxiTravel from '@/pages/taxiTravel'
import fundRanking from '@/pages/fundRanking'
import webSocketLogin from '@/pages/webSocketLogin'
import webSocketHome from '@/pages/webSocketHome'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/index',
      name: 'index',
      component: index,
    },
    {
      path: '/taxiTravel',
      name: 'taxiTravel',
      component: taxiTravel,
    },
    {
      path: '/fundRanking',
      name: 'fundRanking',
      component: fundRanking,
    },
    {
      path: '/webSocketLogin',
      name: 'webSocketLogin',
      component: webSocketLogin,
    },
    {
      path: '/webSocketHome',
      name: 'webSocketHome',
      component: webSocketHome,
    },
  ],
})
