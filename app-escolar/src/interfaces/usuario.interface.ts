// ============================================
// RUTA: src/interfaces/usuario.interface.ts (actualizado)
// ============================================

export interface Usuario {
  id_usuario: number;
  username: string;
  password_hash?: string;
  rol_id: number;
  empleado_id?: number | null;
  alumno_id?: number | null;
  tutor_id?: number | null;
  avatar_url: string;
  ultimo_acceso: string;
  activo: boolean;
}

export type CreateUsuarioInput = Omit<Usuario, 'id_usuario'>;
export type UpdateUsuarioInput = Partial<Omit<CreateUsuarioInput, 'password_hash'>> & {
  id_usuario: number;
  password_hash?: string;
};
