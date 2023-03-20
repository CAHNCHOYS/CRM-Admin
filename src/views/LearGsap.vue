<template>
  <div>
    Gsap Page
    <v-btn color="indigo" variant="flat" @click="toggled = !toggled">Toggle animation</v-btn>

    <transition
      :css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <h2 v-if="toggled">Toggle me pls</h2>
    </transition>

    <div class="box"> </div>  
    <div class="box"> </div>  
    <div class="box"> </div>  
    <div class="box"> </div>  
    <div class="box"> </div>  
    <div class="box"> </div>  
    <div class="box"> </div>  
 






    <nav>
      <ul class="d-flex align-center">
        <li  v-for="link in links" class="mr-4 li">{{ link }}</li>
      </ul>
    </nav>



    <div class="ball">

    </div>



 

   <p class="text-h2 my-5">{{ obj.count.toFixed(0) }}</p>

  </div>
</template>

<script lang="ts" setup>
import gsap from "gsap";
import { onMounted, reactive, ref, watch } from "vue";

const beforeEnter = (el: HTMLElement, done: GSAPCallback) => {
  gsap.from(el, {
    y: 200,
    onComplete: done
  });
};

const enter = (el: HTMLElement, done: GSAPCallback) => {
  gsap.to(el, {
    y: 0,
    opacity: 1,
    duration: 2,
    ease: "bounce.out",
    onComplete: done
  });
};

const beforeLeave = (el: HTMLElement) => {
  gsap.from(el, {
    y: 500
  });
};

const leave = (el: HTMLElement) => {
  console.log("AFTER ENTER3");

  gsap.from(el, {
    y: 0,
    duration: 2,
    ease: "bounce.out"
  });
};


const obj = ref({
  count: 1,
});


const row = ref<HTMLElement | null>(null);

const links = ref(["link1","link2","link3", "link4"]);



onMounted(()=>{
 
  gsap.from('.li',{
    x: "-100%",
    duration: .5,
    stagger:{
      each: 0.5,
      from: "end",
    },
    opacity: 0,
    ease: "power1.out",
  })

  gsap.to(obj.value, {
    count: 1000,
    duration: 2,
 
  });
  
  gsap.from(".ball",{
    y:800,
    opacity: 0,
    ease:"bounce.out",
    duration: 2,
  })
  
  gsap.to(".box",{
    x: 100,
    background: "orange",
    stagger: {
       each: 0.3,
       from: "center",
    },
    duration: 1,
  })



  

})

const toggled = ref(false);
</script>

<style lang="scss" scoped>

.box{
    height: 100px;
    width: 100px;
    
    margin-bottom: 5px;
    background-color: black;
}

.ball{
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: cornflowerblue;
}
</style>
