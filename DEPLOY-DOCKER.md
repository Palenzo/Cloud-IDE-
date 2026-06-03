# Deploying Terminas on a Docker host (with the container feature)

Render and other PaaS web services **cannot** run the in-app dev-container
feature, because it needs access to a real Docker daemon. To get the full app —
including "create container" and the live terminal/editor — deploy on a host you
control that has Docker installed (a VPS such as DigitalOcean/Hetzner, an AWS EC2
instance, etc.).

This repo ships everything needed: a backend image, a frontend image, a
`docker-compose.yml`, and template-image build scripts.

---

## How the container feature works

```
Browser ──HTTP──> frontend (nginx :80)
   │
   ├──API──────────> backend (:3000) ──dockerode──> /var/run/docker.sock
   │                                                      │
   │                                          creates sibling containers
   │                                          from images terminus-node, …
   │                                          bound to host ports 5000-11000
   │
   └──HTTP + WebSocket directly to the dev container at  ${CONTAINER_HOST}:<port>
```

- The backend talks to the **host** Docker daemon through the mounted socket and
  creates one container per workspace from a template image.
- Each dev container runs its own server (terminal via `node-pty` + Socket.IO +
  file APIs) on container port `4000`, mapped to a **host** port in 5000-11000.
- The browser connects to that container **directly** at
  `VITE_CONTAINER_HOST:<port>` — so that host/port range must be publicly
  reachable.

---

## Prerequisites

- A Linux host with **Docker** + **Docker Compose v2**.
- A **MongoDB** database (e.g. Atlas). With Atlas, allow the host's IP (or
  `0.0.0.0/0`) under **Network Access**.
- DNS/IP of the host. Examples below use `203.0.113.10`; replace with yours.
- Firewall: open **80** (frontend), **3000** (backend API), and the dev-container
  range **5000-11000/tcp**.

---

## Steps

### 1. Clone and configure the backend env
```bash
git clone https://github.com/Palenzo/Cloud-IDE-.git
cd Cloud-IDE-
cp backend/.env.example backend/.env
# edit backend/.env:
#   CONNECTION_STR=mongodb+srv://user:pass@cluster.mongodb.net/terminas
#   JWT_SECRET=<long random string>
#   NODEMAILER_PASS=<gmail app password>   # optional (OTP email)
#   DEPLOY_URL=http://203.0.113.10:3000
# REDIS_URL is injected by compose — leave it unset here.
```

### 2. Set the public URLs for the frontend build
The frontend bakes these in at build time. Put them in a root `.env`
(read by docker-compose):
```bash
cat > .env <<EOF
PUBLIC_API_URL=http://203.0.113.10:3000
PUBLIC_CONTAINER_HOST=http://203.0.113.10
EOF
```

### 3. Build the template images
These are the images the app instantiates per workspace:
```bash
chmod +x dockerBackend/build-images.sh
./dockerBackend/build-images.sh
# builds: terminus-node, terminus-python, terminus-gcc, terminus-ubuntu
```

### 4. Bring the stack up
```bash
docker compose up -d --build
```
- frontend → `http://203.0.113.10/`
- backend  → `http://203.0.113.10:3000` (Swagger at `/api-docs`)
- redis    → internal only

### 5. Register templates in the app
Create an **admin/dev** account, then add a template whose **image** field
exactly matches a built tag (`terminus-node`, `terminus-python`,
`terminus-gcc`, `terminus-ubuntu`). Users can then create containers from it.

---

## TLS / production hardening (recommended)

- Put a reverse proxy (Caddy/Traefik/nginx) in front for HTTPS on the frontend
  and backend. If you serve the app over `https://`, the dev containers are
  plain HTTP on 5000-11000, which browsers block as mixed content — terminate
  TLS for that range too, or proxy `wss://`/`https://` to the container ports.
- Restrict MongoDB Network Access to the host IP.
- Consider per-container CPU/memory limits and an idle-cleanup policy.

---

## Notes / known issues

- **Template tags are a convention.** The code runs whatever image name the
  template stores; the build script tags `terminus-*`. Keep them in sync.
- The `dockerBackend/tesing` directory is a scratch template and is not built by
  the script; add it if you need it.
- `NODEMAILER_PASS` only affects OTP/password-reset email; the app runs without it.
