import {pandoraApi} from '@/api/pandoraApi';
import {useState, useCallback} from 'react';
import {
  Profesor,
  CreateProfesorInput,
  UpdateProfesorInput,
} from '../interfaces/profesor.interface';
import {
  GET_PROFESORES,
  GET_PROFESORES_PAGINATE,
  GET_PROFESOR,
  CREATE_PROFESOR,
  UPDATE_PROFESOR,
  REMOVE_PROFESOR
} from '../graphql/profesores';

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

export const useProfesorApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfesores = useCallback(async (): Promise<Profesor[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{profesores: Profesor[]}>(GET_PROFESORES);
      return data.profesores;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProfesoresPaginate = useCallback(
    async (page: number = 1, limit: number = 10): Promise<Profesor[]> => {
      setLoading(true);
      setError(null);
      try {
        const data = await executeQuery<{profesoresP: Profesor[]}>(
          GET_PROFESORES_PAGINATE,
          {page, limit}
        );
        return data.profesoresP;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getProfesor = useCallback(async (id: number): Promise<Profesor | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{profesor: Profesor}>(GET_PROFESOR, {id});
      return data.profesor;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProfesor = useCallback(
    async (input: CreateProfesorInput): Promise<Profesor> => {
      setLoading(true);
      setError(null);
      try {
        const data = await executeQuery<{createProfesor: Profesor}>(CREATE_PROFESOR, {
          input,
        });
        return data.createProfesor;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateProfesor = useCallback(
    async (id: number, input: UpdateProfesorInput): Promise<Profesor> => {
      setLoading(true);
      setError(null);
      try {
        const data = await executeQuery<{updateProfesor: Profesor}>(UPDATE_PROFESOR, {
          id,
          input,
        });
        return data.updateProfesor;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeProfesor = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{removeProfesor: boolean}>(REMOVE_PROFESOR, {id});
      return data.removeProfesor;
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
    getProfesores,
    getProfesoresPaginate,
    getProfesor,
    createProfesor,
    updateProfesor,
    removeProfesor,
  };
};
