// ============================================
// ARCHIVO: useAlumnoForm.ts
// Módulo: Alumnos
// Descripción: Hook que maneja la lógica de negocio para la gestión de alumnos.
// ============================================

import {useState, useEffect, useReducer} from 'react';
import {useAlumnoApi} from './useAlumnoApi';
import type { Alumno, CreateAlumnoInput, UpdateAlumnoInput } from '../interfaces/alumno.interface'
import { Genero, TipoSangre } from '../interfaces/alumno.interface';

/**
 * Estado inicial del formulario para crear un alumno.
 * Se incluyen valores por defecto para campos obligatorios.
 */
const INITIAL_STATE: CreateAlumnoInput = {
  matricula: '',
  nombre: '',
  apellido_p: '',
  apellido_m: '',
  genero: Genero.MASCULINO,
  curp: '',
  email_institucional: '',
  direccion: '',
  tipo_sangre: TipoSangre.O_POSITIVO,
  alergias: '',
  condiciones_medicas: '',
  fecha_ingreso: new Date().toISOString().split('T')[0],
  activo: true,
};

type FormAction =
  | {type: 'SET_FIELD'; field: keyof CreateAlumnoInput; value: any}
  | {type: 'SET_FORM'; payload: CreateAlumnoInput}
  | {type: 'RESET'};

const formReducer = (state: CreateAlumnoInput, action: FormAction): CreateAlumnoInput => {
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

export const useAlumnoForm = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Alumno | null>(null);
  const [form, dispatch] = useReducer(formReducer, INITIAL_STATE);

  const api = useAlumnoApi();

  const fetchAlumnos = async (currentPage: number = page) => {
    try {
      const data = await api.getAlumnosPaginate(currentPage, limit);
      setAlumnos(data);
      setHasMore(data.length === limit);
    } catch (error) {
      console.error('Error al cargar alumnos:', error);
    }
  };

  useEffect(() => {
    fetchAlumnos(1);
  }, []);

  const nextPage = () => {
    if (hasMore) {
      const next = page + 1;
      setPage(next);
      fetchAlumnos(next);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      const prev = page - 1;
      setPage(prev);
      fetchAlumnos(prev);
    }
  };

  const goToPage = (newPage: number) => {
    if (newPage > 0 && (newPage <= page || hasMore)) {
      setPage(newPage);
      fetchAlumnos(newPage);
    }
  };

  const setField = (field: keyof CreateAlumnoInput, value: any) => {
    dispatch({type: 'SET_FIELD', field, value});
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // Validación básica: campos obligatorios no vacíos
  const isValid = () => {
    return (
      form.matricula.trim() !== '' &&
      form.nombre.trim() !== '' &&
      form.apellido_p.trim() !== '' &&
      form.curp.trim() !== '' &&
      form.email_institucional.trim() !== '' &&
      form.direccion.trim() !== '' &&
      form.fecha_ingreso.trim() !== ''
    );
  };

  const handleOpenModal = (alumno?: Alumno) => {
    if (alumno) {
      // Mapear alumno a CreateAlumnoInput (sin id)
      const payload: CreateAlumnoInput = {
        matricula: alumno.matricula,
        nombre: alumno.nombre,
        apellido_p: alumno.apellido_p,
        apellido_m: alumno.apellido_m || '',
        genero: alumno.genero,
        curp: alumno.curp,
        email_institucional: alumno.email_institucional,
        direccion: alumno.direccion,
        tipo_sangre: alumno.tipo_sangre,
        alergias: alumno.alergias || '',
        condiciones_medicas: alumno.condiciones_medicas || '',
        fecha_ingreso:
          typeof alumno.fecha_ingreso === 'string'
            ? alumno.fecha_ingreso
            : (alumno.fecha_ingreso as Date).toISOString().split('T')[0],
        activo: alumno.activo,
      };
      dispatch({type: 'SET_FORM', payload});
      setEditing(alumno);
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
        const alumnoId = Number(editing.id_alumno);
        const input: UpdateAlumnoInput = {...form, id_alumno: alumnoId};
        await api.updateAlumno(alumnoId, input);
      } else {
        await api.createAlumno(form);
      }

      setPage(1);
      await fetchAlumnos(1);
      handleCloseModal();
    } catch (error: any) {
      console.error('❌ Error en la operación:', error);
      if (error.message?.includes('not found')) {
        alert('El alumno que intentabas guardar ya no existe. La lista se actualizará.');
        handleCloseModal();
        await fetchAlumnos(page);
      } else {
        alert('Ocurrió un error al guardar el alumno. Revisa la consola.');
      }
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('¿Estás seguro de eliminar este alumno?')) return;
    const alumnoId = Number(id);
    try {
      const success = await api.removeAlumno(alumnoId);
      if (success) {
        await fetchAlumnos(page);
        if (alumnos.length === 0 && page > 1) {
          setPage(page - 1);
          await fetchAlumnos(page - 1);
        }
      }
    } catch (error) {
      console.error('❌ Error al eliminar:', error);
      alert('No se pudo eliminar el alumno.');
    }
  };

  const getFullName = (alumno: Alumno) =>
    `${alumno.nombre} ${alumno.apellido_p} ${alumno.apellido_m || ''}`.trim();

  return {
    alumnos,
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
