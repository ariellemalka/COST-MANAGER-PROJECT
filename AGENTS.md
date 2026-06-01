# AGENTS.md

## Cursor Cloud specific instructions

### Services (four processes)

| Service | Directory | Default port |
|---------|-----------|--------------|
| Logs | `services/logs-service` | 3001 |
| Users | `services/users-service` | 3002 |
| Costs | `services/costs-service` | 3003 |
| About | `services/about-service` | 3004 |

### Startup (local)

1. `npm run start:mongo` — in-memory MongoDB; writes URI to `.mongo-uri`
2. `npm run seed` — creates user `123123`
3. `npm run start:all` — starts all four services (reads `.mongo-uri`)

See `README.md` for Render/Atlas deployment.

### Commands

| Task | Command |
|------|---------|
| Install deps | `npm run install:all` |
| Unit tests | `npm test` |
| Lecturer script | `echo output.txt \| python3 test_project.py` |
| Health | `curl localhost:3001/health` … `3004/health` |

### Gotchas

- **Four processes required** — not one Express app with four route groups.
- **`POST /api/add`** exists on both users-service and costs-service (different hosts).
- Report JSON uses **`Sport`** (capital S) for the sports category bucket.
- Error responses must use specific `message` strings (e.g. `cost cannot be negative number`).
- Do **not** change lecturer `test_project.py` logic; only update base URLs `a`–`d` for deployment.
- `models/` folder in each service holds Mongoose schemas (course requirement).
