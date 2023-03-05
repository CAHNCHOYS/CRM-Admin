import { computed, VueElement } from 'vue';

import LoginLayout from '@/layouts/LoginLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';

import type { Component } from 'vue';

import 'vue-router';
import { useRoute } from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    // is optional
    layout?: string
    // must be declared by every route
  }
}

export const useLayouts = () => {

  const obj: {
    [index: string]: Component
  } = {
    main: MainLayout,
    login: LoginLayout
  }
  
  const route = useRoute()

  const getCurrentLayout = computed(()=> {
    return obj[route.meta.layout || "main"]
  });

  return { getCurrentLayout };
}
