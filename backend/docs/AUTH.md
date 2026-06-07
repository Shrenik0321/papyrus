# Authentication

Genesis uses **Better Auth** for identity (email/password and Google OAuth) and a **hybrid JWT session** for the Nest API and Next.js app.

## Token model

| Token | Cookie | Storage | Purpose |
|-------|--------|---------|---------|
| Access JWT | `authToken` | Client cookie only | Short-lived; verified by signature on each API request |
| Refresh | `refreshToken` | Cookie + SHA-256 hash in `refresh_session` | Long-lived; rotated on `/api/auth/refresh`; revocable |

Better Auth’s own `session` table is used internally by the library; **API routes** use `JwtAuthGuard` and the JWT cookies above.

## Routes

| Flow | Endpoints |
|------|-----------|
| Email/password | `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/refresh`, `POST /api/auth/logout` |
| Google OAuth | `GET /api/oauth/google` (server calls Better Auth `signInSocial`, then redirects to Google), `GET /api/oauth/callback/google` |

After any successful sign-in, the server issues the same `authToken` + `refreshToken` cookies.

## Account linking (same email)

**Policy: auto-link** when the user signs in with Google and Google returns a **verified** email that already belongs to an existing user (e.g. password account).

| Scenario | Result |
|----------|--------|
| New Google user | New `user` row + `account` (`providerId = google`); `role` defaults to `user` |
| Existing password user, same verified Google email | **Same `user.id`**; new `account` row for Google; password login still works (local user must have `emailVerified: true`; see below) |
| Google email ≠ existing user email | Separate user (no link); `allowDifferentEmails` is `false` |
| Google-only user wants a password later | Use Better Auth `setPassword` (future settings UI) |

Configured in `src/lib/auth/utils.ts`:

```ts
account: {
  accountLinking: {
    enabled: true,
    trustedProviders: ['google'],
  },
},
```

## Google OAuth setup

1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → OAuth 2.0 Client ID (Web application).
2. **Authorized redirect URI** (must match `BETTER_AUTH_URL` exactly):
   - Local: `http://localhost:3000/api/oauth/callback/google` (Next.js proxies `/api` → Nest)
   - Production: `https://<public-app-host>/api/oauth/callback/google`
3. Add to `backend/.env`:

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

4. Frontend: “Continue with Google” → same-origin `GET /api/oauth/google?callbackURL=<encoded frontend URL>`.

### `state_mismatch` troubleshooting

Better Auth stores OAuth `state` in an encrypted cookie (`storeStateStrategy: "cookie"`). Start and callback must share the **same browser origin** as `BETTER_AUTH_URL`. If `BETTER_AUTH_URL` is `http://localhost:8000` but the user starts OAuth on `http://localhost:3000`, the callback cookie will not match → [`state_mismatch`](https://better-auth.com/docs/reference/errors/state_mismatch). Use the public app URL for `BETTER_AUTH_URL`, not the internal Nest port.

Run `npm run migrate:auth` once so Better Auth tables (`user`, `account`, `session`, `verification`) exist.

### `account_not_linked`

Logged when Google sign-in finds an existing email/password user but will not auto-link. Common cause: **`emailVerified` is `false`** on the local user (default after `signUpEmail`) while Better Auth requires a verified local email before implicit linking.

This template marks new users `emailVerified: true` via `databaseHooks` (no email verification UI yet). **Existing users** created before that change need a one-time fix:

```sql
UPDATE "user" SET "emailVerified" = true WHERE email = 'your@email.com';
```

Then retry Google sign-in.

## Database tables

| Table | Role |
|-------|------|
| `user` | Profile, `role`, email |
| `account` | Per-provider credentials (password hash, Google tokens) |
| `refresh_session` | App refresh token hashes (revocation, rotation) |
| `session` | Better Auth internal sessions |
| `verification` | Email verify / password reset tokens (when enabled) |
| `migrations` | TypeORM migration history |

## Out of scope (template)

- Link/unlink Google from a settings page while logged in
- Email verification and password reset flows
- Removing Better Auth `session` / `verification` tables
