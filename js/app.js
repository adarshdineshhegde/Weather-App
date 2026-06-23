const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const errorBanner = document.getElementById('error-banner');
const loadingEl = document.getElementById('loading');

const weatherCard = document.getElementById('weather-card');
const weatherEmpty = document.getElementById('weather-empty');
const weatherContent = document.getElementById('weather-content');
const weatherCity = document.getElementById('weather-city');
const weatherDate = document.getElementById('weather-date');
const weatherTempBlock = document.getElementById('weather-temp-block');
const weatherIcon = document.getElementById('weather-icon');
const weatherTemp = document.getElementById('weather-temp');
const weatherCondition = document.getElementById('weather-condition');
const weatherHumidity = document.getElementById('weather-humidity');
const weatherWind = document.getElementById('weather-wind');
const weatherPressure = document.getElementById('weather-pressure');

let isLoading = false;

function setLoading(loading) {
  isLoading = loading;
  loadingEl.hidden = !loading;
  searchInput.disabled = loading;
}

function showError(message) {
  errorBanner.textContent = message;
  errorBanner.hidden = false;
}

function hideError() {
  errorBanner.textContent = '';
  errorBanner.hidden = true;
}

function formatCurrentDate(timezone) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  }).format(new Date());
}

function showWeatherEmpty() {
  weatherCard.classList.add('weather-card--empty');
  weatherEmpty.hidden = false;
  weatherContent.hidden = true;
}

function renderWeatherCard(city, weather) {
  const current = weather.current;
  const { label, icon } = getWeatherInfo(current.weather_code);
  const temp = Math.round(current.temperature_2m);
  const accentClass = getTempAccentClass(temp);

  weatherCity.textContent = `${city.name}, ${city.country}`;
  weatherDate.textContent = formatCurrentDate(weather.timezone);
  weatherIcon.textContent = icon;
  weatherTemp.textContent = `${temp}°C`;
  weatherCondition.textContent = label;
  weatherHumidity.textContent = `${current.relative_humidity_2m}%`;
  weatherWind.textContent = `${current.wind_speed_10m} km/h`;
  weatherPressure.textContent = `${Math.round(current.surface_pressure)} hPa`;

  weatherTempBlock.className = `weather-card__temp-block ${accentClass}`;

  weatherCard.classList.remove('weather-card--empty');
  weatherEmpty.hidden = true;
  weatherContent.hidden = false;
}

async function handleSearch(cityName) {
  const query = cityName.trim();
  if (!query || isLoading) return;

  hideError();
  setLoading(true);

  try {
    const { city, weather } = await fetchWeatherForCity(query);
    renderWeatherCard(city, weather);
  } catch (error) {
    showError(error.message);
    showWeatherEmpty();
  } finally {
    setLoading(false);
  }
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  handleSearch(searchInput.value);
});