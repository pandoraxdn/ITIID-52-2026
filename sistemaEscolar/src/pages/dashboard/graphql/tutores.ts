// ============================================
// ARCHIVO: tutores.ts
// Módulo: Tutores
// Descripción: Consultas y mutaciones GraphQL para la gestión de tutores.
// Basado en el resolver de NestJS (TutorResolver).
// ============================================

/**
 * Obtiene todos los tutores (sin paginación).
 */
export const GET_TUTORES = `
  query GetTutores {
    tutores {
      id_tutor
      nombre
      apellido_p
      apellido_m
      relacion
      telefono_principal
      telefono_emergencia
      email
    }
  }
`;

/**
 * Obtiene una página de tutores con paginación.
 * @param {Int} page - Número de página (opcional, por defecto 1).
 * @param {Int} limit - Cantidad por página (opcional, por defecto 10).
 */
export const GET_TUTORES_PAGINATE = `
  query GetTutoresPaginate($page: Int, $limit: Int) {
    tutoresP(page: $page, limit: $limit) {
      id_tutor
      nombre
      apellido_p
      apellido_m
      relacion
      telefono_principal
      telefono_emergencia
      email
    }
  }
`;

/**
 * Obtiene un tutor por su ID.
 * @param {Int!} id - ID del tutor.
 */
export const GET_TUTOR = `
  query GetTutor($id: Int!) {
    tutor(id: $id) {
      id_tutor
      nombre
      apellido_p
      apellido_m
      relacion
      telefono_principal
      telefono_emergencia
      email
    }
  }
`;

/**
 * Crea un nuevo tutor.
 * @param {CreateTutorInput!} input - Datos del tutor a crear.
 */
export const CREATE_TUTOR = `
  mutation CreateTutor($input: CreateTutorInput!) {
    createTutor(input: $input) {
      id_tutor
      nombre
      apellido_p
      apellido_m
      relacion
      telefono_principal
      telefono_emergencia
      email
    }
  }
`;

/**
 * Actualiza un tutor existente.
 * @param {Int!} id - ID del tutor.
 * @param {UpdateTutorInput!} input - Campos a actualizar (todos opcionales).
 */
export const UPDATE_TUTOR = `
  mutation UpdateTutor($id: Int!, $input: UpdateTutorInput!) {
    updateTutor(id: $id, input: $input) {
      id_tutor
      nombre
      apellido_p
      apellido_m
      relacion
      telefono_principal
      telefono_emergencia
      email
    }
  }
`;

/**
 * Elimina un tutor por su ID.
 * @param {Int!} id - ID del tutor.
 * @returns {Boolean} true si se eliminó correctamente.
 */
export const REMOVE_TUTOR = `
  mutation RemoveTutor($id: Int!) {
    removeTutor(id: $id)
  }
`;
