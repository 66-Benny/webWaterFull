import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import taxiTravel from '@/pages/taxiTravel'
import fundRanking from '@/pages/fundRanking'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/taxiTravel',
      name: 'taxiTravel',
      component: taxiTravel
    },
    {
      path: '/fundRanking',
      name: 'fundRanking',
      component: fundRanking
    }
  ]
})