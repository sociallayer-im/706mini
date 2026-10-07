(() => {
  'use strict';
  const lab = window.CharacterLab;
  if (lab) {
    document.querySelectorAll('[data-seed]').forEach((host) => {
      const recipe = lab.seededRecipe(Number(host.dataset.seed));
      lab.mount(host, recipe);
    });
  }
  const panels = [...document.querySelectorAll('.feature-panel')];
  const dots = [...document.querySelectorAll('.feature-dots i')];
  function select(index, focus = false) {
    panels.forEach((panel, i) => panel.setAttribute('aria-pressed', String(i === index)));
    dots.forEach((dot, i) => dot.classList.toggle('current', i === index));
    panels.filter((_, i) => i !== index).forEach((panel, slot) => panel.style.setProperty('--rail-slot', String(slot + 1)));
    if (focus) panels[index].focus();
  }
  select(0);
  panels.forEach((panel, index) => {
    panel.addEventListener('click', (event) => {
      if (event.target.closest('.glass-action')) {
        document.querySelector('#about').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        return;
      }
      select(index);
    });
    panel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); select((index + 1) % panels.length, true); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); select((index - 1 + panels.length) % panels.length, true); }
      if (event.key === 'Home') { event.preventDefault(); select(0, true); }
      if (event.key === 'End') { event.preventDefault(); select(panels.length - 1, true); }
    });
  });
})();
