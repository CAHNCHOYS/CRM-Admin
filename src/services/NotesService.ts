import axios from "./axios";
import type { AxiosResponse } from "axios";
import type {
  AddNoteResponse,
  DeleteResponse,
  GetNotesResponse,
  UpdateResponse
} from "@/types/BackendResponses";
import type { IUserNote, NoteType } from "@/types/interfaces";

export const getUserNotes = (userId: number): Promise<AxiosResponse<GetNotesResponse>> => {
  return axios.get(`/Notes/${userId}`);
};

export const updateNote = async (note: IUserNote): Promise<AxiosResponse<UpdateResponse>> => {
  return await axios.patch("/Notes", note);
};

export const deleteNote = async (noteId: number): Promise<AxiosResponse<DeleteResponse>> => {
  return await axios.delete(`/Notes/${noteId}`);
};

type AddNotePayload = {
  userId: number;
  title: string;
  type: NoteType;
};

export const addNote = async (
  noteData: AddNotePayload
): Promise<AxiosResponse<AddNoteResponse>> => {
  return await axios.post(`/Notes`, noteData);
};
