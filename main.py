"""
CookFlow RAG API
================
API REST para el sistema de Recuperación y Generación Aumentada (RAG)
construido sobre MongoDB Atlas con embeddings MiniLM y LLM Groq.

Endpoints:
  GET  /health  →  Estado del sistema
  POST /search  →  Búsqueda vectorial/híbrida en chunks_embeddings
  POST /rag     →  Respuesta generada por LLM con contexto de MongoDB

Ejecución:
  uvicorn main:app --reload --port 8000

Documentación automática:
  http://localhost:8000/docs
"""

import os
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# ── Configuración ─────────────────────────────────────────────────────────────

MONGODB_URI       = os.getenv("MONGODB_URI")
DB_NAME           = os.getenv("DB_NAME", "cookflow")
GROQ_API_KEY      = os.getenv("GROQ_API_KEY")
LLM_MODEL         = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")
VECTOR_INDEX_NAME = "vector_index_texto"
EMBEDDING_MODEL   = "sentence-transformers/all-MiniLM-L6-v2"

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI no está definido en las variables de entorno.")
if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY no está definido en las variables de entorno.")

# ── Conexiones ────────────────────────────────────────────────────────────────

mongo_client  = MongoClient(MONGODB_URI)
db            = mongo_client[DB_NAME]
chunks_col    = db["chunks_embeddings"]
auditoria_col = db["auditoria_rag"]

embedding_model = SentenceTransformer(EMBEDDING_MODEL)

groq_client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1"
)

# ── FastAPI ───────────────────────────────────────────────────────────────────

