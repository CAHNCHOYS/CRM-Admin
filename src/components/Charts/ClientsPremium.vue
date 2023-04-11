<template>
  <v-card  :max-width="'100%'" elevation="10">
    <Bar :data="data" :options="options"></Bar>
  </v-card>
</template>

<script setup lang="ts">
import { Bar } from "vue-chartjs";
import type { ChartData, ChartOptions } from "chart.js";

const props = defineProps<{
  data: ChartData<"bar">;
}>();

const options: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: true,
  layout: {
    padding: 25
  },
  elements: {
    bar: {
      borderRadius: 10,
      borderWidth: 2
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      suggestedMin: 0,
    }
  },
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      title : {
         
      }
    },
    title: {
      display: true,
      color: "black",
      text: "Премиум у клиентов",
      padding: {
        bottom: 20
      },
      font: {
        size: 26,
        weight: "normal"
      }
    }
  }
};
</script>

<style scoped></style>
