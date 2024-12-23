import axios from "axios";
import type { WeatherData } from "@/interfaces/WeatherData";

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function getWeather(city: string): Promise<WeatherData | null> {
  const queryParams = `q=${city}&units=metric&lang=de&appid=${apiKey}`;
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?${queryParams}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch weather data: ", error);
    return null;
  }
}
