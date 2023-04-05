<template>
  <div>
    <div class="title text-h2 mb-5">Клиенты</div>
    <v-snackbar
      v-model="alertStore.isMessageShown"
      :max-width="500"
      :color="alertStore.messageType"
    >
      <p class="text-h6">{{ alertStore.messageText }}</p>
    </v-snackbar>

    <v-card color="white" elevation="3" class="pa-5 mb-6 rounded-lg mx-sm-0 mx-n5">
      <TableActions
        v-model:count="elementsByPage"
        @update:count="elementsByPage = $event"
        @toggle-add-dialog="isAddDialogActive = true"
        @toggle-search="isSearchFormActive = !isSearchFormActive"
      >
        Все клиенты
      </TableActions>

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

      <div v-if="isClientsLoading">
        <div class="mb-3 text-h6">Идет загрузка...</div>
        <v-progress-linear color="green" height="4" indeterminate />
      </div>

      <ClientsTable
        v-model:current-sort-field="currentSortField"
        @update:current-sort-field="setSortField"
        :is-inverse-sort="isInverseSort"
        :clients="paginatedClients"
        @open-dialog="openDialog"
      />

      <v-alert type="error" border="end" variant="tonal" v-if="clientsErrorMessage">
        <v-alert-title class="mb-2"> Ошибка при загрузке клиентов</v-alert-title>
        <p>{{ clientsErrorMessage }}</p>
      </v-alert>

      <v-pagination
        :length="totalPages"
        v-model="currentPage"
        rounded="circle"
        :total-visible="7"
        color="deep-purple-darken-4"
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
import { onMounted, ref, computed, watchEffect, watch } from "vue";
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
import type { IUserClient } from "@/types/interfaces";

const userClientsStore = useUserClientsStore();
const userAuthStore = useUserAuthStore();
const alertStore = useAlertStore();

const { clients, clientsErrorMessage, isClientsLoading } = storeToRefs(userClientsStore);

onMounted(() => {
  if (!clients.value.length) {
    userClientsStore.getAllClients(userAuthStore.currentUser!.id);
  }
});

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

const resetSearch = () => {
  secondNameSearch.value = "";
  searchWithPremium.value = false;
  searchPremium.value = 0;
};

const searchedCliens = computed(() => {
  if (searchWithPremium.value) {
    return clients.value.filter(
      (client) =>
        client.secondName?.toLowerCase().includes(secondNameSearch.value.toLowerCase()) &&
        client.premium === searchPremium.value
    );
  } else
    return clients.value.filter((client) =>
      client.secondName.toLowerCase().includes(secondNameSearch.value.toLowerCase())
    );
});

watchEffect((onInvalidate) => {
  const secondName = secondNameSearch.value;
  const premium = searchPremium.value;
  const timeout = setTimeout(() => {
    router.push({
      name: "clients-page",
      query: {
        ...route.query,
        secondName,
        premium
      }
    });
  }, 800);
  onInvalidate(() => {
    clearTimeout(timeout);
  });
});
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
  tableElements: searchedCliens,
  pageName: "clients-page",
  sortField: currentSortField,
  route,
  router
});

</script>

<style scoped></style>
