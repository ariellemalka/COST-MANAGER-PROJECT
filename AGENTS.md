# AGENTS.md

Guidance for AI agents working in this repository.

## Project overview

**Cost Manager** is intended to be a RESTful web services system with **four separate processes**, per `README.md`. It is the final project for an Asynchronous Server-Side Development course.

## Current repository state

As of the initial commit, the repo contains **only** `README.md`. There is no application source, dependency manifest, Docker setup, or documented run/lint/test commands yet.

When implementation is added, update this file with concrete service names, ports, and commands.

## Expected direction (not yet in repo)

Similar course projects for this topic typically use **Node.js** with **Express**, **MongoDB** (often via Mongoose), and multiple entrypoint files or services. The README calls for **four processes**—often split by concern (e.g. users, costs, reports, logging/analytics). Confirm against course materials once code lands.

## Cursor Cloud specific instructions

- **VM runtimes:** Node.js (v22 via nvm) and Python 3.12 are available on the cloud VM. No project-specific dependencies are installed until `package.json` (or equivalent) exists.
- **Update script:** On startup, dependency refresh runs only when `package-lock.json` or `package.json` is present (see `.cursor` / SetupVmEnvironment). With only `README.md`, the update step is a no-op.
- **Services:** Nothing to start until service entrypoints and docs are committed. Do not assume ports or process names.
- **MongoDB:** If the implementation uses MongoDB, you will likely need a running MongoDB instance (local `mongod`, Docker, or a cloud URI in secrets). That is not configured in this stub repo.
- **Lint / test / build:** No scripts exist yet. After `package.json` is added, check `scripts` for `lint`, `test`, `start`, and any multi-process dev commands (e.g. `concurrently`, separate `node` apps, or `docker compose`).
- **Hello-world / E2E:** Requires implemented APIs and (usually) a database. Until then, verify tooling with `node -v` and `npm -v`, then follow README or course instructions once code is pushed.
