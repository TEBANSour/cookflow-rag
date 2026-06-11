# CookFlow RAG — Sistema de Recuperación y Generación Aumentada

Sistema RAG gastronómico construido sobre MongoDB Atlas con embeddings de texto MiniLM, embeddings multimodales CLIP y generación de respuestas con Groq Llama 3.1. Incluye búsqueda híbrida con filtros estructurados y evaluación automática con RAGAS.

---

## Arquitectura general

```
MongoDB Atlas (recetas / historial_cocciones / ingredientes)
               ↓
    Extracción de texto por campo
    (ingredientes → fixed-size)
    (preparacion  → sentence-aware)
    (notas        → semantic)
               ↓
    Embeddings MiniLM 384 dims
               ↓
    chunks_embeddings (campo meta con dificultad, calorias, tiempo, idioma)
               ↓
    Atlas Vector Search ($vectorSearch + filtros sobre meta)
               ↓
    Groq Llama 3.1 → Respuesta
               ↓
    auditoria_rag + evaluaciones_rag (RAGAS)
```

---

## Estructura del repositorio

```
cookflow-rag/
│
├── notebooks/
│   ├── ingesta_chunks.ipynb       # Ingesta desde MongoDB, chunking y embeddings MiniLM
│   ├── llm_retrieval.ipynb        # Retrieval semántico + pipeline RAG texto→texto
│   └── multimodal_clip.ipynb      # Embeddings CLIP, búsqueda multimodal y RAGAS
│
├── scripts/
│   ├── init_collections.js        # Crea colecciones, validadores e índices en Atlas
│   ├── ingredientes.js
│   ├── perfiles_usuarios.js
│   ├── recetas.js
│   ├── valoraciones.js
│   ├── historial_cocciones.js
│   ├── menus_semanales.js
│   └── retos_culinarios.js
│
├── main.py                           # API REST FastAPI
├── requirements.txt
└── README.md
```

---

## Colecciones MongoDB

| Colección | Documentos | Descripción |
|---|---|---|
| `recetas` | 50 | Recetas con pasos, cantidades, nutrición e imágenes |
| `ingredientes` | 50 | Catálogo con info nutricional y alergenos |
| `perfiles_usuarios` | 10 | Usuarios con despensa y preferencias dietéticas |
| `valoraciones` | 35 | Ratings y comentarios de recetas |
| `historial_cocciones` | 35 | Registro de cocciones con notas y variaciones |
| `menus_semanales` | 5 | Planificación semanal con lista de compras |
| `retos_culinarios` | 5 | Retos activos de la plataforma |
| `chunks_embeddings` | 242 | Chunks vectorizados con MiniLM (campo meta para filtros híbridos) |
| `imagenes_embeddings` | 50 | Embeddings CLIP de imágenes de recetas |
| `auditoria_rag` | variable | Logs de consultas RAG (texto y multimodal) |
| `evaluaciones_rag` | 10 | Métricas RAGAS: faithfulness y answer_relevancy |

---

## Estrategias de chunking

| Estrategia | Fuente de texto | Parámetros | Chunks generados |
|---|---|---|---|
| `fixed-size` | Ingredientes + nutrición | chunk_size=256, overlap=32 | 100 |
| `sentence-aware` | Pasos de preparación | max_sentences=5, overlap=1 | 50 |
| `semantic` | Notas de historial | threshold=0.80, overlap=0 | 92 |

Cada chunk incluye el campo `meta` con `dificultad`, `calorias`, `tiempo` e `idioma` de la receta, lo que habilita filtros híbridos dentro del propio `$vectorSearch`.

---

## Índices vectoriales en Atlas

| Índice | Colección | Campo | Dimensiones | Filtros declarados |
|---|---|---|---|---|
| `vector_index_texto` | `chunks_embeddings` | `embedding` | 384 | estrategia_chunking, tipo_fuente, meta.dificultad, meta.calorias, meta.tiempo, meta.idioma |
| `vector_index_imagenes` | `imagenes_embeddings` | `embedding_clip` | 512 | receta_id, etiquetas |

---

## Requisitos

- Python 3.10+
- Cuenta MongoDB Atlas (cluster M0 gratuito)
- API Key de Groq (gratuita en console.groq.com)

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/cookflow-rag.git
cd cookflow-rag
```

### 2. Instalar dependencias Python

```bash
pip install -r requirements.txt
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
DB_NAME=cookflow
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
LLM_MODEL=llama-3.1-8b-instant
```

Las credenciales nunca deben estar en el código. El `main.py` lanza un error en tiempo de arranque si `MONGODB_URI` o `GROQ_API_KEY` no están definidos.

### 4. Inicializar la base de datos

En MongoDB Compass Shell o mongosh, ejecutar los scripts en orden:

```bash
load("scripts/init_collections.js")
load("scripts/ingredientes.js")
load("scripts/perfiles_usuarios.js")
load("scripts/recetas.js")
load("scripts/valoraciones.js")
load("scripts/historial_cocciones.js")
load("scripts/menus_semanales.js")
load("scripts/retos_culinarios.js")
```

El script `init_collections.js` crea también los índices vectoriales en Atlas. Si los índices ya existen los omite sin error.

### 5. Ejecutar los notebooks en orden

Abrir en Google Colab con los secretos `MONGO_URI` y `GROQ_API_KEY` configurados:

1. `01_ingesta_chunks.ipynb` — lee recetas e historial desde MongoDB, aplica las tres estrategias de chunking, genera embeddings MiniLM y carga en `chunks_embeddings`
2. `02_llm_retrieval.ipynb` — prueba el pipeline RAG texto→texto y ejecuta el experimento comparativo de chunking
3. `03_multimodal_clip.ipynb` — vectoriza imágenes con CLIP, prueba búsqueda multimodal y ejecuta evaluación RAGAS

---

## API REST

### Iniciar el servidor

```bash
uvicorn main:app --reload --port 8000
```

La documentación interactiva Swagger queda disponible en:
```
http://localhost:8000/docs
```

---

### `GET /health`

Verifica conectividad con MongoDB y estado de los modelos.

```bash
curl http://localhost:8000/health
```

Respuesta:
```json
{
  "status": "ok",
  "mongodb": "conectado",
  "base_de_datos": "cookflow",
  "chunks_embeddings": 242,
  "auditoria_rag": 15,
  "embedding_model": "sentence-transformers/all-MiniLM-L6-v2",
  "llm_model": "llama-3.1-8b-instant",
  "vector_index": "vector_index_texto"
}
```

---

### `POST /search`

Búsqueda vectorial híbrida en `chunks_embeddings`. Devuelve los chunks más similares a la consulta, con filtros opcionales aplicados dentro del `$vectorSearch`.

```bash
curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "como evitar que se corte la leche de coco",
    "top_k": 5,
    "tipo_fuente": "receta",
    "dificultad": "facil",
    "max_tiempo": 30
  }'
