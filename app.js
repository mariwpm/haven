(function () {
  'use strict';

  const STORAGE_KEY_CHAT = 'safe_helper_chat';
  const STORAGE_KEY_THEME = 'safe_helper_theme';

  const BOT_RESPONSES = {
    exact: {
      'Что делать, если меня ударили?': `**Сейчас важна ваша безопасность.**

1. Если вы в опасности прямо сейчас — позвоните **112**.
2. Уйдите в безопасное место, если можете: к соседям, в подъезд, к знакомым.
3. Зафиксируйте травмы: фото (если безопасно), запишите время и обстоятельства.
4. Обратитесь в травмпункт или поликлинику — медики обязаны оформить документы.
5. Вы можете написать заявление в полицию. Имеете право на защиту.

Вы не виноваты. Помощь существует.`,

      'Как собрать сумку на случай ухода?': `**Сумка на случай срочного ухода** (спрячьте в безопасном месте):

• Документы: паспорт, СНИЛС, полис, свидетельства детей
• Деньги (наличные), банковская карта
• Телефон, зарядка, powerbank
• Ключи (от дома, машины)
• Лекарства, которые принимаете
• Смена одежды, гигиена
• Важные контакты (на бумаге)
• Фото/копии документов в облаке (если безопасно)

Собирайте постепенно, когда вас не видят. Не рискуйте ради вещей.`,

      'Куда звонить в экстренной ситуации?': `**Экстренные номера:**

• **112** — единый номер экстренных служб (полиция, скорая, МЧС)
• **102** — полиция
• **103** — скорая помощь

**Линии поддержки (демо):**
• Кризисный центр «Радуга»: 8-800-000-00-01 (круглосуточно)
• Помощь женщинам «Надежда»: 8-800-000-00-02

Если боитесь говорить вслух — можно отправить SMS на 112 (в некоторых регионах).`,

      'Как понять, что это насилие?': `**Насилие — это не только удары.**

Признаки насилия:
• Унижения, крики, угрозы, контроль (телефон, деньги, общение)
• Изоляция от друзей и семьи
• Принуждение к сексу или другим действиям
• «Любовь» как оправдание боли и страха

**Буллинг** — систематические оскорбления, издевательства, травля в школе или онлайн.

Если вы боитесь, стыдитесь, чувствуете, что «ходите на яйцах» — это не норма. Вы заслуживаете уважения и безопасности.`,

      'Как помочь подруге/другу?': `**Как поддержать близкого человека:**

1. **Выслушайте** без осуждения. Не говорите «просто уйди» — это сложнее, чем кажется.
2. **Поверьте** — не сомневайтесь в их словах.
3. **Не давите** — решение должно быть их собственным.
4. Предложите конкретную помощь: поговорить, сопроводить, дать телефон кризисного центра.
5. Если есть угроза жизни — помогите позвонить в **112**.

Фраза, которая помогает: «Я рядом. Это не твоя вина. Ты не одна/один.»`
    },

    keywords: [
      { words: ['удар', 'бьёт', 'бьет', 'избил', 'побил', 'драка'], key: 'Что делать, если меня ударили?' },
      { words: ['сумк', 'уход', 'убеж', 'сбеж', 'собрать'], key: 'Как собрать сумку на случай ухода?' },
      { words: ['звон', '112', '102', '103', 'экстр', 'номер', 'полици'], key: 'Куда звонить в экстренной ситуации?' },
      { words: ['насил', 'издева', 'угроз', 'контрол', 'норм'], key: 'Как понять, что это насилие?' },
      { words: ['подруг', 'друг', 'помоч', 'близк', 'родствен'], key: 'Как помочь подруге/другу?' },
      { words: ['булл', 'травл', 'школ', 'одноклас'], key: 'Как понять, что это насилие?' }
    ],

    fallback: `Я здесь, чтобы помочь. Выберите вопрос кнопкой выше или напишите своими словами.

Могу рассказать о:
• действиях при ударе
• сумке на случай ухода
• экстренных номерах
• признаках насилия
• поддержке близкого человека

Если опасность прямо сейчас — нажмите «Позвонить 112» внизу экрана.`
  };

  const CRISIS_CENTERS = [
    {
      name: 'Кризисный центр «Радуга»',
      address: 'г. Москва, ул. Примерная, д. 12',
      phone: '8-800-000-00-01',
      hours: 'Круглосуточно'
    },
    {
      name: 'Центр помощи «Надежда»',
      address: 'г. Санкт-Петербург, пр. Образцовый, д. 5',
      phone: '8-800-000-00-02',
      hours: 'Пн–Вс 9:00–21:00'
    },
    {
      name: 'Приют «Безопасный дом»',
      address: 'г. Казань, ул. Тихая, д. 3',
      phone: '8-800-000-00-03',
      hours: 'Круглосуточно, анонимно'
    }
  ];

  const coverApp = document.getElementById('cover-app');
  const helpApp = document.getElementById('help-app');
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const panicExit = document.getElementById('panic-exit');
  const helpThemeToggle = document.getElementById('help-theme-toggle');
  const centersList = document.getElementById('centers-list');

  function initTheme() {
    const saved = sessionStorage.getItem(STORAGE_KEY_THEME);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    sessionStorage.setItem(STORAGE_KEY_THEME, next);
  }

    function formatText(text) {
    const lines = text.split('\n');
    let html = '';
    let inList = false;
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
        if (inList) { html += '</ul>'; inList = false; }
        continue;
        }
        const bold = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        if (/^[\d]+[\.\)]/.test(trimmed) || trimmed.startsWith('•')) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += `<li>${bold.replace(/^[\d]+[\.\)]\s*|^•\s*/, '')}</li>`;
        } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<p>${bold}</p>`;
        }
    }
    if (inList) html += '</ul>';
    return html;
    }

  function findAnswer(question) {
    const q = question.trim();
    if (BOT_RESPONSES.exact[q]) {
      return BOT_RESPONSES.exact[q];
    }

    const lower = q.toLowerCase();
    for (const item of BOT_RESPONSES.keywords) {
      if (item.words.some((w) => lower.includes(w))) {
        return BOT_RESPONSES.exact[item.key];
      }
    }

    return BOT_RESPONSES.fallback;
  }

  function saveChat() {
    sessionStorage.setItem(STORAGE_KEY_CHAT, chatMessages.innerHTML);
  }

  function loadChat() {
    const saved = sessionStorage.getItem(STORAGE_KEY_CHAT);
    if (saved) {
      chatMessages.innerHTML = saved;
    } else {
    addBotMessage('Здравствуйте. Я анонимный помощник.\n\nВсё, что вы пишете, остаётся только на этом устройстве и исчезнет после закрытия вкладки.\n\nВыберите вопрос выше или напишите своими словами.');
    }
  }

  function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `message message-${type}`;
    div.innerHTML = type === 'bot' ? formatText(text) : escapeHtml(text);
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    saveChat();
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML.replace(/\n/g, '<br>');
  }

  function addUserMessage(text) {
    addMessage(text, 'user');
  }

  function addBotMessage(text) {
    addMessage(text, 'bot');
  }

  function showTypingThenReply(question) {
    const typing = document.createElement('div');
    typing.className = 'message message-bot message-typing';
    typing.textContent = 'Печатает...';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      typing.remove();
      addBotMessage(findAnswer(question));
    }, 600 + Math.random() * 400);
  }

  function handleQuestion(question) {
    const trimmed = question.trim();
    if (!trimmed) return;
    addUserMessage(trimmed);
    showTypingThenReply(trimmed);
  }

    function renderCenters() {
    centersList.innerHTML = CRISIS_CENTERS.map((c) => `
        <li class="center-card">
        <h3>${escapeHtml(c.name)}</h3>
        <p class="center-meta">${escapeHtml(c.address)}<br>${escapeHtml(c.hours)}</p>
        <a class="center-phone" href="tel:${c.phone.replace(/[^\d+]/g, '')}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" stroke-width="1.75"/>
            </svg>
            ${escapeHtml(c.phone)}
        </a>
        </li>
    `).join('');
    }

  function openHelp() {
    coverApp.classList.add('hidden');
    coverApp.setAttribute('aria-hidden', 'true');
    helpApp.classList.remove('hidden');
    helpApp.setAttribute('aria-hidden', 'false');
    helpApp.classList.add('fade-in');
    loadChat();
    renderCenters();
    document.title = 'Помощь';
  }

  function panicExitHandler() {
    sessionStorage.removeItem(STORAGE_KEY_CHAT);
    chatMessages.innerHTML = '';

    helpApp.classList.add('hidden');
    helpApp.setAttribute('aria-hidden', 'true');
    coverApp.classList.remove('hidden', 'fade-out');
    coverApp.setAttribute('aria-hidden', 'false');
    document.title = 'Мои заметки';

    const useYandex = Math.random() > 0.5;
    window.location.replace(useYandex ? 'https://yandex.ru' : 'https://google.com');
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = chatInput.value;
    chatInput.value = '';
    handleQuestion(value);
  });

  document.querySelectorAll('.quick-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-question');
      handleQuestion(q);
    });
  });

  panicExit.addEventListener('click', panicExitHandler);
  helpThemeToggle.addEventListener('click', toggleTheme);

  initTheme();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  window.SafeHelper = {
    openHelp,
    toggleTheme
  };
})();