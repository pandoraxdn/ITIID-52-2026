// ============================================
// ARCHIVO: TableRegisters.tsx
// ============================================

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {Pencil, Trash2, Users} from 'lucide-react';
import {ReactNode} from 'react';

/**
 * Configuración de una columna de la tabla.
 * @template T - Tipo de los datos de cada fila.
 */
export interface ColumnConfig<T> {
  /** Clave del dato en el objeto (o identificador único si se usa render personalizado). */
  key: keyof T | string;
  /** Texto a mostrar en el encabezado. */
  header: string;
  /** Función opcional para renderizar el contenido de la celda (si no se provee, se usa el valor directo). */
  render?: (item: T) => ReactNode;
  /** Clases CSS adicionales para la celda de datos. */
  className?: string;
  /** Clases CSS adicionales para la celda de encabezado. */
  headerClassName?: string;
}

/**
 * Props del componente TableRegisters.
 * @template T - Tipo de los datos de las filas.
 */
interface Props<T> {
  /** Arreglo de elementos a mostrar. */
  data: T[];
  /** Configuración de las columnas. */
  columns: ColumnConfig<T>[];
  /** Función que se ejecuta al hacer clic en el botón de editar (recibe el item completo). */
  onEdit?: (item: T) => void;
  /** Función que se ejecuta al hacer clic en el botón de eliminar (recibe el ID). */
  onDelete?: (id: number | string) => void;
  /** Función que retorna JSX para acciones personalizadas por fila (se muestra junto a los botones estándar). */
  customActions?: (item: T) => ReactNode;
  /** Función que extrae el ID único de un item. Si no se provee, se intenta con 'id', 'id_empleado', etc. */
  getId?: (item: T) => string | number;
  /** Mensaje a mostrar cuando no hay datos. */
  emptyMessage?: string;
  /** Estado de carga (muestra "Cargando..." si es true). */
  loading?: boolean;
  /** Indica si se debe mostrar la columna de acciones (por defecto true). */
  actions?: boolean;
}

/**
 * Componente de tabla genérico que muestra una lista de registros con columnas configurables
 * y botones de acción (editar/eliminar) opcionales.
 *
 * @template T - Tipo de los datos de las filas.
 */
export function TableRegisters<T>({
  data,
  columns,
  onEdit,
  onDelete,
  customActions,
  getId,
  emptyMessage = 'No se encontraron registros',
  loading = false,
  actions = true,
}: Props<T>) {
  // Estado de carga
  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">Cargando...</div>
    );
  }

  // Sin datos
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
        {emptyMessage}
      </div>
    );
  }

  /**
   * Obtiene un identificador único para el item.
   * Si se proporciona la función getId, la usa; de lo contrario, intenta obtener
   * propiedades comunes como id, id_empleado, id_profesor. Si no encuentra ninguna,
   * genera un id aleatorio (solo para evitar errores, pero se recomienda siempre
   * proporcionar getId).
   */
  const getItemId = (item: T): string | number => {
    if (getId) return getId(item);
    const possibleId =
      (item as any).id ?? (item as any).id_empleado ?? (item as any).id_profesor;
    if (possibleId === undefined) {
      console.warn(
        "No se pudo determinar el ID del item. Proporciona 'getId' prop para evitar este warning."
      );
      return Math.random().toString();
    }
    return possibleId;
  };

  return (
    <Table className="table-pro">
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key as string} className={col.headerClassName}>
              {col.header}
            </TableHead>
          ))}
          {/* Columna de acciones (solo si hay al menos un manejador o customActions) */}
          {(actions && (onEdit || onDelete)) || customActions ? (
            <TableHead className="w-24 text-center">Acciones</TableHead>
          ) : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, idx) => (
          <TableRow
            key={getItemId(item)}
            className="animate-fade-in"
            style={{animationDelay: `${idx * 30}ms`}}
          >
            {columns.map((col) => (
              <TableCell key={col.key as string} className={col.className}>
                {col.render ? col.render(item) : (item[col.key as keyof T] as ReactNode)}
              </TableCell>
            ))}
            {/* Renderizado de acciones */}
            {(actions && (onEdit || onDelete)) || customActions ? (
              <TableCell>
                <div className="flex gap-1 justify-center">
                  {customActions && customActions(item)}
                  {actions && onEdit && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="btn-action-edit"
                      onClick={() => onEdit(item)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {actions && onDelete && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="btn-action-delete"
                      onClick={() => {
                        const id = getItemId(item);
                        if (typeof id === 'number' || typeof id === 'string') {
                          onDelete(id);
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
