import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, CloudSun } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <CloudSun className="w-16 h-16 text-primary-400" />
      </motion.div>
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="flex items-center gap-2 text-primary-400"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm font-medium">Fetching weather data...</span>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
