import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {TOPICS} from '../site/engine.js';
export async function validateBank({images=true}={}) {
  const bank=JSON.parse(await readFile('public/questions.json','utf8'));
  assert.equal(bank.length,100,'Question bank must have exactly 100 items');
  assert.equal(new Set(bank.map(q=>q.id)).size,100,'IDs must be unique');
  assert.equal(new Set(bank.map(q=>q.en.trim().toLowerCase())).size,100,'English questions must be unique');
  assert.equal(new Set(bank.map(q=>q.zh.trim())).size,100,'Chinese questions must be unique');
  const distribution=[0,0,0,0];
  for(const q of bank){
    assert.ok(Number.isInteger(q.id)&&q.id>=1&&q.id<=100,`Invalid ID: ${q.id}`);
    assert.ok(TOPICS[q.topic],`Unknown topic at ${q.id}`);
    assert.ok(['basic','applied'].includes(q.difficulty),`Unknown difficulty at ${q.id}`);
    for(const key of ['en','zh'])assert.ok(typeof q[key]==='string'&&q[key].trim().length>8,`Missing ${key}: ${q.id}`);
    assert.equal(q.options.length,4,`Question ${q.id} needs 4 options`);
    assert.equal(new Set(q.options.map(o=>o.en.trim().toLowerCase())).size,4,`Duplicate options: ${q.id}`);
    for(const o of q.options)assert.ok(o.en&&o.zh,`Missing bilingual option: ${q.id}`);
    assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,`Invalid answer: ${q.id}`);
    distribution[q.answer]++;
    assert.ok(q.explanation.en?.length>60&&q.explanation.zh?.length>30,`Insufficient explanation: ${q.id}`);
    assert.doesNotMatch(q.explanation.en,/\bOption\s+[A-D]\b/i,`Explanations must not refer to shuffled option letters: ${q.id}`);
    assert.ok(q.source?.file&&q.source?.locator&&q.source?.note,`Missing citation: ${q.id}`);
    await access(q.source.file);
    if(q.source.supplemental)assert.match(q.source.url||'',/^https:\/\/(scikit-learn\.org|developers\.google\.com)\//,`Supplement needs authority URL: ${q.id}`);
    if(/\.pdf$/i.test(q.source.file)&&images){assert.ok(q.source.image,`Missing slide image: ${q.id}`);await access('public/'+q.source.image.replace(/^\.\//,''));}
    for(const figure of [q.source.related,q.source.illustration].filter(Boolean)){
      const relative=figure.image.replace(/^\.\//,'');
      try{await access('public/'+relative);}catch{await access('site/'+relative);}
    }
    if(q.diagram){assert.equal(q.diagram.type,'confusion');for(const key of ['tp','fp','fn','tn'])assert.ok(Number.isInteger(q.diagram[key])&&q.diagram[key]>=0);}
  }
  assert.ok(bank.filter(q=>q.diagram).length>=6,'At least six visual evaluation questions are required');
  assert.ok(distribution.every(n=>n>=15&&n<=35),`Unbalanced answer positions: ${distribution}`);
  console.log(`Validated 100 bilingual questions; answer distribution ${distribution.join('/')}; ${bank.filter(q=>q.diagram).length} diagrams.`);
  return bank;
}
if(process.argv[1]?.endsWith('validate.mjs'))await validateBank();
