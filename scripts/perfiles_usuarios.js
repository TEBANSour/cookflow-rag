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
