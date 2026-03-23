// ============================================
// RUTA: src/dashboard/alumnos/AlumnosListScreen.tsx
// ============================================

import React, {useState, useCallback} from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  Pressable, ActivityIndicator, Modal,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {type Alumno} from '@/interfaces/alumno.interface';
import {getAlumnos, deleteAlumno} from '@/graphql/alumno';

interface Props { navigation: any; }

const ModalConfirmacion = ({visible, nombre, onConfirmar, onCancelar}: {
  visible: boolean; nombre: string; onConfirmar: () => void; onCancelar: () => void;
}) => (
  <Modal transparent visible={visible} animationType="fade">
    <View className="items-center justify-center flex-1 bg-black/50">
      <View className="w-4/5 p-6 mx-4 border rounded-xl bg-card border-border">
        <Text className="mb-2 text-lg font-bold text-foreground">Eliminar alumno</Text>
        <Text className="mb-6 text-sm text-muted-foreground">
          ¿Deseas eliminar a {nombre}? Esta acción no se puede deshacer.
        </Text>
        <View className="flex-row gap-3">
          <Pressable onPress={onCancelar} className="items-center flex-1 py-2 border rounded-lg border-border bg-background">
            <Text className="font-medium text-foreground">Cancelar</Text>
          </Pressable>
          <Pressable onPress={onConfirmar} className="items-center flex-1 py-2 rounded-lg bg-destructive">
            <Text className="font-medium text-white">Eliminar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);

const AlumnoCard = ({alumno, onEditar, onEliminar}: {
  alumno: Alumno; onEditar: () => void; onEliminar: () => void;
}) => (
  <View className="p-4 mx-4 mb-3 border bg-card border-border rounded-xl">
    <View className="flex-row items-start justify-between mb-1">
      <Text className="flex-1 text-base font-bold text-foreground">
        {alumno.nombre} {alumno.apellido_p} {alumno.apellido_m}
      </Text>
      <View className={`ml-2 px-2 py-0.5 rounded-full ${alumno.activo ? 'bg-green-100' : 'bg-red-100'}`}>
        <Text className={`text-xs font-medium ${alumno.activo ? 'text-green-700' : 'text-red-700'}`}>
          {alumno.activo ? 'Activo' : 'Inactivo'}
        </Text>
      </View>
    </View>
    <Text className="text-sm text-muted-foreground">Matrícula: {alumno.matricula} · {alumno.genero}</Text>
    <Text className="text-sm text-muted-foreground">{alumno.email_institucional}</Text>
    <View className="flex-row mt-3 gap-2">
      <Pressable onPress={onEditar} className="items-center flex-1 py-2 rounded-lg bg-primary">
        <Text className="text-sm font-medium text-primary-foreground">Editar</Text>
      </Pressable>
      <Pressable onPress={onEliminar} className="items-center flex-1 py-2 rounded-lg bg-destructive">
        <Text className="text-sm font-medium text-white">Eliminar</Text>
      </Pressable>
    </View>
  </View>
);

export default function AlumnosListScreen({navigation}: Props) {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [aEliminar, setAEliminar] = useState<{id: number; nombre: string} | null>(null);

  const cargar = async (pagina: number) => {
    try {
      setLoading(true); setError(null);
      const data = await getAlumnos(pagina, 10);
      setAlumnos(data);
    } catch (e: any) { setError(e.message || 'Error al cargar alumnos'); }
    finally { setLoading(false); }
  };

  useFocusEffect(useCallback(() => { cargar(page); }, [page]));

  const confirmarEliminar = async () => {
    if (!aEliminar) return;
    try {
      await deleteAlumno(aEliminar.id);
      setModalVisible(false); setAEliminar(null); cargar(page);
    } catch (e: any) { setModalVisible(false); setError(e.message); }
  };

  if (loading) return <View className="items-center justify-center flex-1 bg-background"><ActivityIndicator size="large" /></View>;
  if (error) return (
    <View className="items-center justify-center flex-1 px-6 bg-background">
      <Text className="mb-4 text-center text-destructive">{error}</Text>
      <TouchableOpacity onPress={() => cargar(page)} className="px-6 py-2 rounded-lg bg-primary">
        <Text className="text-primary-foreground">Reintentar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <ModalConfirmacion visible={modalVisible} nombre={aEliminar?.nombre ?? ''}
        onConfirmar={confirmarEliminar} onCancelar={() => { setModalVisible(false); setAEliminar(null); }} />
      <FlatList
        data={alumnos}
        keyExtractor={(item) => item.id_alumno.toString()}
        contentContainerStyle={{paddingVertical: 16}}
        ListHeaderComponent={
          <View className="px-4 mb-4">
            <Text className="text-2xl font-bold text-foreground">Alumnos</Text>
            <Text className="text-sm text-muted-foreground">{alumnos.length} registros · página {page}</Text>
          </View>
        }
        ListEmptyComponent={<View className="items-center py-16"><Text className="text-muted-foreground">No hay alumnos registrados.</Text></View>}
        renderItem={({item}) => (
          <AlumnoCard alumno={item}
            onEditar={() => navigation.navigate('AlumnoForm', {alumno: item})}
            onEliminar={() => { setAEliminar({id: item.id_alumno, nombre: `${item.nombre} ${item.apellido_p}`}); setModalVisible(true); }}
          />
        )}
      />
      <View className="flex-row items-center justify-between px-4 py-3 border-t border-border bg-background">
        <TouchableOpacity onPress={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
          className={`px-4 py-2 rounded-lg ${page === 1 ? 'bg-muted' : 'bg-primary'}`}>
          <Text className={page === 1 ? 'text-muted-foreground' : 'text-primary-foreground'}>← Anterior</Text>
        </TouchableOpacity>
        <Text className="text-sm text-muted-foreground">Página {page}</Text>
        <TouchableOpacity onPress={() => setPage((p) => p + 1)} disabled={alumnos.length < 10}
          className={`px-4 py-2 rounded-lg ${alumnos.length < 10 ? 'bg-muted' : 'bg-primary'}`}>
          <Text className={alumnos.length < 10 ? 'text-muted-foreground' : 'text-primary-foreground'}>Siguiente →</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('AlumnoForm')}
        className="absolute items-center justify-center rounded-full shadow-lg bottom-20 right-6 bg-primary w-14 h-14">
        <Text className="text-3xl font-light text-primary-foreground">+</Text>
      </TouchableOpacity>
    </View>
  );
}
