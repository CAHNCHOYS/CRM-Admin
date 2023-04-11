<template>
  <v-row class="mb-8" align="center" no-gutters>
    <v-col class="flex-grow-1">
      <div class="text-sm-h4 text-h6"><slot></slot></div>
    </v-col>
    <v-col cols="6" sm="2" class="order-sm-2 order-3 mx-2">
      <v-select
        label="Элементов на странице"
        variant="underlined"
        :model-value="count"
        :clearable="false"
        :items="[10, 15, 20, 30, 50]"
        @update:model-value="$emit('update:count', $event)"
      >
      </v-select>
    </v-col>
    <v-col cols="auto" class="order-sm-3 order-2 d-flex align-center" >
      <v-badge :dot="true" color="error" offset-x="10" :offset-y="3" :model-value="isBadgeActive">
        <v-btn @click="$emit('toggleSearch')" icon="mdi-magnify" color="teal" class="mr-1"></v-btn>
      </v-badge>

      <v-btn @click="$emit('toggleAddDialog')" icon="mdi-plus" color="green"></v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps<{
  count: number;
  isBadgeActive: boolean;
}>();

const emit = defineEmits<{
  (e: "update:count", count: number): void;
  (e: "toggleSearch"): void;
  (e: "toggleAddDialog"): void;
}>();
</script>

<style scoped></style>
