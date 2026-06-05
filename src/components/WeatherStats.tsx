import React from 'react';
import { motion } from 'framer-motion';
import {
  Thermometer,
  Droplets,
  Sun,
  Wind,
  Compass,
  CloudRain,
} from 'lucide-react';
import type { CurrentWeatherData } from '../services/weatherService';
import { formatTemperature, formatWindSpeed, formatUV, getWindDirection } from '../utils/formatters';

interface WeatherStatsProps {
  data: CurrentWeatherData;
  units: 'metric' | 'imperial';
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  delay: number;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, subValue, delay, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
  >
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 rounded-lg ${color || 'bg-primary-50 dark:bg-primary-900/30'}`}>
        {icon}
      </div>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {label}
      </span>
    </div>
    <div className="text-2xl font-bold text-slate-800 dark:text-white">{value}</div>
    {subValue && (
      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subValue}</div>
    )}
  </motion.div>
);

const WeatherStats: React.FC<WeatherStatsProps> = ({ data, units }) => {
  const { current } = data;

  const stats = [
    {
      icon: <Thermometer className="w-5 h-5 text-primary-500" />,
      label: 'Temperature',
      value: formatTemperature(current.temperature, units),
      color: 'bg-primary-50 dark:bg-primary-900/30',
    },
    {
      icon: <Thermometer className="w-5 h-5 text-orange-500" />,
      label: 'Feels Like',
      value: formatTemperature(current.feels_like, units),
      color: 'bg-orange-50 dark:bg-orange-900/30',
    },
    {
      icon: <Droplets className="w-5 h-5 text-blue-500" />,
      label: 'Humidity',
      value: `${current.humidity}%`,
      color: 'bg-blue-50 dark:bg-blue-900/30',
    },
    {
      icon: <Sun className={`w-5 h-5 ${current.uv_index > 5 ? 'text-orange-500' : 'text-yellow-500'}`} />,
      label: 'UV Index',
      value: formatUV(current.uv_index),
      color: current.uv_index > 5 ? 'bg-orange-50 dark:bg-orange-900/30' : 'bg-yellow-50 dark:bg-yellow-900/30',
    },
    {
      icon: <Wind className="w-5 h-5 text-teal-500" />,
      label: 'Wind Speed',
      value: formatWindSpeed(current.wind_speed, units),
      color: 'bg-teal-50 dark:bg-teal-900/30',
    },
    {
      icon: <Wind className="w-5 h-5 text-cyan-500" />,
      label: 'Wind Gust',
      value: formatWindSpeed(current.wind_gust, units),
      color: 'bg-cyan-50 dark:bg-cyan-900/30',
    },
    {
      icon: <Compass className="w-5 h-5 text-indigo-500" />,
      label: 'Wind Direction',
      value: `${getWindDirection(current.wind_direction)}`,
      subValue: `${current.wind_direction}°`,
      color: 'bg-indigo-50 dark:bg-indigo-900/30',
    },
    {
      icon: <CloudRain className="w-5 h-5 text-sky-500" />,
      label: 'Precipitation',
      value: `${current.precipitation}%`,
      color: 'bg-sky-50 dark:bg-sky-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <StatCard
          key={stat.label}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          subValue={stat.subValue}
          delay={i * 0.05}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default WeatherStats;
