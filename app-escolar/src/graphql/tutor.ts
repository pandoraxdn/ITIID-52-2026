// ============================================
// RUTA: src/graphql/tutor.ts
//
// ============================================

import {graphqlRequest} from '@/api/pandoraApi';
import {
  type Tutor,
  type CreateTutorInput,
  type UpdateTutorInput,
} from '@/interfaces/tutor.interface';

const TUTOR_FIELDS = `
  id_tutor
  nombre
  apellido_p
  apellido_m
  relacion
  telefono_principal
  telefono_emergencia
  email
`;

export const getTutores = (page = 1, limit = 10) =>
  graphqlRequest<{tutoresP: Tutor[]}>(
    `query GetTutores($page: Int, $limit: Int) {
      tutoresP(page: $page, limit: $limit) { ${TUTOR_FIELDS} }
    }`,
    {page: Number(page), limit: Number(limit)}
  ).then((d) => d.tutoresP);

export const createTutor = (input: CreateTutorInput) =>
  graphqlRequest<{createTutor: Tutor}>(
    `mutation CreateTutor($input: CreateTutorInput!) {
      createTutor(input: $input) { ${TUTOR_FIELDS} }
    }`,
    {input}
  ).then((d) => d.createTutor);

// ── CORREGIDO: recibe UpdateTutorInput con id_tutor ya incluido ───────────────
export const updateTutor = (id: number, input: UpdateTutorInput) =>
  graphqlRequest<{updateTutor: Tutor}>(
    `mutation UpdateTutor($id: Int!, $input: UpdateTutorInput!) {
      updateTutor(id: $id, input: $input) { ${TUTOR_FIELDS} }
    }`,
    {id: Number(id), input}
  ).then((d) => d.updateTutor);

export const deleteTutor = (id: number) =>
  graphqlRequest<{removeTutor: boolean}>(
    `mutation DeleteTutor($id: Int!) { removeTutor(id: $id) }`,
    {id: Number(id)}
  ).then((d) => d.removeTutor);
