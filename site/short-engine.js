export const SHORT_STORAGE_KEY='recall-lab-short-v1';
export function loadShortState(storage,questions){
  const fresh={version:1,drafts:{},reviewed:[]};
  try{
    const parsed=JSON.parse(storage.getItem(SHORT_STORAGE_KEY));
    if(!parsed||parsed.version!==1)return fresh;
    const ids=new Set(questions.map(q=>String(q.id)));
    const drafts=Object.fromEntries(Object.entries(parsed.drafts||{}).filter(([id,text])=>ids.has(id)&&typeof text==='string').map(([id,text])=>[id,text.slice(0,12000)]));
    const reviewed=Array.isArray(parsed.reviewed)?[...new Set(parsed.reviewed.filter(id=>Number.isInteger(id)&&ids.has(String(id))))]:[];
    return {version:1,drafts,reviewed};
  }catch{return fresh;}
}
