import React from 'react';
import { CloudSun, Moon, Sun, RefreshCw, Thermometer, Globe, Menu } from 'lucide-react';
import SearchBar from './SearchBar';

interface NavbarProps {
  darkMode: boolean;
  onToggleDark: () => void;
  units: 'metric' | 'imperial';
  onToggleUnits: () => void;
  lang: string;
  onToggleLang: () => void;
  onRefresh: () => void;
  onSelectCity: (lat: number, lon: number, name: string) => void;
  favorites: string[];
  onToggleFavorite: (name: string) => void;
  currentCity?: string;
  loading?: boolean;
  onMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDark,
  units,
  onToggleUnits,
  lang,
  onToggleLang,
  onRefresh,
  onSelectCity,
  favorites,
  onToggleFavorite,
  currentCity,
  loading,
  onMenuToggle,
}) => {
  return (
    <nav className="sticky top-0 z-30 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <CloudSun className="w-8 h-8 text-primary-500" />
              <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
                WeatherAI
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center">
            <SearchBar
              onSelectCity={onSelectCity}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              currentCity={currentCity}
            />
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            

            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onToggleUnits}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300"
              title="Toggle units"
            >
              <Thermometer className="w-4 h-4" />
              <span className="hidden sm:inline">{units === 'metric' ? '°C' : '°F'}</span>
            </button>

            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-600 dark:text-slate-300"
              title="Toggle language"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'en' ? 'EN' : 'SW'}</span>
            </button>

            <button
              onClick={onToggleDark}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={onMenuToggle}
              className="hidden lg:flex p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
              title="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="md:hidden pb-3">
          <SearchBar
            onSelectCity={onSelectCity}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            currentCity={currentCity}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
