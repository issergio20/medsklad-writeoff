#!/usr/bin/env bash
# Собирает figma/plugin/code.js из скриптов figma/next-*.js, адаптируя MCP-код к обычному Plugin API:
#  - figma.createAutoLayout (есть только в MCP) → локальная функция createAutoLayout;
#  - node.textStyleId / node.effectStyleId (запрещены при documentAccess: dynamic-page)
#    → отложенные setTextStyleIdAsync / setEffectStyleIdAsync;
#  - node.screenshot (только MCP) → удаляется.
set -e
cd "$(dirname "$0")/.."
body() {
  sed -e '1{/^\/\//d}' \
      -e '/\.screenshot(/d' \
      -e 's/figma\.createAutoLayout(/createAutoLayout(/g' \
      -e 's/t\.textStyleId = TS\[style\]\.id;/applyTextStyle(t, TS[style]);/g' \
      -e 's/\([A-Za-z0-9_]*\)\.effectStyleId = \(ES\[[^]]*\]\)\.id;/pendingFx.push([\1, \2.id]);/g' \
      "$1"
}
{
cat <<'EOF'
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
EOF
body next-mobile.js
cat <<'EOF'
}
async function runD3D4() {
EOF
body next-d3-d4.js
cat <<'EOF'
}
async function runCover() {
EOF
body next-cover.js
cat <<'EOF'
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
EOF
} > plugin/code.js
echo "built plugin/code.js"
