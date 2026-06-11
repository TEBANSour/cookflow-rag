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