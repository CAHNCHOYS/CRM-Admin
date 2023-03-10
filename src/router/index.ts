import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import 'vue-router';


declare module 'vue-router' {
  interface RouteMeta {
    // is optional
    layout?: string
    requireAuth: boolean
    // must be declared by every route
  }
}



const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requireAuth: true,
      }
    },
    {
      path:"/login",
      name:"login-page",
      component:()=> import('../views/LoginView.vue'),
      meta:{
        layout: "login",
        requireAuth: false,
      },
    },
    {
      path:"/register",
      name:"register-page",
      component:()=> import('../views/RegisterView.vue'),
      meta:{
        layout: "login",
        requireAuth: false,
      },
    },
    {
      path:"/account",
      name:"account-page",
      component:()=> import('../views/AccountView.vue'),
      meta: {
        requireAuth: true,
      }
      
    },
    {
      path:"/workers",
      name:"workers",
      component:()=> import('../views/WorkersView.vue'),
      meta: {
        requireAuth: true,
      }
    },
    {
      path:"/about",
      name:"about-page",
      component:()=> import('../views/AboutView.vue'),
      meta: {
        requireAuth: true,
      }
    }
 

  ]
})



router.beforeEach((to, from) => {
   
  if(to.meta.requireAuth && !localStorage.getItem("token")){
    return {
      name: "login-page",
      query: {
        redirectedFrom: to.name?.toString() || to.fullPath,
      }
    }
  }


})




export default router
