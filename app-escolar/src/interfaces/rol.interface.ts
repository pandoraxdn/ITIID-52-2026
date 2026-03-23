// ============================================
// RUTA: src/interfaces/rol.interface.ts
// ============================================

export interface Rol {
  id_rol: number;
  nombre: string;
  descripcion: string;
}

export type CreateRolInput = Omit<Rol, 'id_rol'>;
export type UpdateRolInput = Partial<CreateRolInput> & {id_rol: number};
