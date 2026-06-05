export function formatTemperature(temp: number, units: 'metric' | 'imperial'): string {
  return `${Math.round(temp)}°${units === 'metric' ? 'C' : 'F'}`;
}

export function formatWindSpeed(speed: number, units: 'metric' | 'imperial'): string {
  return `${speed.toFixed(1)} ${units === 'metric' ? 'km/h' : 'mph'}`;
}

export function formatHumidity(humidity: number): string {
  return `${humidity}%`;
}

export function formatUV(uv: number): string {
  if (uv <= 2) return `${uv} Low`;
  if (uv <= 5) return `${uv} Moderate`;
  if (uv <= 7) return `${uv} High`;
  if (uv <= 10) return `${uv} Very High`;
  return `${uv} Extreme`;
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function formatHour(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
}

export function formatDay(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getWeatherIcon(code: number): string {
  if (code === 0) return 'sun';
  if (code <= 3) return 'cloud';
  if (code <= 48) return 'cloud-fog';
  if (code <= 57) return 'cloud-drizzle';
  if (code <= 67) return 'cloud-rain';
  if (code <= 77) return 'snowflake';
  if (code <= 82) return 'cloud-rain';
  if (code <= 86) return 'snowflake';
  if (code <= 99) return 'cloud-lightning';
  return 'cloud';
}

export function getWeatherLabel(code: number): string {
  const labels: Record<number, string> = {
    0: 'Clear Sky',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Rime Fog',
    51: 'Light Drizzle',
    53: 'Moderate Drizzle',
    55: 'Dense Drizzle',
    61: 'Slight Rain',
    63: 'Moderate Rain',
    65: 'Heavy Rain',
    71: 'Slight Snow',
    73: 'Moderate Snow',
    75: 'Heavy Snow',
    80: 'Rain Showers',
    81: 'Moderate Showers',
    82: 'Violent Showers',
    85: 'Snow Showers',
    86: 'Heavy Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with Hail',
    99: 'Severe Thunderstorm',
  };
  return labels[code] || 'Unknown';
}

export function getWeatherBackground(code: number, isDay: boolean): string {
  if (!isDay) return 'from-slate-900 via-slate-800 to-indigo-950';
  if (code === 0 || code === 1) return 'from-sky-400 via-blue-500 to-blue-600';
  if (code === 2) return 'from-sky-300 via-blue-400 to-blue-500';
  if (code === 3) return 'from-gray-400 via-gray-500 to-slate-600';
  if (code <= 48) return 'from-gray-300 via-gray-400 to-gray-500';
  if (code <= 67) return 'from-slate-400 via-gray-500 to-slate-600';
  if (code <= 77) return 'from-gray-200 via-blue-100 to-white';
  if (code <= 99) return 'from-gray-600 via-slate-700 to-gray-800';
  return 'from-sky-400 via-blue-500 to-blue-600';
}

export function getUVColor(uv: number): string {
  if (uv <= 2) return 'text-accent-500';
  if (uv <= 5) return 'text-yellow-500';
  if (uv <= 7) return 'text-orange-500';
  return 'text-red-500';
}

export function getWindDirection(degrees: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round(degrees / 22.5) % 16;
  return dirs[idx];
}

export const CITIES = [
  { name: 'Nairobi', country: 'Kenya', lat: -1.2921, lon: 36.8219 },
  { name: 'Mombasa', country: 'Kenya', lat: -4.0435, lon: 39.6682 },
  { name: 'Kisumu', country: 'Kenya', lat: -0.0917, lon: 34.7681 },
  { name: 'Eldoret', country: 'Kenya', lat: 0.5143, lon: 35.2698 },
  { name: 'Nakuru', country: 'Kenya', lat: -0.3031, lon: 36.0800 },
];
