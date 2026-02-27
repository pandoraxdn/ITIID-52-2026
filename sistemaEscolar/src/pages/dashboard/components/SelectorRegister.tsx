// ============================================
// ARCHIVO: SelectorRegister.tsx
// Módulo: Componentes compartidos
// Descripción: Componente modal genérico que permite seleccionar un registro de una lista paginada.
//              Se utiliza, por ejemplo, para seleccionar un empleado al crear un profesor.
// ============================================
import {useState, useEffect} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {TableRegisters, ColumnConfig} from './TableRegisters';
import {ChevronLeft, ChevronRight, Search, Users, Check} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

/**
 * Props del componente SelectorRegister.
 * @template T - Tipo de los elementos que se mostrarán en la lista.
 */
interface Props<T> {
  /** Controla si el modal está abierto. */
  open: boolean;
  /** Función para cerrar el modal. */
  onClose: () => void;
  /** Función que se ejecuta al seleccionar un elemento. */
  onSelect: (item: T) => void;
  /** Título del modal. */
  title?: string;
  /** Función asíncrona que obtiene los elementos paginados (recibe página y límite). */
  fetchItems: (page: number, limit: number) => Promise<T[]>;
  /** Configuración de columnas para la tabla. */
  columns: ColumnConfig<T>[];
  /** Función para obtener el ID único de un elemento. */
  getId: (item: T) => string | number;
  /** Lista de campos (claves de T) en los que se buscará localmente. */
  searchFields: (keyof T)[];
  /** Mensaje cuando no hay registros. */
  emptyMessage?: string;
  /** Ruta opcional a la que redirigir si no hay registros y se desea crear uno nuevo. */
  createPath?: string;
}

/**
 * Componente modal que muestra una lista paginada de elementos y permite seleccionar uno.
 * Incluye búsqueda local sobre los campos especificados.
 * Si no hay elementos y se proporciona createPath, después de cargar redirige automáticamente.
 *
 * @template T - Tipo de los elementos.
 */
export function SelectorRegister<T>({
  open,
  onClose,
  onSelect,
  title = 'Seleccionar Registro',
  fetchItems,
  columns,
  getId,
  searchFields,
  emptyMessage = 'No hay registros',
  createPath,
}: Props<T>) {
  const navigate = useNavigate();
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  /**
   * Carga los elementos de la página actual usando fetchItems.
   * @param currentPage - Página a cargar.
   */
  const loadItems = async (currentPage: number) => {
    setIsLoading(true);
    const data = await fetchItems(currentPage, limit);
    setItems(data);
    setHasMore(data.length === limit);
    setIsLoading(false);
    setInitialLoadDone(true);
  };

  // Al abrir el modal, reiniciamos estados y cargamos la primera página
  useEffect(() => {
    if (open) {
      setPage(1);
      setSearch('');
      setItems([]);
      setHasMore(false);
      setInitialLoadDone(false);
      loadItems(1);
    }
  }, [open]);

  // Si no hay elementos después de cargar y hay createPath, redirigimos automáticamente
  useEffect(() => {
    if (open && createPath && initialLoadDone && !isLoading && items.length === 0) {
      onClose(); // Cerramos el selector
      navigate(createPath); // Redirigimos a la página de creación
    }
  }, [open, createPath, initialLoadDone, isLoading, items, navigate, onClose]);

  // Filtro local basado en los campos especificados
  const filtered = items.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      return value?.toString().toLowerCase().includes(search.toLowerCase());
    })
  );

  // Funciones de paginación
  const nextPage = () => {
    if (hasMore) {
      const next = page + 1;
      setPage(next);
      loadItems(next);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      const prev = page - 1;
      setPage(prev);
      loadItems(prev);
    }
  };

  /**
   * Maneja la selección de un elemento: llama a onSelect y cierra el modal.
   * @param item - Elemento seleccionado.
   */
  const handleSelect = (item: T) => {
    onSelect(item);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Contenido: carga, vacío o tabla */}
          {!initialLoadDone && isLoading ? (
            <div className="text-center py-8">Cargando...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">{emptyMessage}</p>
              {createPath && (
                <Button
                  onClick={() => {
                    onClose();
                    navigate(createPath);
                  }}
                  className="mt-4"
                >
                  Crear nuevo
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Tabla de resultados */}
              <TableRegisters
                data={filtered}
                columns={columns}
                getId={getId}
                loading={isLoading}
                actions={false} // No mostramos acciones estándar (editar/eliminar)
                customActions={(item) => (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="btn-action-edit"
                    onClick={() => handleSelect(item)}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                )}
              />
              {/* Controles de paginación */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={page === 1 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Button>
                <span className="text-sm">Página {page}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={!hasMore || isLoading}
                >
                  Siguiente <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
