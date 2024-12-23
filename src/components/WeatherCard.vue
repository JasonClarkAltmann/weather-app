<script setup lang="ts">
import { onMounted, ref } from "vue";
import Panel from "primevue/panel";
import Divider from "primevue/divider";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import { getWeather } from "@/services/ApiService";
import type { WeatherData } from "@/interfaces/WeatherData";
import { Search } from "lucide-vue-next";

const toast = useToast();

const weather = ref<WeatherData | null>(null);

const inputCity = ref("");

async function fetchWeather(city: string) {
  const data = await getWeather(city);
  if (data) {
    weather.value = data;
    inputCity.value = "";
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

onMounted(() => {
  fetchWeather("Berlin");
});
</script>

<template>
  <Panel class="w-fit p-4">
    <template #header>
      <div class="flex flex-col">
      <h2 class="text-3xl font-bold">Jasons Wettervorhersage:</h2>
    <Divider />
    </div>
    </template>
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
      <Button @click="fetchWeather(inputCity)" outlined >
        <Search />
      </Button>
    </div>
    <div class="text-2xl font-bold mt-5">
      Wetter in {{ weather?.name }}, {{ weather?.sys.country }}
    </div>
    <div class="text-3xl font-bold">{{ weather?.main.temp }} °C</div>
    <div class="text-lg font-bold mt-4">
      Gefühlte {{ weather?.main.feels_like }} °C
    </div>
    <div class="flex flex-row text-lg font-bold items-center">
      <img
        :src="`https://openweathermap.org/img/wn/${weather?.weather[0].icon}.png`"
        alt="Weather Icon"
      />
      {{ weather?.weather[0].description }}
    </div>
    <div class="text-lg font-bold">
      Feuchtigkeit: {{ weather?.main.humidity }}%
    </div>
    <div class="text-lg font-bold">
      Windgeschwindigkeit: {{ weather?.wind.speed }} km/h
    </div>
  </Panel>
</template>
