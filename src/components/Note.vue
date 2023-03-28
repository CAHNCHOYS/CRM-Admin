<template>
  <div
    class="note py-3 px-4 bg-white mb-3"
    @dragstart="$emit('dragstart', $event, note.id)"
    @dragend="$emit('dragend', $event)"
  >
    <div class="d-flex align-center">
      <div class="text-h6 flex-grow-1 pr-1" v-show="!isUserEditing">{{ note.title }}</div>
      <div v-show="isUserEditing" class="flex-grow-1">
        <v-text-field
          v-model="note.title"
          density="comfortable"
          variant="underlined"
          :clearable="false"
          bg-color="white"
        />
      </div>

      <div>
        <v-hover v-slot="{ props, isHovering }">
          <v-icon
            icon="mdi-trash-can"
            size="large"
            :color="isHovering ? 'red-darken-3' : 'grey'"
            @click="$emit('deleteNote', note.id)"
            v-bind="props"
          >
          </v-icon>
        </v-hover>

        <v-hover v-slot="{ props, isHovering }">
          <v-icon
            v-show="!isUserEditing"
            @click="isUserEditing = !isUserEditing"
            icon="mdi-pencil"
            size="large"
            :color="isHovering ? 'blue' : 'grey'"
            v-bind="props"
          >
          </v-icon>
        </v-hover>

        <v-hover v-slot="{ props, isHovering }">
          <v-icon
            v-show="isUserEditing"
            @click="updateNote"
            style="cursor: pointer"
            icon="mdi-content-save-all"
            size="large"
            :color="isHovering ? 'green' : 'grey'"
            v-bind="props"
          >
          </v-icon>
        </v-hover>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { IUserNote } from "@/types/interfaces";

const props = defineProps<{ note: IUserNote }>();
const emit = defineEmits<{
  (e: "deleteNote", id: number): void;
  (e: "dragstart", event: DragEvent, id: number): void;
  (e: "dragend", event: DragEvent): void;
  (e: "updateNote", note: IUserNote): void;
}>();

const isUserEditing = ref(false);

const updateNote = () => {
  emit("updateNote", props.note);
  isUserEditing.value = false;
};
</script>

<style scoped>
.note {
  cursor: move;
}
</style>
