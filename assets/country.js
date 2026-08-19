const SUPPORTED = ['en','zh-CN'];
const state = {lang:'en', dict:{}, country:null, ranking:{}, ooni:null, events:[], assessments:[], discourse:{web:[],social:[]}};

function detectLanguage(){
  const saved = localStorage.getItem('kingai-lang');
  if (SUPPORTED.includes(saved)) return saved;
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language || 'en'];
  return langs.some(v => /^zh\b/i.test(v)) ? 'zh-CN' : 'en';
}

async function loadJSON(path, fallback){
  try {
    const res = await fetch(path, {cache:'no-store'});
    if (!res.ok) throw new Error(`${res.status} ${path}`);
    return await res.json();
  } catch (error) {
    console.warn(error);
    return fallback;
  }
}

function locale(){ return state.lang === 'zh-CN' ? 'zh-CN' : 'en-US'; }
function t(key, fallback=key){ return state.dict[key] || fallback; }

function escapeHTML(value=''){
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function localizedCountryName(country){
  try {
    const value = new Intl.DisplayNames([locale()], {type:'region'}).of(country.cca2);
    if (value && value !== country.cca2) return value;
  } catch {}
  return state.lang === 'zh-CN' ? (country.name_zh || country.name_en) : country.name_en;
}

function localizedRegion(region){
  const zh = {Africa:'非洲',Americas:'美洲',Asia:'亚洲',Europe:'欧洲',Oceania:'大洋洲',Antarctic:'南极洲'};
  return state.lang === 'zh-CN' ? (zh[region] || region || '—') : (region || '—');
}

function number(value, options={}){
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return '—';
  return new Intl.NumberFormat(locale(), options).format(Number(value));
}

function score(value){
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return '—';
  return Math.max(0, Math.min(100, Number(value))).toFixed(0);
}

function dateText(value){
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? (value || '—') : new Intl.DateTimeFormat(locale(),{dateStyle:'medium'}).format(d);
}

async function applyTranslations(){
  state.dict = await loadJSON(`/i18n/${state.lang}.json`, {});
  document.documentElement.lang = state.lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (state.dict[key]) el.textContent = state.dict[key];
  });
  document.querySelectorAll('[data-lang]').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === state.lang));
}

function metric(country, key){
  const item = country?.context?.[key];
  return item && Number.isFinite(Number(item.value)) ? item : null;
}

function renderFacts(){
  const c = state.country;
  const population = metric(c, 'population');
  const life = metric(c, 'life_expectancy_years');
  const gdp = metric(c, 'gdp_per_capita_usd');
  const internet = metric(c, 'internet_users_pct');
  const facts = [
    [t('region','Region'), localizedRegion(c.region), null],
    [t('capital','Capital'), c.capital?.join(', ') || '—', null],
    [t('population','Population'), number(population?.value ?? c.population), population?.year],
    [t('life_expectancy','Life expectancy'), life ? `${number(life.value,{maximumFractionDigits:1})} ${t('years','years')}` : '—', life?.year],
    [t('gdp_per_capita','GDP per capita'), gdp ? number(gdp.value,{style:'currency',currency:'USD',maximumFractionDigits:0}) : '—', gdp?.year],
    [t('internet_users','Internet users'), internet ? `${number(internet.value,{maximumFractionDigits:1})}%` : '—', internet?.year],
    [t('languages','Languages'), (c.languages || []).map(v => v.name).join(', ') || '—', null],
    [t('iso_codes','ISO codes'), `${c.cca2} / ${c.cca3}`, null]
  ];
  document.querySelector('#fact-grid').innerHTML = facts.map(([label,value,year]) => `<article><span>${escapeHTML(label)}</span><strong>${escapeHTML(value)}</strong>${year ? `<small>${escapeHTML(String(year))}</small>` : ''}</article>`).join('');
}

function renderOoni(){
  const o = state.ooni;
  const cells = o ? [
    [t('measurements','Measurements'), number(o.measurement_count)],
    [t('anomalies','Anomalies'), number(o.anomaly_count)],
    [t('confirmed_findings','Confirmed findings'), number(o.confirmed_count)],
    [t('anomaly_share','Anomaly share'), o.anomaly_share === null ? '—' : `${number(o.anomaly_share * 100,{maximumFractionDigits:2})}%`]
  ] : [
    [t('measurements','Measurements'),'—'],
    [t('anomalies','Anomalies'),'—'],
    [t('confirmed_findings','Confirmed findings'),'—'],
    [t('anomaly_share','Anomaly share'),'—']
  ];
  document.querySelector('#ooni-grid').innerHTML = cells.map(([label,value]) => `<article><span>${escapeHTML(label)}</span><strong>${escapeHTML(value)}</strong><small>${o ? escapeHTML(t('last_7_days','Last 7 days')) : escapeHTML(t('data_unavailable','Data unavailable'))}</small></article>`).join('');
}

