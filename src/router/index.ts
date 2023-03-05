import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path:"/login",
      name:"login-page",
      component:()=> import('../views/LoginView.vue'),
      meta:{
        layout: "login",
      },
    },
    {
      path:"/register",
      name:"register-page",
      component:()=> import('../views/RegisterView.vue'),
      meta:{
        layout: "login",
      },
    },
    {
      path:"/account",
      name:"accont-page",
      component:()=> import('../views/AccountView.vue'),
      
    },
    {
      path:"/workers",
      name:"workers",
      component:()=> import('../views/WorkersView.vue'),
      
    }
 

  ]
})

export default router
