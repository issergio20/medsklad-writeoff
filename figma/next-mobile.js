// use_figma script (fileKey 1RCh1MB57sbe1fwBMUEwwI): 8 mobile screens M1–M8 + notes, Screens page 4:2, y=4620
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
const txt = (chars, style, color, name) => { const t = figma.createText(); t.textStyleId = TS[style].id; t.characters = chars; t.fills = [paint(color)]; if (name) t.name = name; return t; };
const AL = (dir, props = {}) => { const f = figma.createAutoLayout(dir, props); f.fills = []; return f; };
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
for (const s of screens.slice(0, 4)) await s.screenshot({ scale: 0.45 });
return { screens: created, notes: nIds, label: lab.id, maxBottom: Math.max(...screens.map(s => s.y + s.height)) };
