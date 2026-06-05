import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Wind } from 'lucide-react';
import type { DailyData } from '../services/weatherService';
import { formatDay, formatTemperature, getWeatherLabel } from '../utils/formatters';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
} from 'lucide-react';

interface ForecastCardsProps {
  data: DailyData[];
  units: 'metric' | 'imperial';
}

function DayWeatherIcon({ code }: { code: number }) {
  const size = 32;
  if (code === 0) return <Sun className="text-yellow-400" size={size} />;
  if (code <= 3) return <Cloud className="text-slate-400" size={size} />;
  if (code <= 48) return <CloudFog className="text-slate-400" size={size} />;
  if (code <= 57) return <CloudDrizzle className="text-blue-400" size={size} />;
  if (code <= 67) return <CloudRain className="text-blue-500" size={size} />;
  if (code <= 77) return <CloudSnow className="text-blue-200" size={size} />;
  if (code <= 82) return <CloudRain className="text-blue-600" size={size} />;
  if (code <= 99) return <CloudLightning className="text-yellow-500" size={size} />;
  return <Cloud className="text-slate-400" size={size} />;
}

const ForecastCards: React.FC<ForecastCardsProps> = ({ data, units }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">7-Day Forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {data.map((day, i) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              {formatDay(day.date)}
            </p>
            <div className="flex justify-center mb-2">
              <DayWeatherIcon code={day.weather_code} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              {getWeatherLabel(day.weather_code)}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="font-bold text-slate-800 dark:text-white">
                {formatTemperature(day.temperature_max, units)}
              </span>
              <span className="text-slate-400">
                {formatTemperature(day.temperature_min, units)}
              </span>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Droplets className="w-3 h-3" />
                <span>{day.precipitation_probability}%</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Wind className="w-3 h-3" />
                <span>{day.wind_speed_max.toFixed(0)} {units === 'metric' ? 'km/h' : 'mph'}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ForecastCards;
