<template>
  <div>
    <h2 class="title text-sm-h2 text-h3 mb-6">Статистика</h2>

    <v-row class="stats-header">
      <v-col sm="4" cols="12" class="left-header-col">
        <v-card color="green" height="100%" elevation="0">
          <v-card-text>
            <v-row align="center" :no-gutters="smAndDown">
              <v-col md="auto" cols="12" class="d-md-block d-flex justify-center mb-md-0 mb-1">
                <v-btn icon="mdi-laptop" color="blue-grey" class="text-white" />
              </v-col>
              <v-col cols="auto" class="flex-grow-1 text-md-left text-center">
                <p class="text-sm-h5 text-h6">Всего товаров</p>
                <p class="text-h2">{{ productsCount.count.toFixed(0) }}</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col sm="4" cols="6" class="right-header-col">
        <v-card color="deep-orange-lighten-2" height="100%" elevation="0">
          <v-card-text>
            <v-row align="center" :no-gutters="smAndDown">
              <v-col md="auto" cols="12" class="d-md-block d-flex justify-center mb-md-0 mb-1">
                <v-btn icon="mdi-account" color="cyan" class="text-white" />
              </v-col>
              <v-col cols="auto" class="flex-grow-1 text-white text-md-left text-center">
                <p class="text-sm-h5 text-h6">Всего Клиентов</p>
                <p class="text-h2">{{ clientsCount.count.toFixed(0) }}</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col sm="4" cols="6" class="right-header-col">
        <v-card color="light-blue" height="100%" elevation="0">
          <v-card-text>
            <v-row align="center" :no-gutters="smAndDown">
              <v-col md="auto" cols="12" class="d-md-block d-flex justify-center mb-md-0 mb-1">
                <v-btn icon="mdi-wallet" color="pink" class="text-white" />
              </v-col>
              <v-col cols="auto" class="flex-grow-1 text-white text-md-left text-center">
                <p class="text-sm-h5 text-h6">Всего Заказов</p>
                <p class="text-h2">{{ ordersCount.count.toFixed(0) }}</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!----Charts------>
    <v-row align="stretch" class="charts-row">
      <v-col md="4" sm="6" cols="12">
        <ProductsCount :products="userProductsStore.userProducts" />
      </v-col>
      <v-col md="4" sm="6" cols="12">
        <ProductsPrices :products="userProductsStore.userProducts"
      /></v-col>
      <v-col md="4" sm="6" cols="12">
        <CustomersPremium :customers="userCustomersStore.customers"
      /></v-col>
      <v-col md="4" sm="6" cols="12">
        <CategoryProductsCount
          :products="userProductsStore.userProducts"
          :categories="userProductsStore.productsCategories"
        />
      </v-col>

      <v-col md="8" cols="12">
        <OrdersByDateVue :orders="userOrdersStore.orders" />
      </v-col>

      <v-col cols="12">
        <ProductsInOrders
          :products="userProductsStore.userProducts"
          :orders="userOrdersStore.orders"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import { useUserProductsStore } from "@/stores/userProducts";
import { useUserCustomersStore } from "@/stores/userCustomers";
import { useUserOrdersStore } from "@/stores/userOrders";

import ProductsCount from "@/components/Charts/ProductsCount.vue";
import ProductsPrices from "@/components/Charts/ProductsPrices.vue";
import CustomersPremium from "@/components/Charts/CustomersPremium.vue";
import CategoryProductsCount from "@/components/Charts/CategoryProductsCount.vue";
import OrdersByDateVue from "@/components/Charts/OrdersByDate.vue";
import ProductsInOrders from "@/components/Charts/ProductsInOrders.vue";

import { useDisplay } from "vuetify/lib/framework.mjs";
import gsap from "@/plugins/gsap";

const { smAndDown } = useDisplay();

const userProductsStore = useUserProductsStore();
const userCustomersStore = useUserCustomersStore();
const userOrdersStore = useUserOrdersStore();

const productsCount = ref({
  count: 0
});

const clientsCount = ref({
  count: 0
});

const ordersCount = ref({
  count: 0
});

onMounted(async () => {
  if (!userProductsStore.productsCategories.length) {
    await userProductsStore.getAllProductsCategories();
  }

  gsap.from(".title", {
    x: "-300",
    opacity: 0,
    ease: "linear",
    duration: 0.5
  });

  gsap.from(".stats-header > *", {
    x: "-100%",
    stagger: 0.25,
    duration: 0.25,
    opacity: 0,
    ease: "power2.out"
  });

  gsap.from(".charts-row > *", {
    scale: 0,
    stagger: 0.35,
    duration: 0.35,
    opacity: 0,
    ease: "power3.out",
    delay: 0.85,
    scrollTrigger: {
      trigger: ".charts-row",
      start: "top 80%",
      end: "+=1000"
    }
  });

  gsap.to(productsCount.value, {
    count: userProductsStore.userProducts.length,
    duration: 2.5,
    delay: 0.25
  });

  gsap.to(clientsCount.value, {
    count: userCustomersStore.customers.length,
    duration: 2.5,
    delay: 0.5
  });

  gsap.to(ordersCount.value, {
    count: userOrdersStore.orders.length,
    duration: 2.5,
    delay: 0.75
  });
});
</script>

<style lang="scss" scoped></style>
