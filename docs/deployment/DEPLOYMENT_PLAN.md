# Frontend Deployment Plan

Reference for deploying the React frontend alongside the existing Spring Boot
backend on a Hetzner VPS. Captures the architectural decisions, the concrete
work items, and how the CI/CD wires together across two repositories.

> Companion docs in the backend repo:
> - `docs/deployment/VPS_DEPLOYMENT.md` — original VPS provisioning steps
> - `docs/deployment/GITHUB_ACTIONS_CICD.md` — backend CI/CD pipeline this plan mirrors
> - `docs/deployment/NGINX_REVERSE_PROXY.md` — edge nginx config that will be extended
> - `docs/deployment/DOCKER.md` — backend Docker patterns
> - `docs/deployment/CERTBOT_SSL.md` — SSL certificate workflow

---

## Existing infrastructure (before this plan)

The backend already runs on a Hetzner CX22 VPS as a single Docker Compose
project at `/opt/personal-website/`:

```
Internet                Docker network: app-network
   │                    ┌────────────────────────────────────┐
   │  :80 / :443        │                                    │
   └──────────► [nginx] ─── http://app:8080 ──► [spring boot]│
                        │                                    │
                        │           [postgres:5432] (private)│
                        │           [redis:6379]    (private)│
                        │           [certbot]                │
                        └────────────────────────────────────┘
```

- The edge nginx terminates TLS for `api.caseyrquinn.com` and reverse-proxies
  everything to the Spring Boot container on port 8080.
- Postgres and Redis are not exposed; they're reachable only via the Docker
  network.
- Certbot renews the Let's Encrypt cert for `api.caseyrquinn.com` on a 12-hour
  loop.
- CI/CD is wired in the backend repo: a push to `main` builds a Docker image,
  pushes it to GHCR, and SSHs into the VPS to `docker compose pull && up -d`
  the `app` service.

---

## Architectural decision

Two viable paths considered:

### Option A — Add the frontend as a service in the existing Compose project (chosen)

The frontend ships as another container in `/opt/personal-website/docker-compose.prod.yml`.
The existing edge nginx grows two extra `server` blocks to route by hostname:

- `api.caseyrquinn.com` → `http://app:8080` (already in place)
- `caseyrquinn.com` and `www.caseyrquinn.com` → `http://frontend:80` (new)

The `frontend` container is a multi-stage Docker image: Node builds the static
Vite bundle, then a small Nginx serves `dist/` with SPA fallback.

**Trade-offs accepted:**
- The `docker-compose.prod.yml` and edge nginx config live in the *backend*
  repo. Adding or modifying the frontend service requires a backend PR. In
  exchange we get one Compose project, one set of certificates, one network,
  and no port collisions.
- The frontend repo's GitHub Actions deploy job SSHs into the VPS and only
  touches the `frontend` service: `docker compose pull frontend && up -d frontend`.
  Backend services are untouched by frontend deploys.

### Option B — Separate Compose project, separate edge nginx (rejected)

Each repo would own its own nginx and certbot. Two nginx containers can't both
bind to ports 80/443, so this would require a third "edge" nginx in front of
both — too much overhead for a personal site.

---

## Target architecture

```
Internet                Docker network: app-network
   │                    ┌────────────────────────────────────────┐
   │  :80 / :443        │                                        │
   └──────────► [nginx] ─── api.caseyrquinn.com ──► [app:8080]   │
                        │                                        │
                        │   caseyrquinn.com   ──────► [frontend:80]
                        │   www.caseyrquinn.com                  │
                        │                                        │
                        │           [postgres] [redis] [certbot] │
                        └────────────────────────────────────────┘
```

Hostname-based routing means a single nginx container handles all three
hostnames with one set of certs. The frontend is reachable from outside only
via that nginx — its own port 80 is internal to the Docker network.

The frontend image is environment-specific because Vite inlines
`VITE_API_BASE_URL` at build time. Production images bake in
`https://api.caseyrquinn.com/api/v1`. Local dev keeps reading from `.env`.

---

## DNS

Two new records at the domain registrar (in addition to the existing
`api.caseyrquinn.com` A record):

| Type | Name        | Value           |
|------|-------------|-----------------|
| A    | `@` (apex)  | VPS IP address  |
| A    | `www`       | VPS IP address  |

