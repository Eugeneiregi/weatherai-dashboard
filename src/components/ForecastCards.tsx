import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets,
  Wind,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  Sunrise,
  Sunset,
  X,
  Thermometer,
} from 'lucide-react';
import type { DailyData } from '../services/weatherService';
import { formatDay, formatTemperature, getWeatherLabel } from '../utils/formatters';

interface ForecastCardsProps {
  data: DailyData[];
  units: 'metric' | 'imperial';
}

function DayWeatherIcon({ code, size = 32 }: { code: number; size?: number }) {
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
  const [selectedDay, setSelectedDay] = useState<DailyData | null>(null);

  const tempRange = data.reduce(
    (acc, d) => ({
      min: Math.min(acc.min, d.temperature_min),
      max: Math.max(acc.max, d.temperature_max),
    }),
    { min: Infinity, max: -Infinity }
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">7-Day Forecast</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {data.map((day, i) => {
            const barLeft = tempRange.max !== tempRange.min
              ? ((day.temperature_min - tempRange.min) / (tempRange.max - tempRange.min)) * 100
              : 0;
            const barWidth = tempRange.max !== tempRange.min
              ? ((day.temperature_max - day.temperature_min) / (tempRange.max - tempRange.min)) * 100
              : 100;

            return (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedDay(day)}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all cursor-pointer text-center group"
              >
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                  {formatDay(day.date)}
                </p>
                <div className="flex justify-center mb-2">
                  <DayWeatherIcon code={day.weather_code} size={36} />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 group-hover:text-primary-500 transition-colors">
                  {getWeatherLabel(day.weather_code)}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm mb-2">
                  <span className="font-bold text-slate-800 dark:text-white">
                    {formatTemperature(day.temperature_max, units)}
                  </span>
                  <span className="text-slate-400">
                    {formatTemperature(day.temperature_min, units)}
                  </span>
                </div>

                {/* Temperature range bar */}
                <div className="relative h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 + 0.3 }}
                    className="absolute top-0 h-full rounded-full bg-gradient-to-r from-blue-400 via-primary-400 to-orange-400"
                    style={{ left: `${barLeft}%` }}
                  />
                </div>

                <div className="space-y-1">
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
            );
          })}
        </div>
      </motion.div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDay(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden z-10"
            >
              {/* Header gradient */}
              <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-blue-600 p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-2 right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute bottom-0 left-4 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-2xl font-bold">{formatDay(selectedDay.date)}</p>
                      <p className="text-white/70 text-sm mt-1">{selectedDay.date}</p>
                    </div>
                    <button
                      onClick={() => setSelectedDay(null)}
                      className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    >
                      <DayWeatherIcon code={selectedDay.weather_code} size={72} />
                    </motion.div>
                    <div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="text-4xl font-light">{Math.round(selectedDay.temperature_max)}°</span>
                        <span className="text-xl text-white/70 ml-1">{Math.round(selectedDay.temperature_min)}°</span>
                      </motion.div>
                      <p className="text-white/90 font-medium capitalize mt-1">
                        {getWeatherLabel(selectedDay.weather_code)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Droplets, label: 'Precipitation', value: `${selectedDay.precipitation_probability}%`, color: 'text-blue-500' },
                    { icon: Wind, label: 'Max Wind', value: `${selectedDay.wind_speed_max.toFixed(1)} ${units === 'metric' ? 'km/h' : 'mph'}`, color: 'text-teal-500' },
                    { icon: Sun, label: 'UV Index', value: selectedDay.uv_index.toFixed(1), color: 'text-yellow-500' },
                    { icon: Sunrise, label: 'Sunrise', value: selectedDay.sunrise, color: 'text-orange-500' },
                    { icon: Sunset, label: 'Sunset', value: selectedDay.sunset, color: 'text-orange-500' },
                    { icon: Thermometer, label: 'Temp Range', value: `${formatTemperature(selectedDay.temperature_min, units)} - ${formatTemperature(selectedDay.temperature_max, units)}`, color: 'text-red-500' },
                  ].map((detail, i) => {
                    const Icon = detail.icon;
                    return (
                      <motion.div
                        key={detail.label}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.06 }}
                        className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3"
                      >
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm">
                          <Icon className={`w-4 h-4 ${detail.color}`} size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold">{detail.label}</p>
                          <p className="text-sm font-bold text-slate-700 dark:text-white">{detail.value}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Temperature bar visualization */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700"
                >
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Temperature Range</p>
                  <div className="relative h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-400 via-primary-400 to-orange-400"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>{formatTemperature(selectedDay.temperature_min, units)}</span>
                    <span>{formatTemperature(selectedDay.temperature_max, units)}</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ForecastCards;
