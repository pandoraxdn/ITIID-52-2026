// ============================================
// ARCHIVO: SelectorRegister.tsx
// PROPÓSITO: Este componente muestra un modal (ventana emergente) con una lista paginada
//            de elementos (por ejemplo, empleados, alumnos, tutores) y permite al usuario
//            seleccionar uno de ellos. Es útil cuando necesitamos elegir un registro
//            existente para asociarlo a otro (por ejemplo, asignar un empleado a un usuario).
// ============================================

// Importaciones necesarias
import {useState, useEffect} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {TableRegisters} from './TableRegisters';
import type {ColumnConfig} from './TableRegisters';
import {ChevronLeft, ChevronRight, Search, Users, Check} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

// ============================================
// DEFINICIÓN DE PROPS (Propiedades)
// ============================================
// Las props son los datos que le pasamos al componente desde afuera.
// Aquí usamos un tipo genérico <T> para que el componente pueda trabajar
// con cualquier tipo de objeto (empleados, alumnos, etc.).
interface Props<T> {
  /** Controla si el modal está abierto (true) o cerrado (false). */
  open: boolean;
  /** Función que se llama para cerrar el modal (normalmente cambia open a false). */
  onClose: () => void;
  /** Función que se ejecuta cuando el usuario selecciona un elemento. Recibe el elemento elegido. */
  onSelect: (item: T) => void;
  /** Título que aparece en la parte superior del modal. */
  title?: string;
  /** Función que debe traer los datos desde el servidor (API). Recibe página y límite, devuelve una promesa con los elementos. */
  fetchItems: (page: number, limit: number) => Promise<T[]>;
  /** Configuración de las columnas que se mostrarán en la tabla (definidas en TableRegisters). */
  columns: ColumnConfig<T>[];
  /** Función que devuelve el ID único de un elemento (para usarlo como key en la tabla). */
  getId: (item: T) => string | number;
  /** Lista de campos (propiedades) del objeto en los que se buscará cuando el usuario escriba en el buscador. */
  searchFields: (keyof T)[];
  /** Mensaje que se muestra cuando no hay registros. */
  emptyMessage?: string;
  /** Ruta a la que redirigir si no hay registros y el usuario quiere crear uno nuevo (opcional). */
  createPath?: string;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
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
  // ============================================
  // HOOKS Y ESTADOS
  // ============================================
  // useNavigate: Hook de React Router para navegar programáticamente a otras rutas.
  const navigate = useNavigate();

  // items: almacena la lista de elementos obtenidos del servidor (página actual).
  const [items, setItems] = useState<T[]>([]);

  // page: número de página actual (para paginación).
  const [page, setPage] = useState(1);

  // limit: cantidad de elementos por página (fijo en 10).
  const [limit] = useState(10);

  // hasMore: indica si hay más páginas después de la actual (true si la página trajo exactamente 'limit' elementos).
  const [hasMore, setHasMore] = useState(false);

  // search: texto que el usuario escribe en el buscador (para filtrar localmente).
  const [search, setSearch] = useState('');

  // isLoading: indica si se está cargando datos (para mostrar "Cargando...").
  const [isLoading, setIsLoading] = useState(false);

  // initialLoadDone: nos ayuda a saber si ya se hizo la primera carga (útil para decidir si redirigir o no).
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // ============================================
  // FUNCIÓN PARA CARGAR ELEMENTOS
  // ============================================
  // Recibe un número de página y usa fetchItems para obtener los datos.
  // Luego actualiza items, hasMore y los estados de carga.
  const loadItems = async (currentPage: number) => {
    setIsLoading(true);
    const data = await fetchItems(currentPage, limit);
    setItems(data);
    setHasMore(data.length === limit); // Si la cantidad es igual al límite, probablemente hay más.
    setIsLoading(false);
    setInitialLoadDone(true);
  };

  // ============================================
  // EFECTOS (useEffect)
  // ============================================
  // Este efecto se ejecuta cada vez que 'open' cambia.
  // Si el modal se abre (open === true), reiniciamos estados y cargamos la primera página.
  useEffect(() => {
    if (open) {
      setPage(1);
      setSearch('');
      setItems([]);
      setHasMore(false);
      setInitialLoadDone(false);
      loadItems(1);
    }
  }, [open]); // Solo depende de 'open'

  // Este efecto se ejecuta cuando cambian las condiciones para redirigir.
  // Si no hay elementos después de la carga, hay una ruta createPath y ya terminó la carga inicial,
  // entonces cerramos el modal y navegamos a createPath.
  useEffect(() => {
    if (open && createPath && initialLoadDone && !isLoading && items.length === 0) {
      onClose(); // Cerramos el selector
      navigate(createPath); // Redirigimos a la página de creación
    }
  }, [open, createPath, initialLoadDone, isLoading, items, navigate, onClose]);

  // ============================================
  // FILTRO LOCAL
  // ============================================
  // Filtramos los elementos de la página actual según el texto de búsqueda.
  // Buscamos en los campos especificados en searchFields.
  const filtered = items.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      return value?.toString().toLowerCase().includes(search.toLowerCase());
    })
  );

  // ============================================
  // FUNCIONES DE PAGINACIÓN
  // ============================================
  // Avanzar a la siguiente página (si hay más).
  const nextPage = () => {
    if (hasMore) {
      const next = page + 1;
      setPage(next);
      loadItems(next);
    }
  };

  // Retroceder a la página anterior (si no es la primera).
  const prevPage = () => {
    if (page > 1) {
      const prev = page - 1;
      setPage(prev);
      loadItems(prev);
    }
  };

  // ============================================
  // MANEJADOR DE SELECCIÓN
  // ============================================
  // Cuando el usuario hace clic en el botón de selección de un elemento,
  // llamamos a onSelect con ese elemento y cerramos el modal.
  const handleSelect = (item: T) => {
    onSelect(item);
    onClose();
  };

  // ============================================
  // RENDERIZADO DEL COMPONENTE
  // ============================================
  return (
    // Diálogo (modal) de la librería shadcn/ui.
    // Se abre o cierra según la prop 'open'. Al cerrar, se llama a onClose.
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      {/* Contenido del diálogo, con ancho máximo personalizado */}
      <DialogContent className="sm:max-w-3xl">
        {/* Cabecera del modal */}
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {/* Descripción oculta (solo para lectores de pantalla), evita warnings de accesibilidad */}
          <DialogDescription className="sr-only">
            {title} – selecciona un elemento de la lista
          </DialogDescription>
        </DialogHeader>

        {/* Contenido principal del modal */}
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

          {/* Contenido condicional: carga, vacío o tabla */}
          {!initialLoadDone && isLoading ? (
            // Estado de carga inicial
            <div className="text-center py-8">Cargando...</div>
          ) : filtered.length === 0 ? (
            // No hay resultados después del filtro (o no hay datos)
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">{emptyMessage}</p>
              {/* Si se proporcionó createPath, mostramos botón para ir a crear */}
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
            // Hay elementos: mostramos tabla y paginación
            <>
              {/* Tabla de resultados (componente reutilizable TableRegisters) */}
              <TableRegisters
                data={filtered}
                columns={columns}
                getId={getId}
                loading={isLoading}
                actions={false} // No mostramos acciones de editar/eliminar, solo selección personalizada
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
