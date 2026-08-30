# LLM Atlas — Contexto del Proyecto y Fuentes de Datos

## 🎯 Visión General
**LLM Atlas** es una plataforma web interactiva diseñada para explorar, comparar y analizar modelos de lenguaje de gran escala (LLMs) desarrollados por las principales organizaciones de inteligencia artificial del mundo.

A diferencia de catálogos estáticos convencionales, **LLM Atlas** organiza la información en **Tarjetas por Empresa / Proveedor** y presenta las **versiones de modelos ordenadas cronológicamente (las más nuevas en la parte superior)**, permitiendo a desarrolladores, investigadores y tomadores de decisiones evaluar la evolución técnica, capacidades de contexto, modalidades y benchmarks estandarizados.

---

## 🌐 Fuentes de Datos y Leaderboards Sincronizados

El catálogo se alimenta y normaliza a partir de los principales portales de evaluación y leaderboards del ecosistema global de IA:

1. **[Artificial Analysis – LLM Leaderboard](https://artificialanalysis.ai/leaderboards/models)**
   - *Métricas clave*: Intelligence Index, Coding Index, SWE-bench, Speed (tokens/segundo), TTFT Latency, Costo por tarea y ventana de contexto.
   - *Modelos rastreados*: Claude Opus 5, Claude Fable 5, GPT-5.6 Luna, Gemini 3.5 Flash-Lite, Llama 4 Scout, Granite 4.2 3B, MiMo-V2.5.

2. **[Opper AI – LLM Leaderboard](https://opper.ai/llm-leaderboard)**
   - *Métricas clave*: Intelligence Score, Coding Score, Agentic Index, Math Benchmarks, throughput de inferencia y disponibilidad de endpoints en la UE.

3. **[LMArena / Arena – Chatbot Arena](https://lmarena.ai/)**
   - *Métricas clave*: Arena Elo, Coding Elo, Hard Prompts Elo, Vision Arena Elo, votación ciega por pares humanos de millones de enfrentamientos.

4. **[Hugging Face – Leaderboards & Evaluations](https://huggingface.co/docs/leaderboards/index)**
   - *Métricas clave*: Open LLM Leaderboard (MMLU-PRO, GPQA, IFEval, MATH, MuSR, GSM8K) para modelos abiertos y ponderaciones públicas.

5. **[LLM Benchmarks](https://llmbenchmarks.io/es/)**
   - *Métricas clave*: Throughput, latencia de primer token (TTFT), MMLU, HumanEval, benchmarks de rendimiento de inferencia en hardware estandarizado.

6. **[BenchLM – LLM Leaderboard](https://www.benchlm.ai/)**
   - *Métricas clave*: Evaluaciones de razonamiento multi-paso, seguimiento estricto de instrucciones complejas y benchmarks de conocimiento fáctico.

---

## ⚡ Comandos para Sincronizar el Catálogo

Puedes ejecutar la sincronización automática de modelos y benchmarks desde estas fuentes en cualquier momento mediante:

### Opción 1: Node.js (Recomendada)
```bash
node scripts/sync_leaderboards.js
```
o si utilizas npm:
```bash
npm run sync
```

### Opción 2: Python
```bash
python scripts/update_catalog.py
```

### ⚙️ Flujo del Proceso de Sincronización:
1. **Consulta y Extracción**: Procesa los índices de Artificial Analysis, Opper AI, Arena y Hugging Face.
2. **Normalización**: Mapea métricas al esquema estándar (`MMLU`, `GPQA`, `AIME`, `SWE-bench`, `Atlas Score`).
3. **Validación**: Comprueba la integridad del esquema con `data/schema.json` y calcula el *Top Score* por empresa.
4. **Respaldo Automático**: Guarda una copia con marca de tiempo en `data/backups/models-backup-YYYY-MM-DDTHH-MM-SS.json`.
5. **Persistencia**: Actualiza de forma atómica `data/models.json`.

---

## 🏛️ Estructura y Arquitectura

```
Atlas/
├── index.html               # Interfaz principal, accesibilidad semántica y modales
├── package.json             # Scripts de inicio, sincronización y validación
├── css/
│   └── style.css            # Sistema de diseño con modo oscuro nativo, variables y componentes
├── js/
│   └── app.js               # Lógica de renderizado, filtrado, ordenamiento y comparación
├── data/
│   ├── models.json          # Base de datos local normalizada de modelos y benchmarks
│   ├── schema.json          # Especificación JSON Schema para validación de datos
│   └── backups/             # Respaldos generados automáticamente
├── docs/
│   ├── ARCHITECTURE.md      # Detalles de diseño de software y extensibilidad
│   ├── CONTEXT.md           # Contexto del dominio y reglas de negocio
│   ├── DATA_POLICY.md       # Política editorial sobre métricas y fuentes
│   ├── DATA_SOURCES.md      # Conectores y orígenes de datos
│   ├── DEPLOYMENT.md        # Guía para GitHub Pages, Cloudflare, Vercel
│   ├── ROADMAP.md           # Plan de evolución y siguientes funcionalidades
│   └── SECURITY.md          # Recomendaciones de seguridad
├── scripts/
│   ├── sync_leaderboards.js # Sincronizador de leaderboards y catálogo
│   └── update_catalog.py    # Script alternativo en Python con validación y respaldo
├── INICIAR-WINDOWS.bat      # Lanzador rápido con 1-clic para Windows (Python / Node.js)
├── INICIAR-MAC-LINUX.sh     # Lanzador rápido para macOS y Linux
├── CONTEXT.md               # Resumen de contexto y fuentes del proyecto
└── README.md                # Documentación principal orientada al usuario final
```

---

## 💡 Principios de Diseño y Experiencia de Usuario

1. **Modo Oscuro por Defecto**:
   - Diseñado con una paleta moderna en tonos azul medianoche / grafito (`#070a12`, `#0f1524`, `#161e33`), acentos índigo y esmeralda, y desenfoques (*backdrop blur*) que ofrecen descanso visual y estética premium.
   - Cuenta con alternancia a modo claro persistente en `localStorage`.

2. **Agrupación por Empresa (Provider-First)**:
   - Los modelos están agrupados en tarjetas representativas de cada empresa (OpenAI, Anthropic, Google, Meta, DeepSeek, xAI, Mistral AI, Alibaba, Cohere, IBM, etc.).
   - Cada tarjeta destaca la identidad corporativa, el total de versiones indexadas, el *Top Atlas Score* alcanzado y enlace oficial.

3. **Línea Temporal de Versiones (Newest First)**:
   - Dentro de cada empresa, las versiones de modelos se presentan ordenadas cronológicamente, con las versiones más recientes en la parte superior y destacadas con la etiqueta `Más reciente`.

4. **Transparencia en Benchmarks**:
   - Las métricas reflejan evaluaciones estandarizadas del sector: **MMLU** (conocimiento general y razonamiento), **GPQA** (preguntas científicas de nivel experto), **AIME** (matemáticas avanzadas) y **SWE-bench** (resolución de problemas de ingeniería de software).

5. **Comparador Multi-Modelo**:
   - Barra flotante interactiva que permite seleccionar hasta 5 modelos de distintas empresas y contrastarlos en una matriz tabular detallada.

---

## 🛠️ Tecnologías y Dependencias
- **Frontend Core**: HTML5 semántico, CSS3 moderno (Variables CSS, Flexbox, Grid, Glassmorphism, animaciones fluidas).
- **Lógica**: JavaScript Vanilla (ES6+), sin dependencias pesadas ni frameworks que ralenticen la carga.
- **Sincronización**: Script nativo Node.js / Python sin librerías invasivas.
- **Datos**: JSON estructurado con validación contra `data/schema.json`.
- **Compatibilidad**: Compatible con cualquier navegador moderno y ejecutable con servidores HTTP ligeros de Python o Node.js.
