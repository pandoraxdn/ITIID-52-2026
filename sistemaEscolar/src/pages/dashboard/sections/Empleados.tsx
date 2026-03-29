import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Hash,
  IdCardIcon,
  Mail,
  Phone,
  Plus,
  Search,
  User,
  Users
} from 'lucide-react';
import {useEmpleadoForm} from '../hooks/useEmpleadoForm';
import type { ColumnConfig } from '../components/TableRegisters'
import { TableRegisters } from '../components/TableRegisters';
import type { TextFieldConfig, SelectFieldConfig } from '../components/ModalForm'
import { ModalForm } from '../components/ModalForm';
import type { Empleado, CreateEmpleadoInput } from '../interfaces/empleado.interface'
import { TipoEmpleado, TipoPuesto } from '../interfaces/empleado.interface';

const empleadoColumns: ColumnConfig<Empleado>[] = [
  {key: 'numero_empleado', header: 'N° Empleado', className: 'font-medium'},
  {
    key: 'nombre_completo',
    header: 'Nombre Completo',
    render: (e) => `${e.nombre} ${e.apellido_p} ${e.apellido_m || ''}`.trim(),
    className: 'font-medium',
  },
  {key: 'email_institucional', header: 'Email Institucional', className: 'text-muted-foreground text-sm'},
  {key: 'telefono', header: 'Teléfono', className: 'text-muted-foreground text-sm'},
  {
    key: 'tipo_empleado',
    header: 'Tipo',
    render: (e) => <span className="stat-badge bg-muted text-muted-foreground">{e.tipo_empleado}</span>,
  },
  {
    key: 'puesto',
    header: 'Puesto',
    render: (e) => <span className="stat-badge bg-muted text-muted-foreground">{e.puesto}</span>,
  },
  {key: 'departamento', header: 'Departamento'},
  {
    key: 'activo',
    header: 'Activo',
    render: (e) => (
      <span className={`stat-badge ${e.activo ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${e.activo ? 'bg-success' : 'bg-destructive'}`} />
        {e.activo ? 'Activo' : 'Inactivo'}
      </span>
    ),
  },
];

// Configuración de campos de texto para el modal
const empleadoTextFields: TextFieldConfig<CreateEmpleadoInput>[] = [
  {name: 'numero_empleado', label: 'Número de Empleado', icon: Hash, placeholder: 'EMP-001', required: true},
  {name: 'nombre', label: 'Nombre', icon: User, placeholder: 'Juan', required: true},
  {name: 'apellido_p', label: 'Apellido Paterno', icon: User, placeholder: 'Pérez', required: true},
  {name: 'apellido_m', label: 'Apellido Materno', icon: User, placeholder: 'García', required: true},
  {name: 'email_personal', label: 'Email Personal', icon: Mail, placeholder: 'personal@email.com', required: true, type: 'email'},
  {name: 'email_institucional', label: 'Email Institucional', icon: Mail, placeholder: 'institucional@escuela.edu', required: true, type: 'email'},
  {name: 'telefono', label: 'Teléfono', icon: Phone, placeholder: '555-1234', required: true},
  {name: 'departamento', label: 'Departamento', icon: Briefcase, placeholder: 'Ventas', required: true},
  {name: 'fecha_contratacion', label: 'Fecha Contratación', icon: Calendar, type: 'date', required: true},
];

// Configuración de campos de selección para el modal
const empleadoSelectFields: SelectFieldConfig<CreateEmpleadoInput>[] = [
  {name: 'tipo_empleado', label: 'Tipo Empleado', options: Object.values(TipoEmpleado), required: true},
  {name: 'puesto', label: 'Puesto', options: Object.values(TipoPuesto), required: true},
  {
    name: 'activo',
    label: 'Activo',
    options: ['true', 'false'],
    mapValue: (v: string) => v === 'true',
    required: false,
    displayLabel: (opt) => opt === 'true' ? 'Activo' : 'Inactivo',
  },
];

export const Empleados = () => {
  const {
    empleados,
    loading,
    form,
    open,
    page,
    hasMore,
    setField,
    isValid,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    isEditing,
    nextPage,
    prevPage,
  } = useEmpleadoForm();

  const [search, setSearch] = useState('');

  // Filtro local (sobre la página actual)
  const filtered = empleados.filter(e =>
    [e.nombre, e.apellido_p, e.apellido_m, e.numero_empleado, e.email_institucional, e.departamento]
      .some(field => field?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <IdCardIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Empleados</h1>
            <p className="text-sm text-muted-foreground">
              {empleados.length} registros en esta página · {empleados.filter(e => e.activo).length} activos
            </p>
          </div>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 glow-gold">
          <Plus className="h-4 w-4" /> Nuevo Empleado
        </Button>
      </div>

      {/* Búsqueda */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar en esta página..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-pro"
        />
      </div>

      {/* Tabla genérica */}
      <div className="glass-card rounded-xl overflow-hidden">
        <TableRegisters
          data={filtered}
          columns={empleadoColumns}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          getId={(e) => e.id_empleado}
          emptyMessage="No se encontraron empleados"
          loading={loading}
          actions={true}
        />
      </div>

      {/* Controles de paginación */}
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
        <span className="text-sm text-muted-foreground">
          Página {page}
        </span>
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

      {/* Modal genérico */}
      <ModalForm
        open={open}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        form={form}
        setField={setField}
        isValid={isValid}
        isEditing={isEditing}
        loading={loading}
        title={isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
        description={isEditing ? 'Modifica los datos del empleado' : 'Registra un nuevo empleado'}
        textFields={empleadoTextFields}
        selectFields={empleadoSelectFields}
        headerIcon={Users}
      />
    </div>
  );
};
