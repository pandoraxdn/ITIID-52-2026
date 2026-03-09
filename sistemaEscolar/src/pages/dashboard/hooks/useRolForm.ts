// ============================================
// ARCHIVO: useRolForm.ts
// Módulo: Roles
// Descripción: Hook que maneja la lógica de negocio para la gestión de roles.
// ============================================

import {useState, useEffect, useReducer} from 'react';
import {useRolApi} from './useRolApi';
import {
  Rol,
  CreateRolInput,
  UpdateRolInput,
} from '../interfaces/rol.interface';

/**
 * Estado inicial del formulario para crear un rol.
 */
const INITIAL_STATE: CreateRolInput = {
  nombre: '',
  descripcion: '',
};

type FormAction =
  | {type: 'SET_FIELD'; field: keyof CreateRolInput; value: any}
  | {type: 'SET_FORM'; payload: CreateRolInput}
  | {type: 'RESET'};

const formReducer = (state: CreateRolInput, action: FormAction): CreateRolInput => {
  switch (action.type) {
    case 'SET_FIELD':
      return {...state, [action.field]: action.value};
    case 'SET_FORM':
      return action.payload;
    case 'RESET':
      return INITIAL_STATE;
    default:
      return state;
  }
};

export const useRolForm = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Rol | null>(null);
  const [form, dispatch] = useReducer(formReducer, INITIAL_STATE);

  const api = useRolApi();

  const fetchRoles = async (currentPage: number = page) => {
    try {
      const data = await api.getRolesPaginate(currentPage, limit);
      setRoles(data);
      setHasMore(data.length === limit);
    } catch (error) {
      console.error('Error al cargar roles:', error);
    }
  };

  useEffect(() => {
    fetchRoles(1);
  }, []);

  const nextPage = () => {
    if (hasMore) {
      const next = page + 1;
      setPage(next);
      fetchRoles(next);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      const prev = page - 1;
      setPage(prev);
      fetchRoles(prev);
    }
  };

  const goToPage = (newPage: number) => {
    if (newPage > 0 && (newPage <= page || hasMore)) {
      setPage(newPage);
      fetchRoles(newPage);
    }
  };

  const setField = (field: keyof CreateRolInput, value: any) => {
    dispatch({type: 'SET_FIELD', field, value});
  };

  const reset = () => {
    dispatch({type: 'RESET'});
    setEditing(null);
    setOpen(false);
  };

  // Validación básica: campos obligatorios no vacíos
  const isValid = () => {
    return (
      form.nombre.trim() !== '' &&
      form.descripcion.trim() !== ''
    );
  };

  const handleOpenModal = (rol?: Rol) => {
    if (rol) {
      const payload: CreateRolInput = {
        nombre: rol.nombre,
        descripcion: rol.descripcion,
      };
      dispatch({type: 'SET_FORM', payload});
      setEditing(rol);
    } else {
      dispatch({type: 'RESET'});
      setEditing(null);
    }
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setEditing(null);
    dispatch({type: 'RESET'});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) return;

    try {
      if (editing) {
        const rolId = Number(editing.id_rol);
        const input: UpdateRolInput = {...form, id_rol: rolId};
        await api.updateRol(rolId, input);
      } else {
        await api.createRol(form);
      }

      setPage(1);
      await fetchRoles(1);
      handleCloseModal();
    } catch (error: any) {
      console.error('Error en la operación:', error);
      if (error.message?.includes('not found')) {
        alert('El rol que intentabas guardar ya no existe. La lista se actualizará.');
        handleCloseModal();
        await fetchRoles(page);
      } else {
        alert('Ocurrió un error al guardar el rol. Revisa la consola.');
      }
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('¿Estás seguro de eliminar este rol?')) return;
    const rolId = Number(id);
    try {
      const success = await api.removeRol(rolId);
      if (success) {
        await fetchRoles(page);
        if (roles.length === 0 && page > 1) {
          setPage(page - 1);
          await fetchRoles(page - 1);
        }
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('No se pudo eliminar el rol.');
    }
  };

  return {
    roles,
    loading: api.loading,
    error: api.error,
    form,
    open,
    editing,
    page,
    limit,
    hasMore,
    setField,
    isValid,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    isEditing: !!editing,
    nextPage,
    prevPage,
    goToPage,
  };
};
