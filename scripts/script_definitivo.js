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

db.ingredientes.insertMany([
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d01"),
    nombre: "Pechuga de pollo",
    categoria: "proteina animal",
    alternativas: ["muslo de pollo", "pechuga de pavo"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 165, proteinas: 31, grasas: 3.6, carbohidratos: 0 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d02"),
    nombre: "Papa criolla",
    categoria: "tuberculo",
    alternativas: ["papa pastusa", "papa nevada"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 77, proteinas: 2, grasas: 0.1, carbohidratos: 17 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d03"),
    nombre: "Papa pastusa",
    categoria: "tuberculo",
    alternativas: ["papa nevada", "papa criolla"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 77, proteinas: 2, grasas: 0.1, carbohidratos: 17 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d04"),
    nombre: "Papa sabanera",
    categoria: "tuberculo",
    alternativas: ["papa pastusa"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 79, proteinas: 2, grasas: 0.1, carbohidratos: 18 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d05"),
    nombre: "Mazorca de maiz",
    categoria: "cereal",
    alternativas: ["maiz en grano"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 86, proteinas: 3.2, grasas: 1.2, carbohidratos: 19 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d06"),
    nombre: "Guascas",
    categoria: "hierba aromatica",
    alternativas: [],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 5, proteinas: 0.3, grasas: 0.1, carbohidratos: 0.8 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d07"),
    nombre: "Frijoles rojos",
    categoria: "legumbre",
    alternativas: ["frijoles negros", "frijoles blancos"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 127, proteinas: 8.7, grasas: 0.5, carbohidratos: 23 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d08"),
    nombre: "Chicharron",
    categoria: "proteina animal",
    alternativas: ["tocino frito"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 544, proteinas: 31, grasas: 47, carbohidratos: 0 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d09"),
    nombre: "Chorizo",
    categoria: "embutido",
    alternativas: ["longaniza"],
    alergenos: ["gluten"],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 290, proteinas: 16, grasas: 25, carbohidratos: 2 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d10"),
    nombre: "Leche de coco",
    categoria: "lacteo vegetal",
    alternativas: ["crema de coco"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 197, proteinas: 2, grasas: 21, carbohidratos: 3 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d11"),
    nombre: "Curry en polvo",
    categoria: "especia",
    alternativas: ["pasta de curry amarillo"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 20, proteinas: 1, grasas: 1, carbohidratos: 3 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d12"),
    nombre: "Yuca",
    categoria: "tuberculo",
    alternativas: ["papa", "platano verde"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 160, proteinas: 1.4, grasas: 0.3, carbohidratos: 38 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d13"),
    nombre: "Platano verde",
    categoria: "fruta",
    alternativas: ["yuca"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 122, proteinas: 1.3, grasas: 0.4, carbohidratos: 32 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d14"),
    nombre: "Camarones frescos",
    categoria: "marisco",
    alternativas: ["langostinos"],
    alergenos: ["mariscos"],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 99, proteinas: 24, grasas: 0.3, carbohidratos: 0 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d15"),
    nombre: "Limon",
    categoria: "citrico",
    alternativas: ["lima"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 29, proteinas: 1.1, grasas: 0.3, carbohidratos: 9 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d16"),
    nombre: "Espagueti",
    categoria: "pasta",
    alternativas: ["linguini", "fettuccine"],
    alergenos: ["gluten"],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 158, proteinas: 5.8, grasas: 0.9, carbohidratos: 31 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d17"),
    nombre: "Guanciale",
    categoria: "embutido",
    alternativas: ["tocino", "panceta"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 655, proteinas: 11, grasas: 68, carbohidratos: 0 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d18"),
    nombre: "Pecorino romano",
    categoria: "lacteo",
    alternativas: ["parmesano"],
    alergenos: ["lacteos"],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 387, proteinas: 32, grasas: 28, carbohidratos: 0 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d19"),
    nombre: "Costilla de res",
    categoria: "proteina animal",
    alternativas: ["costilla de cerdo"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 291, proteinas: 26, grasas: 20, carbohidratos: 0 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d20"),
    nombre: "Masa de maiz",
    categoria: "cereal",
    alternativas: ["harina de maiz precocida"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 362, proteinas: 9, grasas: 4, carbohidratos: 74 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d21"),
    nombre: "Hogao",
    categoria: "preparacion base",
    alternativas: ["sofrito"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 45, proteinas: 1, grasas: 2, carbohidratos: 6 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d22"),
    nombre: "Arroz blanco",
    categoria: "cereal",
    alternativas: ["arroz integral", "arroz basmati"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 130, proteinas: 2.7, grasas: 0.3, carbohidratos: 28 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d23"),
    nombre: "Aguacate Hass",
    categoria: "fruta",
    alternativas: ["aguacate criollo"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 160, proteinas: 2, grasas: 15, carbohidratos: 9 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d24"),
    nombre: "Tomate chonto",
    categoria: "verdura",
    alternativas: ["tomate pera", "tomate cherry"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 18, proteinas: 0.9, grasas: 0.2, carbohidratos: 3.9 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d25"),
    nombre: "Cebolla larga",
    categoria: "verdura",
    alternativas: ["cebolla cabezona", "puerro"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 32, proteinas: 1.8, grasas: 0.2, carbohidratos: 7 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"),
    nombre: "Ajo",
    categoria: "condimento",
    alternativas: ["ajo en polvo"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 149, proteinas: 6.4, grasas: 0.5, carbohidratos: 33 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d27"),
    nombre: "Arroz arborio",
    categoria: "cereal",
    alternativas: ["arroz carnaroli"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 150, proteinas: 3, grasas: 0.3, carbohidratos: 33 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d28"),
    nombre: "Champiñones",
    categoria: "hongo",
    alternativas: ["portobello", "shiitake"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 22, proteinas: 3.1, grasas: 0.3, carbohidratos: 3.3 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d29"),
    nombre: "Parmesano",
    categoria: "lacteo",
    alternativas: ["pecorino romano", "grana padano"],
    alergenos: ["lacteos"],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 431, proteinas: 38, grasas: 29, carbohidratos: 4 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d30"),
    nombre: "Pollo entero",
    categoria: "proteina animal",
    alternativas: ["gallina entera"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 215, proteinas: 18, grasas: 15, carbohidratos: 0 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d31"),
    nombre: "Tomates maduros",
    categoria: "verdura",
    alternativas: ["tomate triturado en lata"],
    alergenos: [],
    temporada: ["verano"],
    nutricion_base: { calorias: 18, proteinas: 0.9, grasas: 0.2, carbohidratos: 3.9 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d32"),
    nombre: "Pepino",
    categoria: "verdura",
    alternativas: ["pepino persa"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 15, proteinas: 0.7, grasas: 0.1, carbohidratos: 3.6 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d33"),
    nombre: "Aceite de oliva virgen extra",
    categoria: "grasa",
    alternativas: ["aceite de girasol"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 884, proteinas: 0, grasas: 100, carbohidratos: 0 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d34"),
    nombre: "Arroz bomba",
    categoria: "cereal",
    alternativas: ["arroz redondo"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 148, proteinas: 2.7, grasas: 0.3, carbohidratos: 33 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d35"),
    nombre: "Azafran",
    categoria: "especia",
    alternativas: ["colorante alimentario amarillo"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 310, proteinas: 11, grasas: 6, carbohidratos: 65 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d36"),
    nombre: "Lentejas verdes",
    categoria: "legumbre",
    alternativas: ["lentejas pardinas", "lentejas rojas"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 116, proteinas: 9, grasas: 0.4, carbohidratos: 20 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d37"),
    nombre: "Mascarpone",
    categoria: "lacteo",
    alternativas: ["queso crema"],
    alergenos: ["lacteos"],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 430, proteinas: 6, grasas: 44, carbohidratos: 4 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d38"),
    nombre: "Savoiardi",
    categoria: "galleta",
    alternativas: ["bizcochos de soletilla"],
    alergenos: ["gluten", "huevo"],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 383, proteinas: 9, grasas: 8, carbohidratos: 70 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d39"),
    nombre: "Garbanzos cocidos",
    categoria: "legumbre",
    alternativas: ["frijoles blancos"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 164, proteinas: 8.9, grasas: 2.6, carbohidratos: 27 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d40"),
    nombre: "Tahini",
    categoria: "pasta de semillas",
    alternativas: [],
    alergenos: ["sesamo"],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 595, proteinas: 17, grasas: 53, carbohidratos: 21 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d41"),
    nombre: "Esparragos verdes",
    categoria: "verdura",
    alternativas: ["esparragos blancos"],
    alergenos: [],
    temporada: ["primavera"],
    nutricion_base: { calorias: 20, proteinas: 2.2, grasas: 0.1, carbohidratos: 3.9 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d42"),
    nombre: "Aji panca",
    categoria: "chile",
    alternativas: ["aji colorado"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 280, proteinas: 12, grasas: 10, carbohidratos: 50 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d43"),
    nombre: "Salmon grado sashimi",
    categoria: "pescado",
    alternativas: ["trucha"],
    alergenos: ["pescado"],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 208, proteinas: 20, grasas: 13, carbohidratos: 0 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d44"),
    nombre: "Alga nori",
    categoria: "alga",
    alternativas: [],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 35, proteinas: 5.8, grasas: 0.3, carbohidratos: 5 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d45"),
    nombre: "Maiz choclo desgranado",
    categoria: "cereal",
    alternativas: ["maiz dulce en lata"],
    alergenos: [],
    temporada: ["verano"],
    nutricion_base: { calorias: 86, proteinas: 3.2, grasas: 1.2, carbohidratos: 19 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d46"),
    nombre: "Queso campesino",
    categoria: "lacteo",
    alternativas: ["queso fresco", "queso blanco"],
    alergenos: ["lacteos"],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 264, proteinas: 18, grasas: 20, carbohidratos: 3 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d47"),
    nombre: "Lomo de res",
    categoria: "proteina animal",
    alternativas: ["solomillo", "entrana"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 271, proteinas: 26, grasas: 18, carbohidratos: 0 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d48"),
    nombre: "Espinacas frescas",
    categoria: "verdura",
    alternativas: ["acelga", "rucula"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 23, proteinas: 2.9, grasas: 0.4, carbohidratos: 3.6 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d49"),
    nombre: "Jamon serrano",
    categoria: "embutido",
    alternativas: ["jamon iberico", "prosciutto"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 241, proteinas: 30, grasas: 13, carbohidratos: 0 }
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d50"),
    nombre: "Fideos de arroz",
    categoria: "pasta",
    alternativas: ["fideos de vidrio"],
    alergenos: [],
    temporada: ["todo el anio"],
    nutricion_base: { calorias: 192, proteinas: 1.8, grasas: 0.4, carbohidratos: 44 }
  }
])

print("✓ 50 ingredientes insertados correctamente")
db.perfiles_usuarios.insertMany([
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9e01"),
    nombre: "Laura Gomez",
    email: "laura@cookflow.com",
    fecha_registro: ISODate("2025-01-15"),
    score_cocinero: 4.8,
    total_recetas: 12,
    preferencias_dieta: ["sin gluten", "bajo en sodio"],
    despensa: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d01"), cantidad_gr: 500, vence: ISODate("2026-07-01") },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d02"), cantidad_gr: 400, vence: ISODate("2026-06-20") },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d24"), cantidad_gr: 300, vence: ISODate("2026-06-15") },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d25"), cantidad_gr: 200, vence: ISODate("2026-06-25") }
    ],
    recetas_guardadas: [
      ObjectId("664a1b2c3d4e5f6a7b8c9f02"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f03"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f05")
    ],
    siguiendo: [
      ObjectId("664a1b2c3d4e5f6a7b8c9e02"),
      ObjectId("664a1b2c3d4e5f6a7b8c9e03")
    ]
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9e02"),
    nombre: "Carlos Mendez",
    email: "carlos@cookflow.com",
    fecha_registro: ISODate("2025-02-20"),
    score_cocinero: 4.2,
    total_recetas: 7,
    preferencias_dieta: ["alto en proteina"],
    despensa: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d07"), cantidad_gr: 600, vence: ISODate("2026-08-01") },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d08"), cantidad_gr: 200, vence: ISODate("2026-06-18") },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d09"), cantidad_gr: 150, vence: ISODate("2026-07-10") }
    ],
    recetas_guardadas: [
      ObjectId("664a1b2c3d4e5f6a7b8c9f01"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f04")
    ],
    siguiendo: [
      ObjectId("664a1b2c3d4e5f6a7b8c9e01"),
      ObjectId("664a1b2c3d4e5f6a7b8c9e04")
    ]
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9e03"),
    nombre: "Sofia Ramirez",
    email: "sofia@cookflow.com",
    fecha_registro: ISODate("2025-03-10"),
    score_cocinero: 4.5,
    total_recetas: 9,
    preferencias_dieta: ["vegetariana", "sin lacteos"],
    despensa: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d39"), cantidad_gr: 400, vence: ISODate("2026-09-01") },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d40"), cantidad_gr: 250, vence: ISODate("2026-10-01") },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d48"), cantidad_gr: 300, vence: ISODate("2026-06-12") }
    ],
    recetas_guardadas: [
      ObjectId("664a1b2c3d4e5f6a7b8c9f03"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f06"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f07")
    ],
    siguiendo: [
      ObjectId("664a1b2c3d4e5f6a7b8c9e01"),
      ObjectId("664a1b2c3d4e5f6a7b8c9e05")
    ]
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9e04"),
    nombre: "Miguel Torres",
    email: "miguel@cookflow.com",
    fecha_registro: ISODate("2025-04-05"),
    score_cocinero: 3.9,
    total_recetas: 5,
    preferencias_dieta: [],
    despensa: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d16"), cantidad_gr: 500, vence: ISODate("2026-12-01") },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d17"), cantidad_gr: 200, vence: ISODate("2026-07-15") },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d18"), cantidad_gr: 150, vence: ISODate("2026-08-20") }
    ],
    recetas_guardadas: [
      ObjectId("664a1b2c3d4e5f6a7b8c9f06"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f08")
    ],
    siguiendo: [
      ObjectId("664a1b2c3d4e5f6a7b8c9e02")
    ]
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9e05"),
    nombre: "Ana Jimenez",
    email: "ana@cookflow.com",
    fecha_registro: ISODate("2025-05-18"),
    score_cocinero: 4.6,
    total_recetas: 15,
    preferencias_dieta: ["mediterranea", "bajo en calorias"],
    despensa: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d33"), cantidad_gr: 500, vence: ISODate("2026-12-01") },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d31"), cantidad_gr: 600, vence: ISODate("2026-06-14") },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d32"), cantidad_gr: 200, vence: ISODate("2026-06-16") }
    ],
    recetas_guardadas: [
      ObjectId("664a1b2c3d4e5f6a7b8c9f09"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f10"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f11")
    ],
    siguiendo: [
      ObjectId("664a1b2c3d4e5f6a7b8c9e01"),
      ObjectId("664a1b2c3d4e5f6a7b8c9e03")
    ]
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9e06"),
    nombre: "Diego Vargas",
    email: "diego@cookflow.com",
    fecha_registro: ISODate("2025-06-01"),
    score_cocinero: 4.1,
    total_recetas: 6,
    preferencias_dieta: ["sin gluten"],
    despensa: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d01"), cantidad_gr: 800, vence: ISODate("2026-06-20") },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d10"), cantidad_gr: 400, vence: ISODate("2026-09-01") },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d11"), cantidad_gr: 100, vence: ISODate("2026-12-01") }
    ],
    recetas_guardadas: [
      ObjectId("664a1b2c3d4e5f6a7b8c9f03"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f12")
    ],
    siguiendo: [
      ObjectId("664a1b2c3d4e5f6a7b8c9e01"),
      ObjectId("664a1b2c3d4e5f6a7b8c9e05")
    ]
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9e07"),
    nombre: "Valentina Cruz",
    email: "valentina@cookflow.com",
    fecha_registro: ISODate("2025-07-12"),
    score_cocinero: 4.3,
    total_recetas: 8,
    preferencias_dieta: ["vegana"],
    despensa: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d39"), cantidad_gr: 500, vence: ISODate("2026-09-01") },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d23"), cantidad_gr: 300, vence: ISODate("2026-06-13") },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d48"), cantidad_gr: 200, vence: ISODate("2026-06-15") }
    ],
    recetas_guardadas: [
      ObjectId("664a1b2c3d4e5f6a7b8c9f07"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f13")
    ],
    siguiendo: [
      ObjectId("664a1b2c3d4e5f6a7b8c9e03"),
      ObjectId("664a1b2c3d4e5f6a7b8c9e05")
    ]
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9e08"),
    nombre: "Andres Perez",
    email: "andres@cookflow.com",
    fecha_registro: ISODate("2025-08-20"),
    score_cocinero: 3.7,
    total_recetas: 4,
    preferencias_dieta: [],
    despensa: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d19"), cantidad_gr: 1000, vence: ISODate("2026-06-18") },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d22"), cantidad_gr: 500, vence: ISODate("2026-12-01") }
    ],
    recetas_guardadas: [
      ObjectId("664a1b2c3d4e5f6a7b8c9f14"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f15")
    ],
    siguiendo: [
      ObjectId("664a1b2c3d4e5f6a7b8c9e02")
    ]
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9e09"),
    nombre: "Camila Ospina",
    email: "camila@cookflow.com",
    fecha_registro: ISODate("2025-09-05"),
    score_cocinero: 4.7,
    total_recetas: 11,
    preferencias_dieta: ["sin gluten", "alta proteina"],
    despensa: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d14"), cantidad_gr: 600, vence: ISODate("2026-06-14") },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d15"), cantidad_gr: 500, vence: ISODate("2026-07-01") },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d24"), cantidad_gr: 400, vence: ISODate("2026-06-16") }
    ],
    recetas_guardadas: [
      ObjectId("664a1b2c3d4e5f6a7b8c9f05"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f16"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f17")
    ],
    siguiendo: [
      ObjectId("664a1b2c3d4e5f6a7b8c9e01"),
      ObjectId("664a1b2c3d4e5f6a7b8c9e07")
    ]
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9e10"),
    nombre: "Felipe Mora",
    email: "felipe@cookflow.com",
    fecha_registro: ISODate("2025-10-14"),
    score_cocinero: 4.0,
    total_recetas: 6,
    preferencias_dieta: ["bajo en carbohidratos"],
    despensa: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d30"), cantidad_gr: 1200, vence: ISODate("2026-06-17") },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"), cantidad_gr: 200, vence: ISODate("2026-09-01") },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d33"), cantidad_gr: 300, vence: ISODate("2026-12-01") }
    ],
    recetas_guardadas: [
      ObjectId("664a1b2c3d4e5f6a7b8c9f18"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f19")
    ],
    siguiendo: [
      ObjectId("664a1b2c3d4e5f6a7b8c9e01"),
      ObjectId("664a1b2c3d4e5f6a7b8c9e09")
    ]
  }
])

print("✓ 10 perfiles de usuario insertados correctamente")
db.recetas.insertMany([
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f01"),
    titulo: "Ajiaco Bogotano",
    dificultad: "media",
    tiempo: 90,
    porciones: 6,
    fecha: ISODate("2026-01-10"),
    idioma: "es",
    tags: ["sopa", "colombiana", "tradicional", "sin-gluten"],
    score_promedio: 4.7,
    total_valoraciones: 134,
    total_cocciones: 89,
    nutricion: { calorias: 320, proteinas: 28, grasas: 8, carbohidratos: 35 },
    preparacion: [
      { paso: 1, texto: "Poner el pollo a hervir con agua, cebolla y sal durante 20 minutos" },
      { paso: 2, texto: "Retirar el pollo y desmenuzarlo en trozos medianos" },
      { paso: 3, texto: "En el mismo caldo agregar las tres clases de papa" },
      { paso: 4, texto: "Cocinar a fuego medio 30 minutos hasta que la papa criolla se deshaga" },
      { paso: 5, texto: "Agregar el maiz y las guascas y cocinar 10 minutos mas" },
      { paso: 6, texto: "Servir con crema de leche y alcaparras al lado" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d01"), cantidad: 500, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d02"), cantidad: 300, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d03"), cantidad: 200, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d04"), cantidad: 200, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d05"), cantidad: 2, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d06"), cantidad: 10, unidad: "gr" }
    ],
    imagenes: [
      { url: "https://i.blogs.es/8cb22c/ajiaco_colombiano_aguacate-min/1366_2000.jpeg", descripcion: "Ajiaco servido en cazuela de barro" },
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e01")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f02"),
    titulo: "Bandeja Paisa Tradicional",
    dificultad: "media",
    tiempo: 120,
    porciones: 4,
    fecha: ISODate("2026-01-15"),
    idioma: "es",
    tags: ["colombiana", "tradicional", "antioqueña", "contundente"],
    score_promedio: 4.5,
    total_valoraciones: 98,
    total_cocciones: 67,
    nutricion: { calorias: 850, proteinas: 45, grasas: 52, carbohidratos: 60 },
    preparacion: [
      { paso: 1, texto: "Cocinar los frijoles con hogao y sal hasta que esten suaves, aproximadamente 2 horas" },
      { paso: 2, texto: "Freir el chicharron en aceite caliente hasta dorado y crujiente" },
      { paso: 3, texto: "Asar el chorizo y la morcilla en plancha" },
      { paso: 4, texto: "Freir los huevos al gusto" },
      { paso: 5, texto: "Cocinar el arroz blanco por separado" },
      { paso: 6, texto: "Servir todo junto en plato grande con aguacate y mazorca" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d07"), cantidad: 200, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d08"), cantidad: 150, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d09"), cantidad: 1, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d22"), cantidad: 200, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d23"), cantidad: 1, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d21"), cantidad: 100, unidad: "gr" }
    ],
    imagenes: [
      { url: "https://i.blogs.es/bb0cca/bandeja_paisa/450_1000.jpg", descripcion: "Bandeja paisa completa con todos sus componentes" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e02")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f03"),
    titulo: "Pollo al Curry Express",
    dificultad: "facil",
    tiempo: 30,
    porciones: 4,
    fecha: ISODate("2026-01-20"),
    idioma: "es",
    tags: ["pollo", "curry", "asiatica", "sin-gluten"],
    score_promedio: 4.6,
    total_valoraciones: 212,
    total_cocciones: 178,
    nutricion: { calorias: 350, proteinas: 30, grasas: 18, carbohidratos: 8 },
    preparacion: [
      { paso: 1, texto: "Cortar el pollo en cubos medianos" },
      { paso: 2, texto: "Picar la cebolla y el ajo finamente y sofreir en aceite hasta transparente" },
      { paso: 3, texto: "Agregar el pollo y dorar por 5 minutos" },
      { paso: 4, texto: "Anadir el curry en polvo y mezclar bien para activar los aromas" },
      { paso: 5, texto: "Verter la leche de coco, bajar el fuego y dejar reducir 15 minutos" },
      { paso: 6, texto: "Rectificar sal y pimienta antes de servir con arroz basmati" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d01"), cantidad: 500, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d10"), cantidad: 200, unidad: "ml" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d11"), cantidad: 2, unidad: "cda" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d25"), cantidad: 1, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"), cantidad: 2, unidad: "diente" }
    ],
    imagenes: [
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ4OcyG8uEH9CZGa5CPY9GrNXOJI69VyuSwA&s", descripcion: "Pollo al curry con arroz basmati" },
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e01")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f04"),
    titulo: "Sancocho de Gallina Costeno",
    dificultad: "media",
    tiempo: 110,
    porciones: 8,
    fecha: ISODate("2026-01-25"),
    idioma: "es",
    tags: ["sopa", "colombiana", "costena", "tradicional"],
    score_promedio: 4.4,
    total_valoraciones: 76,
    total_cocciones: 54,
    nutricion: { calorias: 520, proteinas: 48, grasas: 15, carbohidratos: 52 },
    preparacion: [
      { paso: 1, texto: "Hervir la gallina con cebolla, ajo y comino durante 1 hora" },
      { paso: 2, texto: "Agregar la yuca y la papa en trozos grandes" },
      { paso: 3, texto: "Cocinar 20 minutos mas" },
      { paso: 4, texto: "Anadir el platano verde y la mazorca" },
      { paso: 5, texto: "Cocinar 15 minutos mas y rectificar sal" },
      { paso: 6, texto: "Agregar cilantro fresco al final y servir muy caliente" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d30"), cantidad: 1, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d12"), cantidad: 300, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d13"), cantidad: 1, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d05"), cantidad: 2, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d02"), cantidad: 300, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d25"), cantidad: 2, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"), cantidad: 4, unidad: "diente" }
    ],
    imagenes: [
      { url: "https://i.ytimg.com/vi/Y-g63sNgyiw/maxresdefault.jpg", descripcion: "Sancocho de gallina servido en olla de barro" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e02")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f05"),
    titulo: "Ceviche de Camaron",
    dificultad: "facil",
    tiempo: 25,
    porciones: 4,
    fecha: ISODate("2026-02-01"),
    idioma: "es",
    tags: ["mariscos", "frio", "sin-gluten", "bajo-calorias"],
    score_promedio: 4.8,
    total_valoraciones: 189,
    total_cocciones: 143,
    nutricion: { calorias: 180, proteinas: 28, grasas: 2, carbohidratos: 12 },
    preparacion: [
      { paso: 1, texto: "Lavar y limpiar los camarones retirando la vena" },
      { paso: 2, texto: "Marinar en jugo de limon durante 20 minutos hasta que cambien de color" },
      { paso: 3, texto: "Picar tomate, cebolla y cilantro en brunoise" },
      { paso: 4, texto: "Mezclar todo con los camarones y agregar aji al gusto" },
      { paso: 5, texto: "Rectificar sal y servir inmediatamente frio con tostadas" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d14"), cantidad: 500, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d15"), cantidad: 8, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d31"), cantidad: 2, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d25"), cantidad: 1, unidad: "unidad" }
    ],
    imagenes: [
      { url: "https://imag.bonviveur.com/ceviche-de-camaron.jpg", descripcion: "Ceviche de camaron fresco con limon" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e09")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f06"),
    titulo: "Pasta Carbonara Clasica",
    dificultad: "media",
    tiempo: 25,
    porciones: 4,
    fecha: ISODate("2026-02-05"),
    idioma: "es",
    tags: ["italiana", "pasta", "rapida"],
    score_promedio: 4.5,
    total_valoraciones: 156,
    total_cocciones: 201,
    nutricion: { calorias: 620, proteinas: 28, grasas: 30, carbohidratos: 65 },
    preparacion: [
      { paso: 1, texto: "Cocinar la pasta en agua abundante con sal hasta al dente" },
      { paso: 2, texto: "Freir el guanciale en sarten seca hasta crujiente" },
      { paso: 3, texto: "Batir las yemas con el queso rallado y pimienta generosa" },
      { paso: 4, texto: "Retirar la pasta del fuego y mezclar con el guanciale" },
      { paso: 5, texto: "Anadir la mezcla de yemas fuera del fuego removiendo rapido" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d16"), cantidad: 400, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d17"), cantidad: 200, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d18"), cantidad: 100, unidad: "gr" }
    ],
    imagenes: [
      { url: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800", descripcion: "Pasta carbonara cremosa con guanciale crujiente" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e04")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f07"),
    titulo: "Gazpacho Andaluz",
    dificultad: "facil",
    tiempo: 20,
    porciones: 6,
    fecha: ISODate("2026-02-10"),
    idioma: "es",
    tags: ["espanola", "fria", "vegana", "verano"],
    score_promedio: 4.3,
    total_valoraciones: 88,
    total_cocciones: 72,
    nutricion: { calorias: 120, proteinas: 3, grasas: 7, carbohidratos: 14 },
    preparacion: [
      { paso: 1, texto: "Remojar el pan duro en agua fria 10 minutos" },
      { paso: 2, texto: "Triturar los tomates, pepino, pimiento y ajo en batidora" },
      { paso: 3, texto: "Anadir el pan escurrido, el aceite y el vinagre" },
      { paso: 4, texto: "Triturar hasta textura muy fina y colar" },
      { paso: 5, texto: "Refrigerar minimo 2 horas y servir muy frio" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d31"), cantidad: 1000, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d32"), cantidad: 1, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d33"), cantidad: 80, unidad: "ml" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"), cantidad: 2, unidad: "diente" }
    ],
    imagenes: [
      { url: "https://imag.bonviveur.com/gazpacho-andaluz-casero.jpg", descripcion: "Gazpacho andaluz servido muy frio" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e05")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f08"),
    titulo: "Risotto de Champinones",
    dificultad: "dificil",
    tiempo: 40,
    porciones: 4,
    fecha: ISODate("2026-02-15"),
    idioma: "es",
    tags: ["italiana", "arroz", "vegetariana", "cremosa"],
    score_promedio: 4.6,
    total_valoraciones: 143,
    total_cocciones: 98,
    nutricion: { calorias: 480, proteinas: 14, grasas: 16, carbohidratos: 70 },
    preparacion: [
      { paso: 1, texto: "Sofreir cebolla picada en mantequilla hasta transparente" },
      { paso: 2, texto: "Anadir el arroz y tostar 2 minutos removiendo" },
      { paso: 3, texto: "Incorporar el vino y esperar que se absorba" },
      { paso: 4, texto: "Anadir el caldo caliente cucharón a cucharón removiendo constantemente 18 minutos" },
      { paso: 5, texto: "Saltear los champinones aparte e incorporar al final con parmesano" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d27"), cantidad: 300, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d28"), cantidad: 400, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d29"), cantidad: 100, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d25"), cantidad: 1, unidad: "unidad" }
    ],
    imagenes: [
      { url: "https://thumbs.dreamstime.com/b/risotto-cremoso-de-pasta-con-champi%C3%B1ones-salteados-queso-parmesano-gastronom%C3%ADa-italia-plato-gourmet-verduras-alimentos-389511655.jpg", descripcion: "Risotto cremoso con champinones salteados" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e04")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f09"),
    titulo: "Caldo de Costilla Bogotano",
    dificultad: "facil",
    tiempo: 130,
    porciones: 6,
    fecha: ISODate("2026-02-20"),
    idioma: "es",
    tags: ["sopa", "colombiana", "desayuno", "reconfortante"],
    score_promedio: 4.4,
    total_valoraciones: 67,
    total_cocciones: 89,
    nutricion: { calorias: 380, proteinas: 32, grasas: 18, carbohidratos: 22 },
    preparacion: [
      { paso: 1, texto: "Hervir las costillas con cebolla, ajo, comino y sal 2 horas a fuego lento" },
      { paso: 2, texto: "Anadir la papa criolla y la zanahoria en trozos" },
      { paso: 3, texto: "Cocinar 20 minutos mas hasta que las papas esten tiernas" },
      { paso: 4, texto: "Agregar cilantro fresco al apagar y servir muy caliente con arepa" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d19"), cantidad: 1000, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d02"), cantidad: 400, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d25"), cantidad: 2, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"), cantidad: 4, unidad: "diente" }
    ],
    imagenes: [
      { url: "https://cloudfront-us-east-1.images.arcpublishing.com/elespectador/SEZQLLQHIBDVNM77ZGOINGUXEQ.jpg", descripcion: "Caldo de costilla bogotano con papa criolla" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e08")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f10"),
    titulo: "Tamales Tolimenses",
    dificultad: "dificil",
    tiempo: 180,
    porciones: 10,
    fecha: ISODate("2026-02-25"),
    idioma: "es",
    tags: ["colombiana", "tolimense", "tradicional", "festivo"],
    score_promedio: 4.9,
    total_valoraciones: 45,
    total_cocciones: 23,
    nutricion: { calorias: 580, proteinas: 36, grasas: 22, carbohidratos: 64 },
    preparacion: [
      { paso: 1, texto: "Preparar la masa de maiz suave con sal y manteca" },
      { paso: 2, texto: "Hacer hogao con tomate chonto y cebolla larga a fuego lento 20 minutos" },
      { paso: 3, texto: "Armar cada tamal sobre hoja de platano con masa, cerdo, pollo, verduras y hogao" },
      { paso: 4, texto: "Doblar la hoja y amarrar firmemente con cabuya" },
      { paso: 5, texto: "Cocinar al vapor durante 2 horas" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d20"), cantidad: 1000, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d01"), cantidad: 300, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d21"), cantidad: 200, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d02"), cantidad: 300, unidad: "gr" }
    ],
    imagenes: [
      { url: "https://recetasdemicolombia.com/wp-content/uploads/2020/03/tamal-tolimense.jpg", descripcion: "Tamales tolimenses en hoja de platano" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e01")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f11"),
    titulo: "Empanadas de Pipian",
    dificultad: "media",
    tiempo: 60,
    porciones: 12,
    fecha: ISODate("2026-03-01"),
    idioma: "es",
    tags: ["colombiana", "vallecaucana", "snack", "frito"],
    score_promedio: 4.5,
    total_valoraciones: 112,
    total_cocciones: 134,
    nutricion: { calorias: 280, proteinas: 8, grasas: 14, carbohidratos: 34 },
    preparacion: [
      { paso: 1, texto: "Tostar el mani en seco sin aceite" },
      { paso: 2, texto: "Moler el mani con aji amarillo y cebolla" },
      { paso: 3, texto: "Sofreir la mezcla con hogao durante 10 minutos" },
      { paso: 4, texto: "Mezclar con papa cocida y aplastada" },
      { paso: 5, texto: "Formar las empanadas con masa de maiz y rellenar con el pipian" },
      { paso: 6, texto: "Freir en aceite a 180 grados hasta dorar uniformemente" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d20"), cantidad: 500, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d02"), cantidad: 500, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d21"), cantidad: 100, unidad: "gr" }
    ],
    imagenes: [
      { url: "https://lacosechaparrillada.com/wp-content/uploads/2025/09/Articulo2.webp", descripcion: "Empanadas de pipian doradas y crujientes" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e03")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f12"),
    titulo: "Arroz con Leche Colombiano",
    dificultad: "facil",
    tiempo: 40,
    porciones: 6,
    fecha: ISODate("2026-03-05"),
    idioma: "es",
    tags: ["postre", "colombiana", "dulce", "tradicional"],
    score_promedio: 4.7,
    total_valoraciones: 234,
    total_cocciones: 312,
    nutricion: { calorias: 320, proteinas: 8, grasas: 6, carbohidratos: 62 },
    preparacion: [
      { paso: 1, texto: "Cocinar el arroz en agua con sal durante 10 minutos" },
      { paso: 2, texto: "Calentar la leche con la canela, cascara de limon y clavos" },
      { paso: 3, texto: "Anadir el arroz precocido a la leche caliente" },
      { paso: 4, texto: "Cocinar a fuego muy bajo removiendo constantemente hasta espesar" },
      { paso: 5, texto: "Cuando espese agregar el azucar y cocinar 10 minutos mas" },
      { paso: 6, texto: "Servir frio con canela en polvo" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d22"), cantidad: 200, unidad: "gr" }
    ],
    imagenes: [
      { url: "https://media.istockphoto.com/id/1317720434/es/foto/olla-con-bud%C3%ADn-de-arroz-espolvoreado-con-canela.jpg?s=2048x2048&w=is&k=20&c=uVaKNps6VmQ_I_OhvuRmiKtL71JDDBoOUiRj--0cbt4=", descripcion: "Arroz con leche con canela espolvoreada" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e01")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f13"),
    titulo: "Guacamole Tradicional",
    dificultad: "facil",
    tiempo: 15,
    porciones: 6,
    fecha: ISODate("2026-03-10"),
    idioma: "es",
    tags: ["mexicana", "vegana", "sin-gluten", "aperitivo"],
    score_promedio: 4.8,
    total_valoraciones: 298,
    total_cocciones: 445,
    nutricion: { calorias: 160, proteinas: 2, grasas: 14, carbohidratos: 10 },
    preparacion: [
      { paso: 1, texto: "Partir los aguacates y retirar la semilla" },
      { paso: 2, texto: "Machacar la pulpa con tenedor dejando textura rustica" },
      { paso: 3, texto: "Anadir tomate, cebolla y chile picados muy finos" },
      { paso: 4, texto: "Incorporar cilantro picado y jugo de limon" },
      { paso: 5, texto: "Sazonar con sal y cubrir con plastico contacto para evitar oxidacion" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d23"), cantidad: 3, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d31"), cantidad: 1, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d15"), cantidad: 2, unidad: "unidad" }
    ],
    imagenes: [
      { url: "https://hosteleriasantander.com/wp-content/uploads/2024/06/totopos-guacamole-1.jpg", descripcion: "Guacamole tradicional con totopos" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e07")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f14"),
    titulo: "Tiramisu Clasico Italiano",
    dificultad: "media",
    tiempo: 30,
    porciones: 8,
    fecha: ISODate("2026-03-15"),
    idioma: "es",
    tags: ["italiana", "postre", "cafe", "sin-horno"],
    score_promedio: 4.9,
    total_valoraciones: 187,
    total_cocciones: 134,
    nutricion: { calorias: 420, proteinas: 10, grasas: 28, carbohidratos: 36 },
    preparacion: [
      { paso: 1, texto: "Separar las claras de las yemas" },
      { paso: 2, texto: "Batir las yemas con el azucar hasta blanquear y doblar volumen" },
      { paso: 3, texto: "Mezclar suavemente con el mascarpone" },
      { paso: 4, texto: "Montar las claras a punto de nieve firme e incorporar con movimientos envolventes" },
      { paso: 5, texto: "Mojar las galletas rapidamente en cafe con marsala" },
      { paso: 6, texto: "Montar capas alternando galletas y crema, refrigerar 4 horas minimo" },
      { paso: 7, texto: "Espolvorear cacao amargo antes de servir" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d37"), cantidad: 500, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d38"), cantidad: 200, unidad: "gr" }
    ],
    imagenes: [
      { url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800", descripcion: "Tiramisu con cacao en polvo" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e08")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f15"),
    titulo: "Hummus Casero Autentico",
    dificultad: "facil",
    tiempo: 20,
    porciones: 8,
    fecha: ISODate("2026-03-20"),
    idioma: "es",
    tags: ["libanesa", "vegana", "sin-gluten", "aperitivo"],
    score_promedio: 4.6,
    total_valoraciones: 156,
    total_cocciones: 198,
    nutricion: { calorias: 220, proteinas: 10, grasas: 12, carbohidratos: 22 },
    preparacion: [
      { paso: 1, texto: "Escurrir y enjuagar los garbanzos" },
      { paso: 2, texto: "Para textura ultra cremosa, pelar cada garbanzo individualmente" },
      { paso: 3, texto: "Triturar los garbanzos con tahini, jugo de limon, ajo y sal 5 minutos" },
      { paso: 4, texto: "Anadir agua fria de a poco hasta conseguir textura deseada" },
      { paso: 5, texto: "Servir con aceite de oliva generoso, pimenton y comino" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d39"), cantidad: 400, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d40"), cantidad: 60, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d15"), cantidad: 2, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"), cantidad: 2, unidad: "diente" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d33"), cantidad: 40, unidad: "ml" }
    ],
    imagenes: [
      { url: "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=800", descripcion: "Hummus con aceite de oliva y pimenton" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e03")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f16"),
    titulo: "Crema de Esparragos",
    dificultad: "facil",
    tiempo: 30,
    porciones: 4,
    fecha: ISODate("2026-03-25"),
    idioma: "es",
    tags: ["francesa", "sopa", "vegetariana", "primavera"],
    score_promedio: 4.3,
    total_valoraciones: 89,
    total_cocciones: 67,
    nutricion: { calorias: 180, proteinas: 6, grasas: 12, carbohidratos: 14 },
    preparacion: [
      { paso: 1, texto: "Limpiar los esparragos quitando la parte dura y reservar las puntas" },
      { paso: 2, texto: "Sofreir cebolla y ajo en mantequilla hasta transparente" },
      { paso: 3, texto: "Anadir los esparragos troceados y saltear 3 minutos" },
      { paso: 4, texto: "Cubrir con caldo y cocinar 15 minutos" },
      { paso: 5, texto: "Triturar hasta textura muy lisa, anadir crema y salpimentar" },
      { paso: 6, texto: "Servir con puntas asadas encima" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d41"), cantidad: 500, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d25"), cantidad: 1, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"), cantidad: 2, unidad: "diente" }
    ],
    imagenes: [
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShAqnor9oRJGNETyYP331cq_ofevtt3HYtCA&s", descripcion: "Crema de esparragos con puntas asadas" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e05")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f17"),
    titulo: "Pollo a la Brasa Peruano",
    dificultad: "media",
    tiempo: 100,
    porciones: 6,
    fecha: ISODate("2026-04-01"),
    idioma: "es",
    tags: ["peruana", "pollo", "horneado", "sin-gluten"],
    score_promedio: 4.8,
    total_valoraciones: 201,
    total_cocciones: 167,
    nutricion: { calorias: 450, proteinas: 48, grasas: 22, carbohidratos: 14 },
    preparacion: [
      { paso: 1, texto: "Mezclar todos los ingredientes de la marinada" },
      { paso: 2, texto: "Hacer cortes profundos al pollo para que la marinada penetre" },
      { paso: 3, texto: "Marinar el pollo entero durante 24 horas en refrigerador" },
      { paso: 4, texto: "Asar en horno a 200 grados girando cada 20 minutos durante 1 hora 20 minutos" },
      { paso: 5, texto: "Servir con papas fritas y aji verde de hierbabuena" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d30"), cantidad: 1, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d42"), cantidad: 30, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"), cantidad: 6, unidad: "diente" }
    ],
    imagenes: [
      { url: "https://www.hillcottage.restaurant/133-large_default/recette-traditionnelle-du-pollo-a-la-brasa-peruvien-gout-fume-marinade-authentique.jpg", descripcion: "Pollo a la brasa peruano dorado y jugoso" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e09")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f18"),
    titulo: "Sushi Rolls de Salmon",
    dificultad: "dificil",
    tiempo: 60,
    porciones: 4,
    fecha: ISODate("2026-04-05"),
    idioma: "es",
    tags: ["japonesa", "pescado", "crudo", "elaborada"],
    score_promedio: 4.7,
    total_valoraciones: 134,
    total_cocciones: 89,
    nutricion: { calorias: 340, proteinas: 22, grasas: 12, carbohidratos: 38 },
    preparacion: [
      { paso: 1, texto: "Preparar el arroz con vinagre de arroz, azucar y sal" },
      { paso: 2, texto: "Dejar enfriar el arroz a temperatura ambiente" },
      { paso: 3, texto: "Extender el arroz sobre el alga nori dejando un borde libre" },
      { paso: 4, texto: "Poner una linea de salmon, aguacate y pepino en el centro" },
      { paso: 5, texto: "Enrollar con la esterilla de bambu firmemente" },
      { paso: 6, texto: "Cortar en 8 piezas con cuchillo humedo" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d43"), cantidad: 300, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d44"), cantidad: 4, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d22"), cantidad: 200, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d23"), cantidad: 1, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d32"), cantidad: 1, unidad: "unidad" }
    ],
    imagenes: [
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2jvMS-TgX4acPMeLqoZCnJht27NJhkKQW3A&s", descripcion: "Sushi rolls de salmon cortados en piezas" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e06")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f19"),
    titulo: "Arepa de Choclo con Queso",
    dificultad: "facil",
    tiempo: 30,
    porciones: 6,
    fecha: ISODate("2026-04-10"),
    idioma: "es",
    tags: ["colombiana", "desayuno", "maiz", "vegetariana"],
    score_promedio: 4.8,
    total_valoraciones: 345,
    total_cocciones: 567,
    nutricion: { calorias: 310, proteinas: 12, grasas: 18, carbohidratos: 28 },
    preparacion: [
      { paso: 1, texto: "Moler el choclo en procesador hasta obtener masa gruesa" },
      { paso: 2, texto: "Mezclar con mantequilla derretida, huevos, sal y azucar" },
      { paso: 3, texto: "Formar arepas redondas de un centimetro de grosor" },
      { paso: 4, texto: "Cocinar en plancha engrasada a fuego medio 5 minutos por lado" },
      { paso: 5, texto: "Partir por la mitad y rellenar con queso campesino caliente" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d45"), cantidad: 500, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d46"), cantidad: 200, unidad: "gr" }
    ],
    imagenes: [
      { url: "https://recetas.encolombia.com/wp-content/uploads/2018/10/Receta-Arepa-Chocolo.jpg", descripcion: "Arepa de choclo con queso campesino derretido" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e01")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f20"),
    titulo: "Lomo Saltado Peruano",
    dificultad: "media",
    tiempo: 30,
    porciones: 4,
    fecha: ISODate("2026-04-15"),
    idioma: "es",
    tags: ["peruana", "res", "wok", "tradicional"],
    score_promedio: 4.7,
    total_valoraciones: 178,
    total_cocciones: 145,
    nutricion: { calorias: 510, proteinas: 38, grasas: 20, carbohidratos: 44 },
    preparacion: [
      { paso: 1, texto: "Cortar el lomo en tiras y calentar el wok a fuego muy alto" },
      { paso: 2, texto: "Saltear la carne en pequenas cantidades para que se dore" },
      { paso: 3, texto: "Saltear la cebolla y el tomate en el mismo wok" },
      { paso: 4, texto: "Anadir soya y vinagre y devolver la carne" },
      { paso: 5, texto: "Mezclar todo rapidamente y servir sobre papas fritas con arroz" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d47"), cantidad: 500, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d31"), cantidad: 2, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d22"), cantidad: 200, unidad: "gr" }
    ],
    imagenes: [
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVgVLL2A02kgCg60rWmdbJHwCBIwjCLcrVyg&s", descripcion: "Lomo saltado peruano con papas fritas" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e06")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f21"),
    titulo: "Curry de Garbanzos con Espinacas",
    dificultad: "facil",
    tiempo: 35,
    porciones: 4,
    fecha: ISODate("2026-04-20"),
    idioma: "es",
    tags: ["india", "vegana", "sin-gluten", "legumbres"],
    score_promedio: 4.5,
    total_valoraciones: 123,
    total_cocciones: 98,
    nutricion: { calorias: 340, proteinas: 14, grasas: 16, carbohidratos: 38 },
    preparacion: [
      { paso: 1, texto: "Sofreir cebolla, ajo y jengibre rallado" },
      { paso: 2, texto: "Anadir garam masala y curcuma y tostar 1 minuto" },
      { paso: 3, texto: "Agregar tomates y cocinar 10 minutos" },
      { paso: 4, texto: "Incorporar los garbanzos y la leche de coco y cocinar 15 minutos" },
      { paso: 5, texto: "Anadir las espinacas al final y dejar marchitar con el calor residual" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d39"), cantidad: 400, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d48"), cantidad: 300, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d10"), cantidad: 400, unidad: "ml" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d31"), cantidad: 2, unidad: "unidad" }
    ],
    imagenes: [
      { url: "https://danzadefogones.com/wp-content/uploads/2020/03/Curry-de-Garbanzos-3.jpg", descripcion: "Curry de garbanzos con espinacas verdes" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e03")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f22"),
    titulo: "Croquetas de Jamon Serrano",
    dificultad: "media",
    tiempo: 60,
    porciones: 20,
    fecha: ISODate("2026-04-25"),
    idioma: "es",
    tags: ["espanola", "tapa", "frito", "jamon"],
    score_promedio: 4.6,
    total_valoraciones: 167,
    total_cocciones: 234,
    nutricion: { calorias: 280, proteinas: 12, grasas: 18, carbohidratos: 20 },
    preparacion: [
      { paso: 1, texto: "Hacer un roux con mantequilla y harina cocinando 2 minutos" },
      { paso: 2, texto: "Anadir la leche caliente poco a poco removiendo hasta bechamel muy espesa" },
      { paso: 3, texto: "Anadir jamon y nuez moscada, extender en bandeja y enfriar 4 horas" },
      { paso: 4, texto: "Formar croquetas ovaladas" },
      { paso: 5, texto: "Pasar por harina, huevo y pan rallado" },
      { paso: 6, texto: "Freir en aceite abundante a 180 grados hasta dorar" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d49"), cantidad: 200, unidad: "gr" }
    ],
    imagenes: [
      { url: "https://fmdiabetes.org/wp-content/uploads/2018/09/croquetas-de-jamon-3.jpg", descripcion: "Croquetas de jamon serrano doradas" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e04")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f23"),
    titulo: "Pad Thai de Camaron",
    dificultad: "media",
    tiempo: 40,
    porciones: 4,
    fecha: ISODate("2026-05-01"),
    idioma: "es",
    tags: ["tailandesa", "mariscos", "sin-gluten", "wok"],
    score_promedio: 4.6,
    total_valoraciones: 145,
    total_cocciones: 112,
    nutricion: { calorias: 380, proteinas: 26, grasas: 10, carbohidratos: 50 },
    preparacion: [
      { paso: 1, texto: "Remojar los fideos de arroz en agua tibia durante 30 minutos" },
      { paso: 2, texto: "Saltear los camarones en wok muy caliente 2 minutos y retirar" },
      { paso: 3, texto: "En el mismo wok anadir los fideos escurridos" },
      { paso: 4, texto: "Empujar al lado y hacer scramble de huevos" },
      { paso: 5, texto: "Mezclar todo con salsa de tamarindo y de pescado" },
      { paso: 6, texto: "Anadir los camarones y servir con mani picado y limon" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d50"), cantidad: 200, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d14"), cantidad: 300, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d15"), cantidad: 2, unidad: "unidad" }
    ],
    imagenes: [
      { url: "https://thumbs.dreamstime.com/b/un-plato-aut%C3%A9ntico-pad-thai-con-fideos-de-arroz-refrito-camarones-triturados-brotes-cacahuetes-salteados-jud%C3%ADas-man%C3%AD-tiras-y-382281354.jpg", descripcion: "Pad thai de camaron con mani y limon" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e06")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f24"),
    titulo: "Paella Valenciana",
    dificultad: "dificil",
    tiempo: 60,
    porciones: 6,
    fecha: ISODate("2026-05-05"),
    idioma: "es",
    tags: ["espanola", "arroz", "tradicional", "sin-gluten"],
    score_promedio: 4.8,
    total_valoraciones: 189,
    total_cocciones: 123,
    nutricion: { calorias: 520, proteinas: 34, grasas: 16, carbohidratos: 62 },
    preparacion: [
      { paso: 1, texto: "Sofreir las carnes en paellera con aceite hasta dorar" },
      { paso: 2, texto: "Anadir el tomate rallado y rehogar" },
      { paso: 3, texto: "Incorporar el arroz y sofreir 2 minutos" },
      { paso: 4, texto: "Anadir el caldo caliente con azafran disuelto" },
      { paso: 5, texto: "No remover en ningun momento y cocinar 18 minutos" },
      { paso: 6, texto: "Dejar reposar 5 minutos tapado para que el socarrat se forme" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d34"), cantidad: 400, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d35"), cantidad: 1, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d33"), cantidad: 80, unidad: "ml" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d30"), cantidad: 500, unidad: "gr" }
    ],
    imagenes: [
      { url: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800", descripcion: "Paella valenciana con socarrat dorado" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e05")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f25"),
    titulo: "Sopa de Lentejas con Chorizo",
    dificultad: "facil",
    tiempo: 45,
    porciones: 6,
    fecha: ISODate("2026-05-10"),
    idioma: "es",
    tags: ["espanola", "legumbres", "contundente", "economica"],
    score_promedio: 4.4,
    total_valoraciones: 112,
    total_cocciones: 189,
    nutricion: { calorias: 390, proteinas: 24, grasas: 14, carbohidratos: 44 },
    preparacion: [
      { paso: 1, texto: "Sofreir la cebolla, zanahoria y ajo picados en aceite de oliva" },
      { paso: 2, texto: "Anadir el chorizo en rodajas y dorar" },
      { paso: 3, texto: "Incorporar las lentejas lavadas y cubrir con agua o caldo" },
      { paso: 4, texto: "Anadir paprika y sal y cocinar a fuego medio 30 minutos" },
      { paso: 5, texto: "Rectificar sal y servir con pan crujiente" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d36"), cantidad: 300, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d09"), cantidad: 2, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d33"), cantidad: 40, unidad: "ml" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"), cantidad: 3, unidad: "diente" }
    ],
    imagenes: [
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9ZuwbZj3IuO8I7mdx7_YbNU2J2xC5tWSiWA&s", descripcion: "Sopa de lentejas con chorizo humeante" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e10")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f26"),
    titulo: "Tacos de Carnitas Mexicanos",
    dificultad: "media",
    tiempo: 200,
    porciones: 6,
    fecha: ISODate("2026-05-12"),
    idioma: "es",
    tags: ["mexicana", "cerdo", "tacos", "tradicional"],
    score_promedio: 4.7,
    total_valoraciones: 167,
    total_cocciones: 134,
    nutricion: { calorias: 480, proteinas: 38, grasas: 22, carbohidratos: 32 },
    preparacion: [
      { paso: 1, texto: "Cocinar el cerdo con naranja, ajo y sal cubierto de agua a fuego lento 3 horas" },
      { paso: 2, texto: "Desmenuzar la carne cuando este muy tierna" },
      { paso: 3, texto: "Dorar la carne desmenuzada en su propia grasa hasta bordes crujientes" },
      { paso: 4, texto: "Calentar las tortillas de maiz directamente en comal" },
      { paso: 5, texto: "Servir en tortillas con cebolla morada, cilantro y limon" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d20"), cantidad: 6, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"), cantidad: 6, unidad: "diente" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d15"), cantidad: 4, unidad: "unidad" }
    ],
    imagenes: [
      { url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800", descripcion: "Tacos de carnitas con cebolla y cilantro" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e06")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f27"),
    titulo: "Shakshuka Mediterranea",
    dificultad: "facil",
    tiempo: 30,
    porciones: 4,
    fecha: ISODate("2026-05-14"),
    idioma: "es",
    tags: ["mediterranea", "huevos", "vegetariana", "sin-gluten"],
    score_promedio: 4.5,
    total_valoraciones: 134,
    total_cocciones: 178,
    nutricion: { calorias: 290, proteinas: 18, grasas: 16, carbohidratos: 18 },
    preparacion: [
      { paso: 1, texto: "Sofreir cebolla y pimiento en aceite de oliva hasta suavizar" },
      { paso: 2, texto: "Anadir ajo y especias y cocinar 1 minuto" },
      { paso: 3, texto: "Agregar tomates triturados y cocinar 10 minutos hasta espesar" },
      { paso: 4, texto: "Hacer huecos en la salsa y romper un huevo en cada uno" },
      { paso: 5, texto: "Tapar y cocinar a fuego bajo hasta que las claras cuajen" },
      { paso: 6, texto: "Anadir queso feta desmenuzado y servir" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d31"), cantidad: 400, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d33"), cantidad: 40, unidad: "ml" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"), cantidad: 3, unidad: "diente" }
    ],
    imagenes: [
      { url: "https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800", descripcion: "Shakshuka con huevos y queso feta" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e05")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f28"),
    titulo: "Pollo Tikka Masala",
    dificultad: "media",
    tiempo: 50,
    porciones: 4,
    fecha: ISODate("2026-05-16"),
    idioma: "es",
    tags: ["india", "pollo", "especiada", "sin-gluten"],
    score_promedio: 4.7,
    total_valoraciones: 198,
    total_cocciones: 156,
    nutricion: { calorias: 410, proteinas: 42, grasas: 18, carbohidratos: 20 },
    preparacion: [
      { paso: 1, texto: "Marinar el pollo en yogur, garam masala, curcuma y jengibre minimo 4 horas" },
      { paso: 2, texto: "Asar el pollo marinado en horno a 220 grados durante 20 minutos" },
      { paso: 3, texto: "Sofreir ajo y jengibre, anadir tomates y especias" },
      { paso: 4, texto: "Cocinar la salsa 15 minutos y agregar crema" },
      { paso: 5, texto: "Incorporar el pollo asado y cocinar 10 minutos mas" },
      { paso: 6, texto: "Servir con arroz basmati y pan naan" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d01"), cantidad: 600, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d31"), cantidad: 400, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d11"), cantidad: 15, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"), cantidad: 4, unidad: "diente" }
    ],
    imagenes: [
      { url: "https://i.blogs.es/304df0/pollo_tikka_masala/450_1000.jpg", descripcion: "Pollo tikka masala con salsa naranja intensa" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e06")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f29"),
    titulo: "Chili con Carne Texano",
    dificultad: "facil",
    tiempo: 60,
    porciones: 6,
    fecha: ISODate("2026-05-18"),
    idioma: "es",
    tags: ["americana", "carne", "contundente", "sin-gluten"],
    score_promedio: 4.4,
    total_valoraciones: 123,
    total_cocciones: 189,
    nutricion: { calorias: 440, proteinas: 36, grasas: 18, carbohidratos: 38 },
    preparacion: [
      { paso: 1, texto: "Dorar la carne molida a fuego alto hasta que no quede rosada" },
      { paso: 2, texto: "Sofreir cebolla, pimiento y ajo en la misma sarten" },
      { paso: 3, texto: "Reunir la carne con las verduras y anadir tomates y frijoles" },
      { paso: 4, texto: "Incorporar chile en polvo y comino" },
      { paso: 5, texto: "Cocinar a fuego lento 45 minutos removiendo ocasionalmente" },
      { paso: 6, texto: "Servir con crema agria, queso rallado y cilantro" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d07"), cantidad: 400, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d31"), cantidad: 400, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"), cantidad: 4, unidad: "diente" }
    ],
    imagenes: [
      { url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800", descripcion: "Chili con carne con crema y queso" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e08")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f30"),
    titulo: "Lasana Bolonesa Clasica",
    dificultad: "dificil",
    tiempo: 120,
    porciones: 8,
    fecha: ISODate("2026-05-20"),
    idioma: "es",
    tags: ["italiana", "pasta", "horneada", "festivo"],
    score_promedio: 4.6,
    total_valoraciones: 156,
    total_cocciones: 98,
    nutricion: { calorias: 580, proteinas: 34, grasas: 26, carbohidratos: 56 },
    preparacion: [
      { paso: 1, texto: "Sofreir cebolla, zanahoria y apio finamente picados" },
      { paso: 2, texto: "Anadir la carne y dorar bien a fuego alto" },
      { paso: 3, texto: "Incorporar vino tinto y dejar evaporar el alcohol" },
      { paso: 4, texto: "Anadir tomates y cocinar a fuego lento 1 hora" },
      { paso: 5, texto: "Preparar bechamel espesa con mantequilla, harina y leche" },
      { paso: 6, texto: "Alternar capas de pasta, bolonesa y bechamel en molde" },
      { paso: 7, texto: "Cubrir con parmesano y hornear a 180 grados 35 minutos" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d16"), cantidad: 400, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d31"), cantidad: 400, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d29"), cantidad: 150, unidad: "gr" }
    ],
    imagenes: [
      { url: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800", descripcion: "Lasana bolonesa gratinada con parmesano" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e04")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f31"),
    titulo: "Ramen Tonkotsu Casero",
    dificultad: "experto",
    tiempo: 780,
    porciones: 4,
    fecha: ISODate("2026-05-22"),
    idioma: "es",
    tags: ["japonesa", "sopa", "cerdo", "elaborada"],
    score_promedio: 4.9,
    total_valoraciones: 89,
    total_cocciones: 45,
    nutricion: { calorias: 620, proteinas: 40, grasas: 28, carbohidratos: 54 },
    preparacion: [
      { paso: 1, texto: "Hervir los huesos de cerdo a fuego muy alto durante 12 horas para caldo blanco" },
      { paso: 2, texto: "Preparar la panceta marinada en soya y mirin y hornear 1 hora" },
      { paso: 3, texto: "Marinar los huevos cocidos en soya durante 6 horas" },
      { paso: 4, texto: "Cocinar los fideos ramen segun instrucciones" },
      { paso: 5, texto: "Montar con caldo muy caliente, fideos, panceta y huevo partido" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d50"), cantidad: 400, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d44"), cantidad: 4, unidad: "unidad" }
    ],
    imagenes: [
      { url: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800", descripcion: "Ramen tonkotsu con chashu y huevo marinado" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e06")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f32"),
    titulo: "Feijoada Brasilena",
    dificultad: "media",
    tiempo: 90,
    porciones: 8,
    fecha: ISODate("2026-05-24"),
    idioma: "es",
    tags: ["brasilena", "frijoles", "cerdo", "tradicional"],
    score_promedio: 4.6,
    total_valoraciones: 112,
    total_cocciones: 78,
    nutricion: { calorias: 680, proteinas: 44, grasas: 32, carbohidratos: 58 },
    preparacion: [
      { paso: 1, texto: "Remojar los frijoles negros una noche entera en agua fria" },
      { paso: 2, texto: "Cocinar todas las carnes con frijoles, cebolla, ajo y laurel en olla a presion 45 minutos" },
      { paso: 3, texto: "Ajustar sal, el caldo debe quedar espeso y oscuro" },
      { paso: 4, texto: "Servir con arroz blanco, farofa de mantequilla y col salteada" },
      { paso: 5, texto: "Acompanar con rodajas de naranja que cortan la grasa" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d07"), cantidad: 500, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d09"), cantidad: 2, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d22"), cantidad: 300, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"), cantidad: 4, unidad: "diente" }
    ],
    imagenes: [
      { url: "https://www.shutterstock.com/shutterstock/photos/2177118915/display_1500/stock-photo-typical-brazilian-feijoada-with-rice-pepper-farofa-kale-caipirinha-and-cracklings-2177118915.jpg", descripcion: "Feijoada brasilena con arroz y farofa" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e08")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f33"),
    titulo: "Moussaka Griega",
    dificultad: "dificil",
    tiempo: 100,
    porciones: 6,
    fecha: ISODate("2026-05-26"),
    idioma: "es",
    tags: ["griega", "cordero", "horneada", "mediterranea"],
    score_promedio: 4.5,
    total_valoraciones: 98,
    total_cocciones: 67,
    nutricion: { calorias: 490, proteinas: 30, grasas: 28, carbohidratos: 32 },
    preparacion: [
      { paso: 1, texto: "Cortar las berenjenas en rodajas, salar y reposar 30 minutos" },
      { paso: 2, texto: "Enjuagar y asar las berenjenas en horno con aceite" },
      { paso: 3, texto: "Sofreir cebolla y ajo, anadir cordero molido y dorar" },
      { paso: 4, texto: "Incorporar tomates y canela y cocinar 20 minutos" },
      { paso: 5, texto: "Montar capas de berenjena, carne y otra de berenjena en molde" },
      { paso: 6, texto: "Finalizar con bechamel espesa y hornear 40 minutos a 180 grados" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d31"), cantidad: 400, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"), cantidad: 3, unidad: "diente" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d33"), cantidad: 40, unidad: "ml" }
    ],
    imagenes: [
      { url: "https://images.unsplash.com/photo-1621510456681-2330135e5871?w=800", descripcion: "Moussaka griega con bechamel dorada" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e05")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f34"),
    titulo: "Locro Argentino",
    dificultad: "media",
    tiempo: 200,
    porciones: 8,
    fecha: ISODate("2026-05-28"),
    idioma: "es",
    tags: ["argentina", "contundente", "invierno", "tradicional"],
    score_promedio: 4.6,
    total_valoraciones: 78,
    total_cocciones: 45,
    nutricion: { calorias: 560, proteinas: 32, grasas: 20, carbohidratos: 68 },
    preparacion: [
      { paso: 1, texto: "Remojar el maiz y los porotos la noche anterior por separado" },
      { paso: 2, texto: "Cocinar el cerdo en olla grande con agua fria desde el inicio" },
      { paso: 3, texto: "A la hora anadir el maiz y los porotos" },
      { paso: 4, texto: "A las dos horas anadir el zapallo en cubos y el chorizo colorado" },
      { paso: 5, texto: "El zapallo debe deshacerse completamente para espesar el guiso" },
      { paso: 6, texto: "Servir con quiquirimichi sofrito picante aparte" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d05"), cantidad: 300, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d09"), cantidad: 2, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d07"), cantidad: 300, unidad: "gr" }
    ],
    imagenes: [
      { url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800", descripcion: "Locro argentino humeante en olla de barro" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e08")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f35"),
    titulo: "Pabellon Criollo Venezolano",
    dificultad: "media",
    tiempo: 90,
    porciones: 4,
    fecha: ISODate("2026-05-30"),
    idioma: "es",
    tags: ["venezolana", "tradicional", "completa", "sin-gluten"],
    score_promedio: 4.5,
    total_valoraciones: 89,
    total_cocciones: 67,
    nutricion: { calorias: 580, proteinas: 38, grasas: 14, carbohidratos: 72 },
    preparacion: [
      { paso: 1, texto: "Cocinar la carne de res hasta tierna y desmechar en hebras finas" },
      { paso: 2, texto: "Sofreir con cebolla, ajo y tomate" },
      { paso: 3, texto: "Cocinar las caraotas negras con sofrito hasta espesar" },
      { paso: 4, texto: "Cocinar el arroz blanco suelto por separado" },
      { paso: 5, texto: "Freir el platano maduro en rodajas hasta caramelizar" },
      { paso: 6, texto: "Servir los cuatro componentes separados en el plato" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d47"), cantidad: 500, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d07"), cantidad: 400, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d22"), cantidad: 300, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d13"), cantidad: 2, unidad: "unidad" }
    ],
    imagenes: [
      { url: "https://cdn-ilddihb.nitrocdn.com/MgqZCGPEMHvMRLsisMUCAIMWvgGMxqaj/assets/images/optimized/rev-26d289e/www.goya.com/wp-content/uploads/2023/10/venezuelan-shredded-beef.jpg", descripcion: "Pabellon criollo con sus cuatro componentes" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e10")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f36"),
    titulo: "Crepes Suzette",
    dificultad: "dificil",
    tiempo: 45,
    porciones: 4,
    fecha: ISODate("2026-06-01"),
    idioma: "es",
    tags: ["francesa", "postre", "naranja", "flambeada"],
    score_promedio: 4.7,
    total_valoraciones: 112,
    total_cocciones: 78,
    nutricion: { calorias: 350, proteinas: 8, grasas: 16, carbohidratos: 44 },
    preparacion: [
      { paso: 1, texto: "Preparar la masa mezclando harina, huevos y leche y reposar 30 minutos" },
      { paso: 2, texto: "Hacer crepes finas en sarten antiadherente engrasada con mantequilla" },
      { paso: 3, texto: "Preparar la salsa Suzette con mantequilla, azucar, jugo y cascara de naranja" },
      { paso: 4, texto: "Doblar las crepes en cuartos y calentar en la salsa" },
      { paso: 5, texto: "Anadir el licor y flambear con precaucion" },
      { paso: 6, texto: "Servir inmediatamente" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d15"), cantidad: 4, unidad: "unidad" }
    ],
    imagenes: [
      { url: "https://www.allrecipes.com/thmb/6uLO4Y9_ec0QtQ0fr2vjCYEgTVg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/ALR-crepes-suzette-recipe-8647003-VAT-B-4x3-414d093bbcaf4868a9e598abd8163151.jpg", descripcion: "Crepes suzette flameadas con naranja" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e05")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f37"),
    titulo: "Mole Poblano",
    dificultad: "experto",
    tiempo: 180,
    porciones: 8,
    fecha: ISODate("2026-06-02"),
    idioma: "es",
    tags: ["mexicana", "chile", "chocolate", "tradicional"],
    score_promedio: 4.8,
    total_valoraciones: 67,
    total_cocciones: 34,
    nutricion: { calorias: 520, proteinas: 36, grasas: 24, carbohidratos: 42 },
    preparacion: [
      { paso: 1, texto: "Tostar los chiles secos sin quemarlos y remojar en agua caliente 30 minutos" },
      { paso: 2, texto: "Sofreir tomate, cebolla y ajo" },
      { paso: 3, texto: "Triturar todo junto con especias hasta pasta fina" },
      { paso: 4, texto: "Sofreir la pasta en aceite hasta perfumar" },
      { paso: 5, texto: "Anadir el caldo poco a poco hasta obtener salsa espesa" },
      { paso: 6, texto: "Anadir el chocolate amargo rallado al final probando constantemente" },
      { paso: 7, texto: "Cocinar el pollo en el mole 25 minutos y servir con arroz" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d01"), cantidad: 1000, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d31"), cantidad: 400, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"), cantidad: 6, unidad: "diente" }
    ],
    imagenes: [
      { url: "https://images.aws.nestle.recipes/resized/22799177598839ef259515a1a3ca1e92_mole_con_pollo_-_chocolate_abuelita_1200_628.jpg", descripcion: "Mole poblano oscuro con pollo" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e10")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f38"),
    titulo: "Borsch Ucraniano",
    dificultad: "media",
    tiempo: 90,
    porciones: 6,
    fecha: ISODate("2026-06-03"),
    idioma: "es",
    tags: ["ucraniana", "sopa", "remolacha", "tradicional"],
    score_promedio: 4.4,
    total_valoraciones: 78,
    total_cocciones: 56,
    nutricion: { calorias: 280, proteinas: 18, grasas: 10, carbohidratos: 32 },
    preparacion: [
      { paso: 1, texto: "Hervir la carne de res hasta tierna y reservar el caldo" },
      { paso: 2, texto: "Sofreir cebolla, zanahoria y remolacha rallada" },
      { paso: 3, texto: "Anadir tomate y vinagre para fijar el color rojo" },
      { paso: 4, texto: "Incorporar las verduras al caldo de carne" },
      { paso: 5, texto: "Anadir papa en cubos y repollo en juliana y cocinar 20 minutos" },
      { paso: 6, texto: "Servir con crema agria generosa y eneldo fresco" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d47"), cantidad: 500, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d02"), cantidad: 400, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d31"), cantidad: 300, unidad: "gr" }
    ],
    imagenes: [
      { url: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=800", descripcion: "Borsch ucraniano rojo intenso con crema agria" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e09")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f39"),
    titulo: "Pollo al Ajillo",
    dificultad: "facil",
    tiempo: 45,
    porciones: 4,
    fecha: ISODate("2026-06-03"),
    idioma: "es",
    tags: ["espanola", "pollo", "ajo", "tradicional"],
    score_promedio: 4.5,
    total_valoraciones: 145,
    total_cocciones: 189,
    nutricion: { calorias: 420, proteinas: 44, grasas: 22, carbohidratos: 6 },
    preparacion: [
      { paso: 1, texto: "Salpimentar el pollo troceado" },
      { paso: 2, texto: "Dorar el pollo en aceite de oliva generoso a fuego fuerte por todos lados" },
      { paso: 3, texto: "Retirar y en el mismo aceite sofreir los ajos enteros pelados hasta dorar" },
      { paso: 4, texto: "Anadir la guindilla y el pimenton" },
      { paso: 5, texto: "Devolver el pollo y anadir el vino blanco dejando reducir a la mitad" },
      { paso: 6, texto: "Cocinar tapado 20 minutos y anadir perejil al servir" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d30"), cantidad: 1, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"), cantidad: 20, unidad: "diente" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d33"), cantidad: 80, unidad: "ml" }
    ],
    imagenes: [
      { url: "https://www.cocinacaserayfacil.net/wp-content/uploads/2020/01/Pollo-al-ajillo.jpg", descripcion: "Pollo al ajillo con ajos dorados" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e10")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f40"),
    titulo: "Tortilla Espanola de Patatas",
    dificultad: "media",
    tiempo: 45,
    porciones: 6,
    fecha: ISODate("2026-06-03"),
    idioma: "es",
    tags: ["espanola", "huevos", "tapa", "vegetariana"],
    score_promedio: 4.6,
    total_valoraciones: 234,
    total_cocciones: 389,
    nutricion: { calorias: 380, proteinas: 14, grasas: 24, carbohidratos: 28 },
    preparacion: [
      { paso: 1, texto: "Pelar y cortar las papas en rodajas finas" },
      { paso: 2, texto: "Confitar las papas con la cebolla en aceite de oliva a fuego bajo 20 minutos" },
      { paso: 3, texto: "Escurrir bien el aceite de las papas y cebolla" },
      { paso: 4, texto: "Batir los huevos con sal y mezclar con las papas" },
      { paso: 5, texto: "Cuajar en sarten antiadherente a fuego medio 4 minutos" },
      { paso: 6, texto: "Dar la vuelta con plato y cuajar 3 minutos mas, servir a temperatura ambiente" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d02"), cantidad: 500, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d25"), cantidad: 1, unidad: "unidad" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d33"), cantidad: 200, unidad: "ml" }
    ],
    imagenes: [
      { url: "https://commons.wikimedia.org/wiki/Special:FilePath/Tortilla_de_patatas.jpg", descripcion: "Tortilla espanola jugosa cortada en porciones" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e05")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f41"),
    titulo: "Biryani de Cordero",
    dificultad: "experto",
    tiempo: 120,
    porciones: 6,
    fecha: ISODate("2026-06-03"),
    idioma: "es",
    tags: ["india", "arroz", "cordero", "festivo"],
    score_promedio: 4.8,
    total_valoraciones: 89,
    total_cocciones: 56,
    nutricion: { calorias: 580, proteinas: 34, grasas: 24, carbohidratos: 58 },
    preparacion: [
      { paso: 1, texto: "Marinar el cordero en yogur y especias 4 horas" },
      { paso: 2, texto: "Freir la cebolla en ghee hasta caramelizar y crujiente" },
      { paso: 3, texto: "Cocinar el cordero marinado" },
      { paso: 4, texto: "Precocinar el arroz al 70 por ciento" },
      { paso: 5, texto: "Montar el biryani en capas: arroz, cordero, cebolla frita, azafran en leche" },
      { paso: 6, texto: "Sellar la olla con masa y cocinar a fuego muy bajo 25 minutos" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d22"), cantidad: 300, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d35"), cantidad: 1, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"), cantidad: 6, unidad: "diente" }
    ],
    imagenes: [
      { url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800", descripcion: "Biryani de cordero con azafran dorado" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e06")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f42"),
    titulo: "Carne Asada a la Parrilla",
    dificultad: "media",
    tiempo: 40,
    porciones: 4,
    fecha: ISODate("2026-06-03"),
    idioma: "es",
    tags: ["argentina", "res", "parrilla", "sin-gluten"],
    score_promedio: 4.7,
    total_valoraciones: 198,
    total_cocciones: 267,
    nutricion: { calorias: 380, proteinas: 42, grasas: 22, carbohidratos: 2 },
    preparacion: [
      { paso: 1, texto: "Sacar la carne del frio 1 hora antes de cocinar" },
      { paso: 2, texto: "Preparar el chimichurri con perejil, oregano, ajo, aji, vinagre y aceite" },
      { paso: 3, texto: "Encender las brasas con suficiente anticipacion para calor uniforme" },
      { paso: 4, texto: "Salar la carne solo justo antes de poner en la parrilla" },
      { paso: 5, texto: "Asar a fuego medio-alto 6 minutos por lado para punto medio" },
      { paso: 6, texto: "Reposar 5 minutos antes de cortar y servir con chimichurri" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d47"), cantidad: 1000, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d33"), cantidad: 60, unidad: "ml" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"), cantidad: 4, unidad: "diente" }
    ],
    imagenes: [
      { url: "https://images.unsplash.com/photo-1558030006-450675393462?w=800", descripcion: "Carne asada en parrilla con chimichurri" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e08")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f43"),
    titulo: "Soup Dumplings Xiao Long Bao",
    dificultad: "experto",
    tiempo: 180,
    porciones: 4,
    fecha: ISODate("2026-06-04"),
    idioma: "es",
    tags: ["china", "cerdo", "vapor", "elaborada"],
    score_promedio: 4.9,
    total_valoraciones: 56,
    total_cocciones: 23,
    nutricion: { calorias: 320, proteinas: 18, grasas: 14, carbohidratos: 32 },
    preparacion: [
      { paso: 1, texto: "Preparar gelatina de caldo concentrado de cerdo el dia anterior" },
      { paso: 2, texto: "Mezclar carne de cerdo picada con jengibre, soya y sesamo" },
      { paso: 3, texto: "Incorporar la gelatina picada fria al relleno" },
      { paso: 4, texto: "Hacer la masa fina y cortar circulos" },
      { paso: 5, texto: "Poner el relleno y plegar en 18 dobleces formando la bolsita" },
      { paso: 6, texto: "Cocinar al vapor 8 minutos y consumir con cuidado del caldo caliente interior" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d44"), cantidad: 4, unidad: "unidad" }
    ],
    imagenes: [
      { url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800", descripcion: "Xiao long bao en vaporera de bambu" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e06")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f44"),
    titulo: "Pastel de Choclo Chileno",
    dificultad: "media",
    tiempo: 70,
    porciones: 6,
    fecha: ISODate("2026-06-04"),
    idioma: "es",
    tags: ["chilena", "maiz", "horneada", "tradicional"],
    score_promedio: 4.6,
    total_valoraciones: 89,
    total_cocciones: 67,
    nutricion: { calorias: 520, proteinas: 32, grasas: 20, carbohidratos: 56 },
    preparacion: [
      { paso: 1, texto: "Preparar el pino friendo cebolla con carne molida" },
      { paso: 2, texto: "Anadir pollo desmenuzado, aceitunas y pasas al pino" },
      { paso: 3, texto: "Moler el choclo y cocinarlo en mantequilla hasta espesar como polenta" },
      { paso: 4, texto: "Poner el pino en molde individual y cubrir con masa de choclo" },
      { paso: 5, texto: "Espolvorear azucar encima y hornear a 200 grados 20 minutos" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d45"), cantidad: 800, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d01"), cantidad: 300, unidad: "gr" }
    ],
    imagenes: [
      { url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800", descripcion: "Pastel de choclo con costra dorada de azucar" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e09")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f45"),
    titulo: "Bouillabaisse Marsellesa",
    dificultad: "experto",
    tiempo: 90,
    porciones: 6,
    fecha: ISODate("2026-06-04"),
    idioma: "es",
    tags: ["francesa", "pescado", "mariscos", "provenzal"],
    score_promedio: 4.8,
    total_valoraciones: 45,
    total_cocciones: 23,
    nutricion: { calorias: 380, proteinas: 44, grasas: 14, carbohidratos: 18 },
    preparacion: [
      { paso: 1, texto: "Sofreir cebolla, hinojo y tomates en aceite de oliva" },
      { paso: 2, texto: "Anadir azafran, pastis y caldo de pescado y hervir 20 minutos" },
      { paso: 3, texto: "Anadir los pescados mas duros primero, luego los blandos" },
      { paso: 4, texto: "Los mariscos al final 5 minutos" },
      { paso: 5, texto: "Servir el caldo primero con pan tostado untado de rouille" },
      { paso: 6, texto: "Luego servir el pescado y mariscos en plato aparte" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d14"), cantidad: 500, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d35"), cantidad: 1, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d33"), cantidad: 80, unidad: "ml" }
    ],
    imagenes: [
      { url: "https://imagenes.elpais.com/resizer/v2/YP2OCT4ACZJRHOCEAY6PE5TTFA.jpg?auth=ba490417980966bdace3af0b59d1c4cf2bae46fc61fefb89e385aa10a4493857&width=1200", descripcion: "Bouillabaisse marsellesa con rouille" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e05")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f46"),
    titulo: "Arroz Chaufa Peruano",
    dificultad: "facil",
    tiempo: 20,
    porciones: 4,
    fecha: ISODate("2026-06-04"),
    idioma: "es",
    tags: ["peruana", "arroz", "wok", "chifa"],
    score_promedio: 4.6,
    total_valoraciones: 156,
    total_cocciones: 234,
    nutricion: { calorias: 450, proteinas: 24, grasas: 14, carbohidratos: 58 },
    preparacion: [
      { paso: 1, texto: "Usar arroz del dia anterior frio para que no se apelmace" },
      { paso: 2, texto: "Calentar wok hasta humear y saltear la carne cortada fina" },
      { paso: 3, texto: "Anadir los huevos y hacer scramble rapido" },
      { paso: 4, texto: "Incorporar el arroz frio y saltear a fuego muy alto" },
      { paso: 5, texto: "Anadir cebolla larga, aji amarillo y soya" },
      { paso: 6, texto: "Mezclar con aceite de sesamo al final y servir inmediatamente" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d22"), cantidad: 400, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d01"), cantidad: 300, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d25"), cantidad: 3, unidad: "unidad" }
    ],
    imagenes: [
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7uaRfN6Nci42OxmzSaeft49yp8hqWaR_uEQ&s", descripcion: "Arroz chaufa peruano con vegetales salteados" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e06")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f47"),
    titulo: "Sopa de Miso con Tofu",
    dificultad: "facil",
    tiempo: 20,
    porciones: 4,
    fecha: ISODate("2026-06-04"),
    idioma: "es",
    tags: ["japonesa", "sopa", "vegana", "saludable"],
    score_promedio: 4.4,
    total_valoraciones: 123,
    total_cocciones: 198,
    nutricion: { calorias: 120, proteinas: 8, grasas: 4, carbohidratos: 14 },
    preparacion: [
      { paso: 1, texto: "Preparar el dashi infusionando alga kombu y bonito seco en agua caliente sin hervir" },
      { paso: 2, texto: "Colar el dashi y anadir el alga wakame hidratada" },
      { paso: 3, texto: "Cortar el tofu sedoso en cubos y anadir al caldo caliente" },
      { paso: 4, texto: "Apagar el fuego" },
      { paso: 5, texto: "Disolver la pasta de miso en un poco de caldo frio y anadir al final" },
      { paso: 6, texto: "Nunca hervir despues de anadir el miso para preservar sus probioticos" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d44"), cantidad: 10, unidad: "gr" }
    ],
    imagenes: [
      { url: "https://previews.123rf.com/images/happylark/happylark2006/happylark200600002/148191791-traditional-miso-soup-with-wakame-seaweeds-tofu-and-shiitake-mushrooms-on-bamboo-mat-copy-space.jpg", descripcion: "Sopa de miso con tofu y alga wakame" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e07")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f48"),
    titulo: "Tartiflette Savoyarda",
    dificultad: "facil",
    tiempo: 50,
    porciones: 4,
    fecha: ISODate("2026-06-05"),
    idioma: "es",
    tags: ["francesa", "papa", "queso", "invierno"],
    score_promedio: 4.7,
    total_valoraciones: 89,
    total_cocciones: 67,
    nutricion: { calorias: 620, proteinas: 24, grasas: 38, carbohidratos: 46 },
    preparacion: [
      { paso: 1, texto: "Cocinar las papas con piel hasta casi tiernas" },
      { paso: 2, texto: "Sofreir el tocino con cebolla hasta dorar" },
      { paso: 3, texto: "Anadir el vino blanco y dejar reducir" },
      { paso: 4, texto: "Pelar las papas y cortar en rodajas gruesas" },
      { paso: 5, texto: "Mezclar papas, tocino y cebolla con la crema en molde para horno" },
      { paso: 6, texto: "Colocar el queso reblochon encima con la corteza hacia arriba y hornear 20 minutos a 200 grados" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d02"), cantidad: 800, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d08"), cantidad: 200, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d46"), cantidad: 300, unidad: "gr" }
    ],
    imagenes: [
      { url: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800", descripcion: "Tartiflette savoyarda con queso fundido" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e04")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f49"),
    titulo: "Cazuela de Mariscos",
    dificultad: "media",
    tiempo: 40,
    porciones: 4,
    fecha: ISODate("2026-06-05"),
    idioma: "es",
    tags: ["espanola", "mariscos", "sin-gluten", "mediterranea"],
    score_promedio: 4.7,
    total_valoraciones: 134,
    total_cocciones: 98,
    nutricion: { calorias: 290, proteinas: 38, grasas: 8, carbohidratos: 18 },
    preparacion: [
      { paso: 1, texto: "Sofreir cebolla y ajo en aceite de oliva" },
      { paso: 2, texto: "Anadir los calamares y cocinar 5 minutos" },
      { paso: 3, texto: "Incorporar tomate y vino blanco y reducir 10 minutos" },
      { paso: 4, texto: "Anadir azafran y caldo de pescado" },
      { paso: 5, texto: "Agregar los mejillones y almejas tapando hasta que abran" },
      { paso: 6, texto: "Anadir los camarones al final 3 minutos y servir con pan tostado" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d14"), cantidad: 400, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d35"), cantidad: 1, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d33"), cantidad: 60, unidad: "ml" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d26"), cantidad: 4, unidad: "diente" }
    ],
    imagenes: [
      { url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800", descripcion: "Cazuela de mariscos con azafran" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e09")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9f50"),
    titulo: "Bibimbap Coreano",
    dificultad: "media",
    tiempo: 50,
    porciones: 4,
    fecha: ISODate("2026-06-05"),
    idioma: "es",
    tags: ["coreana", "arroz", "colorida", "sin-gluten"],
    score_promedio: 4.6,
    total_valoraciones: 145,
    total_cocciones: 112,
    nutricion: { calorias: 490, proteinas: 28, grasas: 14, carbohidratos: 64 },
    preparacion: [
      { paso: 1, texto: "Marinar la carne de res en soya, azucar y aceite de sesamo" },
      { paso: 2, texto: "Saltear cada vegetal por separado sazonando con sal y aceite de sesamo" },
      { paso: 3, texto: "Cocinar la carne marinada en sarten caliente" },
      { paso: 4, texto: "Servir el arroz en bol caliente" },
      { paso: 5, texto: "Disponer los vegetales y la carne en secciones sobre el arroz" },
      { paso: 6, texto: "Poner el huevo frito encima, anadir gochujang y mezclar todo antes de comer" }
    ],
    cantidades: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d22"), cantidad: 400, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d47"), cantidad: 300, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d48"), cantidad: 200, unidad: "gr" },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d28"), cantidad: 200, unidad: "gr" }
    ],
    imagenes: [
      { url: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800", descripcion: "Bibimbap coreano colorido con huevo frito" }
    ],
    autor_id: ObjectId("664a1b2c3d4e5f6a7b8c9e07")
  }
])

print("✓ 50 recetas insertadas correctamente");
db.valoraciones.insertMany([
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b01"),
    rating: 5,
    comentario: "El ajiaco quedo espectacular, la hice para toda la familia y todos quedaron encantados. Los tres tipos de papa hacen una diferencia enorme.",
    fecha: ISODate("2026-01-15"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f01"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e02")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b02"),
    rating: 4,
    comentario: "Muy buena receta pero me costo conseguir las guascas. Al final las encontre en una tienda de productos colombianos y valio la pena.",
    fecha: ISODate("2026-01-18"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f01"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e03")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b03"),
    rating: 5,
    comentario: "La bandeja paisa autentica es un arte. Seguí cada paso y el resultado fue increíble. El chicharron crujiente es clave.",
    fecha: ISODate("2026-01-20"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f02"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e01")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b04"),
    rating: 5,
    comentario: "El pollo al curry express es mi receta favorita entre semana. En 30 minutos tengo un plato delicioso. La leche de coco le da una cremosidad perfecta.",
    fecha: ISODate("2026-01-22"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f03"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e06")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b05"),
    rating: 5,
    comentario: "Segui el consejo de marinar el pollo en yogur antes y quedo muchísimo mejor. El curry quedo perfectamente balanceado.",
    fecha: ISODate("2026-01-25"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f03"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e07")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b06"),
    rating: 4,
    comentario: "El sancocho de gallina es impresionante. Use gallina de campo como recomiendan y la diferencia es notable frente al pollo de granja.",
    fecha: ISODate("2026-01-28"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f04"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e09")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b07"),
    rating: 5,
    comentario: "El ceviche quedo fresco y perfecto. Clave no pasar de 20 minutos en el limon o los camarones quedan duros. Excelente receta.",
    fecha: ISODate("2026-02-02"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f05"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e01")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b08"),
    rating: 5,
    comentario: "La carbonara sin crema de leche es una revelacion. Es totalmente diferente y mucho mas sabrosa que la version con crema.",
    fecha: ISODate("2026-02-05"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f06"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e05")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b09"),
    rating: 4,
    comentario: "El gazpacho quedo muy refrescante. Los tomates de temporada hacen toda la diferencia. Para el verano es perfecta.",
    fecha: ISODate("2026-02-10"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f07"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e03")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b10"),
    rating: 5,
    comentario: "El risotto requiere paciencia pero el resultado vale cada minuto. La mantequilla fria al final es el secreto de la cremosidad.",
    fecha: ISODate("2026-02-15"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f08"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e01")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b11"),
    rating: 5,
    comentario: "El caldo de costilla es el desayuno colombiano por excelencia. Con papa criolla y cilantro fresco es insuperable.",
    fecha: ISODate("2026-02-20"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f09"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e02")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b12"),
    rating: 5,
    comentario: "Los tamales tolimenses son un proyecto de dia completo pero el resultado es extraordinario. Los hice para navidad y fueron el exito.",
    fecha: ISODate("2026-02-25"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f10"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e04")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b13"),
    rating: 4,
    comentario: "Las empanadas de pipian son adictivas. El mani tostado le da un sabor unico que no se encuentra en otras empanadas.",
    fecha: ISODate("2026-03-01"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f11"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e07")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b14"),
    rating: 5,
    comentario: "El arroz con leche de mi abuela exactamente. La clave es la paciencia y no dejar de revolver. Quedo cremoso y perfecto.",
    fecha: ISODate("2026-03-05"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f12"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e08")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b15"),
    rating: 5,
    comentario: "El guacamole con textura rustica es completamente diferente al licuado. Nunca mas volvere a usar licuadora para esto.",
    fecha: ISODate("2026-03-10"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f13"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e04")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b16"),
    rating: 5,
    comentario: "El tiramisu quedo increible. Las claras a punto de nieve son fundamentales para la textura aerea. Definitivamente la mejor receta.",
    fecha: ISODate("2026-03-15"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f14"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e03")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b17"),
    rating: 5,
    comentario: "El hummus con garbanzos pelados individualmente es otra dimension. El trabajo extra vale completamente la pena.",
    fecha: ISODate("2026-03-20"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f15"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e01")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b18"),
    rating: 4,
    comentario: "La crema de esparragos quedo muy elegante. Las puntas asadas para decorar son un detalle que marca la diferencia visual.",
    fecha: ISODate("2026-03-25"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f16"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e05")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b19"),
    rating: 5,
    comentario: "El pollo a la brasa con 24 horas de marinada quedo con sabor autentico peruano. El aji verde de hierbabuena es imprescindible.",
    fecha: ISODate("2026-04-01"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f17"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e06")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b20"),
    rating: 5,
    comentario: "El sushi quedo perfecto. El arroz a temperatura ambiente y el cuchillo humedo para cortar hacen toda la diferencia.",
    fecha: ISODate("2026-04-05"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f18"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e09")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b21"),
    rating: 5,
    comentario: "Las arepas de choclo son mi desayuno favorito de fin de semana. Con queso campesino derritiendose son simplemente perfectas.",
    fecha: ISODate("2026-04-10"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f19"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e02")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b22"),
    rating: 5,
    comentario: "El lomo saltado en wok a fuego muy alto queda completamente diferente. El vinagre le da el toque acido caracteristico perfecto.",
    fecha: ISODate("2026-04-15"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f20"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e10")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b23"),
    rating: 4,
    comentario: "El curry de garbanzos es mi receta vegana favorita. Nutritivo, sabroso y muy facil de preparar entre semana.",
    fecha: ISODate("2026-04-20"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f21"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e07")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b24"),
    rating: 5,
    comentario: "Las croquetas quedaron cremosas por dentro y crujientes por fuera. La bechamel bien espesa es el secreto para que no se abran.",
    fecha: ISODate("2026-04-25"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f22"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e01")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b25"),
    rating: 5,
    comentario: "El pad thai con salsa de tamarindo autentica es incomparable. Los fideos remojados en vez de hervidos quedan perfectos.",
    fecha: ISODate("2026-05-01"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f23"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e08")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b26"),
    rating: 5,
    comentario: "La paella valenciana sin revolver es un acto de fe que vale la pena. El socarrat del fondo es la mejor parte del plato. El azafran tostado antes de disolver potencia enormemente el color y el aroma.",
    fecha: ISODate("2026-05-05"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f24"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e03")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b27"),
    rating: 5,
    comentario: "El ramen tonkotsu casero es un proyecto de fin de semana completo pero el resultado justifica cada hora de coccion. El caldo blanco cremoso es adictivo. Los huevos marinados en soya son el toque que lo eleva completamente.",
    fecha: ISODate("2026-05-08"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f31"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e04")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b28"),
    rating: 4,
    comentario: "El locro argentino es contundente y reconfortante para los dias frios. El zapallo deshecho completamente es lo que espesa el guiso de manera natural. El quiquirimichi picante aparte es imprescindible.",
    fecha: ISODate("2026-05-10"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f34"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e07")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b29"),
    rating: 5,
    comentario: "El mole poblano es la receta mas compleja que he preparado. Tostar los chiles sin quemarlos es critico. El chocolate amargo al final debe agregarse poco a poco probando constantemente para no endulzar demas.",
    fecha: ISODate("2026-05-12"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f37"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e01")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b30"),
    rating: 5,
    comentario: "El pollo tikka masala con marinada de yogur de 4 horas queda con una textura increiblemente tierna. El garam masala al final preserva todos sus aromas. Con arroz basmati y pan naan es una combinacion perfecta.",
    fecha: ISODate("2026-05-15"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f28"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e09")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b31"),
    rating: 4,
    comentario: "Las crepes suzette flameadas son un espectaculo visual ademas de deliciosas. La masa reposa 30 minutos para que el gluten se relaje y las crepes queden mas tiernas. El Grand Marnier flambeado carameliza el azucar perfectamente.",
    fecha: ISODate("2026-05-18"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f36"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e05")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b32"),
    rating: 5,
    comentario: "El bibimbap coreano con gochujang es una explosion de sabores y colores. Cada vegetal salteado por separado mantiene su identidad. El huevo frito con yema liquida al mezclar todo se convierte en una salsa que une perfectamente.",
    fecha: ISODate("2026-05-20"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f50"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e06")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b33"),
    rating: 5,
    comentario: "La tartiflette savoyarda con queso reblochon es el plato de invierno mas reconfortante que existe. Las papas casi cocidas que se terminan en el horno quedan con una textura perfecta. El vino blanco de acompanamiento es obligatorio.",
    fecha: ISODate("2026-05-22"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f48"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e08")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b34"),
    rating: 5,
    comentario: "La cazuela de mariscos con azafran es elegante y deliciosa. El orden de adicion de los mariscos segun su tiempo de coccion es critico. Los camarones al final solo 3 minutos o quedan de goma. Con pan tostado con ajo es perfecta.",
    fecha: ISODate("2026-05-25"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f49"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e10")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9b35"),
    rating: 5,
    comentario: "El arroz chaufa con arroz del dia anterior es fundamental para que no se apelmace. El wok a fuego maximo es imprescindible para el sabor ahumado caracteristico. En menos de 5 minutos a fuego alto queda perfectamente salteado.",
    fecha: ISODate("2026-05-28"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f46"),
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e02")
  }
])

print("✓ 35 valoraciones insertadas correctamente")
db.historial_cocciones.insertMany([
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c01"),
    fecha: ISODate("2026-01-16"),
    foto_url: "https://cookflow.com/img/historial/carlos_ajiaco.jpg",
    rating_inmediato: 5,
    porciones_reales: 4,
    notas: "Le agregue mas guascas de lo normal y quedo espectacular. La proxima vez voy a probar con menos sal.",
    variaciones: [
      { ingrediente: "pechuga de pollo", sustituido_por: "muslo de pollo deshuesado", razon: "era lo que tenia disponible" }
    ],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e02"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f01")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c02"),
    fecha: ISODate("2026-01-20"),
    foto_url: "https://cookflow.com/img/historial/sofia_curry.jpg",
    rating_inmediato: 5,
    porciones_reales: 3,
    notas: "Segui el consejo de marinar el pollo en yogur antes. La diferencia es brutal. Quedo mucho mas tierno.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e03"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f03")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c03"),
    fecha: ISODate("2026-01-25"),
    foto_url: "https://cookflow.com/img/historial/laura_bandeja.jpg",
    rating_inmediato: 4,
    porciones_reales: 6,
    notas: "La bandeja para reunion familiar fue un exito. El chicharron quedo perfecto aunque tardo mas de lo esperado.",
    variaciones: [
      { ingrediente: "morcilla", sustituido_por: "chorizo adicional", razon: "no consegui morcilla en el mercado" }
    ],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e01"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f02")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c04"),
    fecha: ISODate("2026-02-01"),
    foto_url: "https://cookflow.com/img/historial/miguel_carbonara.jpg",
    rating_inmediato: 5,
    porciones_reales: 2,
    notas: "Primera vez sin crema de leche y es completamente diferente. Nunca mas volvere a la version con crema.",
    variaciones: [
      { ingrediente: "guanciale", sustituido_por: "tocino ahumado", razon: "el guanciale es muy dificil de conseguir" }
    ],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e04"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f06")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c05"),
    fecha: ISODate("2026-02-05"),
    foto_url: "https://cookflow.com/img/historial/ana_gazpacho.jpg",
    rating_inmediato: 5,
    porciones_reales: 8,
    notas: "Lo prepare para una cena de verano. Todos los invitados pidieron la receta. Los tomates de temporada son clave.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e05"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f07")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c06"),
    fecha: ISODate("2026-02-10"),
    foto_url: "https://cookflow.com/img/historial/diego_risotto.jpg",
    rating_inmediato: 4,
    porciones_reales: 4,
    notas: "El risotto requiere concentracion total. Me distraje un momento y se pego un poco al fondo. La proxima vez mejor.",
    variaciones: [
      { ingrediente: "champiñones mixtos", sustituido_por: "champiñones de Paris", razon: "era lo disponible en el supermercado" }
    ],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e06"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f08")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c07"),
    fecha: ISODate("2026-02-15"),
    foto_url: "https://cookflow.com/img/historial/valentina_hummus.jpg",
    rating_inmediato: 5,
    porciones_reales: 10,
    notas: "Pelar los garbanzos individualmente es tedioso pero el resultado es cremosisimo. Para reuniones es perfecto.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e07"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f15")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c08"),
    fecha: ISODate("2026-02-20"),
    foto_url: "https://cookflow.com/img/historial/andres_caldo.jpg",
    rating_inmediato: 5,
    porciones_reales: 6,
    notas: "El caldo de costilla para el desayuno del domingo es una tradicion familiar. Con arepa es perfecto.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e08"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f09")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c09"),
    fecha: ISODate("2026-02-25"),
    foto_url: "https://cookflow.com/img/historial/camila_ceviche.jpg",
    rating_inmediato: 5,
    porciones_reales: 4,
    notas: "El ceviche es la receta mas rapida y fresca que he preparado. No mas de 20 minutos en limon, eso es fundamental.",
    variaciones: [
      { ingrediente: "aji", sustituido_por: "salsa tabasco", razon: "preferencia de picante controlado" }
    ],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e09"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f05")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c10"),
    fecha: ISODate("2026-03-01"),
    foto_url: "https://cookflow.com/img/historial/felipe_pollo_brasa.jpg",
    rating_inmediato: 5,
    porciones_reales: 6,
    notas: "Las 24 horas de marinada son innegociables. El sabor penetra hasta el hueso. El aji verde de hierbabuena es extraordinario.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e10"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f17")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c11"),
    fecha: ISODate("2026-03-05"),
    foto_url: "https://cookflow.com/img/historial/laura_tamales.jpg",
    rating_inmediato: 5,
    porciones_reales: 12,
    notas: "Los tamales tolimenses para navidad fueron un exito rotundo. La hoja de platano asada previamente es fundamental.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e01"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f10")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c12"),
    fecha: ISODate("2026-03-10"),
    foto_url: "https://cookflow.com/img/historial/carlos_tikka.jpg",
    rating_inmediato: 5,
    porciones_reales: 4,
    notas: "El tikka masala con marinada de yogur quedo con una textura increible. La crema al final le da una suavidad perfecta.",
    variaciones: [
      { ingrediente: "crema de leche", sustituido_por: "yogur griego", razon: "version mas ligera y saludable" }
    ],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e02"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f28")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c13"),
    fecha: ISODate("2026-03-15"),
    foto_url: "https://cookflow.com/img/historial/sofia_garbanzos.jpg",
    rating_inmediato: 4,
    porciones_reales: 4,
    notas: "El curry de garbanzos es mi receta vegana de cabecera. Rapido, nutritivo y delicioso. Las espinacas al final quedan perfectas.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e03"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f21")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c14"),
    fecha: ISODate("2026-03-20"),
    foto_url: "https://cookflow.com/img/historial/miguel_lasana.jpg",
    rating_inmediato: 5,
    porciones_reales: 8,
    notas: "La lasana con soffritto autentico es completamente diferente. El reposo de 15 minutos antes de cortar es fundamental.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e04"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f30")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c15"),
    fecha: ISODate("2026-03-25"),
    foto_url: "https://cookflow.com/img/historial/ana_paella.jpg",
    rating_inmediato: 5,
    porciones_reales: 6,
    notas: "La paella sin revolver es un acto de fe pero el socarrat que se forma en el fondo es la recompensa perfecta.",
    variaciones: [
      { ingrediente: "conejo", sustituido_por: "pollo adicional", razon: "dificultad para conseguir conejo fresco" }
    ],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e05"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f24")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c16"),
    fecha: ISODate("2026-04-01"),
    foto_url: "https://cookflow.com/img/historial/diego_sushi.jpg",
    rating_inmediato: 4,
    porciones_reales: 4,
    notas: "El sushi casero requiere practica para el enrollado. El segundo intento quedo mucho mejor que el primero.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e06"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f18")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c17"),
    fecha: ISODate("2026-04-05"),
    foto_url: "https://cookflow.com/img/historial/valentina_guacamole.jpg",
    rating_inmediato: 5,
    porciones_reales: 8,
    notas: "El guacamole rustico para la reunion fue un exito. Lo prepare al momento y no sobro nada. El limon evita la oxidacion.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e07"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f13")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c18"),
    fecha: ISODate("2026-04-10"),
    foto_url: "https://cookflow.com/img/historial/andres_chili.jpg",
    rating_inmediato: 4,
    porciones_reales: 6,
    notas: "El chili al dia siguiente esta mucho mejor. Lo prepare un dia antes para la reunion y fue la mejor decision.",
    variaciones: [
      { ingrediente: "carne molida de res", sustituido_por: "carne molida mixta res y cerdo", razon: "queria mas sabor" }
    ],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e08"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f29")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c19"),
    fecha: ISODate("2026-04-15"),
    foto_url: "https://cookflow.com/img/historial/camila_arepa.jpg",
    rating_inmediato: 5,
    porciones_reales: 6,
    notas: "Las arepas de choclo son el desayuno perfecto. El queso campesino derritiendose dentro es simplemente irresistible.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e09"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f19")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c20"),
    fecha: ISODate("2026-04-20"),
    foto_url: "https://cookflow.com/img/historial/felipe_lomo.jpg",
    rating_inmediato: 5,
    porciones_reales: 4,
    notas: "El lomo saltado en porciones pequenas para que se dore bien es el secreto. El wok muy caliente hace toda la diferencia.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e10"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f20")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c21"),
    fecha: ISODate("2026-04-25"),
    foto_url: "https://cookflow.com/img/historial/laura_sancocho.jpg",
    rating_inmediato: 5,
    porciones_reales: 8,
    notas: "El sancocho con gallina de campo es incomparable. El caldo queda con un sabor profundo que el pollo de granja nunca da. Las tres raices en orden de dureza es el truco para que todo quede en su punto.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e01"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f04")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c22"),
    fecha: ISODate("2026-04-28"),
    foto_url: "https://cookflow.com/img/historial/carlos_empanadas.jpg",
    rating_inmediato: 5,
    porciones_reales: 24,
    notas: "Las empanadas de pipian para la venta del colegio fueron un exito total. El mani tostado en seco es fundamental para el sabor autentico. El aceite a 180 grados exactos hace que queden doradas sin absorber grasa.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e02"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f11")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c23"),
    fecha: ISODate("2026-05-02"),
    foto_url: "https://cookflow.com/img/historial/sofia_tiramisu.jpg",
    rating_inmediato: 5,
    porciones_reales: 10,
    notas: "El tiramisu para el cumpleanos de mi mama quedo perfecto. El cafe bien frio para mojar las galletas es clave, si esta caliente las deshace completamente. Las claras a punto de nieve firme le dan esa textura aerea caracteristica.",
    variaciones: [
      { ingrediente: "marsala", sustituido_por: "ron oscuro", razon: "no tenia marsala disponible" }
    ],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e03"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f14")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c24"),
    fecha: ISODate("2026-05-05"),
    foto_url: "https://cookflow.com/img/historial/miguel_padthai.jpg",
    rating_inmediato: 4,
    porciones_reales: 3,
    notas: "El pad thai con salsa de tamarindo autentica es una revelacion. Los fideos remojados en vez de hervidos quedan con una textura completamente diferente. El wok debe estar extremadamente caliente para lograr el sabor ahumado.",
    variaciones: [
      { ingrediente: "salsa de pescado", sustituido_por: "salsa de soya", razon: "preferencia personal por el olor" }
    ],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e04"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f23")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c25"),
    fecha: ISODate("2026-05-08"),
    foto_url: "https://cookflow.com/img/historial/ana_moussaka.jpg",
    rating_inmediato: 5,
    porciones_reales: 6,
    notas: "La moussaka con berenjena bien salada y reposada elimina completamente el amargor. La canela en la carne suena rara pero es completamente autentica y deliciosa. La bechamel muy espesa es lo que sostiene las capas perfectamente.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e05"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f33")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c26"),
    fecha: ISODate("2026-05-10"),
    foto_url: "https://cookflow.com/img/historial/diego_carnitas.jpg",
    rating_inmediato: 5,
    porciones_reales: 8,
    notas: "Las carnitas con 3 horas de coccion lenta quedan con una textura que se deshace. Dorarlas en su propia grasa al final es el secreto del crujiente exterior con interior jugoso. La naranja equilibra perfectamente la grasa del cerdo.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e06"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f26")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c27"),
    fecha: ISODate("2026-05-12"),
    foto_url: "https://cookflow.com/img/historial/valentina_shakshuka.jpg",
    rating_inmediato: 5,
    porciones_reales: 4,
    notas: "La shakshuka con huevos de yema liquida es el desayuno mas satisfactorio que he preparado. El pimenton ahumado le da una profundidad que el dulce no puede reemplazar. Con pan artesanal para mojar en la salsa es perfecta.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e07"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f27")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c28"),
    fecha: ISODate("2026-05-15"),
    foto_url: "https://cookflow.com/img/historial/andres_feijoada.jpg",
    rating_inmediato: 5,
    porciones_reales: 10,
    notas: "La feijoada preparada el dia anterior esta en otro nivel. Los sabores se integran completamente durante el reposo. La farofa de mantequilla es imprescindible para absorber el caldo espeso y la naranja corta la grasa de manera perfecta.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e08"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f32")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c29"),
    fecha: ISODate("2026-05-18"),
    foto_url: "https://cookflow.com/img/historial/camila_biryani.jpg",
    rating_inmediato: 5,
    porciones_reales: 6,
    notas: "El biryani es el plato mas elaborado que he preparado pero el resultado es extraordinario. La tecnica dum pukht sellada hace que todos los aromas se concentren dentro. La cebolla frita crujiente es el elemento que no puede faltar.",
    variaciones: [
      { ingrediente: "cordero", sustituido_por: "pollo", razon: "preferencia familiar por el pollo" }
    ],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e09"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f41")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c30"),
    fecha: ISODate("2026-05-20"),
    foto_url: "https://cookflow.com/img/historial/felipe_borsch.jpg",
    rating_inmediato: 4,
    porciones_reales: 6,
    notas: "El borsch con vinagre para fijar el color rojo es el truco mas importante. Sin vinagre la sopa se vuelve marron opaca. La crema agria generosa al servir es imprescindible. Al dia siguiente el sabor mejora notablemente.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e10"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f38")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c31"),
    fecha: ISODate("2026-05-22"),
    foto_url: "https://cookflow.com/img/historial/laura_arroz_leche.jpg",
    rating_inmediato: 5,
    porciones_reales: 8,
    notas: "El arroz con leche de mi abuela exactamente. La clave es no agregar el azucar al inicio y revolver constantemente. La cascara de limon sin la parte blanca es fundamental para el sabor. Con canela en polvo al servir es perfecto.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e01"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f12")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c32"),
    fecha: ISODate("2026-05-25"),
    foto_url: "https://cookflow.com/img/historial/carlos_pollo_ajillo.jpg",
    rating_inmediato: 5,
    porciones_reales: 4,
    notas: "El pollo al ajillo con dos cabezas de ajo enteras suena exagerado pero el resultado es sublime. Los ajos confitados en el aceite quedan dulces y cremosos. El vino blanco seco es imprescindible para desglasar perfectamente.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e02"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f39")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c33"),
    fecha: ISODate("2026-05-28"),
    foto_url: "https://cookflow.com/img/historial/sofia_tortilla.jpg",
    rating_inmediato: 5,
    porciones_reales: 6,
    notas: "La tortilla espanola con papas confitadas lentamente en aceite es completamente diferente a la version frita. Queda jugosa y cremosa en el centro. El punto baveuse interior es el objetivo y requiere practica para lograrlo.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e03"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f40")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c34"),
    fecha: ISODate("2026-05-30"),
    foto_url: "https://cookflow.com/img/historial/miguel_carne_asada.jpg",
    rating_inmediato: 5,
    porciones_reales: 4,
    notas: "La carne asada con brasas reales es incomparable al gas. La sal solo antes de poner en la parrilla es el secreto para que no pierda jugos. El chimichurri reposado dos horas tiene un sabor completamente diferente al recien preparado.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e04"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f42")
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9c35"),
    fecha: ISODate("2026-06-01"),
    foto_url: "https://cookflow.com/img/historial/ana_miso.jpg",
    rating_inmediato: 5,
    porciones_reales: 4,
    notas: "La sopa de miso nunca debe hervir despues de agregar el miso o se destruyen todos sus probioticos beneficiosos. El dashi casero con kombu y bonito es completamente diferente al instantaneo. El tofu sedoso es el unico apropiado para esta sopa.",
    variaciones: [],
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e05"),
    receta_id: ObjectId("664a1b2c3d4e5f6a7b8c9f47")
  }
])