```

Parámetros:

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `query` | string | ✅ | Consulta en lenguaje natural |
| `top_k` | int | ❌ | Número de resultados (default: 5) |
| `estrategia` | string | ❌ | `fixed-size`, `sentence-aware` o `semantic` |
| `tipo_fuente` | string | ❌ | `receta` o `nota_cocinero` |
| `dificultad` | string | ❌ | `facil`, `media`, `dificil` o `experto` |
| `max_calorias` | int | ❌ | Calorías máximas por porción |
| `max_tiempo` | int | ❌ | Tiempo máximo de preparación en minutos |
| `idioma` | string | ❌ | `es`, `en`, `pt`, `fr`, `de`, `it`, `zh`, `ja` |

Respuesta:
```json
{
  "query": "como evitar que se corte la leche de coco",
  "filtros_aplicados": { "tipo_fuente": "receta", "dificultad": "facil", "max_tiempo": 30 },
  "total_resultados": 3,
  "resultados": [
    {
      "chunk_id": "664a...f03_prep_1",
      "titulo_receta": "Pollo al Curry Express",
      "tipo_fuente": "receta",
      "estrategia_chunking": "sentence-aware",
      "texto_chunk": "Verter la leche de coco, bajar el fuego y dejar reducir durante 15 minutos.",
      "score": 0.8712
    }
  ]
}
```

---

### `POST /rag`

Pipeline RAG completo. Recupera contexto con búsqueda híbrida y genera respuesta con Groq Llama 3.1.

```bash
curl -X POST http://localhost:8000/rag \
  -H "Content-Type: application/json" \
  -d '{
    "query": "que ingredientes necesito para hacer ajiaco bogotano",
    "top_k": 5
  }'
```

Acepta los mismos filtros opcionales que `/search`.

Respuesta:
```json
{
  "query_id": "a1b2c3d4-...",
  "query": "que ingredientes necesito para hacer ajiaco bogotano",
  "respuesta": "Para preparar el Ajiaco Bogotano necesitas: 500gr de pechuga de pollo, 300gr de papa criolla...",
  "chunks_usados": 5,
  "filtros_aplicados": {},
  "modelo_llm": "llama-3.1-8b-instant",
  "fecha": "2026-06-05T14:32:11.000Z"
}
```

---

## Resultados del experimento de chunking

| Estrategia | Chunks | Long. promedio (chars) | Score promedio top-1 |
|---|---|---|---|
| `fixed-size` | 100 | 119.5 | 0.748 |
| `sentence-aware` | 50 | 345.0 | 0.772 |
| `semantic` | 92 | 88.3 | **0.793** |

**Conclusión:** semantic obtuvo el mayor score promedio global porque las notas de cocinero tienen lenguaje más cercano al lenguaje natural del usuario que los pasos técnicos. sentence-aware fue superior para consultas de técnica culinaria donde los pasos secuenciales son el texto más relevante.

---

## Evaluación RAGAS

| Métrica | Promedio | Descripción |
|---|---|---|
| Faithfulness | 0.638 | El 63.8% de las afirmaciones del LLM están respaldadas por el contexto recuperado |
| Answer Relevancy | 0.197 | Las respuestas son pertinentes pero el retrieval no siempre recupera chunks suficientemente específicos |

Evaluado con DeepSeek V3 via OpenRouter sobre las 10 consultas de prueba. Resultados almacenados en la colección `evaluaciones_rag`.

---

## Dependencias

```
fastapi
uvicorn
pymongo
sentence-transformers
transformers
torch
Pillow
openai
python-dotenv
pandas
requests
open-clip-torch
```

Instalar todo con:
```bash
pip install fastapi uvicorn pymongo sentence-transformers transformers torch Pillow openai python-dotenv pandas requests open-clip-torch
```

---

## Tecnologías

| Componente | Tecnología |
|---|---|
| Base de datos | MongoDB Atlas M0 |
| Búsqueda vectorial | Atlas Vector Search (knnVector HNSW) |
| Embeddings texto | all-MiniLM-L6-v2 (384 dims) |
| Embeddings imagen | clip-vit-base-patch32 (512 dims) |
| LLM pipeline | Groq — Llama 3.1 8B Instant |
| LLM evaluación | DeepSeek V3 via OpenRouter |
| Evaluación RAG | RAGAS (faithfulness + answer_relevancy) |
| API | FastAPI + Uvicorn |
| Notebooks | Google Colab |

---

## Universidad de Caldas — Bases de Datos No Relacionales 2026
