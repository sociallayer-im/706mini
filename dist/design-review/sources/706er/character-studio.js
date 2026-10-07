(function () {
  'use strict';
  const lab = window.CharacterLab;
  if (!lab) return;
  const labels = { body: '脸型', hair: '头发', eyes: '眼睛', nose: '鼻子', mouth: '嘴巴', color: '颜色' };
  const preview = document.getElementById('character-preview');
  const combination = document.getElementById('character-combination');
  const grid = document.getElementById('character-grid');
  const selects = document.getElementById('character-selects');
  const recipes = [];
  let selected = 0;

  document.querySelectorAll('[data-character-slot]').forEach((slot, index) => {
    lab.mount(slot, lab.seededRecipe(70600 + index * 31));
  });

  for (const key of lab.keys) {
    const label = document.createElement('label');
    label.textContent = labels[key];
    const select = document.createElement('select');
    select.dataset.part = key;
    const options = key === 'color' ? lab.palettes : lab.parts[key];
    for (const unit of options) {
      const option = document.createElement('option');
      option.value = unit.id;
      option.textContent = unit.label;
      select.append(option);
    }
    select.addEventListener('change', () => {
      const recipe = { ...recipes[selected], [key]: select.value };
      recipes[selected] = recipe;
      renderSelected();
      renderTile(selected);
    });
    label.append(select);
    selects.append(label);
  }

  function description(recipe) {
    return lab.keys.map((key) => {
      const units = key === 'color' ? lab.palettes : lab.parts[key];
      return units.find((unit) => unit.id === recipe[key]).label;
    }).join(' · ');
  }
  function renderSelected() {
    const recipe = recipes[selected];
    lab.mount(preview, recipe);
    combination.textContent = description(recipe);
    selects.querySelectorAll('select').forEach((select) => { select.value = recipe[select.dataset.part]; });
    grid.querySelectorAll('button').forEach((button, index) => {
      button.setAttribute('aria-pressed', String(index === selected));
    });
  }
  function renderTile(index) {
    const button = grid.children[index];
    if (!button) return;
    button.innerHTML = lab.svg(recipes[index], `第 ${index + 1} 位角色：${description(recipes[index])}`);
    button.setAttribute('aria-label', `选择第 ${index + 1} 位角色：${description(recipes[index])}`);
  }
  function newBatch() {
    recipes.length = 0;
    grid.replaceChildren();
    const seen = new Set();
    for (let index = 0; index < 12; index++) {
      let recipe;
      let signature;
      do {
        recipe = lab.randomRecipe();
        signature = lab.keys.map((key) => recipe[key]).join('/');
      } while (seen.has(signature));
      seen.add(signature);
      recipes.push(recipe);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'character-tile';
      button.addEventListener('click', () => { selected = index; renderSelected(); });
      grid.append(button);
      renderTile(index);
    }
    selected = 0;
    renderSelected();
  }

  document.getElementById('random-batch').addEventListener('click', newBatch);
  document.getElementById('random-character').addEventListener('click', () => {
    recipes[selected] = lab.randomRecipe();
    renderTile(selected);
    renderSelected();
  });
  document.getElementById('download-character').addEventListener('click', () => {
    const content = `<?xml version="1.0" encoding="UTF-8"?>\n${lab.svg(recipes[selected], '706 Together 自定义角色')}`;
    const url = URL.createObjectURL(new Blob([content], { type: 'image/svg+xml;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `706-character-${lab.keys.map((key) => recipes[selected][key]).join('-')}.svg`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  newBatch();
})();
