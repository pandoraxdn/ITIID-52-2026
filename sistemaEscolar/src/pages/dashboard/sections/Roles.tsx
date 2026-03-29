// ============================================
// ARCHIVO: Roles.tsx
// Módulo: Roles
// Descripción: Página principal que muestra la lista de roles en una tabla paginada,
//              permite filtrar localmente, y ofrece un modal para crear/editar roles.
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
  Tag,
  FileText,
  FileUser
} from 'lucide-react';
import {useRolForm} from '../hooks/useRolForm';
import type { ColumnConfig } from '../components/TableRegisters'
import { TableRegisters } from '../components/TableRegisters';
import type { TextFieldConfig } from '../components/ModalForm'
import { ModalForm } from '../components/ModalForm';
import type { Rol, CreateRolInput } from '../interfaces/rol.interface';

// -------------------------------------------------------------------
// Configuración de columnas para la tabla de roles
// No se muestra el ID (id_rol) porque no es relevante para el usuario,
// pero se usa internamente para las acciones de editar/eliminar.
// -------------------------------------------------------------------
const rolColumns: ColumnConfig<Rol>[] = [
  {key: 'nombre', header: 'Nombre', className: 'font-medium'},
  {key: 'descripcion', header: 'Descripción', className: 'text-muted-foreground'},
];

// -------------------------------------------------------------------
// Configuración de campos de texto para el modal de roles
// -------------------------------------------------------------------
const rolTextFields: TextFieldConfig<CreateRolInput>[] = [
  {
    name: 'nombre',
    label: 'Nombre del Rol',
    icon: Tag,
    placeholder: 'Ej: Administrador',
    required: true,
  },
  {
    name: 'descripcion',
    label: 'Descripción',
    icon: FileText,
    placeholder: 'Descripción del rol...',
    required: true,
  },
];

export const Roles = () => {
  const {
    roles,
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
  } = useRolForm();

  const [search, setSearch] = useState('');

  // Filtro local sobre la página actual
  const filtered = roles.filter((r) =>
    [r.nombre, r.descripcion].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Encabezado */}
      <div className="page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <FileUser className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Roles</h1>
            <p className="text-sm text-muted-foreground">
              {roles.length} registros en esta página
            </p>
          </div>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 glow-gold">
          <Plus className="h-4 w-4" /> Nuevo Rol
        </Button>
      </div>

      {/* Buscador */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o descripción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-pro"
        />
      </div>

      {/* Tabla de roles */}
      <div className="glass-card rounded-xl overflow-hidden">
        <TableRegisters
          data={filtered}
          columns={rolColumns}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          getId={(r) => r.id_rol} // El ID se usa internamente para acciones, no se muestra en la tabla
          emptyMessage="No se encontraron roles"
          emptyIcon={Tag}
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

      {/* Modal para crear/editar roles */}
      <ModalForm
        open={open}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        form={form}
        setField={setField}
        isValid={isValid}
        isEditing={isEditing}
        loading={loading}
        title={isEditing ? 'Editar Rol' : 'Nuevo Rol'}
        description={
          isEditing ? 'Modifica los datos del rol' : 'Registra un nuevo rol'
        }
        textFields={rolTextFields}
        selectFields={[]} // Este módulo no utiliza campos select
        headerIcon={Users}
      />
    </div>
  );
};
