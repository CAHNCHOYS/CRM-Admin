<template>
  <v-table v-if="items.length">
    <tr class="d-sm-table-row d-none">
      <th
        v-for="field in fields"
        class="text-h6 pa-0 pb-3 font-weight-bold text-black text-left"
        :key="field.fieldName"
        @click="$emit('updateSortField', field.fieldName)"
      >
        <v-hover v-slot="{ isHovering, props }">
          <p v-bind="props" class="pr-6 d-inline-block" style="position: relative">
            {{ field.fieldText }}
            <v-icon
              style="position: absolute; right: 0px; top: 50%; transform: translate(0, -50%)"
              :icon="
                isInverseSort && currentSortField == field.fieldName
                  ? 'mdi-arrow-up-thin'
                  : 'mdi-arrow-down-thin'
              "
              v-show="currentSortField === field.fieldName || isHovering"
              :style="{ opacity: isHovering && currentSortField != field.fieldName ? 0.6 : 1 }"
            />
          </p>
        </v-hover>
      </th>
      <th class="text-h6 pa-0 pr-3 pb-3 font-weight-bold text-black text-left">Действия</th>
    </tr>

    <tr class="d-sm-none d-table-row">
      <td :colspan="fields.length + 1">
        <v-select
          :items="fields"
          item-title="fieldText"
          item-value="fieldName"
          :model-value="currentSortField"
          @update:model-value="emit('updateSortField', $event)"
          variant="underlined"
          :clearable="false"
          label="Сортировать по"
        />
      </td>
    </tr>

    <tbody>
      <transition-group @enter="elementEnter">
        <tr v-for="item in items" :key="item.id" class="d-sm-table-row d-block">
          <td
            v-for="field in fields"
            :key="field.fieldName"
            class="d-sm-table-cell d-flex pa-0 h-auto py-3"
          >
            <div class="d-sm-none d-block font-weight-bold flex-grow-1 pr-1">
              {{ field.fieldText }}:
            </div>
            <div class="text-sm-left text-right">
              {{ item[field.fieldName as keyof typeof item] }}
            </div>
          </td>
          <td class="d-sm-table-cell d-flex justify-end h-auto pa-0 py-3">
            <div class="d-flex flex-wrap">
              <v-tooltip
                text="Удалить"
                location="bottom"
                content-class="tooltip"
                transition="slide-x-transition"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    variant="flat"
                    icon="mdi-trash-can"
                    color="error"
                    class="mr-2"
                    @click="$emit('openDialog', item, 'delete')"
                  />
                </template>
              </v-tooltip>

              <v-tooltip
                text="Редактировать"
                location="bottom"
                content-class="tooltip"
                transition="slide-x-reverse-transition"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    variant="flat"
                    icon="mdi-pencil"
                    color="info"
                    @click="$emit('openDialog', item, 'edit')"
                  />
                </template>
              </v-tooltip>
            </div>
          </td>
        </tr>
      </transition-group>
    </tbody>
  </v-table>
  <div class="text-center text-h6 text-error font-weight-bold mb-5" v-else>
    {{ noDataText || "Ничего не найдено" }}
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import gsap from "gsap";
import type { IUserOrder, IUserProduct, IUserCustomer } from "@/types/interfaces";

type Field = {
  fieldText: string;
  fieldName: string;
};

const props = defineProps<{
  items: IUserCustomer[] | IUserOrder[] | IUserProduct[];
  fields: Field[];
  currentSortField: string;
  isInverseSort: boolean;
  noDataText?: string;
}>();

const emit = defineEmits<{
  (e: "updateSortField", field: string): void;
  (
    e: "openDialog",
    itemToEdit: IUserCustomer | IUserOrder | IUserProduct,
    dialog: "edit" | "delete"
  ): void;
}>();

const { xs } = useDisplay();

const elementEnter = (el: Element, done: GSAPCallback) => {
  if (!xs.value) {
    gsap.from(el, {
      duration: 0.6,
      opacity: 0,
      y: "-50%",
      ease: "power1.out",
      onComplete: done
    });
  }
};
</script>

<style scoped></style>
