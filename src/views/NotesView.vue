<template>
  <div>
    <v-snackbar v-model="alertStore.isMessageShown" :color="alertStore.messageType">
      <p class="text-h6">{{ alertStore.messageText }}</p>
    </v-snackbar>
    <div class="text-h2 mb-8 title">Ваши заметки</div>

    <div class="" v-if="isNotesFetching">
      <p class="mb-3 text-h6">Загрузка заметок ...</p>
      <v-progress-linear color="green" height="4" indeterminate />
    </div>

    <v-row class="row" v-else-if="!fetchNotesError">
      <v-col
        v-for="column in columns"
        :key="column.title"
        @dragover.prevent
        @drop="handleDrop($event, column.title)"
      >
        <v-card color="blue-grey-darken-1 pa-4">
          <v-card-title class="text-h4 text-white mb-5 pa-0">{{ column.title }}</v-card-title>
          <div
            color="transparent"
            :max-height="700"
            style="overflow: auto; max-height: 700px"
            v-if="filterNotesByType(column.title).length"
          >
            <transition-group @enter="noteEnter" @leave="noteLeave" :css="false" appear>
              <Note
                v-for="note in filterNotesByType(column.title)"
                :key="note.id"
                :note="note"
                @delete-note="deleteNoteAction"
                @update-note="updateNoteAction"
                draggable="true"
                @dragstart="handleDragStart"
                @dragend="handleDragEnd"
              />
            </transition-group>
          </div>

          <v-alert color="white" class="mb-2" border-color="white" v-else>
            <v-alert-title>Пока нет заметок, добавьте хоть одну !</v-alert-title>
          </v-alert>

          <v-card-actions class="d-flex flex-column pa-0 align-stretch" style="min-height: auto">
            <div @click="column.isFormActive = !column.isFormActive" style="cursor: pointer">
              <v-icon :icon="column.isFormActive ? 'mdi-minus' : 'mdi-plus'"> </v-icon> Добавить
              заметку
            </div>

            <v-expand-transition>
              <v-form
                v-show="column.isFormActive"
                @submit.prevent="
                  addNoteAction(column.addText, column.title);
                  column.addText = '';
                "
              >
                <v-text-field
                  bg-color="white"
                  color="black"
                  placeholder="Задача..."
                  v-model="column.addText"
                  class="my-2 white-input"
                  :rules="[(v) => !!v || 'Поле обязательное для ввода']"
                >
                </v-text-field>
                <v-btn type="submit" variant="flat" color="green">Добавить</v-btn>
              </v-form>
            </v-expand-transition>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-alert type="error" border="end" variant="tonal" v-if="!isNotesFetching && fetchNotesError">
      <v-alert-title class="mb-2"> Ошибка при загрузке товаров </v-alert-title>
      <p>{{ fetchNotesError }}</p>
    </v-alert>

    <v-dialog v-model="isActionLoading" :scrim="false" persistent width="auto">
      <v-card color="indigo-darken-4">
        <v-card-text>
          <p class="mb-2">Загрузка...</p>
          <v-progress-linear indeterminate color="white" class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import gsap from "gsap";
import Note from "@/components/Note.vue";

import { useUserAuthStore } from "@/stores/userAuth";
import { useAlertStore } from "@/stores/alert";

import { handleAxiosError, isAxiosError } from "@/services/axioxErrorHandle";
import NoteService from "@/services/NotesService";

import type { IUserNote, NoteType } from "@/types/interfaces";

type NotesColumn = {
  title: NoteType;
  isFormActive: boolean;
  addText: string;
};
const columns = ref<NotesColumn[]>([
  { title: "В процессе", isFormActive: false, addText: "" },
  { title: "Сделать потом", isFormActive: false, addText: "" },
  { title: "Сделано", isFormActive: false, addText: "" }
]);

//Drag & Drop ----------------------------------------------------------------
const handleDragStart = (e: DragEvent, id: number) => {
  (e.target as HTMLElement).classList.add("dragging");
  e.dataTransfer!.setData("id", id.toString());
};

const handleDragEnd = (e: DragEvent) => {
  (e.target as HTMLElement).classList.remove("dragging");
};

const handleDrop = async (e: DragEvent, noteType: NoteType) => {
  const noteId = e.dataTransfer?.getData("id");
  if (noteId) {
    const noteToUpdate = notes.value.find((note) => note.id === +noteId)!;
    noteToUpdate.type = noteType;
    await updateNoteAction(noteToUpdate);
  }
};
//------------------------------------------------------------------

//Действия с заметками ---------------------------------------------
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
    const { data } = await NoteService.getNotes(userAuthStore.currentUser!.id);
    notes.value = data.notes;
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
    await NoteService.updateNote(note);
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

  try {
    const { data } = await NoteService.addNote({
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
    await NoteService.deleteNote(id);

    notes.value = notes.value.filter((note) => note.id != id);
  } catch (error) {
    if (isAxiosError(error)) {
      alertStore.showMessage("error", handleAxiosError(error));
    } else alertStore.showMessage("error", "Ошибка при добавлении заметки!");
  }
  isActionLoading.value = false;
};

//------------------------------------------------------------------------------

//Анимации
const noteEnter = (el: any, done: GSAPCallback) => {
  gsap.from(el, {
    opacity: 0,
    scale: 0,
    ease: "sine.out",
    duration: 0.6,
    onComplete: done
  });
};
const noteLeave = (el: any, done: GSAPCallback) => {
  gsap.to(el, {
    duration: 0.6,
    ease: "sine.out",
    opacity: 0,
    scale: 0,
    onComplete: done
  });
};
</script>

<style>
.dragging {
  opacity: 0.5 !important;
}

.white-input .v-messages__message {
  color: white !important;
}
</style>
