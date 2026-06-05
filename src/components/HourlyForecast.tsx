import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Wind, CloudRain } from 'lucide-react';
import type { HourlyData } from '../services/weatherService';
import { formatHour, formatTemperature } from '../utils/formatters';
import {
  Sun,
  Cloud,
  CloudRain as CloudRainIcon,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
} from 'lucide-react';

interface HourlyForecastProps {
  data: HourlyData[];
  units: 'metric' | 'imperial';
}

function SmallWeatherIcon({ code, isDay }: { code: number; isDay: boolean }) {
  const size = 24;
  if (code === 0) return isDay ? <Sun className="text-yellow-400" size={size} /> : <MoonSm size={size} />;
  if (code <= 3) return <Cloud className="text-slate-400" size={size} />;
  if (code <= 48) return <CloudFog className="text-slate-400" size={size} />;
  if (code <= 57) return <CloudDrizzle className="text-blue-400" size={size} />;
  if (code <= 67) return <CloudRainIcon className="text-blue-500" size={size} />;
  if (code <= 77) return <CloudSnow className="text-blue-200" size={size} />;
  if (code <= 82) return <CloudRainIcon className="text-blue-600" size={size} />;
  if (code <= 99) return <CloudLightning className="text-yellow-500" size={size} />;
  return <Cloud className="text-slate-400" size={size} />;
}

function MoonSm({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-blue-300">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ data, units }) => {
  const hours = data.slice(0, 24);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">Hourly Forecast</h3>
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
        {hours.map((hour, i) => (
          <motion.div
            key={hour.time}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.02 }}
            className="shrink-0 w-24 bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              {formatHour(hour.time)}
            </p>
            <div className="flex justify-center mb-2">
              <SmallWeatherIcon code={hour.weather_code} isDay={hour.is_day} />
            </div>
            <p className="text-lg font-bold text-slate-800 dark:text-white">
              {formatTemperature(hour.temperature, units)}
            </p>
            <div className="flex items-center justify-center gap-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
              <Droplets className="w-3 h-3" />
              <span>{hour.humidity}%</span>
            </div>
            <div className="flex items-center justify-center gap-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
              <Wind className="w-3 h-3" />
              <span>{hour.wind_speed.toFixed(0)}</span>
            </div>
            {hour.precipitation_probability > 0 && (
              <div className="flex items-center justify-center gap-1 mt-1 text-xs text-blue-500">
                <CloudRain className="w-3 h-3" />
                <span>{hour.precipitation_probability}%</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HourlyForecast;
