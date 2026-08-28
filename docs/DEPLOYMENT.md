# Despliegue

## Prueba local

```bash
python -m http.server 8080
```

## Hosting estático

La V1 funciona en cualquier hosting de archivos estáticos.

Pasos generales:
1. sube todo el contenido de la carpeta;
2. configura `index.html` como página inicial;
3. habilita HTTPS;
4. comprueba que `/data/models.json` responda;
5. prueba móvil y escritorio.

## Backend

Cuando se agreguen APIs:
- usar HTTPS;
- guardar secretos únicamente en variables de entorno;
- añadir rate limiting;
- validar respuestas externas;
- registrar errores;
- cachear datos;
- aplicar CORS de forma restrictiva.

