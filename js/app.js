const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const errorBanner = document.getElementById('error-banner');
const loadingEl = document.getElementById('loading');
const weatherPlaceholder = document.getElementById('weather-placeholder');

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

async function handleSearch(cityName) {
  const query = cityName.trim();
  if (!query || isLoading) return;

  hideError();
  setLoading(true);

  try {
    const { city, weather } = await fetchWeatherForCity(query);

    console.log('City:', city);
    console.log('Weather:', weather);

    weatherPlaceholder.textContent = `Data loaded for ${city.name}, ${city.country_code}`;
  } catch (error) {
    showError(error.message);
    weatherPlaceholder.textContent = 'Search for a city to see weather';
  } finally {
    setLoading(false);
  }
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  handleSearch(searchInput.value);
});