/* 706 Together character grammar. Original SVG geometry inspired by the saved
   reference boards; no source artwork is traced or embedded in the generator. */
(function () {
  'use strict';

  const palettes = [
    { id: 'green', label: '社区绿', fill: '#00AD57', ink: '#153D31', cheek: '#D5ED33' },
    { id: 'lime', label: '青柠', fill: '#D5ED33', ink: '#153D31', cheek: '#FFAD77' },
    { id: 'pink', label: '樱花粉', fill: '#F3C7E6', ink: '#153D31', cheek: '#FFAD77' },
    { id: 'blue', label: '天蓝', fill: '#CCE5F4', ink: '#153D31', cheek: '#F3C7E6' },
    { id: 'apricot', label: '杏橙', fill: '#FFAD77', ink: '#153D31', cheek: '#F3C7E6' },
    { id: 'violet', label: '柔紫', fill: '#B99ADB', ink: '#153D31', cheek: '#F3C7E6' },
    { id: 'butter', label: '奶黄', fill: '#FFD451', ink: '#153D31', cheek: '#FFAD77' },
    { id: 'cream', label: '奶油', fill: '#F0EBDD', ink: '#153D31', cheek: '#F3C7E6' },
  ];

  const parts = {
    body: [
      { id: 'circle', label: '圆脸', svg: '<circle cx="100" cy="112" r="70" fill="{fill}"/>' },
      { id: 'arch', label: '圆拱', svg: '<path d="M31 156V105a69 69 0 0 1 138 0v51q0 16-16 16H47q-16 0-16-16Z" fill="{fill}"/>' },
      { id: 'flower', label: '四瓣花', svg: '<path d="M100 46c27-31 66-18 67 17 35 1 47 40 17 65 13 34-19 62-51 42-31 25-64 6-63-30-35-11-35-52 1-65 1-33 38-46 62-18Z" fill="{fill}"/>' },
      { id: 'bean', label: '豆形', svg: '<path d="M39 126c-14-32-1-66 31-74 12-23 47-27 63-8 43-2 64 31 48 63 11 28-9 59-37 59-15 21-51 22-66 5-26 6-49-14-39-45Z" fill="{fill}"/>' },
      { id: 'square', label: '圆角方块', svg: '<rect x="32" y="43" width="136" height="136" rx="35" fill="{fill}"/>' },
      { id: 'petal', label: '水滴花瓣', svg: '<path d="M100 28c19 26 65 65 65 106 0 37-28 60-65 60s-65-23-65-60c0-41 46-80 65-106Z" fill="{fill}"/>' },
      { id: 'triangle', label: '圆角三角', svg: '<path d="M87 46q13-21 26 0l67 112q12 22-13 22H33q-25 0-13-22Z" fill="{fill}" stroke="{fill}" stroke-width="12" stroke-linejoin="round"/>' },
      { id: 'clover', label: '三叶草', svg: '<path d="M100 66c-18-37-69-28-70 7-2 19 11 34 25 40-28 21-13 64 21 64 10 0 18-4 24-11 21 23 61 11 64-20 2-16-6-27-19-34 38-29 10-77-28-66-8 2-13 9-17 20Z" fill="{fill}"/>' },
    ],
    hair: [
      { id: 'none', label: '无头发', svg: '' },
      { id: 'curl', label: '卷卷', svg: '<path d="M57 48c-7-21 19-29 28-10 8-30 39-20 34 5 15-21 39-8 28 12" fill="none" stroke="{ink}" stroke-width="6" stroke-linecap="round"/>' },
      { id: 'tuft', label: '翘发', svg: '<path d="M90 45q-8-24 8-31 9 14 4 30 16-23 29-17 0 22-18 31" fill="none" stroke="{ink}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' },
      { id: 'fringe', label: '刘海', svg: '<path d="M44 76q15-38 54-40 45 0 59 37-24-12-36-5-17-16-35 2-17-7-42 6Z" fill="{ink}"/>' },
      { id: 'bun', label: '小发髻', svg: '<circle cx="100" cy="32" r="17" fill="{ink}"/><path d="M56 66Q100 23 145 66" fill="none" stroke="{ink}" stroke-width="8" stroke-linecap="round"/>' },
      { id: 'side', label: '偏分', svg: '<path d="M48 75Q53 32 115 39q40 2 45 36-25-17-37-17-41 22-75 17Z" fill="{ink}"/><path d="M105 47q-2 14-12 22" fill="none" stroke="{fill}" stroke-width="4"/>' },
      { id: 'sprout', label: '小芽', svg: '<path d="M100 60V32m0 10q-31 5-30-21 26-2 30 21Zm0-2q7-26 32-24 1 25-32 24Z" fill="{fill}" stroke="{ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' },
      { id: 'zigzag', label: '锯齿', svg: '<path d="M51 67 64 39l17 16 18-31 17 29 20-17 13 30" fill="none" stroke="{ink}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>' },
    ],
    eyes: [
      { id: 'dots', label: '圆点眼', svg: '<ellipse cx="78" cy="105" rx="5" ry="8" fill="{ink}"/><ellipse cx="122" cy="105" rx="5" ry="8" fill="{ink}"/>' },
      { id: 'wide', label: '大眼睛', svg: '<ellipse cx="76" cy="105" rx="13" ry="15" fill="white"/><ellipse cx="124" cy="105" rx="13" ry="15" fill="white"/><circle cx="80" cy="108" r="6" fill="{ink}"/><circle cx="128" cy="108" r="6" fill="{ink}"/>' },
      { id: 'blink', label: '眨眼', svg: '<path d="M64 105q12 14 25 0" fill="none" stroke="{ink}" stroke-width="5" stroke-linecap="round"/><ellipse cx="125" cy="105" rx="6" ry="9" fill="{ink}"/>' },
      { id: 'closed', label: '闭眼笑', svg: '<path d="M65 108q12 12 25 0m20 0q13 12 25 0" fill="none" stroke="{ink}" stroke-width="5" stroke-linecap="round"/>' },
      { id: 'sleepy', label: '半眯眼', svg: '<path d="M64 105h27m19 0h27" fill="none" stroke="{ink}" stroke-width="6" stroke-linecap="round"/><path d="M70 98q10-5 20 0m20 0q10-5 20 0" fill="none" stroke="{ink}" stroke-width="3"/>' },
      { id: 'look', label: '向左看', svg: '<ellipse cx="76" cy="105" rx="12" ry="15" fill="white"/><ellipse cx="124" cy="105" rx="12" ry="15" fill="white"/><circle cx="71" cy="107" r="6" fill="{ink}"/><circle cx="119" cy="107" r="6" fill="{ink}"/>' },
      { id: 'stars', label: '星光眼', svg: '<path d="m77 92 3 10 10 3-10 3-3 10-3-10-10-3 10-3Zm47 0 3 10 10 3-10 3-3 10-3-10-10-3 10-3Z" fill="{ink}"/>' },
    ],
    nose: [
      { id: 'none', label: '无鼻子', svg: '' },
      { id: 'dot', label: '圆点鼻', svg: '<circle cx="100" cy="122" r="3.5" fill="{ink}"/>' },
      { id: 'dash', label: '短线鼻', svg: '<path d="M98 118q-3 7 5 8" fill="none" stroke="{ink}" stroke-width="3" stroke-linecap="round"/>' },
      { id: 'wedge', label: '小三角鼻', svg: '<path d="m98 117 8 7-9 2Z" fill="{ink}"/>' },
      { id: 'curl', label: '弯弯鼻', svg: '<path d="M99 117q10 4 0 10" fill="none" stroke="{ink}" stroke-width="3" stroke-linecap="round"/>' },
      { id: 'button', label: '纽扣鼻', svg: '<ellipse cx="100" cy="122" rx="5" ry="3.5" fill="{ink}"/>' },
    ],
    mouth: [
      { id: 'smile', label: '微笑', svg: '<path d="M79 139q21 20 43 0" fill="none" stroke="{ink}" stroke-width="5" stroke-linecap="round"/>' },
      { id: 'grin', label: '大笑', svg: '<path d="M76 137q24 36 48 0Z" fill="white" stroke="{ink}" stroke-width="4" stroke-linejoin="round"/>' },
      { id: 'open', label: '惊喜', svg: '<ellipse cx="100" cy="146" rx="11" ry="15" fill="{ink}"/>' },
      { id: 'pout', label: '嘟嘴', svg: '<path d="M89 146q11-9 22 0-11 7-22 0Z" fill="{ink}"/>' },
      { id: 'flat', label: '平静', svg: '<path d="M83 145h34" fill="none" stroke="{ink}" stroke-width="5" stroke-linecap="round"/>' },
      { id: 'wave', label: '调皮', svg: '<path d="M78 144q12-10 23 0t22 0" fill="none" stroke="{ink}" stroke-width="5" stroke-linecap="round"/>' },
      { id: 'shy', label: '害羞', svg: '<ellipse cx="65" cy="133" rx="8" ry="4" fill="{cheek}"/><ellipse cx="135" cy="133" rx="8" ry="4" fill="{cheek}"/><path d="M85 143q15 12 30 0" fill="none" stroke="{ink}" stroke-width="4" stroke-linecap="round"/>' },
      { id: 'side', label: '歪嘴笑', svg: '<path d="M83 144q20 19 40-6" fill="none" stroke="{ink}" stroke-width="5" stroke-linecap="round"/>' },
    ],
  };

  const keys = ['body', 'hair', 'eyes', 'nose', 'mouth', 'color'];
  const pool = (key) => key === 'color' ? palettes : parts[key];
  const byId = (key, id) => pool(key).find((item) => item.id === id) || pool(key)[0];
  const fill = (template, color) => template.replace(/\{(fill|ink|cheek)\}/g, (_, key) => color[key]);
  function randomIndex(size) {
    const limit = Math.floor(0x100000000 / size) * size;
    const values = new Uint32Array(1);
    do { crypto.getRandomValues(values); } while (values[0] >= limit);
    return values[0] % size;
  }
  function randomRecipe() {
    return Object.fromEntries(keys.map((key) => [key, pool(key)[randomIndex(pool(key).length)].id]));
  }
  function seededRecipe(seed) {
    let state = (seed >>> 0) || 1;
    return Object.fromEntries(keys.map((key) => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return [key, pool(key)[state % pool(key).length].id];
    }));
  }
  function normalize(recipe = {}) {
    return Object.fromEntries(keys.map((key) => [key, byId(key, recipe[key]).id]));
  }
  function svg(recipe, label = '706 Together 几何小人') {
    const chosen = normalize(recipe);
    const color = byId('color', chosen.color);
    const layers = ['body', 'hair', 'eyes', 'nose', 'mouth']
      .map((key) => `<g data-part="${key}" data-unit="${chosen[key]}">${fill(byId(key, chosen[key]).svg, color)}</g>`).join('');
    const title = label.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="${title}" data-character="706-together"><title>${title}</title>${layers}</svg>`;
  }
  function mount(element, recipe) {
    const chosen = normalize(recipe);
    element.innerHTML = svg(chosen);
    element.dataset.recipe = JSON.stringify(chosen);
    return chosen;
  }
  window.CharacterLab = Object.freeze({ keys, parts, palettes, randomRecipe, seededRecipe, normalize, svg, mount });
})();
