// ============================================
// ARCHIVO: usuarios.ts
// Módulo: Usuarios
// Descripción: Consultas y mutaciones GraphQL para la gestión de usuarios.
// Basado en el resolver de NestJS (UsuarioResolver).
// ============================================

/**
 * Obtiene todos los usuarios (sin paginación).
 */
export const GET_USUARIOS = `
  query GetUsuarios {
    usuarios {
      id_usuario
      username
      password_hash
      rol_id
      empleado_id
      alumno_id
      tutor_id
      avatar_url
      ultimo_acceso
      activo
    }
  }
`;

/**
 * Obtiene una página de usuarios con paginación.
 * @param {Int} page - Número de página (opcional, por defecto 1).
 * @param {Int} limit - Cantidad por página (opcional, por defecto 10).
 */
export const GET_USUARIOS_PAGINATE = `
  query GetUsuariosPaginate($page: Int, $limit: Int) {
    usuariosP(page: $page, limit: $limit) {
      id_usuario
      username
      password_hash
      rol_id
      empleado_id
      alumno_id
      tutor_id
      avatar_url
      ultimo_acceso
      activo
    }
  }
`;

/**
 * Obtiene un usuario por su ID.
 * @param {Int!} id - ID del usuario.
 */
export const GET_USUARIO = `
  query GetUsuario($id: Int!) {
    usuario(id: $id) {
      id_usuario
      username
      password_hash
      rol_id
      empleado_id
      alumno_id
      tutor_id
      avatar_url
      ultimo_acceso
      activo
    }
  }
`;

/**
 * Crea un nuevo usuario.
 * @param {CreateUsuarioInput!} input - Datos del usuario a crear.
 */
export const CREATE_USUARIO = `
  mutation CreateUsuario($input: CreateUsuarioInput!) {
    createUsuario(input: $input) {
      id_usuario
      username
      password_hash
      rol_id
      empleado_id
      alumno_id
      tutor_id
      avatar_url
      ultimo_acceso
      activo
    }
  }
`;

/**
 * Actualiza un usuario existente.
 * @param {Int!} id - ID del usuario.
 * @param {UpdateUsuarioInput!} input - Campos a actualizar (todos opcionales).
 */
export const UPDATE_USUARIO = `
  mutation UpdateUsuario($id: Int!, $input: UpdateUsuarioInput!) {
    updateUsuario(id: $id, input: $input) {
      id_usuario
      username
      password_hash
      rol_id
      empleado_id
      alumno_id
      tutor_id
      avatar_url
      ultimo_acceso
      activo
    }
  }
`;

/**
 * Elimina un usuario por su ID.
 * @param {Int!} id - ID del usuario.
 * @returns {Boolean} true si se eliminó correctamente.
 */
export const REMOVE_USUARIO = `
  mutation RemoveUsuario($id: Int!) {
    removeUsuario(id: $id)
  }
`;
