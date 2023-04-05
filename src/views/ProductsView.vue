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
        v-model:count="elementsByPage"
        @update:count="elementsByPage = $event"
        @toggle-add-dialog="isAddDialogActive = true"
        @toggle-search="isSearchFormActive = !isSearchFormActive"
      >
        Все товары
      </TableActions>

      <div v-if="isProductsLoading">
        <div class="mb-3 text-h6">Идет загрузка...</div>
        <v-progress-linear color="green" height="4" indeterminate />
      </div>

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

      <!-------------  Таблица с товарами -------------->
      <ProductsTable
        :products-to-show="paginatedElements"
        :is-inverse-sort="isInverseSort"
        v-model:current-sort-field="currentSortValue"
        @update:current-sort-field="setSortField($event)"
        @open-product-dialog="openProductDialog"
        v-if="!productsErrorMessage"
      />

      <v-alert type="error" border="end" variant="tonal" v-if="productsErrorMessage">
        <v-alert-title class="mb-2 text-h5"> Ошибка при загрузке товаров </v-alert-title>
        <p class="text-h6">{{ productsErrorMessage }}</p>
      </v-alert>

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
import { onMounted, ref, watchEffect, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { useUserProductsStore } from "@/stores/userProducts";
import { useAlertStore } from "@/stores/alert";
import { useUserAuthStore } from "@/stores/userAuth";

import { useTablePagination } from "@/composables/useTablePagination";

import ProductsTable from "@/components/Products/ProductsTable.vue";
import ProductEditDialog from "@/components/Products/ProductEditDialog.vue";
import ProductDeleteDialog from "@/components/Products/ProductDeleteDialog.vue";
import ProductAddDialog from "@/components/Products/ProductAddDialog.vue";

import type { IUserProduct } from "@/types/interfaces";

const userProductsStore = useUserProductsStore();
const userAuthStore = useUserAuthStore();
const alertStore = useAlertStore();

const { userProducts, isProductsLoading, productsErrorMessage, productsCategories } =
  storeToRefs(userProductsStore);

onMounted(async () => {
  if (!userProducts.value.length) {
    await userProductsStore.getAllProducts(userAuthStore.currentUser!.id);
  }
  if (!productsCategories.value.length) {
    await userProductsStore.fetchProductsCategories();
  }
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
const route = useRoute();
const router = useRouter();

//Поиск ------------------------------------------

const searchPrices = ref<[number, number]>([
  +(route.query.startPrice as string) || 1,
  +(route.query.endPrice as string) || 999999
]);
const searchName = ref((route.query.name as string) || "");

const filteredProducts = computed(() => {
  return userProducts.value.filter(
    (product) =>
      product.price > searchPrices.value[0] &&
      product.price < searchPrices.value[1] &&
      product.name.toLowerCase().includes(searchName.value.toLowerCase())
  );
});

const resetSearch = () => {
  searchName.value = "";
  searchPrices.value = [1, 999999];
};

watchEffect((onIvalidate) => {
  const name = searchName.value;
  const startPrice = searchPrices.value[0];
  const endPrice = searchPrices.value[1];

  const timeout = setTimeout(() => {
    router.push({
      name: "products-page",
      query: {
        ...route.query,
        name,
        startPrice,
        endPrice
      }
    });
  }, 800);

  onIvalidate(() => {
    clearInterval(timeout);
  });
});
//-----------------------------------------------------

//Пагинация и сортировка по выбранному полю фильтрованых товаров
const { currentPage, paginatedElements, totalPages, isInverseSort, elementsByPage, setSortField } =
  useTablePagination<IUserProduct>({
    tableElements: filteredProducts,
    pageName: "products-page",
    sortField: currentSortValue,
    route,
    router
  });
</script>

<style scoped></style>
