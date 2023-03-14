<template>
  <div>
    <v-snackbar v-model="isActionMessageShown" location="right bottom" :color="actionMessageType" >
      <p class="text-h6">{{ actionMessageText }}</p>
    </v-snackbar>


    <div class="title text-h2 mb-5">Товары</div>

    <v-card color="white" elevation="3" class="pa-5 mb-6 rounded-lg mx-sm-0 mx-n5">
      <div class="text-h4 mb-4 d-flex justify-space-between">
        <div class="text-h4">Все товары</div>
        <div>
          <v-btn @click="addModalActive = true" color="success"  icon="mdi-plus" />
        </div>
      </div>

      <p v-if="isProductsFetching">
        <p class="text-center mb-3 text-h6">Идет загрузка...</p>
        <v-progress-linear color="green" height="4" indeterminate />
      </p>
   
     

      <v-table density="comfortable" v-if="userProducts.length">
        <thead>
          <tr>
            <th
              v-for="head in tableHeaders"
              :key="head.value"
              class="text-left text-h6"
              @click="setSortField(head.value)"
            >
              {{ head.title }}
            </th>
            <th class="text-left text-h6">Действия</th>
          </tr>
        </thead>
        <tbody>
          <UserProductRow
            v-for="(item, index) in sortProductsByField(currentSortValue, inverseSort)"
            :product="item"
            :key="item.id"
            :index="index"
            @open-dialog="openProductDialog"
          />
        </tbody>
      </v-table>

      <v-alert type="error" border="end" variant="tonal" v-if="isProductsError">
        <v-alert-title class="mb-2"> Ошибка при загрузке товаров </v-alert-title>
        <p>{{ loadProductsError }}</p>
      </v-alert>
    </v-card>


    <ProductEditDialog
      v-if="productToEdit"
      :product="productToEdit"
      @close="editModalActive = false"
      :is-opened="editModalActive"
    />
    <ProductDeleteDialog
      v-if="productToEdit"
      :model-value="deleteModalActive"
      :product="productToEdit"
      @close="deleteModalActive = false"
    />

    <ProductAddDialog
      @close="addModalActive = false"
       :is-active="addModalActive"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserProductsStore } from "@/stores/userProducts";

import UserProductRow from "@/components/Products/UserProductRow.vue";
import ProductEditDialog from "@/components/Products/ProductEditDialog.vue";
import ProductDeleteDialog from "@/components/Products/ProductDeleteDialog.vue";
import ProductAddDialog from "@/components/Products/ProductAddDialog.vue";

import type { IUserProduct } from "@/types/interfaces";

type SortFields = "name" | "id" | "price" | "count" | "category";

const tableHeaders = ref<
  {
    title: string;
    value: SortFields;
  }[]
>([
  {
    title: "№",
    value: "id"
  },
  {
    title: "Имя",
    value: "name"
  },
  {
    title: "Цена(руб)",
    value: "price"
  },
  {
    title: "Количество",
    value: "count"
  },
  {
    title: "Категория",
    value: "category"
  }
]);

const currentSortValue = ref<SortFields>("name");
const inverseSort = ref(false);

const setSortField = (field: SortFields) => {
  console.log(field);
  console.log(currentSortValue.value);
  if (currentSortValue.value === field) {
    inverseSort.value = !inverseSort.value;
  } else {
    inverseSort.value = false;
  }
  currentSortValue.value = field;
};



const userProductsStore = useUserProductsStore();

const {
  userProducts,
  loadProductsError,
  isProductsFetching,
  isProductsError,
  sortProductsByField,
  isActionMessageShown,
  actionMessageText,
  actionMessageType,
} = storeToRefs(userProductsStore);



const deleteModalActive = ref(false);
const addModalActive = ref(false);
const editModalActive = ref(false);

const productToEdit = ref<IUserProduct | null>(null);



const openProductDialog = (product: IUserProduct, dialogName: "edit" | "delete")=>{
  console.log(dialogName);
    productToEdit.value = product;
    if(dialogName==="delete"){
      deleteModalActive.value = true;
    } else if(dialogName === "edit"){
      editModalActive.value = true;
    }
}


onMounted(async () => {
  if (!userProductsStore.userProducts.length) {
    await userProductsStore.fetchUserProducts();
  }
});
</script>

<style scoped>
th {
  cursor: pointer;
}
</style>
