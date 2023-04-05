<template>
  <div>
    <v-table density="comfortable">
      <thead class="h-auto">
        <tr class="d-none d-sm-table-row">
          <th
            v-for="item in tableHeaders"
            :key="item.text"
            class="text-h6 pa-0 pr-3 pb-3 font-weight-bold text-black"
            @click="$emit('update:currentSortField', item.field)"
          >
            <v-hover v-slot="{ isHovering, props }">
              <p v-bind="props">
                {{ item.text }}
                <v-icon
                  style="position: absolute"
                  :icon="
                    isInverseSort && currentSortField == item.field
                      ? 'mdi-arrow-up-thin'
                      : 'mdi-arrow-down-thin'
                  "
                  v-show="currentSortField === item.field || isHovering"
                  :style="{ opacity: isHovering && currentSortField != item.field ? 0.6 : 1 }"
                />
              </p>
            </v-hover>
          </th>

          <th class="text-h6 pb-3 font-weight-bold text-black">Действия</th>
        </tr>
        <div class="d-sm-none d-block mb-2">
          <v-select
            :model-value="currentSortField"
            @update:model-value="$emit('update:currentSortField', $event)"
            variant="underlined"
            label="Сортировать по"
            :clearable="false"
            :items="tableHeaders"
            item-title="text"
            item-value="field"
          />
        </div>
      </thead>
      <tbody v-if="clients.length">
        <transition-group @enter="elementEnter" @leave="elementLeave">
          <ClientsTableRow
            v-for="client in clients"
            :key="client.id"
            :client="client"
            @open-dialog="openDialog"
        /></transition-group>
      </tbody>

      <tbody v-else>
        <tr>
          <td class="py-2 text-h6 text-center font-weight-bold" colspan="12">
            Не удалось найти ни одного клиента :(
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ClientsTableRow from "@/components/Clients/ClientsTableRow.vue";
import { useListAnimations } from "@/composables/useListAnimtaions";

import type { IUserClient } from "@/types/interfaces";

const props = defineProps<{
  clients: IUserClient[];
  isInverseSort: boolean;
  currentSortField: keyof IUserClient;
}>();
const emit = defineEmits<{
  (e: "update:currentSortField", field: keyof IUserClient): void;
  (e: "openDialog", client: IUserClient, dialog: "edit" | "delete"): void;
}>();

const tableHeaders = ref<
  {
    text: string;
    field: keyof IUserClient;
  }[]
>([
  {
    text: "Имя",
    field: "firstName"
  },
  {
    text: "Фамилия",
    field: "secondName"
  },
  {
    text: "Отчество",
    field: "thirdName"
  },
  {
    text: "Телефон",
    field: "phone"
  },
  {
    text: "Премиум",
    field: "premium"
  }
]);

const openDialog = (product: IUserClient, dialog: "edit" | "delete") => {
  emit("openDialog", product, dialog);
};

const { elementEnter, elementLeave } = useListAnimations();
</script>

<style scoped></style>
