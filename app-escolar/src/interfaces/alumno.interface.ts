// ============================================
// RUTA: src/interfaces/alumno.interface.ts
// ============================================

export enum Genero {
  MASCULINO = 'MASCULINO',
  FEMENINO = 'FEMENINO',
  OTRO = 'OTRO',
}

export enum TipoSangre {
  A_POSITIVO = 'A+',
  A_NEGATIVO = 'A-',
  B_POSITIVO = 'B+',
  B_NEGATIVO = 'B-',
  AB_POSITIVO = 'AB+',
  AB_NEGATIVO = 'AB-',
  O_POSITIVO = 'O+',
  O_NEGATIVO = 'O-',
}

export interface Alumno {
  id_alumno: number;
  matricula: string;
  nombre: string;
  apellido_p: string;
  apellido_m: string;
  genero: string;
  curp: string;
  email_institucional: string;
  direccion: string;
  tipo_sangre: string;
  alergias: string;
  condiciones_medicas: string;
  fecha_ingreso: string;
  activo: boolean;
}

export type CreateAlumnoInput = Omit<Alumno, 'id_alumno'>;
export type UpdateAlumnoInput = Partial<CreateAlumnoInput> & {id_alumno: number};
