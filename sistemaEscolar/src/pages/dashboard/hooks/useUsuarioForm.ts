import {useState, useEffect, useReducer} from 'react';
import {useUsuarioApi} from './useUsuarioApi';
import {useEmpleadoApi} from './useEmpleadoApi';
import {useAlumnoApi} from './useAlumnoApi';
import {useTutorApi} from './useTutorApi';
import {useRolApi} from './useRolApi';
import {
  Usuario,
  CreateUsuarioInput,
  UpdateUsuarioInput,
} from '../interfaces/usuario.interface';
import {Empleado} from '../interfaces/empleado.interface';
import {Alumno} from '../interfaces/alumno.interface';
import {Tutor} from '../interfaces/tutor.interface';
import {Rol} from '../interfaces/rol.interface';

const DEFAULT_AVATAR = 'https://via.placeholder.com/150?text=Avatar';

const INITIAL_STATE: CreateUsuarioInput = {
  username: '',
  password_hash: '',
  rol_id: 0,
  empleado_id: null,
  alumno_id: null,
  tutor_id: null,
  avatar_url: DEFAULT_AVATAR,
  ultimo_acceso: new Date().toISOString().split('T')[0],
  activo: true,
};

type FormAction =
  | {type: 'SET_FIELD'; field: keyof CreateUsuarioInput; value: any}
  | {type: 'SET_FORM'; payload: CreateUsuarioInput}
  | {type: 'RESET'};

