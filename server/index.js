import express from "express";
import { randomInt } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "8mb" }));
const PORT = Number(process.env.PORT || 3001);
const stages = ["DOCUMENTS", "FIELD", "RI", "TAHSILDAR", "COMPLETED"];

function getApp(id) {
  const row = db.prepare("SELECT * FROM applications WHERE id=?").get(id);
  if (!row) return null;
  return { ...row, documents: JSON.parse(row.documents || "[]"),
    verification: JSON.parse(row.verification || "{}"),
    events: db.prepare("SELECT * FROM events WHERE appId=? ORDER BY id DESC").all(id),
    aiLogs: db.prepare("SELECT * FROM ai_logs WHERE appId=? ORDER BY id DESC").all(id) };
}
function addEvent(id, actor, action, note="", meta={}) {
  db.prepare("INSERT INTO events(appId,actor,action,note,createdAt,meta) VALUES(?,?,?,?,?,?)")
    .run(id, actor, action, note, new Date().toISOString(), JSON.stringify(meta));
}
app.get("/api/health", (req,res)=>res.json({ok:true, service:"MeeSeva Mitra API"}));
app.post("/api/applications", (req,res)=>{
  const body=req.body||{};
  const applicant=String(body.applicant||"").trim();
  const village=String(body.village||"").trim();
  const mandal=String(body.mandal||"").trim();
  const phone=String(body.phone||"").trim();
  const income=Number(body.income);
  if(!applicant||!village||!mandal||!phone||!Number.isFinite(income)||income<0)
    return res.status(400).json({error:"పేరు, గ్రామం, మండలం, మొబైల్ నంబర్, సరైన వార్షిక ఆదాయం నమోదు చేయండి"});
  if(!/^\d{10}$/.test(phone))
    return res.status(400).json({error:"మొబైల్ నంబర్ 10 అంకెలు ఉండాలి"});
  const year=new Date().getFullYear();
  let id;
  do { id = `INC-${year}-${String(randomInt(0, 1000000)).padStart(6, "0")}`; } while (db.prepare("SELECT 1 FROM applications WHERE id=?").get(id));
  const submittedAt=new Date().toISOString();
  const dueAt=new Date(Date.now()+7*86400000).toISOString();
  db.prepare(`INSERT INTO applications
    (id,applicant,relation,age,village,mandal,phone,income,landAcres,stage,submittedAt,dueAt,vulnerability,returned,resubmitted,escalated,visitDate,purpose,notes,documents,verification,decision)
    VALUES(?,?,?, ?,?,?,?, ?,0,'DOCUMENTS',?,?, '',0,0,0,'','ఆదాయ ధృవీకరణ పత్రం','', '[]','{}','')`)
    .run(id,applicant,"",null,village,mandal,phone,Math.round(income),submittedAt,dueAt);
  addEvent(id,"MeeSeva కేంద్రం","కొత్త దరఖాస్తు స్వీకరించారు","కొత్త ఆదాయ ధృవీకరణ దరఖాస్తు నమోదు అయింది",{stage:"DOCUMENTS"});
  res.status(201).json(getApp(id));
});
app.get("/api/applications", (req,res)=>{
  const rows = db.prepare("SELECT * FROM applications ORDER BY dueAt ASC").all();
  res.json(rows.map(r=>({...r,documents:JSON.parse(r.documents||"[]"), verification:JSON.parse(r.verification||"{}")})));
});
app.get("/api/applications/:id", (req,res)=>{
  const row=getApp(req.params.id); if(!row) return res.status(404).json({error:"Application not found"});
  res.json(row);
});
app.get("/api/dashboard", (req,res)=>{
  const rows=db.prepare("SELECT * FROM applications").all();
  const counts={DOCUMENTS:0,FIELD:0,RI:0,TAHSILDAR:0,COMPLETED:0};
  rows.forEach(r=>counts[r.stage]=(counts[r.stage]||0)+1);
  const today=new Date().toISOString().slice(0,10);
  const visits=rows.filter(r=>r.visitDate===today || (r.stage==="FIELD" && r.visitDate>=today))
    .map(r=>({id:r.id,applicant:r.applicant,village:r.village,visitDate:r.visitDate,stage:r.stage}));
  res.json({total:rows.length,pending:rows.filter(r=>r.stage!=="COMPLETED").length,overdue:rows.filter(r=>new Date(r.dueAt)<new Date()&&r.stage!=="COMPLETED").length,counts,visits});
});
app.post("/api/applications/:id/verification", (req,res)=>{
  const a=getApp(req.params.id); if(!a) return res.status(404).json({error:"Not found"});
  if(a.stage!=="FIELD") return res.status(409).json({error:"Field verification is not the current step"});
  const body=req.body||{};
  const verification={...a.verification,...body, savedAt:new Date().toISOString()};
  db.prepare("UPDATE applications SET verification=?, notes=? WHERE id=?").run(JSON.stringify(verification),body.remarks||a.notes,a.id);
  addEvent(a.id,"VRO","క్షేత్ర పరిశీలన నమోదు",body.remarks||"పరిశీలన వివరాలు నమోదు చేశారు",{checklist:body.checklist||[]});
  res.json(getApp(a.id));
});
app.post("/api/applications/:id/advance", (req,res)=>{
  const a=getApp(req.params.id); if(!a) return res.status(404).json({error:"Not found"});
  const next=stages[stages.indexOf(a.stage)+1];
  if(!next || a.stage==="COMPLETED") return res.status(409).json({error:"No next stage"});
  if(a.stage==="FIELD" && (!a.verification?.checklist || !["address","met","income","neighbour"].every(x=>a.verification.checklist.includes(x))))
    return res.status(400).json({error:"ముందుగా క్షేత్ర పరిశీలన చెక్‌లిస్ట్‌లో అన్ని అంశాలు పూర్తి చేయండి"});
  const actor=a.stage==="DOCUMENTS"?"VRO":a.stage==="FIELD"?"VRO":a.stage==="RI"?"RI":"Tahsildar";
  db.prepare("UPDATE applications SET stage=? WHERE id=?").run(next,a.id);
  addEvent(a.id,actor,"తదుపరి దశకు పంపారు",req.body?.note||`${a.stage} → ${next}`);
  res.json(getApp(a.id));
});
app.post("/api/applications/:id/decision", (req,res)=>{
  const a=getApp(req.params.id); if(!a) return res.status(404).json({error:"Not found"});
  if(a.stage!=="TAHSILDAR") return res.status(409).json({error:"Tahsildar decision stage మాత్రమే"});
  const {decision,reason,missing=[]}=req.body||{};
  if(!["APPROVE","REJECT","RETURN"].includes(decision)) return res.status(400).json({error:"Invalid decision"});
  if(decision!=="APPROVE" && !String(reason||"").trim()) return res.status(400).json({error:"కారణం తప్పనిసరి"});
  if(decision==="RETURN" && !missing.length) return res.status(400).json({error:"ఏ పత్రం/వివరం కావాలో ఎంచుకోండి"});
  const label={APPROVE:"ఆమోదించారు",REJECT:"తిరస్కరించారు",RETURN:"సవరణ కోసం తిరిగి పంపారు"}[decision];
  const stage=decision==="APPROVE"?"COMPLETED":decision==="RETURN"?"DOCUMENTS":"COMPLETED";
  db.prepare("UPDATE applications SET stage=?,decision=?,notes=?,returned=?,resubmitted=? WHERE id=?")
    .run(stage,decision,reason||"",decision==="RETURN"?1:a.returned,decision==="RETURN"?0:a.resubmitted,a.id);
  addEvent(a.id,"Tahsildar",label,reason||"ఆమోదం ఇచ్చారు",{decision,missing});
  res.json(getApp(a.id));
});
app.post("/api/applications/:id/ai-log", (req,res)=>{
  const {suggestion,outcome,editedText=""}=req.body||{};
  if(!suggestion||!["ACCEPTED","EDITED","IGNORED"].includes(outcome)) return res.status(400).json({error:"Invalid AI log"});
  db.prepare("INSERT INTO ai_logs(appId,suggestion,outcome,editedText,createdAt) VALUES(?,?,?,?,?)")
    .run(req.params.id,suggestion,outcome,editedText,new Date().toISOString());
  addEvent(req.params.id,"AI సహాయకుడు",`AI సూచన ${outcome==="ACCEPTED"?"అంగీకరించారు":outcome==="EDITED"?"మార్చారు":"పట్టించుకోలేదు"}`,suggestion,{outcome,editedText});
  res.json({ok:true});
});
app.post("/api/sync", (req,res)=>{
  const items=req.body?.items||[], results=[];
  for(const item of items){
    try {
      if(item.type==="verification"){
        const a=getApp(item.id);
        if(a?.stage==="FIELD"){
          const v={...a.verification,...item.payload, syncedAt:new Date().toISOString()};
          db.prepare("UPDATE applications SET verification=? WHERE id=?").run(JSON.stringify(v),a.id);
          addEvent(a.id,"VRO","ఆఫ్‌లైన్ వివరాలు సింక్ అయ్యాయి","ఫీల్డ్ వివరాలు సర్వర్‌కు చేరాయి");
        }
      }
      results.push({id:item.localId,ok:true});
    } catch(e){ results.push({id:item.localId,ok:false,error:e.message}); }
  }
  res.json({results});
});
// Lightweight reporting endpoint for local officer reviews.
app.get("/api/reports/summary", (req,res)=>{
  const rows=db.prepare("SELECT stage, COUNT(*) AS count FROM applications GROUP BY stage").all();
  const byStage={DOCUMENTS:0,FIELD:0,RI:0,TAHSILDAR:0,COMPLETED:0};
  rows.forEach(r=>byStage[r.stage]=r.count);
  const overdue=db.prepare("SELECT COUNT(*) AS count FROM applications WHERE stage!='COMPLETED' AND dueAt < ?").get(new Date().toISOString()).count;
  res.json({generatedAt:new Date().toISOString(),total:Object.values(byStage).reduce((a,b)=>a+b,0),byStage,overdue});
});
 
const frontendPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../dist"
);

app.use(express.static(frontendPath));

app.get(/^\/(?!api(?:\/|$)).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.use((err,req,res,next)=>{
  console.error("API error:", err);
  if (res.headersSent) return next(err);
  res.status(500).json({error:"Internal server error"});
});

export { app };
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) app.listen(PORT,()=>console.log(`MeeSeva Mitra API running at http://localhost:${PORT}`));
