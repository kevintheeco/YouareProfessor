import { MathText } from "../ui/math.jsx";
import { Meter } from "../ui/common.jsx";
import { tr } from "../core/platform.js";
import React from "react";
const { useState, useEffect, useRef, useCallback } = React;

function WeakNotes({deck,onBack,onStudy}){
  const concepts=deck.concepts||[];
  const weak=concepts.filter(c=>(c.box||1)<=3||c.lapses>0||c.lastGap)
    .sort((a,b)=>(a.box||1)-(b.box||1)||(b.lapses||0)-(a.lapses||0));
  const noData=weak.every(c=>!c.lastGap&&!c.lastAnswer);
  const studyableCount=(deck.concepts||[]).filter(c=>(c.box||1)<=3||c.lapses>0).length;
  return(
    <section className="card panel">
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <button className="btn gho sm" onClick={onBack}>{tr("← 뒤로","← Back")}</button>
        <div style={{flex:1}}>
          <div className="eyebrow">{tr("오답 노트","Review notes")}</div>
          <div style={{fontSize:14,fontWeight:700,color:"var(--ink)"}}>{deck.name}</div>
        </div>
        {onStudy&&<button className="btn pri sm" onClick={()=>onStudy(deck)} style={{flexShrink:0}}>
          {tr("💪 약점만 공부하기","💪 Study weak only")} {studyableCount>0&&<span style={{background:"rgba(255,255,255,.35)",borderRadius:10,padding:"1px 6px",marginLeft:4,fontSize:11}}>{studyableCount}</span>}
        </button>}
      </div>
      {weak.length===0?(
        <div className="empty">{tr("아직 틀린 개념이 없어! 공부를 시작해봐 📚","No missed concepts yet! Start studying 📚")}</div>
      ):noData?(
        <div className="empty" style={{textAlign:"left",padding:"20px"}}>
          <p style={{margin:0,fontSize:13.5,color:"var(--sub)",lineHeight:1.7}}>{tr("공부를 더 하면 여기에 빠진 개념과 내 답이 쌓여. 지금 공부하고 돌아와봐!","As you study, missed concepts and your answers pile up here. Study and come back!")}</p>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {weak.map(c=>(
            <div key={c.id} style={{border:"1.5px solid var(--line)",borderRadius:14,padding:"14px 16px",background:"#FFFDF8"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:(c.lastGap&&c.lastGap!=="없음")||c.lastAnswer?10:0}}>
                <Meter box={c.box||1}/>
                <MathText text={c.name} tag="span" style={{fontFamily:"'Jua',sans-serif",fontSize:15,flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}/>
                {c.lapses>0&&<span style={{fontSize:11,background:"#FEE2E2",color:"#B91C1C",borderRadius:6,padding:"2px 7px",fontWeight:600,flexShrink:0}}>{tr("틀림 "+c.lapses+"회","Missed ×"+c.lapses)}</span>}
                <span style={{fontSize:11,color:"var(--sub)",flexShrink:0}}>Lv.{c.box||1}</span>
              </div>
              {c.lastGap&&c.lastGap!=="없음"&&(
                <div style={{background:"#FFF5F5",borderRadius:10,padding:"8px 12px",marginBottom:6}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#DC2626",letterSpacing:".4px",marginBottom:4}}>{tr("빠진 개념","What was missing")}</div>
                  <MathText text={c.lastGap} tag="div" style={{fontSize:13,color:"#7F1D1D",lineHeight:1.6}}/>
                </div>
              )}
              {c.lastAnswer&&c.lastAnswer!=="[손글씨]"&&(
                <div style={{background:"var(--bg)",borderRadius:10,padding:"8px 12px"}}>
                  <div style={{fontSize:10,fontWeight:700,color:"var(--sub)",letterSpacing:".4px",marginBottom:4}}>{tr("내 마지막 답","My last answer")}</div>
                  <div style={{fontSize:13,color:"var(--ink)",lineHeight:1.7,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{c.lastAnswer}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="hint">{tr("Lv.3 이하이거나 틀린 적 있는 개념 표시. 공부할수록 줄어들어!","Shows concepts at Lv.3 or below, or ever missed. They shrink as you study!")}</p>
    </section>
  );
}

/* ── 개념 과외(플립러닝) ── AI가 먼저 이해시키고, 단계마다 써보기/설명하기로 주고받는 1:1 과외 */

export { WeakNotes };
