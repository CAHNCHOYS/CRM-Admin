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
  addClientPayload: UserClientFields
): Promise<AxiosResponse<AddClientResponse>> => {
  return axios.post("/Clients", { ...addClientPayload });
};

export const updateClient = async (
  updatePayload: UserClientFields,
  clientId: number
): Promise<AxiosResponse<UpdateResponse>> => {
  return await axios.patch("/Clients", { ...updatePayload, clientId });
};

type SeachPayload = {
  userId: number;
  secondName: string;
  searchWithPremium: string;
  premium: 0 | 1;
};

export const getSearchedClients = async ({
  secondName,
  userId,
  searchWithPremium,
  premium
}: SeachPayload): Promise<AxiosResponse<GetClientsResponse>> => {
  return await axios.get(
    `/SearchClients/${userId}?secondName=${secondName}&searchWithPremium=${searchWithPremium}&premium=${premium}`
  );
};
