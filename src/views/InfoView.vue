<template>
  <div>
    <h2 class="text-sm-h2 text-h3 mb-5">О приложении</h2>
    <v-card color="white" elevation="5" class="pa-5 mx-sm-0 mx-n5" rounded="lg">
      <v-card-title class="pa-0 mb-6 text-h4">Админ панель</v-card-title>
      <v-card-subtitle
        class="pa-0 text-wrap text-h6 mb-4 text-black font-weight-medium"
        style="line-height: 1.5"
      >
     
        Пет проект. Предоставляет возможность добавлять, изменять, редактировать товары, заказы,
        клиентов. Реализован поиск добавленных данных, личный кабинет пользователя. Созданы графики с использованием ChartJs и VueChartJs. Данные
        хранятся в базе данных и все сохраняется после перезагрузки страницы.

       
      </v-card-subtitle>

      <v-card-text class="pa-0">
        <p class="mb-1 text-subtitle-1">Используемые технологии:</p>

        <v-row align="center" no-gutters>
          <v-col cols="auto" class="text-primary pr-2"> Frontend: </v-col>
          <v-col cols="auto">
            <v-chip-group
              selected-class="text-primary"
              class="chips-front-end overflow-hidden"
              v-model="currentChipFront"
            >
              <v-chip
                v-for="chip in chipsFrontEnd"
                :key="chip.text"
                :append-icon="chip.icon"
                :value="chip.text"
              >
                {{ chip.text }}
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>

        <v-divider thickness="3" class="my-2 border-opacity-25"> </v-divider>

        <v-row align="center" no-gutters>
          <v-col cols="auto" class="text-red pr-2"> Backend: </v-col>
          <v-col cols="auto">
            <v-chip-group
              selected-class="text-red"
              class="chips-back-end overflow-hidden"
              v-model="currentChipBack"
            >
              <v-chip
                v-for="chip in chipsBackEnd"
                :key="chip.text"
                :append-icon="chip.icon"
                :value="chip.text"
              >
                {{ chip.text }}
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import gsap from "gsap";
import { onMounted, ref } from "vue";

type Chip = {
  text: string;
  icon?: string;
};

const currentChipBack = ref("NodeJs");
const currentChipFront = ref("VueJs");

const chipsFrontEnd = ref<Chip[]>([
  {
    text: "VueJs",
    icon: "mdi-vuejs"
  },
  {
    text: "Typescript",
    icon: "mdi-language-typescript"
  },
  {
    text: "Pinia",
    icon: "mdi-fruit-pineapple"
  },
  {
    text: "Vuetify",
    icon: "mdi-vuetify"
  },
  {
    text: "Axios"
  },
  {
    text: "ChartJs",
    icon: "mdi-chart-arc"
  },
  {
    text: "GSAP"
  }
]);

const chipsBackEnd = ref<Chip[]>([
  {
    text: "NodeJs",
    icon: "mdi-nodejs"
  },
  {
    text: "ExpressJs"
  },
  {
    text: "SQL",
    icon: "mdi-database-import"
  },
  {
    text: "MariaDB",
    icon: "mdi-database"
  },
  {
    text: "Jwt"
  },
  {
    text: "BcryptJs"
  }
]);

onMounted(() => {
  gsap.from(".chips-front-end > *", {
    x: "-100%",
    skewX: -10,
    skewY: -20,
    opacity: 0,
    duration: 0.5,
    stagger: 0.25,
    ease: "none"
  });

  gsap.from(".chips-back-end > *", {
    x: "-100%",
    skewX: -10,
    skewY: -20,
    opacity: 0,
    duration: 0.5,
    stagger: {
      each: 0.25,
      from: "end"
    },
    ease: "none"
  });
});
</script>

<style lang="scss" scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
