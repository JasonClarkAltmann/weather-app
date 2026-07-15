<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";
import ConfettiExplosion from "vue-confetti-explosion";
import { useToast } from "primevue/usetoast";
import Panel from "primevue/panel";
import Divider from "primevue/divider";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { getWeather } from "@/services/ApiService";
import type { WeatherData } from "@/interfaces/WeatherData";
import {
  Droplets,
  Heart,
  Search,
  Sunrise,
  Sunset,
  Wind,
} from "lucide-vue-next";

const toast = useToast();

const weather = ref<WeatherData | null>(null);

const inputCity = ref("");

const visible = ref(false);

const emit = defineEmits<{
  (e: "city-searched", city: string): void;
}>();

const explode = async () => {
  visible.value = false;
  await nextTick();
  visible.value = true;
};

async function fetchWeather(city: string) {
  const trimmedCity = city.trim();
  if (!trimmedCity) {
    toast.add({
      severity: "warn",
      summary: "Warnung",
      detail: "Bitte geben Sie einen Ortsnamen ein.",
      life: 3000,
    });
    return;
  }
  if (trimmedCity === "Jason Clark Altmann") {
    explode();
    return;
  }
  const data = await getWeather(trimmedCity);
  if (data) {
    weather.value = data;
    inputCity.value = "";
    emit("city-searched", data.name);
  } else {
    inputCity.value = "";
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `Weather Data for "${trimmedCity}" not found`,
      life: 3000,
    });
  }
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

onMounted(() => {
  fetchWeather("Berlin");
});
</script>

<template>
  <Panel class="h-full w-full sm:h-fit sm:w-fit p-4 overflow-auto">
    <template #header>
      <div class="flex flex-col">
        <h2 class="text-3xl font-bold">Jasons Wettervorhersage:</h2>
        <Divider />
      </div>
    </template>
    <div class="flex items-center justify-center">
      <ConfettiExplosion
        v-if="visible"
        :stageHeight="500"
        :stageWidth="1000"
        :force="0.8"
      />
    </div>
    <div class="flex flex-row gap-4">
      <IconField class="flex flex-grow">
        <InputIcon>
          <Search class="w-5 h-4" />
        </InputIcon>
        <InputText
          v-model="inputCity"
          class="flex flex-grow"
          @keyup.enter="fetchWeather(inputCity)"
          placeholder="Suche nach einem Ort"
        />
      </IconField>

      <Button @click="fetchWeather(inputCity)" outlined>
        <Search />
      </Button>
    </div>
    <div v-if="weather">
      <div class="text-2xl sm:text-3xl font-bold mt-5">
        Wetter in {{ weather.name }}, {{ weather.sys?.country }}
      </div>
      <div
        class="flex flex-row gap-4 text-2xl sm:text-3xl font-bold items-center"
      >
        <img
          v-if="weather.weather && weather.weather[0]"
          :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
          alt="Weather Icon"
        />
        <div class="flex flex-col">
          <div>{{ weather.main?.temp }} °C</div>
          <div v-if="weather.weather && weather.weather[0]">
            {{ weather.weather[0].description }}
          </div>
        </div>
      </div>
      <Divider />
      <div class="flex flex-col text-base sm:text-lg font-bold mt-8">
        <div class="flex flex-row gap-2">
          <Heart /> Gefühlt: {{ weather.main?.feels_like }} °C
        </div>
        <div class="flex flex-row gap-2">
          <Droplets /> Luftfeuchtigkeit: {{ weather.main?.humidity }}%
        </div>
        <div class="flex flex-row gap-2">
          <Wind /> Windgeschwindigkeit: {{ weather.wind?.speed }} km/h
        </div>
        <div class="flex flex-row gap-2">
          <Sunrise /> Sonnenaufgang:
          {{ formatTimestamp(weather.sys?.sunrise || 0) }} Uhr
        </div>
        <div class="flex flex-row gap-2">
          <Sunset /> Sonnenuntergang:
          {{ formatTimestamp(weather.sys?.sunset || 0) }} Uhr
        </div>
      </div>
    </div>
    <div
      v-else
      class="flex justify-center items-center py-8 text-lg font-medium text-gray-500"
    >
      Wetterdaten werden geladen...
    </div>
  </Panel>
</template>
