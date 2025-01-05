<script setup lang="ts">
import { onMounted, ref, nextTick, defineEmits } from "vue";
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
  (e: "city-searched"): void;
}>();

const explode = async () => {
  visible.value = false;
  await nextTick();
  visible.value = true;
};

async function fetchWeather(city: string) {
  if (city === "Jason Clark Altmann") {
    explode();
    return;
  }
  const data = await getWeather(city);
  if (data) {
    weather.value = data;
    inputCity.value = "";
    emit("city-searched");
  } else {
    inputCity.value = "";
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `Weather Data for "${city}" not found`,
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
  <Panel class="w-fit p-4 m-4">
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
    <div class="text-3xl font-bold mt-5">
      Wetter in {{ weather?.name }}, {{ weather?.sys.country }}
    </div>
    <div class="flex flex-row gap-4 text-3xl font-bold items-center">
      <img
        :src="`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`"
        alt="Weather Icon"
      />
      <div class="flex flex-col">
        <div>{{ weather?.main.temp }} °C</div>
        <div>
          {{ weather?.weather[0].description }}
        </div>
      </div>
    </div>
    <Divider />
    <div class="flex flex-col text-lg font-bold mt-8">
      <div class="flex flex-row gap-2">
        <Heart /> Gefühlt: {{ weather?.main.feels_like }} °C
      </div>
      <div class="flex flex-row gap-2">
        <Droplets /> Luftfeuchtigkeit: {{ weather?.main.humidity }}%
      </div>
      <div class="flex flex-row gap-2">
        <Wind /> Windgeschwindigkeit: {{ weather?.wind.speed }} km/h
      </div>
      <div class="flex flex-row gap-2">
        <Sunrise /> Sonnenaufgang:
        {{ formatTimestamp(weather?.sys.sunrise || 0) }} Uhr
      </div>
      <div class="flex flex-row gap-2">
        <Sunset /> Sonnenuntergang:
        {{ formatTimestamp(weather?.sys.sunset || 0) }} Uhr
      </div>
    </div>
  </Panel>
</template>
