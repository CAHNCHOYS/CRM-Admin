<template>
  <v-row class="mb-8" align="center" no-gutters>
    <v-col   class="flex-grow-1">
      <div class="text-sm-h4 text-h6"><slot></slot></div>
    </v-col>
    <v-col cols="6" sm="2" class="order-sm-2 order-3 mx-2" >
      <v-select
        label="Элементов на странице"
        variant="underlined"
   
        v-model="count"
        :clearable="false"
        :items="[10, 15, 20, 30, 50]"
        @update:model-value="$emit('updateProductsByPageCount', count)"
      >
      </v-select>
    </v-col>
    <v-col  cols="auto" class="order-sm-3 order-2">
      <v-btn icon="mdi-magnify" color="teal" class="mr-1"></v-btn>
      <v-btn icon="mdi-plus" @click="$emit('toggleAddDialog')" color="green"></v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  modelValue: number;
}>();

const emit = defineEmits<{
  (e: "updateProductsByPageCount", count: number): void;
  (e: "toggleSearch"): void;
  (e: "toggleAddDialog"): void;
}>();

const count = ref(props.modelValue);




</script>

<style scoped></style>
