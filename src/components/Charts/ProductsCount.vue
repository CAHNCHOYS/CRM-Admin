<template>
  <v-card :max-width="500">
    <Doughnut  :data="chartData" :options="options"></Doughnut>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { Chart } from "chart.js";
import { onMounted } from "vue";
import { date } from "yup";
import { Doughnut, Bar } from "vue-chartjs";



import type { ChartData } from "chart.js";


const props = defineProps<{
  data: number[];
  labels: string[];
}>();

const data = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 205, 86)"],
      data: props.data,
      hoverOffset: 6
    }
  ]
}));

const options = {
  responsive: true,
  maintainAspectRatio: true,
}


const chartData = computed<ChartData<"doughnut">>(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.data,
      backgroundColor: [],
      hoverOffset: 4
    }
  ]
}));
</script>

<style scoped></style>
