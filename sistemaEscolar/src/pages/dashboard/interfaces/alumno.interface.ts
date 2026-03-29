// ============================================
// ARCHIVO: alumno.interface.ts
// Módulo: Alumnos
// Descripción: Enumerados, interfaces y tipos para el módulo de alumnos.
// Basado en la entidad Alumno y los DTOs del backend.
// ============================================

/**
 * Enumerado para el género (puede ampliarse según necesidades).
 */
export const Genero = {
  MASCULINO: 'MASCULINO',
  FEMENINO: 'FEMENINO',
  OTRO: 'OTRO',
} as const
export type Genero = typeof Genero[keyof typeof Genero]

/**
 * Enumerado para tipo de sangre (valores comunes).
 */
export const TipoSangre = {
  A_POSITIVO: 'A+',
  A_NEGATIVO: 'A-',
  B_POSITIVO: 'B+',
  B_NEGATIVO: 'B-',
  AB_POSITIVO: 'AB+',
  AB_NEGATIVO: 'AB-',
  O_POSITIVO: 'O+',
  O_NEGATIVO: 'O-',
} as const
export type TipoSangre = typeof TipoSangre[keyof typeof TipoSangre]

/**
 * Interfaz principal de un alumno.
 * Coincide con la entidad del backend.
 */
export interface Alumno {
  id_alumno: number;
  matricula: string;
  nombre: string;
  apellido_p: string;
  apellido_m: string;
  genero: string; // Podría usarse el enum si se tipa
  curp: string;
  email_institucional: string;
  direccion: string;
  tipo_sangre: string; // Podría usarse el enum
  alergias: string;
  condiciones_medicas: string;
  fecha_ingreso: string; // Formato ISO (YYYY-MM-DD)
  activo: boolean;
}

/**
 * Tipo para crear un nuevo alumno (omite id_alumno).
 */
export type CreateAlumnoInput = Omit<Alumno, 'id_alumno'>;

/**
 * Tipo para actualizar un alumno. Todos los campos son opcionales excepto el id.
 */
export type UpdateAlumnoInput = Partial<CreateAlumnoInput> & {
  id_alumno: number;
};
