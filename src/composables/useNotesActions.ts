import { onMounted, ref, computed } from "vue";
import { useUserAuthStore } from "@/stores/userAuth";
import { useAlertStore } from "@/stores/alert";

import { isAxiosError } from "axios";
import { handleAxiosError } from "@/services/axioxErrorHandle";
import { getUserNotes, updateNote, deleteNote, addNote } from "@/services/NotesService";
import type { IUserNote, NoteType } from "@/types/interfaces";

export const useNotesActions = () => {
  const alertStore = useAlertStore();
  const userAuthStore = useUserAuthStore();

  const notes = ref<IUserNote[]>([]);

  const isActionLoading = ref(false);
  const isNotesFetching = ref(false);
  const fetchNotesError = ref<string | null>(null);

  const filterNotesByType = computed(() => {
    return function (noteType: NoteType) {
      return notes.value.filter((note) => note.type === noteType);
    };
  });

  onMounted(async () => {
    isNotesFetching.value = true;
    try {
      const { data } = await getUserNotes(userAuthStore.currentUser!.id);
      notes.value = data.notes;
      console.log(notes.value);
    } catch (error) {
      if (isAxiosError(error)) {
        fetchNotesError.value = handleAxiosError(error);
      } else fetchNotesError.value = "Ошибка при загрузке заметок!";
    }
    isNotesFetching.value = false;
  });

  const updateNoteAction = async (note: IUserNote) => {
    isActionLoading.value = true;
    try {
      await new Promise(res=>{
        setTimeout(()=>{
            res("done");  
        },3500)
      });
      await updateNote(note);
    } catch (error) {
      if (isAxiosError(error)) {
        alertStore.showMessage("error", handleAxiosError(error));
      } else alertStore.showMessage("error", "Ошибка при добавлении заметки!");
    }

    isActionLoading.value = false;
  };

  
  const addNoteAction = async (noteTitle: string, noteType: NoteType) => {
    if (noteTitle.length < 1) return;
    isActionLoading.value = true;
    await new Promise(res=>{
      setTimeout(()=>{
          res("done");  
      },3500)
    });
    try {
      const { data } = await addNote({
        title: noteTitle,
        type: noteType,
        userId: userAuthStore.currentUser!.id
      });
      notes.value.push({ id: data.noteId, title: noteTitle, type: noteType });
    } catch (error) {
      if (isAxiosError(error)) {
        alertStore.showMessage("error", handleAxiosError(error));
      } else alertStore.showMessage("error", "Ошибка при добавлении заметки!");
    }

    isActionLoading.value = false;
  };

  const deleteNoteAction = async (id: number) => {
    isActionLoading.value = true;
    try {
      await new Promise(res=>{
        setTimeout(()=>{
            res("done");  
        },3500)
      });
      await deleteNote(id);

      notes.value = notes.value.filter((note) => note.id != id);
    } catch (error) {
      if (isAxiosError(error)) {
        alertStore.showMessage("error", handleAxiosError(error));
      } else alertStore.showMessage("error", "Ошибка при добавлении заметки!");
    }
    isActionLoading.value = false;
  };

  return {
    deleteNoteAction,
    updateNoteAction,
    addNoteAction,

    isActionLoading,
    isNotesFetching,
    fetchNotesError,
    notes,
    filterNotesByType
  };
};
