import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import CurrentWeather from '../components/CurrentWeather';
import WeatherStats from '../components/WeatherStats';
import HourlyForecast from '../components/HourlyForecast';
import WeatherChart from '../components/WeatherChart';
import ForecastCards from '../components/ForecastCards';
import AISummary from '../components/AISummary';
import LocationCard from '../components/LocationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useWeather } from '../hooks/useWeather';
import { getWeatherBackground } from '../utils/formatters';

const DEFAULT_LAT = -1.2921;
const DEFAULT_LON = 36.8219;

function getStoredValue<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

const Dashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => getStoredValue('darkMode', false));
  const [units, setUnits] = useState<'metric' | 'imperial'>(() => getStoredValue('units', 'metric'));
  const [lang, setLang] = useState(() => getStoredValue('lang', 'en'));
  const [currentCity, setCurrentCity] = useState<string>('Nairobi');
  const [coords, setCoords] = useState({ lat: DEFAULT_LAT, lon: DEFAULT_LON });
  const [geoRequested, setGeoRequested] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => getStoredValue('favoriteCities', []));

  const { current, forecast, loading, error, fetchWeather, refresh } = useWeather(units, lang);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('units', JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem('lang', JSON.stringify(lang));
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('favoriteCities', JSON.stringify(favorites));
  }, [favorites]);

  // Geolocation on first load
  useEffect(() => {
    if (geoRequested) return;
    setGeoRequested(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lon: longitude });
          setCurrentCity('');
          fetchWeather(latitude, longitude);
        },
        () => {
          fetchWeather(DEFAULT_LAT, DEFAULT_LON);
        }
      );
    } else {
      fetchWeather(DEFAULT_LAT, DEFAULT_LON);
    }
  }, [geoRequested, fetchWeather]);

  useEffect(() => {
    if (coords.lat && coords.lon && geoRequested) {
      fetchWeather(coords.lat, coords.lon);
    }
  }, [units, lang]);

  const handleSelectCity = useCallback(
    (lat: number, lon: number, name: string) => {
      setCoords({ lat, lon });
      setCurrentCity(name);
      fetchWeather(lat, lon);
    },
    [fetchWeather]
  );

  const toggleDark = useCallback(() => setDarkMode((d) => !d), []);
  const toggleUnits = useCallback(() => setUnits((u) => (u === 'metric' ? 'imperial' : 'metric')), []);
  const toggleLang = useCallback(() => setLang((l) => (l === 'en' ? 'sw' : 'en')), []);

  const toggleFavorite = useCallback((name: string) => {
    setFavorites((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  }, []);

  const weatherCode = current?.current?.weather_code ?? 0;
  const isDay = current?.current?.is_day ?? true;
  const bgGradient = getWeatherBackground(weatherCode, isDay);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-all duration-700`}>
      <div className="min-h-screen bg-white/70 dark:bg-slate-950/80 backdrop-blur-sm transition-colors duration-300">
        <Navbar
          darkMode={darkMode}
          onToggleDark={toggleDark}
          units={units}
          onToggleUnits={toggleUnits}
          lang={lang}
          onToggleLang={toggleLang}
          onRefresh={refresh}
          onSelectCity={handleSelectCity}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          currentCity={currentCity}
          loading={loading}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {loading && !current && <LoadingSpinner />}

          {error && !current && <ErrorMessage message={error} onRetry={refresh} />}

          {current && (
            <>
              <CurrentWeather
                data={current}
                units={units}
                cityName={currentCity}
              />

              <WeatherStats data={current} units={units} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <HourlyForecast
                    data={forecast?.hourly ?? []}
                    units={units}
                  />
                </div>
                <div>
                  <LocationCard
                    lat={current.location.lat}
                    lon={current.location.lon}
                    country={current.location.country}
                    timezone={current.location.timezone}
                    cityName={currentCity}
                  />
                </div>
              </div>

              <WeatherChart data={forecast?.hourly ?? []} units={units} />

              <ForecastCards data={forecast?.daily ?? []} units={units} />

              <AISummary
                summary={current.ai_summary || forecast?.ai_summary}
                current={current}
              />
            </>
          )}

          {loading && current && (
            <div className="flex items-center justify-center py-4 gap-2 text-sm text-slate-500 dark:text-slate-400">
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <span>Updating weather data...</span>
            </div>
          )}
        </main>

        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8">
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              WeatherAI Dashboard &mdash; Powered by WeatherAI API &bull; Built with React, Recharts &amp; Tailwind CSS
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
