<template>
  <div class="text">
    <div class="text-h2">Примеры анимация на gsap</div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.box {
  border: 2px solid black;
  height: 700px;
  width: 100%;
  position: relative;

  flex-wrap: wrap;
  display: flex;
}

.item {
  position: absolute;
  right: 0;
  top: 0;
  width: 50px;
  height: 50px;
  background-color: coral;
}

.sections {
}

.section {
}

.square {
  width: 200px;
  height: 200px;
  position: relative;
  background-color: cornflowerblue;
  z-index: 3;
}

.square2 {
  width: 100px;
  height: 100px;
  position: relative;
  background-color: crimson;
  z-index: 3;
}

.red {
  background-color: red;
}
</style>
