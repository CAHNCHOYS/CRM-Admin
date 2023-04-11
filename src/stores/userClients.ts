import { defineStore } from "pinia";
import { ref } from "vue";
import { isAxiosError } from "axios";
import { handleAxiosError } from "@/services/axioxErrorHandle";
import { getClients } from "@/services/ClientsService";

import type { IUserClient } from "@/types/interfaces";

export const useUserClientsStore = defineStore("userClients", () => {
  const clients = ref<IUserClient[]>([]);

  const clientsErrorMessage = ref<string | null>(null);
  const isClientsLoading = ref(false);

  async function getAllClients(userId: number) {
    try {
      isClientsLoading.value = true;
      const { data } = await getClients(userId);
      clients.value = data.clients;
    } catch (error) {
      if (isAxiosError(error)) {
        clientsErrorMessage.value = handleAxiosError(error);
      } else clientsErrorMessage.value = "Ошибка при загрзке клиентов";
    }finally{
      isClientsLoading.value = false;
    }
  }

  function deleteClient(clientId: number) {
    clients.value = clients.value.filter((client) => client.id != clientId);
  }

  function updateClient(newClient: IUserClient) {
    const indexToUpdate = clients.value.findIndex((client) => client.id === newClient.id);

    clients.value[indexToUpdate] = newClient;
  }

  function addClient(newClient: IUserClient) {
    clients.value.push(newClient);
  }

  function clearUserClients() {
    clients.value = [];
  }

  return {
    clients,
    clientsErrorMessage,
    isClientsLoading,
    getAllClients,
    deleteClient,
    addClient,
    updateClient,
    clearUserClients
  };
});
