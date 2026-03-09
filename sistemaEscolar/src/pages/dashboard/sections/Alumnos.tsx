// ============================================
// ARCHIVO: Alumnos.tsx
// Módulo: Alumnos
// Descripción: Página principal que muestra la lista de alumnos en una tabla paginada,
//              permite filtrar localmente, y ofrece un modal para crear/editar alumnos.
// ============================================

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Users,
  Hash,
  User,
  Mail,
  MapPin,
  Droplet,
  Calendar,
  Activity,
} from 'lucide-react';
import {useAlumnoForm} from '../hooks/useAlumnoForm';
import {TableRegisters, ColumnConfig} from '../components/TableRegisters';
import {ModalForm, TextFieldConfig, SelectFieldConfig} from '../components/ModalForm';
import {Alumno, Genero, TipoSangre, CreateAlumnoInput} from '../interfaces/alumno.interface';

// -------------------------------------------------------------------
// Configuración de columnas para la tabla de alumnos
// -------------------------------------------------------------------
const alumnoColumns: ColumnConfig<Alumno>[] = [
  {key: 'matricula', header: 'Matrícula', className: 'font-medium'},
  {
    key: 'nombre_completo',
    header: 'Nombre Completo',
    render: (a) => `${a.nombre} ${a.apellido_p} ${a.apellido_m || ''}`.trim(),
    className: 'font-medium',
  },
  {key: 'email_institucional', header: 'Email', className: 'text-muted-foreground text-sm'},
  {key: 'curp', header: 'CURP', className: 'text-muted-foreground text-sm'},
  {
    key: 'activo',
    header: 'Activo',
    render: (a) => (
      <span
        className={`stat-badge ${a.activo ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${a.activo ? 'bg-success' : 'bg-destructive'}`} />
        {a.activo ? 'Activo' : 'Inactivo'}
      </span>
    ),
  },
];

// -------------------------------------------------------------------
// Configuración de campos de texto para el modal de alumnos
// -------------------------------------------------------------------
const alumnoTextFields: TextFieldConfig<CreateAlumnoInput>[] = [
  {name: 'matricula', label: 'Matrícula', icon: Hash, placeholder: 'A001', required: true},
  {name: 'nombre', label: 'Nombre', icon: User, placeholder: 'Juan', required: true},
  {name: 'apellido_p', label: 'Apellido Paterno', icon: User, placeholder: 'Pérez', required: true},
  {name: 'apellido_m', label: 'Apellido Materno', icon: User, placeholder: 'García', required: true},
  {name: 'curp', label: 'CURP', icon: Hash, placeholder: 'XXXX000101HTSRLN00', required: true},
  {name: 'email_institucional', label: 'Email Institucional', icon: Mail, placeholder: 'alumno@escuela.edu', required: true, type: 'email'},
  {name: 'direccion', label: 'Dirección', icon: MapPin, placeholder: 'Calle #123', required: true},
  {name: 'alergias', label: 'Alergias', icon: Activity, placeholder: 'Ninguna', required: true},
  {name: 'condiciones_medicas', label: 'Condiciones Médicas', icon: Activity, placeholder: 'Ninguna', required: true},
  {name: 'fecha_ingreso', label: 'Fecha de Ingreso', icon: Calendar, type: 'date', required: true},
];

// -------------------------------------------------------------------
// Configuración de campos select para el modal de alumnos
// -------------------------------------------------------------------
const alumnoSelectFields: SelectFieldConfig<CreateAlumnoInput>[] = [
  {
    name: 'genero',
    label: 'Género',
    options: Object.values(Genero),
    required: true,
  },
  {
    name: 'tipo_sangre',
    label: 'Tipo de Sangre',
    options: Object.values(TipoSangre),
    required: true,
  },
  {
    name: 'activo',
    label: 'Activo',
    options: ['true', 'false'],
    mapValue: (v: string) => v === 'true',
    required: false,
    displayLabel: (opt) => (opt === 'true' ? 'Activo' : 'Inactivo'),
  },
];

export const Alumnos = () => {
  const {
    alumnos,
    loading,
    error,
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
  } = useAlumnoForm();

  const [search, setSearch] = useState('');

  // Filtro local sobre la página actual
  const filtered = alumnos.filter((a) =>
    [a.matricula, a.nombre, a.apellido_p, a.curp, a.email_institucional].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
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
            <h1 className="text-2xl font-display font-bold">Alumnos</h1>
            <p className="text-sm text-muted-foreground">
              {alumnos.length} registros en esta página · {alumnos.filter((a) => a.activo).length} activos
            </p>
          </div>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 glow-gold">
          <Plus className="h-4 w-4" /> Nuevo Alumno
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
          columns={alumnoColumns}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          getId={(a) => a.id_alumno}
          emptyMessage="No se encontraron alumnos"
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

      {/* Modal para crear/editar */}
      <ModalForm
        open={open}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        form={form}
        setField={setField}
        isValid={isValid}
        isEditing={isEditing}
        loading={loading}
        title={isEditing ? 'Editar Alumno' : 'Nuevo Alumno'}
        description={
          isEditing ? 'Modifica los datos del alumno' : 'Registra un nuevo alumno'
        }
        textFields={alumnoTextFields}
        selectFields={alumnoSelectFields}
        headerIcon={Users}
      />
    </div>
  );
};
