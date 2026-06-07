# Fullstack template

> Generated via [`npx create-genesis`](https://www.npmjs.com/package/create-genesis). Generator repo: [github.com/Shrenik0321/genesis](https://github.com/Shrenik0321/genesis).

NestJS API + Next.js frontend + Postgres. **Backend and frontend are separate apps** in [`backend/`](backend/) and [`frontend/`](frontend/).

| Workflow                | Backend                        | Frontend                 | Database                                                                             |
| ----------------------- | ------------------------------ | ------------------------ | ------------------------------------------------------------------------------------ |
| **Development** (daily) | `npm run start:dev` on your PC | `npm run dev` on your PC | Docker (`db` + one-shot migrate/seed via [`docker-compose.yml`](docker-compose.yml)) |
| **Production preview**  | Docker image (`api`)           | Docker image (`web`)     | Docker (`db` in [`docker-compose.prod.yml`](docker-compose.prod.yml))                |
| **Production deploy**   | Container / PaaS               | Container / PaaS         | Managed Postgres (typical)                                                           |

Dockerfiles: [`backend/Dockerfile`](backend/Dockerfile), [`frontend/Dockerfile`](frontend/Dockerfile).

- **Dev database:** [`docker-compose.yml`](docker-compose.yml)
- **Production preview (all services):** [`docker-compose.prod.yml`](docker-compose.prod.yml)

## Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for Postgres locally, and for production preview)

## Local development (default)

Use this when editing code. You get hot reload (HMR / watch) without rebuilding images.

**Do not** run production preview (`docker-compose.prod.yml`) while local `npm run start:dev` / `npm run dev` are running — that binds the same ports (`5432`, `8000`, `3000`).

### 1. Start Postgres and bootstrap schema (Docker)

From this directory (`templates/fullstack/`):

```bash
docker compose up -d --build
```

This starts Postgres and runs a **one-shot `bootstrap` container** that applies migrations and seeds demo users. It is safe to re-run: pending migrations apply only once, and seeds skip if the `user` table already has rows.

Or from [`backend/`](backend/): `npm run db:up` (add `--build` after backend or migration changes).

Postgres: `localhost:5432` — user `postgres`, password `postgres`, database `genesis`.

Check bootstrap logs: `docker compose logs bootstrap`

### 2. Backend (your machine)

```bash
cd backend
cp .env.example .env   # Windows: copy .env.example .env
npm install
npm run start:dev
```

- API: http://localhost:8000/api
- OpenAPI (Swagger UI): http://localhost:8000/docs (dev only; set `SWAGGER_ENABLED=false` to disable)
- `.env` uses `DATABASE_HOST=localhost` to reach the Docker database.
- Schema and demo users are created by Docker bootstrap (step 1). After adding new migrations locally, run `npm run migrate` or `docker compose up -d --build`.
- `RUN_SEEDS=false` in `.env` prevents duplicate seed attempts when starting the API locally (seeds already ran in bootstrap).

### 3. Frontend (your machine)

```bash
cd frontend
cp .env.local.example .env.local   # Windows: copy .env.local.example .env.local
npm install
npm run dev
```

- App: http://localhost:3000
- `.env.local` sets `NEXT_PUBLIC_API_URL` (proxied to Nest via `next.config` rewrites).

### Authentication (Better Auth + hybrid JWT)

See [backend/docs/AUTH.md](backend/docs/AUTH.md) for account linking, Google OAuth setup, and table roles.

Email sign-up and sign-in use [Better Auth](https://www.better-auth.com/) on the server. The browser uses `/api/auth/*` for email/password and `/api/oauth/*` for Google. **App API** routes use `/api/*` with a hybrid token model:

| Token      | Cookie         | Lifetime                              | Server                                                           |
| ---------- | -------------- | ------------------------------------- | ---------------------------------------------------------------- |
| Access JWT | `authToken`    | Short (`JWT_ACCESS_TTL`, default 15m) | Verified by signature                                            |
| Refresh    | `refreshToken` | Long (`JWT_REFRESH_TTL`, default 7d)  | SHA-256 hash in `refresh_session` table; rotated on each refresh |

- **Login / register:** `POST /api/auth/login`, `POST /api/auth/register` (sets both cookies).
- **Google:** `GET /api/oauth/google?callbackURL=…` (redirect flow; same cookies after callback).
- **Refresh:** `POST /api/auth/refresh` (rotates refresh token; called automatically by the frontend on 401).
- **Logout:** `POST /api/auth/logout` (revokes refresh row + clears cookies).

1. Set `BETTER_AUTH_SECRET` and `JWT_ACCESS_SECRET` in `backend/.env` (32+ chars). Example: `openssl rand -base64 32`
2. Set `BETTER_AUTH_URL=http://localhost:3000`, `CORS_ORIGIN=http://localhost:3000` (public app URL, not the Nest port), optional `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`, and optional `JWT_ACCESS_TTL` / `JWT_REFRESH_TTL` (see `backend/.env.example`).
3. For Google sign-in, add redirect URI `http://localhost:3000/api/oauth/callback/google` in Google Cloud Console.
4. For local Next proxy JWT checks, set `JWT_ACCESS_SECRET` in `frontend/.env.local` (same as backend; server-only, not `NEXT_PUBLIC_`).
5. Open http://localhost:3000 — protected routes require a valid `authToken` JWT.

**Demo accounts** (after bootstrap seeds):

| Email                 | Password      |
| --------------------- | ------------- |
| `admin@genesis.io` | `Admin123!@#` |
| `alice@example.com`   | `Alice123!@#` |
| `bob@example.com`     | `Bob123!@#`   |

**Reset DB after auth schema changes:** `docker compose down -v && docker compose up -d --build` from this directory.

### Stop development

- Ctrl+C in the backend and frontend terminals
- From `templates/fullstack/`: `docker compose down`
- Or from `backend/`: `npm run db:down`
- Reset database volume (re-run migrate + seed): `docker compose down -v && docker compose up -d --build` (from fullstack), or `npm run db:reset` (from backend)

---

## Production preview (Docker — all services)

Use this to verify production builds before deploy. Code is **baked into images**; changes require rebuild. Runs **three separate containers** (`db`, `api`, `web`) — not a single monolith image.

Stop the dev database first if it is using port `5432`:

```bash
docker compose down
```

From `templates/fullstack/`:

```bash
cp backend/.env.example backend/.env   # if you have not already
docker compose -f docker-compose.prod.yml up --build -d
```

| Service  | URL                       |
| -------- | ------------------------- |
| Frontend | http://localhost:3000     |
| API      | http://localhost:8000/api |
| Postgres | `localhost:5432`          |

Compose overrides for the `api` container:

- `DATABASE_HOST=db` (Docker network hostname, not `localhost`)
- `DATABASE_SYNCHRONIZE=false`
- `RUN_MIGRATIONS=true`, `RUN_SEEDS=true`
- `CORS_ORIGIN=http://localhost:3000`
- `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET` (set in `backend/.env` or compose overrides)

Stop:

```bash
docker compose -f docker-compose.prod.yml down
```

---

## Deploy (overview)

Production typically uses the **same separate images** as production preview, not one combined container:

1. **Database** — managed Postgres (RDS, Neon, Supabase, etc.); `docker-compose.prod.yml` is optional for small self-hosted stacks
2. **API** — image from `backend/Dockerfile`; set env vars (`DATABASE_*`, `PORT`, `CORS_ORIGIN`, `RUN_MIGRATIONS` for release)
3. **Web** — image from `frontend/Dockerfile`; set `NEXT_PUBLIC_API_URL` to your public API origin at **build time**

Run migrations once per release (entrypoint can run them when `RUN_MIGRATIONS=true`).

---

## Troubleshooting

| Issue                                         | Fix                                                                                                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Port `5432`, `8000`, or `3000` already in use | Stop dev DB (`docker compose down` from fullstack) before prod preview; stop local dev servers before prod preview; check `docker ps`                        |
| API cannot connect to DB in dev               | Ensure Postgres is running (`docker compose up -d --build` from fullstack) and `backend/.env` has `DATABASE_HOST=localhost`                                  |
| Bootstrap failed or schema missing            | `docker compose logs bootstrap` — rebuild with `--build` after migration changes                                                                             |
| Frontend cannot reach API                     | Check `frontend/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000/api`                                                                              |
| Sign-in fails / 401 on API                    | Ensure `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` are set in `backend/.env`; reset DB if migrating from the old demo `user` table (`docker compose down -v`) |
| Session cookie not sent                       | API must send `CORS_ORIGIN` with `credentials: true` (configured in `main.ts`); frontend uses same-origin `/api` rewrites                                    |
| UI changes not visible in Docker              | Expected — use **Local development** (`npm run dev`), not production preview                                                                                 |
