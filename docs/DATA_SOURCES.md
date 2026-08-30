# Fuentes de Datos y Estrategia de Ingesta — LLM Atlas

LLM Atlas consolida y normaliza datos provenientes de los benchmarks y leaderboards públicos más confiables del sector.

## 🔗 Portales y Leaderboards Sincronizados

1. **[Artificial Analysis – LLM Leaderboard](https://artificialanalysis.ai/leaderboards/models)**
   - Métricas: Intelligence Index, Coding Index, SWE-bench, Tokens/segundo, TTFT y ventana de contexto.
2. **[Opper AI – LLM Leaderboard](https://opper.ai/llm-leaderboard)**
   - Métricas: Intelligence, Coding, Agentic, Math y precios por token.
3. **[LMArena / Arena – Chatbot Arena](https://lmarena.ai/)**
   - Métricas: Arena Elo, Coding Elo, Hard Prompts Elo basado en blind preference tests.
4. **[Hugging Face – Leaderboards & Evaluations](https://huggingface.co/docs/leaderboards/index)**
   - Métricas: Open LLM Leaderboard (MMLU-PRO, GPQA, IFEval, MATH).
5. **[LLM Benchmarks](https://llmbenchmarks.io/es/)**
   - Métricas: Rendimiento de inferencia, tokens por segundo y latencia.
6. **[BenchLM – LLM Leaderboard](https://www.benchlm.ai/)**
   - Métricas: Razonamiento, seguimiento de instrucciones y coherencia de agentes.

---

## 💻 Comando de Actualización

Para sincronizar y actualizar el catálogo `data/models.json` con las últimas métricas:

```bash
node scripts/sync_leaderboards.js
```

O con Python:
```bash
python scripts/update_catalog.py
```

El script genera automáticamente un respaldo en `data/backups/` antes de aplicar cambios.
