import { computed, ref, watch, type Ref } from "vue";
import type { Router, RouteLocationNormalizedLoaded } from "vue-router";

type Data<T> = {
  tableElements: Ref<T[]>;
  sortField: Ref<keyof T>;
  pageName: string;
  router: Router;
  route: RouteLocationNormalizedLoaded;
};

export const useTablePagination = <T extends {}>({
  tableElements,
  sortField,
  pageName,
  route,
  router
}: Data<T>) => {

  const currentPage = ref(+(route.query.currentPage as string) || 1);
  const elementsByPage = ref(10);
  const totalPages = computed(() => Math.ceil(tableElements.value.length / elementsByPage.value));

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

  const paginatedElements = computed(() => {
    const elementsCount = tableElements.value.length;
    let start = (currentPage.value - 1) * elementsByPage.value;

    if (start >= elementsCount && elementsCount) {
      setCurrentPage(Math.ceil(elementsCount / elementsByPage.value));
      start = (currentPage.value - 1) * elementsByPage.value;
    }
    let end = start + elementsByPage.value;

    const paginated = tableElements.value.slice(start, end);

    if (!isInverseSort.value)
      return paginated.sort((a, b) => (a[sortField.value] > b[sortField.value] ? 1 : -1));
    else return paginated.sort((a, b) => (a[sortField.value] > b[sortField.value] ? -1 : 1));
  });

  watch(currentPage, () => {
    router.push({
      name: pageName,
      query: {
        ...route.query,
        currentPage: currentPage.value
      }
    });
  });

  return {
    currentPage,
    paginatedElements,
    totalPages,
    isInverseSort,
    elementsByPage,
    setSortField
  };
};
