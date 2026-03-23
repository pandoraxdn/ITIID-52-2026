// ============================================
// RUTA: src/graphql/usuario-crud.ts
//
// ============================================

import {graphqlRequest} from '@/api/pandoraApi';
import {
  type Usuario,
  type CreateUsuarioInput,
  type UpdateUsuarioInput,
} from '@/interfaces/usuario.interface';

const USUARIO_FIELDS = `
  id_usuario
  username
  rol_id
  empleado_id
  alumno_id
  tutor_id
  avatar_url
  ultimo_acceso
  activo
`;

export const getUsuarios = (page = 1, limit = 10) =>
  graphqlRequest<{usuariosP: Usuario[]}>(
    `query GetUsuarios($page: Int, $limit: Int) {
      usuariosP(page: $page, limit: $limit) { ${USUARIO_FIELDS} }
    }`,
    {page: Number(page), limit: Number(limit)}
  ).then((d) => d.usuariosP);

export const createUsuario = (input: CreateUsuarioInput) =>
  graphqlRequest<{createUsuario: Usuario}>(
    `mutation CreateUsuario($input: CreateUsuarioInput!) {
      createUsuario(input: $input) { ${USUARIO_FIELDS} }
    }`,
    {input}
  ).then((d) => d.createUsuario);

// ── CORREGIDO: recibe UpdateUsuarioInput con id_usuario ya incluido ───────────
export const updateUsuario = (id: number, input: UpdateUsuarioInput) =>
  graphqlRequest<{updateUsuario: Usuario}>(
    `mutation UpdateUsuario($id: Int!, $input: UpdateUsuarioInput!) {
      updateUsuario(id: $id, input: $input) { ${USUARIO_FIELDS} }
    }`,
    {id: Number(id), input}
  ).then((d) => d.updateUsuario);

export const deleteUsuario = (id: number) =>
  graphqlRequest<{removeUsuario: boolean}>(
    `mutation DeleteUsuario($id: Int!) { removeUsuario(id: $id) }`,
    {id: Number(id)}
  ).then((d) => d.removeUsuario);
