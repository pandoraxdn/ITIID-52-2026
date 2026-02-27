// ============================================
// ARCHIVO: empleado.interface.ts
// ============================================

/**
 * Enumerados, interfaces y tipos para el módulo de empleados.
 * Estos tipos deben coincidir exactamente con los definidos en el backend (NestJS/GraphQL).
 */

// -------------------------------------------------------------------
// Enumerados
// -------------------------------------------------------------------

/**
 * Posibles valores para el campo 'tipo_empleado'.
 * DOCENTE: Profesor o maestro.
 * ADMINISTRATIVO: Personal de administración.
 * OPERATIVO: Personal de apoyo o servicios generales.
 */
export enum TipoEmpleado {
  DOCENTE = 'DOCENTE',
  ADMINISTRATIVO = 'ADMINISTRATIVO',
  OPERATIVO = 'OPERATIVO',
}

/**
 * Posibles valores para el campo 'puesto'.
 * MAESTRO: Docente.
 * DIRECTOR: Director o jefe de departamento.
 * LIMPIEZA: Personal de limpieza.
 * SEGURIDAD: Personal de seguridad.
 */
export enum TipoPuesto {
  MAESTRO = 'MAESTRO',
  DIRECTOR = 'DIRECTOR',
  LIMPIEZA = 'LIMPIEZA',
  SEGURIDAD = 'SEGURIDAD',
}

// -------------------------------------------------------------------
// Interfaz principal: Empleado
// -------------------------------------------------------------------

/**
 * Representa un empleado tal como lo devuelve el backend.
 * Nota: En GraphQL, los IDs pueden ser enviados como strings, pero en TypeScript
 *       se tipan como number para facilitar operaciones numéricas. Asegurar conversión.
 */
export interface Empleado {
  /** Identificador único del empleado (número entero). */
  id_empleado: number;

  /** Número de empleado (clave única, formato libre, ej. EMP-001). */
  numero_empleado: string;

  /** Nombre(s) del empleado. */
  nombre: string;

  /** Apellido paterno. */
  apellido_p: string;

  /** Apellido materno (puede ser vacío si no aplica). */
  apellido_m: string;

  /** Correo electrónico personal (uso externo). */
  email_personal: string;

  /** Correo institucional (dominio de la organización). */
  email_institucional: string;

  /** Número de teléfono (formato libre). */
  telefono: string;

  /** Tipo de empleado, según enumerado TipoEmpleado. */
  tipo_empleado: TipoEmpleado;

  /** Puesto que ocupa, según enumerado TipoPuesto. */
  puesto: TipoPuesto;

  /** Departamento al que pertenece (ej. "Ventas", "Informática"). */
  departamento: string;

  /** Fecha de contratación en formato ISO (YYYY-MM-DD). */
  fecha_contratacion: string;

  /** Indica si el empleado está activo en la empresa. */
  activo: boolean;
}

// -------------------------------------------------------------------
// Tipos para operaciones de creación y actualización
// -------------------------------------------------------------------

/**
 * Tipo para la creación de un nuevo empleado.
 * Omite el campo 'id_empleado' porque el backend lo genera automáticamente.
 */
export type CreateEmpleadoInput = Omit<Empleado, 'id_empleado'>;

/**
 * Tipo para la actualización de un empleado.
 * Todos los campos son opcionales excepto el ID, que es obligatorio para identificar el registro.
 */
export type UpdateEmpleadoInput = Partial<CreateEmpleadoInput> & {
  /** ID del empleado que se desea actualizar. */
  id_empleado: number;
};
