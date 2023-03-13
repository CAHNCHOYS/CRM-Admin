<template>
  <div>
    
    <v-snackbar v-model="isProdutActionSuccess" location="right bottom" color="success">
      <p class="text-h6">Товар был успешно удален!</p>
    </v-snackbar>

    <v-snackbar v-model="isProductActionError" location="right bottom" color="error">
      <p class="text-h6">Ошибка:</p>
      <p>{{ productActionErrorMessage }}</p>
    </v-snackbar>

    <div class="title text-h2 mb-5">Товары</div>

    <v-card color="white" elevation="3" class="pa-5 mb-6 rounded-lg mx-sm-0 mx-n5">
      <p class="text-h4 mb-4">Все товары</p>

      <p v-if="isProductsFetching">
        <p class="text-center mb-3 text-h6">Идет загрузка...</p>
        <v-progress-linear   color="green" height="4" indeterminate />
      </p>

      <v-table density="comfortable" v-if="userProducts.length">
        <thead>
          <tr>
            <th v-for="head in tableHeaders" 
            :key="head.value"
             class="text-left text-h6" 
             @click="setSortField(head.value)">
               {{ head.title }}
            </th>
            
          </tr>
        </thead>
        <tbody>
          <UserProductRow
            v-for="(item, index) in sortProductsByField(currentSortValue, inverseSort)"
            :product="item"
            :key="item.id"
            :index="index"
            @delete="toggleDeletionConfirmModal"
          />
        </tbody>
      </v-table>

      <v-alert type="error" border="end" variant="tonal" v-if="isProductsError">
        <v-alert-title class="mb-2"> Ошибка при загрузке товаров </v-alert-title>
        <p>{{ loadProductsError }}</p>
      </v-alert>
    </v-card>

    <v-dialog v-model="deleteConfirmDialog" :max-width="450" persistent>
      <v-card class="pa-4">
        <v-card-title class="pa-0 mb-3">
          <p class="font-weight-bold text-h5">Подтверждение удаления</p>
        </v-card-title>
        <v-card-text class="pa-0">
          <p class="text-h6">
            Вы уверены что хотите удалить товар
            <span class="text-red">{{ deleteProductName }} </span> с базы данных ?
          </p>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn height="40" color="orange" variant="flat" @click="deleteConfirmDialog = false">
            <span class="text-white">Нет</span>
          </v-btn>
          <v-btn
            height="40"
            color="error"
            variant="flat"
            :loading="isProductActionLoading"
            @click="deleteProduct"
            >Да</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>


    
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserProductsStore } from "@/stores/userProducts";
import UserProductRow from "@/components/UserProductRow.vue";
import { storeToRefs } from "pinia";

type SortFields = "name" | "id" | "price" | "count" | "category"

const tableHeaders = ref<{
  title: string,
  value: SortFields
}[]>([{
  title: "№",
  value:"id",
},{

  title: "Имя",
  value:"name",
},{
  title: "Цена(руб)",
  value:"price",
},{
  title: "Количество",
  value: "count",

},{
  title:"Категория",
  value: "category",
}]);

const currentSortValue = ref<SortFields>("name")
const inverseSort = ref(false);

const setSortField = (field: SortFields)=>{
  console.log(field);
  console.log(currentSortValue.value);
  if(currentSortValue.value === field) {
    inverseSort.value = !inverseSort.value;
  }else {
    inverseSort.value = false;
  }

  currentSortValue.value = field;
}


const userProductsStore = useUserProductsStore();


const {
  userProducts,
  loadProductsError,
  isProductsFetching,
  isProductActionError,
  isProdutActionSuccess,
  isProductActionLoading,
  isProductsError,
  productActionErrorMessage,
  sortProductsByField,
} = storeToRefs(userProductsStore);



const deleteConfirmDialog = ref(false);
const deleteProductName = ref("");
const deleteProductId = ref(0);

const toggleDeletionConfirmModal = (productName: string, productId: number) => {
  deleteConfirmDialog.value = true;
  deleteProductId.value = productId;
  deleteProductName.value = productName;
};




const deleteProduct = async () => {
  await userProductsStore.deleteUserProduct(deleteProductId.value);
  deleteConfirmDialog.value = false;
};

onMounted(async () => {
  if (!userProductsStore.userProducts.length) {
    await userProductsStore.fetchUserProducts();
  }
});

</script>

<style scoped>

th{
  cursor: pointer;
}

</style>
