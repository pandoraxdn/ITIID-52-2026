// ============================================
// RUTA: src/interfaces/usuario.interface.ts
// PROPÓSITO: Define la forma del objeto Usuario
//            que devuelve el backend al hacer login.
// ============================================

export interface Usuario {
  id_usuario: number;
  username: string;
  rol_id: number;
  empleado_id?: number | null;
  alumno_id?: number | null;
  tutor_id?: number | null;
  avatar_url: string;   // viene en base64 desde la API
  ultimo_acceso: string;
  activo: boolean;
}
