import type { IUserProduct } from "@/types/interfaces";
import { computed, ref, watch, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";

type FilterValues = {
  searchName: Ref<string>;
  searchPrices: Ref<[number, number]>; // от и до
};

export const useProductsFilter = (products: Ref<IUserProduct[]>) => {
  const route = useRoute();
  const router = useRouter();

  //Заголвки  в шапке таблице и используются  для сортировки по полю
  const tableSortFields = ref<
    {
      text: string;
      field: keyof IUserProduct;
    }[]
  >([
    {
      text: "Имя",
      field: "name"
    },
    {
      text: "Цена(руб)",
      field: "price"
    },
    {
      text: "Количество",
      field: "count"
    },
    {
      text: "Категория",
      field: "category"
    }
  ]);

  const searchPrices = ref<[number, number]>([
    +(route.query.startPrice as string) || 1,
    +(route.query.endPrice as string) || 999999
  ]);
  const searchName = ref((route.query.name as string) || "");

  const filterProducts = computed(() => {
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
    // router.push({
    //   name: "products-page",
    //   query: {}
    // });
  };

  watch([searchName, searchPrices], () => {
    console.log("changes appeared!");
    router.push({
      name: "products-page",
      query: {
        ...route.query,
        name: searchName.value,
        startPrice: searchPrices.value[0],
        endPrice: searchPrices.value[1]
      }
    });
  });

  return { tableSortFields, searchName, searchPrices, filterProducts, resetSearch };
};
