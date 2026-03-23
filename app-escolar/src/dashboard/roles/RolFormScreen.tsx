// ============================================
// RUTA: src/dashboard/roles/RolFormScreen.tsx
// ============================================

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Rol, CreateRolInput, UpdateRolInput} from '@/interfaces/rol.interface';
import {createRol, updateRol} from '@/graphql/rol';

interface Props {
  navigation: any;
  route: {params?: {rol?: Rol}};
}

const Campo = ({label, valor, onChange, placeholder, multiline = false}: {
  label: string; valor: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean;
}) => (
  <View className="mb-4">
    <Text className="mb-1 text-sm font-medium text-foreground">{label}</Text>
    <TextInput
      value={valor} onChangeText={onChange} placeholder={placeholder}
      placeholderTextColor="#9ca3af" multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
      className={`border border-border rounded-lg px-3 py-2.5 text-foreground bg-background ${multiline ? 'h-24' : ''}`}
    />
  </View>
);

const Seccion = ({titulo}: {titulo: string}) => (
  <Text className="mt-2 mb-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
    {titulo}
  </Text>
);

export default function RolFormScreen({navigation, route}: Props) {
  const rolExistente = route.params?.rol;
  const esEdicion = !!rolExistente;

  const [form, setForm] = useState<CreateRolInput>({
    nombre:      rolExistente?.nombre      ?? '',
    descripcion: rolExistente?.descripcion ?? '',
  });

  const [loading, setLoading] = useState(false);

  const setField = <K extends keyof CreateRolInput>(key: K, value: CreateRolInput[K]) =>
    setForm((prev) => ({...prev, [key]: value}));

  const validar = (): boolean => {
    if (!form.nombre.trim()) {
      Alert.alert('Requerido', 'El nombre del rol es obligatorio.');
      return false;
    }
    return true;
  };

  const guardar = async () => {
    if (!validar()) return;
    try {
      setLoading(true);
      if (esEdicion && rolExistente) {
        // ── CORRECCIÓN: construye UpdateRolInput igual que el web ─────────────
        const input: UpdateRolInput = {
          ...form,
          id_rol: Number(rolExistente.id_rol),
        };
        await updateRol(rolExistente.id_rol, input);
      } else {
        await createRol(form);
      }
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo guardar el rol.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{padding: 16}} keyboardShouldPersistTaps="handled">

      <Text className="mb-6 text-2xl font-bold text-foreground">
        {esEdicion ? 'Editar rol' : 'Nuevo rol'}
      </Text>

      <Seccion titulo="Datos del rol" />
      <Campo label="Nombre *" valor={form.nombre}
        onChange={(v) => setField('nombre', v)} placeholder="Administrador, Docente..." />
      <Campo label="Descripción" valor={form.descripcion}
        onChange={(v) => setField('descripcion', v)}
        placeholder="Describe los permisos de este rol..." multiline />

      <TouchableOpacity onPress={guardar} disabled={loading}
        className={`rounded-xl py-3 items-center mb-10 mt-4 ${loading ? 'bg-muted' : 'bg-primary'}`}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text className="text-base font-semibold text-primary-foreground">
              {esEdicion ? 'Actualizar rol' : 'Crear rol'}
            </Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}
