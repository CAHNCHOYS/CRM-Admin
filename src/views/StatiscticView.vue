<template>
  <div>
    <h2 class="text-h2 title mb-6">Статистика</h2>

    <v-row>
      <v-col cols="6" class="left-header-col">
        <v-card color="green" elevation="0">
          <v-card-text>
            <v-row align="center">
              <v-col cols="auto">
                <v-btn icon="mdi-laptop" color="brown" class="text-white"></v-btn>
              </v-col>
              <v-col cols="auto" class="flex-grow-1">
                <p class="text-h5">Всего товаров</p>
                <p class="text-h2">{{ productsCount.count.toFixed(0) }}</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" class="right-header-col">
        <v-card color="deep-orange-lighten-2" elevation="0">
          <v-card-text>
            <v-row align="center">
              <v-col cols="auto">
                <v-btn icon="mdi-account" color="cyan" class="text-white"></v-btn>
              </v-col>
              <v-col cols="auto" class="flex-grow-1 text-white">
                <p class="text-h5">Всего Клиентов</p>
                <p class="text-h2">{{ clientsCount.count.toFixed(0) }}</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!----Charts------>
    <v-row align="center" class="row">
      <v-col cols="4"> <ProductsCount :data="productCountChartData"></ProductsCount></v-col>
      <v-col cols="4"> <ProductsPrices :data="productPriceChartData"></ProductsPrices></v-col>
      <v-col cols="4"> <ClientsPremium :data="clientsPremiumChartData"></ClientsPremium></v-col>
      <v-col cols="4">
        <CategoryProductsCount :data="productsCategoriesCountChart"></CategoryProductsCount>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";

import { useUserProductsStore } from "@/stores/userProducts";
import { useUserClientsStore } from "@/stores/userClients";
import gsap from "gsap";

import ProductsCount from "@/components/Charts/ProductsCount.vue";
import ProductsPrices from "@/components/Charts/ProductsPrices.vue";
import ClientsPremium from "@/components/Charts/ClientsPremium.vue";
import CategoryProductsCount from "@/components/Charts/CategoryProductsCount.vue";

import type { ChartData } from "chart.js/auto";

const userProductsStore = useUserProductsStore();
const userClientsStore = useUserClientsStore();

const dialogOpened = ref(false);
const date = ref<Date>();

onMounted(async () => {
  if (!userProductsStore.productsCategories.length) {
    await userProductsStore.fetchProductsCategories();
  }

  gsap.from(".title", {
    x: "-300",
    opacity: 0,
    ease: "linear",
    duration: 0.5
  });

  gsap.from(".left-header-col", {
    x:"-100%",
    opacity: 0,
    duration: 0.5
  });

  gsap.from(".right-header-col", {
    x:"100%",
  
    duration:0.5,
    opacity: 0,
 
  });

  gsap.from(".row > *", {
    scale: 0,
    stagger: 0.5,
    duration: 0.8,
    opacity: 0,
    ease: "power3.out",
    delay: 0.5
  });

  gsap.to(productsCount.value, {
    count: userProductsStore.userProducts.length,
    duration: 2,
    delay:0.5,
  });

  gsap.to(clientsCount.value, {
    count: userClientsStore.clients.length,
    duration: 2,
    delay:0.5,
  });
});

const productsCount = ref({
  count: 0
});

const clientsCount = ref({
  count: 0
});

const productCountChartData = computed(() => ({
  labels: userProductsStore.userProducts.map((pr) => pr.name),
  datasets: [
    {
      label: "Кол-во: ",
      backgroundColor: [
        "#512DA8",
        "#283593",
        "#0277BD",
        "#558B2F",
        "#78909C",
        "#BDBDBD",
        "#FF9800",
        "#FBC02D",
        "#42A5F5",
        "#8BC34A",
        "#5D4037",
        "#64FFDA",
        "#EC407A",
        "#004D40"
      ],
      data: userProductsStore.userProducts.map((pr) => pr.count),
      hoverOffset: 4
    }
  ]
}));

const productPriceChartData = computed(() => ({
  labels: userProductsStore.userProducts.map((pr) => pr.name),
  datasets: [
    {
      label: "Цена(руб): ",
      backgroundColor: [
        "#512DA8",
        "#283593",
        "#0277BD",
        "#558B2F",
        "#78909C",
        "#BDBDBD",
        "#FF9800",
        "#FBC02D",
        "#42A5F5",
        "#8BC34A",
        "#5D4037",
        "#64FFDA",
        "#EC407A",
        "#004D40"
      ],
      data: userProductsStore.userProducts.map((pr) => pr.price),
      hoverOffset: 4
    }
  ]
}));

const clientsPremiumChartData = computed<ChartData<"bar">>(() => ({
  labels: ["Наличие премиума"],
  datasets: [
    {
      label: "Есть премиум",
      data: [userClientsStore.clients.filter((client) => client.premium === 1).length]
    },
    {
      label: "Нету премиума",
      data: [userClientsStore.clients.filter((client) => client.premium === 0).length]
    }
  ]
}));

const productsCategoriesCountChart = computed<ChartData<"bar">>(() => ({
  labels: ["Количество товара по категориям"],
  datasets: userProductsStore.productsCategories.map((category) => {
    return {
      label: category.name,
      data: [userProductsStore.userProducts.filter((pr) => pr.category === category.name).length]
    };
  })
}));
</script>

<style lang="scss" scoped></style>
