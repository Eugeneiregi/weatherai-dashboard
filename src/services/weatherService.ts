import axios from 'axios';
import { getMockCurrentWeather, getMockForecastWeather } from '../utils/mockData';

const API_BASE_URL = import.meta.env.VITE_WEATHER_API_BASE_URL || 'https://api.weather-ai.co';
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '';
const USE_MOCK = !API_KEY || API_KEY === 'demo_api_key_12345';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }
    if (error.response?.status === 401) {
      return Promise.reject(new Error('Invalid API key. Please check your configuration.'));
    }
    if (error.response?.status === 404) {
      return Promise.reject(new Error('Location not found. Try a different city.'));
    }
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    return Promise.reject(new Error(error.response.data?.message || 'Something went wrong.'));
  }
);

export interface CurrentWeatherData {
  location: {
    lat: number;
    lon: number;
    country?: string;
    timezone?: string;
    name?: string;
  };
  current: {
    temperature: number;
    feels_like: number;
    humidity: number;
    uv_index: number;
    wind_speed: number;
    wind_gust: number;
    wind_direction: number;
    weather_code: number;
    is_day: boolean;
    precipitation: number;
    pressure: number;
    time: string;
  };
  ai_summary?: string;
}

export interface HourlyData {
  time: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  precipitation_probability: number;
  weather_code: number;
  uv_index: number;
  is_day: boolean;
}

export interface DailyData {
  date: string;
  weather_code: number;
  temperature_max: number;
  temperature_min: number;
  precipitation_probability: number;
  wind_speed_max: number;
  uv_index: number;
  sunrise: string;
  sunset: string;
}

export interface ForecastData {
  location: {
    lat: number;
    lon: number;
    country?: string;
    timezone?: string;
    name?: string;
  };
  hourly: HourlyData[];
  daily: DailyData[];
  ai_summary?: string;
}

export async function getCurrentWeather(
  lat: number,
  lon: number,
  units: 'metric' | 'imperial' = 'metric',
  lang: string = 'en'
): Promise<CurrentWeatherData> {
  if (USE_MOCK) {
    return getMockCurrentWeather(lat, lon, units);
  }
  const { data } = await api.get('/api/v1/current', {
    params: { lat, lon, ai: true, units, lang },
  });
  return data;
}

export async function getForecastWeather(
  lat: number,
  lon: number,
  days: number = 7,
  units: 'metric' | 'imperial' = 'metric',
  lang: string = 'en'
): Promise<ForecastData> {
  if (USE_MOCK) {
    return getMockForecastWeather(lat, lon, units);
  }
  const { data } = await api.get('/api/v1/weather', {
    params: { lat, lon, days, ai: true, units, lang },
  });
  return data;
}
