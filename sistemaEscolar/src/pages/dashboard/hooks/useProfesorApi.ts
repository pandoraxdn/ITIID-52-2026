// ============================================
// ARCHIVO: useProfesorApi.ts
// Módulo: Profesores
// Descripción: Hook personalizado que encapsula todas las operaciones GraphQL relacionadas con profesores.
// ============================================

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

/**
 * Función auxiliar para ejecutar cualquier consulta o mutación GraphQL.
 * Realiza una petición POST al endpoint de GraphQL usando la instancia axios preconfigurada.
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
 * Hook que proporciona métodos para interactuar con la API de profesores.
 * Gestiona estados de carga y error, y expone funciones para cada operación CRUD.
 *
 * @returns {Object} Objeto con estados loading/error y las funciones API.
 */
export const useProfesorApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------------------------------------------
  // Obtener todos los profesores (sin paginación)
  // -----------------------------------------------------------------
  /**
   * @returns {Promise<Profesor[]>} Lista completa de profesores.
   */
  const getProfesores = useCallback(async (): Promise<Profesor[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{profesores: Profesor[]}>(GET_PROFESORES);
      return data.profesores;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // -----------------------------------------------------------------
  // Obtener profesores paginados
  // -----------------------------------------------------------------
  /**
   * @param {number} page - Número de página (por defecto 1).
   * @param {number} limit - Cantidad por página (por defecto 10).
   * @returns {Promise<Profesor[]>} Lista de profesores de la página solicitada.
   */
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
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // -----------------------------------------------------------------
  // Obtener un profesor por ID
  // -----------------------------------------------------------------
  /**
   * @param {number} id - ID del profesor.
   * @returns {Promise<Profesor | null>} El profesor encontrado o null.
   */
  const getProfesor = useCallback(async (id: number): Promise<Profesor | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{profesor: Profesor}>(GET_PROFESOR, {id});
      return data.profesor;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // -----------------------------------------------------------------
  // Crear un nuevo profesor
  // -----------------------------------------------------------------
  /**
   * @param {CreateProfesorInput} input - Datos del nuevo profesor.
   * @returns {Promise<Profesor | null>} El profesor creado o null si falla.
   */
  const createProfesor = useCallback(
    async (input: CreateProfesorInput): Promise<Profesor | null> => {
      setLoading(true);
      setError(null);
      try {
        const data = await executeQuery<{createProfesor: Profesor}>(CREATE_PROFESOR, {
          input,
        });
        return data.createProfesor;
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
  // Actualizar un profesor existente
  // -----------------------------------------------------------------
  /**
   * @param {number} id - ID del profesor a actualizar.
   * @param {UpdateProfesorInput} input - Campos a modificar (todos opcionales).
   * @returns {Promise<Profesor | null>} El profesor actualizado o null.
   */
  const updateProfesor = useCallback(
    async (id: number, input: UpdateProfesorInput): Promise<Profesor | null> => {
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
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // -----------------------------------------------------------------
  // Eliminar un profesor
  // -----------------------------------------------------------------
  /**
   * @param {number} id - ID del profesor a eliminar.
   * @returns {Promise<boolean>} true si se eliminó correctamente, false en caso contrario.
   */
  const removeProfesor = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await executeQuery<{removeProfesor: boolean}>(REMOVE_PROFESOR, {id});
      return data.removeProfesor;
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
    getProfesores,
    getProfesoresPaginate,
    getProfesor,
    createProfesor,
    updateProfesor,
    removeProfesor,
  };
};
