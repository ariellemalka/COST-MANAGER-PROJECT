# COST-MANAGER-PROJECT

Cost Manager RESTful Web Services — **four separate Node.js processes** for the Asynchronous Server-Side Development course.

## Architecture

| Variable | Service | Port (local) | Endpoints |
|----------|---------|--------------|-----------|
| **a** | `logs-service` | 3001 | `GET /api/logs` |
| **b** | `users-service` | 3002 | `GET /api/users`, `GET /api/users/:id`, `POST /api/add` |
| **c** | `costs-service` | 3003 | `POST /api/add`, `GET /api/report` |
| **d** | `about-service` | 3004 | `GET /api/about/` |

Stack: **Express.js**, **Mongoose**, **Pino**, **JavaScript** (no TypeScript), **MongoDB**.

## Local development

```bash
npm run install:all
npm run start:mongo          # terminal 1 — writes .mongo-uri
npm run seed                 # terminal 2 — user 123123 (mosh israeli)
npm run start:all            # terminal 3 — all four services
```

Health checks: `curl http://127.0.0.1:3001/health` (and 3002–3004).

## Lecturer integration test

```bash
pip install requests
echo output.txt | python3 test_project.py
```

Set `a`–`d` in `test_project.py` to your Render URLs when deployed.

## Tests

```bash
npm test
```

## Environment variables

Copy `.env.example` to `.env`:

- `MONGODB_URI` — MongoDB Atlas connection string
- `TEAM_MEMBERS` — JSON array for `/api/about` (not stored in DB)
- `LOGS_PORT`, `USERS_PORT`, `COSTS_PORT`, `ABOUT_PORT`

## Render deployment

Deploy **four separate Web Services**, one per folder under `services/`. Each needs:

- **Root directory**: `services/logs-service` (etc.)
- **Build**: `npm install`
- **Start**: `node app.js`
- **Env**: `MONGODB_URI`, `PORT` (Render sets PORT), `TEAM_MEMBERS` for about-service only

Use the same Atlas database for all four services.

## Submission user

For grading, the database should contain only user `123123` (mosh israeli). Run `npm run seed` on a clean database before submission.
