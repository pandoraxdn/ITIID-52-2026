export const GET_PROFESORES = `
  query GetProfesores {
    profesores {
      id_profesor
      empleado_id
      especialidad
      nivel_estudios
      cedula_profesional
    }
  }
`;

export const GET_PROFESORES_PAGINATE = `
  query GetProfesoresPaginate($page: Int, $limit: Int) {
    profesoresP(page: $page, limit: $limit) {
      id_profesor
      empleado_id
      especialidad
      nivel_estudios
      cedula_profesional
    }
  }
`;

export const GET_PROFESOR = `
  query GetProfesor($id: Int!) {
    profesor(id: $id) {
      id_profesor
      empleado_id
      especialidad
      nivel_estudios
      cedula_profesional
    }
  }
`;

export const CREATE_PROFESOR = `
  mutation CreateProfesor($input: CreateProfesorInput!) {
    createProfesor(input: $input) {
      id_profesor
      empleado_id
      especialidad
      nivel_estudios
      cedula_profesional
    }
  }
`;

export const UPDATE_PROFESOR = `
  mutation UpdateProfesor($id: Int!, $input: UpdateProfesorInput!) {
    updateProfesor(id: $id, input: $input) {
      id_profesor
      empleado_id
      especialidad
      nivel_estudios
      cedula_profesional
    }
  }
`;

export const REMOVE_PROFESOR = `
  mutation RemoveProfesor($id: Int!) {
    removeProfesor(id: $id)
  }
`;
