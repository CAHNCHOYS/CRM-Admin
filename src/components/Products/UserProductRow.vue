<template>
  <tr class="d-sm-table-row d-block">
    <td class="d-sm-table-cell d-flex justify-space-between h-auto pa-0 py-2">
      <div class="d-sm-none d-block font-weight-bold pr-1">Название:</div>
       <div class="text-sm-left text-right"> {{ product.name }}</div>
    </td>
    <td class="d-sm-table-cell d-flex justify-space-between h-auto pa-0 py-2">
      <div class="d-sm-none d-block font-weight-bold pr-1">Цена:</div>
      {{ product.price }}₽
    </td>

    <td class="d-sm-table-cell d-flex justify-space-between h-auto pa-0 py-2">
      <div class="d-sm-none d-block font-weight-bold pr-1">Кол-во:</div>
      {{ product.count }}
    </td>
    <td class="d-sm-table-cell d-flex justify-space-between h-auto pa-0 py-2">
      <div class="d-sm-none d-block font-weight-bold pr-1">Категория:</div>
      {{ product.category }}
    </td>

    <td class="d-sm-table-cell d-flex justify-end h-auto pa-0 py-2">
      <div class="d-flex flex-wrap">
        <v-tooltip text="Удалить" location="left" no-click-animation>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="flat"
              icon="mdi-trash-can"
              @click="$emit('openDialog', product, 'delete')"
              color="error"
              class="mr-2"
            />
          </template>
        </v-tooltip>

        <v-tooltip text="Редактировать" location="right" no-click-animation>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="flat"
              icon="mdi-pencil"
              color="info"
              @click="$emit('openDialog', product, 'edit')"
            />
          </template>
        </v-tooltip>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { IUserProduct } from "@/types/interfaces";

const props = defineProps<{
  product: IUserProduct;
}>();

const emit = defineEmits<{
  (e: "openDialog", product: IUserProduct, dialogName: "edit" | "delete"): void;
}>();
</script>

<style lang="scss" scoped>
@media (max-width: 600px) {
  td {
    border-bottom: unset !important;
  }
  tr {
    border-bottom: 1px solid lightgray !important;
  }
}
</style>
