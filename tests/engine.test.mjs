import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeSession,recordAnswer,summarize,loadState,shuffle,STORAGE_KEY} from '../site/engine.js';
import {validateBank} from '../scripts/validate.mjs';
const bank=await validateBank();
test('full-bank practice contains all 100 questions exactly once',()=>{
  const s=makeSession(bank);assert.equal(s.ids.length,100);assert.equal(new Set(s.ids).size,100);
  for(const order of Object.values(s.optionOrders))assert.deepEqual([...order].sort(),[0,1,2,3]);
});
test('random quiz is without replacement and respects topic capacity',()=>{
  const q=makeSession(bank,{mode:'random',count:20});assert.equal(q.ids.length,20);assert.equal(new Set(q.ids).size,20);
  const topic='models';const filtered=makeSession(bank,{mode:'random',topic,count:100});
  assert.equal(filtered.ids.length,bank.filter(q=>q.topic===topic).length);
  assert.ok(filtered.ids.every(id=>bank.find(q=>q.id===id).topic===topic));
});
test('option shuffle preserves answer identity; double submission cannot change score',()=>{
  const state={history:{},session:makeSession(bank)};const q=bank[0];
  assert.equal(recordAnswer(state,q,q.answer),true);assert.equal(recordAnswer(state,q,(q.answer+1)%4),false);
  assert.equal(state.history[q.id].correct,true);assert.equal(state.history[q.id].attempts,1);
  assert.equal(summarize(state.session,bank).correct,1);
});
test('wrong-answer review removes an item after it is answered correctly',()=>{
  const q=bank[0];const state={history:{},session:makeSession(bank)};
  recordAnswer(state,q,(q.answer+1)%4);let review=makeSession(bank,{mode:'wrong',history:state.history});
  assert.deepEqual(review.ids,[q.id]);state.session=review;recordAnswer(state,q,q.answer);
  assert.equal(makeSession(bank,{mode:'wrong',history:state.history}).ids.length,0);
  assert.equal(state.history[q.id].attempts,2);
});
test('unanswered items get no score and finish locks submissions',()=>{
  const state={history:{},session:makeSession(bank,{mode:'random',count:10})};
  assert.deepEqual(summarize(state.session,bank),{total:10,answered:0,correct:0,wrong:0,unanswered:10,percent:0});
  state.session.finishedAt=Date.now();assert.equal(recordAnswer(state,bank[0],bank[0].answer),false);
});
test('saved practice restores answers, option order, bookmarks and position',()=>{
  const s=makeSession(bank);s.index=3;s.answers[s.ids[0]]=bank[0].answer;
  const saved={version:1,history:{1:{correct:true,attempts:1}},bookmarks:[1,999],bilingual:false,session:s};
  const state=loadState({getItem:key=>key===STORAGE_KEY?JSON.stringify(saved):null},bank);
  assert.deepEqual(state.session,s);assert.deepEqual(state.bookmarks,[1]);assert.equal(state.bilingual,false);
});
test('malformed stored data and corrupted session recover safely',()=>{
  for(const text of ['{invalid','null','{"version":7}',JSON.stringify({version:1,session:{ids:[1],index:0,answers:{},optionOrders:{1:[0,0,0,0]}}})]){
    const state=loadState({getItem:()=>text},bank);assert.equal(state.session,null);
  }
});
test('shuffle does not mutate the original bank',()=>{const a=[1,2,3,4];assert.deepEqual(shuffle(a,()=>0),[2,3,4,1]);assert.deepEqual(a,[1,2,3,4]);});
