// ============================================
// RUTA: src/components/SelectorModal.tsx
// PROPÓSITO: Modal genérico para seleccionar un registro de otra tabla
//            (equivalente al SelectorRegister del proyecto web).
//            Muestra una lista paginada con buscador local y permite
//            elegir el registro que se usará como FK en el formulario.
//
// USO EJEMPLO (seleccionar empleado):
//   <SelectorModal<Empleado>
//     visible={selectorAbierto}
//     onClose={() => setSelectorAbierto(false)}
//     onSelect={(emp) => {
//       setEmpleadoId(emp.id_empleado);
//       setEmpleadoNombre(`${emp.nombre} ${emp.apellido_p}`);
//     }}
//     title="Seleccionar Empleado"
//     fetchItems={(page, limit) => getEmpleados(page, limit)}
//     renderItem={(emp) => ({
//       id: emp.id_empleado,
//       title: `${emp.nombre} ${emp.apellido_p}`,
//       subtitle: emp.numero_empleado,
//     })}
//     searchFields={['nombre', 'apellido_p', 'numero_empleado']}
//   />
// ============================================

import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

// ─── Tipos ────────────────────────────────────────────────────────────────────

/** Lo que el componente necesita para renderizar una fila en la lista. */
export interface ItemRenderInfo {
  id: string | number;
  title: string;
  subtitle?: string;
  badge?: string;
}

interface Props<T> {
  /** Controla si el modal está visible. */
  visible: boolean;
  /** Función para cerrar el modal. */
  onClose: () => void;
  /** Callback que recibe el elemento seleccionado. */
  onSelect: (item: T) => void;
  /** Título que aparece en la cabecera del modal. */
  title?: string;
  /** Función que carga los items desde la API (recibe página y límite). */
  fetchItems: (page: number, limit: number) => Promise<T[]>;
  /**
   * Función que transforma un item en la información de renderizado.
   * Debe devolver { id, title, subtitle?, badge? }.
   */
  renderItem: (item: T) => ItemRenderInfo;
  /**
   * Campos del objeto en los que se buscará localmente.
   * Ej: ['nombre', 'apellido_p', 'numero_empleado']
   */
  searchFields: (keyof T)[];
  /** Mensaje cuando no hay resultados. */
  emptyMessage?: string;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function SelectorModal<T>({
  visible,
  onClose,
  onSelect,
  title = 'Seleccionar',
  fetchItems,
  renderItem,
  searchFields,
  emptyMessage = 'No hay registros disponibles',
}: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const LIMIT = 10;

  // Carga items cuando el modal se abre o cambia la página
  const cargar = async (pagina: number) => {
    try {
      setLoading(true);
      const data = await fetchItems(pagina, LIMIT);
      setItems(data);
      setHasMore(data.length === LIMIT);
    } catch (e) {
      console.error('SelectorModal error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Reinicia y carga al abrir
  useEffect(() => {
    if (visible) {
      setPage(1);
      setSearch('');
      cargar(1);
    }
  }, [visible]);

  // Filtro local sobre la página actual
  const filtered = items.filter((item) =>
    searchFields.some((field) => {
      const val = item[field];
      return val?.toString().toLowerCase().includes(search.toLowerCase());
    })
  );

  const handleSelect = (item: T) => {
    onSelect(item);
    onClose();
  };

  const irAnterior = () => {
    if (page > 1) { const p = page - 1; setPage(p); cargar(p); }
  };
  const irSiguiente = () => {
    if (hasMore) { const p = page + 1; setPage(p); cargar(p); }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      {/* Fondo oscuro */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Panel principal */}
      <View style={styles.sheet}>

        {/* ── Cabecera ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* ── Buscador ── */}
        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar..."
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearSearch}>
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Lista ── */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => renderItem(item).id.toString()}
            contentContainerStyle={styles.list}
            renderItem={({item}) => {
              const info = renderItem(item);
              return (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.rowInfo}>
                    <Text style={styles.rowTitle} numberOfLines={1}>{info.title}</Text>
                    {info.subtitle ? (
                      <Text style={styles.rowSubtitle} numberOfLines={1}>{info.subtitle}</Text>
                    ) : null}
                  </View>
                  {info.badge ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{info.badge}</Text>
                    </View>
                  ) : null}
                  <Text style={styles.selectIcon}>›</Text>
                </TouchableOpacity>
              );
            }}
          />
        )}

        {/* ── Paginación ── */}
        <View style={styles.pagination}>
          <TouchableOpacity
            onPress={irAnterior}
            disabled={page === 1 || loading}
            style={[styles.pageBtn, (page === 1 || loading) && styles.pageBtnDisabled]}
          >
            <Text style={[styles.pageBtnText, (page === 1 || loading) && styles.pageBtnTextDisabled]}>
              ← Anterior
            </Text>
          </TouchableOpacity>

          <Text style={styles.pageLabel}>Página {page}</Text>

          <TouchableOpacity
            onPress={irSiguiente}
            disabled={!hasMore || loading}
            style={[styles.pageBtn, (!hasMore || loading) && styles.pageBtnDisabled]}
          >
            <Text style={[styles.pageBtnText, (!hasMore || loading) && styles.pageBtnTextDisabled]}>
              Siguiente →
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </Modal>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlay:           {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)'},
  sheet:             {position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%', minHeight: '50%'},
  header:            {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0'},
  headerTitle:       {fontSize: 18, fontWeight: '700', color: '#111'},
  closeBtn:          {padding: 4},
  closeBtnText:      {fontSize: 18, color: '#6b7280'},
  searchRow:         {flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginVertical: 12, paddingHorizontal: 12, backgroundColor: '#f9f9f9', borderRadius: 10, borderWidth: 1, borderColor: '#e5e5e5'},
  searchIcon:        {fontSize: 16, marginRight: 8},
  searchInput:       {flex: 1, paddingVertical: 10, fontSize: 14, color: '#111'},
  clearSearch:       {padding: 4},
  clearSearchText:   {color: '#9ca3af', fontSize: 14},
  center:            {flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40},
  emptyIcon:         {fontSize: 40, marginBottom: 12},
  emptyText:         {color: '#6b7280', fontSize: 14},
  list:              {paddingHorizontal: 16, paddingBottom: 8},
  row:               {flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: '#f3f3f3'},
  rowInfo:           {flex: 1, marginRight: 8},
  rowTitle:          {fontSize: 15, fontWeight: '600', color: '#111'},
  rowSubtitle:       {fontSize: 13, color: '#6b7280', marginTop: 2},
  badge:             {backgroundColor: '#f3f4f6', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8},
  badgeText:         {fontSize: 12, color: '#374151'},
  selectIcon:        {fontSize: 22, color: '#9ca3af'},
  pagination:        {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0'},
  pageBtn:           {paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#111', borderRadius: 8},
  pageBtnDisabled:   {backgroundColor: '#e5e7eb'},
  pageBtnText:       {color: '#fff', fontWeight: '600', fontSize: 13},
  pageBtnTextDisabled: {color: '#9ca3af'},
  pageLabel:         {fontSize: 13, color: '#6b7280'},
});
