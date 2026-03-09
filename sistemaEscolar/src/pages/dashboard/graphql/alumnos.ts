// ============================================
// ARCHIVO: alumnos.ts
// Módulo: Alumnos
// Descripción: Consultas y mutaciones GraphQL para la gestión de alumnos.
// Basado en el resolver de NestJS (AlumnoResolver).
// ============================================

/**
 * Obtiene todos los alumnos (sin paginación).
 */
export const GET_ALUMNOS = `
  query GetAlumnos {
    alumnos {
      id_alumno
      matricula
      nombre
      apellido_p
      apellido_m
      genero
      curp
      email_institucional
      direccion
      tipo_sangre
      alergias
      condiciones_medicas
      fecha_ingreso
      activo
    }
  }
`;

/**
 * Obtiene una página de alumnos con paginación.
 * @param {Int} page - Número de página (opcional, por defecto 1).
 * @param {Int} limit - Cantidad por página (opcional, por defecto 10).
 */
export const GET_ALUMNOS_PAGINATE = `
  query GetAlumnosPaginate($page: Int, $limit: Int) {
    alumnosP(page: $page, limit: $limit) {
      id_alumno
      matricula
      nombre
      apellido_p
      apellido_m
      genero
      curp
      email_institucional
      direccion
      tipo_sangre
      alergias
      condiciones_medicas
      fecha_ingreso
      activo
    }
  }
`;

/**
 * Obtiene un alumno por su ID.
 * @param {Int!} id - ID del alumno.
 */
export const GET_ALUMNO = `
  query GetAlumno($id: Int!) {
    alumno(id: $id) {
      id_alumno
      matricula
      nombre
      apellido_p
      apellido_m
      genero
      curp
      email_institucional
      direccion
      tipo_sangre
      alergias
      condiciones_medicas
      fecha_ingreso
      activo
    }
  }
`;

/**
 * Crea un nuevo alumno.
 * @param {CreateAlumnoInput!} input - Datos del alumno a crear.
 */
export const CREATE_ALUMNO = `
  mutation CreateAlumno($input: CreateAlumnoInput!) {
    createAlumno(input: $input) {
      id_alumno
      matricula
      nombre
      apellido_p
      apellido_m
      genero
      curp
      email_institucional
      direccion
      tipo_sangre
      alergias
      condiciones_medicas
      fecha_ingreso
      activo
    }
  }
`;

/**
 * Actualiza un alumno existente.
 * @param {Int!} id - ID del alumno.
 * @param {UpdateAlumnoInput!} input - Campos a actualizar (todos opcionales).
 */
export const UPDATE_ALUMNO = `
  mutation UpdateAlumno($id: Int!, $input: UpdateAlumnoInput!) {
    updateAlumno(id: $id, input: $input) {
      id_alumno
      matricula
      nombre
      apellido_p
      apellido_m
      genero
      curp
      email_institucional
      direccion
      tipo_sangre
      alergias
      condiciones_medicas
      fecha_ingreso
      activo
    }
  }
`;

/**
 * Elimina un alumno por su ID.
 * @param {Int!} id - ID del alumno.
 * @returns {Boolean} true si se eliminó correctamente.
 */
export const REMOVE_ALUMNO = `
  mutation RemoveAlumno($id: Int!) {
    removeAlumno(id: $id)
  }
`;
