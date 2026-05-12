// ============================================================
// BASE DE DATOS HÍBRIDA - EducatIO
// Parte NoSQL (MongoDB)
// Módulo: Conversaciones y Mensajes
// 
// NOTA: Los campos que terminan en "Id" hacen referencia
// a IDs de la parte SQL (MySQL). MongoDB no enforza estas
// relaciones, pero la aplicación debe validarlas.
// ============================================================

use("EducatIO_NoSQL");

// ============================================================
// COLECCIÓN: conversaciones
// Representa un canal de comunicación entre usuarios.
// Puede ser una conversación directa (ej. maestro-alumno)
// o grupal asociada a una materia/clase.
// ============================================================

db.createCollection("conversaciones");

db.conversaciones.insertOne({

  // Aqui iria el _id
  // _id es generado automáticamente por MongoDB (ObjectId)
  // Es el identificador único de esta conversación

  nombreConversacion: "Conectividad a Datos - Grupo General",
  // Nombre visible del chat para los participantes

  claseId: "78uH6X",
  // FK hacia Clases.Codigo_FK en SQL
  // Si es una conversación directa (1 a 1), este campo será null
  // Si el alumno sale de la clase en SQL, la app debe removerlo de participantes

  esDirect: false,
  // true  → conversación privada entre 2 usuarios (ej. maestro-alumno)
  // false → conversación grupal asociada a una clase

  participantes: [1, 2, 3],
  // Array de IDs → FK hacia Usuarios.IdUsuario_PK en SQL
  // Si un alumno es dado de baja en Usuario_Clase (SQL),
  // debe removerse de este array

  administradores: {
    // Los admins tienen permisos para: eliminar mensajes,
    // agregar/remover participantes, cambiar nombre del grupo, etc.

    principal: 4,
    // FK hacia Usuarios.IdUsuario_PK — siempre es el Docente
    // Solo el sistema puede cambiar este campo

    designados: []
    // Array de IDs de usuarios a los que el maestro les dio permisos de admin
    // Ejemplo: [2, 3] si el maestro designó a dos alumnos como moderadores
  },

  fechaCreacion: new Date(),
  // Fecha y hora en que se creó la conversación

  activa: true
  // false → la conversación fue archivada o la clase terminó
  // Los mensajes se conservan por historial/reportes
});


// ============================================================
// COLECCIÓN: mensajes
// Cada documento es un mensaje dentro de una conversación.
// Se referencia a "conversaciones" por conversacionId.
// Se maneja como colección separada porque el volumen de
// mensajes puede ser muy grande (una clase puede tener cientos).
// ============================================================

db.createCollection("mensajes");

db.mensajes.insertOne({
	
  // Aqui iria el _id
  // _id es generado automáticamente por MongoDB (ObjectId)
  // Es el identificador único de este mensaje	

  conversacionId: "AQUI_VA_EL_ObjectId_DE_LA_CONVERSACION",
  // FK hacia conversaciones._id
  // Así sabes a qué conversación pertenece este mensaje

  emisorId: 1,
  // FK hacia Usuarios.IdUsuario_PK en SQL
  // Quién envió el mensaje

  contenido: "Hola a todos, ¿cuándo es la entrega del proyecto?",
  // Contenido actual y vigente del mensaje
  // Si fue editado, aquí estará la versión más reciente

  fechaEmision: new Date(),
  // Fecha y hora exacta en que se envió originalmente

  // --- ESTADO DEL MENSAJE ---

  editado: false,
  // true → el contenido fue modificado al menos una vez
  // Sirve para mostrar la etiqueta "(editado)" en la UI

  totalEdiciones: 0,
  // Contador de cuántas veces fue editado
  // 0 = nunca editado, 1 = editado una vez, etc.

  historialEdiciones: [],
  // Array que guarda las versiones anteriores del mensaje.
  // VACÍO por defecto. Se llena cada vez que se edita.
  // Esto resuelve la duda de "cómo saber que un mensaje es edición":
  // NO se crea un documento nuevo, todo vive aquí dentro.
  //
  // Ejemplo de cómo quedaría después de 1 edición:
  // [
  //   {
  //     contenidoAnterior: "Hola, cuándo es la entrega??",
  //     fechaEdicion: ISODate("2026-03-10T14:00:00Z"),
  //     numeroEdicion: 1
  //   }
  // ]

  eliminado: false,
  // true  → el usuario o un admin marcó el mensaje como eliminado
  // NUNCA se borra físicamente el documento por si hay reportes

  visible: true,
  // Controla si el mensaje se muestra en la UI
  // Reglas:
  //   eliminado: true  → visible SIEMPRE debe ser false
  //   editado: true    → visible sigue siendo true (se muestra con etiqueta)
  //   Si en algún momento eliminado = true, visible = false y ya no cambia

  reportes: []
  // Array de reportes sobre este mensaje (por si se necesita moderación)
  // Ejemplo: [{ reportadoPor: 2, motivo: "Contenido inapropiado", fecha: ISODate() }]
  // Vacío por defecto
});