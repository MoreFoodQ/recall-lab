import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {BANKS,STORAGE_KEY,loadState,makeSession,recordAnswer,parseRoute,routeFor} from '../site/engine.js';
import {SHORT_STORAGE_KEY,loadShortState} from '../site/short-engine.js';
import {validateAdditionalBanks} from '../scripts/validate.mjs';
const {extra,short}=await validateAdditionalBanks();
const core=JSON.parse(await readFile('public/questions.json','utf8'));
test('extra practice and random draw never include original bank objects',()=>{
  assert.equal(core.length,100);assert.equal(extra.length,50);
  const session=makeSession(extra,{mode:'random',count:100});assert.equal(session.ids.length,50);
  assert.equal(new Set(session.ids).size,50);
  assert.ok(session.ids.every(id=>extra.some(q=>q.id===id)));
});
test('identical local IDs cannot mix answer history or overwrite the legacy storage key',()=>{
  const store=new Map();const storage={getItem:key=>store.get(key)||null};
  const originalState={version:1,history:{1:{correct:true,attempts:2}},bookmarks:[2],bilingual:false,session:makeSession(core)};
  store.set(STORAGE_KEY,JSON.stringify(originalState));
  const coreState=loadState(storage,core,BANKS.core.storageKey);
  const extraState=loadState(storage,extra,BANKS.extra.storageKey);extraState.session=makeSession(extra);
  recordAnswer(extraState,extra[0],(extra[0].answer+1)%4);
  store.set(BANKS.extra.storageKey,JSON.stringify(extraState));
  assert.equal(coreState.history[1].correct,true);assert.equal(extraState.history[1].correct,false);
  assert.equal(storage.getItem(STORAGE_KEY),JSON.stringify(originalState));
  assert.deepEqual(loadState(storage,core).bookmarks,[2]);
});
test('extra deep links restore the bank while legacy links remain original-only',()=>{
  for(const page of ['home','bank','random','study','results']){
    assert.deepEqual(parseRoute('#'+routeFor(page,'extra')),{bank:'extra',page});
    assert.deepEqual(parseRoute('#'+routeFor(page,'core')),{bank:'core',page});
  }
  assert.deepEqual(parseRoute('#extra'),{bank:'extra',page:'home'});
  assert.equal(routeFor('short','extra'),'short');
});
test('short-answer drafts use their own key and reject malformed imported data',()=>{
  const saved={version:1,drafts:{1:'My English answer',999:'not a question',2:{bad:true}},reviewed:[1,1,999,'2']};
  const restored=loadShortState({getItem:key=>key===SHORT_STORAGE_KEY?JSON.stringify(saved):null},short);
  assert.deepEqual(restored.drafts,{'1':'My English answer'});assert.deepEqual(restored.reviewed,[1]);
  assert.deepEqual(loadShortState({getItem:()=>'{broken'},short),{version:1,drafts:{},reviewed:[]});
});
