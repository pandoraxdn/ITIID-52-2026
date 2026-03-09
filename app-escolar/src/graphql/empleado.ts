import {graphqlRequest} from '@/api/pandoraApi';
import {
  type Empleado,
  type CreateEmpleadoInput,
} from '@/interfaces/empleado.interface';

const EMPLEADO_FIELDS = `
  id_empleado
  numero_empleado
  nombre
  apellido_p
  apellido_m
  email_personal
  email_institucional
  telefono
  tipo_empleado
  puesto
  departamento
  fecha_contratacion
  activo
`;

export const getEmpleados = (page = 1, limit = 10) =>
  graphqlRequest<{empleadosP: Empleado[]}>(
    `query GetEmpleados($page: Int, $limit: Int) {
      empleadosP(page: $page, limit: $limit) { ${EMPLEADO_FIELDS} }
    }`,
    {page: Number(page), limit: Number(limit)}
  ).then((data) => data.empleadosP);

export const getEmpleado = (id: number) =>
  graphqlRequest<{empleado: Empleado}>(
    `query GetEmpleado($id: Int!) {
      empleado(id: $id) { ${EMPLEADO_FIELDS} }
    }`,
    {id: Number(id)}
  ).then((data) => data.empleado);

export const createEmpleado = (input: CreateEmpleadoInput) =>
  graphqlRequest<{createEmpleado: Empleado}>(
    `mutation CreateEmpleado($input: CreateEmpleadoInput!) {
      createEmpleado(input: $input) { ${EMPLEADO_FIELDS} }
    }`,
    {input}
  ).then((data) => data.createEmpleado);

export const updateEmpleado = (id: number, input: Partial<CreateEmpleadoInput>) =>
  graphqlRequest<{updateEmpleado: Empleado}>(
    `mutation UpdateEmpleado($id: Int!, $input: UpdateEmpleadoInput!) {
      updateEmpleado(id: $id, input: $input) { ${EMPLEADO_FIELDS} }
    }`,
    // Number() garantiza que el id llegue como entero y no como string
    {id: Number(id), input: {...input, id_empleado: Number(id)}}
  ).then((data) => data.updateEmpleado);

export const deleteEmpleado = (id: number) =>
  graphqlRequest<{removeEmpleado: boolean}>(
    `mutation DeleteEmpleado($id: Int!) {
      removeEmpleado(id: $id)
    }`,
    {id: Number(id)}
  ).then((data) => data.removeEmpleado);
