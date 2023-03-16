<template>
  <div>
    <v-snackbar
      v-model="isActionMessageShown"
      location="right bottom"
      :max-width="500"
      :color="actionMessageType"
    >
      <p class="text-h6">{{ actionMessageText }}</p>
    </v-snackbar>

    <div class="title text-h2 mb-5">Товары</div>

    <v-card color="white" elevation="3" class="pa-5 mb-6 rounded-lg mx-sm-0 mx-n5">
      <TableActions
        v-model:count="productsByPage"
        @update:count="productsByPage = $event"
        @toggle-add-dialog="isAddDialogActive = true"
        @toggle-search="isSearchFormActive = !isSearchFormActive"
        v-if="userProducts.length"
      >
        Все товары({{ userProducts.length }})
      </TableActions>

      <div v-if="isProductsFetching">
        <div class="text-center mb-3 text-h6">Идет загрузка...</div>
        <v-progress-linear color="green" height="4" indeterminate />
      </div>

      <VExpandTransition>
        <div class="mb-6" v-if="isSearchFormActive">
          <v-form>
            <v-row align="center">
              <v-col sm="6" cols="12">
                <v-text-field
                  v-model.lazy="searchName"
                  variant="outlined"
                  label="Название товара"
                />
              </v-col>
              <v-col sm="6" cols="12">
                <v-range-slider
                  v-model.lazy="searchPrices"
                  thumb-label="always"
                  min="1"
                  step="10"
                  max="999999"
                  strict
                  color="blue-grey-darken-2"
                  label="Цена:"
                  hide-details="auto"
                >
                </v-range-slider>
              </v-col>

              <v-col cols="auto">
                <v-btn variant="flat" color="red-darken-4" @click="resetSearch"> Сбросить поиск </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </div>
      </VExpandTransition>

      <v-table density="comfortable" v-if="userProducts.length">
        <thead>
          <tr>
            <th
              v-for="head in tableSortFields"
              :key="head.text"
              class="text-left text-h6"
              @click="setSortField(head.field)"
            >
              {{ head.text }}
              <v-icon
                v-show="currentSortValue === head.field"
                :icon="isInverseSort ? 'mdi-arrow-up-thin' : 'mdi-arrow-down-thin'"
              ></v-icon>
            </th>
            <th class="text-left text-h6">Действия</th>
          </tr>
        </thead>
        <tbody>
          <TransitionGroup name="list" appear>
            <UserProductRow
              v-for="(item, index) in paginatedProducts"
              :product="item"
              :key="item.id"
              @open-dialog="openProductDialog"
              :data-index="index"
            />
          </TransitionGroup>
        </tbody>
      </v-table>

      <v-alert type="error" border="end" variant="tonal" v-if="isProductsError">
        <v-alert-title class="mb-2"> Ошибка при загрузке товаров </v-alert-title>
        <p>{{ loadProductsError }}</p>
      </v-alert>

      <p class="text-h6" v-else-if="userProducts.length === 0 && !isProductsFetching">
        Пока в таблице нет товаров, добавьте хоть одинф
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
import { useTablePagination } from "@/composables/useTablePagination";
import { useListAnimations } from "@/composables/useListAnimtaions";
import { useProductsFilter } from "@/composables/useProductsFilter";

import UserProductRow from "@/components/Products/UserProductRow.vue";
import ProductEditDialog from "@/components/Products/ProductEditDialog.vue";
import ProductDeleteDialog from "@/components/Products/ProductDeleteDialog.vue";
import ProductAddDialog from "@/components/Products/ProductAddDialog.vue";
import TableActions from "@/components/TableActions.vue";

import type { IUserProduct } from "@/types/interfaces";

const userProductsStore = useUserProductsStore();

const {
  userProducts,
  loadProductsError,
  isProductsFetching,
  isProductsError,
  isActionMessageShown,
  actionMessageText,
  actionMessageType
} = storeToRefs(userProductsStore);

onMounted(async () => {
  if(!userProducts.value.length){
    await userProductsStore.fetchUserProducts();
  }
});

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

const { filterProducts, searchName, searchPrices, tableSortFields, resetSearch } =
  useProductsFilter(userProducts);

const currentSortValue = ref<keyof IUserProduct>(tableSortFields.value[0].field);

const { currentPage, paginatedProducts, totalPages, isInverseSort, productsByPage, setSortField } =
  useTablePagination<IUserProduct>(filterProducts, currentSortValue);
</script>

<style scoped>
th {
  cursor: pointer;
}
tr {
  position: relative;
}

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
