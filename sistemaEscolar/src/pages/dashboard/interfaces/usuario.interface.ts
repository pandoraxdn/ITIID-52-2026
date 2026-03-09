// ============================================
// ARCHIVO: usuario.interface.ts
// Módulo: Usuarios
// Descripción: Interfaces y tipos para el módulo de usuarios.
// Basado en la entidad Usuario y los DTOs del backend.
// ============================================

// Importar interfaces relacionadas (asumiendo que existen)
import {Rol} from './rol.interface';
import {Empleado} from './empleado.interface';
import {Alumno} from './alumno.interface';
import {Tutor} from './tutor.interface'; // Ajustar según ubicación real

/**
 * Interfaz principal de un usuario.
 * Coincide con la entidad del backend e incluye relaciones opcionales.
 */
export interface Usuario {
  id_usuario: number;
  username: string;
  password_hash: string; // Solo se usa en el backend; en frontend no se muestra
  rol_id: number;
  empleado_id?: number | null;
  alumno_id?: number | null;
  tutor_id?: number | null;
  avatar_url: string; // Puede ser una URL o un base64
  ultimo_acceso: string; // Formato ISO (YYYY-MM-DD)
  activo: boolean;
  // Relaciones (cargadas opcionalmente)
  rol?: Rol;
  empleado?: Empleado;
  alumno?: Alumno;
  tutor?: Tutor;
}

/**
 * Tipo para crear un nuevo usuario (omite id_usuario).
 * password_hash es obligatorio en creación.
 */
export type CreateUsuarioInput = Omit<Usuario, 'id_usuario' | 'rol' | 'empleado' | 'alumno' | 'tutor'>;

/**
 * Tipo para actualizar un usuario. Todos los campos son opcionales excepto el id.
 * Nota: password_hash es opcional; si se omite, no se actualiza la contraseña.
 */
export type UpdateUsuarioInput = Partial<Omit<CreateUsuarioInput, 'password_hash'>> & {
  id_usuario: number;
  password_hash?: string; // Opcional en actualización
};
