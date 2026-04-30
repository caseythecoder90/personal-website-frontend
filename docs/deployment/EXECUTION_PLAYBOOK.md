# Frontend Deployment — Execution Playbook

Step-by-step runbook for getting the frontend deployed for the first time. The
companion document `DEPLOYMENT_PLAN.md` covers the *what* and *why*; this one
is just *do this, then do this*.

Use this when you're in the middle of a deploy and want a single source of
truth without having to re-read chat history.

> **Convention:** `<vps-ip>` means your Hetzner VPS public IP. Substitute it
> wherever you see the angle brackets. Same for `<email>` (use the email you
> register with Let's Encrypt) and `<your-deploy-key-path>` (the local path
> to the SSH private key authorized to log in as `deploy`).

---

## Pre-flight checklist (one-time)

Before starting the playbook, confirm these prerequisites:

- [ ] Hetzner VPS is running, has the backend stack already deployed at
      `/opt/personal-website/`, and `api.caseyrquinn.com` serves traffic.
- [ ] You can SSH in: `ssh deploy@<vps-ip>` works without a password prompt.
- [ ] Cloudflare DNS records exist with proxy **off** (gray cloud):
      - `A @ → <vps-ip>`
      - `A www → <vps-ip>`
- [ ] DNS has propagated. Run locally:
      ```bash
      dig caseyrquinn.com +short
      dig www.caseyrquinn.com +short
      ```
      Both should print `<vps-ip>`. If they don't, wait and re-check.
- [ ] The frontend repo's local working tree builds clean:
      ```bash
      docker build --build-arg VITE_API_BASE_URL=http://localhost:8080/api/v1 -t pwf:test .
      ```
      Should finish successfully and produce an image. Smoke test optional.

---

## Step 1 — Open and merge the backend PR

The backend repo needs two file changes:

1. Add the `frontend` service to `docker-compose.prod.yml`.
2. Append three new server blocks to `nginx/conf.d/default.conf` (HTTP redirect
   for the new hostnames, www→apex 301, frontend HTTPS proxy).

Have the backend agent push the branch and open a PR. Review the diff to
confirm only those two files changed.

**Merge to `main`.**

The backend's existing GitHub Actions workflow runs on merge but is harmless
here — its deploy script only restarts the `app` service. It does not touch
nginx, does not touch the new `frontend` service, and does not copy any
files to the VPS. The backend stays up.

---

## Step 2 — Copy the new config files to the VPS

The backend's CI does **not** sync `docker-compose.prod.yml` or
`nginx/conf.d/default.conf` to the VPS. Those files were originally `scp`d
during initial setup, and updates to them follow the same pattern.

From your local machine, after pulling the merged backend `main`:

```bash
cd /c/Users/casey/Projects/personal-website-backend
git checkout main
git pull

scp docker-compose.prod.yml deploy@<vps-ip>:/opt/personal-website/
scp nginx/conf.d/default.conf deploy@<vps-ip>:/opt/personal-website/nginx/conf.d/
```

The new files are now on the VPS but **not loaded** into the running nginx.
The running nginx still uses the old config in memory. That's intentional —
we'll reload later, after everything else is in place.

---

## Step 3 — Issue the new SSL certificate on the VPS

SSH in:

```bash
ssh deploy@<vps-ip>
cd /opt/personal-website
```

Run certbot to issue a single cert covering both new hostnames. **Note the
`--entrypoint certbot` flag** — without it, the request hits the running
certbot service's permanent renewal loop instead of issuing a new cert:

```bash
docker compose -f docker-compose.prod.yml run --rm --entrypoint certbot certbot \
  certonly --webroot --webroot-path=/var/www/certbot \
  --email <email> --agree-tos --no-eff-email \
  -d caseyrquinn.com -d www.caseyrquinn.com
```

The word `certbot` appears twice on purpose: once as the entrypoint binary,
once as the compose service name.

Successful output ends with:

```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/caseyrquinn.com/fullchain.pem
```

Verify (sudo is required because certbot creates 0700 dirs):

```bash
sudo ls /opt/personal-website/certbot/conf/live/caseyrquinn.com/
# Expect: cert.pem  chain.pem  fullchain.pem  privkey.pem  README
```

If the command instead prints "Certificate not yet due for renewal" or
"Processing /etc/letsencrypt/renewal/api.caseyrquinn.com.conf", you forgot
the `--entrypoint certbot` flag. Re-run with it.

If the command fails with a DNS-related error, your DNS hasn't propagated.
Go back to the pre-flight checklist.

---

## Step 4 — Do NOT reload nginx yet

This is the step ordering trap. Naive reading of "config copied + cert
issued" suggests reloading nginx now, but that fails:

