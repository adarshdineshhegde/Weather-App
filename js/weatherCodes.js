const WMO_CODES = {
    0:  { label: 'Clear Sky',        icon: '☀️' },
    1:  { label: 'Mainly Clear',     icon: '🌤️' },
    2:  { label: 'Partly Cloudy',    icon: '⛅' },
    3:  { label: 'Overcast',         icon: '☁️' },
    45: { label: 'Foggy',            icon: '🌫️' },
    48: { label: 'Foggy',            icon: '🌫️' },
    51: { label: 'Light Drizzle',    icon: '🌦️' },
    53: { label: 'Drizzle',          icon: '🌦️' },
    55: { label: 'Heavy Drizzle',    icon: '🌧️' },
    61: { label: 'Light Rain',       icon: '🌧️' },
    63: { label: 'Rain',             icon: '🌧️' },
    65: { label: 'Heavy Rain',       icon: '🌧️' },
    71: { label: 'Light Snow',       icon: '🌨️' },
    73: { label: 'Snow',             icon: '❄️' },
    75: { label: 'Heavy Snow',       icon: '❄️' },
    77: { label: 'Snow Grains',      icon: '🌨️' },
    80: { label: 'Light Showers',    icon: '🌦️' },
    81: { label: 'Showers',          icon: '🌧️' },
    82: { label: 'Heavy Showers',    icon: '⛈️' },
    85: { label: 'Snow Showers',     icon: '🌨️' },
    86: { label: 'Heavy Snow Showers', icon: '❄️' },
    95: { label: 'Thunderstorm',     icon: '⛈️' },
    96: { label: 'Thunderstorm & Hail', icon: '⛈️' },
    99: { label: 'Thunderstorm & Hail', icon: '⛈️' },
  };
  
  function getWeatherInfo(code) {
    return WMO_CODES[code] || { label: 'Unknown', icon: '🌡️' };
  }
  
  function getTempAccentClass(temp) {
    if (temp < 10) return 'weather-card__temp-block--cold';
    if (temp <= 25) return 'weather-card__temp-block--mild';
    if (temp <= 32) return 'weather-card__temp-block--warm';
    return 'weather-card__temp-block--hot';
  }