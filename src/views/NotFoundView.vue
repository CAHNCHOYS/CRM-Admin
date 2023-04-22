<template>
  <div class="h-screen bg-not-found d-flex align-center justify-center">
    <v-overlay :model-value="xs" contained>

    </v-overlay>
    <div class="decor-items h-screen w-100">
      <v-img
        v-for="n in 34"
        :class="[`decor-items__item`, `decor-items__item_${n}`]"
        :src="Star"
        :width="10"
        :heigt="10"
        cover
      />
    </div>
    <v-sheet
      class="sheet flex-grow-1 text-center d-flex flex-column justify-stretch"
      :height="mdAndDown ? 'auto' : 500"
      :max-width="600"
      color="transparent"
    >
      <div class="title font-weight-bold mb-2">404</div>
      <div class="mb-md-16 mb-8 text-md-h3 text-h4 flex-grow-1">Страница не найдена</div>
      <div>
        <v-btn :height="80" variant="outlined" class="px-sm-10 px-2">
          <router-link class="text-white text-md-h4 text-h5" to="/"
            >На главную страницу</router-link
          >
          <template #prepend>
            <v-icon class="text-h3" icon="mdi-arrow-left-thin" size="large" />
          </template>
        </v-btn>
      
      </div>
    </v-sheet>

    <v-img
      :width="mdAndDown ? 300 : 600"
      :height="mdAndDown ? 300 : 600"
      cover
      :src="Moon"
      class="moon"
    />
  
    <v-img :src="Astranaut" class="astro" width="275" height="270" cover alt="Astranaut" />

    <v-img :src="Fog" width="32%" height="80%" class="fog"> </v-img>
    <v-img :src="Earth" class="earth" width="153" height="153" cover alt="Astranaut" />
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import gsap from "gsap";
import { onMounted, ref } from "vue";

import Moon from "@/assets/Images/404/Moon.svg";
import Star from "@/assets/Images/404/Star.svg";
import Astranaut from "@/assets/Images/404/Astronaut.svg";
import Earth from "@/assets/Images/404/earth.svg";
import Fog from "@/assets/Images/404/Fog1.png";

const { mdAndDown, xs } = useDisplay();



onMounted(() => {
  gsap.from(".decor-items__item", {
    opacity: 0,
    stagger: 0.1,
    duration: 0.5
  });

  gsap.to(".earth", {
    rotate: 360,
    duration: 2,
    repeat: -1,
    repeatDelay: 0,
    ease: "none",
  });




});
</script>

<style lang="scss" scoped>
.h-screen {
  position: relative;
 
}

.moon {
  position: absolute;
  left: 0;
  top: 0;

}

.astro {
  position: absolute;
  top: calc(18 / 800 * 100%);
  right: calc(20 / 1440 * 100%);
}

.fog {
  position: absolute;
  top: calc(120 / 800 * 100%);
  right: calc(40 / 1440 * 100%);
}

.earth {
  position: absolute;
  top: calc(574 / 800 * 100%);
  right: calc(223 / 1440 * 100%);
}

.sheet {
  position: relative;
  z-index: 3;
}

.title {
  font-size: 11.75rem;
  @media (max-width: 767.98px) {
    font-size: 6.75rem;
  }
}

