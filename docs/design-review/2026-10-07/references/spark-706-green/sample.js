(() => {
  'use strict';
  const topics = {
    marketing: ['02', 'MOVE WITH\nMARKETING', 'Turn a message into a path people want to follow.'],
    business: ['03', 'BUILD YOUR\nNEXT IDEA', 'Give emerging plans the room and structure to grow.'],
    content: ['05', 'SHAPE YOUR\nCONTENT', 'Make every thought feel clear, useful and alive.'],
    development: ['06', 'DESIGN WHAT\nCOMES NEXT', 'Create digital experiences with a point of view.']
  };
  const rails = [...document.querySelectorAll('.topic-rail')];
  const title = document.querySelector('#feature-title');
  const copy = document.querySelector('#feature-copy');
  const number = document.querySelector('.feature-number');
  function activate(index, focus = false) {
    const rail = rails[index];
    const [num, heading, description] = topics[rail.dataset.topic];
    rails.forEach((item, i) => item.setAttribute('aria-pressed', String(i === index)));
    number.textContent = num;
    title.innerHTML = heading.replace('\n', '<br>');
    copy.textContent = description;
    if (focus) rail.focus();
  }
  rails.forEach((rail, index) => {
    rail.addEventListener('click', () => activate(index));
    rail.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); activate((index + 1) % rails.length, true); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); activate((index - 1 + rails.length) % rails.length, true); }
      if (event.key === 'Home') { event.preventDefault(); activate(0, true); }
      if (event.key === 'End') { event.preventDefault(); activate(rails.length - 1, true); }
    });
  });
})();
