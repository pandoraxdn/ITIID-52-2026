import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {Pencil, Trash2, Users} from 'lucide-react';
import {ReactNode} from 'react';

export interface ColumnConfig<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface Props<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (id: number | string) => void;
  customActions?: (item: T) => ReactNode;
  getId?: (item: T) => string | number;
  emptyMessage?: string;
  loading?: boolean;
  actions?: boolean;
}

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
  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">Cargando...</div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
        {emptyMessage}
      </div>
    );
  }

  const getItemId = (item: T): string | number => {
    if (getId) return getId(item);
    const possibleId = (item as any).id ?? (item as any).id_empleado ?? (item as any).id_profesor;
    if (possibleId === undefined) {
      console.warn("No se pudo determinar el ID del item. Proporciona 'getId' prop.");
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
