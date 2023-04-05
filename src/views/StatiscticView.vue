<template>
  <div>
    Statistioc

    <v-btn id="activate" icon="mdi-pencil" variant="flat" color="pink"> </v-btn>

    <v-menu :close-on-content-click="false" activator="#activate" location="top left">
      <v-list class="pa-0">
        <v-list-item v-for="n in 5" :key="n" :value="n">
          <v-list-item-title> {{ "MenuItem" + n }} </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>


    <ProductsCount :labels="productCountChartLabels" :data="productCountChartData"></ProductsCount>
 

  </div>
</template>

<script setup lang="ts">
import Chart from "chart.js/auto";
import { onMounted } from "vue";
import { ref, computed } from "vue";

import { useUserProductsStore } from "@/stores/userProducts";
import {useUserAuthStore} from "@/stores/userAuth";
import { useUserClientsStore } from "@/stores/userClients";

import ProductsCount from "@/components/Charts/ProductsCount.vue";



const userAuthStore = useUserAuthStore();
const userProductsStore = useUserProductsStore();
const userClientsStore = useUserClientsStore();

onMounted(async ()=>{
   if(!userProductsStore.userProducts.length){
    await userProductsStore.getAllProducts(userAuthStore.currentUser!.id);
   }
   if(!userClientsStore.clients.length){
    await userClientsStore.getAllClients(userAuthStore.currentUser!.id);
   }

});

const productCountChartData = computed(()=>{
  return userProductsStore.userProducts.map((pr)=> pr.count);
});
const productCountChartLabels = computed(()=>{
  return userProductsStore.userProducts.map((pr)=> pr.name);
});



</script>

<style lang="scss" scoped></style>
