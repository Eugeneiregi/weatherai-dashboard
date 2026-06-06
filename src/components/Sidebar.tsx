import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudSun,
  Thermometer,
  BarChart3,
  Calendar,
  Sparkles,
  MapPin,
  Settings,
  ChevronLeft,
  Sun,
  Moon,
  Globe,
  RefreshCw,
  Heart,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
  units: 'metric' | 'imperial';
  onToggleUnits: () => void;
  lang: string;
  onToggleLang: () => void;
  onRefresh: () => void;
  loading?: boolean;
  currentCity?: string;
  favorites: string[];
  onToggleFavorite: (name: string) => void;
  onSelectCity: (lat: number, lon: number, name: string) => void;
  activeSection: string;
  onNavigate: (section: string) => void;
}

const NAV_ITEMS = [
  { id: 'current', label: 'Current Weather', icon: CloudSun },
  { id: 'hourly', label: 'Hourly Forecast', icon: Thermometer },
  { id: 'chart', label: 'Charts & Trends', icon: BarChart3 },
  { id: 'forecast', label: '7-Day Forecast', icon: Calendar },
  { id: 'ai', label: 'AI Insights', icon: Sparkles },
  { id: 'location', label: 'Location', icon: MapPin },
];

const FAVORITE_CITIES = [
  { name: 'Nairobi', lat: -1.2921, lon: 36.8219 },
  { name: 'Mombasa', lat: -4.0435, lon: 39.6682 },
  { name: 'Kisumu', lat: -0.0917, lon: 34.7681 },
  { name: 'Eldoret', lat: 0.5143, lon: 35.2698 },
  { name: 'Nakuru', lat: -0.3031, lon: 36.0800 },
];

const Sidebar: React.FC<SidebarProps> = ({
  open,
  onClose,
  darkMode,
  onToggleDark,
  units,
  onToggleUnits,
  lang,
  onToggleLang,
  onRefresh,
  loading,
  currentCity,
  favorites,
  onToggleFavorite,
  onSelectCity,
  activeSection,
  onNavigate,
}) => {
  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: open ? 0 : -320,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-50 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-900/30">
              <CloudSun className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">WeatherAI</h1>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">Dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-2">Navigation</p>
          <div className="space-y-1 mb-6">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" size={18} />
                  {item.label}
                </motion.button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-2">Quick Actions</p>
          <div className="space-y-1 mb-6">
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRefresh}
              disabled={loading}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} size={16} />
              Refresh Data
            </motion.button>

            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={onToggleDark}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" size={16} /> : <Moon className="w-4 h-4" size={16} />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </motion.button>

            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={onToggleUnits}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Thermometer className="w-4 h-4" size={16} />
              {units === 'metric' ? 'Switch to °F' : 'Switch to °C'}
            </motion.button>

            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={onToggleLang}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Globe className="w-4 h-4" size={16} />
              {lang === 'en' ? 'Kiswahili' : 'English'}
            </motion.button>
          </div>

          {/* Cities */}
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-2">Cities</p>
          <div className="space-y-1">
            {FAVORITE_CITIES.map((city) => {
              const isFav = favorites.includes(city.name);
              const isCurrent = currentCity === city.name;
              return (
                <motion.button
                  key={city.name}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectCity(city.lat, city.lon, city.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isCurrent
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" size={14} />
                    {city.name}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(city.name);
                    }}
                    className="p-0.5"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${isFav ? 'text-red-500 fill-red-500' : 'text-slate-300'}`}
                      size={14}
                    />
                  </button>
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Settings className="w-3.5 h-3.5" size={14} />
            <span>WeatherAI v1.0</span>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
