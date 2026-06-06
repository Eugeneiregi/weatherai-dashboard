import axios from 'axios';
import { getMockCurrentWeather, getMockForecastWeather } from '../utils/mockData';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY ?? '';
// const USE_MOCK = true;
const USE_MOCK =
  !API_KEY ||
  API_KEY === 'demo_api_key_12345' ||
  API_KEY === '<your_real_key_here>';

// In dev, requests to /v1/* are proxied to https://api.weather-ai.co by Vite
// In production, we use the full base URL from env
const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_WEATHER_API_BASE_URL || 'https://api.weather-ai.co');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    ...(USE_MOCK ? {} : {
      Authorization: `Bearer ${API_KEY}`,
    }),
  },
});

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 15000,
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${API_KEY}`,
//   },
// });

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }
    if (error.response?.status === 401) {
      return Promise.reject(new Error('Invalid or expired API key. Please check your configuration.'));
    }
    if (error.response?.status === 403) {
      return Promise.reject(new Error('Access denied. Your plan may not include this feature.'));
    }
    if (error.response?.status === 429) {
      return Promise.reject(new Error('Monthly quota exceeded. Please upgrade your plan or wait for reset.'));
    }
    if (error.response?.status === 404) {
      return Promise.reject(new Error('Location not found. Try a different city.'));
    }
    if (error.response?.status === 400) {
      return Promise.reject(new Error('Invalid request parameters. Check latitude and longitude.'));
    }
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    return Promise.reject(new Error(error.response.data?.error || error.response.data?.message || 'Something went wrong.'));
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

function normalizeCurrent(raw: any, lat: number, lon: number): CurrentWeatherData {
  const loc = raw.location || raw.geo || {};
  const cur = raw.current || {};
  const units = raw.units || 'metric';

  return {
    location: {
      lat: loc.lat ?? lat,
      lon: loc.lon ?? lon,
      country: loc.country ?? loc.tz_id?.split('/')[0],
      timezone: loc.timezone ?? loc.tz_id,
      name: loc.name ?? loc.city,
    },
    current: {
      temperature: cur.temp_c ?? cur.temperature ?? (units === 'imperial' ? (cur.temp_f ?? cur.temperature) : (cur.temp_c ?? cur.temperature)),
      feels_like: cur.feelslike_c ?? cur.feels_like ?? 0,
      humidity: cur.humidity ?? 0,
      uv_index: cur.uv ?? cur.uv_index ?? 0,
      wind_speed: cur.wind_kph ?? cur.wind_speed ?? 0,
      wind_gust: cur.gust_kph ?? cur.wind_gust ?? 0,
      wind_direction: cur.wind_degree ?? cur.wind_direction ?? 0,
      weather_code: cur.condition?.code ?? cur.weather_code ?? 0,
      is_day: cur.is_day ?? true,
      precipitation: cur.precip_mm ?? cur.precipitation ?? cur.chance_of_rain ?? 0,
      pressure: cur.pressure_mb ?? cur.pressure ?? 1013,
      time: cur.last_updated ?? cur.time ?? new Date().toISOString(),
    },
    ai_summary: raw.ai_summary ?? raw.summary ?? undefined,
  };
}

function normalizeHourly(raw: any): HourlyData[] {
  const hours = raw.hourly ?? raw.hour ?? [];
  return hours.map((h: any) => ({
    time: h.time ?? h.dt ?? '',
    temperature: h.temp_c ?? h.temperature ?? 0,
    humidity: h.humidity ?? 0,
    wind_speed: h.wind_kph ?? h.wind_speed ?? 0,
    precipitation_probability: h.chance_of_rain ?? h.precip_probability ?? h.precipitation_probability ?? 0,
    weather_code: h.condition?.code ?? h.weather_code ?? 0,
    uv_index: h.uv ?? h.uv_index ?? 0,
    is_day: h.is_day ?? true,
  }));
}

function normalizeDaily(raw: any): DailyData[] {
  const days = raw.daily ?? raw.forecast?.forecastday ?? [];
  return days.map((d: any) => ({
    date: d.date ?? d.dt ?? '',
    weather_code: d.condition?.code ?? d.weather_code ?? 0,
    temperature_max: d.maxtemp_c ?? d.temperature_max ?? d.day?.maxtemp_c ?? 0,
    temperature_min: d.mintemp_c ?? d.temperature_min ?? d.day?.mintemp_c ?? 0,
    precipitation_probability: d.daily_chance_of_rain ?? d.precipitation_probability ?? d.day?.daily_chance_of_rain ?? 0,
    wind_speed_max: d.maxwind_kph ?? d.wind_speed_max ?? d.day?.maxwind_kph ?? 0,
    uv_index: d.uv ?? d.uv_index ?? d.day?.uv ?? 0,
    sunrise: d.astro?.sunrise ?? d.sunrise ?? '06:00',
    sunset: d.astro?.sunset ?? d.sunset ?? '18:00',
  }));
}

function normalizeForecast(raw: any, lat: number, lon: number): ForecastData {
  const loc = raw.location || raw.geo || {};
  return {
    location: {
      lat: loc.lat ?? lat,
      lon: loc.lon ?? lon,
      country: loc.country ?? loc.tz_id?.split('/')[0],
      timezone: loc.timezone ?? loc.tz_id,
      name: loc.name ?? loc.city,
    },
    hourly: normalizeHourly(raw),
    daily: normalizeDaily(raw),
    ai_summary: raw.ai_summary ?? raw.summary ?? undefined,
  };
}


//Kindly note I am Using this when I am running locally on my machine
export async function getCurrentWeather(
  lat: number,
  lon: number,
  units: 'metric' | 'imperial' = 'metric',
  lang: string = 'en'
): Promise<CurrentWeatherData> {
  if (USE_MOCK) {
    return getMockCurrentWeather(lat, lon, units);
  }
  const { data } = await api.get('/v1/current', {
    params: { lat, lon, ai: true, units, lang },
  });
  return normalizeCurrent(data, lat, lon);
}

//Kindly note I am Using this when I am running locally on my machine
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
  const { data } = await api.get('/v1/weather', {
    params: { lat, lon, days, ai: true, units, lang },
  });

  return normalizeForecast(data, lat, lon);
}
