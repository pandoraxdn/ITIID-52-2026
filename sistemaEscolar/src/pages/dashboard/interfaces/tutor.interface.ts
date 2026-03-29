// ============================================
// ARCHIVO: tutor.interface.ts
// Módulo: Tutores
// Descripción: Enumerados, interfaces y tipos para el módulo de tutores.
// Basado en la entidad Tutor y los DTOs del backend.
// ============================================

/**
 * Enumerado para el tipo de relación del tutor con el alumno.
 * Coincide con el definido en el backend.
 */
export const TipoRelacion = {
  PADRE: 'PADRE',
  MADRE: 'MADRE',
  TIO: 'TIO',
  ABUELO: 'ABUELO',
} as const
export type TipoRelacion = typeof TipoRelacion[keyof typeof TipoRelacion]

/**
 * Interfaz principal de un tutor.
 * Coincide con la entidad del backend.
 */
export interface Tutor {
  id_tutor: number;
  nombre: string;
  apellido_p: string;
  apellido_m: string;
  relacion: TipoRelacion;
  telefono_principal: string;
  telefono_emergencia: string;
  email: string;
}

/**
 * Tipo para crear un nuevo tutor (omite id_tutor).
 */
export type CreateTutorInput = Omit<Tutor, 'id_tutor'>;

/**
 * Tipo para actualizar un tutor. Todos los campos son opcionales excepto el id.
 */
export type UpdateTutorInput = Partial<CreateTutorInput> & {
  id_tutor: number;
};
