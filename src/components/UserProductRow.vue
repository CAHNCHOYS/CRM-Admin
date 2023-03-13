<template>
  <tr>
    <td>
      {{ index + 1 }}
    </td>
    <td>
      {{ product.name }}
    </td>
    <td>
      {{ product.price }}
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
            @click="$emit('delete', product.name, product.id)"
            color="error"
            class="mr-2"
          />
        </template>
      </v-tooltip>

      <v-tooltip text="Редактировать" location="right">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="flat" icon="mdi-pencil" color="info" />
        </template>
      </v-tooltip>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { IUserProduct } from "@/types/interfaces";

const props = defineProps<{
  product: IUserProduct;
  index: number;
}>();

const emit = defineEmits<{
  (e: "delete", name: string, productId: number): void;
}>();
</script>

<style lang="scss" scoped></style>
