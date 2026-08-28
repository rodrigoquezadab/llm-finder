"""
LLM Atlas — actualizador de catálogo.

Este archivo es una plantilla de producción. No contiene claves ni depende de
servicios privados. Para conectar fuentes reales, implementa las funciones
fetch_* usando las APIs/documentaciones oficiales que correspondan.

Uso:
    python scripts/update_catalog.py

El script:
1. Lee el catálogo actual.
2. Valida los campos esenciales.
3. Crea backup.
4. Escribe el catálogo normalizado.

Para producción, añade un job programado (cron, GitHub Actions, etc.) y
conectores con fuentes reales.
"""
from __future__ import annotations
import json, shutil
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

BASE = Path(__file__).resolve().parents[1]
DATA = BASE / "data" / "models.json"
BACKUP_DIR = BASE / "data" / "backups"
BACKUP_DIR.mkdir(parents=True, exist_ok=True)

REQUIRED = ["id","name","provider","type","releaseDate","context","modalities","atlasScore","benchmarks","officialUrl"]

def validate(models):
    if not isinstance(models, list):
        raise ValueError("El catálogo debe ser una lista.")
    ids = set()
    for m in models:
        missing = [x for x in REQUIRED if x not in m]
        if missing:
            raise ValueError(f"Faltan campos en {m.get('id','<sin id>')}: {missing}")
        if m["id"] in ids:
            raise ValueError(f"ID duplicado: {m['id']}")
        ids.add(m["id"])
        if not 0 <= float(m["atlasScore"]) <= 100:
            raise ValueError(f"Atlas Score fuera de rango: {m['id']}")
        if not isinstance(m["benchmarks"], dict):
            raise ValueError(f"benchmarks inválidos: {m['id']}")
        if urlparse(m["officialUrl"]).scheme not in ("http","https"):
            raise ValueError(f"URL oficial inválida: {m['id']}")
    return models

def fetch_sources():
    """
    Sustituir por conectores reales.

    Recomendación:
    - catálogo/model cards: fuentes oficiales de proveedores y repositorios;
    - disponibilidad/precios: proveedores/API y agregadores permitidos;
    - benchmarks: fuente primaria del benchmark o leaderboard;
    - arena: leaderboard oficial.

    No mezcles scores de metodologías incompatibles sin conservar metadata.
    """
    return None

def main():
    current = json.loads(DATA.read_text(encoding="utf-8"))
    validate(current)

    remote = fetch_sources()
    if remote is None:
        print("Modo seguro: no se configuraron conectores externos.")
        print(f"Catálogo actual válido: {len(current)} modelos.")
        return

    validate(remote)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    shutil.copy2(DATA, BACKUP_DIR / f"models-{stamp}.json")
    DATA.write_text(json.dumps(remote, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Catálogo actualizado: {len(remote)} modelos.")

if __name__ == "__main__":
    main()
