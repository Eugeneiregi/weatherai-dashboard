import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ComposedChart,
} from 'recharts';
import type { HourlyData } from '../services/weatherService';
import { formatHour } from '../utils/formatters';
import { Thermometer, Droplets, Wind, BarChart3 } from 'lucide-react';

interface WeatherChartProps {
  data: HourlyData[];
  units: 'metric' | 'imperial';
}

type ChartView = 'temperature' | 'humidity' | 'wind' | 'combined';

const ChartViewButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
      active
        ? 'bg-primary-500 text-white shadow-md'
        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
    }`}
  >
    {icon}
    {label}
  </motion.button>
);

const WeatherChart: React.FC<WeatherChartProps> = ({ data, units }) => {
  const [view, setView] = useState<ChartView>('combined');

  const chartData = useMemo(() => {
    return data.slice(0, 24).map((h) => ({
      time: formatHour(h.time),
      temperature: Math.round(h.temperature),
      humidity: h.humidity,
      wind: Math.round(h.wind_speed),
      unit: units === 'metric' ? 'C' : 'F',
    }));
  }, [data, units]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-5 md:p-6 border border-slate-100 dark:border-slate-700 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            Weather Trends
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <ChartViewButton
            active={view === 'combined'}
            onClick={() => setView('combined')}
            icon={<BarChart3 size={14} />}
            label="Combined"
          />
          <ChartViewButton
            active={view === 'temperature'}
            onClick={() => setView('temperature')}
            icon={<Thermometer size={14} />}
            label="Temp"
          />
          <ChartViewButton
            active={view === 'humidity'}
            onClick={() => setView('humidity')}
            icon={<Droplets size={14} />}
            label="Humidity"
          />
          <ChartViewButton
            active={view === 'wind'}
            onClick={() => setView('wind')}
            icon={<Wind size={14} />}
            label="Wind"
          />
        </div>
      </div>

      <div className="h-72 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {view === 'combined' ? (
            <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="humidGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                interval={2}
              />
              <YAxis
                yAxisId="temp"
                tick={{ fontSize: 11, fill: '#3b82f6' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${v}°`}
              />
              <YAxis
                yAxisId="humid"
                orientation="right"
                tick={{ fontSize: 11, fill: '#22c55e' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip content={<CombinedTooltip />} />
              <Area
                yAxisId="temp"
                type="monotone"
                dataKey="temperature"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#tempGrad)"
                dot={false}
                activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                animationDuration={1200}
                animationEasing="ease-out"
              />
              <Area
                yAxisId="humid"
                type="monotone"
                dataKey="humidity"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#humidGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
                animationDuration={1400}
                animationEasing="ease-out"
              />
              <Bar
                yAxisId="temp"
                dataKey="wind"
                fill="#94a3b8"
                opacity={0.3}
                radius={[2, 2, 0, 0]}
                barSize={8}
                animationDuration={1000}
              />
            </ComposedChart>
          ) : view === 'temperature' ? (
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="tempGradSingle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} interval={2} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `${v}°`} />
              <Tooltip content={<SingleTooltip label="Temperature" color="#3b82f6" />} />
              <Area type="monotone" dataKey="temperature" stroke="#3b82f6" strokeWidth={3} fill="url(#tempGradSingle)" dot={false} activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} animationDuration={1200} animationEasing="ease-out" />
            </AreaChart>
          ) : view === 'humidity' ? (
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="humidGradSingle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} interval={2} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `${v}%`} domain={[0, 100]} />
              <Tooltip content={<SingleTooltip label="Humidity" color="#22c55e" suffix="%" />} />
              <Area type="monotone" dataKey="humidity" stroke="#22c55e" strokeWidth={3} fill="url(#humidGradSingle)" dot={false} activeDot={{ r: 6, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }} animationDuration={1200} animationEasing="ease-out" />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={1} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} interval={2} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `${v}`} />
              <Tooltip content={<SingleTooltip label="Wind Speed" color="#f59e0b" suffix=" km/h" />} />
              <Bar dataKey="wind" fill="url(#windGrad)" radius={[4, 4, 0, 0]} animationDuration={1000} animationEasing="ease-out" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

const CombinedTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 mb-1 last:mb-0">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-500 dark:text-slate-400">{entry.dataKey}:</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {entry.dataKey === 'temperature' ? `${entry.value}°` : entry.dataKey === 'humidity' ? `${entry.value}%` : `${entry.value} km/h`}
          </span>
        </div>
      ))}
    </div>
  );
};

const SingleTooltip = ({ active, payload, label, color, suffix = '' }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-bold text-base" style={{ color }}>{payload[0].value}{suffix}</span>
      </div>
    </div>
  );
};

export default WeatherChart;
