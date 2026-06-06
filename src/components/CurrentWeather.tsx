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
  Droplets,
  Wind,
  Eye,
  Sunrise,
  Sunset,
  MapPin,
  Clock,
  Thermometer,
} from 'lucide-react';
import type { CurrentWeatherData } from '../services/weatherService';
import { formatTemperature, formatTime, getWeatherLabel, getWindDirection } from '../utils/formatters';

interface CurrentWeatherProps {
  data: CurrentWeatherData;
  units: 'metric' | 'imperial';
  cityName?: string;
  onUnitToggle?: () => void;
}

function WeatherIcon({ code, isDay, size = 80 }: { code: number; isDay: boolean; size?: number }) {
  if (code === 0) return isDay ? <Sun className="text-yellow-300 drop-shadow-lg" size={size} /> : <MoonIcon size={size} />;
  if (code <= 3) return <Cloud className="text-slate-200 drop-shadow-lg" size={size} />;
  if (code <= 48) return <CloudFog className="text-slate-200 drop-shadow-lg" size={size} />;
  if (code <= 57) return <CloudDrizzle className="text-blue-200 drop-shadow-lg" size={size} />;
  if (code <= 67) return <CloudRain className="text-blue-200 drop-shadow-lg" size={size} />;
  if (code <= 77) return <CloudSnow className="text-blue-100 drop-shadow-lg" size={size} />;
  if (code <= 82) return <CloudRain className="text-blue-300 drop-shadow-lg" size={size} />;
  if (code <= 99) return <CloudLightning className="text-yellow-200 drop-shadow-lg" size={size} />;
  return <Cloud className="text-slate-200 drop-shadow-lg" size={size} />;
}

function MoonIcon({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-blue-200 drop-shadow-lg">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function getTimeBasedGradient(isDay: boolean, weatherCode: number) {
  if (!isDay) {
    return 'from-slate-800 via-slate-700 to-blue-900';
  }
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 8) return 'from-orange-400 via-pink-400 to-rose-500';
  if (hour >= 8 && hour < 17) {
    if (weatherCode <= 1) return 'from-sky-400 via-blue-500 to-blue-600';
    if (weatherCode <= 3) return 'from-sky-400 via-blue-400 to-slate-500';
    return 'from-slate-400 via-slate-500 to-slate-600';
  }
  if (hour >= 17 && hour < 20) return 'from-orange-500 via-rose-400 to-red-500';
  return 'from-slate-800 via-slate-700 to-blue-900';
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, units, cityName, onUnitToggle }) => {
  const { current, location } = data;
  const isDay = current.is_day;
  const gradient = getTimeBasedGradient(isDay, current.weather_code);

  const metrics = [
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${current.humidity}%`,
      color: 'text-blue-200',
    },
    {
      icon: Wind,
      label: 'Wind',
      value: `${current.wind_speed.toFixed(1)} ${units === 'metric' ? 'km/h' : 'mph'}`,
      color: 'text-teal-200',
    },
    {
      icon: Eye,
      label: 'Pressure',
      value: `${current.pressure} hPa`,
      color: 'text-purple-200',
    },
    {
      icon: Thermometer,
      label: 'UV Index',
      value: current.uv_index.toFixed(1),
      color: current.uv_index > 7 ? 'text-red-200' : 'text-yellow-200',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-3xl p-6 md:p-8 text-white shadow-2xl border border-white/20`}
    >
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 right-12 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-8 w-56 h-56 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header with location and unit toggle */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-5 h-5 text-white/80" />
              <h2 className="text-2xl font-bold tracking-tight">
                {cityName || `${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`}
              </h2>
            </div>
            <p className="text-white/70 text-sm ml-7">
              {current.time ? new Date(current.time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <div className="flex items-center gap-1.5 ml-7 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-white/60" />
              <p className="text-white/60 text-xs">
                {current.time ? formatTime(current.time) : new Date().toLocaleTimeString()}
                {location.timezone ? ` ${location.timezone}` : ''}
              </p>
            </div>
          </div>

          {onUnitToggle && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onUnitToggle}
              className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-semibold hover:bg-white/30 transition-colors duration-200 border border-white/20"
            >
              °{units === 'metric' ? 'C' : 'F'}
            </motion.button>
          )}
        </div>

        {/* Main temperature display */}
        <div className="flex items-center gap-6 md:gap-8 mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          >
            <WeatherIcon code={current.weather_code} isDay={isDay} size={96} />
          </motion.div>

          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-baseline"
            >
              <span className="text-7xl md:text-8xl font-extralight tracking-tighter leading-none">
                {Math.round(current.temperature)}
              </span>
              <span className="text-3xl font-light ml-1">°{units === 'metric' ? 'C' : 'F'}</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl font-medium text-white/90 capitalize mt-1"
            >
              {getWeatherLabel(current.weather_code)}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-white/70"
            >
              Feels like {formatTemperature(current.feels_like, units)} &bull; Wind {getWindDirection(current.wind_direction)}
            </motion.p>
          </div>
        </div>

        {/* Weather metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.08 }}
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.2)' }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transition-colors duration-200 cursor-default"
              >
                <div className="flex items-center gap-3">
                  <IconComponent size={20} className={metric.color} />
                  <div>
                    <p className="text-white/60 text-[10px] uppercase tracking-widest font-semibold">
                      {metric.label}
                    </p>
                    <p className="text-white font-bold text-lg">{metric.value}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Precipitation & Sunrise/Sunset bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1 flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <Sunrise size={20} className="text-orange-300" />
              <div>
                <p className="text-white/60 text-[10px] uppercase tracking-widest font-semibold">Sunrise</p>
                <p className="text-white font-semibold text-sm">6:15 AM</p>
              </div>
            </div>

            <div className="w-px h-8 bg-white/20" />

            <div className="flex items-center gap-2">
              <Sunset size={20} className="text-orange-300" />
              <div>
                <p className="text-white/60 text-[10px] uppercase tracking-widest font-semibold">Sunset</p>
                <p className="text-white font-semibold text-sm">6:30 PM</p>
              </div>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4"
          >
            <CloudRain className="text-blue-200" size={20} />
            <div>
              <p className="text-white/60 text-[10px] uppercase tracking-widest font-semibold">Precipitation</p>
              <p className="text-white font-bold text-lg">{current.precipitation}%</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CurrentWeather;
