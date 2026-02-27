import {useState, useEffect, useReducer} from 'react';
import {useProfesorApi} from './useProfesorApi';
import {useEmpleadoApi} from './useEmpleadoApi';
import {
  Profesor,
  TipoNivelEstudio,
  CreateProfesorInput,
  UpdateProfesorInput,
} from '../interfaces/profesor.interface';
import {Empleado} from '../interfaces/empleado.interface';

const INITIAL_STATE: CreateProfesorInput = {
  empleado_id: 0,
  especialidad: '',
  nivel_estudios: TipoNivelEstudio.LICENCIATURA,
  cedula_profesional: '',
};

type FormAction =
  | {type: 'SET_FIELD'; field: keyof CreateProfesorInput; value: any}
  | {type: 'SET_FORM'; payload: CreateProfesorInput}
  | {type: 'RESET'};

const formReducer = (state: CreateProfesorInput, action: FormAction): CreateProfesorInput => {
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

export type SelectorType = 'empleado' | null;

export const useProfesorForm = () => {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState<SelectorType>(null);
  const [editing, setEditing] = useState<Profesor | null>(null);
  const [form, dispatch] = useReducer(formReducer, INITIAL_STATE);
  const [selectedEmpleadoNombre, setSelectedEmpleadoNombre] = useState<string>('');

  const api = useProfesorApi();
  const empleadoApi = useEmpleadoApi();

  const fetchProfesores = async (currentPage: number = page) => {
    const data = await api.getProfesoresPaginate(currentPage, limit);
    // Para cada profesor, obtener su empleado de forma individual
    const profesoresConEmpleado = await Promise.all(
      data.map(async (prof) => {
        if (prof.empleado_id) {
          const empleado = await empleadoApi.getEmpleado(prof.empleado_id);
          return {...prof, empleado: empleado ?? undefined};
        }
        return prof;
      })
    );
    setProfesores(profesoresConEmpleado);
    setHasMore(data.length === limit);
  };

  useEffect(() => {
    fetchProfesores(1);
  }, []);

  const nextPage = () => {
    if (hasMore) {
      const next = page + 1;
      setPage(next);
      fetchProfesores(next);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      const prev = page - 1;
      setPage(prev);
      fetchProfesores(prev);
    }
  };

  const setField = (field: keyof CreateProfesorInput, value: any) => {
    dispatch({type: 'SET_FIELD', field, value});
  };

  const reset = () => {
    dispatch({type: 'RESET'});
    setEditing(null);
    setOpen(false);
    setSelectedEmpleadoNombre('');
  };

  const isValid = () => {
    return (
      form.empleado_id !== 0 &&
      form.especialidad.trim() !== '' &&
      form.cedula_profesional.trim() !== ''
    );
  };

  const handleOpenModal = async (profesor?: Profesor) => {
    if (profesor) {
      const payload: CreateProfesorInput = {
        empleado_id: profesor.empleado_id,
        especialidad: profesor.especialidad,
        nivel_estudios: profesor.nivel_estudios,
        cedula_profesional: profesor.cedula_profesional,
      };
      dispatch({type: 'SET_FORM', payload});
      setEditing(profesor);
      // Cargar el empleado si no está en el profesor
      if (profesor.empleado) {
        setSelectedEmpleadoNombre(
          `${profesor.empleado.nombre} ${profesor.empleado.apellido_p} ${profesor.empleado.apellido_m || ''}`.trim()
        );
      } else if (profesor.empleado_id) {
        const empleado = await empleadoApi.getEmpleado(profesor.empleado_id);
        if (empleado) {
          setSelectedEmpleadoNombre(
            `${empleado.nombre} ${empleado.apellido_p} ${empleado.apellido_m || ''}`.trim()
          );
        } else {
          setSelectedEmpleadoNombre(`ID: ${profesor.empleado_id}`);
        }
      } else {
        setSelectedEmpleadoNombre(`ID: ${profesor.empleado_id}`);
      }
      setOpen(true);
    } else {
      dispatch({type: 'RESET'});
      setEditing(null);
      setSelectedEmpleadoNombre('');
      setOpen(true);
    }
  };

  const handleSelectEmpleado = (empleado: Empleado) => {
    setField('empleado_id', Number(empleado.id_empleado));
    setSelectedEmpleadoNombre(
      `${empleado.nombre} ${empleado.apellido_p} ${empleado.apellido_m || ''}`.trim()
    );
    setSelectorOpen(null);
  };

  const handleClearEmpleado = () => {
    setField('empleado_id', 0);
    setSelectedEmpleadoNombre('');
  };

  const handleCloseModal = () => {
    setOpen(false);
    setEditing(null);
    dispatch({type: 'RESET'});
    setSelectedEmpleadoNombre('');
  };

  const handleOpenSelector = (type: SelectorType) => setSelectorOpen(type);
  const handleCloseSelector = () => setSelectorOpen(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) return;

    let success = false;
    if (editing) {
      const profesorId = Number(editing.id_profesor);
      const input: UpdateProfesorInput = {...form, id_profesor: profesorId};
      const updated = await api.updateProfesor(profesorId, input);
      success = updated !== null;
    } else {
      const created = await api.createProfesor(form);
      success = created !== null;
    }

    if (success) {
      setPage(1);
      await fetchProfesores(1);
      handleCloseModal();
    } else {
      console.error('La operación falló');
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('¿Estás seguro de eliminar este profesor?')) return;
    const profesorId = Number(id);
    const success = await api.removeProfesor(profesorId);
    if (success) {
      await fetchProfesores(page);
      if (profesores.length === 0 && page > 1) {
        const prev = page - 1;
        setPage(prev);
        await fetchProfesores(prev);
      }
    }
  };

  return {
    profesores,
    loading: api.loading,
    error: api.error,
    form,
    open,
    selectorOpen,
    editing,
    page,
    hasMore,
    setField,
    isValid,
    handleOpenModal,
    handleCloseModal,
    handleSelectEmpleado,
    handleClearEmpleado,
    handleOpenSelector,
    handleCloseSelector,
    handleSubmit,
    handleDelete,
    isEditing: !!editing,
    nextPage,
    prevPage,
    selectedEmpleadoNombre,
  };
};
