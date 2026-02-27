// ============================================
// ARCHIVO: useEmpleadoForm.ts
// ============================================

import {useState, useEffect, useReducer} from 'react';
import {useEmpleadoApi} from './useEmpleadoApi';
import {
  Empleado,
  TipoPuesto,
  TipoEmpleado,
  CreateEmpleadoInput,
  UpdateEmpleadoInput,
} from '../interfaces/empleado.interface';

/**
 * Estado inicial del formulario para crear un empleado.
 * Se utiliza tanto para creación como para reiniciar después de editar.
 */
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
  fecha_contratacion: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
  activo: true,
};

/**
 * Acciones posibles para el reducer del formulario.
 */
type FormAction =
  | {type: 'SET_FIELD'; field: keyof CreateEmpleadoInput; value: any}
  | {type: 'SET_FORM'; payload: CreateEmpleadoInput}
  | {type: 'RESET'};

/**
 * Reducer que maneja las actualizaciones del estado del formulario.
 * @param state - Estado actual del formulario.
 * @param action - Acción a ejecutar.
 * @returns Nuevo estado.
 */
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

/**
 * Hook personalizado que maneja toda la lógica de negocio para la gestión de empleados:
 * - Carga de datos paginados.
 * - Navegación entre páginas.
 * - Estado del formulario (crear/editar).
 * - Validaciones.
 * - Operaciones CRUD usando el hook useEmpleadoApi.
 *
 * @returns Objeto con estados y funciones para ser usado en el componente de vista.
 */
export const useEmpleadoForm = () => {
  // -----------------------------------------------------------------
  // Estados locales
  // -----------------------------------------------------------------
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Límite fijo por página
  const [hasMore, setHasMore] = useState(false); // Indica si hay más páginas después de la actual
  const [open, setOpen] = useState(false); // Controla el modal
  const [editing, setEditing] = useState<Empleado | null>(null); // Empleado en edición (null = modo creación)

  // Estado del formulario manejado con useReducer
  const [form, dispatch] = useReducer(formReducer, INITIAL_STATE);

  // Hook de API (proporciona loading, error y métodos)
  const api = useEmpleadoApi();

  // -----------------------------------------------------------------
  // Función para obtener empleados de la página actual
  // -----------------------------------------------------------------
  /**
   * Obtiene los empleados de la página especificada usando la API paginada.
   * Actualiza el estado 'empleados' y 'hasMore'.
   * @param currentPage - Número de página a cargar.
   */
  const fetchEmpleados = async (currentPage: number = page) => {
    const data = await api.getEmpleadosPaginate(currentPage, limit);
    setEmpleados(data);
    setHasMore(data.length === limit);
  };

  // Carga inicial al montar el componente
  useEffect(() => {
    fetchEmpleados(1);
  }, []);

  // -----------------------------------------------------------------
  // Funciones de paginación
  // -----------------------------------------------------------------
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

  // -----------------------------------------------------------------
  // Funciones del formulario
  // -----------------------------------------------------------------
  /**
   * Actualiza un campo específico del formulario.
   * @param field - Nombre del campo.
   * @param value - Nuevo valor.
   */
  const setField = (field: keyof CreateEmpleadoInput, value: any) => {
    dispatch({type: 'SET_FIELD', field, value});
  };

  /**
   * Reinicia el formulario al estado inicial y cierra el modal.
   */
  const reset = () => {
    dispatch({type: 'RESET'});
    setEditing(null);
    setOpen(false);
  };

  /**
   * Valida que los campos obligatorios del formulario no estén vacíos.
   * El apellido materno es opcional, por eso no se valida.
   * @returns true si todos los campos requeridos tienen valor, false en caso contrario.
   */
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

  // -----------------------------------------------------------------
  // Manejo del modal (apertura/cierre)
  // -----------------------------------------------------------------
  /**
   * Abre el modal. Si se proporciona un empleado, carga sus datos en el formulario
   * para edición; de lo contrario, limpia el formulario para crear uno nuevo.
   * @param empleado - Empleado a editar (opcional).
   */
  const handleOpenModal = (empleado?: Empleado) => {
    if (empleado) {
      // Mapear empleado a CreateEmpleadoInput (sin id)
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
            : empleado.fecha_contratacion.toISOString().split('T')[0],
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

  /**
   * Cierra el modal sin guardar cambios.
   */
  const handleCloseModal = () => {
    setOpen(false);
    setEditing(null);
    dispatch({type: 'RESET'});
  };

  // -----------------------------------------------------------------
  // Envío del formulario (crear o actualizar)
  // -----------------------------------------------------------------
  /**
   * Maneja el envío del formulario.
   * Si hay un empleado en edición, llama a updateEmpleado; si no, a createEmpleado.
   * En caso de éxito, recarga la primera página y cierra el modal.
   * @param e - Evento del formulario.
   */
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

  // -----------------------------------------------------------------
  // Eliminación de un empleado
  // -----------------------------------------------------------------
  /**
   * Solicita confirmación y elimina el empleado con el ID proporcionado.
   * Después de eliminar, recarga la página actual; si la página queda vacía,
   * retrocede a la página anterior.
   * @param id - ID del empleado a eliminar (puede ser string o number).
   */
  const handleDelete = async (id: number | string) => {
    if (!confirm('¿Estás seguro de eliminar este empleado?')) return;
    const empleadoId = Number(id);
    const success = await api.removeEmpleado(empleadoId);
    if (success) {
      const currentPage = page;
      await fetchEmpleados(currentPage);
      // Si después de eliminar la página quedó vacía y no es la primera, retrocedemos
      if (empleados.length === 0 && page > 1) {
        setPage(page - 1);
        await fetchEmpleados(page - 1);
      }
    }
  };

  // -----------------------------------------------------------------
  // Utilidad: obtener nombre completo
  // -----------------------------------------------------------------
  /**
   * Concatena nombre, apellido paterno y materno (si existe) para formar el nombre completo.
   * @param empleado - Objeto empleado.
   * @returns Nombre completo como string.
   */
  const getFullName = (empleado: Empleado) =>
    `${empleado.nombre} ${empleado.apellido_p} ${empleado.apellido_m || ''}`.trim();

  // -----------------------------------------------------------------
  // Retorno del hook
  // -----------------------------------------------------------------
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
