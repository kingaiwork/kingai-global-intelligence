import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist');
const tag='<script src="https://kefu.kingai.work/auto.js" data-site="global-intelligence" async data-kingai-customer-os="1"></script>';
const uiTag='<link rel="stylesheet" href="/kingai-ui-2026.css" data-kingai-ui-2026="1">';
const uiSource=path.resolve('scripts','kingai-ui-2026.css');
let changed=0;
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(entry.isFile()&&entry.name.endsWith('.html')){const before=fs.readFileSync(file,'utf8');let html=before;if(!html.includes('data-kingai-ui-2026')&&html.includes('</head>'))html=html.replace('</head>',`${uiTag}</head>`);if(!html.includes('data-kingai-customer-os')&&html.includes('</body>'))html=html.replace('</body>',`${tag}</body>`);if(html!==before){fs.writeFileSync(file,html);changed++;}}}}
if(!fs.existsSync(root))throw new Error('missing Global Intelligence dist output');
if(!fs.existsSync(uiSource))throw new Error('missing Global Intelligence canonical UI layer');
fs.copyFileSync(uiSource,path.join(root,'kingai-ui-2026.css'));
walk(root);
console.log(`Global Intelligence production HTML normalized in ${changed} file(s): warm premium evidence UI + Customer OS.`);
