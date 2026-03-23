// ============================================
// RUTA: src/graphql/alumno.ts  — CORREGIDO
//
// BUGS CORREGIDOS:
//  1. updateAlumno: el parámetro input ahora es UpdateAlumnoInput (incluye id_alumno obligatorio).
//     El web construye: {...form, id_alumno: alumnoId} y lo manda como UpdateAlumnoInput.
//     La función graphql YA NO inyecta id_alumno extra —el id llega dentro del input.
//  2. Se quitó el spread redundante {id, input: {...input, id_alumno: id}} que causaba
//     conflicto cuando id_alumno ya venía en input con valor distinto.
// ============================================

import {graphqlRequest} from '@/api/pandoraApi';
import {type Alumno, type CreateAlumnoInput, type UpdateAlumnoInput} from '@/interfaces/alumno.interface';

const ALUMNO_FIELDS = `
  id_alumno
  matricula
  nombre
  apellido_p
  apellido_m
  genero
  curp
  email_institucional
  direccion
  tipo_sangre
  alergias
  condiciones_medicas
  fecha_ingreso
  activo
`;

export const getAlumnos = (page = 1, limit = 10) =>
  graphqlRequest<{alumnosP: Alumno[]}>(
    `query GetAlumnos($page: Int, $limit: Int) {
      alumnosP(page: $page, limit: $limit) { ${ALUMNO_FIELDS} }
    }`,
    {page: Number(page), limit: Number(limit)}
  ).then((d) => d.alumnosP);

export const createAlumno = (input: CreateAlumnoInput) =>
  graphqlRequest<{createAlumno: Alumno}>(
    `mutation CreateAlumno($input: CreateAlumnoInput!) {
      createAlumno(input: $input) { ${ALUMNO_FIELDS} }
    }`,
    {input}
  ).then((d) => d.createAlumno);

export const updateAlumno = (id: number, input: UpdateAlumnoInput) =>
  graphqlRequest<{updateAlumno: Alumno}>(
    `mutation UpdateAlumno($id: Int!, $input: UpdateAlumnoInput!) {
      updateAlumno(id: $id, input: $input) { ${ALUMNO_FIELDS} }
    }`,
    {id: Number(id), input}
  ).then((d) => d.updateAlumno);

export const deleteAlumno = (id: number) =>
  graphqlRequest<{removeAlumno: boolean}>(
    `mutation DeleteAlumno($id: Int!) { removeAlumno(id: $id) }`,
    {id: Number(id)}
  ).then((d) => d.removeAlumno);
