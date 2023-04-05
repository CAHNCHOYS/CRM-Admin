<template>
  <tr class="d-sm-table-row d-block">
    <td class="d-sm-table-cell d-flex justify-space-between pa-0 h-auto py-3">
      <div class="d-sm-none d-block font-weight-bold pr-1">Имя:</div>
      <div class="text-sm-left text-right">{{ client.firstName }}</div>
    </td>

    <td class="d-sm-table-cell d-flex justify-space-between h-auto pa-0 py-3">
      <div class="d-sm-none d-block font-weight-bold pr-1">Фамилия:</div>
      <div class="text-sm-left text-right">{{ client.secondName }}</div>
    </td>

    <td class="d-sm-table-cell d-flex justify-space-between h-auto pa-0 py-3">
      <div class="d-sm-none d-block font-weight-bold pr-1">Отчество:</div>
      <div class="text-sm-left text-right">{{ client.thirdName }}</div>
    </td>
    <td class="d-sm-table-cell d-flex justify-space-between h-auto pa-0 py-3">
      <div class="d-sm-none d-block font-weight-bold pr-1">Телефон:</div>
      <div class="text-sm-left text-right">{{ client.phone }}</div>
    </td>
    <td class="d-sm-table-cell d-flex justify-space-between h-auto pa-0 py-3">
      <div class="d-sm-none d-block font-weight-bold pr-1">Есть премиум:</div>
      <div class="text-sm-left text-right">{{ client.premium == 0 ? "Нет" : "Да" }}</div>
    </td>

    <td class="d-sm-table-cell d-flex justify-end h-auto pa-0 py-3">
      <div class="d-flex flex-wrap">
        <v-tooltip text="Удалить" location="left" no-click-animation>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="flat"
              icon="mdi-trash-can"
              @click="$emit('openDialog', client, 'delete')"
              color="error"
              class="mr-2"
            />
          </template>
        </v-tooltip>

        <v-tooltip text="Редактировать" location="right" no-click-animation>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="flat"
              icon="mdi-pencil"
              color="info"
              @click="$emit('openDialog', client, 'edit')"
            />
          </template>
        </v-tooltip>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { IUserClient } from "@/types/interfaces";

const props = defineProps<{
  client: IUserClient;
}>();

const emit = defineEmits<{
  (e: "openDialog", client: IUserClient, dialog: "edit" | "delete"): void;
}>();
</script>

<style scoped>

</style>
