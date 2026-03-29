import {pandoraApi} from '@/api/pandoraApi';
import {useState, useCallback} from 'react';
import type { Empleado, CreateEmpleadoInput, UpdateEmpleadoInput } from '../interfaces/empleado.interface';
import {
  GET_EMPLEADOS,
  GET_EMPLEADOS_PAGINATE,
  GET_EMPLEADO,
  CREATE_EMPLEADO,
  UPDATE_EMPLEADO,
  REMOVE_EMPLEADO
} from '../graphql/empleados';

async function executeQuery<T>(query: string, variables?: any): Promise<T> {
  const response = await pandoraApi.post('', {query, variables});
  if (response.data.errors) throw new Error(response.data.errors[0].message);
  return response.data.data;
}

export const useEmpleadoApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getEmpleados = useCallback(async (): Promise<Empleado[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{empleados: Empleado[]}>(GET_EMPLEADOS);
      return data.empleados;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getEmpleadosPaginate = useCallback(async (page?: number, limit?: number): Promise<Empleado[]> => {
    setLoading(true);
    setError(null);
    try {
      const variables = page !== undefined && limit !== undefined ? {page, limit} : {};
      const data = await executeQuery<{empleadosP: Empleado[]}>(GET_EMPLEADOS_PAGINATE, variables);
      return data.empleadosP;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getEmpleado = useCallback(async (id: number): Promise<Empleado | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{empleado: Empleado}>(GET_EMPLEADO, {id});
      return data.empleado;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEmpleado = useCallback(async (input: CreateEmpleadoInput): Promise<Empleado | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{createEmpleado: Empleado}>(CREATE_EMPLEADO, {input});
      return data.createEmpleado;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEmpleado = useCallback(async (id: number, input: UpdateEmpleadoInput): Promise<Empleado | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{updateEmpleado: Empleado}>(UPDATE_EMPLEADO, {id, input});
      return data.updateEmpleado;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeEmpleado = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{removeEmpleado: boolean}>(REMOVE_EMPLEADO, {id});
      return data.removeEmpleado;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getEmpleados,
    getEmpleadosPaginate,
    getEmpleado,
    createEmpleado,
    updateEmpleado,
    removeEmpleado
  };
};
