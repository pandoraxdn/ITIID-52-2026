// ============================================
// ARCHIVO: useRolApi.ts
// Módulo: Roles
// Descripción: Hook personalizado que encapsula todas las operaciones GraphQL para roles.
// ============================================

import {pandoraApi} from '@/api/pandoraApi';
import {useState, useCallback} from 'react';
import {
  Rol,
  CreateRolInput,
  UpdateRolInput,
} from '../interfaces/rol.interface';
import {
  GET_ROLES,
  GET_ROLES_PAGINATE,
  GET_ROL,
  CREATE_ROL,
  UPDATE_ROL,
  REMOVE_ROL
} from '../graphql/roles';

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

export const useRolApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRoles = useCallback(async (): Promise<Rol[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{roles: Rol[]}>(GET_ROLES);
      return data.roles;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRolesPaginate = useCallback(
    async (page: number = 1, limit: number = 10): Promise<Rol[]> => {
      setLoading(true);
      setError(null);
      try {
        const data = await executeQuery<{rolesP: Rol[]}>(
          GET_ROLES_PAGINATE,
          {page, limit}
        );
        return data.rolesP;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getRol = useCallback(async (id: number): Promise<Rol | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{rol: Rol}>(GET_ROL, {id});
      return data.rol;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRol = useCallback(
    async (input: CreateRolInput): Promise<Rol> => {
      setLoading(true);
      setError(null);
      try {
        const data = await executeQuery<{createRol: Rol}>(CREATE_ROL, {
          input,
        });
        return data.createRol;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateRol = useCallback(
    async (id: number, input: UpdateRolInput): Promise<Rol> => {
      setLoading(true);
      setError(null);
      try {
        const data = await executeQuery<{updateRol: Rol}>(UPDATE_ROL, {
          id,
          input,
        });
        return data.updateRol;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeRol = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{removeRol: boolean}>(REMOVE_ROL, {id});
      return data.removeRol;
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
    getRoles,
    getRolesPaginate,
    getRol,
    createRol,
    updateRol,
    removeRol,
  };
};