```
nginx: [emerg] host not found in upstream "frontend"
```

Nginx resolves upstream hostnames at config-parse time. The new server
block has `proxy_pass http://frontend:80;`, but the `frontend` container
doesn't exist yet (its Docker image hasn't been built and pushed yet).
Docker DNS has nothing to resolve, so nginx refuses to load the config.
The running nginx is unchanged — the api keeps serving — but the reload
itself fails.

**Skip the reload.** Move on to creating the frontend image. We'll come
back to nginx in Step 8.

---

## Step 5 — Configure GitHub secrets in the frontend repo

The frontend's GitHub Actions workflow needs three secrets to log in to
the VPS over SSH. Same values used by the backend repo.

In the frontend repo on GitHub:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value |
|---|---|
| `VPS_HOST` | `<vps-ip>` |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | full contents of the private key (run `cat <your-deploy-key-path>` locally and paste the entire output, including the `-----BEGIN ... -----` and `-----END ... -----` lines) |

Then **Settings → Actions → General → Workflow permissions** →
select **"Read and write permissions"** → **Save**.

Without the read+write permission, the workflow's GHCR push will fail
with `permission_denied: write_package`.

---

## Step 6 — Commit and push the frontend changes to a branch

In your local frontend repo:

```bash
cd /c/Users/casey/Projects/personal-website-frontend

# Use the existing feature branch or create one. Adjust to your workflow.
git status

# Stage everything new and modified
git add Dockerfile .dockerignore nginx/ .github/ docs/deployment/ package-lock.json public/ index.html src/
git status      # double-check what's staged

git commit -m "Add Dockerfile, SPA nginx config, and CI/CD pipeline"
git push -u origin <branch-name>
```

**Important:** confirm `package-lock.json` is part of the commit. Without it,
the GitHub Actions runner will fail `npm ci` with the same musl-binding
error you might have hit locally.

---

## Step 7 — Open and merge the frontend PR

Open a PR from your branch to `main`. Review the diff. Merge.

The workflow only triggers on push to `main`, so the PR itself doesn't
deploy. Merging is what fires it.

---

## Step 8 — Watch the first deploy

Two jobs run in sequence:

```bash
gh run watch
```

Or browse the **Actions** tab in the frontend repo.

| Job | Duration | What it does |
|---|---|---|
| `build-and-push` | ~3-5 min | Builds the Docker image with `VITE_API_BASE_URL=https://api.caseyrquinn.com/api/v1` baked in, pushes to GHCR with `:latest` and `:<sha>` tags |
| `deploy` | ~10-30 sec | SSHs into VPS, runs `docker compose pull frontend && up -d frontend && docker image prune -f` |

When both jobs are green, the `frontend` container is running on the VPS
and joined to the `app-network`. From this moment, Docker DNS resolves
`frontend` correctly.

If a job fails, capture the failing step's output and diagnose before
continuing. Common failures:

- **`npm ci` errors about missing platform packages** — `package-lock.json`
  wasn't committed, or wasn't regenerated cleanly. Recipe to fix locally:
  ```powershell
  Remove-Item -Recurse -Force node_modules, package-lock.json
  docker run --rm -v "${PWD}:/app" -w /app node:22-alpine npm install
  ```
  Commit the new lockfile and push again.
- **`permission_denied: write_package` on GHCR push** — Workflow permissions
  weren't set to read+write in Step 5.
- **SSH `Permission denied (publickey)`** — `VPS_SSH_KEY` secret is wrong, or
  the deploy key isn't authorized on the VPS as the `deploy` user.

---

## Step 9 — Reload nginx on the VPS (the deferred Step 4)

SSH back in:

```bash
ssh deploy@<vps-ip>
cd /opt/personal-website
```

Test the new config:

```bash
docker compose -f docker-compose.prod.yml exec nginx nginx -t
```

Expect:

```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test successful
```

If `-t` errors with `host not found in upstream "frontend"` again, the
frontend container isn't actually running. Check:

```bash
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Image}}'
```

You should see `personal-website-frontend` with `Up X seconds/minutes`. If
not, the GHA deploy job either hasn't run or didn't complete. Re-check the
Actions tab in the frontend repo.

If `-t` is happy, reload:

```bash
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

This is a graceful reload — zero downtime, no connection drops.

---

## Step 10 — Smoke test the live site

From your local machine:

```bash
# api still works (regression check)
curl -I https://api.caseyrquinn.com/actuator/health
# Expect: HTTP/2 200

# frontend root
curl -I https://caseyrquinn.com/
# Expect: HTTP/2 200, content-type: text/html

