# LLM Atlas — Aplicación completa

LLM Atlas es un catálogo mobile-first de modelos de lenguaje con búsqueda, filtros, benchmarks, ficha de modelo, enlaces oficiales, comparación y una estructura preparada para datos actualizables.

## 1. Requisitos

- Windows 10/11, macOS o Linux
- Python 3.10+ recomendado
- Un navegador moderno: Chrome, Edge, Firefox o Safari
- No necesita Node.js para ejecutar la V1/V2 estática.

## 2. Ejecutar localmente

NO abras `index.html` haciendo doble clic. La aplicación usa `fetch()` para cargar `data/models.json`.

### Windows

Abre PowerShell dentro de la carpeta y ejecuta:

```powershell
py -m http.server 8080
```

Si `py` no existe:

```powershell
python -m http.server 8080
```

Abre:

http://localhost:8080

### macOS/Linux

```bash
python3 -m http.server 8080
```

Abre:

http://localhost:8080

Para detener el servidor: `Ctrl+C`.

## 3. Estructura

- `index.html` — aplicación principal.
- `css/style.css` — diseño responsive/mobile-first y modo oscuro.
- `js/app.js` — búsqueda, filtros, orden, detalles, comparación y tema.
- `data/models.json` — catálogo local.
- `data/schema.json` — esquema recomendado de datos.
- `scripts/update_catalog.py` — plantilla de actualización automática.
- `docs/ARCHITECTURE.md` — arquitectura completa.
- `docs/DATA_SOURCES.md` — estrategia de fuentes.
- `docs/DEPLOYMENT.md` — despliegue.
- `docs/ROADMAP.md` — funciones y fases.
- `docs/SECURITY.md` — seguridad.
- `docs/DATA_POLICY.md` — política de benchmarks y fuentes.

## 4. Actualización de datos

La aplicación está separada del catálogo para poder reemplazar `data/models.json` por datos procedentes de una API/backend.

Ejemplo:

```bash
python scripts/update_catalog.py
```

El script incluido funciona como plantilla segura: valida la estructura y conserva una copia de respaldo antes de sustituir datos.

## 5. Datos y benchmarks

No se debe tratar ningún número de benchmark como universal. Un resultado depende de:

- versión del modelo;
- versión del benchmark;
- dataset;
- método de evaluación;
- prompting;
- herramientas permitidas;
- fecha de medición.

Por eso el esquema incluye `source`, `measuredAt`, `benchmarkVersion` y `methodology`.

## 6. Producción

Para una versión pública se recomienda:

Frontend:
- GitHub Pages, Cloudflare Pages, Netlify o Vercel.

Backend:
- API propia.
- PostgreSQL/SQLite según escala.
- Tarea programada para actualizar fuentes.
- Caché.
- Registro de errores.

No expongas claves API en `app.js`, HTML o JSON público.

## 7. Regla fundamental

La aplicación NO debe afirmar que contiene literalmente todos los LLM existentes en Internet. Debe mostrar todos los modelos que sus fuentes configuradas hayan descubierto y normalizado.

La interfaz puede presentar:

“Modelos indexados”

en lugar de:

“Todos los modelos del mundo”.

