import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Users,
  User,
  Key,
} from 'lucide-react';
import {useUsuarioForm} from '../hooks/useUsuarioForm';
import type { ColumnConfig } from '../components/TableRegisters'
import { TableRegisters } from '../components/TableRegisters';
import type { TextFieldConfig, SelectFieldConfig } from '../components/ModalForm'
import { ModalForm } from '../components/ModalForm';
import {SelectorRegister} from '../components/SelectorRegister';
import {useEmpleadoApi} from '../hooks/useEmpleadoApi';
import {useAlumnoApi} from '../hooks/useAlumnoApi';
import {useTutorApi} from '../hooks/useTutorApi';
import type { Empleado } from '../interfaces/empleado.interface';
import type { Alumno } from '../interfaces/alumno.interface';
import type { Tutor } from '../interfaces/tutor.interface';
import type { Usuario, CreateUsuarioInput } from '../interfaces/usuario.interface';

// Función auxiliar para formatear nombre completo
const formatNombreCompleto = (
  nombre?: string,
  apellido_p?: string,
  apellido_m?: string
): string => {
  if (!nombre && !apellido_p) return '-';
  return `${nombre || ''} ${apellido_p || ''} ${apellido_m || ''}`.trim().replace(/\s+/g, ' ');
};

// Columnas de la tabla (sin cambios)
const usuarioColumns: ColumnConfig<Usuario>[] = [
  {key: 'username', header: 'Username', className: 'font-medium'},
  {
    key: 'rol',
    header: 'Rol',
    render: (u) => u.rol?.nombre || `ID: ${u.rol_id}`,
  },
  {
    key: 'empleado',
    header: 'Empleado',
    render: (u) =>
      u.empleado
        ? formatNombreCompleto(u.empleado.nombre, u.empleado.apellido_p, u.empleado.apellido_m)
        : u.empleado_id
          ? `ID: ${u.empleado_id}`
          : '-',
  },
  {
    key: 'alumno',
    header: 'Alumno',
    render: (u) =>
      u.alumno
        ? formatNombreCompleto(u.alumno.nombre, u.alumno.apellido_p, u.alumno.apellido_m)
        : u.alumno_id
          ? `ID: ${u.alumno_id}`
          : '-',
  },
  {
    key: 'tutor',
    header: 'Tutor',
    render: (u) =>
      u.tutor
        ? formatNombreCompleto(u.tutor.nombre, u.tutor.apellido_p, u.tutor.apellido_m)
        : u.tutor_id
          ? `ID: ${u.tutor_id}`
          : '-',
  },
  {
    key: 'activo',
    header: 'Activo',
    render: (u) => (
      <span
        className={`stat-badge ${u.activo ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${u.activo ? 'bg-success' : 'bg-destructive'}`} />
        {u.activo ? 'Activo' : 'Inactivo'}
      </span>
    ),
  },
];

