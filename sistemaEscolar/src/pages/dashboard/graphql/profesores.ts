// ============================================
// ARCHIVO: profesores.ts
// Módulo: Profesores
// Descripción: Consultas y mutaciones GraphQL para la gestión de profesores.
// ============================================

/**
 * Obtiene todos los profesores (sin paginación).
 * Útil para cargas completas, reportes o selectores que requieran la lista total.
 * 
 * @returns {Array} Lista de objetos Profesor con todos sus campos.
 */
export const GET_PROFESORES = `
  query GetProfesores {
    profesores {
      id_profesor
      empleado_id
      especialidad
      nivel_estudios
      cedula_profesional
    }
  }
`;

/**
 * Obtiene una página de profesores con paginación.
 * Se usa en la tabla principal para mostrar registros de forma paginada.
 *
 * @param {Int} page - Número de página (opcional, por defecto 1).
 * @param {Int} limit - Cantidad de registros por página (opcional, por defecto 10).
 * @returns {Array} Lista de profesores correspondiente a la página solicitada.
 */
export const GET_PROFESORES_PAGINATE = `
  query GetProfesoresPaginate($page: Int, $limit: Int) {
    profesoresP(page: $page, limit: $limit) {
      id_profesor
      empleado_id
      especialidad
      nivel_estudios
      cedula_profesional
    }
  }
`;

/**
 * Obtiene un profesor específico por su ID.
 * Se utiliza para cargar datos en formularios de edición o para mostrar detalles.
 *
 * @param {Int!} id - ID del profesor (obligatorio).
 * @returns {Object} Profesor encontrado o null si no existe.
 */
export const GET_PROFESOR = `
  query GetProfesor($id: Int!) {
    profesor(id: $id) {
      id_profesor
      empleado_id
      especialidad
      nivel_estudios
      cedula_profesional
    }
  }
`;

/**
 * Crea un nuevo profesor en la base de datos.
 *
 * @param {CreateProfesorInput!} input - Objeto con los datos del nuevo profesor (sin id).
 * @returns {Object} El profesor recién creado, incluyendo su ID generado.
 */
export const CREATE_PROFESOR = `
  mutation CreateProfesor($input: CreateProfesorInput!) {
    createProfesor(input: $input) {
      id_profesor
      empleado_id
      especialidad
      nivel_estudios
      cedula_profesional
    }
  }
`;

/**
 * Actualiza un profesor existente.
 *
 * @param {Int!} id - ID del profesor a actualizar.
 * @param {UpdateProfesorInput!} input - Objeto con los campos a modificar (todos opcionales).
 * @returns {Object} El profesor actualizado.
 */
export const UPDATE_PROFESOR = `
  mutation UpdateProfesor($id: Int!, $input: UpdateProfesorInput!) {
    updateProfesor(id: $id, input: $input) {
      id_profesor
      empleado_id
      especialidad
      nivel_estudios
      cedula_profesional
    }
  }
`;

/**
 * Elimina un profesor por su ID.
 *
 * @param {Int!} id - ID del profesor a eliminar.
 * @returns {Boolean} true si se eliminó correctamente, false en caso contrario.
 */
export const REMOVE_PROFESOR = `
  mutation RemoveProfesor($id: Int!) {
    removeProfesor(id: $id)
  }
`;
