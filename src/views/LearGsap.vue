<template>
  <div class="content pt-10">
    <div class="text-h2 top-title mb-7">Примеры анимация на gsap</div>

    <div class="container d-flex flex-row mx-n15 mb-10" style="width: 400vw; overflow: hidden">
      <section
        class="one bg-orange d-flex flex-grow-1 align-center justify-center h-screen"
        style="width: 100vw"
      >
        <p class="text-h2">Секция 1</p>
      </section>
      <section
        class="two bg-grey d-flex align-center flex-grow-1 justify-center h-screen"
        style="width: 100vw"
      >
        <p class="text-h2">Секция 2</p>
      </section>

      <section
        class="three bg-secondary d-flex align-center flex-grow-1 justify-center h-screen"
        style="width: 100vw"
      >
        <p class="text-h2">Секция 3</p>
      </section>
      <section
        class="three bg-purple d-flex align-center flex-grow-1 justify-center h-screen"
        style="width: 100vw"
      >
        <p class="text-h2">Секция 4</p>
      </section>
    </div>

    <v-row class="row">
      <v-col v-for="col in 12" sm="4" lg="3" cols="6" class="col">
        <v-card elevation="10" color="purple-darken-2">
          <v-img :src="`https://picsum.photos/id/${col * 5}/400/250`" :height="250" cover />
          <v-card-title> Заголовок № {{ col }} </v-card-title>
          <v-card-text>
            <p class="text-subtitle text-white">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto, sed omnis! Earum ipsum
              eum quo. Sapiente temporibus exercitationem laborum eius voluptates aliquam. Sint ea
              esse veniam ratione impedit fugit libero!
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn>Explore</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-1">
      <v-col class="parallax" cols="4">
        <v-img src="https://picsum.photos/id/77/600/600" height="600" cover> </v-img>
      </v-col>
      <v-col class="text" cols="8">
        <div class="text-h2 mb-2">Заголовок</div>
        <div class="text-h4">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad voluptatum cum impedit
          corporis itaque aperiam debitis quisquam, repudiandae esse cumque possimus expedita saepe.
          Voluptate necessitatibus veniam illo, repudiandae eum possimus.
        </div>
      </v-col>
    </v-row>

    <div class="text-h3 mb-2 font-weight-bold text-gallery">
      <span> Gallery</span>
    </div>

    <v-row class="gallery">
      <v-col cols="6" v-for="n in 10">
        <v-img :src="`https://picsum.photos/id/${n * 16}/800/300`" cover> </v-img>
      </v-col>
    </v-row>

    <div class="end text-subtitle-1">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam vitae reiciendis facere placeat
      delectus. Pariatur odit deleniti ullam! Sed nostrum deserunt amet totam quaerat delectus
      voluptate numquam temporibus neque quo?
    </div>
  </div>
</template>

<script lang="ts" setup>
import gsap from "@/plugins/gsap/index";
import { onMounted } from "vue";

onMounted(() => {
  gsap.from(".top-title", {
    duration: 1.5,
    y: -200,

    ease: "bounce.out"
  });

  const panels = gsap.utils.toArray(".container > section");
  gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    scrollTrigger: {
      trigger: ".container",
      pin: true,

      scrub: true,
      snap: {
        snapTo: 1 / (panels.length - 1),
        inertia: false,
        duration: { min: 0.1, max: 0.1 }
      },
      end: () =>
        "+=" + ((document.querySelector(".container") as HTMLElement).offsetWidth - innerWidth)
    },
    ease: "none"
  });

  gsap.from(".col", {
    scrollTrigger: {
      trigger: ".row",
      start: "top 45%",
      end: "+=1100",
      scrub: true
    },
    x: "-100%",
    //  scale: 0,
    transformOrigin: "left top",
    opacity: 0,
    ease: "power4.out",
    duration: 1.5,
    stagger: 1
  });

  gsap.to(".parallax", {
    y: "-30%",
    scrollTrigger: {
      trigger: ".parallax",
      start: "top 40%",
      scrub: true
    }
  });

  gsap.to(".text", {
    y: "30%",
    scrollTrigger: {
      trigger: ".text",
      start: "top 40%",
      scrub: true
    }
  });

  gsap.from(".text-gallery", {
    scale: 0,
    opacity: 0,
    ease: "back.out",
    transformOrigin: "top bottom",
    scrollTrigger: {
      trigger: ".text-gallery",
      start: "top 60%"
    },
    duration: 1.5
  });

  const galleryLeft = gsap.utils.toArray(".gallery > div:nth-child(odd)");
  const galleryRight = gsap.utils.toArray(".gallery > div:nth-child(even)");

  gsap.from(galleryLeft, {
    x: "-100%",
    stagger: 0.5,
    opacity: 0,
    duration: 0.8,
    scrollTrigger: {
      trigger: ".gallery",
      start: "top 60%",
      // end: `+=${
      //   document.querySelector(".gallery")!.getBoundingClientRect().height * galleryLeft.length + 200
      // }`,

      end: "+=700",
      scrub: 1
    }
  });

  gsap.from(galleryRight, {
    x: "+100%",
    stagger: 0.5,
    opacity: 0,
    duration: 0.8,
    scrollTrigger: {
      trigger: ".gallery",
      start: "top 60%",

      end: "+=700",

      scrub: 1
    }
  });
});
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 1500px;
  border: 3px solid black;
}

.box-item {
  position: relative;
  z-index: 999;
}

.container {
  position: relative;
}
</style>
