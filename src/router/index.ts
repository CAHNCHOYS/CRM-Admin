import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  type RouteLocationNormalized
} from "vue-router";
import InfoView from "../views/InfoView.vue";
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
      name: "info-page",
      component: InfoView,
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/login",
      name: "login-page",
      component: () => import("../views/LoginView.vue"),
      beforeEnter() {
        // const userAuthStore = useUserAuthStore();

        // if (userAuthStore.isUserLoggedIn) {
        //   return {
        //     name: "info-page"
        //   };
        // }
      },
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
      path: "/customers",
      name: "customers-page",
      component: () => import("../views/CustomersView.vue"),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/orders",
      name: "orders-page",
      component: () => import("../views/OrdersView.vue"),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/gsap",
      name: "gsap-animations",
      component: () => import("../views/AnimationsView.vue"),
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
  ],
  scrollBehavior: (to, from, savedPosition) => {
    return (
      savedPosition ||
      new Promise((res) => {
        setTimeout(() => res({ top: 0, left: 0, behavior: "smooth" }), 360);
      })
    );
  }
});

router.beforeEach(async (to, from) => {
  const userAuthStore = useUserAuthStore();

  //Если зашли первый раз
  if (!from.name) {
    console.log("Yes");
    await userAuthStore.getUserData();
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
