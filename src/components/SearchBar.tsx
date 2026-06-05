import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Star, StarOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CITIES } from '../utils/formatters';

interface SearchBarProps {
  onSelectCity: (lat: number, lon: number, name: string) => void;
  favorites: string[];
  onToggleFavorite: (name: string) => void;
  currentCity?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelectCity, favorites, onToggleFavorite, currentCity }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCities = CITIES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 shadow-sm">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search city..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 w-40 md:w-56"
        />
        <ChevronDown className="w-4 h-4 text-slate-400 cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-50 overflow-hidden"
          >
            {filteredCities.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500">No cities found</div>
            ) : (
              filteredCities.map((city) => {
                const isFav = favorites.includes(city.name);
                return (
                  <button
                    key={city.name}
                    onClick={() => {
                      onSelectCity(city.lat, city.lon, city.name);
                      setQuery('');
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors ${
                      currentCity === city.name ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{city.name}</div>
                      <div className="text-xs text-slate-400">{city.country}</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(city.name);
                      }}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                    >
                      {isFav ? (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarOff className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