print("✓ 35 historial_cocciones insertados correctamente")
db.menus_semanales.insertMany([
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9a01"),
    semana_inicio: ISODate("2026-05-25"),
    estado: "activo",
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e01"),
    lista_compras_vigente: true,
    lista_compras_generada_en: ISODate("2026-05-24"),
    dias: [
      {
        dia: 1,
        desayuno: ObjectId("664a1b2c3d4e5f6a7b8c9f19"),
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f01"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f03")
      },
      {
        dia: 2,
        desayuno: ObjectId("664a1b2c3d4e5f6a7b8c9f12"),
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f04"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f06")
      },
      {
        dia: 3,
        desayuno: ObjectId("664a1b2c3d4e5f6a7b8c9f19"),
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f09"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f08")
      },
      {
        dia: 4,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f02"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f07")
      },
      {
        dia: 5,
        desayuno: ObjectId("664a1b2c3d4e5f6a7b8c9f19"),
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f10"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f14")
      },
      {
        dia: 6,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f24"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f13")
      },
      {
        dia: 7,
        desayuno: ObjectId("664a1b2c3d4e5f6a7b8c9f12"),
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f01"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f15")
      }
    ],
    lista_compras: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d01"), nombre: "Pechuga de pollo", cantidad_necesaria: 1500, unidad: "gr", tienes_en_casa: 500, comprar: 1000 },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d02"), nombre: "Papa criolla", cantidad_necesaria: 700, unidad: "gr", tienes_en_casa: 400, comprar: 300 },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d10"), nombre: "Leche de coco", cantidad_necesaria: 400, unidad: "ml", tienes_en_casa: 0, comprar: 400 },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d06"), nombre: "Guascas", cantidad_necesaria: 20, unidad: "gr", tienes_en_casa: 0, comprar: 20 },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d45"), nombre: "Maiz choclo desgranado", cantidad_necesaria: 1000, unidad: "gr", tienes_en_casa: 0, comprar: 1000 }
    ]
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9a02"),
    semana_inicio: ISODate("2026-05-25"),
    estado: "activo",
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e02"),
    lista_compras_vigente: true,
    lista_compras_generada_en: ISODate("2026-05-24"),
    dias: [
      {
        dia: 1,
        desayuno: ObjectId("664a1b2c3d4e5f6a7b8c9f09"),
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f02"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f16")
      },
      {
        dia: 2,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f28"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f20")
      },
      {
        dia: 3,
        desayuno: ObjectId("664a1b2c3d4e5f6a7b8c9f19"),
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f04"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f22")
      },
      {
        dia: 4,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f29"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f06")
      },
      {
        dia: 5,
        desayuno: ObjectId("664a1b2c3d4e5f6a7b8c9f09"),
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f17"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f08")
      },
      {
        dia: 6,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f42"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f13")
      },
      {
        dia: 7,
        desayuno: ObjectId("664a1b2c3d4e5f6a7b8c9f19"),
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f02"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f14")
      }
    ],
    lista_compras: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d07"), nombre: "Frijoles rojos", cantidad_necesaria: 400, unidad: "gr", tienes_en_casa: 0, comprar: 400 },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d08"), nombre: "Chicharron", cantidad_necesaria: 300, unidad: "gr", tienes_en_casa: 150, comprar: 150 },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d47"), nombre: "Lomo de res", cantidad_necesaria: 500, unidad: "gr", tienes_en_casa: 0, comprar: 500 },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d42"), nombre: "Aji panca", cantidad_necesaria: 30, unidad: "gr", tienes_en_casa: 0, comprar: 30 }
    ]
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9a03"),
    semana_inicio: ISODate("2026-05-25"),
    estado: "activo",
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e03"),
    lista_compras_vigente: true,
    lista_compras_generada_en: ISODate("2026-05-24"),
    dias: [
      {
        dia: 1,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f21"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f15")
      },
      {
        dia: 2,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f07"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f27")
      },
      {
        dia: 3,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f48"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f13")
      },
      {
        dia: 4,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f11"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f47")
      },
      {
        dia: 5,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f21"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f16")
      },
      {
        dia: 6,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f33"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f14")
      },
      {
        dia: 7,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f50"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f15")
      }
    ],
    lista_compras: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d39"), nombre: "Garbanzos cocidos", cantidad_necesaria: 800, unidad: "gr", tienes_en_casa: 400, comprar: 400 },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d48"), nombre: "Espinacas frescas", cantidad_necesaria: 600, unidad: "gr", tienes_en_casa: 300, comprar: 300 },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d40"), nombre: "Tahini", cantidad_necesaria: 120, unidad: "gr", tienes_en_casa: 250, comprar: 0 },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d10"), nombre: "Leche de coco", cantidad_necesaria: 400, unidad: "ml", tienes_en_casa: 0, comprar: 400 }
    ]
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9a04"),
    semana_inicio: ISODate("2026-05-25"),
    estado: "activo",
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e05"),
    lista_compras_vigente: false,
    lista_compras_generada_en: ISODate("2026-05-24"),
    dias: [
      {
        dia: 1,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f07"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f16")
      },
      {
        dia: 2,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f24"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f49")
      },
      {
        dia: 3,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f27"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f08")
      },
      {
        dia: 4,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f40"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f36")
      },
      {
        dia: 5,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f45"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f07")
      },
      {
        dia: 6,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f17"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f13")
      },
      {
        dia: 7,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f33"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f14")
      }
    ],
    lista_compras: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d31"), nombre: "Tomates maduros", cantidad_necesaria: 2000, unidad: "gr", tienes_en_casa: 600, comprar: 1400 },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d33"), nombre: "Aceite de oliva virgen extra", cantidad_necesaria: 300, unidad: "ml", tienes_en_casa: 500, comprar: 0 },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d34"), nombre: "Arroz bomba", cantidad_necesaria: 400, unidad: "gr", tienes_en_casa: 0, comprar: 400 },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d35"), nombre: "Azafran", cantidad_necesaria: 2, unidad: "gr", tienes_en_casa: 0, comprar: 2 }
    ]
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9a05"),
    semana_inicio: ISODate("2026-06-01"),
    estado: "activo",
    usuario_id: ObjectId("664a1b2c3d4e5f6a7b8c9e07"),
    lista_compras_vigente: true,
    lista_compras_generada_en: ISODate("2026-05-31"),
    dias: [
      {
        dia: 1,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f47"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f13")
      },
      {
        dia: 2,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f50"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f15")
      },
      {
        dia: 3,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f18"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f47")
      },
      {
        dia: 4,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f21"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f13")
      },
      {
        dia: 5,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f46"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f15")
      },
      {
        dia: 6,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f44"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f13")
      },
      {
        dia: 7,
        desayuno: null,
        almuerzo: ObjectId("664a1b2c3d4e5f6a7b8c9f18"),
        cena: ObjectId("664a1b2c3d4e5f6a7b8c9f47")
      }
    ],
    lista_compras: [
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d43"), nombre: "Salmon grado sashimi", cantidad_necesaria: 600, unidad: "gr", tienes_en_casa: 0, comprar: 600 },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d44"), nombre: "Alga nori", cantidad_necesaria: 8, unidad: "unidad", tienes_en_casa: 0, comprar: 8 },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d23"), nombre: "Aguacate Hass", cantidad_necesaria: 6, unidad: "unidad", tienes_en_casa: 0, comprar: 6 },
      { ingrediente_id: ObjectId("664a1b2c3d4e5f6a7b8c9d39"), nombre: "Garbanzos cocidos", cantidad_necesaria: 400, unidad: "gr", tienes_en_casa: 500, comprar: 0 }
    ]
  }
])

