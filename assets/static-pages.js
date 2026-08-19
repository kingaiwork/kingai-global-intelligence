const SUPPORTED=['en','zh-CN'];
function detect(){const saved=localStorage.getItem('kingai-lang');if(SUPPORTED.includes(saved))return saved;const langs=navigator.languages?.length?navigator.languages:[navigator.language||'en'];return langs.some(v=>/^zh\b/i.test(v))?'zh-CN':'en'}
function apply(lang){const selected=SUPPORTED.includes(lang)?lang:'en';localStorage.setItem('kingai-lang',selected);document.documentElement.lang=selected;document.querySelectorAll('[data-lang-panel]').forEach(el=>{el.hidden=el.dataset.langPanel!==selected});document.querySelectorAll('[data-lang]').forEach(btn=>btn.classList.toggle('active',btn.dataset.lang===selected));}
apply(detect());
document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>apply(btn.dataset.lang)));
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));}
