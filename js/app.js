const CITY_STORAGE_KEY = 'weather-app-city';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const clearBtn = document.getElementById('clear-city');
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

const forecastSection = document.getElementById('forecast-section');
const forecastEmpty = document.getElementById('forecast-empty');
const forecastContent = document.getElementById('forecast-content');

const insightsSection = document.getElementById('insights-section');
const insightsEmpty = document.getElementById('insights-empty');
const insightsContent = document.getElementById('insights-content');

let isLoading = false;

function getSavedCity() {
  return localStorage.getItem(CITY_STORAGE_KEY);
}

function saveCity(cityName) {
  localStorage.setItem(CITY_STORAGE_KEY, cityName);
  updateClearButton();
}

function clearSavedCity() {
  localStorage.removeItem(CITY_STORAGE_KEY);
  updateClearButton();
}

function updateClearButton() {
  clearBtn.hidden = !getSavedCity();
}

function setLoading(loading) {
  isLoading = loading;
  loadingEl.hidden = !loading;
  searchInput.disabled = loading;
  clearBtn.disabled = loading;
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

function getDayKey(date, timezone) {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: timezone,
  }).format(date);
}

function formatDayLabel(dateStr, index, timezone) {
  if (index === 0) return 'TODAY';
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: timezone,
  }).format(new Date(dateStr)).toUpperCase();
}

function formatHour(timeStr, timezone) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  }).format(new Date(timeStr));
}

function showWeatherEmpty() {
  weatherCard.classList.add('weather-card--empty');
  weatherEmpty.hidden = false;
  weatherContent.hidden = true;
}

function showForecastEmpty() {
  forecastSection.classList.add('forecast-strip--empty');
  forecastEmpty.hidden = false;
  forecastContent.hidden = true;
  forecastContent.innerHTML = '';
}

function showInsightsEmpty() {
  insightsSection.classList.add('insights-panel--empty');
  insightsEmpty.hidden = false;
  insightsContent.hidden = true;
  insightsContent.innerHTML = '';
}

function showAllEmpty() {
  showWeatherEmpty();
  showForecastEmpty();
  showInsightsEmpty();
}

function resetApp() {
  clearSavedCity();
  hideError();
  searchInput.value = '';
  showAllEmpty();
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

function renderForecastStrip(weather) {
  const { daily, timezone } = weather;
  const cards = [];

  for (let i = 0; i < 5; i++) {
    const { icon } = getWeatherInfo(daily.weather_code[i]);
    const high = Math.round(daily.temperature_2m_max[i]);
    const low = Math.round(daily.temperature_2m_min[i]);
    const isToday = i === 0;

    cards.push(`
      <article class="forecast-card${isToday ? ' forecast-card--today' : ''}">
        <p class="forecast-card__day">${formatDayLabel(daily.time[i], i, timezone)}</p>
        <span class="forecast-card__icon" aria-hidden="true">${icon}</span>
        <p class="forecast-card__temps">
          <span class="forecast-card__high">${high}°</span>
          <span class="forecast-card__sep">/</span>
          <span class="forecast-card__low">${low}°</span>
        </p>
      </article>
    `);
  }

  forecastContent.innerHTML = cards.join('');
  forecastSection.classList.remove('forecast-strip--empty');
  forecastEmpty.hidden = true;
  forecastContent.hidden = false;
}

function getTodayHourlyEntries(weather) {
  const { hourly, timezone } = weather;
  const today = getDayKey(new Date(), timezone);

  const todayEntries = hourly.time
    .map((time, index) => ({ time, index }))
    .filter(({ time }) => getDayKey(new Date(time), timezone) === today);

  const now = Date.now();
  let start = todayEntries.findIndex(({ time }) => new Date(time).getTime() >= now);
  if (start === -1) start = Math.max(0, todayEntries.length - 6);

  let selected = todayEntries.slice(start, start + 6);
  if (selected.length < 6) {
    selected = todayEntries.slice(0, 6);
  }

  return selected.map(({ time, index }) => ({
    time,
    temp: hourly.temperature_2m[index],
    code: hourly.weather_code[index],
  }));
}

function renderInsightsPanel(weather) {
  const entries = getTodayHourlyEntries(weather);
  const { timezone } = weather;

  insightsContent.innerHTML = entries.map(({ time, temp, code }) => {
    const { label, icon } = getWeatherInfo(code);
    return `
      <article class="insight-row">
        <span class="insight-row__time">${formatHour(time, timezone)}</span>
        <span class="insight-row__condition">
          <span class="insight-row__icon" aria-hidden="true">${icon}</span>
          ${label}
        </span>
        <span class="insight-row__temp">${Math.round(temp)}°C</span>
      </article>
    `;
  }).join('');

  insightsSection.classList.remove('insights-panel--empty');
  insightsEmpty.hidden = true;
  insightsContent.hidden = false;
}

function renderAll(city, weather) {
  renderWeatherCard(city, weather);
  renderForecastStrip(weather);
  renderInsightsPanel(weather);
}

async function handleSearch(cityName) {
  const query = cityName.trim();
  if (!query || isLoading) return;

  hideError();
  setLoading(true);

  try {
    const { city, weather } = await fetchWeatherForCity(query);
    renderAll(city, weather);
    saveCity(query);
    searchInput.value = query;
  } catch (error) {
    showError(error.message);
    showAllEmpty();
  } finally {
    setLoading(false);
  }
}

function initApp() {
  const savedCity = getSavedCity();

  if (savedCity) {
    searchInput.value = savedCity;
    updateClearButton();
    handleSearch(savedCity);
  } else {
    updateClearButton();
  }
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  handleSearch(searchInput.value);
});

clearBtn.addEventListener('click', resetApp);

initApp();