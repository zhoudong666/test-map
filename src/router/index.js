import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/barChart',
    name: 'barChart',
    component: () => import('../views/barChart.vue')
  },
  {
    path: '/pictorialBarChart',
    name: 'pictorialBarChart',
    component: () => import('../views/pictorialBarChart.vue')
  },
  {
    path: '/pieChart',
    name: 'pieChart',
    component: () => import('../views/pieChart.vue')
  },
  {
    path: '/gaugeChart',
    name: 'gaugeChart',
    component: () => import('../views/gaugeChart.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
