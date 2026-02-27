// ============================================
// ARCHIVO: empleados.ts
// ============================================

/**
 * Consultas y mutaciones GraphQL para el módulo de empleados.
 * Estas cadenas se utilizan con el cliente GraphQL (por ejemplo, a través de pandoraApi)
 * para comunicarse con el backend.
 *
 * Todas las consultas devuelven los campos definidos en la interfaz Empleado,
 * excepto deleteEmpleado que devuelve un booleano.
 */

// -------------------------------------------------------------------
// Consulta: GET_EMPLEADOS
// -------------------------------------------------------------------
/**
 * Obtiene TODOS los empleados (sin paginación).
 * Útil para cargas masivas, reportes o selectores donde se necesite la lista completa.
 * 
 * @returns {Array} Lista de empleados con todos los campos.
 */
export const GET_EMPLEADOS = `
  query GetEmpleados {
    empleados {
      id_empleado
      numero_empleado
      nombre
      apellido_p
      apellido_m
      email_personal
      email_institucional
      telefono
      tipo_empleado
      puesto
      departamento
      fecha_contratacion
      activo
    }
  }
`;

// -------------------------------------------------------------------
// Consulta: GET_EMPLEADOS_PAGINATE
// -------------------------------------------------------------------
/**
 * Obtiene una página de empleados con paginación.
 * Se usa en la tabla principal para mostrar registros de forma paginada.
 *
 * @param {Int} page - Número de página (opcional, por defecto 1).
 * @param {Int} limit - Cantidad de registros por página (opcional, por defecto 10).
 * @returns {Array} Lista de empleados correspondiente a la página solicitada.
 */
export const GET_EMPLEADOS_PAGINATE = `
  query GetEmpleadosPaginate($page: Int, $limit: Int) {
    empleadosP(page: $page, limit: $limit) {
      id_empleado
      numero_empleado
      nombre
      apellido_p
      apellido_m
      email_personal
      email_institucional
      telefono
      tipo_empleado
      puesto
      departamento
      fecha_contratacion
      activo
    }
  }
`;

// -------------------------------------------------------------------
// Consulta: GET_EMPLEADO
// -------------------------------------------------------------------
/**
 * Obtiene un empleado específico por su ID.
 * Se usa para cargar datos en formularios de edición o para mostrar detalles.
 *
 * @param {Int!} id - ID del empleado (obligatorio).
 * @returns {Object} Empleado encontrado o null si no existe.
 */
export const GET_EMPLEADO = `
  query GetEmpleado($id: Int!) {
    empleado(id: $id) {
      id_empleado
      numero_empleado
      nombre
      apellido_p
      apellido_m
      email_personal
      email_institucional
      telefono
      tipo_empleado
      puesto
      departamento
      fecha_contratacion
      activo
    }
  }
`;

// -------------------------------------------------------------------
// Mutación: CREATE_EMPLEADO
// -------------------------------------------------------------------
/**
 * Crea un nuevo empleado en la base de datos.
 *
 * @param {CreateEmpleadoInput!} input - Objeto con los datos del nuevo empleado (sin id).
 * @returns {Object} El empleado recién creado, incluyendo su ID generado.
 */
export const CREATE_EMPLEADO = `
  mutation CreateEmpleado($input: CreateEmpleadoInput!) {
    createEmpleado(input: $input) {
      id_empleado
      numero_empleado
      nombre
      apellido_p
      apellido_m
      email_personal
      email_institucional
      telefono
      tipo_empleado
      puesto
      departamento
      fecha_contratacion
      activo
    }
  }
`;

// -------------------------------------------------------------------
// Mutación: UPDATE_EMPLEADO
// -------------------------------------------------------------------
/**
 * Actualiza un empleado existente.
 *
 * @param {Int!} id - ID del empleado a actualizar.
 * @param {UpdateEmpleadoInput!} input - Objeto con los campos a modificar (todos opcionales).
 * @returns {Object} El empleado actualizado.
 */
export const UPDATE_EMPLEADO = `
  mutation UpdateEmpleado($id: Int!, $input: UpdateEmpleadoInput!) {
    updateEmpleado(id: $id, input: $input) {
      id_empleado
      numero_empleado
      nombre
      apellido_p
      apellido_m
      email_personal
      email_institucional
      telefono
      tipo_empleado
      puesto
      departamento
      fecha_contratacion
      activo
    }
  }
`;

// -------------------------------------------------------------------
// Mutación: DELETE_EMPLEADO
// -------------------------------------------------------------------
/**
 * Elimina un empleado por su ID.
 *
 * @param {Int!} id - ID del empleado a eliminar.
 * @returns {Boolean} true si se eliminó correctamente, false en caso contrario.
 */
export const DELETE_EMPLEADO = `
  mutation DeleteEmpleado($id: Int!) {
    deleteEmpleado(id: $id)
  }
`;