app = FastAPI(
    title="CookFlow RAG API",
    description=(
        "Sistema RAG gastronómico sobre MongoDB Atlas. "
        "Búsqueda vectorial con MiniLM 384 dims + filtros híbridos + Groq Llama 3.1."
    ),
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Modelos de entrada/salida ─────────────────────────────────────────────────

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5
    estrategia: Optional[str] = None    # "fixed-size" | "sentence-aware" | "semantic"
    tipo_fuente: Optional[str] = None   # "receta" | "nota_cocinero"
    dificultad: Optional[str] = None    # "facil" | "media" | "dificil" | "experto"
    max_calorias: Optional[int] = None  # ej: 400
    max_tiempo: Optional[int] = None    # en minutos, ej: 30
    idioma: Optional[str] = None        # "es" | "en" | "pt" | etc.

class ChunkResult(BaseModel):
    chunk_id: str
    titulo_receta: str
    tipo_fuente: str
    estrategia_chunking: str
    texto_chunk: str
    score: float

class SearchResponse(BaseModel):
    query: str
    filtros_aplicados: dict
    total_resultados: int
    resultados: List[ChunkResult]

class RAGRequest(BaseModel):
    query: str
    top_k: int = 5
    estrategia: Optional[str] = None
    tipo_fuente: Optional[str] = None
    dificultad: Optional[str] = None
    max_calorias: Optional[int] = None
    max_tiempo: Optional[int] = None
    idioma: Optional[str] = None

class RAGResponse(BaseModel):
    query_id: str
    query: str
    respuesta: str
    chunks_usados: int
    filtros_aplicados: dict
    modelo_llm: str
    fecha: str

# ── Funciones internas ────────────────────────────────────────────────────────

def embed_query(text: str) -> List[float]:
    return embedding_model.encode(text, normalize_embeddings=True).tolist()


def vector_search(
    query_vector: List[float],
    top_k: int = 5,
    estrategia: Optional[str] = None,
    tipo_fuente: Optional[str] = None,
    dificultad: Optional[str] = None,
    max_calorias: Optional[int] = None,
    max_tiempo: Optional[int] = None,
    idioma: Optional[str] = None,
) -> List[dict]:
    """
    Búsqueda híbrida en Atlas: similitud vectorial + filtros opcionales sobre
    campos estructurados y metadatos embebidos en el campo meta de cada chunk.
    """
    filters = []

    if estrategia:
        mapper = {"fixed": "fixed-size", "sentence": "sentence-aware", "semantic": "semantic"}
        estrategia = mapper.get(estrategia, estrategia)
        filters.append({"estrategia_chunking": {"$eq": estrategia}})

    if tipo_fuente:
        filters.append({"tipo_fuente": {"$eq": tipo_fuente}})

    if dificultad:
        filters.append({"meta.dificultad": {"$eq": dificultad}})
    if max_calorias:
        filters.append({"meta.calorias": {"$lte": max_calorias}})
    if max_tiempo:
        filters.append({"meta.tiempo": {"$lte": max_tiempo}})
    if idioma:
        filters.append({"meta.idioma": {"$eq": idioma}})

    vector_stage = {
        "$vectorSearch": {
            "index": VECTOR_INDEX_NAME,
            "path": "embedding",
            "queryVector": query_vector,
            "numCandidates": max(150, top_k * 15),
            "limit": top_k
        }
    }
    if filters:
        vector_stage["$vectorSearch"]["filter"] = (
            {"$and": filters} if len(filters) > 1 else filters[0]
        )

    pipeline = [
        vector_stage,
        {
            "$project": {
                "_id": 0,
                "chunk_id": 1,
                "titulo_receta": 1,
                "tipo_fuente": 1,
                "estrategia_chunking": 1,
                "texto_chunk": 1,
                "meta": 1,
                "score": {"$meta": "vectorSearchScore"}
            }
        }
    ]

    return list(chunks_col.aggregate(pipeline))


def build_context(chunks: List[dict], max_chars: int = 3000) -> str:
    lines = []
    total = 0
    for i, chunk in enumerate(chunks, 1):
        titulo = chunk.get("titulo_receta", "Receta CookFlow")
        texto  = chunk.get("texto_chunk", "")
        bloque = f"[Fragmento {i}] {titulo}\n{texto}"
        if total + len(bloque) > max_chars:
            break
        lines.append(bloque)
        total += len(bloque)
    return "\n\n".join(lines)


def ask_llm(question: str, context: str, filtros: dict) -> str:
    filtros_activos = [f"{k}={v}" for k, v in filtros.items() if v is not None]
    filtros_str = ", ".join(filtros_activos) if filtros_activos else "ninguno"

    system_prompt = (
        "Eres CookFlow-AI, un asistente gastronómico experto. "
        "Responde usando ÚNICAMENTE la información del contexto proporcionado. "
        "Si la información no está en el contexto, dilo claramente. "
        "Responde siempre en español."
    )
    user_prompt = (
        f"Filtros aplicados: {filtros_str}\n"
        f"Los resultados ya están filtrados. Responde basándote en las recetas recuperadas.\n\n"
        f"Contexto:\n{context}\n\n"
        f"Pregunta: {question}"
    )

    response = groq_client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_prompt}
        ],
        temperature=0.3,
        max_tokens=800
    )
    return response.choices[0].message.content.strip()


def save_audit(query_id, query, respuesta, chunks_usados, filtros):
    try:
        auditoria_col.insert_one({
            "id_consulta":      query_id,
            "tipo_registro":    "auditoria_rag",
            "estrategia_flujo": "text_to_text",
            "interaccion": {
                "question": query,
                "answer":   respuesta
            },
            "filtros":       filtros,
            "chunks_usados": chunks_usados,
            "modelo_llm":    LLM_MODEL,
            "fecha":         datetime.now(timezone.utc)
        })
    except Exception:
        pass


def build_filtros_dict(req) -> dict:
    return {
        "estrategia":   req.estrategia,
        "tipo_fuente":  req.tipo_fuente,
        "dificultad":   req.dificultad,
        "max_calorias": req.max_calorias,
        "max_tiempo":   req.max_tiempo,
        "idioma":       req.idioma,
    }

# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "sistema":   "CookFlow RAG API",
        "version":   "1.0.0",
        "endpoints": {
            "GET /health":  "Estado del sistema y MongoDB",
            "POST /search": "Búsqueda vectorial híbrida en chunks_embeddings",
            "POST /rag":    "Pipeline RAG completo con LLM"
        },
        "docs": "/docs"
    }


