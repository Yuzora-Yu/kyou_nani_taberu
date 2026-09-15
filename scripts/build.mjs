import { mkdir, rm, readFile, writeFile } from 'node:fs/promises';
import vm from 'node:vm';
import { cardMarkup } from '../catalog-card.mjs';

let html = await readFile('index.html', 'utf8');
// Inline the shared renderer for deployment at both trailing-slash URL forms.
html = html.replace("import { cardMarkup } from './catalog-card.mjs';", (await readFile('catalog-card.mjs', 'utf8')).replace('export function', 'function'));
// The browser's existing data remains the single source of truth.
function sourceArray(name) {
  const literal = html.match(new RegExp(`const ${name} = (\\[[\\s\\S]*?\\]);`))?.[1];
  if (!literal) throw new Error(`Missing catalog data: ${name}`);
  return vm.runInNewContext(literal, {}, { timeout: 1000 });
}
for (const [mode, data, paletteName] of [['food', 'foods', 'palettes'], ['drink', 'drinks', 'drinkPalettes']]) {
  const items = sourceArray(data);
  const palettes = sourceArray(paletteName);
  if (!items.length) throw new Error(`Empty ${mode} catalog`);
  const cards = items.map((item, index) => {
    const [a, b] = palettes[index % palettes.length];
    return `<article class="choice-card" style="--card-a:${a};--card-b:${b}">${cardMarkup(item)}</article>`;
  }).join('\n');
  html = html.replace(`<section class="grid" id="${mode}Grid" aria-live="polite"></section>`, `<section class="grid" id="${mode}Grid" aria-live="polite">${cards}</section>`);
  html = html.replace(`id="${mode}Count">0種類表示中`, `id="${mode}Count">${items.length}種類表示中`);
}
html = html.replace('</head>', '<noscript><style>#drinkPanel[hidden]{display:block!important}</style></noscript></head>');

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await writeFile('dist/index.html', html);
