(function () {
  const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
  const root = document.documentElement;
  const storageKey = 'portfolio-theme';

  function getPreferredTheme() {
    const storedTheme = localStorage.getItem(storageKey);
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(storageKey, theme);
    toggleButtons.forEach((button) => {
      const icon = button.querySelector('.theme-toggle__icon');
      button.setAttribute('aria-pressed', String(theme === 'light'));
      if (icon) {
        icon.textContent = theme === 'light' ? '☀️' : '🌙';
      }
    });
  }

  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
    });
  });
})();
