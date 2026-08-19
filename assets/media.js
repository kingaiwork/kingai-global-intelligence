const SUPPORTED=['en','zh-CN'];
const state={lang:'en',dict:{},latest:{},sources:{},manifest:{},filter:'all'};

function detectLanguage(){
  const saved=localStorage.getItem('kingai-lang');
  if(SUPPORTED.includes(saved)) return saved;
  const langs=navigator.languages?.length?navigator.languages:[navigator.language||'en'];
  return langs.some(v=>/^zh\b/i.test(v))?'zh-CN':'en';
}
async function loadJSON(url,fallback){try{const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${r.status} ${url}`);return await r.json()}catch(e){console.warn(e);return fallback}}
function t(k,f=k){return state.dict[k]||f}
function escapeHTML(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function safeURL(v){try{const u=new URL(v);return /^https?:$/.test(u.protocol)?u.href:null}catch{return null}}
function formatDate(v){if(!v)return '—';const d=new Date(v);if(Number.isNaN(d.getTime()))return String(v);return new Intl.DateTimeFormat(state.lang==='zh-CN'?'zh-CN':'en-US',{dateStyle:'medium',timeStyle:'short'}).format(d)}

async function applyTranslations(){
  const [base,page]=await Promise.all([
    loadJSON(`/i18n/${state.lang}.json`,{}),
    loadJSON(`/i18n/media-${state.lang}.json`,{})
  ]);
  state.dict={...base,...page};
  document.documentElement.lang=state.lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(state.dict[k])el.textContent=state.dict[k]});
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{const k=el.dataset.i18nPlaceholder;if(state.dict[k])el.placeholder=state.dict[k]});
  document.querySelectorAll('[data-lang]').forEach(btn=>btn.classList.toggle('active',btn.dataset.lang===state.lang));
  document.title=state.lang==='zh-CN'?'全球媒体情报 — KINGAI':'Global Media Intelligence — KINGAI';
}

function allItems(){
  const l=state.latest||{};
  return [
    ...(l.publisher_feeds||[]),
    ...(l.open_web||[]),
    ...(l.public_social||[]),
    ...(l.event_linked_sources||[]),
    ...(l.videos||[])
  ];
}
function kindLabel(k){
  const map={
    'publisher-feed':t('media_publishers','Publisher feeds'),
    'open-web':t('open_web','Open web'),
    'public-social':t('public_social','Public social'),
    'event-linked-source':t('media_event_links','Event links'),
    'video':t('media_video','Video')
  };
  return map[k]||k||'Media';
}
function itemTitle(item){return item.title||item.text||item.event_id||'Untitled'}
function itemPublisher(item){return item.publisher||item.channel_title||item.domain||item.author_handle||item.platform||item.source_id||'—'}
function itemDate(item){return item.published_at||item.created_at||item.collected_at||null}
function renderStream(){
  const q=document.querySelector('#media-search').value.trim().toLowerCase();
  let items=allItems().filter(v=>state.filter==='all'||v.media_kind===state.filter);
  if(q)items=items.filter(v=>`${itemTitle(v)} ${itemPublisher(v)} ${v.platform||''} ${v.domain||''} ${v.cca3||''}`.toLowerCase().includes(q));
  items.sort((a,b)=>new Date(itemDate(b)||0)-new Date(itemDate(a)||0));
  const html=items.slice(0,240).map(item=>{
    const url=safeURL(item.url);
    const title=escapeHTML(itemTitle(item));
    const pub=escapeHTML(itemPublisher(item));
    const summary=escapeHTML(item.summary||item.text||item.location||'');
    const meta=[kindLabel(item.media_kind),pub,item.cca3||item.publisher_country||'',formatDate(itemDate(item))].filter(Boolean).join(' · ');
    return `<article class="media-card"><div class="media-card-meta"><span class="evidence-badge unverified">${escapeHTML(kindLabel(item.media_kind))}</span><small>${escapeHTML(meta)}</small></div><h3>${url?`<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${title}</a>`:title}</h3>${summary?`<p>${summary}</p>`:''}<div class="media-card-foot"><span>${escapeHTML(pub)}</span><span>${escapeHTML(t('media_weight_zero','Direct score weight: 0'))}</span></div></article>`;
  }).join('');
  document.querySelector('#media-grid').innerHTML=html||`<div class="empty-state">${escapeHTML(t('media_no_items','No matching media items in this snapshot.'))}</div>`;
}
function renderStatus(){
  const c=state.manifest?.coverage||{};
  document.querySelector('#media-seed-count').textContent=Number(c.seed_outlets||state.sources?.seed_outlets?.length||0).toLocaleString();
  document.querySelector('#media-collector-count').textContent=Number(c.collectors||state.sources?.collectors?.length||0).toLocaleString();
  const total=['publisher_feed_items','open_web_items','public_social_items','event_linked_sources','video_items'].reduce((n,k)=>n+Number(c[k]||0),0);
  document.querySelector('#media-item-count').textContent=total.toLocaleString();
}
function renderDirectory(){
  const rows=(state.sources?.seed_outlets||[]).slice().sort((a,b)=>(a.country||'').localeCompare(b.country||'')||a.name.localeCompare(b.name));
  document.querySelector('#media-directory').innerHTML=rows.map(v=>`<article class="directory-card"><div><strong>${escapeHTML(v.name)}</strong><small>${escapeHTML(v.country||'—')} · ${escapeHTML((v.languages||[]).join(', ')||'—')}</small></div><div><span>${escapeHTML(v.ownership||'—')}</span><small>${escapeHTML(v.collection||'—')}</small></div></article>`).join('')||`<div class="empty-state">${escapeHTML(t('data_unavailable','Data unavailable'))}</div>`;
}
function renderPlatforms(){
  const rows=(state.sources?.collectors||[]).map(v=>`<tr><td>${escapeHTML(v.id)}</td><td>${escapeHTML(v.type||'—')}</td><td>${escapeHTML(v.auth||'none')}</td><td><span class="platform-state ${v.enabled?'on':'off'}">${escapeHTML(v.status||(v.enabled?t('media_active','Active'):t('media_inactive','Inactive')))}</span></td></tr>`).join('');
  document.querySelector('#platform-table').innerHTML=rows||`<tr><td colspan="4" class="loading">${escapeHTML(t('data_unavailable','Data unavailable'))}</td></tr>`;
}
function render(){renderStatus();renderStream();renderDirectory();renderPlatforms()}
async function setLanguage(lang){state.lang=SUPPORTED.includes(lang)?lang:'en';localStorage.setItem('kingai-lang',state.lang);await applyTranslations();render()}

async function boot(){
  state.lang=detectLanguage();
  const [latest,sources,manifest]=await Promise.all([
    loadJSON('/data/media/latest.json',{publisher_feeds:[],open_web:[],public_social:[],event_linked_sources:[],videos:[]}),
    loadJSON('/data/media/sources.json',{collectors:[],seed_outlets:[]}),
    loadJSON('/data/media/manifest.json',{coverage:{}})
  ]);
  state.latest=latest;state.sources=sources;state.manifest=manifest;
  await applyTranslations();render();
  document.querySelector('#media-search').addEventListener('input',renderStream);
  document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{state.filter=btn.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===btn));renderStream()}));
  document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>setLanguage(btn.dataset.lang)));
}
boot();
