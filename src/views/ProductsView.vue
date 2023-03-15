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
        @toggle-add-dialog="addDialogActive = true"
        :model-value="productsByPage"
        @update-products-by-page-count="productsByPage = $event"
        v-if="userProducts.length"
      >
        Все товары({{ userProducts.length }})
      </TableActions>

      <div v-if="isProductsFetching">
        <div class="text-center mb-3 text-h6">Идет загрузка...</div>
        <v-progress-linear color="green" height="4" indeterminate />
      </div>

      <v-table density="comfortable" v-if="userProducts.length">
        <thead>
          <tr>
            <th
              v-for="head in tableFields"
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
        Пока в таблице нет товаров, исправьте это
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
      @close-modal="editDialogActive = false"
      :is-active="editDialogActive"
    />
    <ProductDeleteDialog
      v-if="productToEdit"
      :is-active="deleteDialogActive"
      :product="productToEdit"
      @close-modal="deleteDialogActive = false"
    />

    <ProductAddDialog @close-modal="addDialogActive = false" :is-active="addDialogActive" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserProductsStore } from "@/stores/userProducts";
import { useTablePagination } from "@/composables/useTablePagination";
import { useListAnimations } from "@/composables/useListAnimtaions";

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
  if (!userProductsStore.userProducts.length) {
    await userProductsStore.fetchUserProducts();
  }
});

const tableFields = ref<
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
    text: "Количество",
    field: "count"
  },
  {
    text: "Категория",
    field: "category"
  }
]);
const currentSortValue = ref<keyof IUserProduct>("name");
const productsByPage = ref(10);

const { currentPage, paginatedProducts, totalPages, isInverseSort, setSortField } =
  useTablePagination<IUserProduct>(userProducts, productsByPage, currentSortValue);

const deleteDialogActive = ref(false);
const addDialogActive = ref(false);
const editDialogActive = ref(false);

const productToEdit = ref<IUserProduct | null>(null);

const openProductDialog = (product: IUserProduct, dialogName: "edit" | "delete") => {
  console.log(dialogName);
  productToEdit.value = product;
  if (dialogName === "delete") deleteDialogActive.value = true;
  else if (dialogName === "edit") {
    editDialogActive.value = true;
  }
};
</script>

<style scoped>
th {
  cursor: pointer;
}
tr{
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