.decor-items {
  position: absolute;
  z-index: 1;

  // .decor-items__item
  &__item {
    position: absolute;
    z-index: 1;

    // .decor-items__item_1
    &_1 {
      top: calc(30 / 800 * 100%);
      left: calc(676 / 1440 * 100%);
    }

    // .decor-items__item_2

    &_2 {
      top: calc(67 / 800 * 100%);
      left: calc(70 / 1440 * 100%);
    }

    // .decor-items__item_3

    &_3 {
      top: calc(204 / 800 * 100%);
      left: calc(41 / 1440 * 100%);
    }

    // .decor-items__item_4

    &_4 {
      top: calc(519 / 800 * 100%);
      left: calc(99 / 1440 * 100%);
    }

    // .decor-items__item_5

    &_5 {
      top: calc(574 / 800 * 100%);
      left: calc(41 / 1440 * 100%);
    }

    // .decor-items__item_6

    &_6 {
      top: calc(645 / 800 * 100%);
      left: calc(153 / 1440 * 100%);
    }

    // .decor-items__item_7

    &_7 {
      top: calc(734 / 800 * 100%);
      left: calc(287 / 1440 * 100%);
    }
    // .decor-items__item_8

    &_8 {
      top: calc(574 / 800 * 100%);
      left: calc(41 / 1440 * 100%);
    }

    // .decor-items__item_9

    &_9 {
      top: calc(312 / 800 * 100%);
      left: calc(323 / 1440 * 100%);
    }

    // .decor-items__item_9

    &_10 {
      top: calc(28 / 800 * 100%);
      left: calc(353 / 1440 * 100%);
    }

    // .decor-items__item_11

    &_11 {
      top: calc(205 / 800 * 100%);
      left: calc(506 / 1440 * 100%);
    }

    // .decor-items__item_12

    &_12 {
      top: calc(306 / 800 * 100%);
      left: calc(572 / 1440 * 100%);
    }

    // .decor-items__item_13

    &_13 {
      top: calc(520 / 800 * 100%);
      left: calc(520 / 1440 * 100%);
    }

    // .decor-items__item_14

    &_14 {
      top: calc(307 / 800 * 100%);
      left: calc(572 / 1440 * 100%);
    }

    // .decor-items__item_15
    &_15 {
      top: calc(464 / 800 * 100%);
      left: calc(662 / 1440 * 100%);
    }

    // .decor-items__item_16

    &_16 {
      top: calc(680 / 800 * 100%);
      left: calc(562 / 1440 * 100%);
    }

    // .decor-items__item_17

    &_17 {
      top: calc(450 / 800 * 100%);
      left: calc(803 / 1440 * 100%);
    }

    // .decor-items__item_18

    &_18 {
      top: calc(728 / 800 * 100%);
      left: calc(792 / 1440 * 100%);
    }

    // .decor-items__item_19

    &_19 {
      top: calc(63 / 800 * 100%);
      left: calc(881 / 1440 * 100%);
    }

    // .decor-items__item_20

    &_20 {
      top: calc(211 / 800 * 100%);
      left: calc(961 / 1440 * 100%);
    }

    // .decor-items__item_21

    &_21 {
      top: calc(301 / 800 * 100%);
      left: calc(885 / 1440 * 100%);
    }

    // .decor-items__item_22

    &_22 {
      top: calc(450 / 800 * 100%);
      left: calc(803 / 1440 * 100%);
    }

    // .decor-items__item_23

    &_23 {
      top: calc(584 / 800 * 100%);
      left: calc(941 / 1440 * 100%);
    }

    // .decor-items__item_24

    &_24 {
      top: calc(584 / 800 * 100%);
      left: calc(941 / 1440 * 100%);
    }

    // .decor-items__item_25

    &_25 {
      top: calc(776 / 800 * 100%);
      left: calc(1016 / 1440 * 100%);
    }

    // .decor-items__item_26

    &_26 {
      top: calc(26 / 800 * 100%);
      left: calc(1014 / 1440 * 100%);
    }

    // .decor-items__item_27

    &_27 {
      top: calc(51 / 800 * 100%);
      left: calc(1191 / 1440 * 100%);
    }

    // .decor-items__item_28

    &_28 {
      top: calc(63 / 800 * 100%);
      left: calc(1388 / 1440 * 100%);
    }

    // .decor-items__item_29

    &_29 {
      top: calc(316 / 800 * 100%);
      left: calc(1398 / 1440 * 100%);
    }

    // .decor-items__item_30

    &_30 {
      top: calc(505 / 800 * 100%);
      left: calc(1398 / 1440 * 100%);
    }

    // .decor-items__item_31

    &_31 {
      top: calc(472 / 800 * 100%);
      left: calc(1176 / 1440 * 100%);
    }
    // .decor-items__item_32

    &_32 {
      top: calc(406 / 800 * 100%);
      left: calc(1118 / 1440 * 100%);
    }

    // .decor-items__item_33

    &_33 {
      top: calc(450 / 800 * 100%);
      left: calc(1310 / 1440 * 100%);
    }

    // .decor-items__item_34

    &_34 {
      top: calc(662 / 800 * 100%);
      left: calc(1397 / 1440 * 100%);
    }
  }
}
</style>
