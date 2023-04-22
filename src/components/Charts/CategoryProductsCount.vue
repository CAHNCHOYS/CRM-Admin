<template>
  <v-card :max-width="'100%'" class="pa-5" elevation="5">
    <Bar :data="chartData" :options="options" v-if="props.products.length" />
    <p class="text-h6" v-else>Недостаточно данных для построения графика</p>
  </v-card>
</template>

<script setup lang="ts">
import { Bar } from "vue-chartjs";
import { computed } from "@vue/reactivity";

import type { IUserProduct, IUserProductCategory } from "@/types/interfaces";
import type { ChartData, ChartOptions } from "chart.js";

const props = defineProps<{
  categories: IUserProductCategory[];
  products: IUserProduct[];
}>();

const chartData = computed<ChartData<"bar">>(() => ({
  labels: ["Количество товара по категориям"],
  datasets: props.categories.map((category) => {
    return {
      label: category.name,
      data: [props.products.filter((pr) => pr.category === category.name).length]
    };
  })
}));

const options: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 0
  },
  elements: {
    bar: {
      borderRadius: 0,
      borderWidth: 4
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      grid: {
        display: false
      }
    }
  },

  plugins: {
    legend: {
      display: true,
      position: "bottom"
    },
    title: {
      display: true,
      color: "black",
      text: "Количество товаров по категориям",
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

<style scoped>

canvas{ 
  width: 100% !important;
  min-height: 250px !important;
}
</style>
