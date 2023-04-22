<template>
  <v-card color="white" class="pa-5" elevation="5">
    <Bar :data="chartData" :options="chartOptions" v-if="props.orders.length" />
    <p class="text-h6" v-else>Недостаточно данных для построения графика</p>
  </v-card>
</template>

<script setup lang="ts">
import { Bar } from "vue-chartjs";

import type { IUserOrder, IUserProduct } from "@/types/interfaces";
import type { ChartData, ChartOptions } from "chart.js";
import { computed } from "@vue/reactivity";

const props = defineProps<{
  products: IUserProduct[];
  orders: IUserOrder[];
}>();

const chartData = computed<ChartData<"bar">>(() => {
  return {
    labels: ["Товары"],
    datasets: props.products.map((product) => {
      return {
        label: product.name,
        data: [props.orders.filter((order) => order.productId === product.id).length]
      };
    })
  };
});

const chartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: false
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  layout: {
    padding: 0
  },
  elements: {
    bar: {
      borderWidth: 4,
      borderRadius: 0
    }
  },

  plugins: {
    title: {
      display: true,
      text: "Сколько раз был заказан какой товар",
      padding: {
        bottom: 20
      },
      font: {
        size: 20,
        weight: "bold"
      }
    },
    legend: {
      display: false
    }
  }
};
</script>

<style scoped>
canvas {
  width: 100% !important;
  min-height: 200px !important;
  max-height: 350px !important;
}
</style>