export const Usuarios = () => {
  const {
    usuarios,
    loading,
    form,
    open,
    selectorOpen,
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
    isEditing,
    nextPage,
    prevPage,
  } = useUsuarioForm();

  const {getEmpleadosPaginate} = useEmpleadoApi();
  const {getAlumnosPaginate} = useAlumnoApi();
  const {getTutoresPaginate} = useTutorApi();

  const [search, setSearch] = useState('');

  // Definición dinámica de campos de texto (la contraseña es opcional en edición)
  const usuarioTextFields: TextFieldConfig<CreateUsuarioInput>[] = [
    {
      name: 'username',
      label: 'Username',
      icon: User,
      placeholder: 'ej. jperez',
      required: true,
    },
    {
      name: 'password_hash',
      label: 'Contraseña',
      icon: Key,
      placeholder: '********',
      required: !isEditing, // Solo requerido en creación
      type: 'password',
    },
  ];

  const usuarioSelectFields: SelectFieldConfig<CreateUsuarioInput>[] = [];

  const filtered = usuarios.filter((u) =>
    [
      u.username,
      u.rol?.nombre,
      u.empleado ? `${u.empleado.nombre} ${u.empleado.apellido_p}` : '',
      u.alumno ? `${u.alumno.nombre} ${u.alumno.apellido_p}` : '',
      u.tutor ? `${u.tutor.nombre} ${u.tutor.apellido_p}` : '',
    ].some((field) => field?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Encabezado */}
      <div className="page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Usuarios</h1>
            <p className="text-sm text-muted-foreground">
              {usuarios.length} registros en esta página · {usuarios.filter((u) => u.activo).length} activos
            </p>
          </div>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 glow-gold">
          <Plus className="h-4 w-4" /> Nuevo Usuario
        </Button>
      </div>

      {/* Buscador */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar en esta página..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-pro"
        />
      </div>

      {/* Tabla */}
      <div className="glass-card rounded-xl overflow-hidden">
        <TableRegisters
          data={filtered}
          columns={usuarioColumns}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          getId={(u) => u.id_usuario}
          emptyMessage="No se encontraron usuarios"
          emptyIcon={Users}
          loading={loading}
          actions={true}
        />
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={prevPage}
          disabled={page === 1 || loading}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Anterior
        </Button>
        <span className="text-sm text-muted-foreground">Página {page}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={nextPage}
          disabled={!hasMore || loading}
          className="gap-2"
        >
          Siguiente <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Selectores de empleado, alumno, tutor */}
      {selectorOpen === 'empleado' && (
        <SelectorRegister<Empleado>
          open={true}
          onClose={handleCloseSelector}
          onSelect={handleSelectEmpleado}
          title="Seleccionar Empleado"
          fetchItems={async (page, limit) => {
            const data = await getEmpleadosPaginate(page, limit);
            return data;
          }}
          columns={[
            {key: 'numero_empleado', header: 'N° Empleado'},
            {key: 'nombre', header: 'Nombre', render: (e) => formatNombreCompleto(e.nombre, e.apellido_p, e.apellido_m)},
          ]}
          getId={(e) => e.id_empleado}
          searchFields={['nombre', 'apellido_p', 'numero_empleado']}
          emptyMessage="No hay empleados registrados"
          createPath="/dashboard/empleados"
        />
      )}

      {selectorOpen === 'alumno' && (
        <SelectorRegister<Alumno>
          open={true}
          onClose={handleCloseSelector}
          onSelect={handleSelectAlumno}
          title="Seleccionar Alumno"
          fetchItems={async (page, limit) => {
            const data = await getAlumnosPaginate(page, limit);
            return data;
          }}
          columns={[
            {key: 'matricula', header: 'Matrícula'},
            {key: 'nombre', header: 'Nombre', render: (a) => formatNombreCompleto(a.nombre, a.apellido_p, a.apellido_m)},
          ]}
          getId={(a) => a.id_alumno}
          searchFields={['nombre', 'apellido_p', 'matricula']}
          emptyMessage="No hay alumnos registrados"
          createPath="/dashboard/alumnos"
        />
      )}

      {selectorOpen === 'tutor' && (
        <SelectorRegister<Tutor>
          open={true}
          onClose={handleCloseSelector}
          onSelect={handleSelectTutor}
          title="Seleccionar Tutor"
          fetchItems={async (page, limit) => {
            const data = await getTutoresPaginate(page, limit);
            return data;
          }}
          columns={[
            {key: 'id_tutor', header: 'ID'},
            {key: 'nombre', header: 'Nombre', render: (t) => formatNombreCompleto(t.nombre, t.apellido_p, t.apellido_m)},
          ]}
          getId={(t) => t.id_tutor}
          searchFields={['nombre', 'apellido_p']}
          emptyMessage="No hay tutores registrados"
          createPath="/dashboard/tutores"
        />
      )}

      {/* Modal de usuario */}
      <ModalForm
        open={open}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        form={form}
        setField={setField}
        isValid={isValid}
        isEditing={isEditing}
        loading={loading}
        title={isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
        description={
          isEditing
            ? 'Modifica los datos del usuario (deja la contraseña vacía para no cambiarla)'
            : 'Completa los datos del nuevo usuario'
        }
        textFields={usuarioTextFields}
        selectFields={usuarioSelectFields}
        headerIcon={Users}
      >
        {/* Fila: Rol y Avatar */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-section">
            <Label>Rol *</Label>
            <select
              value={form.rol_id}
              onChange={(e) => setField('rol_id', Number(e.target.value))}
              className="w-full p-2 rounded-md border border-border bg-background"
              required
            >
              <option value={0}>Seleccione un rol</option>
              {roles.map((rol) => (
                <option key={rol.id_rol} value={rol.id_rol}>
                  {rol.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="form-section">
            <Label>Avatar</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
            />
            {form.avatar_url && (
              <div className="mt-2">
                <img src={form.avatar_url} alt="Avatar" className="h-20 w-20 rounded-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Fila: Activo (checkbox) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-section col-span-2">
            <Label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={(e) => setField('activo', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              Activo
            </Label>
          </div>
        </div>

        {/* Selector de Empleado */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-section col-span-2">
            <Label>Empleado (opcional)</Label>
            <div className="flex gap-2">
              <Input
                value={selectedEmpleadoNombre || (form.empleado_id ? `ID: ${form.empleado_id}` : 'Ninguno')}
                readOnly
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={handleClearEmpleado}>
                Limpiar
              </Button>
              <Button type="button" onClick={() => handleOpenSelector('empleado')}>
                Seleccionar
              </Button>
            </div>
          </div>
        </div>

        {/* Selector de Alumno */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-section col-span-2">
            <Label>Alumno (opcional)</Label>
            <div className="flex gap-2">
              <Input
                value={selectedAlumnoNombre || (form.alumno_id ? `ID: ${form.alumno_id}` : 'Ninguno')}
                readOnly
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={handleClearAlumno}>
                Limpiar
              </Button>
              <Button type="button" onClick={() => handleOpenSelector('alumno')}>
                Seleccionar
              </Button>
            </div>
          </div>
        </div>

        {/* Selector de Tutor */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-section col-span-2">
            <Label>Tutor (opcional)</Label>
            <div className="flex gap-2">
              <Input
                value={selectedTutorNombre || (form.tutor_id ? `ID: ${form.tutor_id}` : 'Ninguno')}
                readOnly
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={handleClearTutor}>
                Limpiar
              </Button>
              <Button type="button" onClick={() => handleOpenSelector('tutor')}>
                Seleccionar
              </Button>
            </div>
          </div>
        </div>
      </ModalForm>
    </div>
  );
};
