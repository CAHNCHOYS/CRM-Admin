<template>
  <v-form>
    <v-row align="center">
      <v-col sm="6" cols="12">
        <v-text-field
          v-model="searchName"
          @update:model-value="$emit('update:searchName', searchName)"
          variant="outlined"
          label="Название товара"
        />
      </v-col>
      <v-col sm="6" cols="12">
        <v-range-slider
          v-model="searchPrices"
          thumb-label="always"
          min="1"
          step="10"
          max="999999"
          strict
          color="blue-grey-darken-2"
          label="Цена:"
          hide-details="auto"
          @update:model-value="$emit('update:searchPrices', searchPrices)"
        />
      </v-col>

      <v-col cols="auto">
        <v-row>
          <v-col>
            <v-btn variant="flat"  color="red-darken-4" @click="reset">
              Сбросить поиск
            </v-btn>
          </v-col>
          <v-col>
            <v-btn variant="flat" color="blue-darken-4" @click="$emit('close')"> Закрыть поиск </v-btn>
          </v-col>
        </v-row>


       
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  searchName: string;
  searchPrices: [number, number];
}>();

const emit = defineEmits<{
  (e: "update:searchName", value: string): void;
  (e: "update:searchPrices", value: [number, number]): void;
  (e: "resetSearch"): void;
  (e: "close"): void;
}>();

const searchName = ref(props.searchName);
const searchPrices = ref(props.searchPrices);

const reset = () => {
  searchName.value = "";
  searchPrices.value = [1, 999999];
  emit("resetSearch");
};
</script>

<style scoped></style>
