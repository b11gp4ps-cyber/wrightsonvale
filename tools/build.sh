#!/usr/bin/env bash
# Сборка сайта Wrightson & Vale.
#   tools/build.sh          — пересобрать страницы моделей (models/*.html) из site.js
#   tools/build.sh zip OUT  — ещё и собрать архив для хостинга (ISPmanager) в OUT
set -euo pipefail
cd "$(dirname "$0")/.."
node tools/models.cjs .
if [ "${1:-}" = "zip" ]; then
  OUT="${2:-wrightsonvale-site.zip}"; OUT="$(realpath -m "$OUT")"
  T="$(mktemp -d)"
  git archive HEAD | tar -x -C "$T"          # tools/ исключена через .gitattributes
  rm -f "$T/CNAME" "$T/.nojekyll"
  cp tools/htaccess "$T/.htaccess"
  rm -f "$OUT"; (cd "$T" && zip -qr "$OUT" .)
  rm -rf "$T"; echo "Архив: $OUT"
fi
