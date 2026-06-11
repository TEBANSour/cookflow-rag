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