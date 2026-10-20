// use_figma script (fileKey 1RCh1MB57sbe1fwBMUEwwI): обложка, персонажи, схема сценария, противоречия — страница «Обложка и сценарий» 4:3
const page = await figma.getNodeByIdAsync('4:3'); await figma.setCurrentPageAsync(page);
const V = {}; for (const v of await figma.variables.getLocalVariablesAsync()) V[v.name] = v;
const TS = {}; for (const s of await figma.getLocalTextStylesAsync()) TS[s.name] = s;
for (const s of ['Regular','Medium','Semi Bold','Bold']) await figma.loadFontAsync({ family: 'Inter', style: s });
const paint = n => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', V['color/' + n]);
const fill = (node, n) => { node.fills = n ? [paint(n)] : []; };
const stroke = (node, n, w = 1) => { node.strokes = [paint(n)]; node.strokeWeight = w; node.strokeAlign = 'INSIDE'; };
const bind = (node, prop, name) => node.setBoundVariable(prop, V[name]);
const sp = n => 'spacing/space-' + n;
const pad = (node, h, v) => { for (const p of ['paddingLeft','paddingRight']) typeof h === 'number' ? node[p] = h : bind(node, p, sp(h.slice(1))); for (const p of ['paddingTop','paddingBottom']) typeof v === 'number' ? node[p] = v : bind(node, p, sp(v.slice(1))); };
const rad = (node, n) => { for (const p of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius']) bind(node, p, 'radius/' + n); };
const gap = (node, n) => bind(node, 'itemSpacing', sp(n));
const txt = (chars, style, color, name) => { const t = figma.createText(); t.textStyleId = TS[style].id; t.characters = chars; t.fills = [paint(color)]; if (name) t.name = name; return t; };
const AL = (dir, props = {}) => { const f = figma.createAutoLayout(dir, props); f.fills = []; return f; };
const add = (parent, child, h, v) => { parent.appendChild(child); if (h) child.layoutSizingHorizontal = h; if (v) child.layoutSizingVertical = v; return child; };
const wrapT = (parent, t) => { parent.appendChild(t); t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT'; return t; };
const badge = await figma.getNodeByIdAsync('6:11');
const created = [];
const card = (name) => { const c = AL('VERTICAL', { name }); gap(c, 8); pad(c, 's20', 's16'); rad(c, 'radius-10'); fill(c, 'surface'); stroke(c, 'border'); return c; };

// ---------- 1. Обложка 1600×900 ----------
const cover = figma.createFrame(); cover.name = 'Обложка'; cover.resize(1600, 900); fill(cover, 'bg'); page.appendChild(cover); cover.x = 0; cover.y = 0; created.push(cover.id);
// цветовые блоки справа — палитра системы
const blocks = [['accent', 800, 0, 464, 336], ['text', 1280, 0, 320, 200], ['pku', 1280, 216, 320, 400], ['warn-bg', 800, 352, 224, 224], ['danger', 1040, 352, 224, 112]];
for (const [c, x, y, w, h] of blocks) { const r = figma.createRectangle(); r.name = 'Блок ' + c; r.x = x; r.y = y; r.resize(w, h); r.cornerRadius = 10; r.fills = [paint(c)]; cover.appendChild(r); }
// «строки таблицы» на фиолетовом блоке
for (let i = 0; i < 6; i++) for (const [dx, w] of [[24, 180], [216, 56], [284, 16]]) { const r = figma.createRectangle(); r.name = 'Строка'; r.x = 1280 + dx; r.y = 256 + i * 52; r.resize(w, 16); r.cornerRadius = w === 16 ? 8 : 4; r.fills = [paint('pku-bg')]; cover.appendChild(r); }
const head = AL('VERTICAL', { name: 'Название', itemSpacing: 16 }); cover.appendChild(head); head.x = 80; head.y = 420;
head.appendChild(txt('ТЕСТОВОЕ ЗАДАНИЕ · PRODUCT DESIGNER', 'Терминал/touch-label', 'muted'));
const h1 = figma.createText(); h1.name = 'Заголовок'; h1.fontName = { family: 'Inter', style: 'Bold' }; h1.fontSize = 64; h1.lineHeight = { unit: 'PERCENT', value: 105 }; h1.letterSpacing = { unit: 'PERCENT', value: -2 }; h1.characters = 'Списание материалов со склада'; h1.fills = [paint('text')]; h1.textAutoResize = 'HEIGHT'; h1.resize(680, h1.height); head.appendChild(h1);
const lead = txt('Медицинский центр «МедСклад». Главная мысль: честный путь должен быть дешевле обходного. Кладовщик выбирает причину у каждой позиции, документы по причинам собирает система. Контроль включается только на учётных материалах.', 'Терминал/touch-body', 'muted'); lead.textAutoResize = 'HEIGHT'; lead.resize(640, lead.height); head.appendChild(lead);
const meta = AL('HORIZONTAL', { name: 'Метаданные', itemSpacing: 24 }); head.appendChild(meta);
for (const [k, v] of [['Экраны', 'Десктоп 1440 · Терминал 390'], ['Страницы', 'Экраны · Компоненты'], ['Дата', 'Октябрь 2026']]) { const m = AL('VERTICAL', { name: k }); m.appendChild(txt(k, 'Десктоп/text-caption', 'muted')); m.appendChild(txt(v, 'Десктоп/text-strong', 'text')); meta.appendChild(m); }

// ---------- 2. Персонажи ----------
const Y2 = 1000;
const sec = (title, y) => { const t = txt(title, 'Десктоп/title-page', 'text'); t.name = 'Раздел · ' + title; page.appendChild(t); t.x = 0; t.y = y; created.push(t.id); return t; };
sec('Кто списывает и что им важно', Y2);
const roles = AL('HORIZONTAL', { name: 'Персонажи', itemSpacing: 24 }); page.appendChild(roles); roles.x = 0; roles.y = Y2 + 56; created.push(roles.id);
const R = [
  ['Кладовщик', 'Списывает по ходу дня, в подсобке, одной рукой, в перчатках.', 'Быстро и не забыть', '«Пять документов из-за пяти причин — не буду» → всё в «Прочее»', 'Скан + одно касание. Причина у позиции, документы дня собирает система. Офлайн-очередь.'],
  ['Старшая медсестра', 'Отвечает перед проверяющими за учётные (ПКУ) материалы.', 'Учётное — только с причиной, серией и её ведома', '«Списали два флакона учётного вместе с бинтами как «Прочее»»', 'Метка «Учётный» до добавления. «Прочее» запрещено. Бой/утилизация — ей на подтверждение.'],
  ['Бухгалтер', 'Смотрит списания раз в месяц.', 'Понятная статья расходов', '«Треть списаний — «Прочее». Не знаю, куда относить»', 'Одна причина на документ. «Прочее» требует пояснения. Статья видна при выборе причины.']
];
for (const [name, ctx, want, pain, ans] of R) {
  const c = card('Персонаж · ' + name); c.resize(512, 100); c.counterAxisSizingMode = 'FIXED'; c.primaryAxisSizingMode = 'AUTO'; roles.appendChild(c);
  const top = AL('HORIZONTAL', { name: 'Имя', itemSpacing: 8 }); top.counterAxisAlignItems = 'CENTER'; c.appendChild(top);
  top.appendChild(txt(name, 'Десктоп/title-section', 'text')); if (name === 'Старшая медсестра') top.appendChild(badge.createInstance());
  wrapT(c, txt(ctx, 'Десктоп/text-body', 'muted'));
  for (const [k, v, col] of [['Важно', want, 'text'], ['Боль', pain, 'danger'], ['Ответ в интерфейсе', ans, 'ok']]) { const b = AL('VERTICAL', { name: k, itemSpacing: 2 }); add(c, b, 'FILL'); b.appendChild(txt(k.toUpperCase(), 'Десктоп/text-badge', 'muted')); wrapT(b, txt(v, 'Десктоп/text-body', col)); }
}

// ---------- 3. Схема сценария ----------
const Y3 = Y2 + 56 + roles.height + 96;
sec('Схема сценария', Y3);
const flow = AL('VERTICAL', { name: 'Схема сценария', itemSpacing: 28 }); page.appendChild(flow); flow.x = 0; flow.y = Y3 + 56; created.push(flow.id);
const lane = (title, steps, color) => {
  const l = AL('VERTICAL', { name: 'Дорожка · ' + title, itemSpacing: 10 }); flow.appendChild(l);
  l.appendChild(txt(title, 'Десктоп/text-label', 'muted'));
  const row = AL('HORIZONTAL', { name: 'Шаги', itemSpacing: 10 }); row.counterAxisAlignItems = 'CENTER'; l.appendChild(row);
  steps.forEach(([t, d, kind], i) => {
    if (i) row.appendChild(txt('→', 'Десктоп/title-modal', 'faint', 'Стрелка'));
    const s = AL('VERTICAL', { name: 'Шаг · ' + t, itemSpacing: 4 }); pad(s, 's14', 's12'); rad(s, 'radius'); s.resize(200, 60); s.counterAxisSizingMode = 'FIXED'; s.primaryAxisSizingMode = 'AUTO';
    fill(s, kind === 'pku' ? 'pku-bg' : kind === 'warn' ? 'warn-bg' : kind === 'ok' ? 'ok-bg' : 'surface'); stroke(s, kind === 'pku' ? 'pku' : kind === 'warn' ? 'warn-border' : kind === 'ok' ? 'ok-border' : color);
    wrapT(s, txt(t, 'Десктоп/text-strong', 'text')); if (d) wrapT(s, txt(d, 'Десктоп/text-small', 'muted'));
    row.appendChild(s);
  });
};
lane('ДЕСКТОП · ЭКРАНЫ 1–2 (D1–D4)', [['Склад', 'один склад — шаг пропускается'], ['Причина', 'одна на документ, видна статья'], ['Скан / поиск', 'метки «Учётный», неснижаемый — до добавления'], ['Таблица до 60 строк', 'статус строки, фильтр «С ошибками»'], ['Подтверждение', 'что спишется сразу, что ждёт'], ['Проведено', 'отмена до 23:59', 'ok']], 'border-strong');
lane('ТЕРМИНАЛ · ЭКРАН 3 (M1–M8)', [['Скан', 'камера или сканер'], ['Карточка', 'кол-во 1 и причина подставлены'], ['Списать', 'одно касание, ≈ 10 с'], ['Документ дня', 'одна причина — один документ', 'ok']], 'border-strong');
lane('ВЕТКИ КОНТРОЛЯ', [['Учётный материал', 'серия + комментарий, без «Прочего»', 'pku'], ['Бой / утилизация', 'на подтверждение, количество в резерве', 'pku'], ['Медсестра / заместитель', 'подтверждает или отклоняет с причиной', 'pku'], ['Проведено', 'резерв снят', 'ok']], 'pku');
lane('ВЕТКИ СБОЕВ', [['Нет связи', 'очередь на телефоне, «Не проведено — ждёт сети»', 'warn'], ['Связь вернулась', 'проверка остатка на сервере'], ['Отказ сервера', '«Списать 8 — сколько есть» / на компьютер', 'warn'], ['Провели в 23:50', 'после полуночи — сторно', 'warn']], 'warn-border');

// ---------- 4. Противоречия и допущения ----------
const Y4 = Y3 + 56 + flow.height + 96;
sec('Противоречия в правилах и как решили', Y4);
const grid = AL('HORIZONTAL', { name: 'Противоречия', itemSpacing: 24 }); grid.layoutWrap = 'WRAP'; grid.counterAxisSpacing = 24; grid.resize(1584, 100); grid.primaryAxisSizingMode = 'FIXED'; grid.counterAxisSizingMode = 'AUTO'; page.appendChild(grid); grid.x = 0; grid.y = Y4 + 56; created.push(grid.id);
const CT = [
  ['C1', 'Одна причина на документ ↔ «весь день одним документом»', 'Причина у позиции, документы дня собирает система. На десктопе конфликт снимается кнопкой «Вынести учётные в новый черновик».'],
  ['C2', 'Неснижаемый остаток ↔ просрочку списать сегодня', 'Неснижаемый считаем по годным единицам. Просрочка ниже порога — предупреждение и автозаявка на пополнение, не ошибка.'],
  ['C3', 'Учётный с телефона ↔ «нельзя мимоходом»', 'Можно, но честно: серия из DataMatrix или выбор крупными кнопками, комментарий готовой фразой, «Прочее» скрыто.'],
  ['C4', 'Подтверждение до проведения ↔ 20 обычных + 1 учётный', 'По умолчанию делим документ: обычные — сразу, учётный — отдельно, в резерве. В отпуске — заместитель.'],
  ['C5', 'Отмена «в тот же день» ↔ проведение в 23:50', 'Окно отмены с обратным отсчётом. После полуночи — корректирующий документ «Сторно».'],
  ['C6', 'Не терять ввод ↔ не проводить без сервера', 'Очередь на устройстве, честный статус, автопроведение при связи, уведомление с действием при отказе.']
];
for (const [id, q, a] of CT) {
  const c = card('Противоречие ' + id); c.resize(512, 100); c.counterAxisSizingMode = 'FIXED'; c.primaryAxisSizingMode = 'AUTO'; grid.appendChild(c);
  c.appendChild(txt(id, 'Десктоп/text-badge', 'accent')); wrapT(c, txt(q, 'Десктоп/text-strong', 'text')); wrapT(c, txt(a, 'Десктоп/text-body', 'muted'));
}

// ---------- 5. Навигация по файлу ----------
const Y5 = Y4 + 56 + grid.height + 96;
sec('Что где в файле', Y5);
const nav = AL('HORIZONTAL', { name: 'Навигация', itemSpacing: 24 }); page.appendChild(nav); nav.x = 0; nav.y = Y5 + 56; created.push(nav.id);
for (const [t, d] of [['Экраны', 'D1–D4 — десктопная форма, подтверждение и результат · M1–M8 — терминал · пояснения-стикеры рядом с каждым экраном'], ['Компоненты', '31 компонент с вариантами состояний: десктоп, таблица, терминал. Все цвета, отступы, радиусы и шрифты — переменные и стили.'], ['Разбор и решения', 'docs/01-razbor-zadaniya.md и docs/02-reshenia.md в репозитории github.com/issergio20/-1']]) {
  const c = card('Раздел ' + t); c.resize(512, 100); c.counterAxisSizingMode = 'FIXED'; c.primaryAxisSizingMode = 'AUTO'; nav.appendChild(c);
  c.appendChild(txt(t, 'Десктоп/title-section', 'text')); wrapT(c, txt(d, 'Десктоп/text-body', 'muted'));
}
return { created, bottom: nav.y + nav.height };