print("✓ 5 menus semanales insertados correctamente")
db.retos_culinarios.insertMany([
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d51"),
    nombre: "Reto de la semana: cocina colombiana tradicional",
    descripcion: "Publica tu mejor receta de cocina tradicional colombiana. Se evaluara autenticidad, presentacion y facilidad de replicacion por otros usuarios de la plataforma.",
    fecha_inicio: ISODate("2026-05-25"),
    fecha_fin: ISODate("2026-06-01"),
    ingrediente_tema: "papa criolla",
    estado: "activo",
    total_participantes: 47,
    recetas_participantes: [
      ObjectId("664a1b2c3d4e5f6a7b8c9f01"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f02"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f04"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f09"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f10"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f11")
    ]
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d52"),
    nombre: "Reto mensual: recetas sin gluten",
    descripcion: "Comparte recetas completamente libres de gluten que no sacrifiquen sabor ni presentacion. El objetivo es demostrar que comer sin gluten puede ser delicioso y variado.",
    fecha_inicio: ISODate("2026-06-01"),
    fecha_fin: ISODate("2026-06-30"),
    ingrediente_tema: "maiz",
    estado: "activo",
    total_participantes: 32,
    recetas_participantes: [
      ObjectId("664a1b2c3d4e5f6a7b8c9f03"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f05"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f07"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f13"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f15"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f17"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f19")
    ]
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d53"),
    nombre: "Reto express: platos en menos de 30 minutos",
    descripcion: "Demuestra que la cocina rapida puede ser deliciosa y nutritiva. Solo se aceptan recetas que puedan prepararse en 30 minutos o menos desde que empiezas hasta que sirves.",
    fecha_inicio: ISODate("2026-06-01"),
    fecha_fin: ISODate("2026-06-15"),
    ingrediente_tema: "huevo",
    estado: "activo",
    total_participantes: 89,
    recetas_participantes: [
      ObjectId("664a1b2c3d4e5f6a7b8c9f03"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f05"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f06"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f07"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f13"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f15"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f23"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f27"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f46"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f47")
    ]
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d54"),
    nombre: "Reto internacional: cocinas del mundo",
    descripcion: "Explora y comparte recetas de cualquier cocina internacional. Valoraremos la autenticidad de los ingredientes, la fidelidad a la tecnica original y la calidad de la presentacion.",
    fecha_inicio: ISODate("2026-05-01"),
    fecha_fin: ISODate("2026-05-31"),
    ingrediente_tema: "especias",
    estado: "finalizado",
    total_participantes: 124,
    recetas_participantes: [
      ObjectId("664a1b2c3d4e5f6a7b8c9f14"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f18"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f21"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f22"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f23"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f24"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f28"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f31"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f37"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f38"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f41"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f50")
    ]
  },
  {
    _id: ObjectId("664a1b2c3d4e5f6a7b8c9d55"),
    nombre: "Reto saludable: recetas bajas en calorias",
    descripcion: "Comparte recetas deliciosas con menos de 300 calorias por porcion. Demostremos que comer sano no significa comer aburrido ni sin sabor.",
    fecha_inicio: ISODate("2026-06-01"),
    fecha_fin: ISODate("2026-06-30"),
    ingrediente_tema: "esparragos",
    estado: "activo",
    total_participantes: 56,
    recetas_participantes: [
      ObjectId("664a1b2c3d4e5f6a7b8c9f05"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f07"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f15"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f16"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f27"),
      ObjectId("664a1b2c3d4e5f6a7b8c9f47")
    ]
  }
])

print("✓ 5 retos culinarios insertados correctamente")
print("")
print("=== RESUMEN FINAL DE POBLACION DE LA BASE DE DATOS ===")
print("ingredientes:      50 documentos")
print("perfiles_usuarios: 10 documentos")
print("recetas:           50 documentos")
print("valoraciones:      35 documentos")
print("historial_cocciones: 35 documentos")
print("menus_semanales:    5 documentos")
print("retos_culinarios:   5 documentos")
print("======================================================")
print("Total documentos operacionales: 190")
