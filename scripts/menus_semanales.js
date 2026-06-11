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