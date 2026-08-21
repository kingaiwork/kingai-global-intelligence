import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist');
const tag='<script src="https://kefu.kingai.work/auto.js" data-site="global-intelligence" async data-kingai-customer-os="1"></script>';
let changed=0;
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(entry.isFile()&&entry.name.endsWith('.html')){let html=fs.readFileSync(file,'utf8');if(html.includes('data-kingai-customer-os')||!html.includes('</body>'))continue;fs.writeFileSync(file,html.replace('</body>',`${tag}</body>`));changed++;}}}
if(!fs.existsSync(root))throw new Error('missing Global Intelligence dist output');
walk(root);
console.log(`KING AI Customer OS injected into ${changed} Global Intelligence HTML files.`);
