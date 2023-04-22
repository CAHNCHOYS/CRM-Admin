import axios from "./axios";
import type { AxiosResponse } from "axios";
import type {
  AddNoteResponse,
  DeleteResponse,
  GetNotesResponse,
  UpdateResponse
} from "@/types/BackendResponses";
import type { IUserNote, NoteType } from "@/types/interfaces";

type AddNotePayload = {
  userId: number;
  title: string;
  type: NoteType;
};

class NoteService {
  async getNotes(userId: number): Promise<AxiosResponse<GetNotesResponse>> {
    return axios.get(`/Notes/${userId}`);
  }

  async updateNote(note: IUserNote): Promise<AxiosResponse<UpdateResponse>> {
    return await axios.patch("/Notes", note);
  }

  async deleteNote(noteId: number): Promise<AxiosResponse<DeleteResponse>> {
    return await axios.delete(`/Notes/${noteId}`);
  }

  async addNote(noteData: AddNotePayload): Promise<AxiosResponse<AddNoteResponse>> {
    return await axios.post(`/Notes`, noteData);
  }
}

export default new NoteService();
