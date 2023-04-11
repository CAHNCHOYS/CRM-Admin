import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useUserAuthStore } from "@/stores/userAuth";

import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    // is optional
    layout?: string;
    requireAuth: boolean;
    // must be declared by every route
  }
}

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home-page",
      component: HomeView,
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/login",
      name: "login-page",
      component: () => import("../views/LoginView.vue"),
      meta: {
        layout: "login",
        requireAuth: false
      }
    },
    {
      path: "/register",
      name: "register-page",
      component: () => import("../views/RegisterView.vue"),
      meta: {
        layout: "login",
        requireAuth: false
      }
    },
    {
      path: "/account",
      name: "account-page",
      component: () => import("../views/AccountView.vue"),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/products",
      name: "products-page",
      component: () => import("../views/ProductsView.vue"),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/stats",
      name: "stats-page",
      component: () => import("../views/StatiscticView.vue"),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/notes",
      name: "notes-page",
      component: () => import("../views/NotesView.vue"),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/clients",
      name: "clients-page",
      component: () => import("../views/ClientsView.vue"),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/gsap",
      name: "gsap",
      component: () => import("../views/LearGsap.vue"),
      meta: {
        requireAuth: false
      }
    },

    {
      path: "/:catchAll(.*)",
      name: "not-found-page",
      component: () => import("../views/NotFoundView.vue"),
      meta: {
        requireAuth: false,
        layout: "login"
      }
    }
  ]
});

router.beforeEach(async (to, from) => {
  const userAuthStore = useUserAuthStore();

  //Если зашли первый раз
  if (!from.name) {
    await userAuthStore.fetchUser();
  }

  if (to.meta.requireAuth && !userAuthStore.isUserLoggedIn) {
    return {
      name: "login-page",
      query: {
        redirectedFrom: to.name?.toString() || to.fullPath
      }
    };
  }
});

export default router;
