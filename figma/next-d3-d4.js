// use_figma script (fileKey 1RCh1MB57sbe1fwBMUEwwI): D3 confirmation modal + D4 result, Screens page 4:2, start y=3220
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
const txt = (chars, style, color, name) => { const t = figma.createText(); t.textStyleId = TS[style].id; t.characters = chars; t.fills = [paint(color)]; if (name) t.name = name; return t; };
const AL = (dir, props = {}) => { const f = figma.createAutoLayout(dir, props); f.fills = []; return f; };
const add = (parent, child, h, v) => { parent.appendChild(child); if (h) child.layoutSizingHorizontal = h; if (v) child.layoutSizingVertical = v; return child; };
const wrapT = (parent, t) => { parent.appendChild(t); t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT'; return t; };
const C = {}; for (const [k, id] of Object.entries({ Button: '6:66', Note: '6:232', Header: '8:391', Group: '8:380', Irr: '8:390', Banner: '6:209', Status: '6:106' })) C[k] = await figma.getNodeByIdAsync(id);
const vi = (set, name) => set.children.find(c => c.name === name).createInstance();
const setT = (inst, name, chars) => { const t = inst.findOne(n => n.type === 'TEXT' && n.name === name); if (t) t.characters = chars; return inst; };
const noteI = (title, body) => { const i = C.Note.createInstance(); const p = i.componentProperties; i.setProperties({ [Object.keys(p).find(k => k.startsWith('Title'))]: title, [Object.keys(p).find(k => k.startsWith('Body'))]: body }); return i; };
const btn = (style, size, label) => { const i = vi(C.Button, `Style=${style}, Size=${size}, State=Default`); const k = Object.keys(i.componentProperties).find(k => k.startsWith('Label')); i.setProperties({ [k]: label }); return i; };

const modalShell = (title) => {
  const m = AL('VERTICAL', { name: 'Модальное окно' }); m.resize(820, 400); m.primaryAxisSizingMode = 'AUTO'; m.counterAxisSizingMode = 'FIXED'; rad(m, 'radius-14'); fill(m, 'surface'); m.effectStyleId = ES['shadow-modal'].id; m.clipsContent = true;
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
await d3.screenshot({ scale: 0.45 }); await r.screenshot({ scale: 0.6 });
return { d3: d3.id, d4: r.id, notes: nIds, bottom: d3.y + d3.height };
