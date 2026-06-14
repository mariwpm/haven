(function () {
  'use strict';

  const STORAGE_KEY_CHAT = 'safe_helper_chat';
  const STORAGE_KEY_THEME = 'safe_helper_theme';

  const BOT_RESPONSES = {
    exact: {
      'Что делать, если меня ударили?': `**Сейчас важно ваше безопасность.**

1. Если вы в опасности прямо сейчас — позвоните **112**.
2. Уйдите в безопасное место, если можете.
3. Зафиксируйте травмы: фото (если безопасно), запишите время.
4. Обратитесь в травмпункт — медики обязаны оформить документы.
5. Вы можете написать заявление в полицию.

Вы не виноваты. Помощь существует.`,

      'Как собрать сумку на случай ухода?': `**Сумка на случай срочного ухода:**

• Документы: паспорт, полис, свидетельства детей
• Деньги, банковская карта
• Телефон, зарядка
• Ключи, лекарства
• Смена одежды
• Контакты на бумаге

Собирайте постепенно, когда вас не видят.`,

      'Куда звонить в экстренной ситуации?': `**Экстренные номера:**

• **112** — единый номер экстренных служб
• **102** — полиция
• **103** — скорая помощь

**Линии поддержки (демо):**
• «Радуга»: 8-800-000-00-01
• «Надежда»: 8-800-000-00-02`,

      'Как понять, что это насилие?': `**Насилие — это не только удары.**

Признаки:
• Унижения, угрозы, контроль
• Изоляция от близких
• Принуждение
• Страх и постоянное напряжение

**Буллинг** — систематические оскорбления и травля.

Если вы боитесь и «ходите на яйцах» — это не норма.`,

      'Как помочь подруге/другу?': `**Как поддержать близкого:**

1. Выслушайте без осуждения
2. Поверьте — не сомневайтесь
3. Не давите — решение их собственное
4. Предложите конкретную помощь
5. При угрозе жизни — помогите позвонить **112**

«Я рядом. Это не твоя вина.»`
    },
    keywords: [
      { words: ['удар', 'бьёт', 'бьет', 'избил'], key: 'Что делать, если меня ударили?' },
      { words: ['сумк', 'уход', 'убеж', 'сбеж'], key: 'Как собрать сумку на случай ухода?' },
      { words: ['звон', '112', '102', '103', 'экстр'], key: 'Куда звонить в экстренной ситуации?' },
      { words: ['насил', 'издева', 'угроз', 'контрол'], key: 'Как понять, что это насилие?' },
      { words: ['подруг', 'друг', 'помоч', 'близк'], key: 'Как помочь подруге/другу?' },
      { words: ['булл', 'травл', 'школ'], key: 'Как понять, что это насилие?' }
    ],
    fallback: `Я здесь, чтобы помочь. Выберите вопрос кнопкой слева или напишите своими словами.

Если опасность прямо сейчас — нажмите «Позвонить 112» внизу экрана.`
  };

  const CRISIS_CENTERS = [
    {
      name: 'Кризисный центр «Радуга»',
      address: 'г. Москва, ул. Примерная, д. 12',
      phone: '8-800-000-00-01',
      hours: 'Круглосуточно',
      lon: 37.6173,
      lat: 55.7558
    },
    {
      name: 'Центр помощи «Надежда»',
      address: 'г. Санкт-Петербург, пр. Образцовый, д. 5',
      phone: '8-800-000-00-02',
      hours: 'Пн–Вс 9:00–21:00',
      lon: 30.3351,
      lat: 59.9343
    },
    {
      name: 'Приют «Безопасный дом»',
      address: 'г. Казань, ул. Тихая, д. 3',
      phone: '8-800-000-00-03',
      hours: 'Круглосуточно, анонимно',
      lon: 49.1221,
      lat: 55.7887
    }
  ];

  const FAQ_ITEMS = [
    {
      q: 'Кто видит мои сообщения?',
      a: 'Никто. Переписка хранится только в вашем браузере и удаляется при закрытии вкладки. Данные не отправляются на сервер.'
    },
    {
      q: 'Что делает кнопка «Срочный выход»?',
      a: 'Мгновенно закрывает интерфейс помощи, возвращает экран заметок и перенаправляет на нейтральный сайт (Яндекс или Google).'
    },
    {
      q: 'Почему сайт выглядит как заметки?',
      a: 'Это режим прикрытия. Он помогает открыть помощь незаметно, если рядом может быть человек, которому вы не хотите показывать, что ищете поддержку.'
    },
    {
      q: 'Работает ли сайт без интернета?',
      a: 'Да, после первой загрузки основные функции работают офлайн благодаря Service Worker. Карта Яндекса требует интернет.'
    },
    {
      q: 'Это замена обращению к специалистам?',
      a: 'Нет. «Опора» — информационный помощник для учебного проекта. В реальной опасности звоните 112 или обращайтесь в кризисные центры.'
    }
  ];

  const INFO_CARDS = [
    {
      title: 'Принципы конфиденциальности',
      text: 'Без регистрации, без cookies аналитики, без отправки данных. Только локальное хранение на время сессии.'
    },
    {
      title: 'Признаки, когда нужна срочная помощь',
      text: 'Угроза жизни, угроза оружием, невозможность безопасно покинуть место, серьёзные травмы — звоните 112 немедленно.'
    },
    {
      title: 'План безопасности',
      text: 'Заранее определите безопасное место, кодовое слово для друзей, копии документов и список доверенных контактов.'
    },
    {
      title: 'О проекте',
      text: '«Опора» — учебный прототип анонимного помощника для людей, столкнувшихся с домашним насилием и буллингом. Контакты центров — демонстрационные.'
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
  const faqList = document.getElementById('faq-list');
  const infoCards = document.getElementById('info-cards');
  const yandexMap = document.getElementById('yandex-map');
  const tabs = document.querySelectorAll('.help-tab');
  const tabPanels = document.querySelectorAll('.tab-panel');

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

  function switchTab(tabId) {
    tabs.forEach((tab) => {
      const active = tab.dataset.tab === tabId;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    tabPanels.forEach((panel) => {
      const id = panel.id.replace('tab-', '');
      const active = id === tabId;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });

    if (tabId === 'centers' && yandexMap.src === 'about:blank') {
      loadMap();
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
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
    if (BOT_RESPONSES.exact[q]) return BOT_RESPONSES.exact[q];
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
      addBotMessage('Здравствуйте. Я анонимный помощник «Опора».\n\nВыберите вопрос слева или напишите своими словами.');
    }
  }

  function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `message message-${type}`;
    div.innerHTML = type === 'bot' ? formatText(text) : escapeHtml(text).replace(/\n/g, '<br>');
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    saveChat();
  }

  function addUserMessage(text) { addMessage(text, 'user'); }
  function addBotMessage(text) { addMessage(text, 'bot'); }

  function showTypingThenReply(question) {
    const typing = document.createElement('div');
    typing.className = 'message message-bot message-typing';
    typing.textContent = 'Печатает';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      typing.remove();
      addBotMessage(findAnswer(question));
    }, 500 + Math.random() * 300);
  }

  function handleQuestion(question) {
    const trimmed = question.trim();
    if (!trimmed) return;
    addUserMessage(trimmed);
    showTypingThenReply(trimmed);
  }

  function bindQuickCards() {
    document.querySelectorAll('.quick-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        const q = btn.getAttribute('data-question');
        if (q) handleQuestion(q);
      });
    });
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = chatInput.value;
    chatInput.value = '';
    handleQuestion(value);
  });

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

  function loadMap() {
    const points = CRISIS_CENTERS.map((c) => `${c.lon},${c.lat},pm2rdm`).join('~');
    const centerLon = 40.0;
    const centerLat = 55.5;
    yandexMap.src = `https://yandex.ru/map-widget/v1/?ll=${centerLon}%2C${centerLat}&z=4&pt=${points}&lang=ru_RU`;
  }

  function renderFaq() {
    faqList.innerHTML = FAQ_ITEMS.map((item, i) => `
      <div class="faq-item" id="faq-${i}">
        <button class="faq-question" type="button" aria-expanded="false" data-faq="${i}">
          ${escapeHtml(item.q)}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="faq-answer">${escapeHtml(item.a)}</div>
      </div>
    `).join('');

    faqList.querySelectorAll('.faq-question').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const open = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }

  function renderInfoCards() {
    infoCards.innerHTML = INFO_CARDS.map((c) => `
      <article class="info-card">
        <h3>${escapeHtml(c.title)}</h3>
        <p>${escapeHtml(c.text)}</p>
      </article>
    `).join('');
  }

  function openHelp() {
    coverApp.classList.add('hidden');
    coverApp.setAttribute('aria-hidden', 'true');
    helpApp.classList.remove('hidden');
    helpApp.setAttribute('aria-hidden', 'false');
    bindQuickCards();
    loadChat();
    renderCenters();
    renderFaq();
    renderInfoCards();
    document.title = 'Опора';
  }

  function panicExitHandler() {
    sessionStorage.removeItem(STORAGE_KEY_CHAT);
    chatMessages.innerHTML = '';
    helpApp.classList.add('hidden');
    helpApp.setAttribute('aria-hidden', 'true');
    coverApp.classList.remove('hidden', 'is-leaving');
    coverApp.setAttribute('aria-hidden', 'false');
    switchTab('help');
    document.title = 'Мои заметки';
    window.location.replace(Math.random() > 0.5 ? 'https://yandex.ru' : 'https://google.com');
  }

  panicExit.addEventListener('click', panicExitHandler);
  helpThemeToggle.addEventListener('click', toggleTheme);
  initTheme();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  window.SafeHelper = { openHelp, toggleTheme };
})();
