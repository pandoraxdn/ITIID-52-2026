import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {type Empleado} from '@/interfaces/empleado.interface';
import {getEmpleados, deleteEmpleado} from '@/graphql/empleado';

interface Props {
  navigation: any;
}

// ─── Modal de confirmación ────────────────────────────────────────────────────
// Reemplaza Alert.alert que no funciona en web
const ModalConfirmacion = ({
  visible,
  nombre,
  onConfirmar,
  onCancelar,
}: {
  visible: boolean;
  nombre: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}) => (
  <Modal transparent visible={visible} animationType="fade">
    {/* Fondo oscuro */}
    <View className="items-center justify-center flex-1 bg-black/50">

      {/* Caja del modal */}
      <View className="w-4/5 p-6 mx-4 border rounded-xl bg-card border-border">
        <Text className="mb-2 text-lg font-bold text-foreground">
          Eliminar empleado
        </Text>
        <Text className="mb-6 text-sm text-muted-foreground">
          ¿Deseas eliminar a {nombre}? Esta acción no se puede deshacer.
        </Text>

        <View className="flex-row gap-3">
          <Pressable
            onPress={onCancelar}
            className="items-center flex-1 py-2 border rounded-lg border-border bg-background"
          >
            <Text className="font-medium text-foreground">Cancelar</Text>
          </Pressable>

          <Pressable
            onPress={onConfirmar}
            className="items-center flex-1 py-2 rounded-lg bg-destructive"
          >
            <Text className="font-medium text-white">Eliminar</Text>
          </Pressable>
        </View>
      </View>

    </View>
  </Modal>
);

// ─── Tarjeta de cada empleado ─────────────────────────────────────────────────
const EmpleadoCard = ({
  empleado,
  onEditar,
  onEliminar,
}: {
  empleado: Empleado;
  onEditar: () => void;
  onEliminar: () => void;
}) => (
  <View className="p-4 mx-4 mb-3 border bg-card border-border rounded-xl">

    <View className="flex-row items-start justify-between mb-1">
      <Text className="flex-1 text-base font-bold text-foreground">
        {empleado.nombre} {empleado.apellido_p} {empleado.apellido_m}
      </Text>
      <View className={`ml-2 px-2 py-0.5 rounded-full ${empleado.activo ? 'bg-green-100' : 'bg-red-100'}`}>
        <Text className={`text-xs font-medium ${empleado.activo ? 'text-green-700' : 'text-red-700'}`}>
          {empleado.activo ? 'Activo' : 'Inactivo'}
        </Text>
      </View>
    </View>

    <Text className="text-sm text-muted-foreground">
      #{empleado.numero_empleado} · {empleado.puesto}
    </Text>
    <Text className="text-sm text-muted-foreground">{empleado.departamento}</Text>

    <View className="flex-row mt-3 gap-2">
      <Pressable
        onPress={onEditar}
        className="items-center flex-1 py-2 rounded-lg bg-primary"
      >
        <Text className="text-sm font-medium text-primary-foreground">Editar</Text>
      </Pressable>

      <Pressable
        onPress={onEliminar}
        className="items-center flex-1 py-2 rounded-lg bg-destructive"
      >
        <Text className="text-sm font-medium text-white">Eliminar</Text>
      </Pressable>
    </View>
  </View>
);

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function EmpleadosListScreen({navigation}: Props) {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Estado del modal — guarda qué empleado se quiere eliminar
  const [modalVisible, setModalVisible] = useState(false);
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState<{id: number; nombre: string} | null>(null);

  const cargar = async (pagina: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEmpleados(pagina, 10);
      setEmpleados(data);
    } catch (e: any) {
      setError(e.message || 'Error al cargar empleados');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {cargar(page);}, [page])
  );

  // Abre el modal guardando qué empleado se quiere eliminar
  const pedirConfirmacion = (id: number, nombre: string) => {
    setEmpleadoAEliminar({id, nombre});
    setModalVisible(true);
  };

  // Se ejecuta cuando el usuario presiona "Eliminar" en el modal
  const confirmarEliminar = async () => {
    if (!empleadoAEliminar) return;
    try {
      await deleteEmpleado(empleadoAEliminar.id);
      setModalVisible(false);
      setEmpleadoAEliminar(null);
      cargar(page);
    } catch (e: any) {
      setModalVisible(false);
      setError(e.message || 'Error al eliminar');
    }
  };

  const cancelarEliminar = () => {
    setModalVisible(false);
    setEmpleadoAEliminar(null);
  };

  // ─── Estados de carga y error ─────────────────────────────────────────────
  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center justify-center flex-1 px-6 bg-background">
        <Text className="mb-4 text-center text-destructive">{error}</Text>
        <TouchableOpacity
          onPress={() => cargar(page)}
          className="px-6 py-2 rounded-lg bg-primary"
        >
          <Text className="text-primary-foreground">Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── Lista ────────────────────────────────────────────────────────────────
  return (
    <View className="flex-1 bg-background">

      {/* Modal de confirmación — aparece encima de todo */}
      <ModalConfirmacion
        visible={modalVisible}
        nombre={empleadoAEliminar?.nombre ?? ''}
        onConfirmar={confirmarEliminar}
        onCancelar={cancelarEliminar}
      />

      <FlatList
        data={empleados}
        keyExtractor={(item) => item.id_empleado.toString()}
        contentContainerStyle={{paddingVertical: 16}}

        ListHeaderComponent={
          <View className="px-4 mb-4">
            <Text className="text-2xl font-bold text-foreground">Empleados</Text>
            <Text className="text-sm text-muted-foreground">
              {empleados.length} registros · página {page}
            </Text>
          </View>
        }

        ListEmptyComponent={
          <View className="items-center py-16">
            <Text className="text-muted-foreground">No hay empleados registrados.</Text>
          </View>
        }

        renderItem={({item}) => (
          <EmpleadoCard
            empleado={item}
            onEditar={() => navigation.navigate('EmpleadoForm', {empleado: item})}
            onEliminar={() =>
              pedirConfirmacion(item.id_empleado, `${item.nombre} ${item.apellido_p}`)
            }
          />
        )}
      />

      {/* ── Paginación ── */}
      <View className="flex-row items-center justify-between px-4 py-3 border-t border-border bg-background">
        <TouchableOpacity
          onPress={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg ${page === 1 ? 'bg-muted' : 'bg-primary'}`}
        >
          <Text className={page === 1 ? 'text-muted-foreground' : 'text-primary-foreground'}>
            ← Anterior
          </Text>
        </TouchableOpacity>

        <Text className="text-sm text-muted-foreground">Página {page}</Text>

        <TouchableOpacity
          onPress={() => setPage((p) => p + 1)}
          disabled={empleados.length < 10}
          className={`px-4 py-2 rounded-lg ${empleados.length < 10 ? 'bg-muted' : 'bg-primary'}`}
        >
          <Text className={empleados.length < 10 ? 'text-muted-foreground' : 'text-primary-foreground'}>
            Siguiente →
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Botón flotante crear ── */}
      <TouchableOpacity
        onPress={() => navigation.navigate('EmpleadoForm')}
        className="absolute items-center justify-center rounded-full shadow-lg bottom-20 right-6 bg-primary w-14 h-14"
      >
        <Text className="text-3xl font-light text-primary-foreground">+</Text>
      </TouchableOpacity>

    </View>
  );
}
