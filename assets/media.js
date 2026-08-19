const SUPPORTED=['en','zh-CN'];
const state={lang:'en',dict:{},latest:{},sources:{},manifest:{},globalNews:{items:[],domains:[]},clusters:{clusters:[]},domainIndex:{discovered_domains:[]},filter:'all'};

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
  const source=[
    ...(l.publisher_feeds||[]),
    ...(state.globalNews?.items||[]),
    ...(l.open_web||[]),
    ...(l.public_social||[]),
    ...(l.event_linked_sources||[]),
    ...(l.videos||[])
  ];
  const seen=new Set();
  return source.filter(item=>{
    const key=item.url||`${item.media_kind}:${item.title||item.text||item.event_id||''}`;
    if(seen.has(key))return false;
    seen.add(key);return true;
  });
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
  if(q)items=items.filter(v=>`${itemTitle(v)} ${itemPublisher(v)} ${v.platform||''} ${v.domain||''} ${v.cca3||''} ${v.source_country||''}`.toLowerCase().includes(q));
  items.sort((a,b)=>new Date(itemDate(b)||0)-new Date(itemDate(a)||0));
  const html=items.slice(0,240).map(item=>{
    const url=safeURL(item.url);
    const title=escapeHTML(itemTitle(item));
    const pub=escapeHTML(itemPublisher(item));
    const summary=escapeHTML(item.summary||item.text||item.location||'');
    const meta=[kindLabel(item.media_kind),pub,item.cca3||item.publisher_country||item.source_country||'',formatDate(itemDate(item))].filter(Boolean).join(' · ');
    return `<article class="media-card"><div class="media-card-meta"><span class="evidence-badge unverified">${escapeHTML(kindLabel(item.media_kind))}</span><small>${escapeHTML(meta)}</small></div><h3>${url?`<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${title}</a>`:title}</h3>${summary?`<p>${summary}</p>`:''}<div class="media-card-foot"><span>${escapeHTML(pub)}</span><span>${escapeHTML(t('media_weight_zero','Direct score weight: 0'))}</span></div></article>`;
  }).join('');
  document.querySelector('#media-grid').innerHTML=html||`<div class="empty-state">${escapeHTML(t('media_no_items','No matching media items in this snapshot.'))}</div>`;
}
function corroborationLabel(value){
  if(value==='broadly-corroborated')return t('media_broadly_corroborated','Broadly corroborated');
  if(value==='corroborated')return t('media_corroborated','Corroborated');
  return t('media_single_source','Single source');
}
function renderClusters(){
  const rows=(state.clusters?.clusters||[]).filter(v=>Number(v.independent_domain_count||0)>=2).slice(0,24);
  document.querySelector('#media-clusters').innerHTML=rows.map(cluster=>{
    const sources=(cluster.items||[]).slice(0,6).map(item=>{
      const u=safeURL(item.url);const label=escapeHTML(item.publisher||item.domain||'Source');
      return u?`<a href="${escapeHTML(u)}" target="_blank" rel="noopener noreferrer">${label}</a>`:label;
    }).join(' · ');
    return `<article class="cluster-card ${escapeHTML(cluster.corroboration||'single-source')}"><div class="cluster-head"><span class="cluster-badge">${escapeHTML(corroborationLabel(cluster.corroboration))}</span><small>${escapeHTML(String(cluster.independent_domain_count||0))} ${escapeHTML(t('media_independent_domains','independent domains'))}</small></div><h3>${escapeHTML(cluster.representative_title||'—')}</h3><p>${escapeHTML(t('media_corroboration_not_truth','Source breadth is not a truth score.'))}</p><div class="cluster-sources">${sources||'—'}</div></article>`;
  }).join('')||`<div class="empty-state">${escapeHTML(t('media_no_clusters','No multi-source clusters in this snapshot yet.'))}</div>`;
}
function renderStatus(){
  const c=state.manifest?.coverage||{};
  document.querySelector('#media-seed-count').textContent=Number(c.seed_outlets||state.sources?.seed_outlets?.length||0).toLocaleString();
  document.querySelector('#media-collector-count').textContent=Number(c.collectors||state.sources?.collectors?.length||0).toLocaleString();
  const declared=['publisher_feed_items','open_web_items','public_social_items','event_linked_sources','video_items'].reduce((n,k)=>n+Number(c[k]||0),0);
  const total=Math.max(declared,allItems().length);
  document.querySelector('#media-item-count').textContent=total.toLocaleString();
}
function renderDirectory(){
  const rows=(state.sources?.seed_outlets||[]).slice().sort((a,b)=>(a.country||'').localeCompare(b.country||'')||a.name.localeCompare(b.name));
  document.querySelector('#media-directory').innerHTML=rows.map(v=>`<article class="directory-card"><div><strong>${escapeHTML(v.name)}</strong><small>${escapeHTML(v.country||'—')} · ${escapeHTML((v.languages||[]).join(', ')||'—')}</small></div><div><span>${escapeHTML(v.ownership||'—')}</span><small>${escapeHTML(v.collection||'—')}</small></div></article>`).join('')||`<div class="empty-state">${escapeHTML(t('data_unavailable','Data unavailable'))}</div>`;
}
function renderDiscovered(){
  const rows=(state.domainIndex?.discovered_domains||[]).slice(0,180);
  document.querySelector('#discovered-directory').innerHTML=rows.map(v=>`<article class="directory-card dynamic"><div><strong>${escapeHTML(v.domain)}</strong><small>${escapeHTML((v.source_countries||[]).join(', ')||'—')} · ${escapeHTML((v.languages||[]).join(', ')||'—')}</small></div><div><span>${escapeHTML(String(v.items||0))} ${escapeHTML(t('media_items','items'))}</span><small>${escapeHTML((v.media_kinds||[]).join(', ')||'—')}</small></div></article>`).join('')||`<div class="empty-state">${escapeHTML(t('media_no_discovered','No automatically discovered domains in this snapshot yet.'))}</div>`;
}
function renderPlatforms(){
  const rows=(state.sources?.collectors||[]).map(v=>`<tr><td>${escapeHTML(v.id)}</td><td>${escapeHTML(v.type||'—')}</td><td>${escapeHTML(v.auth||'none')}</td><td><span class="platform-state ${v.enabled?'on':'off'}">${escapeHTML(v.status||(v.enabled?t('media_active','Active'):t('media_inactive','Inactive')))}</span></td></tr>`).join('');
  document.querySelector('#platform-table').innerHTML=rows||`<tr><td colspan="4" class="loading">${escapeHTML(t('data_unavailable','Data unavailable'))}</td></tr>`;
}
function render(){renderStatus();renderClusters();renderStream();renderDiscovered();renderDirectory();renderPlatforms()}
async function setLanguage(lang){state.lang=SUPPORTED.includes(lang)?lang:'en';localStorage.setItem('kingai-lang',state.lang);await applyTranslations();render()}

async function boot(){
  state.lang=detectLanguage();
  const [latest,sources,manifest,globalNews,clusters,domainIndex]=await Promise.all([
    loadJSON('/data/media/latest.json',{publisher_feeds:[],open_web:[],public_social:[],event_linked_sources:[],videos:[]}),
    loadJSON('/data/media/sources.json',{collectors:[],seed_outlets:[]}),
    loadJSON('/data/media/manifest.json',{coverage:{}}),
    loadJSON('/data/media/global-news.json',{items:[],domains:[]}),
    loadJSON('/data/media/clusters.json',{clusters:[]}),
    loadJSON('/data/media/domain-index.json',{discovered_domains:[]})
  ]);
  state.latest=latest;state.sources=sources;state.manifest=manifest;state.globalNews=globalNews;state.clusters=clusters;state.domainIndex=domainIndex;
  await applyTranslations();render();
  document.querySelector('#media-search').addEventListener('input',renderStream);
  document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{state.filter=btn.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===btn));renderStream()}));
  document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>setLanguage(btn.dataset.lang)));
}
boot();
