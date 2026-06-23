const STORAGE_KEY = 'weather-app-theme';
const toggle = document.getElementById('theme-toggle');
const icon = toggle.querySelector('.theme-toggle__icon');

function applyTheme(theme) {
  document.documentElement.classList.add('theme-transition');
  document.documentElement.setAttribute('data-theme', theme);
  icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem(STORAGE_KEY, theme);

  setTimeout(() => {
    document.documentElement.classList.remove('theme-transition');
  }, 300);
}

function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  icon.textContent = theme === 'dark' ? '🌙' : '☀️';
}

toggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

initTheme();