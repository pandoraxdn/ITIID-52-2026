import {useState, useEffect} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {TableRegisters, ColumnConfig} from './TableRegisters';
import {ChevronLeft, ChevronRight, Search, Users, Check} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

interface Props<T> {
  open: boolean;
  onClose: () => void;
  onSelect: (item: T) => void;
  title?: string;
  fetchItems: (page: number, limit: number) => Promise<T[]>;
  columns: ColumnConfig<T>[];
  getId: (item: T) => string | number;
  searchFields: (keyof T)[];
  emptyMessage?: string;
  createPath?: string;
}

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

  const loadItems = async (currentPage: number) => {
    setIsLoading(true);
    const data = await fetchItems(currentPage, limit);
    setItems(data);
    setHasMore(data.length === limit);
    setIsLoading(false);
    setInitialLoadDone(true);
  };

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

  useEffect(() => {
    if (open && createPath && initialLoadDone && !isLoading && items.length === 0) {
      onClose();
      navigate(createPath);
    }
  }, [open, createPath, initialLoadDone, isLoading, items, navigate, onClose]);

  const filtered = items.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      return value?.toString().toLowerCase().includes(search.toLowerCase());
    })
  );

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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

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
              <TableRegisters
                data={filtered}
                columns={columns}
                getId={getId}
                loading={isLoading}
                actions={false}
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
