// ============================================
// ARCHIVO: Tutores.tsx
// Módulo: Tutores
// Descripción: Página principal que muestra la lista de tutores en una tabla paginada,
//              permite filtrar localmente, y ofrece un modal para crear/editar tutores.
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
  User,
  Phone,
  Mail,
  HeartHandshake,
} from 'lucide-react';
import {useTutorForm} from '../hooks/useTutorForm';
import {TableRegisters, ColumnConfig} from '../components/TableRegisters';
import {ModalForm, TextFieldConfig, SelectFieldConfig} from '../components/ModalForm';
import {Tutor, TipoRelacion, CreateTutorInput} from '../interfaces/tutor.interface';

// -------------------------------------------------------------------
// Configuración de columnas para la tabla de tutores
// -------------------------------------------------------------------
const tutorColumns: ColumnConfig<Tutor>[] = [
  {
    key: 'nombre_completo',
    header: 'Nombre Completo',
    render: (t) => `${t.nombre} ${t.apellido_p} ${t.apellido_m || ''}`.trim(),
    className: 'font-medium',
  },
  {
    key: 'relacion',
    header: 'Relación',
    render: (t) => (
      <span className="stat-badge bg-muted text-muted-foreground">{t.relacion}</span>
    ),
  },
  {key: 'telefono_principal', header: 'Teléfono Principal', className: 'text-muted-foreground'},
  {key: 'email', header: 'Email', className: 'text-muted-foreground'},
];

// -------------------------------------------------------------------
// Configuración de campos de texto para el modal de tutores
// -------------------------------------------------------------------
const tutorTextFields: TextFieldConfig<CreateTutorInput>[] = [
  {name: 'nombre', label: 'Nombre', icon: User, placeholder: 'Juan', required: true},
  {name: 'apellido_p', label: 'Apellido Paterno', icon: User, placeholder: 'Pérez', required: true},
  {name: 'apellido_m', label: 'Apellido Materno', icon: User, placeholder: 'García', required: true},
  {name: 'telefono_principal', label: 'Teléfono Principal', icon: Phone, placeholder: '555-1234', required: true},
  {name: 'telefono_emergencia', label: 'Teléfono de Emergencia', icon: Phone, placeholder: '555-5678', required: true},
  {name: 'email', label: 'Email', icon: Mail, placeholder: 'tutor@email.com', required: true, type: 'email'},
];

// -------------------------------------------------------------------
// Configuración de campos select para el modal de tutores
// -------------------------------------------------------------------
const tutorSelectFields: SelectFieldConfig<CreateTutorInput>[] = [
  {
    name: 'relacion',
    label: 'Relación con el Alumno',
    options: Object.values(TipoRelacion),
    required: true,
  },
];

export const Tutores = () => {
  const {
    tutores,
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
  } = useTutorForm();

  const [search, setSearch] = useState('');

  // Filtro local sobre la página actual
  const filtered = tutores.filter((t) =>
    [t.nombre, t.apellido_p, t.telefono_principal, t.email].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Encabezado */}
      <div className="page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <HeartHandshake className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Tutores</h1>
            <p className="text-sm text-muted-foreground">
              {tutores.length} registros en esta página
            </p>
          </div>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 glow-gold">
          <Plus className="h-4 w-4" /> Nuevo Tutor
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
          columns={tutorColumns}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          getId={(t) => t.id_tutor}
          emptyMessage="No se encontraron tutores"
          emptyIcon={HeartHandshake}
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
        title={isEditing ? 'Editar Tutor' : 'Nuevo Tutor'}
        description={
          isEditing ? 'Modifica los datos del tutor' : 'Registra un nuevo tutor'
        }
        textFields={tutorTextFields}
        selectFields={tutorSelectFields}
        headerIcon={HeartHandshake}
      />
    </div>
  );
};
