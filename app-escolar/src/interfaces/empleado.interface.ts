export enum TipoEmpleado {
  DOCENTE = 'DOCENTE',
  ADMINISTRATIVO = 'ADMINISTRATIVO',
  OPERATIVO = 'OPERATIVO',
}

export enum TipoPuesto {
  MAESTRO = 'MAESTRO',
  DIRECTOR = 'DIRECTOR',
  LIMPIEZA = 'LIMPIEZA',
  SEGURIDAD = 'SEGURIDAD',
}

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
  fecha_contratacion: string;
  activo: boolean;
}

export type CreateEmpleadoInput = Omit<Empleado, 'id_empleado'>;
export type UpdateEmpleadoInput = Partial<CreateEmpleadoInput> & {id_empleado: number};