function safeURL(value){
  try {
    const url = new URL(value);
    return /^https?:$/.test(url.protocol) ? url.href : null;
  } catch { return null; }
}

function assessmentKind(item){
  if (item.source_type === 'government-self-assessment') return {label:t('official_response','Official response / self-assessment'), cls:'official'};
  if (item.source_type === 'intergovernmental-communication') return {label:t('un_communication','UN communication / concern'), cls:'un'};
  return {label:t('external_assessment','External assessment'), cls:'external'};
}

function renderAssessments(){
  const root = document.querySelector('#assessment-list');
  if (!state.assessments.length) {
    root.innerHTML = `<div class="empty-state">${escapeHTML(t('no_assessments','No attributed assessments in the current snapshot.'))}</div>`;
    return;
  }
  root.innerHTML = state.assessments.map(item => {
    const kind = assessmentKind(item);
    const summary = state.lang === 'zh-CN' ? (item.summary_zh || item.summary_en) : (item.summary_en || item.summary_zh);
    const url = safeURL(item.url);
    const scoreText = Number.isFinite(Number(item.score)) && Number.isFinite(Number(item.score_max))
      ? `${number(item.score,{maximumFractionDigits:2})}/${number(item.score_max)}${item.status ? ` · ${escapeHTML(item.status)}` : ''}`
      : (Number.isFinite(Number(item.rank)) && Number.isFinite(Number(item.rank_total)) ? `#${number(item.rank)} / ${number(item.rank_total)}` : '');
    const rankText = Number.isFinite(Number(item.rank)) && Number.isFinite(Number(item.rank_total)) && scoreText.includes('/') && Number.isFinite(Number(item.score))
      ? ` · #${number(item.rank)}/${number(item.rank_total)}` : '';
    return `<article class="assessment-card ${kind.cls}">
      <div class="assessment-meta"><span class="evidence-badge ${kind.cls}">${escapeHTML(kind.label)}</span><span>${escapeHTML(item.period || '—')}</span></div>
      <div class="assessment-head"><div><strong>${escapeHTML(item.publisher || '—')}</strong><small>${escapeHTML(item.topic || '')}</small></div>${scoreText ? `<div class="assessment-score">${scoreText}${rankText}</div>` : ''}</div>
      <p>${escapeHTML(summary || '—')}</p>
      ${url ? `<a class="source-link" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(t('view_source','View source'))} ↗</a>` : ''}
    </article>`;
  }).join('');
}

function renderDiscourse(){
  const webRoot = document.querySelector('#web-discourse');
  const socialRoot = document.querySelector('#social-discourse');
  const web = state.discourse?.web || [];
  const social = state.discourse?.social || [];

  webRoot.innerHTML = web.slice(0,20).map(item => {
    const url = safeURL(item.url);
    return `<article class="discourse-card"><div class="discourse-meta"><span class="evidence-badge unverified">${escapeHTML(t('unverified','Unverified'))}</span><span>${escapeHTML(item.domain || item.aggregator || 'Open web')}</span></div><strong>${escapeHTML(item.title || '—')}</strong><small>${escapeHTML(item.published_at || '')}</small>${url ? `<a class="source-link" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(t('view_source','View source'))} ↗</a>` : ''}</article>`;
  }).join('') || `<div class="empty-state">${escapeHTML(t('no_web_discourse','No matching open-web items in the current snapshot.'))}</div>`;

  socialRoot.innerHTML = social.slice(0,20).map(item => {
    const url = safeURL(item.url);
    const author = item.author_handle ? `@${item.author_handle}` : (item.author_display_name || '—');
    return `<article class="discourse-card"><div class="discourse-meta"><span class="evidence-badge unverified">${escapeHTML(t('unverified','Unverified'))}</span><span>${escapeHTML(author)}</span></div><p>${escapeHTML(item.text || '—')}</p><small>${escapeHTML(dateText(item.created_at))}</small>${url ? `<a class="source-link" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(t('view_source','View source'))} ↗</a>` : ''}</article>`;
  }).join('') || `<div class="empty-state">${escapeHTML(t('no_social_discourse','No matching public social posts in the current snapshot.'))}</div>`;
}

