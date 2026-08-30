# 🌐 LLM Atlas

> **El catálogo interactivo de modelos de inteligencia artificial: compara empresas, versiones, benchmarks y capacidades de un vistazo.**

![Modo Oscuro](https://img.shields.io/badge/Tema-Modo%20Oscuro%20por%20Defecto-6366f1?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-Modern%20Design-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Licencia](https://img.shields.io/badge/Licencia-MIT-10b981?style=for-the-badge)

---

## ✨ ¿Qué es LLM Atlas?

**LLM Atlas** es una herramienta web moderna y ligera creada para ayudarte a descubrir, evaluar y comparar los modelos de lenguaje (LLMs) más potentes del mundo.

A diferencia de listas desordenadas, **LLM Atlas agrupa los modelos en tarjetas por empresa** (OpenAI, Anthropic, Google, Meta, DeepSeek, xAI, Mistral AI, Alibaba) y muestra las **versiones de modelos ordenadas cronológicamente, con las más recientes arriba de todo**, para que siempre veas primero los últimos lanzamientos de cada creador.

---

## 🚀 Características Principales

- 🏢 **Tarjetas por Empresa**: Explora de forma organizada cada organización de IA, sus enlaces oficiales y su catálogo completo de modelos.
- ⏱️ **Versiones Ordenadas (Nuevas primero)**: Identifica al instante el modelo insignia y las versiones más recientes de cada familia técnica.
- 🌙 **Modo Oscuro por Defecto**: Interfaz de diseño premium con estética *glassmorphism*, alto contraste y opción para alternar a modo claro.
- ⚖️ **Comparador Multi-Modelo**: Selecciona hasta 5 modelos de distintas empresas y visualiza una tabla comparativa con contexto, tipo de licencia y benchmarks frente a frente.
- 🔍 **Búsqueda y Filtros en Tiempo Real**: Filtra por nombre, empresa, modalidad (Texto, Multimodal), tipo (*Propietario*, *Open Weights*) o tamaño de ventana de contexto.
- 📊 **Benchmarks Oficiales Estandarizados**: Revisa métricas clave como **MMLU**, **GPQA**, **AIME** y **SWE-bench** en barras visuales de desempeño.
- ⚡ **Ultrarrápido y Sin Dependencias**: Carga instantánea con JavaScript y CSS nativo, sin frameworks pesados ni rastreadores.

---

## 🏁 Inicio Rápido (1 Clic)

### 🪟 En Windows
Haz doble clic en el archivo:
```
INICIAR-WINDOWS.bat
```
*(Detectará automáticamente Python o Node.js y abrirá la aplicación en tu navegador en `http://localhost:8080`)*.

---

### 🍎 En macOS o 🐧 Linux
Ejecuta en tu terminal:
```bash
./INICIAR-MAC-LINUX.sh
```

---

### 💻 Manualmente con cualquier servidor local

| Entorno | Comando | Dirección |
| :--- | :--- | :--- |
| **Python** | `python -m http.server 8080` *(o `py -m http.server 8080`)* | `http://localhost:8080` |
| **Node.js** | `npx serve .` | `http://localhost:3000` |
| **VS Code** | Clic derecho en `index.html` ➔ *Open with Live Server* | Automático |

> ⚠️ **Nota:** No abras `index.html` con doble clic directo como archivo (`file:///`), ya que el navegador requiere un servidor web local para cargar el archivo `data/models.json` por seguridad (`fetch API`).

---

## 📖 Guía de Uso

```
┌──────────────────────────────────────────────────────────────┐
│  λ LLM Atlas                                    [☼ Cambiar]  │
├──────────────────────────────────────────────────────────────┤
│  Encuentra el LLM adecuado.                                  │
│  [ ⌕ Buscar empresa, modelo, benchmark...                  ] │
├──────────────────────────────────────────────────────────────┤
│  28 modelos · 8 empresas   [☷ Filtros]  Ordenar: [Score  ▼] │
└──────────────────────────────────────────────────────────────┘
```

1. **Buscar y Filtrar**:
   - Escribe en la barra de búsqueda para encontrar cualquier modelo o benchmark (ej: `Claude`, `DeepSeek`, `SWE-bench`, `Multimodal`).
   - Usa el botón **☷ Filtros** para filtrar por tipo de licencia o tamaño mínimo de contexto (`128K+`, `1M+`, etc.).

2. **Explorar Versiones de Empresa**:
   - Cada tarjeta muestra la empresa, cantidad de versiones disponibles y el *Top Score*.
   - Las versiones dentro de cada tarjeta están ordenadas de la más nueva a la más antigua.

3. **Ver Detalles Técnicos**:
   - Haz clic en **Detalles** en cualquier modelo para ver su ficha técnica completa, modalidades soportadas y barras gráficas de benchmarks.

4. **Comparar Modelos**:
   - Marca la casilla **Comparar** en los modelos que desees (hasta 5).
   - Haz clic en el botón **Comparar** de la barra inferior flotante para abrir la matriz de comparación interactiva.

---

## 🏛️ Empresas y Familias de Modelos Indexadas

| Empresa | Modelos Principales Indexados (Nuevos arriba) |
| :--- | :--- |
| **OpenAI** | **GPT Sol**, **GPT Luna**, **GPT-5**, OpenAI o3, GPT-4.5, OpenAI o3-mini, OpenAI o1, GPT-4o |
| **Anthropic** | **Claude Fable**, **Claude Mythos**, Claude Opus 4.1, Claude 3.7 Sonnet, Claude 3.5 Sonnet, Claude 3.5 Haiku |
| **Google** | **Google Flash 7**, **Gemini 3.0 Ultra**, Gemini 2.5 Pro, Gemini 2.0 Pro, Gemini 2.0 Flash, Gemini 1.5 Pro |
| **DeepSeek** | **DeepSeek-R2**, **DeepSeek-V4**, DeepSeek-R1, DeepSeek-V3 |
| **Meta** | **Llama 4.5 Omni**, Llama 4 Maverick, Llama 3.3 70B, Llama 3.1 405B |
| **xAI** | **Grok 5**, **Grok 4.5**, Grok 4, Grok 3, Grok 2 |
| **Alibaba** | **Qwen 3.5 Omni**, Qwen3 235B, Qwen 2.5 Max, Qwen 2.5 Coder 32B |
| **Mistral AI** | **Mistral Nexus 4**, Mistral Medium 3, Mistral Large 2, Codestral 25.01 |

---

## 🚀 Despliegue en Producción

Puedes publicar este catálogo gratis y en 1 minuto en cualquier plataforma estática:

- **GitHub Pages**: Sube el repositorio y activa *Settings* ➔ *Pages* ➔ *Deploy from branch main*.
- **Vercel**: `vercel deploy`
- **Netlify**: Arrastra la carpeta del proyecto a [app.netlify.com/drop](https://app.netlify.com/drop).
- **Cloudflare Pages**: Conecta tu repositorio de GitHub y selecciona el directorio raíz.

---

## 📁 Documentación para Desarrolladores

Si deseas extender o personalizar la plataforma, consulta la documentación en `docs/`:
- [CONTEXT.md](file:///c:/Users/Rod/Desktop/code/Atlas/CONTEXT.md) — Contexto integral del dominio y proyecto.
- [ARCHITECTURE.md](file:///c:/Users/Rod/Desktop/code/Atlas/docs/ARCHITECTURE.md) — Arquitectura de software y flujo de datos.
- [DATA_POLICY.md](file:///c:/Users/Rod/Desktop/code/Atlas/docs/DATA_POLICY.md) — Metodología de benchmarks y normalización.
- [ROADMAP.md](file:///c:/Users/Rod/Desktop/code/Atlas/docs/ROADMAP.md) — Próximas funcionalidades y mejoras planificadas.

---

## 📄 Licencia

Distribuido bajo la Licencia MIT. Consulta el código fuente y úsalo libremente para tus proyectos personales o comerciales.
