export const TOPICS = {
  foundations: { name:'AI 與學習任務', en:'Foundations', short:'AI' },
  models: { name:'模型與學習率', en:'Models & learning', short:'ML' },
  preprocessing: { name:'資料前處理', en:'Preprocessing', short:'DP' },
  representation: { name:'表示與相似度', en:'Representation', short:'DR' },
  evaluation: { name:'模型評估', en:'Evaluation', short:'EV' },
  python: { name:'Python 工作流程', en:'Python workflow', short:'PY' }
};
export const STORAGE_KEY = 'recall-lab-v1';
export const BANKS = {
  core:{name:'原題庫',count:100,file:'questions.json',storageKey:STORAGE_KEY},
  extra:{name:'補充題庫',count:50,file:'extra-questions.json',storageKey:'recall-lab-extra-v1'}
};
export function routeFor(page,bank='core'){return page==='short'?'short':bank==='extra'?`extra/${page}`:page;}
export function parseRoute(hash){
  const parts=hash.replace(/^#/,'').split('/');
  return parts[0]==='extra'?{bank:'extra',page:parts[1]||'home'}:{bank:'core',page:parts[0]||'home'};
}
export function shuffle(items, rng = Math.random) {
  const result = [...items];
  for(let i=result.length-1;i>0;i--) { const j=Math.floor(rng()*(i+1)); [result[i],result[j]]=[result[j],result[i]]; }
  return result;
}
export function makeSession(bank,{mode='all',topic='all',count=20,history={},bookmarks=[],now=Date.now()}={}) {
  let pool = bank.filter(q=>topic==='all'||q.topic===topic);
  if(mode==='wrong') pool=pool.filter(q=>history[q.id]?.correct===false);
  if(mode==='bookmarks') pool=pool.filter(q=>bookmarks.includes(q.id));
  if(mode==='random') pool=shuffle(pool).slice(0, Math.min(count,pool.length));
  return { mode, topic, ids:pool.map(q=>q.id), index:0, answers:{}, optionOrders:Object.fromEntries(pool.map(q=>[q.id,shuffle([0,1,2,3])])), startedAt:now, finishedAt:null };
}
export function summarize(session, bank) {
  const byId=new Map(bank.map(q=>[q.id,q]));
  const answered=session.ids.filter(id=>Number.isInteger(session.answers[id]));
  const correct=answered.filter(id=>session.answers[id]===byId.get(id)?.answer);
  return { total:session.ids.length,answered:answered.length,correct:correct.length,wrong:answered.length-correct.length,unanswered:session.ids.length-answered.length,percent:session.ids.length?Math.round(correct.length/session.ids.length*100):0 };
}
export function loadState(storage,bank,key=STORAGE_KEY) {
  const fresh={version:1,history:{},bookmarks:[],bilingual:true,session:null};
  try {
    const parsed=JSON.parse(storage.getItem(key));
    if(!parsed||parsed.version!==1) return fresh;
    const ids=new Set(bank.map(q=>q.id));
    const history=Object.fromEntries(Object.entries(parsed.history||{}).filter(([id,h])=>ids.has(Number(id))&&h&&typeof h.correct==='boolean'));
    const bookmarks=Array.isArray(parsed.bookmarks)?parsed.bookmarks.filter(id=>ids.has(id)):[];
    let session=parsed.session;
    if(session) {
      const valid=Array.isArray(session.ids)&&session.ids.length>0&&session.ids.every(id=>ids.has(id))&&new Set(session.ids).size===session.ids.length&&Number.isInteger(session.index)&&session.index>=0&&session.index<session.ids.length&&Number.isFinite(session.startedAt)&&(!session.finishedAt||Number.isFinite(session.finishedAt))&&session.answers&&session.optionOrders&&session.ids.every(id=>Array.isArray(session.optionOrders[id])&&session.optionOrders[id].length===4&&new Set(session.optionOrders[id]).size===4&&session.optionOrders[id].every(n=>Number.isInteger(n)&&n>=0&&n<4))&&Object.entries(session.answers).every(([id,n])=>session.ids.includes(Number(id))&&Number.isInteger(n)&&n>=0&&n<4);
      if(!valid)session=null;
    }
    return {...fresh,history,bookmarks,bilingual:parsed.bilingual!==false,session};
  } catch { return fresh; }
}
export function recordAnswer(state,question,index,now=Date.now()) {
  const session=state.session;
  if(!session||session.finishedAt||!session.ids.includes(question.id)||session.answers[question.id]!==undefined)return false;
  if(!Number.isInteger(index)||index<0||index>3)return false;
  session.answers[question.id]=index;
  const old=state.history[question.id];
  state.history[question.id]={correct:index===question.answer,attempts:(old?.attempts||0)+1,lastAnswer:index,updatedAt:now};
  return true;
}