@app.get("/health")
def health():
    try:
        return {
            "status":            "ok",
            "mongodb":           "conectado",
            "base_de_datos":     DB_NAME,
            "chunks_embeddings": chunks_col.count_documents({}),
            "auditoria_rag":     auditoria_col.count_documents({}),
            "embedding_model":   EMBEDDING_MODEL,
            "llm_model":         LLM_MODEL,
            "vector_index":      VECTOR_INDEX_NAME,
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Error de conectividad: {e}")


@app.post("/search", response_model=SearchResponse)
def search(request: SearchRequest):
    """
    Búsqueda vectorial híbrida en chunks_embeddings.

    Combina similitud semántica (Atlas Vector Search kNN) con filtros
    estructurados opcionales aplicados dentro del propio $vectorSearch,
    lo que reduce el espacio de búsqueda antes del ranking por similitud.

    Filtros opcionales:
    - **estrategia**: fixed-size | sentence-aware | semantic
    - **tipo_fuente**: receta | nota_cocinero
    - **dificultad**: facil | media | dificil | experto
    - **max_calorias**: calorías máximas por porción
    - **max_tiempo**: tiempo máximo de preparación en minutos
    - **idioma**: es | en | pt | fr | de | it | zh | ja
    """
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="El campo 'query' no puede estar vacío.")

    filtros = build_filtros_dict(request)

    try:
        qvec   = embed_query(request.query)
        chunks = vector_search(
            qvec, request.top_k,
            request.estrategia, request.tipo_fuente,
            request.dificultad, request.max_calorias,
            request.max_tiempo, request.idioma
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en búsqueda vectorial: {e}")

    resultados = [
        ChunkResult(
            chunk_id            = str(c.get("chunk_id", "")),
            titulo_receta       = c.get("titulo_receta", ""),
            tipo_fuente         = c.get("tipo_fuente", ""),
            estrategia_chunking = c.get("estrategia_chunking", ""),
            texto_chunk         = c.get("texto_chunk", ""),
            score               = float(c.get("score", 0.0))
        )
        for c in chunks
    ]

    return SearchResponse(
        query             = request.query,
        filtros_aplicados = {k: v for k, v in filtros.items() if v is not None},
        total_resultados  = len(resultados),
        resultados        = resultados
    )


@app.post("/rag", response_model=RAGResponse)
def rag(request: RAGRequest):
    """
    Pipeline RAG completo: recupera contexto de MongoDB y genera respuesta con LLM.

    El campo meta de cada chunk permite búsqueda híbrida real: el filtro se
    aplica dentro del $vectorSearch antes del ranking por similitud, no después.
    Esto es Arquitectura B de un solo pipeline, más eficiente que dos consultas separadas.

    Filtros opcionales: mismos que /search.
    """
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="El campo 'query' no puede estar vacío.")

    filtros = build_filtros_dict(request)

    try:
        qvec   = embed_query(request.query)
        chunks = vector_search(
            qvec, request.top_k,
            request.estrategia, request.tipo_fuente,
            request.dificultad, request.max_calorias,
            request.max_tiempo, request.idioma
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en recuperación vectorial: {e}")

    if not chunks:
        raise HTTPException(
            status_code=404,
            detail="No se encontraron chunks relevantes. Intenta con filtros menos restrictivos."
        )

    context  = build_context(chunks)

    try:
        respuesta = ask_llm(request.query, context, filtros)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error en generación LLM: {e}")

    query_id = str(uuid.uuid4())
    save_audit(query_id, request.query, respuesta, len(chunks), filtros)

    return RAGResponse(
        query_id          = query_id,
        query             = request.query,
        respuesta         = respuesta,
        chunks_usados     = len(chunks),
        filtros_aplicados = {k: v for k, v in filtros.items() if v is not None},
        modelo_llm        = LLM_MODEL,
        fecha             = datetime.now(timezone.utc).isoformat()
    )