function renderEvents(){
  const rows = state.events.slice(0,30).map(e => {
    const source = e.source_id === 'gdelt' ? 'GDELT' : e.source_id === 'gdacs' ? 'GDACS' : (e.source_id || '—');
    const eventLabel = e.title || e.event_type || (e.event_root_code ? `${t('event_code','Event code')} ${e.event_root_code}` : '—');
    const location = e.location || e.country || '—';
    const signalParts = [];
    if (e.alert_level) signalParts.push(String(e.alert_level));
    if (e.severity) signalParts.push(String(e.severity));
    if (Number.isFinite(Number(e.mentions))) signalParts.push(`${t('mentions','mentions')}: ${number(e.mentions)}`);
    if (Number.isFinite(Number(e.goldstein_scale))) signalParts.push(`G: ${number(e.goldstein_scale,{maximumFractionDigits:1})}`);
    const url = safeURL(e.source_url);
    const sourceHTML = url ? `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source)}</a>` : escapeHTML(source);
    return `<tr><td>${sourceHTML}</td><td>${escapeHTML(eventLabel)}</td><td>${escapeHTML(location)}</td><td>${escapeHTML(signalParts.join(' · ') || '—')}</td></tr>`;
  }).join('');
  document.querySelector('#event-table').innerHTML = rows || `<tr><td colspan="4" class="loading">${escapeHTML(t('no_recent_events','No matching recent events in the current static snapshot.'))}</td></tr>`;
}

function render(){
  const c = state.country;
  if (!c) {
    document.querySelector('#country-name').textContent = t('country_not_found','Country not found');
    return;
  }
  const name = localizedCountryName(c);
  document.querySelector('#country-flag').textContent = c.flag || '';
  document.querySelector('#country-name').textContent = name;
  document.querySelector('#country-subtitle').textContent = `${localizedRegion(c.region)} · ${c.cca3}`;
  document.title = `${name} — KINGAI Global Intelligence`;

  document.querySelector('#score-safety').textContent = score(state.ranking.safety);
  document.querySelector('#score-wellbeing').textContent = score(state.ranking.wellbeing);
  document.querySelector('#score-human-rights').textContent = score(state.ranking.human_rights);
  document.querySelector('#score-expression').textContent = score(state.ranking.expression);
  document.querySelector('#score-governance').textContent = score(state.ranking.governance);
  document.querySelector('#score-live-risk').textContent = score(state.ranking.live_risk);
  renderFacts();
  renderAssessments();
  renderOoni();
  renderDiscourse();
  renderEvents();
}

async function setLanguage(lang){
  state.lang = SUPPORTED.includes(lang) ? lang : 'en';
  localStorage.setItem('kingai-lang', state.lang);
  await applyTranslations();
  render();
}

async function boot(){
  state.lang = detectLanguage();
  const code = (new URLSearchParams(location.search).get('c') || '').toUpperCase();
  const [countriesDoc, rankingsDoc, internetDoc, eventsDoc, assessmentsDoc, discourseDoc] = await Promise.all([
    loadJSON('/data/countries.json',{countries:[]}),
    loadJSON('/data/rankings.json',{countries:[]}),
    loadJSON('/data/internet/latest.json',{countries:[]}),
    loadJSON('/data/events/latest.json',{events:[]}),
    loadJSON('/data/assessments/latest.json',{assessments:[]}),
    loadJSON('/data/discourse/latest.json',{countries:[]})
  ]);
  const countries = countriesDoc.countries || [];
  state.country = countries.find(c => c.cca3 === code || c.cca2 === code) || null;
  if (state.country) {
    state.ranking = (rankingsDoc.countries || []).find(r => r.cca3 === state.country.cca3) || {};
    state.ooni = (internetDoc.countries || []).find(r => r.cca2 === state.country.cca2) || null;
    state.assessments = (assessmentsDoc.assessments || []).filter(v => v.cca3 === state.country.cca3);
    state.discourse = (discourseDoc.countries || []).find(v => v.cca3 === state.country.cca3) || {web:[],social:[]};
    const targetName = String(state.country.name_en || '').toLowerCase();
    state.events = (eventsDoc.events || []).filter(e => e.cca3 === state.country.cca3 || e.iso3 === state.country.cca3 || e.iso3 === state.country.cca2 || String(e.country || '').toLowerCase() === targetName);
  }
  await applyTranslations();
  render();
  document.querySelectorAll('[data-lang]').forEach(btn => btn.addEventListener('click', () => setLanguage(btn.dataset.lang)));
}

boot();
