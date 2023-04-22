<template>
  <v-card  :max-width="'100%'" class="pa-5"  elevation="5">
    <Bar :data="chartData" :options="options" v-if="props.customers.length" />
    <p class="text-h6"  v-else>Недостаточно данных для построения графика</p>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { Bar } from "vue-chartjs";
import type { ChartData, ChartOptions } from "chart.js";
import type { IUserCustomer } from "@/types/interfaces";

const props = defineProps<{
  customers: IUserCustomer[];
}>();

const chartData = computed<ChartData<"bar">>(() => ({
  labels: ["Наличие премиума"],
  datasets: [
    {
      label: "Есть премиум",
      data: [props.customers.filter((customer) => customer.premium === "Да").length]
    },
    {
      label: "Нету премиума",
      data: [props.customers.filter((customer) => customer.premium === "Нет").length]
    }
  ]
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
      borderWidth: 4,
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

<style scoped>

canvas{
  width: 100% !important;
  min-height: 250px !important; 
}

</style>
