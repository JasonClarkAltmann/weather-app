<script setup lang="ts">
import { ref } from "vue";
import WeatherCard from "../components/WeatherCard.vue";

const backgroundImageUrl = ref("https://picsum.photos/1920/1080");

const updateBackgroundImage = () => {
  backgroundImageUrl.value = `https://picsum.photos/1920/1080?random=${Math.random()}`;
};
</script>

<template>
  <div
    :style="{ backgroundImage: `url(${backgroundImageUrl})` }"
    class="bg-cover bg-center"
  >
    <div class="flex h-screen items-center justify-center">
      <WeatherCard @city-searched="updateBackgroundImage" />
    </div>
  </div>
</template>
