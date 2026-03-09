// ============================================
// ARCHIVO: TableRegisters.tsx
// PROPÓSITO: Componente genérico que muestra una tabla de registros con columnas configurables.
//            Puede incluir botones de editar y eliminar, así como acciones personalizadas.
//            También maneja estados de carga y mensajes cuando no hay datos.
// ============================================

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {Pencil, Trash2, Users} from 'lucide-react';
import {ReactNode} from 'react';

// ============================================
// CONFIGURACIÓN DE UNA COLUMNA
// ============================================
export interface ColumnConfig<T> {
  key: keyof T | string;                // Clave del dato en el objeto (o identificador si se usa render)
  header: string;                        // Texto del encabezado
  render?: (item: T) => ReactNode;       // Función opcional para renderizar la celda (si no se usa, se muestra el valor directo)
  className?: string;                     // Clase CSS para la celda de datos
  headerClassName?: string;                // Clase CSS para la celda de encabezado
}

// ============================================
// PROPS DEL COMPONENTE
// ============================================
interface Props<T> {
  data: T[];                              // Lista de elementos a mostrar
  columns: ColumnConfig<T>[];              // Configuración de columnas
  onEdit?: (item: T) => void;              // Función al hacer clic en editar (recibe el item completo)
  onDelete?: (id: number | string) => void; // Función al hacer clic en eliminar (recibe el ID)
  customActions?: (item: T) => ReactNode;   // Renderizado personalizado de acciones por fila
  getId?: (item: T) => string | number;     // Función para obtener el ID único de un item
  emptyMessage?: string;                     // Mensaje cuando no hay datos
  loading?: boolean;                         // Estado de carga
  actions?: boolean;                         // Si se debe mostrar la columna de acciones
}

// ============================================
// COMPONENTE TABLEREGISTERS
// ============================================
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
  // Estado de carga: mostramos un mensaje simple
  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">Cargando...</div>
    );
  }

  // Sin datos: mostramos un icono y el mensaje
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
        {emptyMessage}
      </div>
    );
  }

  // Función para obtener el ID de un item. Si no se provee getId, intentamos adivinarlo
  // buscando propiedades comunes como 'id', 'id_empleado', 'id_profesor'.
  const getItemId = (item: T): string | number => {
    if (getId) return getId(item);
    const possibleId = (item as any).id ?? (item as any).id_empleado ?? (item as any).id_profesor;
    if (possibleId === undefined) {
      console.warn("No se pudo determinar el ID del item. Proporciona 'getId' prop.");
      return Math.random().toString(); // ID temporal para evitar errores, pero no debería pasar
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
          {/* Columna de acciones: solo si hay al menos una acción */}
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
