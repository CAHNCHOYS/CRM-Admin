<template>
  <div>
    <v-table density="comfortable">
      <thead class="h-auto">
        <tr class="d-none d-sm-table-row">
          <th
            v-for="item in tableSortFields"
            :key="item.text"
            class="text-left text-h6"
            @click="$emit('update:currentSortValue', item.field)"
          >
            <v-hover v-slot="{ isHovering, props }">
              <p v-bind="props">
                {{ item.text }}
                <v-icon
                  style="position: absolute"
                  :icon="
                    isInverseSort && currentSortValue == item.field
                      ? 'mdi-arrow-up-thin'
                      : 'mdi-arrow-down-thin'
                  "        
                  v-show="currentSortValue === item.field || isHovering"
                  :style="{ opacity: isHovering && currentSortValue != item.field ? 0.6 : 1 }"
                ></v-icon>
              </p>
            </v-hover>
          </th>

          <th class="text-left text-h6">Действия</th>
        </tr>

        <div class="d-sm-none d-block mb-2">
          <v-select
            v-model="sortField"
            @update:model-value="$emit('update:currentSortValue', sortField)"
            variant="underlined"
            label="Сортировать по"
            :items="tableSortFields"
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
            Не удалось найти ни одного товара по заданным фильтрам(
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
  currentSortValue: keyof IUserProduct;
}>();

const emit = defineEmits<{
  (e: "update:currentSortValue", field: keyof IUserProduct): void;
  (e: "openProductDialog", product: IUserProduct, type: "edit" | "delete"): void;
}>();

const sortField = ref(props.currentSortValue);

const tableSortFields = ref<
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
.list-enter-active,
.list-move-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translate(0, -50%);
}

.list-enter-to {
  opacity: 1;
  transform: translate(0);
}

.list-leave-to {
  opacity: 0;
  transform: translate(0, 50%);
}
</style>
