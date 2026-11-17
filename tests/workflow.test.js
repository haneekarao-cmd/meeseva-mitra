import test from "node:test";
import assert from "node:assert/strict";
import { app } from "../server/index.js";

 test("income certificate workflow enforces field checklist and records decisions", async (t) => {
  const server = app.listen(0);
  await new Promise(resolve => server.once("listening", resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}/api`;
  const request = async (path, options={}) => {
    const response = await fetch(base + path, { ...options, headers: { "content-type":"application/json", ...(options.headers||{}) } });
    const body = await response.json();
    return { response, body };
  };
  const health = await request("/health");
  assert.equal(health.body.ok, true);

  const created = await request("/applications", { method:"POST", body:JSON.stringify({ applicant:"Test Applicant", village:"Test Village", mandal:"Test Mandal", phone:"9000000001", income:120000 }) });
  assert.equal(created.response.status, 201);
  const id = created.body.id;
  assert.match(id, /^INC-\d{4}-\d{6}$/);

  const toField = await request(`/applications/${id}/advance`, { method:"POST", body:JSON.stringify({note:"Documents checked"}) });
  assert.equal(toField.body.stage, "FIELD");
  const blocked = await request(`/applications/${id}/advance`, { method:"POST", body:JSON.stringify({}) });
  assert.equal(blocked.response.status, 400);

  const saved = await request(`/applications/${id}/verification`, { method:"POST", body:JSON.stringify({ checklist:["address","met","income","neighbour"], remarks:"Test verification", statement:"Test statement", timestamp:new Date().toISOString() }) });
  assert.equal(saved.response.status, 200);
  const toRI = await request(`/applications/${id}/advance`, { method:"POST", body:JSON.stringify({}) });
  assert.equal(toRI.body.stage, "RI");
  const toTahsildar = await request(`/applications/${id}/advance`, { method:"POST", body:JSON.stringify({}) });
  assert.equal(toTahsildar.body.stage, "TAHSILDAR");

  const noReason = await request(`/applications/${id}/decision`, { method:"POST", body:JSON.stringify({decision:"REJECT", reason:""}) });
  assert.equal(noReason.response.status, 400);
  const decision = await request(`/applications/${id}/decision`, { method:"POST", body:JSON.stringify({decision:"REJECT", reason:"Test-only rejection reason"}) });
  assert.equal(decision.body.stage, "COMPLETED");
  assert.equal(decision.body.decision, "REJECT");
  assert.ok(decision.body.events.length >= 5);
 });
