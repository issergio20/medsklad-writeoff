// Локальный плагин: собирает экраны «МедСклад» из компонентов файла «Списание материалов — тестовое задание».
// Сгенерирован figma/plugin/build.sh — правьте figma/next-*.js и пересобирайте.
// Запуск: Figma desktop → Plugins → Development → Import plugin from manifest… → manifest.json.
const createAutoLayout = (dir = 'HORIZONTAL', props) => {
  if (typeof dir === 'object') { props = dir; dir = 'HORIZONTAL'; }
  const f = figma.createFrame();
  f.layoutMode = dir; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO'; f.fills = [];
  if (props) for (const k of Object.keys(props)) f[k] = props[k];
  return f;
};
let pendingText = [], pendingFx = [];
// Копируем свойства стиля сразу (чтобы автолейаут считал правильные размеры), а сам стиль привязываем в конце асинхронно.
const applyTextStyle = (t, s) => {
  t.fontName = s.fontName; t.fontSize = s.fontSize; t.lineHeight = s.lineHeight; t.letterSpacing = s.letterSpacing;
  pendingText.push([t, s.id]);
};
async function flushStyles() {
  for (const [n, id] of pendingText) await n.setTextStyleIdAsync(id);
  for (const [n, id] of pendingFx) await n.setEffectStyleIdAsync(id);
  const r = { text: pendingText.length, fx: pendingFx.length };
  pendingText = []; pendingFx = [];
  return r;
}
async function runMobile() {
const page = await figma.getNodeByIdAsync('4:2'); await figma.setCurrentPageAsync(page);
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
const txt = (chars, style, color, name) => { const t = figma.createText(); applyTextStyle(t, TS[style]); t.characters = chars; t.fills = [paint(color)]; if (name) t.name = name; return t; };
const AL = (dir, props = {}) => { const f = createAutoLayout(dir, props); f.fills = []; return f; };
const add = (parent, child, h, v) => { parent.appendChild(child); if (h) child.layoutSizingHorizontal = h; if (v) child.layoutSizingVertical = v; return child; };
const wrapT = (parent, t) => { parent.appendChild(t); t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT'; return t; };
const C = {}; for (const [k, id] of Object.entries({ Note: '6:232', SB: '10:99', TB: '10:100', TBtn: '10:124', Step: '10:161', RT: '10:175', TC: '10:183', Ser: '10:199', Card: '10:225', Day: '10:259' })) C[k] = await figma.getNodeByIdAsync(id);
const vi = (set, name) => set.children.find(c => c.name === name).createInstance();
const setT = (inst, name, chars) => { const t = inst.findOne(n => n.type === 'TEXT' && n.name === name); if (t) t.characters = chars; return inst; };
const setAll = (inst, map) => { for (const [k, v] of Object.entries(map)) setT(inst, k, v); return inst; };
const noteI = (title, body) => { const i = C.Note.createInstance(); const p = i.componentProperties; i.setProperties({ [Object.keys(p).find(k => k.startsWith('Title'))]: title, [Object.keys(p).find(k => k.startsWith('Body'))]: body }); return i; };

const Y0 = 4620;
const lab = AL('VERTICAL', { name: 'Раздел · 2 Терминал', itemSpacing: 6 }); lab.appendChild(txt('2 · Терминал — быстрое списание (390)', 'Десктоп/display', 'text'));
const ld = txt('Экран 3. Кладовщик в подсобке: одна рука, перчатки, скан. Обычный материал — скан + одно касание. Учётный — тот же путь + серия и комментарий крупными кнопками. Офлайн-очередь и документы дня по причинам.', 'Десктоп/text-body', 'muted'); ld.textAutoResize = 'HEIGHT'; ld.resize(1200, ld.height); lab.appendChild(ld);
page.appendChild(lab); lab.x = 0; lab.y = Y0;

const screens = []; const created = [];
const phone = (name, net = 'Online', topbar) => {
  const f = AL('VERTICAL', { name }); f.resize(390, 844); f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'FIXED'; f.minHeight = 844; fill(f, 'bg'); rad(f, 'radius-14'); f.clipsContent = true; stroke(f, 'border');
  add(f, vi(C.SB, 'Network=' + net), 'FILL');
  if (topbar) { const t = C.TB.createInstance(); setAll(t, topbar.texts || {}); const lg = t.findOne(n => n.name === 'Left button'); if (topbar.left === false) lg.visible = false; else if (topbar.left) setT(lg, 'Glyph', topbar.left); if (topbar.right === false) t.findOne(n => n.name === 'Right button').visible = false; add(f, t, 'FILL'); }
  page.appendChild(f); screens.push(f); return f;
};
const body = (f) => { const b = AL('VERTICAL', { name: 'Body' }); gap(b, 12); pad(b, 's14', 's14'); add(f, b, 'FILL'); b.layoutGrow = 1; return b; };
const bottom = (f) => { const b = AL('VERTICAL', { name: 'Bottom zone' }); gap(b, 8); pad(b, 's14', 's12'); b.paddingBottom = 26; fill(b, 'surface'); b.strokes = [paint('border')]; b.strokeTopWeight = 1; b.strokeBottomWeight = 0; b.strokeLeftWeight = 0; b.strokeRightWeight = 0; add(f, b, 'FILL'); return b; };
const tlabel = (b, t, hint) => { const r = AL('HORIZONTAL', { name: 'Label ' + t }); r.primaryAxisAlignItems = 'SPACE_BETWEEN'; add(b, r, 'FILL'); r.appendChild(txt(t, 'Терминал/touch-label', 'muted')); if (hint) r.appendChild(txt(hint, 'Терминал/touch-small', 'muted')); };
const tbtn = (style, state, label) => setT(vi(C.TBtn, `Style=${style}, State=${state}`), 'Label', label);
const grid = (b, items) => { const g = AL('HORIZONTAL', { name: 'Reasons' }); g.layoutWrap = 'WRAP'; gap(g, 8); g.counterAxisSpacing = 8; add(b, g, 'FILL'); for (const [sel, appr, label, hint] of items) { const t = vi(C.RT, `Selected=${sel}, Approval=${appr}`); setT(t, 'Label', label); if (hint) setT(t, 'Hint', hint); g.appendChild(t); } return g; };
const chips = (b, items) => { const g = AL('HORIZONTAL', { name: 'Chips' }); g.layoutWrap = 'WRAP'; gap(g, 8); g.counterAxisSpacing = 8; add(b, g, 'FILL'); for (const [sel, l] of items) g.appendChild(setT(vi(C.TC, 'Selected=' + sel), 'Label', l)); return g; };
const regularReasons = (selIdx) => [['В кабинет', '🚪'], ['Срок годности', '⌛'], ['Бой, порча', '💥'], ['Утилизация', '♻'], ['Прочее', '…']].map(([l, e], i) => [String(i === selIdx), 'false', (i === selIdx ? '✓ ' : '') + e + ' ' + l]);

// M1 Scan
const m1 = phone('M1 · Скан', 'Online', { left: false, texts: { Title: 'Списание', Subtitle: 'Основной склад · терминал подсобки' } });
const vf = AL('VERTICAL', { name: 'Видоискатель' }); vf.primaryAxisAlignItems = 'CENTER'; vf.counterAxisAlignItems = 'CENTER'; gap(vf, 24); fill(vf, 'text'); add(m1, vf, 'FILL'); vf.layoutGrow = 1; pad(vf, 's24', 's24');
const fr = figma.createFrame(); fr.name = 'Рамка скана'; fr.resize(260, 170); fr.fills = []; fr.cornerRadius = 18; fr.strokes = [paint('on-accent')]; fr.strokeWeight = 3; vf.appendChild(fr);
const line = figma.createRectangle(); line.name = 'Луч'; line.resize(236, 2); line.x = 12; line.y = 84; line.fills = [paint('danger')]; fr.appendChild(line);
vf.appendChild(txt('Наведите на штрихкод упаковки', 'Терминал/touch-body', 'on-accent'));
vf.appendChild(txt('или нажмите кнопку на сканере', 'Терминал/touch-small', 'faint'));
add(bottom(m1), tbtn('Secondary', 'Default', '⌨ Нет штрихкода — найти по названию'), 'FILL');

// M2 Regular
const m2 = phone('M2 · Обычный материал — 1 касание', 'Online', { texts: { Title: 'Списать', Subtitle: 'Основной склад' } });
const b2 = body(m2);
add(b2, vi(C.Card, 'Type=Regular'), 'FILL');
tlabel(b2, 'КОЛИЧЕСТВО'); add(b2, vi(C.Step, 'State=Default'), 'FILL');
tlabel(b2, 'ПРИЧИНА', 'как в прошлый раз'); grid(b2, regularReasons(0));
tlabel(b2, 'КАБИНЕТ', 'последние'); chips(b2, [['true', '203'], ['false', '101'], ['false', '305'], ['false', 'Другой…']]);
add(bottom(m2), tbtn('Primary', 'Default', 'Списать 1 шт. → каб. 203'), 'FILL');

// M3 Pku from DataMatrix
const m3 = phone('M3 · Учётный — серия с кода, на подтверждение', 'Online', { texts: { Title: 'Списать', Subtitle: 'Основной склад' } });
const b3 = body(m3);
add(b3, vi(C.Card, 'Type=Pku'), 'FILL');
tlabel(b3, 'КОЛИЧЕСТВО'); add(b3, setAll(vi(C.Step, 'State=Default'), { Unit: 'амп.' }), 'FILL');
tlabel(b3, 'ПРИЧИНА'); grid(b3, [['false', 'false', '🚪 В кабинет'], ['false', 'false', '⌛ Срок годности'], ['true', 'true', '✓ 💥 Бой, порча'], ['false', 'true', '♻ Утилизация']]);
wrapT(b3, txt('«Прочее» для учётных недоступно — нужна конкретная причина.', 'Терминал/touch-small', 'muted'));
tlabel(b3, 'СЕРИЯ *'); add(b3, vi(C.Ser, 'State=FromCode'), 'FILL');
tlabel(b3, 'КОММЕНТАРИЙ *', 'одно касание'); chips(b3, [['true', 'Разбита при выдаче'], ['false', 'Выдано по назначению'], ['false', 'Истёк срок'], ['false', '🎤 Надиктовать']]);
const bt3 = bottom(m3); wrapT(bt3, txt('◆ Уйдёт на подтверждение: Иванова Н. П. 1 амп. будет в резерве.', 'Терминал/touch-small', 'pku')); add(bt3, tbtn('Pku', 'Default', 'Отправить на подтверждение'), 'FILL');

// M4/M5 result screens
const doneScreen = (name, net, kind) => {
  const f = phone(name, net, null);
  const d = AL('VERTICAL', { name: 'Результат' }); d.primaryAxisAlignItems = 'CENTER'; d.counterAxisAlignItems = 'CENTER'; gap(d, 12); pad(d, 's24', 's24'); add(f, d, 'FILL'); d.layoutGrow = 1;
  const circ = figma.createFrame(); circ.name = 'Знак'; circ.resize(96, 96); circ.cornerRadius = 48; fill(circ, kind === 'ok' ? 'ok' : 'faint'); circ.layoutMode = 'HORIZONTAL'; circ.primaryAxisAlignItems = 'CENTER'; circ.counterAxisAlignItems = 'CENTER';
  circ.appendChild(txt(kind === 'ok' ? '✓' : '⏳', 'Десктоп/display', 'on-accent')); d.appendChild(circ);
  d.appendChild(txt(kind === 'ok' ? 'Списано' : 'Сохранено на телефоне', 'Терминал/touch-title', 'text'));
  const p = txt(kind === 'ok' ? 'Бинт марлевый 7 м × 14 см — 1 шт.' : 'Перчатки нитриловые, M — 1 упак.', 'Терминал/touch-body', 'muted'); p.textAlignHorizontal = 'CENTER'; wrapT(d, p);
  const chip = AL('VERTICAL', { name: 'Документ' }); gap(chip, 4); pad(chip, 's14', 's10'); rad(chip, 'radius-12'); fill(chip, 'surface'); stroke(chip, 'border'); add(d, chip, 'FILL');
  if (kind === 'ok') { wrapT(chip, txt('Добавлено в документ дня «Выдано в кабинет · 203». Сегодня в нём 4 поз.', 'Терминал/touch-small', 'text')); wrapT(chip, txt('Остаток: 259 шт.', 'Терминал/touch-small', 'muted')); }
  else { wrapT(chip, txt('Не проведено — ждёт сети. Как только связь появится, проверим остаток на сервере и проведём.', 'Терминал/touch-small', 'text')); wrapT(chip, txt('Коробку можно отдавать. Если что-то не сойдётся, придёт уведомление.', 'Десктоп/text-strong', 'text')); }
  if (kind === 'ok') { const pr = figma.createFrame(); pr.name = 'Автовозврат 3 с'; pr.resize(342, 4); pr.cornerRadius = 2; fill(pr, 'border'); const pi = figma.createRectangle(); pi.resize(200, 4); pi.fills = [paint('ok')]; pr.appendChild(pi); add(d, pr, 'FILL'); }
  const acts = AL('HORIZONTAL', { name: 'Действия' }); gap(acts, 8); add(d, acts, 'FILL');
  if (kind === 'ok') { add(acts, tbtn('Secondary', 'Default', '↶ Отменить'), 'FILL'); add(acts, tbtn('Primary', 'Default', 'Дальше'), 'FILL'); }
  else { add(acts, tbtn('Secondary', 'Default', 'Сканировать следующее'), 'FILL'); d.appendChild(txt('Очередь: 1 позиция ждёт сети', 'Терминал/touch-small', 'accent')); }
  return f;
};
doneScreen('M4 · Списано', 'Online', 'ok');
doneScreen('M5 · Нет связи — сохранено', 'Offline', 'off');

// M6 Today + sync error
const m6 = phone('M6 · Документы дня и ошибка синхронизации', 'Online', { left: '←', right: false, texts: { Title: 'Сегодня, 14 октября', Subtitle: '5 документов · по одному на причину' } });
const b6 = body(m6);
const se = AL('VERTICAL', { name: 'Ошибка синхронизации' }); gap(se, 8); pad(se, 's14', 's14'); rad(se, 'radius-14'); fill(se, 'surface'); stroke(se, 'danger', 2); add(b6, se, 'FILL');
se.appendChild(txt('✕ Не проведено: перчатки L', 'Терминал/touch-option', 'danger'));
wrapT(se, txt('Пока не было связи, остаток изменился: на сервере доступно 8 упак., а вы списали 10. Коробку уже отдали в кабинет 203?', 'Терминал/touch-small', 'text'));
add(se, tbtn('Primary', 'Default', 'Списать 8 — сколько есть'), 'FILL'); add(se, tbtn('Secondary', 'Default', 'Разберусь с компьютера'), 'FILL');
wrapT(se, txt('Если выдали больше, чем числится, — это расхождение. Его разберут при инвентаризации, черновик сохранится.', 'Десктоп/text-small', 'muted'));
add(b6, vi(C.Day, 'Status=Posted'), 'FILL');
add(b6, setAll(vi(C.Day, 'Status=Posted'), { Title: '⌛ Срок годности' }), 'FILL');
add(b6, vi(C.Day, 'Status=Waiting'), 'FILL');

// M7 below min
const m7 = phone('M7 · Ниже неснижаемого — кнопка называет проблему', 'Online', { texts: { Title: 'Списать', Subtitle: 'Основной склад' } });
const b7 = body(m7);
const c7 = setAll(vi(C.Card, 'Type=Regular'), { Name: 'Перчатки нитриловые смотровые неопудренные, размер L', SKU: 'PRC-1103', Stock: 'На складе 18 упак.', Available: 'можно 8' });
setT(c7.findOne(n => n.type === 'INSTANCE' && n.name === 'Tag'), 'Label', '▼ Неснижаемый 10'); add(b7, c7, 'FILL');
tlabel(b7, 'КОЛИЧЕСТВО'); add(b7, vi(C.Step, 'State=Error'), 'FILL');
tlabel(b7, 'ПРИЧИНА', 'как в прошлый раз'); grid(b7, regularReasons(0));
tlabel(b7, 'КАБИНЕТ', 'последние'); chips(b7, [['true', '203'], ['false', '101'], ['false', '305'], ['false', 'Другой…']]);
add(bottom(m7), tbtn('Primary', 'Disabled', 'Исправьте количество'), 'FILL');

// M8 Pku without barcode
const m8 = phone('M8 · Учётный без штрихкода, серия нечитаема', 'Online', { texts: { Title: 'Списать', Subtitle: 'найдено по названию' } });
const b8 = body(m8);
add(b8, setAll(vi(C.Card, 'Type=Pku'), { Name: 'Спирт этиловый 95 %, фл. 100 мл', SKU: 'PKU-0300', Stock: 'На складе 22 фл.', Available: 'можно 17' }), 'FILL');
tlabel(b8, 'СЕРИЯ *', 'выберите ту, что на упаковке');
add(b8, setAll(vi(C.Ser, 'State=Default'), { Label: 'С-0924', Meta: '12 фл. · до 09.2029' }), 'FILL');
add(b8, vi(C.Ser, 'State=Default'), 'FILL');
const un = vi(C.Ser, 'State=Unreadable'); fill(un, 'pku-bg'); add(b8, un, 'FILL');
const ph = AL('HORIZONTAL', { name: 'Фото упаковки' }); ph.primaryAxisAlignItems = 'CENTER'; ph.counterAxisAlignItems = 'CENTER'; pad(ph, 's14', 's24'); rad(ph, 'radius-12'); fill(ph, 'surface-2'); stroke(ph, 'border-strong'); ph.dashPattern = [6, 4]; add(b8, ph, 'FILL');
ph.appendChild(txt('📷 Фото упаковки прикреплено ✓', 'Терминал/touch-option', 'text'));
tlabel(b8, 'КОММЕНТАРИЙ *', 'одно касание'); chips(b8, [['false', 'Разбита при выдаче'], ['false', 'Повреждена упаковка'], ['false', '🎤 Надиктовать']]);
const bt8 = bottom(m8); wrapT(bt8, txt('◆ Серию определит старшая медсестра — строка всегда уходит на подтверждение.', 'Терминал/touch-small', 'pku')); add(bt8, tbtn('Pku', 'Disabled', 'Добавьте комментарий'), 'FILL');

const notesData = [
  ['Скан — основной ввод', 'Камера включена сразу; подключённый сканер тоже работает. Склад привязан к терминалу. Нет штрихкода — поиск по названию.'],
  ['10 секунд на обычный', 'Количество 1 и последняя причина подставлены — остаётся одно касание «Списать». Цели ≥ 56 px, главная кнопка внизу под большим пальцем.'],
  ['Учётный — можно, но честно', 'Серия из DataMatrix, комментарий готовой фразой или голосом. «Прочее» не показываем. Бой/утилизация → на подтверждение, количество в резерве. Обходного пути нет.'],
  ['Без модалок', 'Экран сам вернётся к скану через 3 с. Видно, в какой документ дня попала позиция. Отменить можно сразу здесь.'],
  ['Связь пропала после скана', 'Ввод не теряется: «Не проведено — ждёт сети». Без проверки на сервере не проводим. Коробку можно отдавать — проведём при связи сами.'],
  ['Несколько причин подряд', 'Одна причина — один документ дня, система раскладывает сама. Отказ сервера после офлайна — карточка с готовым действием.'],
  ['Кнопка называет проблему', 'Ниже неснижаемого: степпер красный, текст говорит, сколько можно и что делать при просрочке; кнопка: «Исправьте количество».'],
  ['Нет штрихкода и серии', 'Серии с остатка крупными кнопками. «Не могу прочитать» → фото → строка всегда на подтверждение, серию выбирает медсестра.']
];
let x = 0; const nIds = [];
for (let i = 0; i < screens.length; i++) {
  const s = screens[i]; s.x = x; s.y = Y0 + 140;
  const n = noteI(notesData[i][0], notesData[i][1]); page.appendChild(n); n.resize(390, n.height); n.x = x; n.y = s.y + s.height + 24; nIds.push(n.id);
  created.push(s.id); x += 390 + 60;
}
return { screens: created, notes: nIds, label: lab.id, maxBottom: Math.max(...screens.map(s => s.y + s.height)) };
}
async function runD3D4() {
const page = await figma.getNodeByIdAsync('4:2'); await figma.setCurrentPageAsync(page);
const V = {}; for (const v of await figma.variables.getLocalVariablesAsync()) V[v.name] = v;
const TS = {}; for (const s of await figma.getLocalTextStylesAsync()) TS[s.name] = s;
const ES = {}; for (const s of await figma.getLocalEffectStylesAsync()) ES[s.name] = s;
for (const s of ['Regular','Medium','Semi Bold','Bold']) await figma.loadFontAsync({ family: 'Inter', style: s });
const paint = n => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', V['color/' + n]);
const fill = (node, n) => { node.fills = n ? [paint(n)] : []; };
const stroke = (node, n, w = 1) => { node.strokes = [paint(n)]; node.strokeWeight = w; node.strokeAlign = 'INSIDE'; };
const bind = (node, prop, name) => node.setBoundVariable(prop, V[name]);
const sp = n => 'spacing/space-' + n;
const pad = (node, h, v) => { for (const p of ['paddingLeft','paddingRight']) typeof h === 'number' ? node[p] = h : bind(node, p, sp(h.slice(1))); for (const p of ['paddingTop','paddingBottom']) typeof v === 'number' ? node[p] = v : bind(node, p, sp(v.slice(1))); };
const rad = (node, n) => { for (const p of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius']) bind(node, p, 'radius/' + n); };
const gap = (node, n) => bind(node, 'itemSpacing', sp(n));
const txt = (chars, style, color, name) => { const t = figma.createText(); applyTextStyle(t, TS[style]); t.characters = chars; t.fills = [paint(color)]; if (name) t.name = name; return t; };
const AL = (dir, props = {}) => { const f = createAutoLayout(dir, props); f.fills = []; return f; };
const add = (parent, child, h, v) => { parent.appendChild(child); if (h) child.layoutSizingHorizontal = h; if (v) child.layoutSizingVertical = v; return child; };
const wrapT = (parent, t) => { parent.appendChild(t); t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT'; return t; };
const C = {}; for (const [k, id] of Object.entries({ Button: '6:66', Note: '6:232', Header: '8:391', Group: '8:380', Irr: '8:390', Banner: '6:209', Status: '6:106' })) C[k] = await figma.getNodeByIdAsync(id);
const vi = (set, name) => set.children.find(c => c.name === name).createInstance();
const setT = (inst, name, chars) => { const t = inst.findOne(n => n.type === 'TEXT' && n.name === name); if (t) t.characters = chars; return inst; };
const noteI = (title, body) => { const i = C.Note.createInstance(); const p = i.componentProperties; i.setProperties({ [Object.keys(p).find(k => k.startsWith('Title'))]: title, [Object.keys(p).find(k => k.startsWith('Body'))]: body }); return i; };
const btn = (style, size, label) => { const i = vi(C.Button, `Style=${style}, Size=${size}, State=Default`); const k = Object.keys(i.componentProperties).find(k => k.startsWith('Label')); i.setProperties({ [k]: label }); return i; };

const modalShell = (title) => {
  const m = AL('VERTICAL', { name: 'Модальное окно' }); m.resize(820, 400); m.primaryAxisSizingMode = 'AUTO'; m.counterAxisSizingMode = 'FIXED'; rad(m, 'radius-14'); fill(m, 'surface'); pendingFx.push([m, ES['shadow-modal'].id]); m.clipsContent = true;
  const h = AL('VERTICAL', { name: 'Шапка окна' }); gap(h, 12); pad(h, 's24', 's20'); h.paddingBottom = 14; h.strokes = [paint('border')]; h.strokeBottomWeight = 1; h.strokeTopWeight = 0; h.strokeLeftWeight = 0; h.strokeRightWeight = 0; add(m, h, 'FILL');
  h.appendChild(txt(title, 'Десктоп/title-modal', 'text', 'Title'));
  return { m, h };
};

const Y3 = 3220;
const d3 = figma.createFrame(); d3.name = 'D3 · Подтверждение (23:50, медсестра в отпуске)'; d3.resize(1440, 1180); fill(d3, 'bg'); page.appendChild(d3); d3.x = 0; d3.y = Y3; d3.clipsContent = true;
const hdr = C.Header.createInstance(); d3.appendChild(hdr); hdr.x = 0; hdr.y = 0;
const ghost = figma.createRectangle(); ghost.name = 'Форма (под затемнением)'; ghost.resize(1376, 1040); ghost.x = 32; ghost.y = 80; ghost.cornerRadius = 10; fill(ghost, 'surface'); d3.appendChild(ghost);
const scrim = figma.createRectangle(); scrim.name = 'Scrim'; scrim.resize(1440, 1180); fill(scrim, 'scrim'); d3.appendChild(scrim);
const { m, h } = modalShell('Проверьте перед проведением');
const sum = AL('HORIZONTAL', { name: 'Сводка', itemSpacing: 32 }); h.appendChild(sum);
for (const [k, v] of [['Склад', 'Основной склад'], ['Причина', 'Бой и порча'], ['Кабинет-получатель', '— не нужен для этой причины']]) { const c = AL('VERTICAL', { name: k }); c.appendChild(txt(k, 'Десктоп/text-meta', 'muted')); c.appendChild(txt(v, 'Десктоп/text-body', 'text')); sum.appendChild(c); }
const mb = AL('VERTICAL', { name: 'Тело окна' }); gap(mb, 16); pad(mb, 's24', 's16'); add(m, mb, 'FILL');
const mode = AL('VERTICAL', { name: 'Выбор: разделить или одним документом' }); gap(mode, 8); add(mb, mode, 'FILL');
wrapT(mode, txt('В документе есть и обычные, и учётные материалы, которым нужно подтверждение', 'Десктоп/text-strong', 'text'));
for (const [on, t, s] of [[true, 'Разделить на два документа (рекомендуем)', 'Обычные (20) спишутся сейчас, учётные (1) — после подтверждения. Причина у обоих одна: «Бой и порча».'], [false, 'Одним документом', 'Весь документ, включая 20 обычных позиций, будет ждать подтверждения.']]) {
  const o = AL('HORIZONTAL', { name: on ? 'Вариант · выбран' : 'Вариант' }); gap(o, 10); pad(o, 's12', 's10'); rad(o, 'radius'); fill(o, on ? 'accent-bg' : 'surface'); stroke(o, on ? 'accent' : 'border'); add(mode, o, 'FILL');
  o.appendChild(txt(on ? '◉' : '○', 'Десктоп/text-strong', on ? 'accent' : 'muted'));
  const tx = AL('VERTICAL', { name: 'Text' }); add(o, tx, 'FILL'); tx.appendChild(txt(t, 'Десктоп/text-strong', 'text')); wrapT(tx, txt(s, 'Десктоп/text-small', 'muted'));
}
const g1 = vi(C.Group, 'Type=Direct'); setT(g1, 'Count', '20 поз. · документ СП-0142'); add(mb, g1, 'FILL');
const g2 = vi(C.Group, 'Type=Approval'); add(mb, g2, 'FILL');
add(mb, vi(C.Irr, 'Late=true'), 'FILL');
const mf = AL('HORIZONTAL', { name: 'Футер окна' }); mf.counterAxisAlignItems = 'CENTER'; gap(mf, 10); pad(mf, 's24', 's14'); mf.paddingBottom = 20; mf.strokes = [paint('border')]; mf.strokeTopWeight = 1; mf.strokeBottomWeight = 0; mf.strokeLeftWeight = 0; mf.strokeRightWeight = 0; add(m, mf, 'FILL');
const tm = txt('Время на сервере: 23:50', 'Десктоп/text-small', 'muted'); add(mf, tm, 'FILL');
mf.appendChild(btn('Secondary', 'Lg', '← Вернуться к редактированию')); mf.appendChild(btn('Primary', 'Lg', 'Провести 20 и отправить 1 на подтверждение'));
d3.appendChild(m); m.x = (1440 - 820) / 2; m.y = 70;
d3.resize(1440, Math.max(1180, m.y + m.height + 60)); scrim.resize(1440, d3.height); ghost.resize(1376, d3.height - 120);

const { m: r, h: rh } = modalShell('Готово');
r.name = 'D4 · Результат проведения'; page.appendChild(r); r.x = 1480 + 420; r.y = Y3;
const rb = AL('VERTICAL', { name: 'Тело' }); gap(rb, 12); pad(rb, 's24', 's16'); add(r, rb, 'FILL');
const doc = (statusV, num, sub, action) => { const d = AL('HORIZONTAL', { name: num }); d.counterAxisAlignItems = 'MIN'; gap(d, 14); pad(d, 's14', 's14'); rad(d, 'radius-10'); stroke(d, 'border'); fill(d, 'surface'); add(rb, d, 'FILL'); const s = vi(C.Status, statusV); setT(s, 'Label', ''); d.appendChild(s); const t = AL('VERTICAL', { name: 'Text', itemSpacing: 2 }); add(d, t, 'FILL'); t.appendChild(txt(num, 'Десктоп/text-strong', 'text')); wrapT(t, txt(sub, 'Десктоп/text-small', 'muted')); d.appendChild(action); };
doc('Status=Ok', 'СП-0142 проведён · 20 поз.', 'Остатки уменьшены. Отменить можно до 23:59 сегодня.', btn('Danger', 'Sm', 'Отменить списание'));
doc('Status=Waiting', 'СП-0143 ждёт подтверждения · 1 поз.', 'Запрос у Петровой А. С. (замещает Иванову Н. П.). 1 амп. в резерве. Ждать не нужно — сообщим о решении.', btn('Secondary', 'Sm', 'Напомнить'));
const rf = AL('HORIZONTAL', { name: 'Футер' }); rf.primaryAxisAlignItems = 'MAX'; gap(rf, 10); pad(rf, 's24', 's14'); rf.paddingBottom = 20; add(r, rf, 'FILL');
rf.appendChild(btn('Secondary', 'Lg', 'К списку документов')); rf.appendChild(btn('Primary', 'Lg', 'Новое списание'));

const notes = [
  [1480, Y3 + 120, 'Разделение по умолчанию', '20 обычных + 1 учётный при «Бой и порча»: обычные проводятся сразу, учётный — отдельным документом с той же причиной. Иначе 20 позиций зависли бы до ответа медсестры.'],
  [1480, Y3 + 380, 'Куда уходит запрос', 'Получатель виден до проведения. Медсестра в отпуске → запрос уходит заместителю (Петрова А. С.). Нет заместителя → главной медсестре. Пустого получателя нет.'],
  [1480, Y3 + 600, 'Что с остатками', 'Пока ответа нет, 1 амп. в резерве: числится на остатке, но списать её другим документом нельзя. Отклонение снимает резерв и приходит уведомлением с причиной.'],
  [1480, Y3 + 820, 'Необратимость и окно отмены', 'Изменить проведённое нельзя, отменить целиком — до 23:59 сегодня. В 23:50 плашка жёлтая и считает минуты; после полуночи остаётся сторно (см. тупик 5).'],
  [1480 + 420, Y3 + r.height + 30, 'Результат', 'Без лишних «Вы уверены?». У проведённого — «Отменить списание» до конца дня (для учётных — тоже через медсестру). У ожидающего — «Напомнить».']
];
const nIds = []; for (const [x, y, t, b] of notes) { const n = noteI(t, b); page.appendChild(n); n.x = x; n.y = y; nIds.push(n.id); }
return { d3: d3.id, d4: r.id, notes: nIds, bottom: d3.y + d3.height };
}
async function runCover() {
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
const txt = (chars, style, color, name) => { const t = figma.createText(); applyTextStyle(t, TS[style]); t.characters = chars; t.fills = [paint(color)]; if (name) t.name = name; return t; };
const AL = (dir, props = {}) => { const f = createAutoLayout(dir, props); f.fills = []; return f; };
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
}
// команда → страница, «маркер» уже собранного и сборщик
const COMMANDS = {
  mobile: { pageId: '4:2', pageName: 'Экраны', marker: 'Раздел · 2 Терминал', run: runMobile, done: r => 'Готово: ' + r.screens.length + ' мобильных экранов', zoom: r => r.screens },
  d3d4: { pageId: '4:2', pageName: 'Экраны', marker: 'D3 · Подтверждение (23:50, медсестра в отпуске)', run: runD3D4, done: () => 'Готово: окно подтверждения и результат', zoom: r => [r.d3, r.d4] },
  cover: { pageId: '4:3', pageName: 'Обложка и сценарий', marker: 'Обложка', run: runCover, done: () => 'Готово: обложка, персонажи, схема сценария, противоречия', zoom: r => r.created }
};
(async () => {
  let msg, page, before;
  try {
    const cmd = COMMANDS[figma.command];
    if (!cmd) { msg = 'Неизвестная команда'; return; }
    page = await figma.getNodeByIdAsync(cmd.pageId);
    if (!page) { msg = 'Не найдена страница «' + cmd.pageName + '» — откройте файл «Списание материалов — тестовое задание»'; return; }
    await figma.setCurrentPageAsync(page);
    if (page.children.some(n => n.name === cmd.marker)) { msg = 'Уже собрано на странице «' + cmd.pageName + '»'; return; }
    before = new Set(page.children.map(n => n.id));
    const r = await cmd.run(); await flushStyles();
    const ids = cmd.zoom(r) || [];
    figma.viewport.scrollAndZoomIntoView(page.children.filter(n => ids.includes(n.id)));
    msg = cmd.done(r);
  } catch (e) {
    console.error(e);
    let removed = 0;
    if (page && before) for (const n of [...page.children]) if (!before.has(n.id)) { n.remove(); removed++; }
    msg = 'Ошибка: ' + (e && e.message ? e.message : e) + (removed ? ' (созданное откатили)' : '');
  } finally {
    figma.closePlugin(msg);
  }
})();
