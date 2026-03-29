export const TipoEmpleado = {
  DOCENTE: 'DOCENTE',
  ADMINISTRATIVO: 'ADMINISTRATIVO',
  OPERATIVO: 'OPERATIVO',
} as const
export type TipoEmpleado = typeof TipoEmpleado[keyof typeof TipoEmpleado]

export const TipoPuesto = {
  MAESTRO: 'MAESTRO',
  DIRECTOR: 'DIRECTOR',
  LIMPIEZA: 'LIMPIEZA',
  SEGURIDAD: 'SEGURIDAD',
} as const
export type TipoPuesto = typeof TipoPuesto[keyof typeof TipoPuesto]

export interface Empleado {
  id_empleado: number;
  numero_empleado: string;
  nombre: string;
  apellido_p: string;
  apellido_m: string;
  email_personal: string;
  email_institucional: string;
  telefono: string;
  tipo_empleado: TipoEmpleado;
  puesto: TipoPuesto;
  departamento: string;
  fecha_contratacion: string; // ISO string (YYYY-MM-DD)
  activo: boolean;
}

export type CreateEmpleadoInput = Omit<Empleado, 'id_empleado'>;
export type UpdateEmpleadoInput = Partial<CreateEmpleadoInput> & {id_empleado: number};