If the registrar doesn't allow `A` on the apex, use `ALIAS` or `ANAME`
pointing to `@` instead. Wait for propagation before requesting certificates
(`dig caseyrquinn.com` should return the VPS IP).

---

## Work items

Six discrete pieces of work, grouped by repository.

### Frontend repo (this repo)

#### 1. `Dockerfile` (multi-stage build)

- Stage 1 (`node:22-alpine`): `npm ci` → `npm run build`. Accepts
  `VITE_API_BASE_URL` as a `--build-arg` so the production API URL is baked
  into the JS bundle.
- Stage 2 (`nginx:alpine`): copies the built `dist/` into
  `/usr/share/nginx/html` and the SPA nginx config into
  `/etc/nginx/conf.d/default.conf`.
- Final image is small (Nginx + static files only — no Node runtime).

#### 2. `nginx/spa.conf`

The *internal* nginx config that runs **inside** the frontend container. Not
to be confused with the edge nginx in the backend repo.

- `try_files $uri $uri/ /index.html;` — required SPA fallback so direct
  navigation to `/projects/some-slug` doesn't 404. Without it nginx looks for
  a literal file at that path; with it, the browser receives `index.html` and
  React Router handles the route.
- Long cache headers on `/assets/*` (Vite hashes filenames, so they're
  immutable for their lifetime).
- Short / no-cache on `index.html` so users see new builds promptly.
- Optional: gzip / brotli on text assets.

#### 3. `.github/workflows/deploy.yml`

Mirrors the backend workflow:

- Trigger: push to `main`.
- Job 1 — build: checkout → docker login GHCR → `docker build` with
  `--build-arg VITE_API_BASE_URL=https://api.caseyrquinn.com/api/v1` → tag
  with `:latest` and `:<commit-sha>` → push to
  `ghcr.io/caseythecoder90/personal-website-frontend`.
- Job 2 — deploy (depends on job 1): SSH into the VPS → `cd /opt/personal-website`
  → `docker compose -f docker-compose.prod.yml pull frontend` →
  `up -d frontend` → `docker image prune -f`.
- The deploy job only restarts the `frontend` service; backend, Postgres,
  Redis, nginx, and certbot are untouched.

The same three secrets the backend repo uses are needed in the frontend
repo's GitHub settings: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`. The deploy SSH
key from the backend setup can be reused — it's authorized to SSH as the
`deploy` user, and `deploy` is already a member of the `docker` group.

### Backend repo

These two changes go in a separate PR against the backend repo. They could be
merged in either order, but the new nginx config refers to a `frontend`
service, so the Compose change must land first (or both at once).

#### 4. Add `frontend` service to `docker-compose.prod.yml`

```yaml
  frontend:
    image: ghcr.io/caseythecoder90/personal-website-frontend:latest
    container_name: personal-website-frontend
    restart: unless-stopped
    networks:
      - app-network
```

No `ports:` block. The edge nginx talks to it as `http://frontend:80` over
the internal network.

#### 5. Extend `nginx/conf.d/default.conf`

Add two new `server` blocks alongside the existing `api.caseyrquinn.com`
blocks:

- HTTP block listening on port 80 for `caseyrquinn.com` and
  `www.caseyrquinn.com`. Serves the `/.well-known/acme-challenge/` path for
  certbot, redirects everything else to HTTPS.
- HTTPS block listening on port 443 with SSL, also covering both names. Uses
  the same SSL hardening + security headers as the api block.
- `location / { proxy_pass http://frontend:80; ... }` — same proxy header
  pattern as the api block.

A common refinement is to redirect `www.caseyrquinn.com` → `caseyrquinn.com`
(or vice versa, whichever is the canonical hostname) so SEO doesn't see two
separate sites.

### VPS (one-time setup)

#### 6. Issue SSL certificates for the new hostnames

Same certbot pattern as the backend's first SSL run, but covering both new
names in one cert:

```bash
docker compose -f docker-compose.prod.yml run --rm certbot \
  certonly --webroot --webroot-path=/var/www/certbot \
  --email <email>@example.com --agree-tos --no-eff-email \
  -d caseyrquinn.com -d www.caseyrquinn.com
```

