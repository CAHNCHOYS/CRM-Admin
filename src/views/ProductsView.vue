<template>
  <div v-if="userAuthStore.currentUser">
    <v-snackbar
      v-model="alertStore.isMessageShown"
      :max-width="500"
      :color="alertStore.messageType"
    >
      <p class="text-h6">{{ alertStore.messageText }}</p>
    </v-snackbar>

    <h2 class="title text-h2 mb-5">Товары</h2>

    <v-card color="white" elevation="3" class="pa-5 mb-6 rounded-lg mx-sm-0 mx-n5">
      <v-card-title class="pa-0" v-if="!productsErrorMessage">
        <TableActions
          v-model:count="elementsPerPageCount"
          @toggle-add-dialog="isAddDialogActive = true"
          @toggle-search="isSearchFormActive = !isSearchFormActive"
          :is-badge-active="$route.query.startPrice ? true : false"
        >
          Все товары
        </TableActions>

        <!------------- Форма поиска -------------->
        <v-expand-transition>
          <v-form v-if="isSearchFormActive" class="mb-8">
            <v-row align="center">
              <v-col sm="6" cols="12" class="mb-sm-0 mb-2">
                <v-text-field v-model="searchName" variant="outlined" label="Название товара" />
              </v-col>
              <v-col sm="6" cols="12" class="pr-7">
                <v-range-slider
                  v-model="searchPrices"
                  min="1"
                  step="10"
                  max="99999"
                  color="blue-grey-darken-2"
                  label="Цена:"
                />
              </v-col>

              <v-col sm="auto" cols="12">
                <v-row>
                  <v-col sm="auto" cols="6">
                    <v-btn
                      variant="flat"
                      color="green-darken-3"
                      @click="addSearchQuery"
                      :disabled="isSearchLoading"
                      block
                    >
                      Искать
                    </v-btn>
                  </v-col>
                  <v-col sm="auto" cols="6">
                    <v-btn
                      variant="flat"
                      color="red-darken-4"
                      @click="resetSearch"
                      :disabled="isSearchLoading"
                      block
                    >
                      <span class="text-wrap"> Сбросить поиск</span>
                    </v-btn>
                  </v-col>
                  <v-col sm="auto" cols="12">
                    <v-btn
                      variant="flat"
                      color="blue-darken-4"
                      @click="isSearchFormActive = false"
                      :disabled="isSearchLoading"
                      block
                    >
                      Закрыть
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-expand-transition>
      </v-card-title>

      <v-alert type="error" border="end" variant="tonal" v-if="productsErrorMessage">
        <v-alert-title class="mb-2 text-h5"> Ошибка при загрузке товаров </v-alert-title>
        <p class="text-h6">{{ productsErrorMessage }}</p>
      </v-alert>

      <!-------------  Таблица с товарами -------------->
      <ElementsTable
        :items="paginatedProducts"
        :fields="tableFields"
        :current-sort-field="currentSortField"
        @update-sort-field="(field)=> setSortField(field as keyof IUserProduct)"
        :is-inverse-sort="isInverseSort"
        no-data-text="Товары не найдены"
    
        @open-dialog="(product, type)=> openDialog(product as IUserProduct, type)"
        v-else-if="!isSearchLoading"
      />

      <v-sheet class="text-center mb-2" v-if="isSearchLoading">
        <v-progress-circular indeterminate size="48" color="green" />
      </v-sheet>

      <v-pagination
        :length="totalPages"
        v-model="currentPage"
        rounded="circle"
        :total-visible="7"
        color="indigo-darken-4"
        v-if="getProducts.length"
      />
    </v-card>

    <ProductEditDialog
      v-if="productToEdit"
      :product="productToEdit"
      @close-modal="isEditDialogActive = false"
      :is-active="isEditDialogActive"
      :is-search-active="isSearchActive"
      @update-search-products="searchUserProducts"
    />

    <ProductDeleteDialog
      v-if="productToEdit"
      :is-active="isDeleteDialogActive"
      :product="productToEdit"
      @close-modal="isDeleteDialogActive = false"
      :is-search-active="isSearchActive"
      @update-search-products="searchUserProducts"
    />

    <ProductAddDialog @close-modal="isAddDialogActive = false" :is-active="isAddDialogActive" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { useUserProductsStore } from "@/stores/userProducts";
import { useAlertStore } from "@/stores/alert";
import { useUserAuthStore } from "@/stores/userAuth";

import { useTablePagination } from "@/composables/useTablePagination";
import { useDialogActions } from "@/composables/useDialogActions";
import { useProductsSearch } from "@/composables/useProductsSearch";

import ElementsTable from "@/components/ElementsTable.vue";
import ProductEditDialog from "@/components/Products/ProductEditDialog.vue";
import ProductDeleteDialog from "@/components/Products/ProductDeleteDialog.vue";
import ProductAddDialog from "@/components/Products/ProductAddDialog.vue";

import type { IUserProduct } from "@/types/interfaces";

const userProductsStore = useUserProductsStore();
const alertStore = useAlertStore();
const userAuthStore = useUserAuthStore();

const tableFields = ref<
  {
    fieldText: string;
    fieldName: keyof IUserProduct;
  }[]
>([
  {
    fieldText: "Имя",
    fieldName: "name"
  },
  {
    fieldText: "Цена(руб)",
    fieldName: "price"
  },
  {
    fieldText: "Кол-во",
    fieldName: "count"
  },
  {
    fieldText: "Категория",
    fieldName: "category"
  }
]);
const currentSortField = ref<keyof IUserProduct>("name");

const { userProducts, productsErrorMessage, productsCategories } = storeToRefs(userProductsStore);

onMounted(async () => {
  if (!productsCategories.value.length) {
    userProductsStore.getAllProductsCategories();
  }
});

//Работа с диалогами --------------------------------------------------------
const {
  itemToEdit: productToEdit,
  isAddDialogActive,
  isEditDialogActive,
  isDeleteDialogActive,
  openDialog
} = useDialogActions<IUserProduct>();

//---------------------------------------------------------------------------

const route = useRoute();
const router = useRouter();

//Поиск ------------------------------------------

const {
  searchName,
  searchPrices,
  searchedProducts,
  isSearchActive,
  isSearchLoading,
  isSearchFormActive,
  
  resetSearch,
  addSearchQuery,
  searchUserProducts
} = useProductsSearch(route, router, userAuthStore.currentUser!.id);

const getProducts = computed(() => {
  if (isSearchActive.value) return searchedProducts.value;
  else return userProducts.value;
});
//-----------------------------------------------------

//Пагинация и сортировка по выбранному полю фильтрованых товаров
const {
  currentPage,
  paginatedElements: paginatedProducts,
  totalPages,
  isInverseSort,
  elementsPerPageCount,
  setSortField
} = useTablePagination<IUserProduct>({
  tableElements: getProducts,
  pageName: "products-page",
  sortField: currentSortField,
  route,
  router
});
</script>

<style scoped></style>
