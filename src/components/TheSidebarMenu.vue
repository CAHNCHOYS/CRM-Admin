<template>
  <VNavigationDrawer
    @update:model-value="$emit('closeDrawer')"
    :model-value="isOpened"
    class="py-5"
    width="268"
    color="#2F76E6"
    :permanent="mdAndUp"
    :temporary="smAndDown"
  >
    <h2 class="text mb-10 px-4 text-white">
      <span class="text-uppercase text-indigo-darken-4">crm</span> System
    </h2>

    <VList class="pa-0">
      <VListItem class="text-center d-block">
        <VListItemTitle class="text-white text-h6"> My username </VListItemTitle>
        <template #prepend>
          <VAvatar class="mx-auto" size="60px">
            <VImg src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"></VImg>
          </VAvatar>
        </template>
      </VListItem>

      <VDivider color="white" class="my-2" />

      <VListItem v-for="item in menuItems" :value="item" active-class="active">
        <VListItemTitle>
          <RouterLink
            :to="item.link"
            class="d-flex justify-space-between align-center text-h6 text-white"
          >
            {{ item.title }}

            <VIcon :icon="item.icon" />
          </RouterLink>
        </VListItemTitle>
      </VListItem>
    </VList>

    <template #append>
      <div class="px-4">
        <VBtn block variant="flat" :height="60" color="red-darken-4" :rounded="0">
          <span class="font-weight-medium">Выйти с аккаунта</span>
          <VIcon end icon="mdi-exit-to-app" size="x-large" />
        </VBtn>
      </div>
    </template>
  </VNavigationDrawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const props = defineProps<{
  isOpened: boolean;
}>();

const { smAndDown, mdAndUp } = useDisplay();

const menuItems = ref<{ title: string; icon: string; link: string }[]>([
  {
    title: 'Рабочие',
    icon: 'mdi-account',
    link: '/workers'
  },
  {
    title: 'Личный кабинет',
    icon: 'mdi-key',
    link: '/account'
  }
]);
</script>

<style lang="scss" scoped>
.active {
}
</style>
