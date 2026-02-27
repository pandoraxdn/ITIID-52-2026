// Queries
export const GET_EMPLEADOS = `
  query GetEmpleados {
    empleados {
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
    }
  }
`;

export const GET_EMPLEADOS_PAGINATE = `
  query GetEmpleadosPaginate($page: Int, $limit: Int) {
    empleadosP(page: $page, limit: $limit) {
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
    }
  }
`;

export const GET_EMPLEADO = `
  query GetEmpleado($id: Int!) {
    empleado(id: $id) {
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
    }
  }
`;

// Mutations
export const CREATE_EMPLEADO = `
  mutation CreateEmpleado($input: CreateEmpleadoInput!) {
    createEmpleado(input: $input) {
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
    }
  }
`;

export const UPDATE_EMPLEADO = `
  mutation UpdateEmpleado($id: Int!, $input: UpdateEmpleadoInput!) {
    updateEmpleado(id: $id, input: $input) {
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
    }
  }
`;

export const REMOVE_EMPLEADO = `
  mutation RemoveEmpleado($id: Int!) {
    removeEmpleado(id: $id)
  }
`;
