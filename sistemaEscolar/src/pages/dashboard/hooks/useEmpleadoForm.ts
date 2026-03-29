import {useState, useEffect, useReducer} from 'react';
import {useEmpleadoApi} from './useEmpleadoApi';
import type { Empleado, CreateEmpleadoInput, UpdateEmpleadoInput } from '../interfaces/empleado.interface'
import { TipoPuesto, TipoEmpleado } from '../interfaces/empleado.interface';

const INITIAL_STATE: CreateEmpleadoInput = {
  numero_empleado: '',
  nombre: '',
  apellido_p: '',
  apellido_m: '',
  email_personal: '',
  email_institucional: '',
  telefono: '',
  tipo_empleado: TipoEmpleado.DOCENTE,
  puesto: TipoPuesto.MAESTRO,
  departamento: '',
  fecha_contratacion: new Date().toISOString().split('T')[0],
  activo: true,
};

type FormAction =
  | {type: 'SET_FIELD'; field: keyof CreateEmpleadoInput; value: any}
  | {type: 'SET_FORM'; payload: CreateEmpleadoInput}
  | {type: 'RESET'};

const formReducer = (state: CreateEmpleadoInput, action: FormAction): CreateEmpleadoInput => {
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

export const useEmpleadoForm = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Empleado | null>(null);
  const [form, dispatch] = useReducer(formReducer, INITIAL_STATE);

  const api = useEmpleadoApi();

  const fetchEmpleados = async (currentPage: number = page) => {
    const data = await api.getEmpleadosPaginate(currentPage, limit);
    setEmpleados(data);
    setHasMore(data.length === limit);
  };

  useEffect(() => {
    fetchEmpleados(1);
  }, []);

  const nextPage = () => {
    if (hasMore) {
      const next = page + 1;
      setPage(next);
      fetchEmpleados(next);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      const prev = page - 1;
      setPage(prev);
      fetchEmpleados(prev);
    }
  };

  const goToPage = (newPage: number) => {
    if (newPage > 0 && (newPage <= page || hasMore)) {
      setPage(newPage);
      fetchEmpleados(newPage);
    }
  };

  const setField = (field: keyof CreateEmpleadoInput, value: any) => {
    dispatch({type: 'SET_FIELD', field, value});
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const isValid = () => {
    return (
      form.numero_empleado.trim() !== '' &&
      form.nombre.trim() !== '' &&
      form.apellido_p.trim() !== '' &&
      form.email_personal.trim() !== '' &&
      form.email_institucional.trim() !== '' &&
      form.telefono.trim() !== '' &&
      form.departamento.trim() !== '' &&
      form.fecha_contratacion.trim() !== ''
    );
  };

  const handleOpenModal = (empleado?: Empleado) => {
    if (empleado) {
      const payload: CreateEmpleadoInput = {
        numero_empleado: empleado.numero_empleado,
        nombre: empleado.nombre,
        apellido_p: empleado.apellido_p,
        apellido_m: empleado.apellido_m || '',
        email_personal: empleado.email_personal,
        email_institucional: empleado.email_institucional,
        telefono: empleado.telefono,
        tipo_empleado: empleado.tipo_empleado,
        puesto: empleado.puesto,
        departamento: empleado.departamento,
        fecha_contratacion:
          typeof empleado.fecha_contratacion === 'string'
            ? empleado.fecha_contratacion
            : (empleado.fecha_contratacion as Date).toISOString().split('T')[0],
        activo: empleado.activo,
      };
      dispatch({type: 'SET_FORM', payload});
      setEditing(empleado);
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

    let success = false;
    if (editing) {
      const empleadoId = Number(editing.id_empleado);
      const input: UpdateEmpleadoInput = {...form, id_empleado: empleadoId};
      const updated = await api.updateEmpleado(empleadoId, input);
      success = updated !== null;
    } else {
      const created = await api.createEmpleado(form);
      success = created !== null;
    }

    if (success) {
      setPage(1);
      await fetchEmpleados(1);
      handleCloseModal();
    } else {
      console.error('La operación falló');
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('¿Estás seguro de eliminar este empleado?')) return;
    const empleadoId = Number(id);
    const success = await api.removeEmpleado(empleadoId);
    if (success) {
      const currentPage = page;
      await fetchEmpleados(currentPage);
      if (empleados.length === 0 && page > 1) {
        setPage(page - 1);
        await fetchEmpleados(page - 1);
      }
    }
  };

  const getFullName = (empleado: Empleado) =>
    `${empleado.nombre} ${empleado.apellido_p} ${empleado.apellido_m || ''}`.trim();

  return {
    empleados,
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
