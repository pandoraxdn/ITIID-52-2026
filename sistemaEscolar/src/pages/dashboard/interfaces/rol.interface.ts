// ============================================
// ARCHIVO: rol.interface.ts
// Módulo: Roles
// Descripción: Interfaces y tipos para el módulo de roles.
// Basado en la entidad Rol y los DTOs del backend.
// ============================================

/**
 * Interfaz principal de un rol.
 * Coincide con la entidad del backend.
 */
export interface Rol {
  id_rol: number;
  nombre: string;
  descripcion: string;
}

/**
 * Tipo para crear un nuevo rol (omite id_rol).
 */
export type CreateRolInput = Omit<Rol, 'id_rol'>;

/**
 * Tipo para actualizar un rol. Todos los campos son opcionales excepto el id.
 */
export type UpdateRolInput = Partial<CreateRolInput> & {
  id_rol: number;
};
