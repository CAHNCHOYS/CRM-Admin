import { computed, ref, watch, type Ref } from "vue";
import { useRouter, useRoute } from "vue-router";

export const useTablePagination = <T extends {}>(
  tableElements: Ref<T[]> = ref([]),
  sortField: Ref<keyof T>
) => {
  const route = useRoute();
  const router = useRouter();

  const currentPage = ref(+(route.query.currentPage as string) || 1);
  const productsByPage = ref(10);
  const totalPages = computed(() => Math.ceil(tableElements.value.length / productsByPage.value));

  const isInverseSort = ref(false);

  const setSortField = (field: keyof T) => {
    if (sortField.value === field) {
      isInverseSort.value = !isInverseSort.value;
    } else isInverseSort.value = false;
    sortField.value = field;
  };

  const setCurrentPage = (page: number) => {
    currentPage.value = page;
  };

  const paginatedProducts = computed(() => {
    const elementsCount = tableElements.value.length;
    let start = (currentPage.value - 1) * productsByPage.value;

    if (start >= elementsCount) {
      setCurrentPage(Math.ceil(elementsCount / productsByPage.value));
      start = (currentPage.value - 1) * productsByPage.value;
    }
    let end = start + productsByPage.value;

    const paginated = tableElements.value.slice(start, end);

    if (!isInverseSort.value)
      return [...paginated].sort((a, b) => (a[sortField.value] > b[sortField.value] ? 1 : -1));
    else return [...paginated].sort((a, b) => (a[sortField.value] > b[sortField.value] ? -1 : 1));
  });

  watch(currentPage, () => {
    router.push({
      name: "products-page",
      query: {
        ...route.query,
        currentPage: currentPage.value
      }
    });
  });

  return {
    currentPage,
    paginatedProducts,
    totalPages,
    isInverseSort,
    productsByPage,
    setSortField
  };
};
