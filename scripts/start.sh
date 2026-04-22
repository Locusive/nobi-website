#!/usr/bin/env bash
# Always run the dev server from THIS repo, regardless of where the
# script was invoked. Avoids two common problems:
#   1. `source ~/.bashrc` used to silently cd into a different repo
#      copy, so `npm run dev` ran against a stale checkout.
#   2. The system /usr/local/bin/node is ancient (v0.10) and can't
#      launch Vite. Source nvm explicitly and pin the Node version
#      the project expects so non-interactive invocations work too.

set -e

# Go to the repo root, resolved from the script's location.
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

# Load nvm (login-shell side-effect used to do this; we do it
# explicitly so non-interactive invocations work too).
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Pin to a known-good Node. Harmless if the version's already active.
nvm use v20.12.2 >/dev/null 2>&1 || true

exec npm run dev
