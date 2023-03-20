<template>
  <div>
    <v-snackbar
      v-model="isMessageShown"
      location="right bottom"
      :max-width="500"
      :color="messageType"
    >
      <p class="text-h6">{{ messageText }}</p>
    </v-snackbar>

    <div class="title text-h2 mb-5">Товары</div>

    <v-card color="white" elevation="3" class="pa-5 mb-6 rounded-lg mx-sm-0 mx-n5">
      <TableActions
        v-model:count="productsByPage"
        @update:count="productsByPage = $event"
        @toggle-add-dialog="isAddDialogActive = true"
        @toggle-search="isSearchFormActive = !isSearchFormActive"
      >
        Все товары({{ userProducts.length }})
      </TableActions>

      <div v-if="isProductsFetching">
        <div class="text-center mb-3 text-h6">Идет загрузка...</div>
        <v-progress-linear color="green" height="4" indeterminate />
      </div>

      <v-expand-transition>
        <ProductsSearchForm
          v-model:search-name="searchName"
          v-model:search-prices="searchPrices"
          @update:search-name="searchName = $event"
          @update:search-prices="searchPrices = $event"
          @close="isSearchFormActive = false"
          @reset-search="resetSearch"
          v-if="isSearchFormActive"
          class="mb-8"
        />
      </v-expand-transition>

      <v-table density="comfortable" v-if="userProducts.length">
        <thead class="h-auto">
          <tr class="d-none d-sm-table-row">
            <th
              v-for="item in tableSortFields"
              :key="item.text"
              class="text-left text-h6"
              @click="setSortField(item.field)"
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
              v-model="currentSortValue"
              variant="underlined"
              label="Сортировать по"
              :items="tableSortFields"
              item-title="text"
              item-value="field"
            >
            </v-select>
          </div>
        </thead>
        <tbody v-if="paginatedProducts.length">
          <TransitionGroup
            appear
            name="list"
          >
            <UserProductRow
              v-for="(item, index) in paginatedProducts"
              :product="item"
              :key="item.id"
              @open-dialog="openProductDialog"
              :data-index="index"
            />
          </TransitionGroup>
        </tbody>
        <tbody v-else>
          <tr>
            <td class="py-2 text-h6 text-center font-weight-bold" colspan="12">
              Не удалось найти ни одного товара по заданным фильтрам(
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-alert type="error" border="end" variant="tonal" v-if="isProductsError">
        <v-alert-title class="mb-2"> Ошибка при загрузке товаров </v-alert-title>
        <p>{{ loadErrorMessage }}</p>
      </v-alert>

      <p class="text-h6" v-else-if="userProducts.length === 0 && !isProductsFetching">
        Пока в таблице нет товаров, добавьте хоть один
      </p>

      <v-pagination
        :length="totalPages"
        v-model="currentPage"
        rounded="circle"
        :total-visible="7"
        color="primary"
      />
    </v-card>

    <ProductEditDialog
      v-if="productToEdit"
      :product="productToEdit"
      @close-modal="isEditDialogActive = false"
      :is-active="isEditDialogActive"
    />
    <ProductDeleteDialog
      v-if="productToEdit"
      :is-active="isDeleteDialogActive"
      :product="productToEdit"
      @close-modal="isDeleteDialogActive = false"
    />

    <ProductAddDialog @close-modal="isAddDialogActive = false" :is-active="isAddDialogActive" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserProductsStore } from "@/stores/userProducts";
import { useAlertStore } from "@/stores/alert";
import { useTablePagination } from "@/composables/useTablePagination";
import { useListAnimations } from "@/composables/useListAnimtaions";
import { useProductsFilter } from "@/composables/useProductsFilter";

import UserProductRow from "@/components/Products/UserProductRow.vue";
import ProductEditDialog from "@/components/Products/ProductEditDialog.vue";
import ProductDeleteDialog from "@/components/Products/ProductDeleteDialog.vue";
import ProductAddDialog from "@/components/Products/ProductAddDialog.vue";
import ProductsSearchForm from "@/components/Products/ProductsSearchForm.vue";

import type { IUserProduct } from "@/types/interfaces";

const userProductsStore = useUserProductsStore();
const alertStore = useAlertStore();

const { userProducts, loadErrorMessage, isProductsFetching, isProductsError } =
  storeToRefs(userProductsStore);
const { isMessageShown, messageText, messageType } = storeToRefs(alertStore);

onMounted(async () => {
  if (!userProducts.value.length) {
    await userProductsStore.fetchUserProducts();
  }
});

//Заголвки  в шапке таблице и используются  для сортировки по полю
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

//Поле по которому сортируется по умолчанию
const currentSortValue = ref<keyof IUserProduct>(tableSortFields.value[0].field);

const isDeleteDialogActive = ref(false);
const isAddDialogActive = ref(false);
const isEditDialogActive = ref(false);
const isSearchFormActive = ref(false);

const productToEdit = ref<IUserProduct | null>(null);

const openProductDialog = (product: IUserProduct, dialogName: "edit" | "delete") => {
  console.log(dialogName);
  productToEdit.value = product;
  if (dialogName === "delete") isDeleteDialogActive.value = true;
  else if (dialogName === "edit") {
    isEditDialogActive.value = true;
  }
};
//Фильтрованые товары
const { filteredProducts, searchName, searchPrices, resetSearch } = useProductsFilter(userProducts);

//Пагинация и сортировка по выбранному полю фильтрованых товаров
const { currentPage, paginatedProducts, totalPages, isInverseSort, productsByPage, setSortField } =
  useTablePagination<IUserProduct>(filteredProducts, currentSortValue);

//Анимация с gsap
const { beforeEnter, enter, afterEnter, leave } = useListAnimations();
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
