// ============================================
// RUTA: src/graphql/rol.ts
//
// ============================================

import {graphqlRequest} from '@/api/pandoraApi';
import {type Rol, type CreateRolInput, type UpdateRolInput} from '@/interfaces/rol.interface';

const ROL_FIELDS = `id_rol nombre descripcion`;

export const getRoles = (page = 1, limit = 10) =>
  graphqlRequest<{rolesP: Rol[]}>(
    `query GetRoles($page: Int, $limit: Int) {
      rolesP(page: $page, limit: $limit) { ${ROL_FIELDS} }
    }`,
    {page: Number(page), limit: Number(limit)}
  ).then((d) => d.rolesP);

export const getAllRoles = () =>
  graphqlRequest<{roles: Rol[]}>(
    `query { roles { ${ROL_FIELDS} } }`
  ).then((d) => d.roles);

export const createRol = (input: CreateRolInput) =>
  graphqlRequest<{createRol: Rol}>(
    `mutation CreateRol($input: CreateRolInput!) {
      createRol(input: $input) { ${ROL_FIELDS} }
    }`,
    {input}
  ).then((d) => d.createRol);

// ── CORREGIDO: recibe UpdateRolInput con id_rol ya incluido ───────────────────
export const updateRol = (id: number, input: UpdateRolInput) =>
  graphqlRequest<{updateRol: Rol}>(
    `mutation UpdateRol($id: Int!, $input: UpdateRolInput!) {
      updateRol(id: $id, input: $input) { ${ROL_FIELDS} }
    }`,
    {id: Number(id), input}
  ).then((d) => d.updateRol);

export const deleteRol = (id: number) =>
  graphqlRequest<{removeRol: boolean}>(
    `mutation DeleteRol($id: Int!) { removeRol(id: $id) }`,
    {id: Number(id)}
  ).then((d) => d.removeRol);
