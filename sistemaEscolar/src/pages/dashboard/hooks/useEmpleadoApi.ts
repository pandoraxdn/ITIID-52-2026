// ============================================
// ARCHIVO: useEmpleadoApi.ts
// ============================================

import {pandoraApi} from '@/api/pandoraApi';
import {useState, useCallback} from 'react';
import {
  Empleado,
  CreateEmpleadoInput,
  UpdateEmpleadoInput
} from '../interfaces/empleado.interface';
import {
  GET_EMPLEADOS,
  GET_EMPLEADOS_PAGINATE,
  GET_EMPLEADO,
  CREATE_EMPLEADO,
  UPDATE_EMPLEADO,
  DELETE_EMPLEADO
} from '../graphql/empleados';

/**
 * Función auxiliar para ejecutar cualquier consulta o mutación GraphQL.
 * Realiza una petición POST al endpoint de GraphQL usando la instancia de axios preconfigurada.
 *
 * @template T - Tipo de la respuesta esperada (data.data).
 * @param {string} query - La consulta GraphQL (puede ser query o mutation).
 * @param {any} [variables] - Variables para la consulta (opcional).
 * @returns {Promise<T>} - Promesa que resuelve con la propiedad 'data' de la respuesta.
 * @throws {Error} - Si la respuesta contiene errores GraphQL.
 */
async function executeQuery<T>(query: string, variables?: any): Promise<T> {
  const response = await pandoraApi.post('', {query, variables});
  if (response.data.errors) {
    throw new Error(response.data.errors[0].message);
  }
  return response.data.data;
}

/**
 * Hook personalizado que encapsula todas las operaciones relacionadas con empleados
 * hacia el backend GraphQL.
 * 
 * Proporciona métodos para obtener listas (con y sin paginación), obtener uno, crear,
 * actualizar y eliminar empleados. Además, gestiona estados de carga y error.
 *
 * @returns {Object} Objeto con los estados loading/error y las funciones API.
 */
export const useEmpleadoApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------------------------------------------
  // Obtener todos los empleados (sin paginación)
  // -----------------------------------------------------------------
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

  // -----------------------------------------------------------------
  // Obtener empleados paginados
  // -----------------------------------------------------------------
  /**
   * @param {number} [page] - Número de página (opcional).
   * @param {number} [limit] - Cantidad por página (opcional).
   * @returns {Promise<Empleado[]>} Lista de empleados de la página solicitada.
   */
  const getEmpleadosPaginate = useCallback(
    async (page?: number, limit?: number): Promise<Empleado[]> => {
      setLoading(true);
      setError(null);
      try {
        const variables = page !== undefined && limit !== undefined ? {page, limit} : {};
        const data = await executeQuery<{empleadosP: Empleado[]}>(
          GET_EMPLEADOS_PAGINATE,
          variables
        );
        return data.empleadosP;
      } catch (err: any) {
        setError(err.message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // -----------------------------------------------------------------
  // Obtener un empleado por ID
  // -----------------------------------------------------------------
  /**
   * @param {number} id - ID del empleado.
   * @returns {Promise<Empleado | null>} El empleado encontrado o null.
   */
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

  // -----------------------------------------------------------------
  // Crear un nuevo empleado
  // -----------------------------------------------------------------
  /**
   * @param {CreateEmpleadoInput} input - Datos del nuevo empleado.
   * @returns {Promise<Empleado | null>} El empleado creado o null si falla.
   */
  const createEmpleado = useCallback(
    async (input: CreateEmpleadoInput): Promise<Empleado | null> => {
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
    },
    []
  );

  // -----------------------------------------------------------------
  // Actualizar un empleado existente
  // -----------------------------------------------------------------
  /**
   * @param {number} id - ID del empleado a actualizar.
   * @param {UpdateEmpleadoInput} input - Campos a modificar (todos opcionales menos id).
   * @returns {Promise<Empleado | null>} El empleado actualizado o null.
   */
  const updateEmpleado = useCallback(
    async (id: number, input: UpdateEmpleadoInput): Promise<Empleado | null> => {
      setLoading(true);
      setError(null);
      try {
        const data = await executeQuery<{updateEmpleado: Empleado}>(UPDATE_EMPLEADO, {
          id,
          input,
        });
        return data.updateEmpleado;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // -----------------------------------------------------------------
  // Eliminar un empleado
  // -----------------------------------------------------------------
  /**
   * @param {number} id - ID del empleado a eliminar.
   * @returns {Promise<boolean>} true si se eliminó correctamente, false en caso contrario.
   */
  const removeEmpleado = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{deleteEmpleado: boolean}>(DELETE_EMPLEADO, {id});
      return data.deleteEmpleado;
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
    removeEmpleado,
  };
};
