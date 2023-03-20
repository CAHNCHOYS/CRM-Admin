import { defineStore } from "pinia";
import { ref } from "vue";

type MessageType = "success" | "error";

export const useAlertStore = defineStore("alert", () => {
  const isMessageShown = ref(false);

  const messageType = ref<MessageType>("success");
  const messageText = ref("");

  function showMessage(type: MessageType, text: string) {
    isMessageShown.value = true;

    messageType.value = type;
    messageText.value = text;

    setTimeout(() => (isMessageShown.value = false), 3500);
  }

  // function clearMessag(){
  //   isMessageShown.value = false;
  //   messageText.value = "";

  // }

  return {
    isMessageShown,
    messageType,
    messageText,
    showMessage
  };
});
