import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(here, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new DatabaseSync(path.join(dataDir, "meeseva-mitra.sqlite"));
db.exec("PRAGMA journal_mode = WAL;");

db.exec(`
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY, applicant TEXT NOT NULL, relation TEXT, age INTEGER,
  village TEXT, mandal TEXT, phone TEXT, income INTEGER, landAcres REAL,
  stage TEXT NOT NULL, submittedAt TEXT NOT NULL, dueAt TEXT NOT NULL,
  vulnerability TEXT, returned INTEGER DEFAULT 0, resubmitted INTEGER DEFAULT 0,
  escalated INTEGER DEFAULT 0, visitDate TEXT, purpose TEXT, notes TEXT DEFAULT '',
  documents TEXT DEFAULT '[]', verification TEXT DEFAULT '{}', decision TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT, appId TEXT NOT NULL,
  actor TEXT NOT NULL, action TEXT NOT NULL, note TEXT DEFAULT '',
  createdAt TEXT NOT NULL, meta TEXT DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS ai_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT, appId TEXT NOT NULL,
  suggestion TEXT NOT NULL, outcome TEXT NOT NULL, editedText TEXT DEFAULT '',
  createdAt TEXT NOT NULL
);
`);

const count = db.prepare("SELECT COUNT(*) AS n FROM applications").get().n;
if (!count) {
  const now = new Date();
  const ago = n => new Date(now.getTime() - n * 86400000).toISOString();
  const due = n => new Date(now.getTime() + n * 86400000).toISOString();
  const seed = [
    ["INC-2026-1042","లక్ష్మి","భర్త: రమేష్",62,"గుండ్లపోచంపల్లి","మేడ్చల్", "98XXXX1204",84000,0.5,"DOCUMENTS",ago(5),due(2),"వృద్ధురాలు",0,0,0,"2026-11-18","విద్యా ఫీజు","",["ఆధార్ కార్డు","రేషన్ కార్డు","ఆదాయం రుజువు"]],
    ["INC-2026-1043","రాజు","తండ్రి: మల్లయ్య",34,"దుండిగల్","కుత్బుల్లాపూర్","97XXXX4410",145000,2.0,"FIELD",ago(8),ago(1),"",1,0,0,"2026-11-17","స్కాలర్‌షిప్","ఆదాయం రుజువు స్పష్టంగా లేదు",["ఆధార్ కార్డు","రేషన్ కార్డు"]],
    ["INC-2026-1044","సరోజ","భర్త: స్వర్గీయ శంకర్",51,"బహదూర్‌పల్లి","కుత్బుల్లాపూర్","99XXXX8821",62000,0,"RI",ago(3),due(1),"వితంతువు",0,1,0,"2026-11-19","ప్రభుత్వ పథకం","",["ఆధార్ కార్డు","వితంతు ధృవీకరణ"]],
    ["INC-2026-1045","మహేష్","తండ్రి: నర్సింహ",27,"జీడిమెట్ల","కుత్బుల్లాపూర్","90XXXX1320",210000,3.5,"TAHSILDAR",ago(10),ago(3),"",0,0,1,"2026-11-16","ఫీజు రీయింబర్స్‌మెంట్","",["ఆధార్ కార్డు","పే స్లిప్","భూమి వివరాలు"]],
    ["INC-2026-1046","అనిత","భర్త: కిషోర్",39,"మల్లంపేట్","దుండిగల్","91XXXX7702",98000,0.25,"DOCUMENTS",ago(1),due(5),"దివ్యాంగురాలు",0,0,0,"2026-11-20","విద్యా ఫీజు","",["ఆధార్ కార్డు","రేషన్ కార్డు"]]
  ];
  const insert = db.prepare(`INSERT INTO applications
  (id,applicant,relation,age,village,mandal,phone,income,landAcres,stage,submittedAt,dueAt,vulnerability,returned,resubmitted,escalated,visitDate,purpose,notes,documents)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
  // Use explicit SQL transaction: DatabaseSync in Node.js does not expose
  // the better-sqlite3 transaction() helper.
  db.exec("BEGIN");
  try {
    for (const r of seed) {
      insert.run(...r.slice(0, 19), JSON.stringify(r[19]));
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  const event = db.prepare("INSERT INTO events(appId,actor,action,note,createdAt,meta) VALUES(?,?,?,?,?,?)");
  seed.forEach((r,i) => event.run(r[0],"MeeSeva కేంద్రం","దరఖాస్తు స్వీకరించారు","దరఖాస్తు నమోదు అయింది",ago(10-i*2),"{}"));
  event.run("INC-2026-1043","VRO","తిరిగి పంపారు","ఆదాయం రుజువు స్పష్టంగా లేదు",ago(2),"{}");
}
export default db;
