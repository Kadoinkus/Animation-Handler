import React, { useState, useEffect, useRef } from "react";
import { parseCSV, getClip } from "./utils/csv.js";

/* === 1. Master two-letter codes ================================== */
const EMOTION_TABLE = {
  ha:"happy", an:"angry", sa:"sad", af:"afraid", ex:"excited",
  sh:"shy",   sk:"shocked", bo:"bored", cu:"curious", co:"confused",
  fr:"frustrated", pr:"proud", pl:"playful", ti:"tired", rl:"relaxed",
  em:"embarrassed", su:"surprised", th:"thoughtful",
  di:"disgusted",   dp:"disappointed", ho:"hopeful", je:"jealous",
  am:"amused", ao:"annoyed", ne:"nervous", op:"optimistic",
  pe:"pessimistic", st:"satisfied", sq:"skeptical"
};

/* === 2. State arrows ============================================ */
const NEXT = { sleep:["wait"], wait:["sleep","react"], react:["type"], type:["wait"] };

/* === 3. Find complete emotion packs ============================= */
function discoverEmotions(clips){
  const has = n => clips.some(c=>c.clip===n);
  const react = cd => clips.some(c=>new RegExp(`^react_\\w+2type_${cd}_T$`).test(c.clip));
  return Object.entries(EMOTION_TABLE).flatMap(([cd,word])=>{
    const ok = react(cd)&&has(`type_${word}_L`)&&has(`type_${word}2wait_T`);
    return ok ? [{code:cd,label:word[0].toUpperCase()+word.slice(1),loop:word}] : [];
  });
}

/* === 4. Component =============================================== */
export default function App(){
  const [csv,setCsv]      = useState("");
  const [clips,setClips]  = useState([]);
  const [emotions,setEmo] = useState([]);

  const [state,setState]  = useState("idle");
  const [queue,setQueue]  = useState([]);
  const [playing,setPlay] = useState(false);
  const timer             = useRef(null);
  const [log,setLog]      = useState([]);
  const [show,setShow]    = useState(false);
  const [typeMood,setMood]= useState("");           // empty = default

  /* scheduler */
  useEffect(()=>{
    if(!playing||!queue.length) return;
    const cur=queue[0];
    setLog(l=>[cur.clip,...l].slice(0,20));
    clearTimeout(timer.current);
    timer.current=setTimeout(()=>setQueue(q=>q.slice(1)), cur.duration/24*1000);
  },[queue,playing]);

  /* auto-idle refill */
  useEffect(()=>{
    if(!playing||queue.length) return;
    const idle = state==="type"&&typeMood ? `type_${typeMood}_L` : `${state}_idle_L`;
    enqueue(idle);
  },[queue,playing,state,typeMood]);

  const enqueue = name => setQueue(q=>[...q, getClip(clips,name)]);

  /* controls */
  const start = ()=>{
    const parsed=parseCSV(csv);
    if(!parsed.length) return alert("Load a CSV first");
    setClips(parsed);
    setEmo(discoverEmotions(parsed));
    setState("sleep");
    setPlay(true);
    setQueue([getClip(parsed,"sleep_idle_L")]);
  };
  const pause  = ()=>{setPlay(false);clearTimeout(timer.current);};
  const resume = ()=>!playing&&setPlay(true);

  /* state change (with mood-specific exit) */
  const go = (target, code="")=>{
    if(!NEXT[state].includes(target)) return;

    let clip="";
    if(state==="wait"&&target==="react"){
      clip="wait_2react_T";
    }
    else if(state==="react"&&target==="type"){
      if(!code){                           // DEFAULT path
        clip="react_2type_T";
        setMood("");
      }else{                               // emotion path
        const mood=emotions.find(e=>e.code===code)?.loop||"";
        clip=`react_${mood}2type_${code}_T`;
        setMood(mood);
      }
    }
    else if(state==="type"&&target==="wait"){
      clip = typeMood ? `type_${typeMood}2wait_T` : "type_2wait_T";
      setMood("");
    }
    else{
      clip=`${state}_2${target}_T`;
    }

    enqueue(clip);
    setState(target);
    setShow(false);
  };

  /* button flags */
  const next=NEXT[state]??[];
  const canSleep=next.includes("sleep"), canWait=next.includes("wait"),
        canReact=next.includes("react"), canType=next.includes("type");

  const Btn=({label,enabled,onClick})=>(
    <div className={"btn "+(enabled?"active":"disabled")} onClick={enabled?onClick:null}>
      {label}
    </div>
  );

  /* === render ==================================================== */
  return (
    <>
      <h2>Animation Handler</h2>

      <input type="file" accept=".csv,.txt"
             onChange={e=>e.target.files[0]?.text().then(setCsv)}/>
      <textarea value={csv} onChange={e=>setCsv(e.target.value)}
                placeholder="clip,weight,duration"/>

      <div className="row">
        {!playing
          ? <Btn label="▶ Start"  enabled onClick={start}/>
          : <Btn label="❚❚ Pause" enabled onClick={pause}/> }
        {!playing&&queue.length>0&&
          <Btn label="▶ Resume" enabled onClick={resume}/>}
      </div>

      {playing&&(
        <div className="row">
          <Btn label="Sleep" enabled={canSleep} onClick={()=>go("sleep")}/>
          <Btn label="Wait"  enabled={canWait}  onClick={()=>go("wait")}/>
          <Btn label="React" enabled={canReact} onClick={()=>go("react")}/>
          <Btn label="Type"  enabled={canType}  onClick={()=>setShow(true)}/>
        </div>
      )}

      {show&&(
        <div className="pop">
          {/* Default first */}
          <div className="pop-item" onClick={()=>go("type","")}>Default</div>

          {/* dynamic emotion list */}
          {emotions.map(e=>(
            <div key={e.code} className="pop-item"
                 onClick={()=>go("type",e.code)}>{e.label}</div>
          ))}
          <div className="pop-item" style={{fontSize:"12px",opacity:.55}}
               onClick={()=>setShow(false)}>cancel</div>
        </div>
      )}

      <div className="log">{log.map((l,i)=><div key={i}>{l}</div>)}</div>
    </>
  );
}
