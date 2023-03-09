import { computed } from "vue";

import LoginLayout from "@/layouts/LoginLayout.vue";
import MainLayout from "@/layouts/MainLayout.vue";

import type { Component } from "vue";
import type {  RouteLocation } from "vue-router";


export const useLayouts = (route: RouteLocation) => {

  const obj: {
    [index: string]: Component;
  } = {
    main: MainLayout,
    login: LoginLayout
  };

  const getCurrentLayout = computed(() => {
    return obj[route.meta.layout || "main"];
  });

  return { getCurrentLayout };
};
