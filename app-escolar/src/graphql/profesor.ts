// ============================================
// RUTA: src/graphql/profesor.ts
//
// BUGS CORREGIDOS:
//  1. updateProfesor: parámetro input cambiado a UpdateProfesorInput.
//  2. Se elimina el spread redundante que inyectaba id_profesor por segunda vez.
// ============================================

import {graphqlRequest} from '@/api/pandoraApi';
import {
  type Profesor,
  type CreateProfesorInput,
  type UpdateProfesorInput,
} from '@/interfaces/profesor.interface';

const PROFESOR_FIELDS = `
  id_profesor
  empleado_id
  especialidad
  nivel_estudios
  cedula_profesional
`;

export const getProfesores = (page = 1, limit = 10) =>
  graphqlRequest<{profesoresP: Profesor[]}>(
    `query GetProfesores($page: Int, $limit: Int) {
      profesoresP(page: $page, limit: $limit) { ${PROFESOR_FIELDS} }
    }`,
    {page: Number(page), limit: Number(limit)}
  ).then((data) => data.profesoresP);

export const createProfesor = (input: CreateProfesorInput) =>
  graphqlRequest<{createProfesor: Profesor}>(
    `mutation CreateProfesor($input: CreateProfesorInput!) {
      createProfesor(input: $input) { ${PROFESOR_FIELDS} }
    }`,
    {input}
  ).then((data) => data.createProfesor);

// ── CORREGIDO: recibe UpdateProfesorInput con id_profesor ya incluido ─────────
export const updateProfesor = (id: number, input: UpdateProfesorInput) =>
  graphqlRequest<{updateProfesor: Profesor}>(
    `mutation UpdateProfesor($id: Int!, $input: UpdateProfesorInput!) {
      updateProfesor(id: $id, input: $input) { ${PROFESOR_FIELDS} }
    }`,
    {id: Number(id), input}
  ).then((data) => data.updateProfesor);

export const deleteProfesor = (id: number) =>
  graphqlRequest<{removeProfesor: boolean}>(
    `mutation DeleteProfesor($id: Int!) {
      removeProfesor(id: $id)
    }`,
    {id: Number(id)}
  ).then((data) => data.removeProfesor);
