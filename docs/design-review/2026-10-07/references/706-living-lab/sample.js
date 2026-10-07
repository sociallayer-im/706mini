(() => {
  'use strict';
  const lab = window.CharacterLab;
  if (lab) {
    document.querySelectorAll('[data-seed]').forEach((host) => {
      const recipe = lab.seededRecipe(Number(host.dataset.seed));
      lab.mount(host, { ...recipe, color: host.closest('.room-one') ? 'green' : host.closest('.room-two') ? 'pink' : host.closest('.room-three') ? 'blue' : recipe.color });
    });
  }
  const scenes = {
    morning: { label: '08:30 / MORNING', title: '一张桌子，开启一天。', text: '有人泡好咖啡，有人正准备出门。短短几句问候，也让平凡的早晨有了温度。', count: '01 / 03', note: 'FIELD NOTES / 01', symbol: '◒', bg: '#E7F1D6' },
    afternoon: { label: '15:00 / AFTERNOON', title: '把想法，摆上桌面。', text: '午后的公共角落，可以是分享新发现、交换书本或商量下一次相聚的地方。', count: '02 / 03', note: 'FIELD NOTES / 02', symbol: '✳', bg: '#F5DDE7' },
    evening: { label: '21:00 / EVENING', title: '灯亮着，故事还没结束。', text: '有人聊天，有人安静读书。不同节奏仍能在一间屋子里找到各自的位置。', count: '03 / 03', note: 'FIELD NOTES / 03', symbol: '✦', bg: '#DDE9F0' },
  };
  const tabs = [...document.querySelectorAll('.time-tabs [role="tab"]')];
  const panel = document.getElementById('scene');
  const choose = (tab, focus = false) => {
    const scene = scenes[tab.dataset.scene];
    tabs.forEach((item) => { const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; });
    panel.setAttribute('aria-labelledby', tab.id);
    panel.dataset.scene = tab.dataset.scene;
    panel.querySelector('.scene-top span:first-child').textContent = scene.note;
    panel.querySelector('.scene-object').textContent = scene.symbol;
    panel.querySelector('.scene-bottom small').textContent = scene.label;
    panel.querySelector('.scene-bottom h3').textContent = scene.title;
    panel.querySelector('.scene-bottom p').textContent = scene.text;
    panel.querySelector('.scene-count').textContent = scene.count;
    if (focus) tab.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => choose(tab));
    tab.addEventListener('keydown', (event) => {
      const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (delta) { event.preventDefault(); choose(tabs[(index + delta + tabs.length) % tabs.length], true); }
      else if (event.key === 'Home') { event.preventDefault(); choose(tabs[0], true); }
      else if (event.key === 'End') { event.preventDefault(); choose(tabs[tabs.length - 1], true); }
    });
  });
})();
