// ============================================
// RUTA: src/graphql/usuario.ts
// PROPÓSITO: Query de login. Mismo patrón que empleado.ts.
//            Mandamos id_usuario: 0 porque el DTO lo requiere
//            pero el servicio de login no lo usa.
// ============================================

import {graphqlRequest} from '@/api/pandoraApi';
import {Usuario} from '@/interfaces/usuario.interface';

export const loginUsuario = (username: string, password: string) =>
  graphqlRequest<{login: Usuario | null}>(
    `query Login($input: UpdateUsuarioInput!) {
      login(input: $input) {
        id_usuario
        username
        rol_id
        empleado_id
        alumno_id
        tutor_id
        avatar_url
        ultimo_acceso
        activo
      }
    }`,
    {
      input: {
        id_usuario: 0, // requerido por el DTO pero no se usa en el login
        username,
        password_hash: password,
      },
    }
  ).then((data) => data.login);
