# WeatherAI Dashboard

A modern, responsive weather analytics dashboard built with React.js that integrates with the WeatherAI API to provide real-time weather conditions, hourly forecasts, AI-generated weather insights, and interactive weather visualizations.

---

## Overview

WeatherAI Dashboard is a feature-rich web application designed to showcase modern frontend development practices, API integration, responsive UI design, data visualization, and user experience enhancements.

The application consumes WeatherAI's Current Weather and Forecast Weather APIs to deliver accurate weather information along with AI-generated summaries and actionable insights.

This project was built as part of a technical assessment to demonstrate:

* API integration
* React development skills
* State management
* Data visualization
* Responsive design
* Component architecture
* Error handling
* Performance optimization

---

## Features

### Current Weather

View real-time weather information including:

* Current temperature
* Feels-like temperature
* Humidity
* Wind speed
* Wind gust
* Wind direction
* UV index
* Weather condition
* Weather icon
* Current local time

---

### Hourly Forecast

View hourly weather predictions including:

* Temperature
* Humidity
* Wind speed
* Precipitation probability
* Weather conditions
* Weather icons

Displayed in an intuitive horizontal scrolling layout for mobile users.

---

### Temperature Trend Visualization

Interactive charts powered by Recharts displaying:

* Hourly temperature trends
* Historical temperature progression
* Visual weather patterns

Features:

* Responsive charts
* Tooltips
* Dynamic scaling
* Mobile-friendly rendering

---

### AI Weather Summary

WeatherAI's intelligent summary provides:

* Weather outlook
* Activity recommendations
* Weather alerts
* General forecast explanations

Example:

> Expect mild temperatures throughout the afternoon with low chances of rainfall. Outdoor activities are recommended.

---

### Location Intelligence

Display detailed location information:

* Latitude
* Longitude
* Country
* Timezone

---

### City Search

Search weather conditions for supported cities.

Sample cities include:

* Nairobi
* Mombasa
* Kisumu
* Eldoret
* Nakuru

Users can instantly switch locations and fetch updated weather information.

---

### Geolocation Support

The application automatically detects the user's location using browser geolocation APIs.

If geolocation is unavailable or denied:

The application defaults to:

Latitude: -1.2921

Longitude: 36.8219

Location: Nairobi, Kenya

---

### Dark Mode

Built-in light and dark themes.

Features:

* Theme persistence using localStorage
* Smooth theme transitions
* Mobile support

---

### Responsive Design

Fully responsive across:

* Mobile devices
* Tablets
* Laptops
* Desktop screens

Built using:

* CSS Grid
* Flexbox
* Tailwind CSS utilities

---

### Loading States

The application includes:

* Skeleton placeholders
* Loading spinners
* Smooth transitions

to improve perceived performance while data loads.

---

### Error Handling

Handles:

* Invalid API keys
* Network failures
* Request timeouts
* Missing API responses
* Geolocation errors

with user-friendly feedback messages.

---

### Bonus Features

* Auto-refresh every 5 minutes
* Favorite cities storage
* Unit switching (°C / °F)
* Language support (English / Swahili)
* Dynamic weather backgrounds
* Weather insights and alerts
* PDF weather report export
* Progressive Web App support

---

## Technology Stack

### Frontend

* React.js
* Vite
* JavaScript (ES6+)

### Styling

* Tailwind CSS
* React Icons

### API Communication

* Axios

### Data Visualization

* Recharts

### Animations

* Framer Motion

### Deployment

* Vercel

---

## Project Structure

```text
src/
│
├── components/
│   ├── Navbar.jsx
│   ├── CurrentWeather.jsx
│   ├── WeatherStats.jsx
│   ├── HourlyForecast.jsx
│   ├── WeatherChart.jsx
│   ├── AISummary.jsx
│   ├── SearchBar.jsx
│   ├── ForecastCards.jsx
│   ├── LoadingSpinner.jsx
│   └── ErrorMessage.jsx
│
├── hooks/
│   └── useWeather.js
│
├── pages/
│   └── Dashboard.jsx
│
├── services/
│   └── weatherService.js
│
├── utils/
│   └── formatters.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## API Configuration

Create a .env file in the project root.

```env
VITE_WEATHER_API_BASE_URL=https://api.weather-ai.co
VITE_WEATHER_API_KEY=your_api_key_here
```

Never commit API keys to source control.

---

## WeatherAI Endpoints

### Current Weather

```http
GET /api/v1/current
```

Parameters:

| Parameter | Type    | Required |
| --------- | ------- | -------- |
| lat       | float   | Yes      |
| lon       | float   | Yes      |
| ai        | boolean | No       |
| units     | string  | No       |
| lang      | string  | No       |

Example:

```http
/api/v1/current?lat=-1.2921&lon=36.8219&ai=true&units=metric&lang=en
```

---

### Forecast Weather

```http
GET /api/v1/weather
```

Parameters:

| Parameter | Type    | Required |
| --------- | ------- | -------- |
| lat       | float   | Yes      |
| lon       | float   | Yes      |
| days      | integer | No       |
| ai        | boolean | No       |
| units     | string  | No       |
| lang      | string  | No       |

Example:

```http
/api/v1/weather?lat=-1.2921&lon=36.8219&days=7&ai=true&units=metric&lang=en
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/weatherai-dashboard.git
```

Navigate into the project:

```bash
cd weatherai-dashboard
```

Install dependencies:

```bash
npm install
```

Create a .env file:

```env
VITE_WEATHER_API_BASE_URL=https://api.weather-ai.co
VITE_WEATHER_API_KEY=your_api_key_here
```

Start development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## Build for Production

Generate production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Deployment

### Deploy to Vercel

Install Vercel CLI:

```bash
npm install -g vercel
```

Deploy:

```bash
vercel
```

Add environment variables in the Vercel dashboard:

```env
VITE_WEATHER_API_BASE_URL
VITE_WEATHER_API_KEY
```

---

## Performance Optimizations

The application uses:

* React.memo
* useMemo
* useCallback
* Axios interceptors
* Lazy loading
* Component reusability

to ensure efficient rendering and fast user experiences.

---

## Security Considerations

* API keys stored in environment variables
* No sensitive credentials committed to source control
* Input validation implemented
* Error boundaries for unexpected failures

---

## Future Improvements

Potential future enhancements include:

* Historical weather analytics
* Weather notifications
* Multi-language support expansion
* Severe weather alerts
* Offline mode
* Weather maps integration
* User authentication
* Personalized weather recommendations

---

## Author

Eugene Iregi

Software Developer

Focused on building scalable web applications, API integrations, and modern user experiences.

---

## License

This project is provided for assessment and demonstration purposes.

All rights reserved.
