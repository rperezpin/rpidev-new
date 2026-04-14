#!/usr/bin/env bash
# deploy.sh — Static Astro site deploy
# Uso: bash deploy.sh [branch]
set -euo pipefail

# ==== Rutas ====
BASE_DIR="/var/www/vhosts/rpidev.com"
DOCROOT="$BASE_DIR/httpdocs"
REPO_DIR="$BASE_DIR/repo"

# ==== Git ====
GIT_URL="git@github.com:rperezpin/rpidev-astro.git"
BRANCH="${1:-${BRANCH:-main}}"

export GIT_SSH_KEY="${GIT_SSH_KEY:-$HOME/.ssh/github_rpidev}"
export GIT_SSH_COMMAND="ssh -i $GIT_SSH_KEY -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes"

mkdir -p "$HOME/.ssh" && chmod 700 "$HOME/.ssh"
grep -q "github.com" "$HOME/.ssh/known_hosts" 2>/dev/null \
    || ssh-keyscan -t ed25519 github.com >> "$HOME/.ssh/known_hosts" 2>/dev/null \
    || true
chmod 600 "$HOME/.ssh/known_hosts" 2>/dev/null || true

# ==== Node / nodenv ====
NODENV_ROOT="${NODENV_ROOT:-$BASE_DIR/.nodenv}"
NODE_VERSION_DEFAULT="${NODE_VERSION:-22}"
export NODE_OPTIONS="${NODE_OPTIONS:---max_old_space_size=512}"

ts()  { date +"%F %T"; }
log() { echo "[$(ts)] $*"; }
die() { echo "ERROR: $*" >&2; exit 1; }

activate_node() {
    if [ -x "$NODENV_ROOT/bin/nodenv" ]; then
        export PATH="$NODENV_ROOT/shims:$NODENV_ROOT/bin:$PATH"
        eval "$("$NODENV_ROOT/bin/nodenv" init - bash)" >/dev/null 2>&1 || true
        local req="$NODE_VERSION_DEFAULT"
        [ -f "$REPO_DIR/.node-version" ] && req="$(tr -d ' \t\r\n' < "$REPO_DIR/.node-version")"
        export NODENV_VERSION="$req"
        "$NODENV_ROOT/bin/nodenv" install -s "$NODENV_VERSION" || true
        "$NODENV_ROOT/bin/nodenv" rehash || true
        hash -r 2>/dev/null || true
    fi

    command -v node >/dev/null 2>&1 || die "node no disponible (instala nodenv o Node del sistema)"
    command -v npm  >/dev/null 2>&1 || die "npm no disponible"
    log "Node: $(node -v) | NPM: $(npm -v)"
}

log "== START DEPLOY == branch=$BRANCH"

# ==== Repo: clone o pull ====
if [ ! -d "$REPO_DIR/.git" ]; then
    log "Clonando $GIT_URL en $REPO_DIR ..."
    rm -rf "$REPO_DIR"
    git clone --branch "$BRANCH" "$GIT_URL" "$REPO_DIR"
else
    log "Repo detectado. Actualizando..."
    git -C "$REPO_DIR" remote set-url origin "$GIT_URL" || true
    git -C "$REPO_DIR" fetch origin --prune
    git -C "$REPO_DIR" checkout "$BRANCH" 2>/dev/null \
        || git -C "$REPO_DIR" checkout -b "$BRANCH" "origin/$BRANCH"
    git -C "$REPO_DIR" reset --hard "origin/$BRANCH"
fi

# ==== Node activo ====
activate_node

# ==== Instalación ====
log "Instalando dependencias..."
rm -rf "$REPO_DIR/node_modules"
if [ -f "$REPO_DIR/package-lock.json" ]; then
    (cd "$REPO_DIR" && npm ci --no-audit --no-fund)
else
    (cd "$REPO_DIR" && npm install --no-audit --no-fund)
fi

# ==== Variables de entorno para el build (si las hay) ====
if [ -f "$DOCROOT/.env" ]; then
    log "Cargando variables de entorno desde $DOCROOT/.env ..."
    set -a; . "$DOCROOT/.env"; set +a
fi

# ==== Build ====
log "Compilando (npm run build)..."
(cd "$REPO_DIR" && npm run build)

# Verificar que el build produjo salida
[ -d "$REPO_DIR/dist" ] || die "El directorio dist/ no existe tras el build."
[ -f "$REPO_DIR/dist/index.html" ] || die "dist/index.html no encontrado — el build falló o no es un site estático."

# ==== Deploy de archivos estáticos ====
log "Desplegando archivos estáticos en $DOCROOT ..."
mkdir -p "$DOCROOT"

if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete --human-readable \
        --exclude ".well-known" \
        --exclude ".env" \
        "$REPO_DIR/dist/" "$DOCROOT/"
else
    log "rsync no disponible. Usando cp."
    find "$DOCROOT" -mindepth 1 -maxdepth 1 \
        \( -name ".well-known" -o -name ".env" \) -prune \
        -o -exec rm -rf {} +
    cp -a "$REPO_DIR/dist/." "$DOCROOT/"
fi

# ==== Proteger .env de accesos HTTP (Apache / .htaccess) ====
HTACCESS="$DOCROOT/.htaccess"
if [ -f "$HTACCESS" ] && ! grep -q "Deny access to .env" "$HTACCESS" 2>/dev/null; then
    cat >> "$HTACCESS" <<'EOF'

# Deny access to .env
<Files ".env">
  Require all denied
</Files>
EOF
fi

# ==== Permisos ====
WEB_USER="${WEB_USER:-rpidev.com_6q80r46lbmh}"
WEB_GROUP="${WEB_GROUP:-psacln}"
log "Ajustando permisos ($WEB_USER:$WEB_GROUP)..."
chown -R "$WEB_USER:$WEB_GROUP" "$DOCROOT" 2>/dev/null || true
find "$DOCROOT" -type d -exec chmod 755 {} + 2>/dev/null || true
find "$DOCROOT" -type f -exec chmod 644 {} + 2>/dev/null || true

ENV_FILE="$DOCROOT/.env"
if [ -f "$ENV_FILE" ]; then
    chown "$WEB_USER:$WEB_GROUP" "$ENV_FILE" 2>/dev/null || true
    chmod 600 "$ENV_FILE" 2>/dev/null || true
fi

log "== DONE. Site estático publicado en $DOCROOT =="
