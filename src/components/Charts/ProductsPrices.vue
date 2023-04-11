<template>
  <v-card :max-width="'100%'" elevation="10">
    <Doughnut :data="data" :options="options" />
  </v-card>
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions } from "chart.js";
import { Doughnut, Bar } from "vue-chartjs";

const props = defineProps<{
  data: ChartData<"doughnut">;
}>();

const options: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: true,
  
  layout: {
    padding: 25
  },
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      color: "black",
      text: "Цены товаров",
      padding: {
        bottom: 20
      },
      font: {
        size: 26,
        weight: "normal"
      }
    },
    tooltip: {
      
    }
  }
};
</script>

<style scoped></style>
