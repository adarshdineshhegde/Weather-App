const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

async function fetchCity(cityName) {
  const params = new URLSearchParams({
    name: cityName,
    count: '1',
    language: 'en',
    format: 'json',
  });

  const response = await fetch(`${GEOCODING_URL}?${params}`);

  if (!response.ok) {
    throw new Error('Network error. Please check your connection and try again.');
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${cityName}" not found. Try another name.`);
  }

  return data.results[0];
}

async function fetchWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'weather_code',
      'wind_speed_10m',
      'surface_pressure',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
    ].join(','),
    hourly: [
      'temperature_2m',
      'weather_code',
    ].join(','),
    timezone: 'auto',
  });

  const response = await fetch(`${FORECAST_URL}?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch weather data. Please try again.');
  }

  return response.json();
}

async function fetchWeatherForCity(cityName) {
  const city = await fetchCity(cityName);
  const weather = await fetchWeather(city.latitude, city.longitude);

  return { city, weather };
}