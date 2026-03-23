// ============================================
// RUTA: src/interfaces/profesor.interface.ts
// ============================================

export enum TipoNivelEstudio {
  LICENCIATURA = 'LICENCIATURA',
  MAESTRIA = 'MAESTRIA',
  DOCTORADO = 'DOCTORADO',
}

export interface Profesor {
  id_profesor: number;
  empleado_id: number;
  especialidad: string;
  nivel_estudios: TipoNivelEstudio;
  cedula_profesional: string;
}

export type CreateProfesorInput = Omit<Profesor, 'id_profesor'>;
export type UpdateProfesorInput = Partial<CreateProfesorInput> & {id_profesor: number};
