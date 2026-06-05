import type { CurrentWeatherData, ForecastData, HourlyData, DailyData } from '../services/weatherService';

function makeHourlies(baseTemp: number): HourlyData[] {
  const now = new Date();
  const hours: HourlyData[] = [];
  for (let i = 0; i < 48; i++) {
    const t = new Date(now.getTime() + i * 3600000);
    const variation = Math.sin(((i - 6) / 24) * Math.PI * 2) * 6;
    const temp = baseTemp + variation + (Math.random() - 0.5) * 2;
    const isDay = t.getHours() >= 6 && t.getHours() < 18;
    hours.push({
      time: t.toISOString(),
      temperature: Math.round(temp * 10) / 10,
      humidity: Math.round(55 + Math.random() * 30),
      wind_speed: Math.round((8 + Math.random() * 15) * 10) / 10,
      precipitation_probability: Math.round(Math.random() * 60),
      weather_code: isDay ? (Math.random() > 0.4 ? 1 : 3) : (Math.random() > 0.5 ? 0 : 2),
      uv_index: isDay ? Math.round((3 + Math.random() * 7) * 10) / 10 : 0,
      is_day: isDay,
    });
  }
  return hours;
}

function makeDailies(baseTemp: number): DailyData[] {
  const days: DailyData[] = [];
  const codes = [1, 2, 3, 1, 0, 61, 3];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const variation = (Math.random() - 0.5) * 4;
    days.push({
      date: d.toISOString().split('T')[0],
      weather_code: codes[i],
      temperature_max: Math.round((baseTemp + 5 + variation) * 10) / 10,
      temperature_min: Math.round((baseTemp - 3 + variation) * 10) / 10,
      precipitation_probability: Math.round(Math.random() * 70),
      wind_speed_max: Math.round((10 + Math.random() * 20) * 10) / 10,
      uv_index: Math.round((3 + Math.random() * 8) * 10) / 10,
      sunrise: '06:15',
      sunset: '18:30',
    });
  }
  return days;
}

export function getMockCurrentWeather(lat: number, lon: number, units: 'metric' | 'imperial'): CurrentWeatherData {
  const baseTemp = lat < 0 ? 24 : 18;
  const temp = units === 'metric' ? baseTemp : baseTemp * 1.8 + 32;
  return {
    location: {
      lat,
      lon,
      country: 'Kenya',
      timezone: 'Africa/Nairobi',
      name: lat === -1.2921 && lon === 36.8219 ? 'Nairobi' : undefined,
    },
    current: {
      temperature: temp,
      feels_like: temp - 1.5,
      humidity: 62,
      uv_index: 7.2,
      wind_speed: 12.4,
      wind_gust: 18.6,
      wind_direction: 135,
      weather_code: 1,
      is_day: new Date().getHours() >= 6 && new Date().getHours() < 18,
      precipitation: 15,
      pressure: 1013,
      time: new Date().toISOString(),
    },
    ai_summary:
      'Expect warm temperatures throughout the afternoon with low chances of rainfall. Outdoor activities are recommended. UV levels will peak around midday — consider sunscreen and light clothing. A brief breeze will provide comfortable cooling in the late afternoon.',
  };
}

export function getMockForecastWeather(lat: number, lon: number, units: 'metric' | 'imperial'): ForecastData {
  const baseTemp = lat < 0 ? 24 : 18;
  const hourlies = makeHourlies(units === 'metric' ? baseTemp : baseTemp * 1.8 + 32);
  const dailies = makeDailies(units === 'metric' ? baseTemp : baseTemp * 1.8 + 32);
  return {
    location: {
      lat,
      lon,
      country: 'Kenya',
      timezone: 'Africa/Nairobi',
      name: lat === -1.2921 && lon === 36.8219 ? 'Nairobi' : undefined,
    },
    hourly: hourlies,
    daily: dailies,
    ai_summary:
      'The week ahead features predominantly warm and partly cloudy conditions. Temperatures will remain comfortable with afternoon highs around 28°C. Light rainfall is possible mid-week on Wednesday. Best days for outdoor plans are Thursday through Saturday.',
  };
}
