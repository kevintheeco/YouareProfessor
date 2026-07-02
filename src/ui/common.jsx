import { MathText } from "./math.jsx";
import { tr } from "../core/platform.js";
import React from "react";
const { useState, useEffect, useRef, useCallback } = React;

function Prof({size=56}){
  return(
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <ellipse cx="36" cy="64" rx="20" ry="4" fill="#221C39" opacity=".07"/>
      <circle cx="36" cy="38" r="22" fill="#FFD9B8"/>
      <circle cx="36" cy="38" r="22" stroke="#F2BC93" strokeWidth="1.4"/>
      <circle cx="23" cy="43" r="4.2" fill="#FFB3A0" opacity=".75"/>
      <circle cx="49" cy="43" r="4.2" fill="#FFB3A0" opacity=".75"/>
      <circle cx="28.5" cy="36" r="7" fill="#fff" stroke="#221C39" strokeWidth="2.2"/>
      <circle cx="43.5" cy="36" r="7" fill="#fff" stroke="#221C39" strokeWidth="2.2"/>
      <path d="M35.5 36h1" stroke="#221C39" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="28.5" cy="36.5" r="2.4" fill="#221C39"/>
      <circle cx="43.5" cy="36.5" r="2.4" fill="#221C39"/>
      <path d="M30 48q6 5 12 0" stroke="#221C39" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M36 8L58 18L36 28L14 18Z" fill="#6C5CE7"/>
      <path d="M36 8L58 18L36 28L14 18Z" stroke="#5A48E0" strokeWidth="1"/>
      <rect x="33" y="20" width="6" height="9" rx="2" fill="#6C5CE7"/>
      <path d="M55 19v8" stroke="#FFC24B" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="55" cy="29" r="2.6" fill="#FFC24B"/>
    </svg>
  );
}

/* ════════════════════════════════════════════
   단원평가(시험) 모드 — 이해+암기 합친 실전 시험
   출제(AI) → 응시(손글씨 보존) → 일괄 깊은 채점 → 검토. box(복습)와 독립.
════════════════════════════════════════════ */

function Fb({label,color,bg,text}){
  return(
    <div style={{background:bg,borderRadius:11,padding:"9px 13px"}}>
      <div style={{fontSize:10,fontWeight:800,letterSpacing:".3px",color,marginBottom:4}}>{label}</div>
      <MathText text={text} tag="div" style={{fontSize:13.5,lineHeight:1.7,color:"var(--ink)"}}/>
    </div>
  );
}

/* ════════════════════════════════════════════
   APP ROOT
════════════════════════════════════════════ */

function Stat({n,l,t}){return<div className="stat"><div className={"n "+(t||"")}>{n}</div><div className="l">{l}</div></div>}
function Bar({mastered,total}){const p=total?Math.round((mastered/total)*100):0;return<div className="bar"><i style={{width:p+"%"}}/></div>}
const ratePct=(n,t)=>t?Math.round(n/t*100):0;
// 진도율 막대 (라벨 + % + 채워지는 바). tone: pri(개념)·gold(복습)·mint(심화)
function RateBar({label,pct,tone,compact}){
  const col=tone==="mint"?"var(--mint)":tone==="gold"?"var(--gold)":"var(--pri)";
  if(compact)return(
    <div style={{minWidth:62}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:4}}>
        <span style={{fontSize:9.5,color:"var(--sub)"}}>{label}</span>
        <span style={{fontSize:13,fontWeight:800,color:col,fontFamily:"'Jua',sans-serif"}}>{pct}%</span>
      </div>
      <div className="bar" style={{height:5,marginTop:3}}><i style={{width:pct+"%",background:col}}/></div>
    </div>);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
        <span style={{fontSize:11.5,color:"var(--sub)",fontWeight:600}}>{label}</span>
        <span style={{fontSize:15,fontWeight:800,color:col,fontFamily:"'Jua',sans-serif"}}>{pct}%</span>
      </div>
      <div className="bar"><i style={{width:pct+"%",background:col}}/></div>
    </div>);
}

