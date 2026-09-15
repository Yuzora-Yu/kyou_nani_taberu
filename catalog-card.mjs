const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

export function cardMarkup(item) {
  const image = item.imageUrl || `https://openmoji.org/data/color/svg/${item.imageCode}.svg`;
  return `<div class="art">
    <img src="${escape(image)}" alt="${escape(item.name)}のイラスト" loading="lazy">
    <span class="emoji-fallback" aria-hidden="true">${escape(item.emoji)}</span>
  </div>
  <div class="card-body">
    <div class="card-top"><h3>${escape(item.name)}</h3><span class="badge">${escape(item.badge)}</span></div>
    <p>${escape(item.desc)}</p>
    <div class="tags">${item.tags.map(tag => `<span class="tag"># ${escape(tag)}</span>`).join('')}</div>
  </div>`;
}
