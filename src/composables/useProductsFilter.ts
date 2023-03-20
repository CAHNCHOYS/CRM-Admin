import type { IUserProduct } from "@/types/interfaces";
import { computed, ref,  watchEffect, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";


export const useProductsFilter = (products: Ref<IUserProduct[]>) => {
  const route = useRoute();
  const router = useRouter();

  const searchPrices = ref<[number, number]>([
    +(route.query.startPrice as string) || 1,
    +(route.query.endPrice as string) || 999999
  ]);
  const searchName = ref((route.query.name as string) || "");


  
  const filteredProducts = computed(() => {
    const filteredByPrice = products.value.filter(
      (product) => product.price > searchPrices.value[0] && product.price < searchPrices.value[1]
    );
    return filteredByPrice.filter((product) =>
      product.name.toLowerCase().includes(searchName.value.toLowerCase())
    );
  });

  const resetSearch = () => {
    searchName.value = "";
    searchPrices.value = [1, 999999];
  };


  watchEffect((onIvalidate) => {
    console.log("watchEffect called");

    const name = searchName.value;
    const startPrice = searchPrices.value[0];
    const endPrice = searchPrices.value[1];

    const timeout = setTimeout(() => {
      router.push({
        name: "products-page",
        query: {
          ...route.query,
          name,
          startPrice,
          endPrice
        }
      });
    }, 800);

    onIvalidate(() => {
      clearInterval(timeout);
    });

  });

  return {  searchName, searchPrices, filteredProducts, resetSearch };
};
