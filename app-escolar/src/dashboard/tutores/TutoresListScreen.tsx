// ============================================
// RUTA: src/dashboard/tutores/TutoresListScreen.tsx
// ============================================

import React, {useState, useCallback} from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  Pressable, ActivityIndicator, Modal,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {type Tutor} from '@/interfaces/tutor.interface';
import {getTutores, deleteTutor} from '@/graphql/tutor';

interface Props { navigation: any; }

const ModalConfirmacion = ({visible, nombre, onConfirmar, onCancelar}: {
  visible: boolean; nombre: string; onConfirmar: () => void; onCancelar: () => void;
}) => (
  <Modal transparent visible={visible} animationType="fade">
    <View className="items-center justify-center flex-1 bg-black/50">
      <View className="w-4/5 p-6 mx-4 border rounded-xl bg-card border-border">
        <Text className="mb-2 text-lg font-bold text-foreground">Eliminar tutor</Text>
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

const TutorCard = ({tutor, onEditar, onEliminar}: {
  tutor: Tutor; onEditar: () => void; onEliminar: () => void;
}) => (
  <View className="p-4 mx-4 mb-3 border bg-card border-border rounded-xl">
    <Text className="text-base font-bold text-foreground mb-1">
      {tutor.nombre} {tutor.apellido_p} {tutor.apellido_m}
    </Text>
    <Text className="text-sm text-muted-foreground">Relación: {tutor.relacion}</Text>
    <Text className="text-sm text-muted-foreground">Tel: {tutor.telefono_principal} · {tutor.email}</Text>
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

export default function TutoresListScreen({navigation}: Props) {
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [aEliminar, setAEliminar] = useState<{id: number; nombre: string} | null>(null);

  const cargar = async (pagina: number) => {
    try {
      setLoading(true); setError(null);
      const data = await getTutores(pagina, 10);
      setTutores(data);
    } catch (e: any) { setError(e.message || 'Error al cargar tutores'); }
    finally { setLoading(false); }
  };

  useFocusEffect(useCallback(() => { cargar(page); }, [page]));

  const confirmarEliminar = async () => {
    if (!aEliminar) return;
    try {
      await deleteTutor(aEliminar.id);
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
        data={tutores} keyExtractor={(item) => item.id_tutor.toString()}
        contentContainerStyle={{paddingVertical: 16}}
        ListHeaderComponent={
          <View className="px-4 mb-4">
            <Text className="text-2xl font-bold text-foreground">Tutores</Text>
            <Text className="text-sm text-muted-foreground">{tutores.length} registros · página {page}</Text>
          </View>
        }
        ListEmptyComponent={<View className="items-center py-16"><Text className="text-muted-foreground">No hay tutores registrados.</Text></View>}
        renderItem={({item}) => (
          <TutorCard tutor={item}
            onEditar={() => navigation.navigate('TutorForm', {tutor: item})}
            onEliminar={() => { setAEliminar({id: item.id_tutor, nombre: `${item.nombre} ${item.apellido_p}`}); setModalVisible(true); }}
          />
        )}
      />
      <View className="flex-row items-center justify-between px-4 py-3 border-t border-border bg-background">
        <TouchableOpacity onPress={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
          className={`px-4 py-2 rounded-lg ${page === 1 ? 'bg-muted' : 'bg-primary'}`}>
          <Text className={page === 1 ? 'text-muted-foreground' : 'text-primary-foreground'}>← Anterior</Text>
        </TouchableOpacity>
        <Text className="text-sm text-muted-foreground">Página {page}</Text>
        <TouchableOpacity onPress={() => setPage((p) => p + 1)} disabled={tutores.length < 10}
          className={`px-4 py-2 rounded-lg ${tutores.length < 10 ? 'bg-muted' : 'bg-primary'}`}>
          <Text className={tutores.length < 10 ? 'text-muted-foreground' : 'text-primary-foreground'}>Siguiente →</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('TutorForm')}
        className="absolute items-center justify-center rounded-full shadow-lg bottom-20 right-6 bg-primary w-14 h-14">
        <Text className="text-3xl font-light text-primary-foreground">+</Text>
      </TouchableOpacity>
    </View>
  );
}
