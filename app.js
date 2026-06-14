(function () {
  'use strict';

  const STORAGE = {
    CHAT: 'haven_chat',
    THEME: 'haven_theme',
    PLAN: 'haven_safety_plan',
    CHECKLIST: 'haven_checklist'
  };

  const QUICK_QUESTIONS = [
    'Что делать, если меня ударили?',
    'Как собрать сумку на случай ухода?',
    'Куда звонить в экстренной ситуации?',
    'Как понять, что это насилие?',
    'Что делать, если меня сейчас не отпускают?'
  ];

  const KNOWLEDGE = [
    {
      id: 'hit',
      q: 'Что делать, если меня ударили?',
      keys: ['удар', 'бьёт', 'бьет', 'избил', 'побил', 'толкнул', 'шлёпнул'],
      followUp: ['emergency', 'bag', 'doctor'],
      text: `**Сейчас важнее всего — ваша безопасность.**

1. Если опасность прямо сейчас — звоните **112**.
2. Уйдите в безопасное место: к соседям, в подъезд, к знакомым.
3. Зафиксируйте травмы: фото (если безопасно), время, обстоятельства.
4. Обратитесь в травмпункт — медики обязаны оформить документы.
5. Вы можете написать заявление в полицию.

**Вы не виноваты.** Помощь существует.`
    },
    {
      id: 'bag',
      q: 'Как собрать сумку на случай ухода?',
      keys: ['сумк', 'уход', 'убеж', 'сбеж', 'собрать', 'взять с собой'],
      followUp: ['code', 'hide'],
      text: `**Сумка на случай срочного ухода** (спрячьте заранее):

• Документы: паспорт, полис, свидетельства детей
• Деньги, банковская карта
• Телефон, зарядка
• Ключи, лекарства
• Смена одежды
• Контакты на бумаге

Собирайте постепенно, когда вас не видят. **Не рискуйте ради вещей.**`
    },
    {
      id: 'emergency',
      q: 'Куда звонить в экстренной ситуации?',
      keys: ['звон', '112', '102', '103', 'экстр', 'номер', 'полици', 'скорую'],
      followUp: ['hit', 'centers'],
      text: `**Экстренные номера:**

• **112** — единый номер экстренных служб
• **102** — полиция
• **103** — скорая помощь

**Линии поддержки (демо):**
• «Радуга»: 8-800-000-00-01
• «Надежда»: 8-800-000-00-02

Если нельзя говорить вслух — отправьте SMS на 112 (в ряде регионов).`
    },
    {
      id: 'violence',
      q: 'Как понять, что это насилие?',
      keys: ['насил', 'издева', 'угроз', 'контрол', 'норм', 'признак'],
      followUp: ['psych', 'bully'],
      text: `**Насилие — это не только удары.**

Признаки:
• Унижения, крики, угрозы, контроль (телефон, деньги, общение)
• Изоляция от друзей и семьи
• Принуждение к действиям против воли
• Постоянный страх и напряжение

**Буллинг** — систематические оскорбления и травля.

Если вы «ходите на яйцах» — это не норма. Вы заслуживаете безопасности.`
    },
    {
      id: 'friend',
      q: 'Как помочь подруге/другу?',
      keys: ['подруг', 'друг', 'помоч', 'близк', 'родствен', 'поддерж'],
      followUp: ['dontsay', 'emergency'],
      text: `**Как поддержать близкого:**

1. Выслушайте **без осуждения**
2. **Поверьте** — не сомневайтесь в словах
3. **Не давите** — решение должно быть их собственным
4. Предложите конкретную помощь: разговор, сопровождение, номер центра
5. При угрозе жизни — помогите позвонить **112**

Скажите: «Я рядом. Это не твоя вина.»`
    },
    {
      id: 'locked',
      q: 'Что делать, если меня сейчас не отпускают?',
      keys: ['не отпуска', 'запер', 'заперла', 'заперли', 'locked', 'не выход'],
      followUp: ['emergency', 'code'],
      text: `**Если вас удерживают:**

1. При прямой угрозе — **112** (можно шёпотом или SMS).
2. Попробуйте привлечь внимание: окно, соседи, подъезд.
3. Не провоцируйте агрессора, если это опасно.
4. Заранее договоритесь с доверенным человеком о кодовом слове.

Ваша задача — **остаться в безопасности**, а не «победить в споре».`
    },
    {
      id: 'hide',
      q: 'Как спрятать переписку и следы в телефоне?',
      keys: ['истори', 'след', 'спрят', 'переписк', 'браузер', 'найдут'],
      followUp: ['bag', 'emergency'],
      text: `**Если боитесь, что переписку найдут:**

• Используйте режим прикрытия (экран заметок)
• Закрывайте вкладку после использования
• Не сохраняйте пароли в общем доступе
• Кодовое слово лучше помнить, а не записывать открыто
• При возможности — отдельное устройство или гостевой режим браузера

**Срочный выход** внизу экрана мгновенно уводит на нейтральный сайт.`
    },
    {
      id: 'school',
      q: 'Меня травят в школе — что делать?',
      keys: ['школ', 'класс', 'однокласс', 'учител', 'травл'],
      followUp: ['cyber', 'friend'],
      text: `**Если вас травят в школе:**

1. **Расскажите** взрослому, которому доверяете
2. **Сохраняйте** доказательства: сообщения, записи
3. **Не отвечайте** агрессией — это часто усугубляет ситуацию
4. Обратитесь к школьному психологу или классному руководителю
5. При угрозах и избиении — **112** или родителям немедленно

Вы не обязаны терпеть травлю.`
    },
    {
      id: 'cyber',
      q: 'Травля в интернете — как реагировать?',
      keys: ['интернет', 'соцсет', 'онлайн', 'кибер', 'чат', 'коммент'],
      followUp: ['school', 'evidence'],
      text: `**Кибербуллинг:**

1. **Не отвечайте** агрессией
2. **Сделайте скриншоты** — доказательства
3. **Заблокируйте** и пожалуйтесь в платформе
4. **Расскажите** взрослому
5. При угрозах жизни — **112**

Удаление переписки до фиксации может усложнить жалобу — сначала сохраните доказательства, если безопасно.`
    },
    {
      id: 'psych',
      q: 'Это насилие, если меня не бьют?',
      keys: ['не бьют', 'не бьёт', 'крик', 'униж', 'контрол', 'следит'],
      followUp: ['violence', 'cycle'],
      text: `**Да. Насилие бывает без ударов.**

Это может быть:
• Постоянные унижения и крики
• Контроль телефона, денег, передвижения
• Угрозы и запугивание
• Изоляция от близких

Психологическое насилие — **тоже насилие**. Вы имеете право на помощь.`
    },
    {
      id: 'code',
      q: 'Как составить кодовое слово?',
      keys: ['кодов', 'сигнал', 'фраз'],
      followUp: ['bag', 'locked'],
      text: `**Кодовое слово** — нейтральная фраза для доверенного человека.

• Пример: «Купи молоко» / «Как кот?»
• Договоритесь заранее: звонок, такси, приезд
• Не храните план открытым текстом на телефоне

Если угроза **сейчас** — не ждите сигнала, звоните **112**.`
    },
    {
      id: 'doctor',
      q: 'Нужно ли идти к врачу после побоев?',
      keys: ['врач', 'травмпункт', 'синяк', 'медик', 'больниц'],
      followUp: ['evidence', 'emergency'],
      text: `**Да, это важно.**

• Врач фиксирует травмы официально
• Это может быть доказательством при обращении в полицию
• Даже «лёгкие» травмы стоит осмотреть

Если опасно идти одной/одному — попросите сопровождение или вызовите **103**.`
    },
    {
      id: 'evidence',
      q: 'Как сохранить доказательства?',
      keys: ['доказатель', 'скрин', 'фото', 'заявлен'],
      followUp: ['doctor', 'emergency'],
      text: `**Если безопасно сохранить доказательства:**

• Фото травм с датой
• Скриншоты сообщений и угроз
• Запись времени и описания событий
• Медицинские документы

Храните копии в месте, недоступном агрессору. При угрозе жизни — **сначала 112**.`
    },
    {
      id: 'dontsay',
      q: 'Что не говорить человеку, которому плохо?',
      keys: ['не говорить', 'не говори', 'виноват'],
      followUp: ['friend', 'violence'],
      text: `**Лучше не говорить:**
• «Просто уйди» — это сложнее, чем кажется
• «Ты сам(а) виноват(а)» — усиливает стыд
• «Я бы на твоём месте…» — обесценивает

**Лучше сказать:**
«Я верю тебе. Ты не одна/один. Чем могу помочь прямо сейчас?»`
    },
    {
      id: 'cycle',
      q: 'После извинений всё повторяется — это нормально?',
      keys: ['цикл', 'извин', 'снова', 'медов'],
      followUp: ['violence', 'psych'],
      text: `**Цикл насилия** часто выглядит так:

Напряжение → вспышка → извинения → «медовый месяц» → снова напряжение.

Извинения **без изменения поведения** — не гарантия безопасности.
Вы имеете право на помощь, даже если «не всегда так».`
    },
    {
      id: 'calm',
      q: 'Как успокоиться после ссоры?',
      keys: ['успоко', 'паник', 'дыш', 'страх', 'тревог'],
      followUp: ['breathing', 'friend'],
      text: `**Если накрывает паника:**

1. Попробуйте дыхание **4–4–6** (вкладка «Инструменты»)
2. Назовите 5 предметов, которые видите
3. Умойтесь холодной водой
4. Напишите или позвоните доверенному человеку

Если есть угроза жизни — **112** важнее любых упражнений.`
    },
    {
      id: 'children',
      q: 'Можно ли уйти с детьми?',
      keys: ['дет', 'ребён', 'ребен'],
      followUp: ['bag', 'centers'],
      text: `**Общая информация (не юридическая консультация):**

• Безопасность детей — приоритет
• Возьмите документы детей, если возможно
• Обратитесь в кризисный центр или на линию поддержки
• Юридические вопросы лучше обсудить со специалистом центра

При немедленной опасности — **112**.`
    },
    {
      id: 'shame',
      q: 'Мне стыдно обращаться за помощью',
      keys: ['стыд', 'стыжусь', 'боюсь'],
      followUp: ['friend', 'violence'],
      text: `**Стыд — частая реакция, но вы не виноваты.**

Специалисты кризисных центров работают **анонимно** и **без осуждения**.
Обращение за помощью — признак силы, а не слабости.

Haven — информационный помощник. При опасности — **112** или линия поддержки.`
    },
    {
      id: 'breathing',
      q: 'Покажи упражнение для успокоения',
      keys: ['упражн', 'дыхани', '4-4-6'],
      followUp: ['calm'],
      text: `Откройте вкладку **«Инструменты»** — там упражнение **дыхание 4–4–6**.

Вдох 4 секунды → пауза 4 секунды → выдох 6 секунд.
Повторите 3–5 циклов.`
    },
    {
      id: 'centers',
      q: 'Куда обратиться кроме полиции?',
      keys: ['центр', 'приют', 'кроме полици', 'линия'],
      followUp: ['emergency', 'bag'],
      text: `**Помимо полиции:**

• Кризисные центры (вкладка «Центры»)
• Телефоны доверия (демо-номера в разделе «Центры»)
• Школьный психолог — при буллинге
• Доверенный взрослый

При угрозе жизни — всегда **112**.`
    }
  ];

  const FOLLOW_UP_LABELS = {
    emergency: 'Экстренные номера',
    bag: 'Сумка на уход',
    hit: 'Если ударили',
    code: 'Кодовое слово',
    hide: 'Скрыть следы',
    doctor: 'К врачу',
    evidence: 'Доказательства',
    friend: 'Помочь другу',
    dontsay: 'Что не говорить',
    violence: 'Признаки насилия',
    psych: 'Без ударов',
    bully: 'Буллинг',
    cyber: 'Травля онлайн',
    school: 'Травля в школе',
    cycle: 'Цикл насилия',
    calm: 'Успокоиться',
    breathing: 'Дыхание',
    centers: 'Кризисные центры'
  };

  const EMERGENCY_WORDS = ['сейчас бьёт', 'сейчас бьет', 'нож', 'оружие', 'убьёт', 'убьет', 'душит', 'кровь'];

  const SIGNS = [
    'Я знаю безопасное место, куда могу уйти в случае опасности',
    'У меня есть доверенный человек, которому можно позвонить',
    'Я подготовил(а) кодовое слово для экстренной ситуации',
    'Я собрал(а) сумку с документами, деньгами и лекарствами',
    'Я сохранил(а) номера экстренных служб (112, 102, 103)'
  ];

  const CRISIS_CENTERS = [
    { name: 'Кризисный центр «Радуга»', address: 'г. Москва, ул. Примерная, д. 12', phone: '8-800-000-00-01', hours: 'Круглосуточно', lon: 37.6173, lat: 55.7558 },
    { name: 'Центр «Надежда»', address: 'г. Санкт-Петербург, пр. Образцовый, д. 5', phone: '8-800-000-00-02', hours: 'Пн–Вс 9:00–21:00', lon: 30.3351, lat: 59.9343 },
    { name: 'Приют «Безопасный дом»', address: 'г. Казань, ул. Тихая, д. 3', phone: '8-800-000-00-03', hours: 'Круглосуточно', lon: 49.1221, lat: 55.7887 }
  ];

  const FAQ = [
    { q: 'Кто видит мои сообщения?', a: 'Никто. Переписка хранится только в браузере и удаляется при закрытии вкладки. Данные не отправляются на сервер.' },
    { q: 'Что делает «Быстрый выход»?', a: 'Мгновенно закрывает помощь, возвращает экран заметок и перенаправляет на нейтральный сайт (Яндекс или Google).' },
    { q: 'Зачем режим заметок?', a: 'Это режим прикрытия — чтобы открыть помощь незаметно, если рядом кто-то, кому вы не хотите показывать, что ищете поддержку.' },
    { q: 'Работает ли сайт без интернета?', a: 'Да, после первой загрузки основные функции работают офлайн. Карта Яндекса требует интернет.' },
    { q: 'Haven заменяет специалистов?', a: 'Нет. Haven — информационный помощник для учебного проекта. В реальной опасности звоните 112 или обращайтесь в кризисные центры.' },
    { q: 'Можно ли сохранить план безопасности?', a: 'Да, на вкладке «Инструменты». План хранится локально или скачивается как текстовый файл на ваше устройство.' }
  ];

  const INFO = [
    { title: 'Конфиденциальность', text: 'Без регистрации, без аналитики, без отправки данных. Только локальное хранение на время сессии.' },
    { title: 'Когда нужна срочная помощь', text: 'Угроза жизни, оружие, невозможность безопасно уйти, серьёзные травмы — звоните 112 немедленно.' },
    { title: 'План безопасности', text: 'Заранее определите безопасное место, кодовое слово, копии документов и доверенные контакты.' },
    { title: 'О проекте Haven', text: 'Учебный прототип анонимного помощника для людей, столкнувшихся с домашним насилием и буллингом. Контакты центров — демонстрационные.' }
  ];

  const FALLBACK = `Я здесь, чтобы помочь. Выберите вопрос слева или напишите своими словами.

Темы: безопасность, сумка на уход, экстренные номера, буллинг, доказательства, поддержка близких.

Если опасность прямо сейчас — нажмите «Позвонить 112» внизу.`;

  const EMERGENCY_REPLY = `**Похоже, вам сейчас может быть опасно.**

1. Если угроза **прямо сейчас** — звоните **112**.
2. Постарайтесь выйти в безопасное место.
3. Не оставайтесь наедине с агрессором, если есть риск.

Вы не одни. Помощь существует.`;

  const coverApp = document.getElementById('cover-app');
  const helpApp = document.getElementById('help-app');
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const quickGrid = document.getElementById('quick-grid');
  const panicExit = document.getElementById('panic-exit');
  const helpThemeToggle = document.getElementById('help-theme-toggle');
  const tabs = document.querySelectorAll('.help-tab');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const yandexMap = document.getElementById('yandex-map');
  const safetyPlanForm = document.getElementById('safety-plan-form');
  const exportPlanBtn = document.getElementById('export-plan');
  const planSavedMsg = document.getElementById('plan-saved-msg');
  const signsChecklist = document.getElementById('signs-checklist');
  const checklistResult = document.getElementById('checklist-result');
  const breathCircle = document.getElementById('breath-circle');
  const breathLabel = document.getElementById('breath-label');
  const breathStart = document.getElementById('breath-start');
  const breathStop = document.getElementById('breath-stop');

  let breathTimer = null;
  let helpInitialized = false;

  const qMap = {};
  KNOWLEDGE.forEach((item) => { qMap[item.id] = item.q; });

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function initTheme() {
    const saved = sessionStorage.getItem(STORAGE.THEME);
    const dark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }

  function toggleTheme() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = dark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    sessionStorage.setItem(STORAGE.THEME, next);
  }

  function switchTab(tabId) {
    tabs.forEach((t) => {
      const active = t.dataset.tab === tabId;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    tabPanels.forEach((p) => {
      const active = p.id === `tab-${tabId}`;
      p.hidden = !active;
      p.classList.toggle('is-active', active);
    });
    if (tabId === 'centers' && yandexMap.src === 'about:blank') loadMap();
  }

  tabs.forEach((t) => t.addEventListener('click', () => switchTab(t.dataset.tab)));

  function formatText(text) {
    return text.split('\n').map((line) => {
      const t = line.trim();
      if (!t) return '';
      const b = escapeHtml(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      if (/^[\d]+[\.\)]/.test(t) || t.startsWith('•')) {
        return `<li>${b.replace(/^[\d]+[\.\)]\s*|^•\s*/, '')}</li>`;
      }
      return `<p>${b}</p>`;
    }).join('').replace(/(<li>.*<\/li>)+/g, (m) => `<ul>${m}</ul>`);
  }

  function findItem(question) {
    const q = question.trim();
    const exact = KNOWLEDGE.find((item) => item.q === q);
    if (exact) return exact;
    const lower = q.toLowerCase();
    for (const item of KNOWLEDGE) {
      if (item.keys.some((k) => lower.includes(k))) return item;
    }
    return null;
  }

  function isEmergency(text) {
    const lower = text.toLowerCase();
    return EMERGENCY_WORDS.some((w) => lower.includes(w));
  }

  function saveChatHtml() {
    sessionStorage.setItem(STORAGE.CHAT, chatMessages.innerHTML);
  }

  function renderQuickGrid() {
    quickGrid.innerHTML = QUICK_QUESTIONS.map((q) =>
      `<button class="quick-card${q.length > 20 ? ' quick-card-wide' : ''}" type="button" data-question="${escapeHtml(q)}">${escapeHtml(q)}</button>`
    ).join('');
    quickGrid.querySelectorAll('.quick-card').forEach((btn) => {
      btn.addEventListener('click', () => handleQuestion(btn.dataset.question));
    });
  }

  function addFollowUps(item, container) {
    if (!item?.followUp?.length) return;
    const row = document.createElement('div');
    row.className = 'follow-up-row';
    item.followUp.forEach((id) => {
      const label = FOLLOW_UP_LABELS[id] || qMap[id] || id;
      const q = KNOWLEDGE.find((k) => k.id === id)?.q;
      if (!q) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'follow-up-btn';
      btn.textContent = label;
      btn.addEventListener('click', () => handleQuestion(q));
      row.appendChild(btn);
    });
    container.appendChild(row);
  }

  function addBotMessage(text, item, isEmergencyMsg) {
    const div = document.createElement('div');
    div.className = 'message message-bot' + (isEmergencyMsg ? ' message-emergency' : '');
    div.innerHTML = formatText(text);
    addFollowUps(item, div);
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    saveChatHtml();
  }

  function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'message message-user';
    div.innerHTML = escapeHtml(text).replace(/\n/g, '<br>');
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    saveChatHtml();
  }

  function showTypingThenReply(question) {
    const typing = document.createElement('div');
    typing.className = 'message message-bot message-typing';
    typing.textContent = 'Печатает';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      typing.remove();
      const emergency = isEmergency(question);
      const item = findItem(question);
      const text = emergency ? EMERGENCY_REPLY + '\n\n' + (item?.text || '') : (item?.text || FALLBACK);
      addBotMessage(text, item, emergency);
    }, 450 + Math.random() * 350);
  }

  function handleQuestion(question) {
    const trimmed = question.trim();
    if (!trimmed) return;
    addUserMessage(trimmed);
    showTypingThenReply(trimmed);
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = chatInput.value;
    chatInput.value = '';
    handleQuestion(v);
  });

  function loadChat() {
    const saved = sessionStorage.getItem(STORAGE.CHAT);
    if (saved) {
      chatMessages.innerHTML = saved;
      chatMessages.querySelectorAll('.follow-up-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const q = btn.textContent;
          const item = KNOWLEDGE.find((k) => FOLLOW_UP_LABELS[k.id] === q || k.q === q);
          handleQuestion(item?.q || q);
        });
      });
    } else {
      addBotMessage('Здравствуйте. Я анонимный помощник Haven.\n\nВыберите вопрос слева или напишите своими словами.', null, false);
    }
  }

  function renderCenters() {
    document.getElementById('centers-list').innerHTML = CRISIS_CENTERS.map((c) => `
      <li class="center-card">
        <h3>${escapeHtml(c.name)}</h3>
        <p class="center-meta">${escapeHtml(c.address)}<br>${escapeHtml(c.hours)}</p>
        <a class="center-phone" href="tel:${c.phone.replace(/[^\d+]/g, '')}">${escapeHtml(c.phone)}</a>
      </li>`).join('');
  }

  function loadMap() {
    const pts = CRISIS_CENTERS.map((c) => `${c.lon},${c.lat},pm2rdm`).join('~');
    yandexMap.src = `https://yandex.ru/map-widget/v1/?ll=40%2C55.5&z=4&pt=${pts}&lang=ru_RU`;
  }

  function renderFaq() {
    const faqList = document.getElementById('faq-list');
    faqList.innerHTML = FAQ.map((f, i) => `
      <div class="faq-item" id="faq-${i}">
        <button class="faq-question" type="button" aria-expanded="false">${escapeHtml(f.q)}</button>
        <div class="faq-answer">${escapeHtml(f.a)}</div>
      </div>`).join('');
    faqList.querySelectorAll('.faq-question').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const open = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
    document.getElementById('info-cards').innerHTML = INFO.map((c) => `
      <article class="info-card"><h3>${escapeHtml(c.title)}</h3><p>${escapeHtml(c.text)}</p></article>`).join('');
  }

  function loadPlan() {
    try {
      const data = JSON.parse(sessionStorage.getItem(STORAGE.PLAN) || '{}');
      const fields = ['safePlace', 'safePerson', 'codeWord', 'packList', 'escapeRoute'];
      fields.forEach((k) => {
        const el = safetyPlanForm.elements[k];
        if (el && data[k]) el.value = data[k];
      });
    } catch (_) {}
  }

  safetyPlanForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      safePlace: safetyPlanForm.elements.safePlace?.value || '',
      safePerson: safetyPlanForm.elements.safePerson?.value || '',
      codeWord: safetyPlanForm.elements.codeWord?.value || '',
      packList: safetyPlanForm.elements.packList?.value || '',
      escapeRoute: safetyPlanForm.elements.escapeRoute?.value || ''
    };
    sessionStorage.setItem(STORAGE.PLAN, JSON.stringify(data));
    planSavedMsg.classList.remove('hidden');
    setTimeout(() => planSavedMsg.classList.add('hidden'), 2500);
  });

  exportPlanBtn.addEventListener('click', () => {
    const data = JSON.parse(sessionStorage.getItem(STORAGE.PLAN) || '{}');
    const text = `МОЙ ПЛАН БЕЗОПАСНОСТИ HAVEN

Безопасное место: ${data.safePlace || '—'}
Доверенный человек: ${data.safePerson || '—'}
Кодовое слово: ${data.codeWord || '—'}
Что взять при уходе: ${data.packList || '—'}
Маршрут выхода: ${data.escapeRoute || '—'}

Экстренные номера: 112, 102, 103`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'plan-bezopasnosti-haven.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  function renderChecklist() {
    let saved = [];
    try { saved = JSON.parse(sessionStorage.getItem(STORAGE.CHECKLIST) || '[]'); } catch (_) {}
    signsChecklist.innerHTML = SIGNS.map((label, i) => `
      <li><label><input type="checkbox" data-idx="${i}" ${saved.includes(i) ? 'checked' : ''}> ${escapeHtml(label)}</label></li>`).join('');
    updateChecklistResult();
    signsChecklist.querySelectorAll('input').forEach((cb) => {
      cb.addEventListener('change', () => {
        const checked = [...signsChecklist.querySelectorAll('input:checked')].map((x) => +x.dataset.idx);
        sessionStorage.setItem(STORAGE.CHECKLIST, JSON.stringify(checked));
        updateChecklistResult();
      });
    });
  }

  function updateChecklistResult() {
    const total = SIGNS.length;
    const checked = signsChecklist.querySelectorAll('input:checked').length;
    
    if (checked === total) {
      checklistResult.textContent = 'Вы выполнили все пункты. План готов. В экстренной ситуации действуйте по плану.';
    } else if (checked >= 4) {
      checklistResult.textContent = `Выполнено ${checked} из ${total}. Хороший прогресс. Осталось завершить ещё ${total - checked} шагов.`;
    } else if (checked > 0) {
      checklistResult.textContent = `Выполнено ${checked} из ${total}. Продолжайте готовиться — каждый шаг важен.`;
    } else {
      checklistResult.textContent = 'Отметьте то, что уже сделали. Начните с безопасного места и доверенного человека.';
    }
  }

  function stopBreathing() {
    if (breathTimer) { clearTimeout(breathTimer); breathTimer = null; }
    breathCircle.className = 'breath-circle';
    breathCircle.textContent = 'Готовы?';
    breathLabel.textContent = 'Нажмите «Начать»';
    breathStart.classList.remove('hidden');
    breathStop.classList.add('hidden');
  }

  function runBreathCycle(phase) {
    const phases = [
      { cls: 'inhale', label: 'Вдох…', dur: 4000 },
      { cls: 'hold', label: 'Задержка…', dur: 4000 },
      { cls: 'exhale', label: 'Выдох…', dur: 6000 }
    ];
    const p = phases[phase % 3];
    breathCircle.className = 'breath-circle ' + p.cls;
    breathCircle.textContent = String((phase % 3) + 1);
    breathLabel.textContent = p.label;
    breathTimer = setTimeout(() => runBreathCycle(phase + 1), p.dur);
  }

  breathStart.addEventListener('click', () => {
    breathStart.classList.add('hidden');
    breathStop.classList.remove('hidden');
    runBreathCycle(0);
  });
  breathStop.addEventListener('click', stopBreathing);

  let escCount = 0;
  let escTimer = null;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !helpApp.classList.contains('hidden')) {
      escCount++;
      if (escTimer) clearTimeout(escTimer);
      escTimer = setTimeout(() => { escCount = 0; }, 800);
      if (escCount >= 2) panicExitHandler();
    }
  });

  function openHelp() {
    coverApp.classList.add('hidden');
    helpApp.classList.remove('hidden');
    if (!helpInitialized) {
      renderQuickGrid();
      loadChat();
      renderCenters();
      renderFaq();
      loadPlan();
      renderChecklist();
      helpInitialized = true;
    }
    document.title = 'Haven';
  }

  function panicExitHandler() {
    sessionStorage.removeItem(STORAGE.CHAT);
    chatMessages.innerHTML = '';
    stopBreathing();
    helpApp.classList.add('hidden');
    coverApp.classList.remove('hidden', 'is-leaving');
    switchTab('help');
    document.title = 'Мои заметки';
    window.location.replace(Math.random() > 0.5 ? 'https://yandex.ru' : 'https://google.com');
  }

  panicExit.addEventListener('click', panicExitHandler);
  helpThemeToggle.addEventListener('click', toggleTheme);
  initTheme();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }

  window.SafeHelper = { openHelp, toggleTheme };
})();
