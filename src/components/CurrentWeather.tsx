import React from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  MapPin,
  Clock,
  Droplets,
  Wind,
} from 'lucide-react';
import type { CurrentWeatherData } from '../services/weatherService';
import { formatTemperature, formatTime, getWeatherLabel } from '../utils/formatters';

interface CurrentWeatherProps {
  data: CurrentWeatherData;
  units: 'metric' | 'imperial';
  cityName?: string;
}

function WeatherIcon({ code, isDay, size = 64 }: { code: number; isDay: boolean; size?: number }) {
  const cls = `text-${isDay ? 'yellow-400' : 'blue-300'}`;
  if (code === 0) return isDay ? <Sun className={cls} size={size} /> : <Moon2Icon size={size} />;
  if (code <= 3) return <Cloud className="text-slate-400" size={size} />;
  if (code <= 48) return <CloudFog className="text-slate-400" size={size} />;
  if (code <= 57) return <CloudDrizzle className="text-blue-400" size={size} />;
  if (code <= 67) return <CloudRain className="text-blue-500" size={size} />;
  if (code <= 77) return <CloudSnow className="text-blue-200" size={size} />;
  if (code <= 82) return <CloudRain className="text-blue-600" size={size} />;
  if (code <= 99) return <CloudLightning className="text-yellow-500" size={size} />;
  return <Cloud className="text-slate-400" size={size} />;
}

function Moon2Icon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-blue-300">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, units, cityName }) => {
  const { current, location } = data;
  const isDay = current.is_day;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-blue-700 p-6 md:p-8 text-white shadow-xl"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium opacity-90">
                {cityName || `${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`}
              </span>
            </div>
            {location.timezone && (
              <p className="text-xs opacity-70">{location.timezone}</p>
            )}
          </div>
          <div className="text-right">
            <Clock className="w-4 h-4 opacity-70 ml-auto mb-1" />
            <p className="text-xs opacity-70">
              {current.time ? formatTime(current.time) : new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <WeatherIcon code={current.weather_code} isDay={isDay} size={72} />
          <div>
            <div className="text-5xl md:text-7xl font-bold tracking-tighter">
              {formatTemperature(current.temperature, units)}
            </div>
            <p className="text-lg font-medium opacity-90 mt-1">
              {getWeatherLabel(current.weather_code)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-6 text-sm opacity-80">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-4 h-4" />
            <span>{current.humidity}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind className="w-4 h-4" />
            <span>{current.wind_speed.toFixed(1)} {units === 'metric' ? 'km/h' : 'mph'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium">Feels like {formatTemperature(current.feels_like, units)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentWeather;
