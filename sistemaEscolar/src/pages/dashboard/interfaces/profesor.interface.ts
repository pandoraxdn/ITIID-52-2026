export const TipoNivelEstudio = {
  LICENCIATURA: 'LICENCIATURA',
  MAESTRIA: 'MAESTRIA',
  DOCTORADO: 'DOCTORADO',
} as const
export type TipoNivelEstudio = typeof TipoNivelEstudio[keyof typeof TipoNivelEstudio]

export interface Profesor {
  id_profesor: number;
  empleado_id: number;
  especialidad: string;
  nivel_estudios: TipoNivelEstudio;
  cedula_profesional: string;
  empleado?: {
    id_empleado: number;
    nombre: string;
    apellido_p: string;
    apellido_m: string;
    numero_empleado: string;
  };
}

export type CreateProfesorInput = Omit<Profesor, 'id_profesor' | 'empleado'>;
export type UpdateProfesorInput = Partial<CreateProfesorInput> & {id_profesor: number};
