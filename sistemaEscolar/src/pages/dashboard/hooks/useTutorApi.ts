// ============================================
// ARCHIVO: useTutorApi.ts
// Módulo: Tutores
// Descripción: Hook personalizado que encapsula todas las operaciones GraphQL para tutores.
// ============================================

import {pandoraApi} from '@/api/pandoraApi';
import {useState, useCallback} from 'react';
import type { Tutor, CreateTutorInput, UpdateTutorInput } from '../interfaces/tutor.interface';
import {
  GET_TUTORES,
  GET_TUTORES_PAGINATE,
  GET_TUTOR,
  CREATE_TUTOR,
  UPDATE_TUTOR,
  REMOVE_TUTOR
} from '../graphql/tutores';

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

export const useTutorApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTutores = useCallback(async (): Promise<Tutor[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{tutores: Tutor[]}>(GET_TUTORES);
      return data.tutores;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTutoresPaginate = useCallback(
    async (page: number = 1, limit: number = 10): Promise<Tutor[]> => {
      setLoading(true);
      setError(null);
      try {
        const data = await executeQuery<{tutoresP: Tutor[]}>(
          GET_TUTORES_PAGINATE,
          {page, limit}
        );
        return data.tutoresP;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getTutor = useCallback(async (id: number): Promise<Tutor | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{tutor: Tutor}>(GET_TUTOR, {id});
      return data.tutor;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTutor = useCallback(
    async (input: CreateTutorInput): Promise<Tutor> => {
      setLoading(true);
      setError(null);
      try {
        const data = await executeQuery<{createTutor: Tutor}>(CREATE_TUTOR, {
          input,
        });
        return data.createTutor;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateTutor = useCallback(
    async (id: number, input: UpdateTutorInput): Promise<Tutor> => {
      setLoading(true);
      setError(null);
      try {
        const data = await executeQuery<{updateTutor: Tutor}>(UPDATE_TUTOR, {
          id,
          input,
        });
        return data.updateTutor;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeTutor = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{removeTutor: boolean}>(REMOVE_TUTOR, {id});
      return data.removeTutor;
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
    getTutores,
    getTutoresPaginate,
    getTutor,
    createTutor,
    updateTutor,
    removeTutor,
  };
};
