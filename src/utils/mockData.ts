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

export function getMockCurrentWeather(
  lat: number,
  lon: number,
  units: 'metric' | 'imperial'
): CurrentWeatherData {
  const city = getCityWeather(lat, lon);

  const temp =
    units === 'imperial'
      ? city.current.temperature * 1.8 + 32
      : city.current.temperature;

  const feelsLike =
    units === 'imperial'
      ? city.current.feels_like * 1.8 + 32
      : city.current.feels_like;

  return {
    location: {
      lat,
      lon,
      country: 'Kenya',
      timezone: 'Africa/Nairobi',
      name: city.name,
    },
    current: {
      temperature: temp,
      feels_like: feelsLike,
      humidity: city.current.humidity,
      uv_index: city.current.uv_index,
      wind_speed: city.current.wind_speed,
      wind_gust: city.current.wind_gust,
      wind_direction: 135,
      weather_code: city.current.weather_code,
      is_day: new Date().getHours() >= 6 && new Date().getHours() < 18,
      precipitation: city.current.precipitation,
      pressure: city.current.pressure,
      time: new Date().toISOString(),
    },
    ai_summary: city.summary,
  };
}

export function getMockForecastWeather(
  lat: number,
  lon: number,
  units: 'metric' | 'imperial'
): ForecastData {
  const city = getCityWeather(lat, lon);

  const baseTemp =
    units === 'imperial'
      ? city.current.temperature * 1.8 + 32
      : city.current.temperature;

  return {
    location: {
      lat,
      lon,
      country: 'Kenya',
      timezone: 'Africa/Nairobi',
      name: city.name,
    },
    hourly: makeHourlies(baseTemp),
    daily: makeDailies(baseTemp),
    ai_summary: city.forecastSummary,
  };
}

function getCityWeather(lat: number, lon: number) {
  const cities = [
    {
      name: 'Nairobi',
      lat: -1.2921,
      lon: 36.8219,
      current: {
        temperature: 24,
        feels_like: 22,
        humidity: 62,
        uv_index: 7.2,
        wind_speed: 12.4,
        wind_gust: 18.6,
        precipitation: 15,
        pressure: 1013,
        weather_code: 1,
      },
      summary:
        'Pleasant weather across Nairobi with sunny intervals and mild afternoon temperatures. Ideal conditions for commuting and outdoor activities.',
      forecastSummary:
        'Nairobi will experience mild temperatures throughout the week with occasional cloud cover and a slight chance of rain on Wednesday.',
    },
    {
      name: 'Mombasa',
      lat: -4.0435,
      lon: 39.6682,
      current: {
        temperature: 31,
        feels_like: 35,
        humidity: 82,
        uv_index: 10,
        wind_speed: 18,
        wind_gust: 25,
        precipitation: 25,
        pressure: 1009,
        weather_code: 2,
      },
      summary:
        'Hot and humid coastal conditions with sea breezes. UV exposure is high during midday.',
      forecastSummary:
        'Warm coastal weather will persist with high humidity levels and occasional afternoon showers.',
    },
    {
      name: 'Kisumu',
      lat: -0.1022,
      lon: 34.7617,
      current: {
        temperature: 29,
        feels_like: 32,
        humidity: 76,
        uv_index: 8,
        wind_speed: 10,
        wind_gust: 15,
        precipitation: 35,
        pressure: 1010,
        weather_code: 3,
      },
      summary:
        'Warm lakeside weather with scattered clouds and moderate humidity.',
      forecastSummary:
        'Expect warm temperatures and increased chances of afternoon thunderstorms later in the week.',
    },
    {
      name: 'Nakuru',
      lat: -0.3031,
      lon: 36.08,
      current: {
        temperature: 22,
        feels_like: 21,
        humidity: 58,
        uv_index: 6,
        wind_speed: 14,
        wind_gust: 19,
        precipitation: 10,
        pressure: 1015,
        weather_code: 1,
      },
      summary:
        'Cool and comfortable conditions with clear skies and fresh winds.',
      forecastSummary:
        'Nakuru will remain mostly sunny throughout the week with cool mornings and pleasant afternoons.',
    },
    {
      name: 'Eldoret',
      lat: 0.5143,
      lon: 35.2698,
      current: {
        temperature: 20,
        feels_like: 19,
        humidity: 65,
        uv_index: 5,
        wind_speed: 11,
        wind_gust: 16,
        precipitation: 20,
        pressure: 1018,
        weather_code: 2,
      },
      summary:
        'Cool highland weather with occasional clouds and refreshing winds.',
      forecastSummary:
        'Eldoret will experience cool temperatures and intermittent showers during the middle of the week.',
    },
  ];

  const nearest = cities.reduce((prev, curr) => {
    const prevDist = Math.hypot(prev.lat - lat, prev.lon - lon);
    const currDist = Math.hypot(curr.lat - lat, curr.lon - lon);
    return currDist < prevDist ? curr : prev;
  });

  return nearest;
}