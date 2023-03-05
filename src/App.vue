<template>
  <VApp>

    <component :is="getCurrentLayout">
      <RouterView v-slot="{ Component }">
        <Transition name="slide" mode="out-in">
          <component :is="Component"> </component>
        </Transition>
      </RouterView>
    </component>

  </VApp>
</template>

<script setup lang="ts">
import { useLayouts } from "@/composables/useLayouts";


const { getCurrentLayout } = useLayouts();








</script>

<style lang="scss">
@import '@/assets/scss/nullstyle.scss';

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');


body {
  min-width: 320px;
  font-family: 'Poppins', sans-serif;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.6s ease 0s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translate(-20%, 0);
}



</style>
