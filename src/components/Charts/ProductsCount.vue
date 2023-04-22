<template>
  <v-card :max-width="'100%'" elevation="5" class="pa-5">
    <Doughnut :data="chartData" :options="options" v-if="props.products.length" />
    <p class="text-h6" v-else>Недостаточно данных для построения графика</p>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { Doughnut } from "vue-chartjs";

import type { ChartData, ChartOptions } from "chart.js";
import type { IUserProduct } from "@/types/interfaces";

const props = defineProps<{
  products: IUserProduct[];
}>();

const chartData = computed<ChartData<"doughnut">>(() => ({
  labels: props.products.map((pr) => pr.name),
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
        "#004D40",
        "#AFB42B",
        "#AD1457",
        "#9E9E9E"
      ],
      data: props.products.map((pr) => pr.count),
      hoverOffset: 4
    }
  ]
}));

const options: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 0
  },
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      color: "black",
      text: "Количество каждого товара",
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

<style lang="scss" scoped>
canvas {
  width: 100% !important;
  min-height: 200px !important;
  max-height: 400px;
  @media (max-width: 479.98px) {
    max-height: 250px;
  }
}
</style>
