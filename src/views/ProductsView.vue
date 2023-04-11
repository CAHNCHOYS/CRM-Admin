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
      <TableActions
        v-model:count="elementsByPage"
        @update:count="elementsByPage = $event"
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
            <v-col sm="6" cols="12">
              <v-text-field v-model="searchName" variant="outlined" label="Название товара" />
            </v-col>
            <v-col sm="6" cols="12">
              <v-range-slider
                v-model="searchPrices"
                min="1"
                step="10"
                max="99999"
                color="blue-grey-darken-2"
                label="Цена:"
              />
            </v-col>

            <v-col cols="auto">
              <v-row>
                <v-col>
                  <v-btn
                    variant="flat"
                    color="green-darken-3"
                    @click="searchProducts"
                    :disabled="isSearchLoading"
                  >
                    Искать
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                    variant="flat"
                    color="red-darken-4"
                    @click="resetSearch"
                    :disabled="isSearchLoading"
                  >
                    Сбросить поиск
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                    variant="flat"
                    color="blue-darken-4"
                    @click="isSearchFormActive = false"
                    :disabled="isSearchLoading"
                  >
                    Закрыть
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-expand-transition>

      <div class="text-center mb-2" v-if="isProductsLoading">
        <p class="text-h6 mb-2">Идет загрузка товаров...</p>
        <v-progress-linear indeterminate height="6" color="green" />
      </div>

      <v-alert type="error" border="end" variant="tonal" v-if="productsErrorMessage">
        <v-alert-title class="mb-2 text-h5"> Ошибка при загрузке товаров </v-alert-title>
        <p class="text-h6">{{ productsErrorMessage }}</p>
      </v-alert>

      <!-------------  Таблица с товарами -------------->
      <ProductsTable
        :products-to-show="paginatedElements"
        :is-inverse-sort="isInverseSort"
        v-model:current-sort-field="currentSortValue"
        @update:current-sort-field="setSortField($event)"
        @open-product-dialog="openProductDialog"
        v-else-if="!isSearchLoading && !isProductsLoading"
      />

      <p class="text-center mb-2" v-if="isSearchLoading && !isProductsLoading">
        <v-progress-circular indeterminate size="32" color="green" />
      </p>

      <v-pagination
        :length="totalPages"
        v-model="currentPage"
        rounded="circle"
        :total-visible="7"
        color="indigo-darken-4"
        v-if="userProducts.length"
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
import { onMounted, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { useUserProductsStore } from "@/stores/userProducts";
import { useAlertStore } from "@/stores/alert";
import { useUserAuthStore } from "@/stores/userAuth";

import { handleAxiosError, isAxiosError } from "@/services/axioxErrorHandle";
import { getSearchedProducts } from "@/services/ProductService";

import { useTablePagination } from "@/composables/useTablePagination";

import ProductsTable from "@/components/Products/ProductsTable.vue";
import ProductEditDialog from "@/components/Products/ProductEditDialog.vue";
import ProductDeleteDialog from "@/components/Products/ProductDeleteDialog.vue";
import ProductAddDialog from "@/components/Products/ProductAddDialog.vue";

import type { IUserProduct } from "@/types/interfaces";

const userProductsStore = useUserProductsStore();
const alertStore = useAlertStore();
const userAuthStore = useUserAuthStore();

const { userProducts, productsErrorMessage, productsCategories, isProductsLoading } =
  storeToRefs(userProductsStore);

onMounted(async () => {
  if (!productsCategories.value.length) {
    await userProductsStore.fetchProductsCategories();
  }
  if (!userProducts.value.length) {
    await userProductsStore.getAllProducts(userAuthStore.currentUser!.id);
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
  +(route.query.endPrice as string) || 99999
]);

const searchName = ref((route.query.productName as string) || "");
const isSearchActive = ref(false);
const isSearchLoading = ref(false);

const productsBySearch = ref<IUserProduct[]>([]);

const resetSearch = () => {
  searchName.value = "";
  searchPrices.value = [1, 99999];
  router.push({ name: "products-page", query: {} });
  isSearchActive.value = false;
};

const searchProducts = () => {
  router.push({
    name: "products-page",
    query: {
      ...route.query,
      productName: searchName.value,
      startPrice: searchPrices.value[0],
      endPrice: searchPrices.value[1]
    }
  });
};

watch(
  () => route.query,
  async () => {
    console.log("Watch Called");
    if (!route.query.startPrice && !route.query.endPrice) return;
    isSearchLoading.value = true;
    const startPrice = +(route.query.startPrice as string);
    const endPrice = +(route.query.endPrice as string);
    const productName = route.query.productName as string;
    try {
      const { data } = await getSearchedProducts({
        startPrice,
        endPrice,
        productName,
        userId: userAuthStore.currentUser!.id
      });
      productsBySearch.value = data.products;
      isSearchActive.value = true;
    } catch (error) {
      if (isAxiosError(error)) {
        alertStore.showMessage("error", handleAxiosError(error));
      } else alertStore.showMessage("error", "Ошибка при поиске товара(");
    }
    isSearchLoading.value = false;
  },
  { immediate: true }
);

const getProducts = computed(() => {
  if (isSearchActive.value) return productsBySearch.value;
  else return userProducts.value;
});

//-----------------------------------------------------

//Пагинация и сортировка по выбранному полю фильтрованых товаров
const { currentPage, paginatedElements, totalPages, isInverseSort, elementsByPage, setSortField } =
  useTablePagination<IUserProduct>({
    tableElements: getProducts,
    pageName: "products-page",
    sortField: currentSortValue,
    route,
    router
  });
</script>

<style scoped></style>
