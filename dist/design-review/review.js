(async () => {
  const manifest = await fetch('./manifest.json').then(r => { if (!r.ok) throw new Error('目录读取失败'); return r.json(); });
  const params = new URLSearchParams(location.search);
  let style = manifest.styles.find(s => s.slug === params.get('style')) || manifest.styles[0];
  let page = manifest.pages.find(p => p.id === params.get('page')) || manifest.pages[0];
  const $ = id => document.getElementById(id);
  const pageUrl = (s, p) => `./${s}/index.html?view=${p}&id=film`;
  const makeButton = (label, fn) => { const b = document.createElement('button'); b.type='button'; b.textContent=label; b.addEventListener('click',fn); return b; };
  const styleButtons = manifest.styles.map(s => { const b=makeButton(s.name,()=>{style=s;update();}); $('style-tabs').append(b); return b; });
  const pageButtons = manifest.pages.map(p => { const b=makeButton(p.name,()=>{page=p;update();}); $('page-tabs').append(b); return b; });
  $('compare').checked=params.get('compare')==='1';
  $('compare').addEventListener('change',()=>update());
  $('width').addEventListener('change',()=>{$('preview-desk').style.setProperty('--preview-width',$('width').value+'px');});
  function update(){
    styleButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(manifest.styles[i]===style)));
    pageButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(manifest.pages[i]===page)));
    const src=pageUrl(style.slug,page.id);
    // Reload on selection, so each comparison starts from the same demo state.
    $('preview-frame').src=src;
    $('preview-caption').textContent=style.name+' / '+page.name;
    $('preview-frame').title=style.name+' · '+page.name;
    $('open-page').href=src;
    $('description').textContent=style.description;
    const comparison=$('compare').checked&&style.slug!=='baseline';
    $('baseline-pane').hidden=!comparison;
    $('preview-desk').classList.toggle('compare',comparison);
    if(comparison)$('baseline-frame').src=pageUrl('baseline',page.id);else $('baseline-frame').removeAttribute('src');
    $('source-link').hidden=style.slug==='baseline';
    $('sample-link').hidden=['baseline','sola-mint-cards'].includes(style.slug);
    $('source-link').href=style.slug==='sola-mint-cards'?'./sources/sola-mint-cards.png':`./sources/${style.slug}/sample.png`;
    $('sample-link').href=`./sources/${style.slug}/sample.html`;
    const query=new URLSearchParams({style:style.slug,page:page.id});if(comparison)query.set('compare','1');
    history.replaceState(null,'','?'+query+location.hash);
  }
  for(const s of manifest.styles){const card=document.createElement('article');card.className='directory-card';const h=document.createElement('h2');h.textContent=s.name;const p=document.createElement('p');p.textContent=s.description;const links=document.createElement('div');links.className='page-links';for(const pg of manifest.pages){const a=document.createElement('a');a.textContent=pg.name+' ↗';a.href=pageUrl(s.slug,pg.id);a.target='_blank';a.rel='noopener';links.append(a);}const b=makeButton('在上方切换比较 ↑',()=>{style=s;update();$('style-tabs').scrollIntoView({block:'start'});});card.append(h,p,links,b);$('directory-grid').append(card);}
  update();
})().catch(error=>{document.getElementById('description').textContent='目录加载失败，请刷新重试。';console.error(error);});
