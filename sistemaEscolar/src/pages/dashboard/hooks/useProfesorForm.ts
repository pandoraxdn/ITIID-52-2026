// ============================================
// ARCHIVO: useProfesorForm.ts
// Módulo: Profesores
// Descripción: Hook personalizado que maneja la lógica de negocio para la gestión de profesores:
//              carga de datos paginados, estado del formulario, validaciones, CRUD y selector de empleado.
// ============================================
import {useState, useEffect, useReducer} from 'react';
import {useProfesorApi} from './useProfesorApi';
import {useEmpleadoApi} from './useEmpleadoApi';
import {
  Profesor,
  TipoNivelEstudio,
  CreateProfesorInput,
  UpdateProfesorInput,
} from '../interfaces/profesor.interface';
import {Empleado} from '../interfaces/empleado.interface'; // Asegurar que la ruta sea correcta

/**
 * Estado inicial del formulario para crear un profesor.
 * empleado_id inicia en 0 (ninguno seleccionado).
 */
const INITIAL_STATE: CreateProfesorInput = {
  empleado_id: 0,
  especialidad: '',
  nivel_estudios: TipoNivelEstudio.LICENCIATURA,
  cedula_profesional: '',
};

/**
 * Acciones posibles para el reducer del formulario.
 */
type FormAction =
  | {type: 'SET_FIELD'; field: keyof CreateProfesorInput; value: any}
  | {type: 'SET_FORM'; payload: CreateProfesorInput}
  | {type: 'RESET'};

/**
 * Reducer que maneja las actualizaciones del estado del formulario.
 * @param state - Estado actual.
 * @param action - Acción a ejecutar.
 * @returns Nuevo estado.
 */
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

/**
 * Tipo que define qué selector está abierto (actualmente solo 'empleado').
 */
export type SelectorType = 'empleado' | null;

/**
 * Hook principal para la gestión de profesores.
 * 
 * @returns {Object} Estados y funciones para ser utilizados en el componente de vista.
 */
export const useProfesorForm = () => {
  // -----------------------------------------------------------------
  // Estados locales
  // -----------------------------------------------------------------
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Límite fijo por página
  const [hasMore, setHasMore] = useState(false);
  const [open, setOpen] = useState(false); // Controla el modal de profesor
  const [selectorOpen, setSelectorOpen] = useState<SelectorType>(null); // Controla el selector de empleado
  const [editing, setEditing] = useState<Profesor | null>(null); // Profesor en edición (null = creación)
  const [form, dispatch] = useReducer(formReducer, INITIAL_STATE);
  const [selectedEmpleadoNombre, setSelectedEmpleadoNombre] = useState<string>(''); // Nombre legible del empleado seleccionado

  // Hooks de API
  const api = useProfesorApi();
  const empleadoApi = useEmpleadoApi();

  // -----------------------------------------------------------------
  // Carga de profesores (incluye datos del empleado asociado)
  // -----------------------------------------------------------------
  /**
   * Obtiene los profesores de la página actual y, para cada uno, recupera el objeto Empleado
   * correspondiente mediante empleadoApi.getEmpleado.
   * @param currentPage - Número de página a cargar.
   */
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

  // Carga inicial al montar el componente
  useEffect(() => {
    fetchProfesores(1);
  }, []);

  // -----------------------------------------------------------------
  // Funciones de paginación
  // -----------------------------------------------------------------
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

  // -----------------------------------------------------------------
  // Funciones del formulario
  // -----------------------------------------------------------------
  /**
   * Actualiza un campo específico del formulario.
   * @param field - Nombre del campo.
   * @param value - Nuevo valor.
   */
  const setField = (field: keyof CreateProfesorInput, value: any) => {
    dispatch({type: 'SET_FIELD', field, value});
  };

  /**
   * Reinicia el formulario al estado inicial, limpia la selección de empleado y cierra modales.
   */
  const reset = () => {
    dispatch({type: 'RESET'});
    setEditing(null);
    setOpen(false);
    setSelectedEmpleadoNombre('');
  };

  /**
   * Valida que los campos obligatorios tengan valor.
   * @returns true si es válido.
   */
  const isValid = () => {
    return (
      form.empleado_id !== 0 &&
      form.especialidad.trim() !== '' &&
      form.cedula_profesional.trim() !== ''
    );
  };

  // -----------------------------------------------------------------
  // Apertura del modal de profesor (crear/editar)
  // -----------------------------------------------------------------
  /**
   * Abre el modal de profesor. Si se proporciona un profesor, carga sus datos para edición;
   * de lo contrario, prepara el formulario para crear uno nuevo.
   * También intenta cargar el nombre del empleado asociado.
   * @param profesor - Profesor a editar (opcional).
   */
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

      // Determinar el nombre del empleado para mostrarlo en el campo de solo lectura
      if (profesor.empleado) {
        // Si ya tenemos el empleado (porque se cargó en fetchProfesores), lo usamos
        setSelectedEmpleadoNombre(
          `${profesor.empleado.nombre} ${profesor.empleado.apellido_p} ${profesor.empleado.apellido_m || ''}`.trim()
        );
      } else if (profesor.empleado_id) {
        // Si no, lo obtenemos mediante la API
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
      // Modo creación: formulario vacío
      dispatch({type: 'RESET'});
      setEditing(null);
      setSelectedEmpleadoNombre('');
      setOpen(true);
    }
  };

  // -----------------------------------------------------------------
  // Selección de empleado desde el selector
  // -----------------------------------------------------------------
  /**
   * Establece el empleado seleccionado en el formulario y guarda su nombre para mostrarlo.
   * @param empleado - Empleado seleccionado.
   */
  const handleSelectEmpleado = (empleado: Empleado) => {
    setField('empleado_id', Number(empleado.id_empleado));
    setSelectedEmpleadoNombre(
      `${empleado.nombre} ${empleado.apellido_p} ${empleado.apellido_m || ''}`.trim()
    );
    setSelectorOpen(null); // Cierra el selector
  };

  /**
   * Limpia la selección de empleado (vuelve a 0 y borra el nombre mostrado).
   */
  const handleClearEmpleado = () => {
    setField('empleado_id', 0);
    setSelectedEmpleadoNombre('');
  };

  /**
   * Cierra el modal de profesor sin guardar cambios.
   */
  const handleCloseModal = () => {
    setOpen(false);
    setEditing(null);
    dispatch({type: 'RESET'});
    setSelectedEmpleadoNombre('');
  };

  /**
   * Abre un selector específico (actualmente solo 'empleado').
   * @param type - Tipo de selector a abrir.
   */
  const handleOpenSelector = (type: SelectorType) => setSelectorOpen(type);

  /**
   * Cierra cualquier selector abierto.
   */
  const handleCloseSelector = () => setSelectorOpen(null);

  // -----------------------------------------------------------------
  // Envío del formulario (crear o actualizar)
  // -----------------------------------------------------------------
  /**
   * Maneja el envío del formulario.
   * Si hay un profesor en edición, llama a updateProfesor; si no, a createProfesor.
   * En caso de éxito, recarga la primera página y cierra el modal.
   * @param e - Evento del formulario.
   */
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

  // -----------------------------------------------------------------
  // Eliminación de un profesor
  // -----------------------------------------------------------------
  /**
   * Solicita confirmación y elimina el profesor con el ID proporcionado.
   * Después de eliminar, recarga la página actual; si la página queda vacía, retrocede.
   * @param id - ID del profesor a eliminar (puede ser string o number).
   */
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

  // -----------------------------------------------------------------
  // Retorno del hook
  // -----------------------------------------------------------------
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