# www canonicalization
curl -I https://www.caseyrquinn.com/
# Expect: HTTP/2 301
# location: https://caseyrquinn.com/

# HTTP → HTTPS redirect
curl -I http://caseyrquinn.com/
# Expect: HTTP/1.1 301
# location: https://caseyrquinn.com/

# SPA fallback through both nginx layers
curl -s https://caseyrquinn.com/projects/anything | grep -o '<title>[^<]*</title>'
# Expect: a <title>...</title> served from index.html (SPA renders the
# correct view client-side once JS loads in a real browser)
```

Open `https://caseyrquinn.com/` in a browser. The site should render. If
the home page shows "loading" indefinitely, open DevTools → Network and
confirm requests to `https://api.caseyrquinn.com/api/v1/...` are returning
200. CORS errors here mean the backend's `SecurityConfig` doesn't list
`https://caseyrquinn.com` as an allowed origin — but per
`FRONTEND_INTEGRATION.md` it already should.

---

## Where each step happens (quick reference)

| Step | Location |
|---|---|
| 1 — Backend PR | Browser (GitHub) + backend agent |
| 2 — `scp` configs | Local terminal |
| 3 — Issue cert | SSH'd into VPS |
| 4 — *don't reload yet* | n/a |
| 5 — GitHub secrets | Browser (GitHub) |
| 6 — Commit + push | Local terminal |
| 7 — Open + merge PR | Browser (GitHub) |
| 8 — Watch GHA | Browser (GitHub) or `gh run watch` locally |
| 9 — Reload nginx | SSH'd into VPS |
| 10 — Smoke test | Local terminal + browser |

---

## Common gotchas reference

### Certbot ignores `certonly` and runs the renewal loop instead

The compose `certbot` service has a permanent renewal entrypoint. To run
a one-shot command, **always** pass `--entrypoint certbot`:

```bash
docker compose -f docker-compose.prod.yml run --rm --entrypoint certbot certbot \
  certonly ...
```

### `nginx -t` fails with `host not found in upstream "frontend"`

The frontend container isn't running. Check `docker ps`. The frontend
container is created by the frontend repo's GHA deploy job — if you've
never pushed to `main` on the frontend repo, the container doesn't exist
yet, and nginx can't validate its config until it does. Don't try to fix
this by editing the nginx config — finish the frontend deploy first.

### `npm ci` fails inside the Docker build with `Missing: @emnapi/...`

`package-lock.json` is out of sync with `package.json`, typically because
it was generated on Windows without the Linux platform entries. Fix:

```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json
docker run --rm -v "${PWD}:/app" -w /app node:22-alpine npm install
```

Commit the regenerated lockfile.

### `Permission denied` listing `/opt/personal-website/certbot/conf/live/`

Certbot creates these directories with restrictive 0700 permissions. Use
`sudo ls` to inspect them. This is not a misconfig.

### Site renders but data doesn't load (CORS or 502 from api)

Open browser DevTools → Network. If api requests return CORS errors, the
backend's allowed-origins list needs `https://caseyrquinn.com`. If they
return 502, the api container is down — check `docker logs personal-website-app`
on the VPS.

---

## Rollback

If the frontend goes wrong after a deploy and you need to roll back fast:

```bash
ssh deploy@<vps-ip>
cd /opt/personal-website

# Find the previous good SHA from the frontend repo's git log or GHCR
# package tags. Edit docker-compose.prod.yml to pin the frontend image:
#   image: ghcr.io/caseythecoder90/personal-website-frontend:<sha>
nano docker-compose.prod.yml

docker compose -f docker-compose.prod.yml pull frontend
docker compose -f docker-compose.prod.yml up -d frontend
```

Don't forget to revert the pin once a fix is on `:latest`.

If a *backend* nginx config change is the problem (rare — caught by
`nginx -t` in normal flow), restore the previous default.conf via `scp`
and reload.

---

## After it's all working

Recurring chores once the deploy is humming:

- **Frontend deploys:** push to `main` on the frontend repo, watch GHA, done.
  No VPS interaction needed.
- **Cert renewal:** the running certbot container's 12-hour loop renews
  both certs (api + frontend) automatically. Verify quarterly with
  `sudo openssl x509 -in /opt/personal-website/certbot/conf/live/caseyrquinn.com/fullchain.pem -noout -dates`.
- **Disk cleanup:** the deploy job runs `docker image prune -f`, which
  removes untagged images. Periodically run `docker system df` on the VPS
  to confirm disk usage isn't creeping.
- **Post-deploy regression check:** after any backend deploy that touches
  `SecurityConfig` or any nginx config change, re-run the smoke tests in
  Step 10.
