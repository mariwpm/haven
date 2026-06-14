(function () {
  'use strict';

  const CLICKS_REQUIRED = 5;
  const RESET_MS = 3500;
  const NOTES_KEY = 'cover_notes';

  let clickCount = 0;
  let resetTimer = null;

  const logo = document.getElementById('cover-logo');
  const coverApp = document.getElementById('cover-app');
  const activationOverlay = document.getElementById('activation-overlay');
  const activationYes = document.getElementById('activation-yes');
  const activationNo = document.getElementById('activation-no');
  const coverThemeToggle = document.getElementById('cover-theme-toggle');

  const notesList = document.getElementById('cover-notes');
  const noteForm = document.getElementById('cover-note-form');
  const addNoteBtn = document.getElementById('cover-add-note');
  const saveNoteBtn = document.getElementById('cover-save-note');
  const cancelNoteBtn = document.getElementById('cover-cancel-note');
  const noteTitle = document.getElementById('cover-note-title');
  const noteBody = document.getElementById('cover-note-body');
  const searchInput = document.getElementById('cover-search');

  const DEFAULT_NOTES = [
    { id: '1', title: 'Список покупок', body: 'Молоко, хлеб, яблоки, кофе', date: '12 июн.' },
    { id: '2', title: 'Идеи на выходные', body: 'Записать мысли, разобрать фото', date: '10 июн.' }
  ];

  function getNotes() {
    try {
      const raw = sessionStorage.getItem(NOTES_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_NOTES.slice();
    } catch {
      return DEFAULT_NOTES.slice();
    }
  }

  function saveNotes(notes) {
    sessionStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }

  function formatDate() {
    return new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }).replace('.', '');
  }

  function renderNotes(filter = '') {
    const q = filter.trim().toLowerCase();
    const notes = getNotes().filter((n) => {
      if (!q) return true;
      return n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q);
    });

    if (!notes.length) {
      notesList.innerHTML = '<li class="cover-note-empty">Заметок не найдено</li>';
      return;
    }

    notesList.innerHTML = notes.map((n) => `
      <li class="cover-note">
        <div class="cover-note-head">
          <h3>${escapeHtml(n.title)}</h3>
          <time>${escapeHtml(n.date)}</time>
        </div>
        <p>${escapeHtml(n.body)}</p>
      </li>
    `).join('');
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function showForm() {
    noteForm.classList.remove('hidden');
    noteTitle.value = '';
    noteBody.value = '';
    noteTitle.focus();
  }

  function hideForm() {
    noteForm.classList.add('hidden');
  }

  addNoteBtn.addEventListener('click', showForm);
  cancelNoteBtn.addEventListener('click', hideForm);

  saveNoteBtn.addEventListener('click', () => {
    const title = noteTitle.value.trim() || 'Без названия';
    const body = noteBody.value.trim() || '...';
    const notes = getNotes();
    notes.unshift({ id: Date.now().toString(), title, body, date: formatDate() });
    saveNotes(notes);
    hideForm();
    renderNotes(searchInput.value);
  });

  searchInput.addEventListener('input', () => renderNotes(searchInput.value));

  renderNotes();

  function resetClicks() {
    clickCount = 0;
    if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }
  }

  function showActivation() {
    coverApp.classList.add('is-leaving');
    setTimeout(() => activationOverlay.classList.remove('hidden'), 180);
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
