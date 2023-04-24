<template>
  <div>
    <v-snackbar
      v-model="alertStore.isMessageShown"
      :max-width="500"
      :color="alertStore.messageType"
      position="fixed"
    >
      <p class="text-h6">{{ alertStore.messageText }}</p>
    </v-snackbar>

    <h2 class="title text-h2 mb-5">Клиенты</h2>

    <v-card color="white" elevation="3" class="pa-5 mb-6 rounded-lg mx-sm-0 mx-n5">
      <TableActions
        v-model:count="elementsPerPageCount"
        @toggle-add-dialog="isAddDialogActive = true"
        @toggle-search="isSearchFormActive = !isSearchFormActive"
        :is-badge-active="$route.query.secondName !== undefined"
      >
        Все клиенты
      </TableActions>

      <!--------- Форма поиска ----------->
      <v-expand-transition>
        <v-row v-if="isSearchFormActive" class="mb-5" align="center">
          <v-col sm="8" cols="12">
            <v-text-field label="Имя клиента" v-model="secondName" @click:clear="secondName = ''" />
          </v-col>

          <v-col sm="auto" cols="6">
            <v-checkbox
              v-model="searchWithPremium"
              color="indigo-darken-4"
              label="Искать с премиумом"
            />
          </v-col>
          <v-scale-transition :leave-absolute="true">
            <v-col sm="auto" cols="6" v-if="searchWithPremium">
              <v-switch
                v-model="premium"
                :true-value="1"
                :false-value="0"
                color="indigo-darken-4"
                label="Есть премиум?"
              />
            </v-col>
          </v-scale-transition>
          <v-col cols="12">
            <v-row>
              <v-col sm="auto" cols="6">
                <v-btn
                  variant="flat"
                  :disabled="isSearchLoading"
                  color="green-darken-3"
                  @click="addSearchQuery"
                  block
                >
                  Искать
                </v-btn>
              </v-col>
              <v-col sm="auto" cols="6">
                <v-btn
                  variant="flat"
                  :disabled="isSearchLoading"
                  color="error"
                  @click="resetSearch"
                  block
                >
                  <span class="text-wrap"> Сбросить поиск</span>
                </v-btn></v-col
              >
              <v-col sm="auto" cols="12">
                <v-btn
                  variant="flat"
                  :disabled="isSearchLoading"
                  color="blue-darken-4"
                  @click="isSearchFormActive = false"
                  block
                >
                  <span class="text-wrap"> Закрыть поиск</span>
                </v-btn></v-col
              >
            </v-row>
          </v-col>
        </v-row>
      </v-expand-transition>

      <v-alert type="error" border="end" variant="tonal" v-if="customersErrorMessage">
        <v-alert-title class="mb-2"> Ошибка при загрузке клиентов</v-alert-title>
        <p>{{ customersErrorMessage }}</p>
      </v-alert>

      <!--------- Таблица с клиентами ----------->
      <ElementsTable
        :items="paginatedCustomers"
        :fields="tableFields"
        :current-sort-field="currentSortField"
        @update-sort-field="(field)=> setSortField(field as keyof IUserCustomer)"
        :is-inverse-sort="isInverseSort"
        @open-dialog="(customer, type)=> openDialog(customer as IUserCustomer, type)"
        no-data-text="Клиенты не найдены"
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
        v-if="getCustomers.length"
      />
    </v-card>

    <CustomersDeleteDialog
      :is-opened="isDeleteDialogActive"
      @close-dialog="isDeleteDialogActive = false"
      :is-search-active="isSearchActive"
      @update-search-customers="searchUserCustomers"
      :customer="customerToEdit"
      v-if="customerToEdit"
    />

    <CustomersEditDialog
      :is-opened="isEditDialogActive"
      @close-dialog="isEditDialogActive = false"
      :is-search-active="isSearchActive"
      @update-search-customers="searchUserCustomers"
      :customer="customerToEdit"
      v-if="customerToEdit"
    />

    <CustomersAddDialog :is-opened="isAddDialogActive" @close-dialog="isAddDialogActive = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";

import { useUserCustomersStore } from "@/stores/userCustomers";
import { useAlertStore } from "@/stores/alert";
import { useUserAuthStore } from "@/stores/userAuth";

import CustomersDeleteDialog from "@/components/Customers/CustomersDeleteDialog.vue";
import CustomersAddDialog from "@/components/Customers/CustomersAddDialog.vue";
import CustomersEditDialog from "@/components/Customers/CustomersEditDialog.vue";
import ElementsTable from "@/components/ElementsTable.vue";

import { useTablePagination } from "@/composables/useTablePagination";
import { useDialogActions } from "@/composables/useDialogActions";
import { useCustomersSearch } from "@/composables/useCustomersSearch";

import type { IUserCustomer } from "@/types/interfaces";

const userCustomersStore = useUserCustomersStore();
const alertStore = useAlertStore();
const userAuthStore = useUserAuthStore();

const tableFields = ref<
  {
    fieldText: string;
    fieldName: keyof IUserCustomer;
  }[]
>([
  {
    fieldText: "Имя",
    fieldName: "firstName"
  },
  {
    fieldText: "Фамилия",
    fieldName: "secondName"
  },
  {
    fieldText: "Отчество",
    fieldName: "thirdName"
  },
  {
    fieldText: "Телефон",
    fieldName: "phone"
  },
  {
    fieldText: "Есть премиум",
    fieldName: "premium"
  }
]);
const currentSortField = ref<keyof IUserCustomer>("firstName");

const { customers, customersErrorMessage } = storeToRefs(userCustomersStore);

//Открытие диалогов-----------------------------------------------

const {
  isAddDialogActive,
  isEditDialogActive,
  isDeleteDialogActive,
  itemToEdit: customerToEdit,
  openDialog
} = useDialogActions<IUserCustomer>();
//--------------------------------------------------------------------

//Поиск-------------------------
const route = useRoute();
const router = useRouter();

const {
  isSearchFormActive,
  isSearchLoading,
  searchWithPremium,
  premium,
  isSearchActive,
  secondName,
  searchedCustomers,

  addSearchQuery,
  resetSearch,
  searchUserCustomers
} = useCustomersSearch(route, router, userAuthStore.currentUser!.id);

const getCustomers = computed(() => {
  if (isSearchActive.value) {
    return searchedCustomers.value;
  } else return customers.value;
});
//----------------------------------------------------------------

//Пагинация и сортировка по полям-----------------------
const {
  currentPage,
  paginatedElements: paginatedCustomers,
  isInverseSort,
  elementsPerPageCount,

  totalPages,
  setSortField
} = useTablePagination<IUserCustomer>({
  tableElements: getCustomers,
  pageName: "customers-page",
  sortField: currentSortField,
  route,
  router
});
</script>

<style scoped></style>
