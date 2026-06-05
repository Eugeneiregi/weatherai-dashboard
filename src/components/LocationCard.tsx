import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, Clock, Navigation } from 'lucide-react';

interface LocationCardProps {
  lat: number;
  lon: number;
  country?: string;
  timezone?: string;
  cityName?: string;
}

const LocationCard: React.FC<LocationCardProps> = ({ lat, lon, country, timezone, cityName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Location Info</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30">
            <MapPin className="w-4 h-4 text-primary-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Coordinates</p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {lat.toFixed(4)}, {lon.toFixed(4)}
            </p>
          </div>
        </div>
        {cityName && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-50 dark:bg-accent-900/30">
              <Navigation className="w-4 h-4 text-accent-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">City</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{cityName}</p>
            </div>
          </div>
        )}
        {country && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
              <Globe className="w-4 h-4 text-indigo-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Country</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{country}</p>
            </div>
          </div>
        )}
        {timezone && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-900/30">
              <Clock className="w-4 h-4 text-teal-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Timezone</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{timezone}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LocationCard;
