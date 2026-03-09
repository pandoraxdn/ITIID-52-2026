// ============================================
// ARCHIVO: useAlumnoApi.ts
// Módulo: Alumnos
// Descripción: Hook personalizado que encapsula todas las operaciones GraphQL para alumnos.
// ============================================

import {pandoraApi} from '@/api/pandoraApi';
import {useState, useCallback} from 'react';
import {
  Alumno,
  CreateAlumnoInput,
  UpdateAlumnoInput,
} from '../interfaces/alumno.interface';
import {
  GET_ALUMNOS,
  GET_ALUMNOS_PAGINATE,
  GET_ALUMNO,
  CREATE_ALUMNO,
  UPDATE_ALUMNO,
  REMOVE_ALUMNO
} from '../graphql/alumnos';

/**
 * Función auxiliar para ejecutar consultas GraphQL.
 */
async function executeQuery<T>(query: string, variables?: any): Promise<T> {
  try {
    const response = await pandoraApi.post('', {query, variables});
    if (response.data.errors) {
      console.error('GraphQL Errors:', response.data.errors);
      throw new Error(response.data.errors[0].message);
    }
    return response.data.data;
  } catch (error) {
    console.error('ExecuteQuery error:', error);
    throw error;
  }
}

export const useAlumnoApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAlumnos = useCallback(async (): Promise<Alumno[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{alumnos: Alumno[]}>(GET_ALUMNOS);
      return data.alumnos;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAlumnosPaginate = useCallback(
    async (page: number = 1, limit: number = 10): Promise<Alumno[]> => {
      setLoading(true);
      setError(null);
      try {
        const data = await executeQuery<{alumnosP: Alumno[]}>(
          GET_ALUMNOS_PAGINATE,
          {page, limit}
        );
        return data.alumnosP;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getAlumno = useCallback(async (id: number): Promise<Alumno | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{alumno: Alumno}>(GET_ALUMNO, {id});
      return data.alumno;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createAlumno = useCallback(
    async (input: CreateAlumnoInput): Promise<Alumno> => {
      setLoading(true);
      setError(null);
      try {
        const data = await executeQuery<{createAlumno: Alumno}>(CREATE_ALUMNO, {
          input,
        });
        return data.createAlumno;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateAlumno = useCallback(
    async (id: number, input: UpdateAlumnoInput): Promise<Alumno> => {
      setLoading(true);
      setError(null);
      try {
        const data = await executeQuery<{updateAlumno: Alumno}>(UPDATE_ALUMNO, {
          id,
          input,
        });
        return data.updateAlumno;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeAlumno = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{removeAlumno: boolean}>(REMOVE_ALUMNO, {id});
      return data.removeAlumno;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getAlumnos,
    getAlumnosPaginate,
    getAlumno,
    createAlumno,
    updateAlumno,
    removeAlumno,
  };
};
