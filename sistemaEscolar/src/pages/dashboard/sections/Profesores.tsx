import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {ChevronLeft, ChevronRight, Plus, Search, Users, GraduationCap, FileText, UserCheck, IdCardIcon} from 'lucide-react';
import {useProfesorForm} from '../hooks/useProfesorForm';
import {TableRegisters, ColumnConfig} from '../components/TableRegisters';
import {ModalForm, TextFieldConfig, SelectFieldConfig} from '../components/ModalForm';
import {SelectorRegister} from '../components/SelectorRegister';
import {useEmpleadoApi} from '../hooks/useEmpleadoApi';
import {Empleado} from '../interfaces/empleado';
import {Profesor, TipoNivelEstudio, CreateProfesorInput} from '../interfaces/profesor.interface';

// Columnas para la tabla de profesores (sin ID)
const profesorColumns: ColumnConfig<Profesor>[] = [
  {
    key: 'empleado',
    header: 'Empleado',
    render: (p) =>
      p.empleado
        ? `${p.empleado.nombre} ${p.empleado.apellido_p} ${p.empleado.apellido_m || ''}`.trim()
        : `ID: ${p.empleado_id}`,
  },
  {key: 'especialidad', header: 'Especialidad'},
  {
    key: 'nivel_estudios',
    header: 'Nivel',
    render: (p) => (
      <span className="stat-badge bg-muted text-muted-foreground">{p.nivel_estudios}</span>
    ),
  },
  {key: 'cedula_profesional', header: 'Cédula'},
];

// Columnas para el selector de empleados
const empleadoColumns: ColumnConfig<Empleado>[] = [
  {key: 'numero_empleado', header: 'N° Empleado'},
  {
    key: 'nombre_completo',
    header: 'Nombre',
    render: (e) => `${e.nombre} ${e.apellido_p} ${e.apellido_m || ''}`.trim(),
  },
  {key: 'email_institucional', header: 'Email'},
];

const textFields: TextFieldConfig<CreateProfesorInput>[] = [
  {
    name: 'especialidad',
    label: 'Especialidad',
    icon: GraduationCap,
    placeholder: 'Matemáticas',
    required: true,
  },
  {
    name: 'cedula_profesional',
    label: 'Cédula Profesional',
    icon: FileText,
    placeholder: '12345678',
    required: true,
  },
];

const selectFields: SelectFieldConfig<CreateProfesorInput>[] = [
  {
    name: 'nivel_estudios',
    label: 'Nivel de Estudios',
    options: Object.values(TipoNivelEstudio),
    required: true,
  },
];

export const Profesores = () => {
  const {
    profesores,
    loading,
    form,
    open,
    selectorOpen,
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
    isEditing,
    nextPage,
    prevPage,
    selectedEmpleadoNombre,
  } = useProfesorForm();

  const {getEmpleadosPaginate} = useEmpleadoApi();
  const [search, setSearch] = useState('');

  const filtered = profesores.filter((p) =>
    [p.especialidad, p.cedula_profesional].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <UserCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Profesores</h1>
            <p className="text-sm text-muted-foreground">
              {profesores.length} registros en esta página
            </p>
          </div>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 glow-gold">
          <Plus className="h-4 w-4" /> Nuevo Profesor
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por especialidad o cédula..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-pro"
        />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <TableRegisters
          data={filtered}
          columns={profesorColumns}
          onEdit={(prof) => handleOpenModal(prof)}
          onDelete={(id) => handleDelete(id)}
          getId={(p) => p.id_profesor}
          emptyMessage="No se encontraron profesores"
          loading={loading}
        />
      </div>

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

      {/* Selector de empleado */}
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
          columns={empleadoColumns}
          getId={(e) => e.id_empleado}
          searchFields={['nombre', 'apellido_p', 'numero_empleado', 'email_institucional']}
          emptyMessage="No hay empleados registrados"
          createPath="/dashboard/empleados"
        />
      )}

      {/* Modal de profesor */}
      <ModalForm
        open={open}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        form={form}
        setField={setField}
        isValid={isValid}
        isEditing={isEditing}
        loading={loading}
        title={isEditing ? 'Editar Profesor' : 'Nuevo Profesor'}
        description={
          isEditing
            ? 'Modifica los datos del profesor'
            : 'Completa los datos y selecciona un empleado'
        }
        textFields={textFields}
        selectFields={selectFields}
        headerIcon={Users}
      >
        {/* Campo personalizado para seleccionar empleado */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-section col-span-2">
            <Label>Empleado *</Label>
            <div className="flex gap-2">
              <Input
                value={
                  selectedEmpleadoNombre ||
                  (form.empleado_id ? `ID: ${form.empleado_id}` : 'Ningún empleado seleccionado')
                }
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
            {!form.empleado_id && (
              <p className="text-xs text-destructive mt-1">Debes seleccionar un empleado</p>
            )}
          </div>
        </div>
      </ModalForm>
    </div>
  );
};
