import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const API = "http://localhost:3001/api";
const te = {
  brand:"మీ సేవా మిత్ర", sub:"ఆదాయ ధృవీకరణ పత్రం • అధికారుల పని సులభం",
  dashboard:"డ్యాష్‌బోర్డ్", applications:"దరఖాస్తులు", visits:"ఈ రోజు క్షేత్ర పర్యటనలు",
  pending:"పెండింగ్‌లో", overdue:"గడువు దాటినవి", total:"మొత్తం దరఖాస్తులు",
  documents:"పత్రాల పరిశీలన", field:"క్షేత్ర పరిశీలన", ri:"RI సమీక్ష", tahsildar:"తహసీల్దార్ నిర్ణయం", completed:"పూర్తయ్యాయి",
  search:"పేరు / దరఖాస్తు నంబర్ వెతకండి", all:"అన్నీ", attention:"ముందుగా చూడాల్సినవి",
  days:"రోజులు మిగిలి ఉన్నాయి", overdueBy:"రోజులు గడువు దాటింది", next:"తదుపరి పని",
  reviewDocs:"పత్రాలు పరిశీలించండి", doVisit:"క్షేత్ర పరిశీలన పూర్తి చేయండి", reviewRI:"RI సమీక్షకు పంపండి", makeDecision:"తుది నిర్ణయం తీసుకోండి",
  applicant:"దరఖాస్తుదారు", location:"గ్రామం / మండలం", income:"వార్షిక ఆదాయం", land:"భూమి (ఎకరాలు)",
  purpose:"అవసరం", age:"వయస్సు", documentsLabel:"జత చేసిన పత్రాలు", workflow:"పని దశలు",
  summary:"AI దరఖాస్తు సారాంశం", aiDisclaimer:"AI తయారు చేసింది — దయచేసి పరిశీలించండి",
  confidence:"నమ్మకం స్థాయి", reasoning:"ఎందుకు ఈ సూచన?", inconsistencies:"గమనించాల్సిన విషయాలు",
  docTitle:"పత్రాల పరిశీలన", fieldTitle:"క్షేత్ర పరిశీలన", decisionTitle:"తుది నిర్ణయం",
  checklist:"పరిశీలన జాబితా", house:"ఇంటి చిరునామా సరైందా?", applicantMet:"దరఖాస్తుదారుని కలిశారా?", incomeChecked:"ఆదాయం వివరాలు పరిశీలించారా?", neighbour:"పక్కింటి వారి మాట నమోదు చేశారా?",
  photo:"ఫోటో జత చేయండి", statement:"దరఖాస్తుదారు / పొరుగువారి మాట", remarks:"పరిశీలన గమనికలు",
  save:"సేవ్ చేయండి", complete:"దశ పూర్తి చేసి ముందుకు పంపండి", approve:"ఆమోదించండి", reject:"తిరస్కరించండి", return:"తిరిగి పంపండి",
  reason:"కారణం (తప్పనిసరి)", missing:"కావాల్సిన పత్రాలు / వివరాలు", confirm:"నిర్ధారించండి", cancel:"వద్దు",
  history:"పని చరిత్ర", status:"దరఖాస్తుదారునికి కనిపించే స్థితి", notification:"SMS / WhatsApp సందేశం",
  online:"ఆన్‌లైన్", offline:"ఆఫ్‌లైన్", sync:"సింక్ చేయండి", savedOffline:"ఆఫ్‌లైన్‌లో భద్రపరిచాం. నెట్ వచ్చినప్పుడు సింక్ అవుతుంది.",
  noResults:"దరఖాస్తులు లేవు", returned:"తిరిగి వచ్చినది", resubmitted:"మళ్లీ సమర్పించారు", escalated:"పై అధికారికి పంపారు",
  vulnerable:"ప్రత్యేక శ్రద్ధ", vulnerableElderly:"వృద్ధులు", vulnerableWidow:"వితంతువు", vulnerableDisabled:"దివ్యాంగులు",
  close:"మూసివేయండి", view:"వివరాలు చూడండి", today:"ఈ రోజు", noVisits:"ఈ రోజు పర్యటనలు లేవు",
  newApplication:"+ కొత్త దరఖాస్తు", newAppTitle:"కొత్త ఆదాయ ధృవీకరణ దరఖాస్తు", nameLabel:"దరఖాస్తుదారుని పేరు", villageLabel:"గ్రామం", mandalLabel:"మండలం", annualIncomeLabel:"వార్షిక ఆదాయం (₹)", mobileLabel:"మొబైల్ నంబర్", create:"దరఖాస్తు సృష్టించండి", cancelCreate:"రద్దు చేయండి", creating:"సృష్టిస్తోంది...",
  aiAction:"AI సూచనపై మీ చర్య", accepted:"అంగీకరించు", edited:"మార్చి వాడతాను", ignored:"పట్టించుకోను",
  draft:"ముసాయిదా", photoHint:"ఫోటో, లొకేషన్ వివరాలు ఈ స్థానిక డెమోలో భద్రపరచబడతాయి; నిజమైన పౌరుల ఫోటోలు ఉపయోగించవద్దు.",
  stageCounts:"దశల వారీగా", workflowLock:"ముందరి దశ పూర్తయ్యే వరకు ఈ దశ తెరుచుకోదు."
};
const en = {
  brand:"MeeSeva Mitra", sub:"Income Certificate • simpler field workflow",
  dashboard:"Dashboard", applications:"Applications", visits:"Today's visits",
  pending:"Pending", overdue:"Overdue", total:"Total applications",
  documents:"Document scrutiny", field:"Field verification", ri:"RI review", tahsildar:"Tahsildar decision", completed:"Completed",
  search:"Search name / application number", all:"All", attention:"Needs attention first",
  days:"days left", overdueBy:"days overdue", next:"Next action",
  reviewDocs:"Review documents", doVisit:"Complete field verification", reviewRI:"Send for RI review", makeDecision:"Make final decision",
  applicant:"Applicant", location:"Village / Mandal", income:"Annual income", land:"Land (acres)",
  purpose:"Purpose", age:"Age", documentsLabel:"Attached documents", workflow:"Workflow steps",
  summary:"AI application summary", aiDisclaimer:"AI-generated — please verify",
  confidence:"Confidence", reasoning:"Why this suggestion?", inconsistencies:"Things to check",
  docTitle:"Document scrutiny", fieldTitle:"Field verification", decisionTitle:"Final decision",
  checklist:"Visit checklist", house:"Address is correct?", applicantMet:"Met the applicant?", incomeChecked:"Income details checked?", neighbour:"Neighbour statement recorded?",
  photo:"Attach photo", statement:"Applicant / neighbour statement", remarks:"Field remarks",
  save:"Save", complete:"Complete step and move forward", approve:"Approve", reject:"Reject", return:"Return",
  reason:"Reason (required)", missing:"Missing documents / details", confirm:"Confirm", cancel:"Cancel",
  history:"Activity history", status:"Applicant-facing status", notification:"SMS / WhatsApp preview",
  online:"Online", offline:"Offline", sync:"Sync now", savedOffline:"Saved offline. It will sync when the network returns.",
  noResults:"No applications", returned:"Returned", resubmitted:"Resubmitted", escalated:"Escalated",
  vulnerable:"Extra care", vulnerableElderly:"Elderly", vulnerableWidow:"Widow", vulnerableDisabled:"Disabled",
  close:"Close", view:"View details", today:"Today", noVisits:"No visits scheduled today",
  newApplication:"+ New Application", newAppTitle:"New Income Certificate Application", nameLabel:"Applicant Name", villageLabel:"Village", mandalLabel:"Mandal", annualIncomeLabel:"Annual Income (₹)", mobileLabel:"Mobile Number", create:"Create application", cancelCreate:"Cancel", creating:"Creating...",
  aiAction:"Your action on AI suggestion", accepted:"Accept", edited:"Edit & use", ignored:"Ignore",
  draft:"Draft", photoHint:"Photo and location details are stored in this local demo; do not use real citizens’ photos.",
  stageCounts:"Applications by stage", workflowLock:"This step stays locked until the previous step is complete."
};
const stageName = (s, lang) => ({DOCUMENTS:lang==="te"?te.documents:en.documents,FIELD:lang==="te"?te.field:en.field,RI:lang==="te"?te.ri:en.ri,TAHSILDAR:lang==="te"?te.tahsildar:en.tahsildar,COMPLETED:lang==="te"?te.completed:en.completed}[s]);
const money = n => "₹" + Number(n||0).toLocaleString("en-IN");
function daysLeft(date){return Math.ceil((new Date(date)-new Date())/86400000)}
function App(){
 const [lang,setLang]=useState("te"), [apps,setApps]=useState([]), [dash,setDash]=useState(null);
 const [selected,setSelected]=useState(null), [query,setQuery]=useState(""), [filter,setFilter]=useState("ALL");
 const [showCreate,setShowCreate]=useState(false), [creating,setCreating]=useState(false);
 const [online,setOnline]=useState(navigator.onLine), [syncCount,setSyncCount]=useState(0), [toast,setToast]=useState("");
 const t=lang==="te"?te:en;
 const refresh=async()=>{
   try{
    const [a,d]=await Promise.all([fetch(API+"/applications"),fetch(API+"/dashboard")]);
    if(!a.ok||!d.ok) throw new Error("API");
    setApps(await a.json()); setDash(await d.json()); setOnline(true);
   }catch(e){setOnline(false); const cached=await getLocal("lastApps"); if(cached)setApps(cached);}
 };
 useEffect(()=>{refresh(); const on=()=>setOnline(navigator.onLine); window.addEventListener("online",on);window.addEventListener("offline",on);
  if("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(()=>{});
  return()=>{window.removeEventListener("online",on);window.removeEventListener("offline",on)};},[]);
 useEffect(()=>{if(apps.length)putLocal("lastApps",apps)},[apps]);
 useEffect(()=>{if(online)syncDrafts()},[online]);
 const filtered=useMemo(()=>apps.filter(a=>{
  const q=query.toLowerCase(); const match=(a.applicant+" "+a.id+" "+a.village).toLowerCase().includes(q);
  const f=filter==="ALL" || (filter==="OVERDUE"&&daysLeft(a.dueAt)<0&&a.stage!=="COMPLETED") || a.stage===filter;
  return match&&f;
 }).sort((a,b)=>priority(b)-priority(a)),[apps,query,filter]);
 function priority(a){return (daysLeft(a.dueAt)<0?8:0)+(a.returned?5:0)+(a.resubmitted?4:0)+(a.escalated?3:0)+(a.vulnerability?2:0)}
 function notify(msg){setToast(msg);setTimeout(()=>setToast(""),3000)}
 async function openApplication(id){
  try{const r=await fetch(`${API}/applications/${id}`);if(r.ok)setSelected(await r.json());}
  catch{setSelected(apps.find(x=>x.id===id)||null);}
 }
 async function syncDrafts(){
  const q=await getLocal("syncQueue")||[]; if(!q.length)return;
  try{await fetch(API+"/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:q})});await putLocal("syncQueue",[]);setSyncCount(0);refresh();}catch{}
 }
 async function saveVerification(id,payload){
  if(!navigator.onLine){const q=await getLocal("syncQueue")||[];q.push({localId:Date.now(),id,type:"verification",payload});await putLocal("syncQueue",q);setSyncCount(q.length);notify(t.savedOffline);return;}
  const r=await fetch(`${API}/applications/${id}/verification`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
  if(!r.ok){notify("Save failed");return;} notify("Saved");refresh();setSelected(await r.json());
 }
 async function createApplication(form){
  setCreating(true);
  try{
   const r=await fetch(API+"/applications",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
   const data=await r.json();
   if(!r.ok){notify(data.error||"దరఖాస్తు సృష్టించలేకపోయాం");return;}
   setShowCreate(false); await refresh(); setSelected(data); notify(lang==="te"?"కొత్త దరఖాస్తు విజయవంతంగా సృష్టించబడింది":"New application created successfully");
  }catch(e){notify(lang==="te"?"సర్వర్‌తో కనెక్షన్ లేదు":"Cannot connect to the server");}
  finally{setCreating(false);}
 }
 async function advance(id){
  const r=await fetch(`${API}/applications/${id}/advance`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({note:"పరిశీలన పూర్తయింది"})});
  const data=await r.json(); if(!r.ok){notify(data.error||"Cannot advance");return;}setSelected(data);refresh();
 }
 async function decide(id,body){
  const r=await fetch(`${API}/applications/${id}/decision`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const data=await r.json();if(!r.ok){notify(data.error||"Decision failed");return;}setSelected(data);refresh();notify("Decision saved");
 }
 const stageCards=[["DOCUMENTS",t.documents],["FIELD",t.field],["RI",t.ri],["TAHSILDAR",t.tahsildar],["COMPLETED",t.completed]];
 return <div className="app-shell">
  <header className="topbar"><div className="brand"><div className="brandmark">మి</div><div><strong>{t.brand}</strong><small>{t.sub}</small></div></div>
   <div className="top-actions"><span className={`network ${online?"on":"off"}`}><i/>{online?t.online:t.offline}</span><button className="lang" onClick={()=>setLang(lang==="te"?"en":"te")}>{lang==="te"?"English":"తెలుగు"}</button></div>
  </header>
  <main className="main">
   <div className="page-heading"><div><p className="eyebrow">TELANGANA • REVENUE DEPARTMENT</p><h1>{t.dashboard}</h1><p className="muted">{new Date().toLocaleDateString(lang==="te"?"te-IN":"en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p></div>
    <div className="heading-actions"><button className="primary small" onClick={()=>setShowCreate(true)}>{t.newApplication}</button><button className="secondary small" onClick={syncDrafts}>↻ {t.sync}{syncCount>0&&` (${syncCount})`}</button></div></div>
   <section className="stats">
    <Stat label={t.total} value={dash?.total??apps.length} icon="▤"/>
    <Stat label={t.pending} value={dash?.pending??apps.filter(a=>a.stage!=="COMPLETED").length} icon="◷"/>
    <Stat label={t.overdue} value={dash?.overdue??apps.filter(a=>daysLeft(a.dueAt)<0&&a.stage!=="COMPLETED").length} icon="⚑" alert/>
   </section>
   <div className="columns">
    <section className="panel list-panel">
     <div className="panel-head"><div><h2>{t.attention}</h2><p className="muted">{t.applications} · {filtered.length}</p></div><span className="count-pill">{filtered.length}</span></div>
     <input className="search" placeholder={t.search} value={query} onChange={e=>setQuery(e.target.value)}/>
     <div className="filters"><button className={filter==="ALL"?"active":""} onClick={()=>setFilter("ALL")}>{t.all}</button><button className={filter==="OVERDUE"?"active":""} onClick={()=>setFilter("OVERDUE")}>{t.overdue}</button>{stageCards.slice(0,4).map(([id,label])=><button key={id} className={filter===id?"active":""} onClick={()=>setFilter(id)}>{label}</button>)}</div>
     <div className="app-list">{filtered.map(a=><ApplicationCard key={a.id} a={a} t={t} lang={lang} active={selected?.id===a.id} onClick={()=>openApplication(a.id)}/>)}{!filtered.length&&<div className="empty">{t.noResults}</div>}</div>
    </section>
    <aside className="side-column">
     <section className="panel"><div className="panel-head"><h2>{t.stageCounts}</h2></div><div className="stage-counts">{stageCards.map(([id,label])=><div className="stage-row" key={id}><span>{label}</span><b>{dash?.counts?.[id]??apps.filter(a=>a.stage===id).length}</b></div>)}</div></section>
     <section className="panel"><div className="panel-head"><h2>📍 {t.visits}</h2><span className="count-pill">{dash?.visits?.length??apps.filter(a=>a.stage==="FIELD").length}</span></div>
      {(dash?.visits?.length?dash.visits:apps.filter(a=>a.stage==="FIELD").map(a=>({...a,visitDate:a.visitDate}))).slice(0,5).map(v=><div className="visit-row" key={v.id}><div className="visit-dot"/><div><b>{v.applicant}</b><small>{v.village} · {v.visitDate||"తేదీ నిర్ణయించాలి"}</small></div><button onClick={()=>openApplication(v.id)}>→</button></div>)}
      {!(dash?.visits?.length||apps.some(a=>a.stage==="FIELD"))&&<p className="muted">{t.noVisits}</p>}
     </section>
     <div className="offline-note"><span>◉</span><div><b>{lang==="te"?"నెట్ లేకపోయినా పని చేయండి":"Work through weak networks"}</b><p>{lang==="te"?"ముసాయిదాలు ఈ పరికరంలో భద్రంగా ఉంటాయి. కనెక్షన్ వచ్చినప్పుడు సింక్ చేయండి.":"Drafts stay on this device and sync when connected."}</p></div></div>
    </aside>
   </div>
   {selected&&<Detail a={selected} t={t} lang={lang} onClose={()=>setSelected(null)} onSave={saveVerification} onAdvance={advance} onDecision={decide} refresh={refresh}/>}
   {showCreate&&<NewApplicationModal lang={lang} t={t} busy={creating} onClose={()=>setShowCreate(false)} onSubmit={createApplication}/>}
  </main>
  {toast&&<div className="toast">{toast}</div>}
  <footer>DEMO PROTOTYPE · Not connected to Telangana government systems</footer>
 </div>
}
function NewApplicationModal({lang,t,busy,onClose,onSubmit}){
 const [form,setForm]=useState({applicant:"",village:"",mandal:"",income:"",phone:""});
 const [error,setError]=useState("");
 const update=(key,value)=>setForm(old=>({...old,[key]:value}));
 function submit(e){
  e.preventDefault(); setError("");
  if(!form.applicant.trim()||!form.village.trim()||!form.mandal.trim()||!form.phone.trim()||form.income===""){
   setError(lang==="te"?"అన్ని వివరాలు నమోదు చేయండి":"Please complete all fields"); return;
  }
  if(!/^\d{10}$/.test(form.phone.trim())){setError(lang==="te"?"మొబైల్ నంబర్ 10 అంకెలు ఉండాలి":"Enter a 10-digit mobile number");return;}
  if(!Number.isFinite(Number(form.income))||Number(form.income)<0){setError(lang==="te"?"సరైన వార్షిక ఆదాయం నమోదు చేయండి":"Enter a valid annual income");return;}
  onSubmit({...form,applicant:form.applicant.trim(),village:form.village.trim(),mandal:form.mandal.trim(),phone:form.phone.trim(),income:Number(form.income)});
 }
 const fields=[
  ["applicant",t.nameLabel,"ఉదా: రమ్య / e.g. Ramya","text"],
  ["village",t.villageLabel,"గ్రామం / Village","text"],
  ["mandal",t.mandalLabel,"మండలం / Mandal","text"],
  ["income",t.annualIncomeLabel,"ఉదా: 150000 / e.g. 150000","number"],
  ["phone",t.mobileLabel,"10 అంకెల మొబైల్ నంబర్","tel"]
 ];
 return <div className="create-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget&&!busy)onClose()}}>
  <form className="create-modal" onSubmit={submit}>
   <div className="create-head"><div><p className="eyebrow">MEESEVA MITRA</p><h2>{t.newAppTitle}</h2><p className="muted">కొత్త ఆదాయ ధృవీకరణ దరఖాస్తు / New income certificate record</p></div><button type="button" className="close" onClick={onClose} disabled={busy}>×</button></div>
   <div className="create-fields">{fields.map(([key,label,placeholder,type])=><label className="create-field" key={key}><span>{label} <i>*</i></span><input type={type} inputMode={type==="number"||type==="tel"?"numeric":undefined} min={type==="number"?"0":undefined} maxLength={type==="tel"?10:undefined} value={form[key]} placeholder={placeholder} onChange={e=>update(key,e.target.value)} required disabled={busy}/></label>)}</div>
   {error&&<p className="create-error" role="alert">{error}</p>}
   <p className="create-note">{lang==="te"?"సృష్టించిన తర్వాత దరఖాస్తు పత్రాల పరిశీలన దశలో కనిపిస్తుంది. ఇది డెమో డేటా కోసం మాత్రమే.":"The new record will appear in Document Scrutiny. Use fictional data for this demo."}</p>
   <div className="create-actions"><button type="button" className="secondary" onClick={onClose} disabled={busy}>{t.cancelCreate}</button><button type="submit" className="primary" disabled={busy}>{busy?t.creating:t.create}</button></div>
  </form>
 </div>
}
function Stat({label,value,icon,alert}){return <div className={`stat ${alert?"stat-alert":""}`}><span>{icon}</span><div><small>{label}</small><strong>{value}</strong></div></div>}
function ApplicationCard({a,t,lang,active,onClick}){
 const d=daysLeft(a.dueAt), overdue=d<0&&a.stage!=="COMPLETED";
 return <button className={`application ${active?"selected":""}`} onClick={onClick}>
  <div className="application-top"><b>{a.applicant}</b><span className={`sla ${overdue?"late":""}`}>{a.stage==="COMPLETED"?"✓":overdue?`${Math.abs(d)} ${t.overdueBy}`:`${d} ${t.days}`}</span></div>
  <div className="app-id">{a.id}</div><div className="app-meta"><span>⌖ {a.village}, {a.mandal}</span><span className="stage-tag">{stageName(a.stage,lang)}</span></div>
  <div className="flags">{overdue&&<em className="flag red">Overdue</em>}{a.returned&&<em className="flag orange">{t.returned}</em>}{a.resubmitted&&<em className="flag blue">{t.resubmitted}</em>}{a.escalated&&<em className="flag purple">{t.escalated}</em>}{a.vulnerability&&<em className="flag green">{a.vulnerability}</em>}</div>
 </button>
}
function Detail({a,t,lang,onClose,onSave,onAdvance,onDecision,refresh}){
 const [check,setCheck]=useState(a.verification?.checklist||[]),[remarks,setRemarks]=useState(a.verification?.remarks||""),[statement,setStatement]=useState(a.verification?.statement||""),[photo,setPhoto]=useState(a.verification?.photo||"");
 const [decision,setDecision]=useState(""),[reason,setReason]=useState(""),[missing,setMissing]=useState([]),[confirm,setConfirm]=useState(false);
 const [geoTag,setGeoTag]=useState(a.verification?.geoTag||null),[photoData,setPhotoData]=useState(a.verification?.photoData||"");
 const [aiOutcome,setAiOutcome]=useState(""),[aiEdited,setAiEdited]=useState("");
 const [aiText,setAiText]=useState("");
 const steps=["DOCUMENTS","FIELD","RI","TAHSILDAR","COMPLETED"], index=steps.indexOf(a.stage);
 const nextAction=a.stage==="DOCUMENTS"?t.reviewDocs:a.stage==="FIELD"?t.doVisit:a.stage==="RI"?t.reviewRI:a.stage==="TAHSILDAR"?t.makeDecision:t.completed;
 const inconsistencies=[];
 if(a.income>150000&&a.landAcres>2)inconsistencies.push(lang==="te"?"ఆదాయం మరియు భూమి వివరాలు మరోసారి పరిశీలించండి":"Income and landholding may need a second look");
 if(a.applicant.includes(" ")===false)inconsistencies.push(lang==="te"?"పేరు పత్రాలతో సరిపోల్చండి":"Verify name against source documents");
 const summary=lang==="te"?`${a.applicant} గారి ఆదాయ ధృవీకరణ దరఖాస్తు. వార్షిక ఆదాయం ${money(a.income)}. ${a.village}, ${a.mandal}. ${stageName(a.stage,lang)} దశలో ఉంది.`:`${a.applicant}'s income certificate application. Annual income ${money(a.income)}. Located in ${a.village}, ${a.mandal}. Currently at ${stageName(a.stage,lang)}.`;
 async function logAI(outcome){
  const text=aiEdited||aiText||summary;
  await fetch(`${API}/applications/${a.id}/ai-log`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({suggestion:summary,outcome,editedText:text})});
  setAiOutcome(outcome);refresh();
 }
 const checklistItems=[["address",t.house],["met",t.applicantMet],["income",t.incomeChecked],["neighbour",t.neighbour]];
 function captureLocation(){
  if(!navigator.geolocation){alert(lang==="te"?"ఈ పరికరంలో లొకేషన్ అందుబాటులో లేదు":"Location is unavailable on this device");return;}
  navigator.geolocation.getCurrentPosition(pos=>setGeoTag({latitude:pos.coords.latitude,longitude:pos.coords.longitude,accuracy:pos.coords.accuracy,capturedAt:new Date().toISOString()}),()=>alert(lang==="te"?"లొకేషన్ అనుమతి ఇవ్వండి":"Please allow location access"),{enableHighAccuracy:true,timeout:12000});
 }
 function readPhoto(file){
  if(!file)return;
  const reader=new FileReader();reader.onload=()=>setPhotoData(reader.result);reader.readAsDataURL(file);setPhoto(file.name);
 }
 const missingItems=["ఆదాయం రుజువు","రేషన్ కార్డు కాపీ","భూమి వివరాలు","పేరు సవరణ పత్రం"];
 const publicStatus=a.stage==="COMPLETED"?(a.decision==="APPROVE"?"ఆమోదించబడింది":"తిరస్కరించబడింది"):stageName(a.stage,lang)+"లో ఉంది";
 return <div className="modal-backdrop" onClick={onClose}><div className="detail-modal" onClick={e=>e.stopPropagation()}>
  <div className="detail-head"><div><p className="eyebrow">{a.id}</p><h2>{a.applicant}</h2><p className="muted">{a.village}, {a.mandal} · {a.phone}</p></div><button className="close" onClick={onClose}>×</button></div>
  <div className="detail-body">
   <div className="detail-grid"><Info label={t.age} value={a.age}/><Info label={t.income} value={money(a.income)}/><Info label={t.land} value={a.landAcres}/><Info label={t.purpose} value={a.purpose}/></div>
   <div className="sla-banner"><b>{t.next}: {nextAction}</b><span>{daysLeft(a.dueAt)<0?`${Math.abs(daysLeft(a.dueAt))} ${t.overdueBy}`:`${daysLeft(a.dueAt)} ${t.days}`}</span></div>
   <h3>{t.workflow}</h3><div className="workflow">{steps.map((s,i)=><div className={`workflow-step ${i<index?"done":i===index?"current":"locked"}`} key={s}><span>{i<index?"✓":i+1}</span><small>{stageName(s,lang)}</small></div>)}</div>
   <div className="section-block"><h3>{t.documentsLabel}</h3><div className="doc-chips">{(a.documents||[]).map(x=><span key={x}>▧ {x}</span>)}</div></div>
   <div className="ai-card"><div className="ai-head"><span>✦ {t.summary}</span><em>{t.aiDisclaimer}</em></div><p>{summary}</p><div className="ai-meta"><span>{t.confidence}: 82% · demo estimate</span><span>{t.reasoning}: {lang==="te"?"దరఖాస్తు ఫీల్డుల ఆధారంగా సారాంశం రూపొందించబడింది":"Generated from application fields"}</span></div>
    {inconsistencies.length>0&&<div className="warning-list"><b>{t.inconsistencies}</b>{inconsistencies.map(x=><p key={x}>⚠ {x}</p>)}</div>}
    <div className="ai-feedback"><span>{t.aiAction}</span><textarea value={aiEdited} onChange={e=>setAiEdited(e.target.value)} placeholder={summary}/><div><button onClick={()=>logAI("ACCEPTED")}>{t.accepted}</button><button onClick={()=>logAI("EDITED")}>{t.edited}</button><button onClick={()=>logAI("IGNORED")}>{t.ignored}</button></div>{aiOutcome&&<small>AI action logged: {aiOutcome}</small>}</div>
   </div>
   {a.stage==="DOCUMENTS"&&<div className="section-block"><h3>{t.docTitle}</h3><p className="muted">{lang==="te"?"జత చేసిన పత్రాలను అసలు వివరాలతో పోల్చండి. OCR/AI సూచనలను తప్పనిసరిగా ధృవీకరించండి.":"Compare attached documents with source details. Verify any OCR/AI extraction."}</p><button className="secondary" onClick={()=>setAiText(summary)}>{lang==="te"?"పత్రాల వివరాలు ముందుగా నింపండి (డెమో)":"Prefill from document (demo)"}</button><p className="tiny">{lang==="te"?"నిజమైన తెలుగు/ఇంగ్లీష్ OCR ఇంజిన్ ఇంకా కనెక్ట్ చేయలేదు.":"A real Telugu/English OCR engine is not connected yet."}</p><button className="primary" onClick={()=>onAdvance(a.id)}>{t.complete} →</button></div>}
   {a.stage==="FIELD"&&<div className="section-block"><h3>{t.fieldTitle} · {t.checklist}</h3><div className="checklist">{checklistItems.map(([id,label])=><label key={id}><input type="checkbox" checked={check.includes(id)} onChange={e=>setCheck(c=>e.target.checked?[...c,id]:c.filter(x=>x!==id))}/>{label}</label>)}</div><label className="field-label">{t.photo}<input type="file" accept="image/*" capture="environment" onChange={e=>readPhoto(e.target.files?.[0])}/></label><p className="tiny">{t.photoHint}</p>{photo&&<p className="tiny">📷 {photo} · {photoData?"image attached":""}</p>}
 <button className="secondary" type="button" onClick={captureLocation}>⌖ {lang==="te"?"ప్రస్తుత లొకేషన్ నమోదు":"Capture current location"}</button>{geoTag&&<p className="tiny">GPS: {geoTag.latitude.toFixed(5)}, {geoTag.longitude.toFixed(5)} · ±{Math.round(geoTag.accuracy)}m</p>}<label className="field-label">{t.statement}<textarea value={statement} onChange={e=>setStatement(e.target.value)} placeholder={lang==="te"?"వారు తెలిపిన వివరాలు...":"Statement details..."}/></label><label className="field-label">{t.remarks}<textarea value={remarks} onChange={e=>setRemarks(e.target.value)}/></label>
 <button className="secondary" type="button" onClick={()=>setRemarks((lang==="te"?"AI ముసాయిదా — ధృవీకరించండి: ":"AI draft — verify before use: ")+summary+" "+(inconsistencies.join("; ")))}>✦ {lang==="te"?"AI గమనిక ముసాయిదా":"Draft AI remarks"}</button>
 <button className="primary" onClick={()=>onSave(a.id,{checklist:check,remarks,statement,photo,photoData,geoTag,timestamp:new Date().toISOString()})}>{t.save}</button><button className="secondary" disabled={check.length<4} onClick={()=>onAdvance(a.id)}>{t.complete} →</button></div>}
   {a.stage==="RI"&&<div className="section-block"><h3>{t.ri}</h3><p>{lang==="te"?"VRO పరిశీలన, పత్రాలు, గమనికలను తిరిగి పరిశీలించి తదుపరి దశకు పంపండి.":"Review VRO findings, documents and remarks before forwarding."}</p><button className="primary" onClick={()=>onAdvance(a.id)}>{t.complete} →</button></div>}
   {a.stage==="TAHSILDAR"&&<div className="section-block"><h3>{t.decisionTitle}</h3><div className="decision-buttons"><button className="approve" onClick={()=>{setDecision("APPROVE");setConfirm(true)}}>{t.approve}</button><button className="return" onClick={()=>{setDecision("RETURN");setConfirm(true)}}>{t.return}</button><button className="reject" onClick={()=>{setDecision("REJECT");setConfirm(true)}}>{t.reject}</button></div>{confirm&&<div className="confirm-box"><b>{decision==="APPROVE"?t.approve:decision==="RETURN"?t.return:t.reject} — {t.confirm}?</b>{decision!=="APPROVE"&&<label className="field-label">{t.reason}<textarea value={reason} onChange={e=>setReason(e.target.value)}/></label>}{decision==="RETURN"&&<div className="checklist">{missingItems.map(x=><label key={x}><input type="checkbox" checked={missing.includes(x)} onChange={e=>setMissing(m=>e.target.checked?[...m,x]:m.filter(y=>y!==x))}/>{x}</label>)}</div>}<div className="confirm-actions"><button className="secondary" onClick={()=>setConfirm(false)}>{t.cancel}</button><button className="primary" onClick={()=>onDecision(a.id,{decision,reason,missing})}>{t.confirm}</button></div></div>}</div>}
   <div className="section-block"><h3>{t.status}</h3><p className="status-public">{publicStatus}</p><h3>{t.notification}</h3><div className="message-preview">మీ ఆదాయ ధృవీకరణ దరఖాస్తు {a.id} ప్రస్తుతం {publicStatus}. వివరాలకు మీ సేవా కేంద్రాన్ని సంప్రదించండి.</div></div>
   <div className="section-block"><h3>{t.history}</h3><div className="timeline">{(a.events||[]).map(ev=><div className="event" key={ev.id}><span className="event-dot"/><div><b>{ev.action}</b><small>{ev.actor} · {new Date(ev.createdAt).toLocaleString(lang==="te"?"te-IN":"en-IN")}</small>{ev.note&&<p>{ev.note}</p>}</div></div>)}</div></div>
  </div>
  <div className="detail-foot"><span className="tiny">Append-only activity log · Demo environment</span><button className="secondary" onClick={onClose}>{t.close}</button></div>
 </div></div>
}
function Info({label,value}){return <div className="info"><small>{label}</small><b>{value}</b></div>}
const DB_NAME="meeseva-mitra-local";
function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>r.result.createObjectStore("kv");r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function putLocal(k,v){try{const db=await openDB();return new Promise(res=>{const tx=db.transaction("kv","readwrite");tx.objectStore("kv").put(v,k);tx.oncomplete=()=>res(true)})}catch{return false}}
async function getLocal(k){try{const db=await openDB();return new Promise(res=>{const r=db.transaction("kv").objectStore("kv").get(k);r.onsuccess=()=>res(r.result);r.onerror=()=>res(null)})}catch{return null}}
createRoot(document.getElementById("root")).render(<App/>);
