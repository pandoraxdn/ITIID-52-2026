// ============================================
// ARCHIVO: roles.ts
// Módulo: Roles
// Descripción: Consultas y mutaciones GraphQL para la gestión de roles.
// Basado en el resolver de NestJS (RolResolver).
// ============================================

/**
 * Obtiene todos los roles (sin paginación).
 */
export const GET_ROLES = `
  query GetRoles {
    roles {
      id_rol
      nombre
      descripcion
    }
  }
`;

/**
 * Obtiene una página de roles con paginación.
 * @param {Int} page - Número de página (opcional, por defecto 1).
 * @param {Int} limit - Cantidad por página (opcional, por defecto 10).
 */
export const GET_ROLES_PAGINATE = `
  query GetRolesPaginate($page: Int, $limit: Int) {
    rolesP(page: $page, limit: $limit) {
      id_rol
      nombre
      descripcion
    }
  }
`;

/**
 * Obtiene un rol por su ID.
 * @param {Int!} id - ID del rol.
 */
export const GET_ROL = `
  query GetRol($id: Int!) {
    rol(id: $id) {
      id_rol
      nombre
      descripcion
    }
  }
`;

/**
 * Crea un nuevo rol.
 * @param {CreateRolInput!} input - Datos del rol a crear.
 */
export const CREATE_ROL = `
  mutation CreateRol($input: CreateRolInput!) {
    createRol(input: $input) {
      id_rol
      nombre
      descripcion
    }
  }
`;

/**
 * Actualiza un rol existente.
 * @param {Int!} id - ID del rol.
 * @param {UpdateRolInput!} input - Campos a actualizar (todos opcionales).
 */
export const UPDATE_ROL = `
  mutation UpdateRol($id: Int!, $input: UpdateRolInput!) {
    updateRol(id: $id, input: $input) {
      id_rol
      nombre
      descripcion
    }
  }
`;

/**
 * Elimina un rol por su ID.
 * @param {Int!} id - ID del rol.
 * @returns {Boolean} true si se eliminó correctamente.
 */
export const REMOVE_ROL = `
  mutation RemoveRol($id: Int!) {
    removeRol(id: $id)
  }
`;
