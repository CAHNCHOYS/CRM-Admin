<template>
  <div>
    <v-snackbar
      v-model="alertStore.isMessageShown"
      :max-width="500"
      :color="alertStore.messageType"
    >
      <p class="text-h6">{{ alertStore.messageText }}</p>
    </v-snackbar>

    <div class="title text-h2 mb-5">Товары</div>

    <v-card color="white" elevation="3" class="pa-5 mb-6 rounded-lg mx-sm-0 mx-n5">
      <TableActions
        v-model:count="productsByPage"
        @update:count="productsByPage = $event"
        @toggle-add-dialog="isAddDialogActive = true"
        @toggle-search="isSearchFormActive = !isSearchFormActive"
      >
        Все товары({{ filteredProducts.length }})
      </TableActions>

      

      <!------------- Форма поиска -------------->
      <v-expand-transition>
        <v-form v-if="isSearchFormActive" class="mb-8">
          <v-row align="center">
            <v-col sm="6" cols="12">
              <v-text-field v-model="searchName" variant="outlined" label="Название товара" />
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
              />
            </v-col>

            <v-col cols="auto">
              <v-row>
                <v-col>
                  <v-btn variant="flat" color="red-darken-4" @click="resetSearch">
                    Сбросить поиск
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn variant="flat" color="blue-darken-4" @click="isSearchFormActive = false">
                    Закрыть поиск
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-expand-transition>

      <div v-if="isProductsLoading">
        <div class="mb-3 text-h6">Идет загрузка...</div>
        <v-progress-linear color="green" height="4" indeterminate />
      </div>
      
      <!-------------  Таблица с товарами -------------->
      <ProductsTable
        :products-to-show="paginatedProducts"
        :is-inverse-sort="isInverseSort"
        v-model:current-sort-value="currentSortValue"
        @update:current-sort-value="setSortField($event)"
        @open-product-dialog="openProductDialog"
        v-if="userProducts.length"
      />

      <v-alert type="error" border="end" variant="tonal" v-if="productsErrorMessage">
        <v-alert-title class="mb-2"> Ошибка при загрузке товаров </v-alert-title>
        <p>{{ productsErrorMessage }}</p>
      </v-alert>

      <p class="text-h6" v-else-if="userProducts.length === 0 && !isProductsLoading">
        Пока в таблице нет товаров, добавьте хоть один
      </p>

      <v-pagination
        :length="totalPages"
        v-model="currentPage"
        rounded="circle"
        :total-visible="7"
        color="indigo-darken-4"
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
import { useProductsFilter } from "@/composables/useProductsFilter";

import ProductsTable from "@/components/Products/ProductsTable.vue";
import ProductEditDialog from "@/components/Products/ProductEditDialog.vue";
import ProductDeleteDialog from "@/components/Products/ProductDeleteDialog.vue";
import ProductAddDialog from "@/components/Products/ProductAddDialog.vue";

import type { IUserProduct } from "@/types/interfaces";

const userProductsStore = useUserProductsStore();
const alertStore = useAlertStore();

const { userProducts,  isProductsLoading, productsErrorMessage } =
  storeToRefs(userProductsStore);

onMounted(async () => {
  if (!userProducts.value.length) {
    await userProductsStore.fetchUserProducts();
  }
  await userProductsStore.fetchProductsCategories();
});

//Поле по которому сортируется по умолчанию
const currentSortValue = ref<keyof IUserProduct>("name");

const isDeleteDialogActive = ref(false);
const isAddDialogActive = ref(false);
const isEditDialogActive = ref(false);
const isSearchFormActive = ref(false);

const productToEdit = ref<IUserProduct | null>(null);

const openProductDialog = (product: IUserProduct, dialogName: "edit" | "delete") => {
  console.log(dialogName);
  productToEdit.value = product;
  console.log(productToEdit.value);
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


</script>

<style scoped>

</style>
