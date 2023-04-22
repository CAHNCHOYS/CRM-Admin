<template>
  <div>
    <v-snackbar
      v-model="alertStore.isMessageShown"
      :max-width="500"
      :color="alertStore.messageType"
    >
      <p class="text-h6">{{ alertStore.messageText }}</p>
    </v-snackbar>

    <h2 class="title text-h2 mb-5">Заказы</h2>

    <v-card elevation="3" color="white" class="pa-5 rounded-lg mx-sm-0 mx-n5">
      <v-card-title class="pa-0" v-if="!userOrdersStore.ordersErrorMessage">
        <TableActions
          v-model:count="elemetsPerPage"
          @update:count="elemetsPerPage = $event"
          @toggle-add-dialog="isAddDialogActive = true"
          @toggle-search="isSearchFormActive = !isSearchFormActive"
          :is-badge-active="$route.query.startDate || $route.query.endDate ? true : false"
        >
          Все заказы
        </TableActions>

        <v-expand-transition>
          <v-row v-if="isSearchFormActive" class="mb-5">
            <v-col cols="6">
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="startDate"
                    type="date"
                    label="Начальная дата"
                    :clearable="false"
                /></v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="endDate"
                    type="date"
                    label="Конечная дата"
                    :clearable="false"
                /></v-col>
              </v-row>
            </v-col>

            <v-col cols="6">
              <v-text-field v-model="customerName" label="Клиент" />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="productName" label="Товар" />
            </v-col>

            <v-col cols="6">
              <v-row>
                <v-col cols="auto">
                  <v-btn @click="addSearchQuery" variant="flat" color="green-darken-3">
                    Искать
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn @click="resetSearch" variant="flat" color="red-darken-4">
                    Сбросить поиск
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn variant="flat" color="blue-darken-4" @click="isSearchFormActive = false">
                    Закрыть
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-expand-transition>
      </v-card-title>

      <v-sheet v-if="userOrdersStore.ordersErrorMessage">
        <v-alert variant="outlined" border="end" type="error">
          <p>{{ userOrdersStore.ordersErrorMessage }}</p>
        </v-alert>
      </v-sheet>

      <ElementsTable
        :items="paginatedElements"
        :fields="tableFields"
        :is-inverse-sort="isInverseSort"
        no-data-text="Заказы не найдены"
        v-model:current-sort-field="currentSortField"
        @update:current-sort-field="(field)=> setSortField(field as keyof IUserOrder)"
        @open-dialog="(order, type)=> openDialog(order as IUserOrder, type)"
        v-else-if="!isSearchLoading"
      />

      <v-sheet class="text-center mb-2" v-if="isSearchLoading">
        <v-progress-circular indeterminate size="32" color="green" />
      </v-sheet>

      <v-pagination
        :length="totalPages"
        v-model="currentPage"
        rounded="circle"
        :total-visible="7"
        color="deep-purple-darken-4"
        v-if="getOrders.length"
      />
    </v-card>

    <OrdersAddDialog :is-opened="isAddDialogActive" @close-dialog="isAddDialogActive = false" />

    <OrdersEditDialog
      :is-search-active="isSearchActive"
      @update-search-orders="searchOrders"
      :order="orderToEdit"
      :is-opened="isEditDialogActive"
      @close-dialog="isEditDialogActive = false"
      v-if="orderToEdit"
    />
    <OrdersDeleteDialog
      :is-search-active="isSearchActive"
      @update-search-orders="searchOrders"
      :is-opened="isDeleteDialogActive"
      :order="orderToEdit"
      @close-dialog="isDeleteDialogActive = false"
      v-if="orderToEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTablePagination } from "@/composables/useTablePagination";
import { useDialogActions } from "@/composables/useDialogActions";
import { useOrdersSearch } from "@/composables/useOrdersSearch";

import { useUserAuthStore } from "@/stores/userAuth";
import { useUserOrdersStore } from "@/stores/userOrders";
import { useAlertStore } from "@/stores/alert";

import OrdersAddDialog from "@/components/Orders/OrdersAddDialog.vue";
import OrdersDeleteDialog from "@/components/Orders/OrdersDeleteDialog.vue";
import OrdersEditDialog from "@/components/Orders/OrdersEditDialog.vue";
import ElementsTable from "@/components/ElementsTable.vue";

import type { IUserOrder } from "@/types/interfaces";

const tableFields = ref<
  {
    fieldText: string;
    fieldName: keyof IUserOrder;
  }[]
>([
  {
    fieldText: "Клиент",
    fieldName: "customerFullName"
  },
  {
    fieldText: "Товар",
    fieldName: "productName"
  },
  {
    fieldText: "Количество товара",
    fieldName: "productCount"
  },
  {
    fieldText: "Дата",
    fieldName: "date"
  }
]);

const currentSortField = ref<keyof IUserOrder>("customerFullName");

const userAuthStore = useUserAuthStore();
const userOrdersStore = useUserOrdersStore();
const alertStore = useAlertStore();

//Работа с диалогами --------------------------------------------------------
const {
  itemToEdit: orderToEdit,
  isAddDialogActive,
  isEditDialogActive,
  isDeleteDialogActive,
  openDialog
} = useDialogActions<IUserOrder>();
//---------------------------------------------------------------------------

//Поиск заказов--------------------------------------------------------------

const route = useRoute();
const router = useRouter();

const {
  isSearchFormActive,
  isSearchLoading,
  isSearchActive,
  startDate,
  endDate,
  searchedOrders,
  customerName,
  productName,
  addSearchQuery,
  resetSearch,
  searchOrders
} = useOrdersSearch(route, router, userAuthStore.currentUser!.id);

const getOrders = computed(() => {
  if (isSearchActive.value) {
    return searchedOrders.value;
  } else return userOrdersStore.orders;
});
//---------------------------------------------------------------------------

const { currentPage, paginatedElements, isInverseSort, elemetsPerPage, totalPages, setSortField } =
  useTablePagination<IUserOrder>({
    tableElements: getOrders,
    pageName: "orders-page",
    sortField: currentSortField,
    route,
    router
  });
</script>

<style scoped></style>