After the cert is issued, reload nginx:
```bash
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

The existing 12-hour certbot renewal loop will keep both certs (api +
frontend) renewed automatically.

---

## Deploy flow after everything is wired

A push to `main` on the frontend repo:

1. GitHub Actions detects the push (~2-5s).
2. Build job (~2-4 min): `docker build` runs `npm ci` + `npm run build`
   with the production API URL baked in, pushes the image to GHCR with
   `:latest` and `:<sha>` tags.
3. Deploy job (~10-30s): SSHs into the VPS, pulls the new image, recreates
   the frontend container, prunes old images.
4. Static files are served immediately — no warmup needed (it's just nginx
   + HTML/JS/CSS).

Total push-to-live: **~3-5 minutes**.

Backend deploys still work the same way — they only touch the `app` service.
Frontend and backend deploys are completely independent.

---

## Local testing without the VPS

Before any of the VPS work, the frontend image can be tested entirely
locally:

```bash
# Build with a local API URL
docker build \
  --build-arg VITE_API_BASE_URL=http://localhost:8080/api/v1 \
  -t personal-website-frontend:dev .

# Run the container, exposing 8081 -> 80
docker run --rm -p 8081:80 personal-website-frontend:dev

# Open http://localhost:8081 — direct navigation to /projects, /blog/<slug>
# should also work (proves the SPA fallback is wired correctly).
```

If a local backend is running on port 8080, the local frontend container can
hit it directly through `host.docker.internal:8080` (override
`VITE_API_BASE_URL` to that address at build time). Otherwise build with the
production API URL and just verify the static assets serve.

---

## Rollback

The frontend follows the same SHA-tagged image pattern as the backend. To
roll back:

1. Find the commit SHA of the previous good build (`git log --oneline` on the
   frontend repo, or browse the GHCR package's tag list).
2. SSH into the VPS, edit `/opt/personal-website/docker-compose.prod.yml` to
   pin the frontend `image:` tag from `:latest` to that SHA.
3. `docker compose pull frontend && docker compose up -d frontend`.

For a fast rollback during an incident, this beats redeploying through CI.
Don't forget to revert the pin once a fixed `:latest` is back.

---

## Observability

Same patterns as the backend:

```bash
# All frontend container logs
docker compose -f docker-compose.prod.yml logs -f frontend

# Verify routing through the edge nginx
curl -I https://caseyrquinn.com
curl -I https://www.caseyrquinn.com
curl -I https://api.caseyrquinn.com/actuator/health

# Confirm SPA fallback (any unknown path should return the index document)
curl -s https://caseyrquinn.com/some/deep/route | head -5
```

---

## Cost impact

The frontend container is essentially free in terms of resources — Nginx +
static files runs in well under 50 MB of RAM. The Hetzner CX22 (4 GB RAM) is
already only ~30% utilized after the backend stack, so the frontend slots in
without an instance upgrade. No additional monthly cost.

---

## Order of execution

Recommended order so each step is independently testable:

1. **Frontend repo, locally:** add `Dockerfile` + `nginx/spa.conf`. Verify
   with `docker build` + `docker run` against the local backend.
2. **Frontend repo:** add `.github/workflows/deploy.yml`. Push to a feature
   branch first; the workflow won't fire (it's main-only), but the file gets
   reviewed in the PR.
3. **GitHub:** copy `VPS_HOST` / `VPS_USER` / `VPS_SSH_KEY` secrets from the
   backend repo into the frontend repo settings. Set workflow permissions to
   "Read and write" so the GHCR push succeeds.
4. **DNS:** add the two A records. Wait for propagation (`dig`).
5. **Backend repo PR:** add the `frontend` service to `docker-compose.prod.yml`
   and the new server blocks to `nginx/conf.d/default.conf`. Don't merge yet.
6. **VPS:** while the backend PR is staged, issue the new SSL cert via
   certbot (one-shot command). Then merge and deploy the backend PR — nginx
   reload picks up the new server blocks.
7. **Frontend repo:** merge to `main`. CI builds and deploys the first
   frontend image. The site goes live.

Steps 5 and 7 can technically interleave — if the new nginx blocks are live
before the frontend image exists, hitting `caseyrquinn.com` returns a 502
until step 7 completes. That's acceptable for the initial cutover.