/* ── 파일 드롭존 ── */
function FileDropZone({files,onChange}){
  const [over,setOver]=useState(false);
  const ref=useRef(null);

  function handleFiles(newFiles){
    const arr=Array.from(newFiles).filter(f=>{
      const ok=f.type.startsWith("image/")||f.type==="application/pdf";
      if(!ok)alert(f.name+tr(": 이미지(jpg/png) 또는 PDF만 가능해.",": only images (jpg/png) or PDF."));
      return ok;
    });
    onChange([...files,...arr]);
  }
  const fmtSize=(n)=>n<1024?""+n+"B":n<1048576?(n/1024).toFixed(1)+"KB":(n/1048576).toFixed(1)+"MB";
  const fileIcon=(f)=>f.type==="application/pdf"?"📄":f.type.startsWith("image/")?"🖼️":"📎";

  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div className={"dropzone"+(over?" over":"")}
        onDragOver={e=>{e.preventDefault();setOver(true)}}
        onDragLeave={()=>setOver(false)}
        onDrop={e=>{e.preventDefault();setOver(false);handleFiles(e.dataTransfer.files)}}
        onClick={()=>ref.current&&ref.current.click()}>
        <input ref={ref} type="file" accept="image/*,.pdf" multiple
          onChange={e=>handleFiles(e.target.files)} style={{display:"none"}}/>
        <div className="dz-icon">📎</div>
        <div className="dz-text"><b>{tr("파일 선택 또는 여기에 끌어다 놓기","Choose files or drag them here")}</b><br/>{tr("이미지(JPG·PNG) · PDF 지원","Images (JPG·PNG) · PDF")}</div>
      </div>
      {files.length>0&&(
        <div className="file-list">
          {files.map((f,i)=>(
            <div key={i} className="file-item">
              <span className="fi-icon">{fileIcon(f)}</span>
              <span className="fi-name">{f.name}</span>
              <span className="fi-size">{fmtSize(f.size)}</span>
              <button className="fi-del" onClick={()=>onChange(files.filter((_,j)=>j!==i))}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── S펜 배럴(옆) 버튼 지우개 감지 (공용) ──
   삼성노트처럼: 버튼 누르고 있는 동안만 지우개, 떼면 펜으로 복귀.
   기기·브라우저마다 버튼 비트가 2(배럴)/32(지우개팁)로 제각각이라 둘 다 인식하고,
   펜을 뒤집어 쓰는 경우(pointerType==="eraser")도 지우개로 본다. */

function DepthGauge({depth,lang}){
  const LEVELS=["암기","이해","설명가능","응용가능"];
  const LABELS=lang==="en"?["Recall","Understand","Explain","Apply"]:LEVELS;
  const idx=LEVELS.findIndex(l=>depth&&depth.startsWith(l));
  if(idx<0||!depth)return null;
  return(
    <div style={{padding:"8px 12px",background:"var(--bg)",border:"1px solid var(--line)",borderRadius:10}}>
      <div style={{fontSize:10,fontWeight:700,color:"var(--sub)",letterSpacing:".5px",marginBottom:6}}>{lang==="en"?"Understanding depth":"이해 깊이"}</div>
      <div style={{display:"flex",gap:4}}>
        {LEVELS.map((l,i)=>(
          <div key={l} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <div style={{width:"100%",height:7,borderRadius:4,
              background:i<=idx?(i===0?"#A0A0D0":i===1?"#7B83D6":i===2?"#6C5CE7":"#4A3FC7"):"#E0E0F0"}}/>
            <span style={{fontSize:9.5,lineHeight:1.3,textAlign:"center",
              color:i===idx?"#6C5CE7":"var(--sub)",fontWeight:i===idx?700:400}}>{LABELS[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 오답 노트 ── */

const CHEERS=[
  ["너는 오늘도 사랑받는 존재야 💜","You are loved, today and always 💜"],
  ["난 네가 참 자랑스러워","I'm so proud of you"],
  ["너는 하나밖에 없는 걸작품이야 ✨","You're a one-of-a-kind masterpiece ✨"],
  ["나는 너의 앞길을 응원해","I'm cheering for your journey"],
  ["두려워하거나 걱정하지 마!","Don't be afraid or anxious!"],
  ["오늘도 담대하게, 화이팅! 🔥","Be bold today — you've got this! 🔥"],
  ["지금 이 노력, 분명히 너를 키우고 있어 🌱","This effort is growing you, for sure 🌱"],
  ["조급해 말고 한 걸음씩 — 넌 잘하고 있어","One step at a time — you're doing great"],
  ["어제의 너보다 오늘의 네가 더 단단해","You're stronger today than yesterday"],
  ["막혀도 괜찮아, 막힌 만큼 자라는 거야","Stuck is okay — that's where you grow"],
];
function Cheer({style}){
  const [i,setI]=useState(()=>Math.floor(Math.random()*CHEERS.length));
  useEffect(()=>{const t=setInterval(()=>setI(v=>(v+1)%CHEERS.length),3500);return()=>clearInterval(t);},[]);
  return <div style={{fontSize:13,color:"var(--pri-d)",fontWeight:600,textAlign:"center",lineHeight:1.6,transition:"opacity .3s",...style}}>💛 {tr(CHEERS[i][0],CHEERS[i][1])}</div>;
}


function Meter({box}){
  return(
    <span className="meter" title={"기억 강도 "+box+"/5"}>
      {[1,2,3,4,5].map(i=><i key={i} className={(i<=box?"on":"")+(box>=5?" full":"")}/>)}
    </span>
  );
}

/* ════════════════════════════════════════════
   학원용 앱 — 개인용과 분리(#academy 링크). 교과과정 목차 → 목차별 시험.
   엔진(Exam·채점·PenPad)은 개인용과 공유. ※ 목차는 검수·수정 가능한 초안.
════════════════════════════════════════════ */

export { Prof, Fb, Stat, Bar, ratePct, RateBar, FileDropZone, DepthGauge, CHEERS, Cheer, Meter };
