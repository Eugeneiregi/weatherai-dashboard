import { useState, useCallback, useEffect, useRef } from 'react';
import {
  getCurrentWeather,
  getForecastWeather,
  type CurrentWeatherData,
  type ForecastData,
} from '../services/weatherService';

interface UseWeatherReturn {
  current: CurrentWeatherData | null;
  forecast: ForecastData | null;
  loading: boolean;
  error: string | null;
  fetchWeather: (lat: number, lon: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000;
const DEFAULT_LAT = -1.2921;
const DEFAULT_LON = 36.8219;

export function useWeather(units: 'metric' | 'imperial' = 'metric', lang: string = 'en'): UseWeatherReturn {
  const [current, setCurrent] = useState<CurrentWeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastCoords = useRef({ lat: DEFAULT_LAT, lon: DEFAULT_LON });

  const fetchWeather = useCallback(
    async (lat: number, lon: number) => {
      lastCoords.current = { lat, lon };
      setLoading(true);
      setError(null);
      try {
        const [currentData, forecastData] = await Promise.all([
          getCurrentWeather(lat, lon, units, lang),
          getForecastWeather(lat, lon, 7, units, lang),
        ]);
        setCurrent(currentData);
        setForecast(forecastData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch weather data';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [units, lang]
  );

  const refresh = useCallback(async () => {
    const { lat, lon } = lastCoords.current;
    await fetchWeather(lat, lon);
  }, [fetchWeather]);

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refresh]);

  return { current, forecast, loading, error, fetchWeather, refresh };
}
