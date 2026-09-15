import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { cardMarkup } from '../catalog-card.mjs';
const source = await readFile('index.html', 'utf8');
const output = await readFile('dist/index.html', 'utf8');
for (const [mode, name] of [['food', 'foods'], ['drink', 'drinks']]) {
  const items = JSON.parse(source.match(new RegExp(`const ${name} = (\\[[^\\n]*\\]);`))[1]);
  const grid = output.match(new RegExp(`id="${mode}Grid"[^>]*>([\\s\\S]*?)</section>`))[1];
  assert.equal((grid.match(/<article /g) || []).length, items.length);
  assert.ok(output.includes(`id="${mode}Count">${items.length}種類表示中`));
  for (const item of items) assert.ok(grid.includes(cardMarkup(item)));
  assert.ok(output.includes(`${mode}Grid.replaceChildren(`));
}
for (const path of ['/tools/Tool02_kyou-nani-taberu/', '/', '/privacy/', '/terms/', '/contact/']) {
  assert.ok(output.includes(`href="https://yu-zora.com${path}"`));
}
assert.ok(!output.includes("import { cardMarkup }"));
assert.ok(cardMarkup({name:'<test>',emoji:'&',imageCode:'1',badge:'"',desc:'<b>',tags:['<x>']}).includes('&lt;test&gt;'));
console.log('Catalog pre-render, single data source, escaping and navigation checks passed.');
