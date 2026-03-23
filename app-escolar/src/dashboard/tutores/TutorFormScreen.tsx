// ============================================
// RUTA: src/dashboard/tutores/TutorFormScreen.tsx
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
import {Tutor, CreateTutorInput, UpdateTutorInput, TipoRelacion} from '@/interfaces/tutor.interface';
import {createTutor, updateTutor} from '@/graphql/tutor';

interface Props {
  navigation: any;
  route: {params?: {tutor?: Tutor}};
}

const Campo = ({label, valor, onChange, placeholder, teclado = 'default'}: {
  label: string; valor: string; onChange: (v: string) => void;
  placeholder?: string; teclado?: any;
}) => (
  <View className="mb-4">
    <Text className="mb-1 text-sm font-medium text-foreground">{label}</Text>
    <TextInput
      value={valor} onChangeText={onChange} placeholder={placeholder}
      keyboardType={teclado} placeholderTextColor="#9ca3af"
      className="border border-border rounded-lg px-3 py-2.5 text-foreground bg-background"
    />
  </View>
);

const SelectorChips = <T extends string>({label, opciones, valorActual, onChange}: {
  label: string; opciones: T[]; valorActual: T; onChange: (v: T) => void;
}) => (
  <View className="mb-4">
    <Text className="mb-2 text-sm font-medium text-foreground">{label}</Text>
    <View className="flex-row flex-wrap gap-2">
      {opciones.map((op) => (
        <TouchableOpacity key={op} onPress={() => onChange(op)}
          className={`px-3 py-1.5 rounded-full border ${valorActual === op ? 'bg-primary border-primary' : 'bg-background border-border'}`}>
          <Text className={`text-sm font-medium ${valorActual === op ? 'text-primary-foreground' : 'text-foreground'}`}>
            {op}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const Seccion = ({titulo}: {titulo: string}) => (
  <Text className="mt-2 mb-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
    {titulo}
  </Text>
);

export default function TutorFormScreen({navigation, route}: Props) {
  const tutorExistente = route.params?.tutor;
  const esEdicion = !!tutorExistente;

  const [form, setForm] = useState<CreateTutorInput>({
    nombre:               tutorExistente?.nombre               ?? '',
    apellido_p:           tutorExistente?.apellido_p           ?? '',
    apellido_m:           tutorExistente?.apellido_m           ?? '',
    relacion:             tutorExistente?.relacion             ?? TipoRelacion.PADRE,
    telefono_principal:   tutorExistente?.telefono_principal   ?? '',
    telefono_emergencia:  tutorExistente?.telefono_emergencia  ?? '',
    email:                tutorExistente?.email                ?? '',
  });

  const [loading, setLoading] = useState(false);

  const setField = <K extends keyof CreateTutorInput>(key: K, value: CreateTutorInput[K]) =>
    setForm((prev) => ({...prev, [key]: value}));

  const validar = (): boolean => {
    if (!form.nombre.trim())             { Alert.alert('Requerido', 'El nombre es obligatorio.');            return false; }
    if (!form.apellido_p.trim())         { Alert.alert('Requerido', 'El apellido paterno es obligatorio.');  return false; }
    if (!form.telefono_principal.trim()) { Alert.alert('Requerido', 'El teléfono principal es obligatorio.'); return false; }
    return true;
  };

  const guardar = async () => {
    if (!validar()) return;
    try {
      setLoading(true);
      if (esEdicion && tutorExistente) {
        // ── CORRECCIÓN: construye UpdateTutorInput igual que el web ───────────
        const input: UpdateTutorInput = {
          ...form,
          id_tutor: Number(tutorExistente.id_tutor),
        };
        await updateTutor(tutorExistente.id_tutor, input);
      } else {
        await createTutor(form);
      }
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo guardar el tutor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{padding: 16}} keyboardShouldPersistTaps="handled">

      <Text className="mb-6 text-2xl font-bold text-foreground">
        {esEdicion ? 'Editar tutor' : 'Nuevo tutor'}
      </Text>

      <Seccion titulo="Datos personales" />
      <Campo label="Nombre *"         valor={form.nombre}     onChange={(v) => setField('nombre', v)}     placeholder="María" />
      <Campo label="Apellido Paterno *" valor={form.apellido_p} onChange={(v) => setField('apellido_p', v)} placeholder="López" />
      <Campo label="Apellido Materno" valor={form.apellido_m} onChange={(v) => setField('apellido_m', v)} placeholder="Martínez" />

      {/* CORRECCIÓN: chips usan Object.values → 'PADRE', 'MADRE', 'TIO', 'ABUELO' */}
      <SelectorChips
        label="Relación con el alumno"
        opciones={Object.values(TipoRelacion)}
        valorActual={form.relacion}
        onChange={(v) => setField('relacion', v)}
      />

      <Seccion titulo="Contacto" />
      <Campo label="Teléfono Principal *" valor={form.telefono_principal}
        onChange={(v) => setField('telefono_principal', v)}
        placeholder="5551234567" teclado="phone-pad" />
      <Campo label="Teléfono de Emergencia" valor={form.telefono_emergencia}
        onChange={(v) => setField('telefono_emergencia', v)}
        placeholder="5559876543" teclado="phone-pad" />
      <Campo label="Email" valor={form.email}
        onChange={(v) => setField('email', v)}
        placeholder="tutor@email.com" teclado="email-address" />

      <TouchableOpacity onPress={guardar} disabled={loading}
        className={`rounded-xl py-3 items-center mb-10 mt-4 ${loading ? 'bg-muted' : 'bg-primary'}`}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text className="text-base font-semibold text-primary-foreground">
              {esEdicion ? 'Actualizar tutor' : 'Crear tutor'}
            </Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}