const formReducer = (state: CreateUsuarioInput, action: FormAction): CreateUsuarioInput => {
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

export type SelectorType = 'empleado' | 'alumno' | 'tutor' | null;

export const useUsuarioForm = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState<SelectorType>(null);
  const [editing, setEditing] = useState<Usuario | null>(null);
  const [form, dispatch] = useReducer(formReducer, INITIAL_STATE);
  const [selectedEmpleadoNombre, setSelectedEmpleadoNombre] = useState<string>('');
  const [selectedAlumnoNombre, setSelectedAlumnoNombre] = useState<string>('');
  const [selectedTutorNombre, setSelectedTutorNombre] = useState<string>('');
  const [roles, setRoles] = useState<Rol[]>([]);

  const api = useUsuarioApi();
  const empleadoApi = useEmpleadoApi();
  const alumnoApi = useAlumnoApi();
  const tutorApi = useTutorApi();
  const rolApi = useRolApi();

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await rolApi.getRoles();
        setRoles(data);
      } catch (error) {
        console.error('Error al cargar roles:', error);
      }
    };
    loadRoles();
  }, []);

  // Función para enriquecer usuarios con datos de relaciones
  const enrichUsuarios = async (usuariosData: Usuario[]): Promise<Usuario[]> => {
    const enriched = await Promise.all(
      usuariosData.map(async (usuario) => {
        // Obtener rol
        if (usuario.rol_id) {
          try {
            const rol = await rolApi.getRol(usuario.rol_id);
            if (rol) usuario.rol = rol;
          } catch (error) {
            console.warn(`No se pudo cargar el rol ${usuario.rol_id}:`, error);
          }
        }
        // Obtener empleado
        if (usuario.empleado_id) {
          try {
            const empleado = await empleadoApi.getEmpleado(usuario.empleado_id);
            if (empleado) usuario.empleado = empleado;
          } catch (error) {
            console.warn(`No se pudo cargar el empleado ${usuario.empleado_id}:`, error);
          }
        }
        // Obtener alumno
        if (usuario.alumno_id) {
          try {
            const alumno = await alumnoApi.getAlumno(usuario.alumno_id);
            if (alumno) usuario.alumno = alumno;
          } catch (error) {
            console.warn(`No se pudo cargar el alumno ${usuario.alumno_id}:`, error);
          }
        }
        // Obtener tutor
        if (usuario.tutor_id) {
          try {
            const tutor = await tutorApi.getTutor(usuario.tutor_id);
            if (tutor) usuario.tutor = tutor;
          } catch (error) {
            console.warn(`No se pudo cargar el tutor ${usuario.tutor_id}:`, error);
          }
        }
        return usuario;
      })
    );
    return enriched;
  };

  const fetchUsuarios = async (currentPage: number = page) => {
    try {
      const data = await api.getUsuariosPaginate(currentPage, limit);
      const enrichedData = await enrichUsuarios(data);
      setUsuarios(enrichedData);
      setHasMore(data.length === limit);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  useEffect(() => {
    fetchUsuarios(1);
  }, []);

  const nextPage = () => {
    if (hasMore) {
      const next = page + 1;
      setPage(next);
      fetchUsuarios(next);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      const prev = page - 1;
      setPage(prev);
      fetchUsuarios(prev);
    }
  };

  const goToPage = (newPage: number) => {
    if (newPage > 0 && (newPage <= page || hasMore)) {
      setPage(newPage);
      fetchUsuarios(newPage);
    }
  };

  const setField = (field: keyof CreateUsuarioInput, value: any) => {
    dispatch({type: 'SET_FIELD', field, value});
  };

  const reset = () => {
    dispatch({type: 'RESET'});
    setEditing(null);
    setOpen(false);
    setSelectedEmpleadoNombre('');
    setSelectedAlumnoNombre('');
    setSelectedTutorNombre('');
  };

  const isValid = () => {
    if (!editing && form.password_hash.trim() === '') return false;
    return (
      form.username.trim() !== '' &&
      form.rol_id !== 0
    );
  };

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setField('avatar_url', DEFAULT_AVATAR);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setField('avatar_url', base64);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenModal = async (usuario?: Usuario) => {
    if (usuario) {
      const payload: CreateUsuarioInput = {
        username: usuario.username,
        password_hash: '',
        rol_id: usuario.rol_id,
        empleado_id: usuario.empleado_id ?? null,
        alumno_id: usuario.alumno_id ?? null,
        tutor_id: usuario.tutor_id ?? null,
        avatar_url: usuario.avatar_url || DEFAULT_AVATAR,
        ultimo_acceso: usuario.ultimo_acceso,
        activo: usuario.activo,
      };
      dispatch({type: 'SET_FORM', payload});
      setEditing(usuario);

      if (usuario.empleado_id) {
        try {
          const emp = await empleadoApi.getEmpleado(usuario.empleado_id);
          if (emp) setSelectedEmpleadoNombre(
            `${emp.nombre} ${emp.apellido_p} ${emp.apellido_m || ''}`.trim()
          );
        } catch {setSelectedEmpleadoNombre(`ID: ${usuario.empleado_id}`);}
      }
      if (usuario.alumno_id) {
        try {
          const alu = await alumnoApi.getAlumno(usuario.alumno_id);
          if (alu) setSelectedAlumnoNombre(
            `${alu.nombre} ${alu.apellido_p} ${alu.apellido_m || ''}`.trim()
          );
        } catch {setSelectedAlumnoNombre(`ID: ${usuario.alumno_id}`);}
      }
      if (usuario.tutor_id) {
        try {
          const tut = await tutorApi.getTutor(usuario.tutor_id);
          if (tut) setSelectedTutorNombre(
            `${tut.nombre} ${tut.apellido_p} ${tut.apellido_m || ''}`.trim()
          );
        } catch {setSelectedTutorNombre(`ID: ${usuario.tutor_id}`);}
      }
      setOpen(true);
    } else {
      dispatch({type: 'RESET'});
      setEditing(null);
      setSelectedEmpleadoNombre('');
      setSelectedAlumnoNombre('');
      setSelectedTutorNombre('');
      setOpen(true);
    }
  };

  // Exclusión mutua
  const handleSelectEmpleado = (empleado: Empleado) => {
    setField('empleado_id', empleado.id_empleado);
    setField('alumno_id', null);
    setField('tutor_id', null);
    setSelectedEmpleadoNombre(
      `${empleado.nombre} ${empleado.apellido_p} ${empleado.apellido_m || ''}`.trim()
    );
    setSelectedAlumnoNombre('');
    setSelectedTutorNombre('');
    setSelectorOpen(null);
  };

  const handleSelectAlumno = (alumno: Alumno) => {
    setField('alumno_id', alumno.id_alumno);
    setField('empleado_id', null);
    setField('tutor_id', null);
    setSelectedAlumnoNombre(
      `${alumno.nombre} ${alumno.apellido_p} ${alumno.apellido_m || ''}`.trim()
    );
    setSelectedEmpleadoNombre('');
    setSelectedTutorNombre('');
    setSelectorOpen(null);
  };

  const handleSelectTutor = (tutor: Tutor) => {
    setField('tutor_id', tutor.id_tutor);
    setField('empleado_id', null);
    setField('alumno_id', null);
    setSelectedTutorNombre(
      `${tutor.nombre} ${tutor.apellido_p} ${tutor.apellido_m || ''}`.trim()
    );
    setSelectedEmpleadoNombre('');
    setSelectedAlumnoNombre('');
    setSelectorOpen(null);
  };

  const handleClearEmpleado = () => {
    setField('empleado_id', null);
    setSelectedEmpleadoNombre('');
  };

  const handleClearAlumno = () => {
    setField('alumno_id', null);
    setSelectedAlumnoNombre('');
  };

  const handleClearTutor = () => {
    setField('tutor_id', null);
    setSelectedTutorNombre('');
  };

  const handleCloseModal = () => {
    reset();
  };

  const handleOpenSelector = (type: SelectorType) => setSelectorOpen(type);
  const handleCloseSelector = () => setSelectorOpen(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) return;

    if (!form.username.trim()) {
      alert('El username es obligatorio');
      return;
    }

    const inputParaEnvio = {
      username: form.username.trim(),
      password_hash: form.password_hash,
      rol_id: Number(form.rol_id),
      empleado_id: form.empleado_id ? Number(form.empleado_id) : null,
      alumno_id: form.alumno_id ? Number(form.alumno_id) : null,
      tutor_id: form.tutor_id ? Number(form.tutor_id) : null,
      avatar_url: form.avatar_url || DEFAULT_AVATAR,
      ultimo_acceso: form.ultimo_acceso,
      activo: form.activo,
    };

    console.log('Payload a enviar:', inputParaEnvio);

    try {
      if (editing) {
        const usuarioId = Number(editing.id_usuario);
        const input: UpdateUsuarioInput = {...inputParaEnvio, id_usuario: usuarioId};
        if (!input.password_hash) delete input.password_hash;
        await api.updateUsuario(usuarioId, input);
      } else {
        await api.createUsuario(inputParaEnvio);
      }

      setPage(1);
      await fetchUsuarios(1);
      handleCloseModal();
    } catch (error: any) {
      console.error('Error en la operación:', error);
      alert('Ocurrió un error al guardar el usuario. Revisa la consola.');
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    const usuarioId = Number(id);
    try {
      const success = await api.removeUsuario(usuarioId);
      if (success) {
        await fetchUsuarios(page);
        if (usuarios.length === 0 && page > 1) {
          setPage(page - 1);
          await fetchUsuarios(page - 1);
        }
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('No se pudo eliminar el usuario.');
    }
  };

  return {
    usuarios,
    loading: api.loading,
    error: api.error,
    form,
    open,
    selectorOpen,
    editing,
    page,
    hasMore,
    roles,
    selectedEmpleadoNombre,
    selectedAlumnoNombre,
    selectedTutorNombre,
    setField,
    isValid,
    handleOpenModal,
    handleCloseModal,
    handleSelectEmpleado,
    handleSelectAlumno,
    handleSelectTutor,
    handleClearEmpleado,
    handleClearAlumno,
    handleClearTutor,
    handleOpenSelector,
    handleCloseSelector,
    handleSubmit,
    handleDelete,
    handleImageChange,
    isEditing: !!editing,
    nextPage,
    prevPage,
    goToPage,
  };
};
