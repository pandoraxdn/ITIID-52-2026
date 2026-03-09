// ============================================
// ARCHIVO: useUsuarioApi.ts
// Módulo: Usuarios
// Descripción: Hook personalizado que encapsula las operaciones GraphQL para usuarios.
// ============================================

import {pandoraApi} from '@/api/pandoraApi';
import {useState, useCallback} from 'react';
import {
  Usuario,
  CreateUsuarioInput,
  UpdateUsuarioInput,
} from '../interfaces/usuario.interface';
import {
  GET_USUARIOS,
  GET_USUARIOS_PAGINATE,
  GET_USUARIO,
  CREATE_USUARIO,
  UPDATE_USUARIO,
  REMOVE_USUARIO
} from '../graphql/usuarios';

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

export const useUsuarioApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUsuarios = useCallback(async (): Promise<Usuario[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{usuarios: Usuario[]}>(GET_USUARIOS);
      return data.usuarios;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUsuariosPaginate = useCallback(
    async (page: number = 1, limit: number = 10): Promise<Usuario[]> => {
      setLoading(true);
      setError(null);
      try {
        const data = await executeQuery<{usuariosP: Usuario[]}>(
          GET_USUARIOS_PAGINATE,
          {page, limit}
        );
        return data.usuariosP;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getUsuario = useCallback(async (id: number): Promise<Usuario | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{usuario: Usuario}>(GET_USUARIO, {id});
      return data.usuario;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createUsuario = useCallback(
    async (input: CreateUsuarioInput): Promise<Usuario> => {
      setLoading(true);
      setError(null);
      try {
        const data = await executeQuery<{createUsuario: Usuario}>(CREATE_USUARIO, {
          input,
        });
        return data.createUsuario;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateUsuario = useCallback(
    async (id: number, input: UpdateUsuarioInput): Promise<Usuario> => {
      setLoading(true);
      setError(null);
      try {
        const data = await executeQuery<{updateUsuario: Usuario}>(UPDATE_USUARIO, {
          id,
          input,
        });
        return data.updateUsuario;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeUsuario = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{removeUsuario: boolean}>(REMOVE_USUARIO, {id});
      return data.removeUsuario;
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
    getUsuarios,
    getUsuariosPaginate,
    getUsuario,
    createUsuario,
    updateUsuario,
    removeUsuario,
  };
};
