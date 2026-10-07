import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');
const dir=path.join(root,'dist/design-review');
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json')));
const data=source=>vm.runInNewContext(source.slice(0,source.indexOf('const calendarWeeks'))+'\nJSON.stringify({people,events,campaign});');
const baseline=fs.readFileSync(path.join(dir,'baseline/app.js'),'utf8');
assert.equal(manifest.styles.length,7);
assert.equal(manifest.pages.length,3);
for(const file of ['app.js','style.css','index.html','preview.js'])assert.equal(fs.readFileSync(path.join(dir,'baseline',file),'utf8'),execFileSync('git',['show',`${manifest.baselineCommit}:dist/${file}`],{cwd:root,encoding:'utf8'}),`Baseline changed: ${file}`);
for(const style of manifest.styles){
 const p=path.join(dir,style.slug);
 const source=fs.readFileSync(path.join(p,'app.js'),'utf8');
 assert.equal(data(source),data(baseline),`${style.slug}: business data mismatch`);
 for(const file of fs.readdirSync(p).filter(f=>f.endsWith('.js')))execFileSync(process.execPath,['--check',path.join(p,file)]);
 for(const required of ['renderFeed','renderDiscover','renderEvent','signupSheet','commentSheet','recommendSheet'])assert.ok(source.includes('function '+required+'('),`${style.slug}: ${required} missing`);
 if(style.slug!=='baseline')assert.notEqual(source,baseline,`${style.slug}: still baseline`);
}
execFileSync(process.execPath,['--check',path.join(dir,'review.js')]);
console.log('PASS: 21 entries, immutable baseline, identical people/events/campaign data, JS syntax and required rendering/interaction functions.');
