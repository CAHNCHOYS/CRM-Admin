<template>
  <div>
    Все товары

    <v-table  density="comfortable">
      <thead>
        <tr>
          <th class="text-left">Id</th>
          <th class="text-left">Имя</th>
          <th class="text-left">Цена(руб)</th>
          <th class="text-left">Количество</th>
          <th class="text-left">Категория</th>
          <th class="text-left">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr   v-for="item in products" :key="item" >
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>

          <td>{{ item.price }}</td>
          <td>{{ item.count }}</td>
          <td>{{ item.category }}</td>

          <td class="py-3">
            <v-btn variant="flat" color="error" icon="mdi-trash-can"></v-btn>

            <v-tooltip  content-class="tooltip" text="Редактировать" location="top">
              <template #activator="{ props }">
                <v-btn  v-bind="props" variant="flat" color="info" icon="mdi-pencil"></v-btn>
              </template>
            </v-tooltip>
          
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getAllUserProducts } from "@/api/getAllUserProducts";
import { useUserAuthStore } from "@/stores/userAuth";

const userAuthStore = useUserAuthStore();

const products = ref<any>([]);

onMounted(async () => {
  let res = await getAllUserProducts(userAuthStore.currentUser!.id);
  console.log(res);
  products.value = res.results;
});
</script>

<style>

.tooltip{
  background-color: black !important;
  color: white;
  opacity: 1;
}



</style>
