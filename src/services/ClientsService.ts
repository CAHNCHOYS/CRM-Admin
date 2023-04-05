import axios from "./axios";
import type { AxiosResponse } from "axios";
import type {
  AddClientResponse,
  DeleteResponse,
  GetClientsResponse,
  UpdateResponse
} from "@/types/BackendResponses";
import type { UserClientFields } from "@/types/Forms";

export const getClients = async (userId: number): Promise<AxiosResponse<GetClientsResponse>> => {
  return axios.get("/Clients/" + userId);
};

export const deleteClient = async (clientId: number): Promise<AxiosResponse<DeleteResponse>> => {
  return axios.delete("/Clients/" + clientId);
};

export const addClient = async (
  addClientPayload: UserClientFields,
  userId: number
): Promise<AxiosResponse<AddClientResponse>> => {
  return axios.post("/Clients", { ...addClientPayload, userId });
};

export const updateClient = async (
  updatePayload: UserClientFields,
  clientId: number
): Promise<AxiosResponse<UpdateResponse>> => {
  return await axios.patch("/Clients", { ...updatePayload, clientId });
};
