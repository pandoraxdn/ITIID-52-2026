// ============================================
// ARCHIVO: useTutorForm.ts
// Módulo: Tutores
// Descripción: Hook que maneja la lógica de negocio para la gestión de tutores.
// ============================================

import {useState, useEffect, useReducer} from 'react';
import {useTutorApi} from './useTutorApi';
import type { Tutor, CreateTutorInput, UpdateTutorInput } from '../interfaces/tutor.interface'
import { TipoRelacion } from '../interfaces/tutor.interface';

/**
 * Estado inicial del formulario para crear un tutor.
 */
const INITIAL_STATE: CreateTutorInput = {
  nombre: '',
  apellido_p: '',
  apellido_m: '',
  relacion: TipoRelacion.PADRE,
  telefono_principal: '',
  telefono_emergencia: '',
  email: '',
};

type FormAction =
  | {type: 'SET_FIELD'; field: keyof CreateTutorInput; value: any}
  | {type: 'SET_FORM'; payload: CreateTutorInput}
  | {type: 'RESET'};

const formReducer = (state: CreateTutorInput, action: FormAction): CreateTutorInput => {
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

export const useTutorForm = () => {
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tutor | null>(null);
  const [form, dispatch] = useReducer(formReducer, INITIAL_STATE);

  const api = useTutorApi();

  const fetchTutores = async (currentPage: number = page) => {
    try {
      const data = await api.getTutoresPaginate(currentPage, limit);
      setTutores(data);
      setHasMore(data.length === limit);
    } catch (error) {
      console.error('Error al cargar tutores:', error);
    }
  };

  useEffect(() => {
    fetchTutores(1);
  }, []);

  const nextPage = () => {
    if (hasMore) {
      const next = page + 1;
      setPage(next);
      fetchTutores(next);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      const prev = page - 1;
      setPage(prev);
      fetchTutores(prev);
    }
  };

  const goToPage = (newPage: number) => {
    if (newPage > 0 && (newPage <= page || hasMore)) {
      setPage(newPage);
      fetchTutores(newPage);
    }
  };

  const setField = (field: keyof CreateTutorInput, value: any) => {
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
      form.apellido_p.trim() !== '' &&
      form.telefono_principal.trim() !== '' &&
      form.email.trim() !== ''
    );
  };

  const handleOpenModal = (tutor?: Tutor) => {
    if (tutor) {
      const payload: CreateTutorInput = {
        nombre: tutor.nombre,
        apellido_p: tutor.apellido_p,
        apellido_m: tutor.apellido_m || '',
        relacion: tutor.relacion,
        telefono_principal: tutor.telefono_principal,
        telefono_emergencia: tutor.telefono_emergencia,
        email: tutor.email,
      };
      dispatch({type: 'SET_FORM', payload});
      setEditing(tutor);
    } else {
      dispatch({type: 'RESET'});
      setEditing(null);
    }
    setOpen(true);
  };

  const handleCloseModal = () => {
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) return;

    try {
      if (editing) {
        const tutorId = Number(editing.id_tutor);
        const input: UpdateTutorInput = {...form, id_tutor: tutorId};
        await api.updateTutor(tutorId, input);
      } else {
        await api.createTutor(form);
      }

      setPage(1);
      await fetchTutores(1);
      handleCloseModal();
    } catch (error: any) {
      console.error('Error en la operación:', error);
      if (error.message?.includes('not found')) {
        alert('El tutor que intentabas guardar ya no existe. La lista se actualizará.');
        handleCloseModal();
        await fetchTutores(page);
      } else {
        alert('Ocurrió un error al guardar el tutor. Revisa la consola.');
      }
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('¿Estás seguro de eliminar este tutor?')) return;
    const tutorId = Number(id);
    try {
      const success = await api.removeTutor(tutorId);
      if (success) {
        await fetchTutores(page);
        if (tutores.length === 0 && page > 1) {
          setPage(page - 1);
          await fetchTutores(page - 1);
        }
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('No se pudo eliminar el tutor.');
    }
  };

  const getFullName = (tutor: Tutor) =>
    `${tutor.nombre} ${tutor.apellido_p} ${tutor.apellido_m || ''}`.trim();

  return {
    tutores,
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
    getFullName,
    isEditing: !!editing,
    nextPage,
    prevPage,
    goToPage,
  };
};
