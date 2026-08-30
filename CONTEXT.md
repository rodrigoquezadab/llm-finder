# LLM Atlas — Contexto del Proyecto

## 🎯 Visión General
**LLM Atlas** es una aplicación web interactiva diseñada para explorar, comparar y analizar modelos de lenguaje de gran escala (LLMs) desarrollados por las principales organizaciones de inteligencia artificial del mundo.

A diferencia de catálogos estáticos convencionales, **LLM Atlas** organiza la información en **Tarjetas por Empresa / Proveedor** y presenta las **versiones de modelos ordenadas cronológicamente (las más nuevas en la parte superior)**, permitiendo a desarrolladores, investigadores y tomadores de decisiones evaluar la evolución técnica, capacidades de contexto, modalidades y benchmarks estandarizados.

---

## 🏛️ Estructura y Arquitectura

```
Atlas/
├── index.html               # Interfaz principal, accesibilidad semántica y modales
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
│   └── update_catalog.py    # Script de ingesta, validación y respaldo
├── INICIAR-WINDOWS.bat      # Lanzador rápido con 1-clic para Windows (Python / Node.js)
├── INICIAR-MAC-LINUX.sh     # Lanzador rápido para macOS y Linux
├── CONTEXT.md               # Resumen de contexto del proyecto
└── README.md                # Documentación principal orientada al usuario final
```

---

## 💡 Principios de Diseño y Experiencia de Usuario

1. **Modo Oscuro por Defecto**:
   - Diseñado con una paleta moderna en tonos azul medianoche / grafito (`#070a12`, `#0f1524`, `#161e33`), acentos índigo y esmeralda, y desenfoques (*backdrop blur*) que ofrecen descanso visual y estética premium.
   - Cuenta con alternancia a modo claro persistente en `localStorage`.

2. **Agrupación por Empresa (Provider-First)**:
   - Los modelos están agrupados en tarjetas representativas de cada empresa (OpenAI, Anthropic, Google, Meta, DeepSeek, xAI, Mistral AI, Alibaba, etc.).
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
- **Lógica**: JavaScript Vanilla (ES6+), sin librerías externas pesadas ni frameworks que ralenticen la carga.
- **Datos**: JSON estructurado con validación contra `data/schema.json`.
- **Compatibilidad**: Compatible con cualquier navegador moderno y ejecutable con servidores HTTP ligeros de Python o Node.js.
