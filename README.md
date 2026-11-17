# MeeSeva Mitra — Professional Local Prototype

Telugu-first, English-toggle workflow application for the requested Telangana Income Certificate process: document scrutiny → VRO field verification → RI review → Tahsildar decision.

## What is included

- Responsive React dashboard with search, stage filters, SLA countdowns, priority flags, stage totals and field-visit list.
- Create new income-certificate applications; records are stored in local SQLite and receive unique application IDs.
- Application detail view with workflow progress, applicant-facing status, notification preview and chronological activity history.
- Field verification checklist, browser location permission, photo attachment and remarks.
- Separate Approve / Return / Reject actions; return/reject require a reason and return requires selected missing items.
- Advisory AI-style summaries and rule-based inconsistency hints. AI suggestions can be logged as accepted, edited or ignored. These are demo rules, not a connected AI model.
- IndexedDB local cache and a basic offline queue for field-verification drafts; reconnect and use Sync.
- SQLite persistence, API validation, health endpoint and summary-report endpoint.
- Node test suite covering create → field checklist gate → RI → Tahsildar decision.

## Requirements

- Windows 10/11
- Node.js 26.13.1 (the project uses Node's built-in `node:sqlite`; no native SQLite addon or Visual Studio C++ tools required)
- Internet for the first dependency installation

## Start on Windows

1. Extract the ZIP.
2. Open the inner `meeseva-mitra` folder in VS Code (the folder containing `package.json`).
3. Open Terminal → New Terminal.
4. Run `npm.cmd install` once.
5. Run `npm.cmd run dev`.
6. Open <http://localhost:5173/>.

Keep the terminal open while using the app. Frontend: port 5173. API: port 3001. API health check: <http://localhost:3001/api/health>.

Optional: double-click `start-windows.bat` from the project folder; it checks Node/npm, installs dependencies if needed, and starts both servers.

## Tests and production build

After dependencies are installed:

```powershell
npm.cmd test
npm.cmd run build
```

Or run both with `npm.cmd run check`.

The test suite uses a real local SQLite database and creates a clearly named test record. You can remove that test record from the local database only by resetting the demo database (see below); do not run tests against real citizen data.

## Local database and reset

The database is created at `data/meeseva-mitra.sqlite`. Back up this file before replacing or resetting the project. To reset the demo data, stop the app, back up and delete this database file, then restart the app; the five fictional sample records will be seeded again.

## Important deployment boundary

This is a local demonstration / pilot prototype, **not an official Telangana government application and not approved for live citizen records**. It is not connected to MeeSeva, Aadhaar, land records, government identity systems, official messaging gateways or departmental servers. Sample applicants are fictional. Do not enter real citizen personal data.

Before any real deployment, the department must validate the current service rules and SLA, approve the workflow and role matrix, and commission security/privacy review, authentication and authorization, encrypted evidence storage, tamper-evident audit controls, retention/backups, accessibility review, operational monitoring and approved government integrations. The current app has no production authentication. The AI panel is illustrative; OCR and a real AI service are not integrated. Browser location and photo evidence are demo capabilities and require production-grade secure storage and consent handling.

## Project layout

```text
meeseva-mitra/
  public/       PWA service worker
  server/       Express API + built-in SQLite database
  src/          React UI and styles
  tests/        workflow integration test
  data/         local SQLite file (created automatically)
  package.json
  start-windows.bat
```
