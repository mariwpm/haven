(function () {
  'use strict';

  const CLICKS_REQUIRED = 5;
  const RESET_MS = 3500;

  let clickCount = 0;
  let resetTimer = null;

  const logo = document.getElementById('cover-logo');
  const coverApp = document.getElementById('cover-app');
  const activationOverlay = document.getElementById('activation-overlay');
  const activationYes = document.getElementById('activation-yes');
  const activationNo = document.getElementById('activation-no');
  const coverThemeToggle = document.getElementById('cover-theme-toggle');

  function resetClicks() {
    clickCount = 0;
    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = null;
    }
  }

  function showActivation() {
    coverApp.classList.add('is-leaving');
    setTimeout(() => {
      activationOverlay.classList.remove('hidden');
    }, 180);
  }

  logo.addEventListener('click', () => {
    clickCount += 1;
    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(resetClicks, RESET_MS);
    if (clickCount >= CLICKS_REQUIRED) {
      resetClicks();
      showActivation();
    }
  });

  activationYes.addEventListener('click', () => {
    activationOverlay.classList.add('hidden');
    window.SafeHelper?.openHelp();
  });

  activationNo.addEventListener('click', () => {
    activationOverlay.classList.add('hidden');
    coverApp.classList.remove('is-leaving');
  });

  coverThemeToggle.addEventListener('click', () => {
    window.SafeHelper?.toggleTheme();
  });
})();