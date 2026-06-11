const db = db.getSiblingDB('cookflow');

// ── 1. CREAR COLECCIONES CON VALIDADORES ─────────────────────
const existing = db.getCollectionNames();
print("Colecciones existentes:", existing);

// Coleccion recetas
if (!existing.includes('recetas')) {
    db.createCollection('recetas', {
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: ['titulo', 'dificultad', 'tiempo', 'porciones',
                    'autor_id', 'fecha', 'preparacion', 'cantidades'],
                properties: {
                    titulo: { bsonType: 'string', minLength: 3, maxLength: 200 },
                    dificultad: { enum: ['facil', 'media', 'dificil', 'experto'] },
                    tiempo: { bsonType: 'int', minimum: 1, maximum: 1440 },
                    porciones: { bsonType: 'int', minimum: 1 },
                    score_promedio: { bsonType: 'double', minimum: 0, maximum: 5 },
                    idioma: { enum: ['es', 'en', 'pt', 'fr', 'de', 'it', 'zh', 'ja'] },
                    autor_id: { bsonType: 'objectId' },
                    preparacion: { bsonType: 'array', minItems: 1 },
                    cantidades: { bsonType: 'array', minItems: 1 }
                }
            }
        },
        validationLevel: 'moderate',
        validationAction: 'warn'
    });
    print("Coleccion recetas creada");
} else {
    db.runCommand({
        collMod: 'recetas',
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: ['titulo', 'dificultad', 'tiempo', 'porciones',
                    'autor_id', 'fecha', 'preparacion', 'cantidades'],
                properties: {
                    titulo: { bsonType: 'string', minLength: 3, maxLength: 200 },
                    dificultad: { enum: ['facil', 'media', 'dificil', 'experto'] },
                    tiempo: { bsonType: 'int', minimum: 1, maximum: 1440 },
                    porciones: { bsonType: 'int', minimum: 1 },
                    score_promedio: { bsonType: 'double', minimum: 0, maximum: 5 },
                    idioma: { enum: ['es', 'en', 'pt', 'fr', 'de', 'it', 'zh', 'ja'] },
                    autor_id: { bsonType: 'objectId' },
                    preparacion: { bsonType: 'array', minItems: 1 },
                    cantidades: { bsonType: 'array', minItems: 1 }
                }
            }
        },
        validationLevel: 'moderate',
        validationAction: 'warn'
    });
    print("Coleccion recetas ya existe — validador actualizado");
}

// Coleccion chunks_embeddings
if (!existing.includes('chunks_embeddings')) {
    db.createCollection('chunks_embeddings', {
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: ['doc_id', 'chunk_index', 'estrategia_chunking',
                    'chunk_texto', 'embedding', 'modelo'],
                properties: {
                    doc_id: { bsonType: 'string' },
                    chunk_index: { bsonType: ['int', 'string'] },
                    estrategia_chunking: { enum: ['fixed-size', 'sentence-aware', 'semantic'] },
                    chunk_texto: { bsonType: 'string', minLength: 20 },
                    embedding: { bsonType: 'array', minItems: 384, maxItems: 384 },
                    modelo: { enum: ['all-MiniLM-L6-v2'] }
                }
            }
        },
        validationLevel: 'moderate',
        validationAction: 'error'
    });
    print("Coleccion chunks_embeddings creada");
} else {
    db.runCommand({
        collMod: 'chunks_embeddings',
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: ['doc_id', 'chunk_index', 'estrategia_chunking',
                    'chunk_texto', 'embedding', 'modelo'],
                properties: {
                    doc_id: { bsonType: 'string' },
                    chunk_index: { bsonType: ['int', 'string'] },
                    estrategia_chunking: { enum: ['fixed-size', 'sentence-aware', 'semantic'] },
                    chunk_texto: { bsonType: 'string', minLength: 20 },
                    embedding: { bsonType: 'array', minItems: 384, maxItems: 384 },
                    modelo: { enum: ['all-MiniLM-L6-v2'] }
                }
            }
        },
        validationLevel: 'moderate',
        validationAction: 'error'
    });
    print("Coleccion chunks_embeddings ya existe — validador actualizado");
}

// Colecciones sin validador estricto
const simples = [
    'ingredientes', 'perfiles_usuarios', 'historial_cocciones',
    'menus_semanales', 'retos_culinarios', 'valoraciones', 'imagenes_embeddings'
];
for (const nombre of simples) {
    if (!existing.includes(nombre)) {
        db.createCollection(nombre);
        print("Coleccion " + nombre + " creada");
    } else {
        print("Coleccion " + nombre + " ya existe, se omite");
    }
}

// ── 2. CREAR INDICES ──────────────────────────────────────────
print("\nCreando indices...");

db.recetas.createIndex({ fecha: 1, idioma: 1 }, { name: 'idx_recetas_fecha_idioma' });
db.recetas.createIndex({ titulo: 'text', tags: 'text' }, { name: 'idx_recetas_texto' });
db.recetas.createIndex({ autor_id: 1, score_promedio: -1 }, { name: 'idx_recetas_autor_score' });

db.chunks_embeddings.createIndex({ estrategia_chunking: 1 }, { name: 'idx_chunks_estrategia' });
db.chunks_embeddings.createIndex({ doc_id: 1 }, { name: 'idx_chunks_docid' });
db.chunks_embeddings.createIndex({ 'meta.dificultad': 1, 'meta.calorias': 1 }, { name: 'idx_chunks_meta' });

db.historial_cocciones.createIndex({ usuario_id: 1, fecha: -1 }, { name: 'idx_historial_usuario_fecha' });
db.historial_cocciones.createIndex({ receta_id: 1 }, { name: 'idx_historial_receta' });

db.menus_semanales.createIndex({ usuario_id: 1, semana_inicio: -1 }, { name: 'idx_menus_usuario' });

db.valoraciones.createIndex({ receta_id: 1, fecha: -1 }, { name: 'idx_valoraciones_receta' });

db.imagenes_embeddings.createIndex({ receta_id: 1 }, { name: 'idx_imagenes_receta' });

print("\nCreando indices vectoriales...");

// Indice vectorial para chunks de texto — MiniLM 384 dimensiones
try {
    db.chunks_embeddings.createSearchIndex({
        name: "vector_index_texto",
        type: "vectorSearch",
        definition: {
            fields: [
                {
                    type: "vector",
                    path: "embedding",
                    numDimensions: 384,
                    similarity: "cosine"
                },

                { type: "filter", path: "estrategia_chunking" },
                { type: "filter", path: "tipo_fuente" },
                { type: "filter", path: "id_receta_referencia" },

                // filtros para búsquedas semánticas avanzadas
                { type: "filter", path: "meta.dificultad" },
                { type: "filter", path: "meta.calorias" },
                { type: "filter", path: "meta.tiempo" },
                { type: "filter", path: "meta.idioma" }
            ]
        }
    });

    print("Indice vector_index_texto creado");
} catch (e) {
    print("Indice vector_index_texto ya existe o error: " + e.message);
}

// Indice vectorial para imagenes — CLIP 512 dimensiones
db.imagenes_embeddings.createSearchIndex({
    name: "vector_index_imagenes",
    type: "vectorSearch",
    definition: {
        fields: [
            { type: "vector", path: "embedding_clip", numDimensions: 512, similarity: "cosine" },
            { type: "filter", path: "receta_id" },
            { type: "filter", path: "etiquetas" }
        ]
    }
});
print("Indice vector_index_imagenes creado en imagenes_embeddings");

print("Indices creados exitosamente");
print("\nInicializacion completada.");
