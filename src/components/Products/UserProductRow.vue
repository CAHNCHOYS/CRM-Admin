<template>
  <tr>
 
    <td>
      {{ product.name }}
    </td>
    <td>
      {{ product.price }}₽
    </td>

    <td>
      {{ product.count }}
    </td>
    <td>
      {{ product.category }}
    </td>

    <td class="py-4">
      <v-tooltip text="Удалить" location="left">
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

      <v-tooltip text="Редактировать" location="right">
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
  (e: "openDialog", product: IUserProduct, dialogName: "edit" | "delete"): void;
}>();
</script>

<style lang="scss" scoped></style>
