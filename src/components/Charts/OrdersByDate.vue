<template>
  <v-card width="100%" color="white" class="pa-5" elevation="5">
    <Line :data="chartData" :options="options" v-if="props.orders.length" />
    <p class="text-h6" v-else>Недостаточно данных для построения графика</p>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { Line } from "vue-chartjs";
import type { ChartData, ChartOptions } from "chart.js";
import type { IUserOrder } from "@/types/interfaces";

const props = defineProps<{
  orders: IUserOrder[];
}>();

function formatDate(str: string) {
  return str.split("-").reverse().join("-");
}

const sortedOrders = computed(() => {
  const objDate: string[] = [];
  const ordersCount: number[] = [];

  for (const order of props.orders) {
    if (!objDate.includes(order.date)) {
      const orders = props.orders.filter((ord) => ord.date === order.date);
      objDate.push(order.date);
      ordersCount.push(orders.reduce((acc, order) => acc + order.productCount, 0));
    }
  }

  return ordersCount;
});

const chartData = computed<ChartData<"line">>(() => ({
  labels: [
    ...new Set(
      props.orders
        .sort(
          (order1, order2) =>
            Date.parse(formatDate(order1.date)) - Date.parse(formatDate(order2.date))
        )
        .map((order) => order.date)
    )
  ],
  datasets: [
    {
      label: "Кол-во товаров",
      data: sortedOrders.value,
      borderColor: "#3F51B5",
      fill: false,
      borderWidth: 4
    }
  ]
}));

const options: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 0
  },

  scales: {
    y: {
      beginAtZero: false,
      suggestedMin: 0,
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
  plugins: {
    legend: {
      display: false
    },

    title: {
      display: true,
      color: "black",
      text: "Кол-во товаров в заказах",
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
canvas {
  width: 100% !important;
  min-height: 250px !important;
  max-height: 350px !important;
}
</style>
