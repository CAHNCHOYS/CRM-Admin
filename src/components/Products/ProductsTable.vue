<template>
  <div>
    <v-table density="comfortable">
      <thead class="h-auto">
        <tr class="d-sm-table-row d-none">
          <th
            v-for="item in tableHeaders"
            :key="item.text"
            class="text-h6 pa-0 pr-3 font-weight-bold text-black"
            @click="$emit('update:currentSortField', item.field)"
          >
            <v-hover v-slot="{ isHovering, props }">
              <p v-bind="props">
                {{ item.text }}
                <v-icon
                  style="position: absolute"
                  :icon="
                    isInverseSort && currentSortField == item.field
                      ? 'mdi-arrow-up-thin'
                      : 'mdi-arrow-down-thin'
                  "
                  v-show="currentSortField === item.field || isHovering"
                  :style="{ opacity: isHovering && currentSortField != item.field ? 0.6 : 1 }"
                ></v-icon>
              </p>
            </v-hover>
          </th>

          <th class="text-h6 pa-0 pb-3 font-weight-bold text-black">Действия</th>
        </tr>

        <div class="d-sm-none d-block mb-2">
          <v-select
            :model-value="currentSortField"
            @update:model-value="$emit('update:currentSortField', $event)"
            variant="underlined"
            label="Сортировать по"
            :items="tableHeaders"
            item-title="text"
            item-value="field"
          />
        </div>
      </thead>
      <tbody v-if="productsToShow.length">
        <transition-group appear @enter="elementEnter" @leave="elementLeave">
          <UserProductRow
            v-for="(item, index) in productsToShow"
            :product="item"
            :key="item.id"
            @open-dialog="openDialog"
            :data-index="index"
          />
        </transition-group>
      </tbody>
      <tbody v-else>
        <tr>
          <td class="py-2 text-h6 text-center font-weight-bold" colspan="12">
            Товары не найдены ( 
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useListAnimations } from "@/composables/useListAnimtaions";
import UserProductRow from "@/components/Products/UserProductRow.vue";
import type { IUserProduct } from "@/types/interfaces";

const props = defineProps<{
  productsToShow: IUserProduct[];
  isInverseSort: boolean;
  currentSortField: keyof IUserProduct;
}>();

const emit = defineEmits<{
  (e: "update:currentSortField", field: keyof IUserProduct): void;
  (e: "openProductDialog", product: IUserProduct, type: "edit" | "delete"): void;
}>();

const tableHeaders = ref<
  {
    text: string;
    field: keyof IUserProduct;
  }[]
>([
  {
    text: "Имя",
    field: "name"
  },
  {
    text: "Цена(руб)",
    field: "price"
  },
  {
    text: "Кол-во",
    field: "count"
  },
  {
    text: "Категория",
    field: "category"
  }
]);

const openDialog = (product: IUserProduct, dialog: "edit" | "delete") => {
  emit("openProductDialog", product, dialog);
};

const { elementEnter, elementLeave } = useListAnimations();
</script>

<style scoped>

</style>
