import { ref, onMounted } from "vue";
import type { ApiError, GetProductCategoriseResponse } from "@/types/BackendResponses";
import { fetchData } from "@/services/axiosFetch";

type Category = {
    id: number;
    name: string;
}

export const useProductsCategoiresFetch = () => {
  const categories = ref<Category[]>([]);
  const isCategoriesLoadError = ref(false);
  const categoriesLoadErroMessage = ref("");

  onMounted(async () => {

    console.log("I am mounted");
    const getCategories: GetProductCategoriseResponse | ApiError = await fetchData({
      url: "/ProductCategories",
      method: "get"
    });
    if ("error" in getCategories) {
      isCategoriesLoadError.value = true;
      categoriesLoadErroMessage.value = getCategories.error;
    } else {
      console.log(getCategories.data);
      categories.value = getCategories.data;
    }

  });


  return {categories, isCategoriesLoadError, categoriesLoadErroMessage}
};
