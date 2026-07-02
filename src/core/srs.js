import { tr } from "./platform.js";
const DAY=864e5;
const INTERVALS=[0,0,1,2,4,7];

function schedule(c,verdict){
  let box=c.box||1;
  if(verdict==="correct")box=Math.min(5,box+1);
  else if(verdict==="incorrect")box=1;
  const days=INTERVALS[box]??1;
  return{...c,box,dueAt:Date.now()+days*DAY,reps:(c.reps||0)+1,
    lapses:(c.lapses||0)+(verdict==="incorrect"?1:0),lastResult:verdict,lastSeen:Date.now()};
}
function quizFormat(box){ if((box||1)>=4)return 'short'; if(box===3)return 'ox'; return 'mc'; }
function deckSummary(d){
  const cs=d.concepts||[],now=Date.now();
  return{total:cs.length,mastered:cs.filter(c=>(c.box||1)>=4).length,
    due:cs.filter(c=>(c.dueAt||0)<=now).length,weak:cs.filter(c=>(c.box||1)<=2).length,
    started:cs.filter(c=>(c.box||1)>=2).length,   // 개념 진행률 (익히기 시작)
    reviewed:cs.filter(c=>(c.box||1)>=3).length,  // 복습 진도율 (자리잡음)
    deep:cs.filter(c=>(c.box||1)>=4).length};     // 심화 진도율 (숙달)
}
function pickConcept(d,avoidId){
  const cs=(d.concepts||[]).slice();if(!cs.length)return null;
  const now=Date.now();
  let pool=cs.filter(c=>(c.dueAt||0)<=now);
  if(!pool.length)pool=cs;
  pool.sort((a,b)=>(a.box||1)-(b.box||1)||(a.dueAt||0)-(b.dueAt||0));
  if(pool.length>1&&pool[0].id===avoidId){const alt=pool.find(c=>c.id!==avoidId);if(alt)return alt}
  return pool[0];
}
const diffWord=(box)=>(box||1)<=1?tr("기초","Basic"):box<=2?tr("초중급","Beginner"):box<=3?tr("중급","Intermediate"):box<=4?tr("고급","Advanced"):tr("심화","Expert");
const diffLong=(box)=>{
  const b=box||1;
  if(b<=1)return"기초: 개념 정의·직관 이해. '~란 무엇인가', '~의 의미는' 수준";
  if(b<=2)return"초중급: 이유·메커니즘. '왜 ~가 발생하는가', '~의 작동 원리는' 수준";
  if(b<=3)return"중급: 개념 비교·연결·단순 수치 계산. '~와 ~의 차이', '주어진 수치로 ~를 구하라' 수준";
  if(b<=4)return"고급: 복잡한 계산·그래프 분석·반례. '균형 수치를 직접 구하라', '이 주장의 반례를 들어라' 수준";
  return"심화: 복합 상황 분석·정책 효과 추론·창의 응용. '~정책의 단기/장기 영향을 비교 분석하라' 수준";
};

/* ── 마스코트 ── */

export { DAY, INTERVALS, schedule, quizFormat, deckSummary, pickConcept, diffWord, diffLong };
