#!/bin/sh
cd "$(dirname "$0")"
if command -v python3 >/dev/null 2>&1; then
  (sleep 1; open http://localhost:8080 2>/dev/null || xdg-open http://localhost:8080 2>/dev/null || true) &
  python3 -m http.server 8080
else
  echo "Instala Python 3.10+ y vuelve a ejecutar este archivo."
  exit 1
fi
