// ============================================
// RUTA: src/interfaces/tutor.interface.ts
// ============================================

export enum TipoRelacion {
  PADRE = 'PADRE',
  MADRE = 'MADRE',
  TIO = 'TIO',
  ABUELO = 'ABUELO',
}

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

export type CreateTutorInput = Omit<Tutor, 'id_tutor'>;
export type UpdateTutorInput = Partial<CreateTutorInput> & {id_tutor: number};
