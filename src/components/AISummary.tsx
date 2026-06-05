import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Sun, ShieldAlert, Umbrella, Wind } from 'lucide-react';
import type { CurrentWeatherData } from '../services/weatherService';

interface AISummaryProps {
  summary?: string;
  current: CurrentWeatherData;
}

function getInsights(data: CurrentWeatherData) {
  const insights: { icon: React.ReactNode; label: string; text: string; color: string }[] = [];
  const { current } = data;

  if (current.uv_index > 5) {
    insights.push({
      icon: <Sun className="w-5 h-5 text-orange-500" />,
      label: 'UV Warning',
      text: `UV index is ${current.uv_index}. Apply sunscreen and seek shade during peak hours.`,
      color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
    });
  }

  if (current.precipitation > 50) {
    insights.push({
      icon: <Umbrella className="w-5 h-5 text-blue-500" />,
      label: 'Rain Alert',
      text: 'High chance of precipitation. Carry an umbrella today.',
      color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    });
  }

  if (current.wind_speed > 30) {
    insights.push({
      icon: <Wind className="w-5 h-5 text-teal-500" />,
      label: 'Wind Warning',
      text: 'Strong winds expected. Secure loose outdoor items.',
      color: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800',
    });
  }

  if (current.temperature > 30 && current.humidity < 40) {
    insights.push({
      icon: <ShieldAlert className="w-5 h-5 text-red-500" />,
      label: 'Heat Advisory',
      text: 'Hot and dry conditions. Stay hydrated and avoid prolonged sun exposure.',
      color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    });
  }

  if (insights.length === 0) {
    insights.push({
      icon: <Sun className="w-5 h-5 text-accent-500" />,
      label: 'Good Conditions',
      text: 'Weather conditions are pleasant. Great time for outdoor activities!',
      color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    });
  }

  return insights;
}

const AISummary: React.FC<AISummaryProps> = ({ summary, current }) => {
  const insights = getInsights(current);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="space-y-3"
    >
      {summary && (
        <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl p-5 border border-primary-200 dark:border-primary-800">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
              AI Weather Summary
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {summary}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Weather Insights</h3>
        {insights.map((insight, i) => (
          <motion.div
            key={insight.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
            className={`flex items-start gap-3 rounded-xl p-4 border ${insight.color}`}
          >
            <div className="shrink-0 mt-0.5">{insight.icon}</div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {insight.label}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{insight.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AISummary;
