// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("EducatIO_NoSQL");


/*
db.conversaciones.insertOne({
  _id: ObjectId("aaaaaaaaaaaaaaaaaaaaaaaa"),
  nombreConversacion: "Conectividad a Datos - Grupo General",
  claseId: "GIB-2504",
  esDirect: false,
  participantes: [1, 2, 3],
  administradores: {
    principal: 4,
    designados: []
  },
  fechaCreacion: new Date("2026-03-10T08:00:00Z"),
  activa: true
});
*/
/*
db.mensajes.insertMany([
  {
    _id: ObjectId("bbbbbbbbbbbbbbbbbbbbbbbb"),
    conversacionId: ObjectId("aaaaaaaaaaaaaaaaaaaaaaaa"),
    emisorId: 1,
    contenido: "Buenas, ¿ya vieron la fecha de entrega del proyecto?",
    fechaEmision: new Date("2026-03-10T09:00:00Z"),
    editado: false,
    totalEdiciones: 0,
    historialEdiciones: [],
    eliminado: false,
    visible: true,
    reportes: []
  },
  {
    _id: ObjectId("cccccccccccccccccccccccc"),
    conversacionId: ObjectId("aaaaaaaaaaaaaaaaaaaaaaaa"),
    emisorId: 2,
    contenido: "Sí, es el viernes 20. Yo ya casi termino mi parte.",
    fechaEmision: new Date("2026-03-10T09:05:00Z"),
    editado: false,
    totalEdiciones: 0,
    historialEdiciones: [],
    eliminado: false,
    visible: true,
    reportes: []
  },
  {
    _id: ObjectId("dddddddddddddddddddddddd"),
    conversacionId: ObjectId("aaaaaaaaaaaaaaaaaaaaaaaa"),
    emisorId: 3,
    contenido: "Yo tampoco he empezado jeje",
    fechaEmision: new Date("2026-03-10T09:10:00Z"),
    editado: false,
    totalEdiciones: 0,
    historialEdiciones: [],
    eliminado: false,
    visible: true,
    reportes: []
  }
]);

*/
/*

db.mensajes.updateOne(
  { _id: ObjectId("bbbbbbbbbbbbbbbbbbbbbbbb") },
  {
    $set: {
      contenido: "Buenas, ¿ya vieron que la entrega del proyecto es el viernes?",
      editado: true,
      totalEdiciones: 1
    },
    $push: {
      historialEdiciones: {
        contenidoAnterior: "Buenas, ¿ya vieron la fecha de entrega del proyecto?",
        numeroEdicion: 1,
        fechaEdicion: new Date("2026-03-10T09:15:00Z")
      }
    }
  }
);

db.mensajes.updateOne(
  { _id: ObjectId("cccccccccccccccccccccccc") },
  {
    $set: {
      contenido: "Sí, es el viernes 20 a las 11pm. Yo ya casi termino mi parte.",
      editado: true,
      totalEdiciones: 1
    },
    $push: {
      historialEdiciones: {
        contenidoAnterior: "Sí, es el viernes 20. Yo ya casi termino mi parte.",
        numeroEdicion: 1,
        fechaEdicion: new Date("2026-03-10T09:20:00Z")
      }
    }
  }
);

db.mensajes.updateOne(
  { _id: ObjectId("dddddddddddddddddddddddd") },
  {
    $set: {
      contenido: "Yo no he empezado nada",
      editado: true,
      totalEdiciones: 1
    },
    $push: {
      historialEdiciones: {
        contenidoAnterior: "Yo tampoco he empezado jeje",
        numeroEdicion: 1,
        fechaEdicion: new Date("2026-03-10T09:25:00Z")
      }
    }
  }
);
*/

/*
db.mensajes.updateOne(
  { _id: ObjectId("dddddddddddddddddddddddd") },
  {
    $set: {
      contenido: "Yo no he empezado casi nada",
      totalEdiciones: 2
    },
    $push: {
      historialEdiciones: {
        contenidoAnterior: "Yo no he empezado nada",
        numeroEdicion: 2,
        fechaEdicion: new Date("2026-03-10T09:30:00Z")
      }
    }
  }
);
*/

/*
db.mensajes.updateOne(
  { _id: ObjectId("dddddddddddddddddddddddd") },
  {
    $set: {
      contenido: "Yo no he empezado casi nada, me pueden ayudar?",
      totalEdiciones: 3
    },
    $push: {
      historialEdiciones: {
        contenidoAnterior: "Yo no he empezado casi nada",
        numeroEdicion: 3,
        fechaEdicion: new Date("2026-03-10T09:35:00Z")
      }
    }
  }
);

*/

/*
db.mensajes.updateOne(
  { _id: ObjectId("dddddddddddddddddddddddd") },
  {
    $set: {
      eliminado: true,
      visible: false
    }
  }
);
*/

/*
//Un ejemplo de documento eliminado
{
  _id: ObjectId("dddddddddddddddddddddddd"),
  conversacionId: ObjectId("aaaaaaaaaaaaaaaaaaaaaaaa"),
  emisorId: 3,
  contenido: "Yo no he empezado casi nada, me pueden ayudar?",
  fechaEmision: new Date("2026-03-10T09:10:00Z"),
  editado: true,
  totalEdiciones: 3,
  historialEdiciones: [
    { contenidoAnterior: "Yo tampoco he empezado jeje",        numeroEdicion: 1, fechaEdicion: ... },
    { contenidoAnterior: "Yo no he empezado nada",             numeroEdicion: 2, fechaEdicion: ... },
    { contenidoAnterior: "Yo no he empezado casi nada",        numeroEdicion: 3, fechaEdicion: ... }
  ],
  eliminado: true,
  visible: false,
  reportes: []
}
*/