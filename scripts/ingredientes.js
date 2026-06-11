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
