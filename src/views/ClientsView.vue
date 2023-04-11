<template>
  <div>
    <v-snackbar
      v-model="alertStore.isMessageShown"
      :max-width="500"
      :color="alertStore.messageType"
    >
      <p class="text-h6">{{ alertStore.messageText }}</p>
    </v-snackbar>

    <h2 class="title text-h2 mb-5">Клиенты</h2>

    <v-card color="white" elevation="3" class="pa-5 mb-6 rounded-lg mx-sm-0 mx-n5">
      <TableActions
        v-model:count="elementsByPage"
        @update:count="elementsByPage = $event"
        @toggle-add-dialog="isAddDialogActive = true"
        @toggle-search="isSearchFormActive = !isSearchFormActive"
        :is-badge-active="$route.query.secondName ? true : false"
      >
        Все клиенты
      </TableActions>

      <!--------- Форма поиска ----------->
      <v-expand-transition>
        <v-row v-if="isSearchFormActive" class="mb-5" align="center">
          <v-col cols="8">
            <v-text-field
              label="Фио клиента"
              v-model="secondNameSearch"
              @click:clear="secondNameSearch = ''"
            >
            </v-text-field
          ></v-col>

          <v-col cols="auto">
            <v-checkbox
              v-model="searchWithPremium"
              color="indigo-darken-4"
              label="Искать с премиумом"
            />
          </v-col>
          <v-scale-transition :leave-absolute="true">
            <v-col cols="auto" v-if="searchWithPremium">
              <v-switch
                v-model="searchPremium"
                :true-value="1"
                :false-value="0"
                color="indigo-darken-4"
                label="Есть премиум?"
              />
            </v-col>
          </v-scale-transition>
          <v-col cols="12">
            <v-row>
              <v-col cols="auto">
                <v-btn variant="flat" color="green-darken-3" @click="searchClients"> Искать </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn variant="flat" color="error" @click="resetSearch">
                  Сбросить поиск
                </v-btn></v-col
              >
              <v-col cols="auto">
                <v-btn variant="flat" color="blue-darken-4" @click="isSearchFormActive = false">
                  Закрыть поиск
                </v-btn></v-col
              >
            </v-row>
          </v-col>
        </v-row>
      </v-expand-transition>

      <div class="text-center mb-2" v-if="isClientsLoading">
        <p class="text-h6 mb-2">Идет загрузка клиентов...</p>
        <v-progress-linear indeterminate height="6" color="green" />
      </div>

      <v-alert type="error" border="end" variant="tonal" v-if="clientsErrorMessage">
        <v-alert-title class="mb-2"> Ошибка при загрузке клиентов</v-alert-title>
        <p>{{ clientsErrorMessage }}</p>
      </v-alert>

      <!--------- Таблица с клиентами ----------->
      <ClientsTable
        v-model:current-sort-field="currentSortField"
        @update:current-sort-field="setSortField"
        :is-inverse-sort="isInverseSort"
        :clients="paginatedClients"
        @open-dialog="openDialog"
        v-else-if="!isClientsLoading"
      />

      <v-pagination
        :length="totalPages"
        v-model="currentPage"
        rounded="circle"
        :total-visible="7"
        color="deep-purple-darken-4"
        v-if="clients.length"
      />
    </v-card>

    <ClientsDeleteDialog
      :is-opened="isDeleteDialogActive"
      @close-modal="isDeleteDialogActive = false"
      :client="clientToEdit"
      v-if="clientToEdit"
    />

    <ClientsEditDialog
      :client="clientToEdit"
      :is-opened="isEditDialogActive"
      @close-modal="isEditDialogActive = false"
      v-if="clientToEdit"
    />

    <ClientsAddDialog :is-opened="isAddDialogActive" @close-modal="isAddDialogActive = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";

import { useUserClientsStore } from "@/stores/userClients";
import { useAlertStore } from "@/stores/alert";
import { useUserAuthStore } from "@/stores/userAuth";

import ClientsTable from "@/components/Clients/ClientsTable.vue";
import ClientsDeleteDialog from "@/components/Clients/ClientDeleteDialog.vue";
import ClientsAddDialog from "@/components/Clients/ClientsAddDialog.vue";
import ClientsEditDialog from "@/components/Clients/ClientsEditDialog.vue";

import { useTablePagination } from "@/composables/useTablePagination";
import { getSearchedClients } from "@/services/ClientsService";

import type { IUserClient } from "@/types/interfaces";

const userClientsStore = useUserClientsStore();
const alertStore = useAlertStore();
const userAuthStore = useUserAuthStore();

onMounted(async () => {
  if (!userClientsStore.clients.length) {
    await userClientsStore.getAllClients(userAuthStore.currentUser!.id);
  }
});

const { clients, clientsErrorMessage, isClientsLoading } = storeToRefs(userClientsStore);

const currentSortField = ref<keyof IUserClient>("firstName");
const clientToEdit = ref<IUserClient | null>(null);

const isAddDialogActive = ref(false);
const isDeleteDialogActive = ref(false);
const isEditDialogActive = ref(false);

const openDialog = (client: IUserClient, type: "edit" | "delete") => {
  clientToEdit.value = client;
  if (type === "edit") {
    isEditDialogActive.value = true;
  }
  if (type === "delete") {
    isDeleteDialogActive.value = true;
  }
};

//Поиск-------------------------
const route = useRoute();
const router = useRouter();

const isSearchFormActive = ref(false);
const secondNameSearch = ref((route.query.secondName as string) || "");
const searchPremium = ref<0 | 1>((+(route.query.premium as string) as 0 | 1) || 0);
const searchWithPremium = ref(false);

const searchedClients = ref<IUserClient[]>([]);
const isSearchActive = ref(false);
const isSearchLoading = ref(false);

const resetSearch = () => {
  secondNameSearch.value = "";
  searchWithPremium.value = false;
  searchPremium.value = 0;
  isSearchActive.value = false;
  router.push({ name: "clients-page", query: {} });
};

const getClients = computed(() => {
  if (isSearchActive.value) {
    return searchedClients.value;
  } else return clients.value;
});

const searchClients = () => {
  router.push({
    name: "clients-page",
    query: {
      ...route.query,
      secondName: secondNameSearch.value,
      searchWithPremium: String(searchWithPremium.value),
      premium: searchPremium.value
    }
  });
};

watch(
  () => route.query,
  async () => {
    if (route.query.secondName === undefined && !route.query.premium) return;
    try {
      isSearchLoading.value = true;
      const secondName = route.query.secondName as string;
      const premium = +(route.query.premium as string) as 0 | 1;
      const searchWithPremium = route.query.searchWithPremium as string;
      const { data } = await getSearchedClients({
        userId: userAuthStore.currentUser!.id,
        premium,
        secondName,
        searchWithPremium
      });
      isSearchActive.value = true;
      searchedClients.value = data.clients;
      console.log(data.clients);
    } catch (error) {
      console.log(error);
    }
    isSearchLoading.value = false;
  },
  { immediate: true }
);
//----------------------------------------------------------------

//Пагинация и сортировка по полям-----------------------
const {
  currentPage,
  paginatedElements: paginatedClients,
  isInverseSort,
  elementsByPage,
  totalPages,
  setSortField
} = useTablePagination<IUserClient>({
  tableElements: getClients,
  pageName: "clients-page",
  sortField: currentSortField,
  route,
  router
});
</script>

<style scoped></style>
