import { ref, type Ref } from "vue";

export const useDialogActions = <T>() => {
  const isAddDialogActive = ref(false);
  const isDeleteDialogActive = ref(false);
  const isEditDialogActive = ref(false);

  const itemToEdit = ref<Ref<T> | null>(null);

  const openDialog = (item: T, dialogType: "edit" | "delete"): void => {
    console.log(item);
    itemToEdit.value = item;
    if (dialogType === "edit") {
      isEditDialogActive.value = true;
    }
    if (dialogType === "delete") {
      isDeleteDialogActive.value = true;
    }
  };

  return { isAddDialogActive, isEditDialogActive, isDeleteDialogActive, itemToEdit,  openDialog };
};
