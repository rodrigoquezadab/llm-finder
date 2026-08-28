# Arquitectura

## Frontend

HTML + CSS + JavaScript vanilla.

Capas:
1. presentación;
2. estado local;
3. filtrado/ordenamiento;
4. comparación;
5. consumo de catálogo.

## Backend recomendado

Para convertirlo en un servicio vivo:

```text
Fuentes oficiales / leaderboards
            |
            v
     Collectors / ETL
            |
            v
       Normalizador
            |
            v
        PostgreSQL
            |
            v
          REST API
            |
            v
     HTML/CSS/JavaScript
```

## Entidades

### Model
Identidad y capacidades.

### BenchmarkResult
- modelId
- benchmark
- score
- unit
- benchmarkVersion
- methodology
- measuredAt
- sourceUrl

### Provider
- nombre
- web
- documentación

### Availability
- provider
- endpoint
- region
- status
- checkedAt

### Pricing
- inputPerMillion
- outputPerMillion
- currency
- effectiveAt
- sourceUrl

### HistoricalSnapshot
Permite graficar evolución temporal.

## Atlas Score

El score debe ser calculado a partir de resultados normalizados, no copiado de un leaderboard.

Ejemplo conceptual:

- Reasoning 25%
- Coding 20%
- Knowledge 15%
- Math 15%
- Instruction 10%
- Factuality 10%
- Speed 5%

Los pesos deben ser configurables y publicados para que el ranking sea reproducible.

