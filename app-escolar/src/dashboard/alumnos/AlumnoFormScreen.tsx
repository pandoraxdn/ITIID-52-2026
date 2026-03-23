// ============================================
// RUTA: src/dashboard/alumnos/AlumnoFormScreen.tsx
//
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
  Switch,
} from 'react-native';
import {
  Alumno,
  CreateAlumnoInput,
  UpdateAlumnoInput,
  Genero,
  TipoSangre,
} from '@/interfaces/alumno.interface';
import {createAlumno, updateAlumno} from '@/graphql/alumno';

interface Props {
  navigation: any;
  route: {params?: {alumno?: Alumno}};
}

const Campo = ({label, valor, onChange, placeholder, teclado = 'default', multiline = false}: {
  label: string; valor: string; onChange: (v: string) => void;
  placeholder?: string; teclado?: any; multiline?: boolean;
}) => (
  <View className="mb-4">
    <Text className="mb-1 text-sm font-medium text-foreground">{label}</Text>
    <TextInput
      value={valor} onChangeText={onChange} placeholder={placeholder}
      keyboardType={teclado} placeholderTextColor="#9ca3af"
      multiline={multiline} numberOfLines={multiline ? 3 : 1}
      className={`border border-border rounded-lg px-3 py-2.5 text-foreground bg-background ${multiline ? 'h-20' : ''}`}
    />
  </View>
);

const SelectorChips = <T extends string>({label, opciones, valorActual, onChange}: {
  label: string; opciones: T[]; valorActual: string; onChange: (v: T) => void;
}) => (
  <View className="mb-4">
    <Text className="mb-2 text-sm font-medium text-foreground">{label}</Text>
    <View className="flex-row flex-wrap gap-2">
      {opciones.map((op) => (
        <TouchableOpacity key={op} onPress={() => onChange(op)}
          className={`px-3 py-1.5 rounded-full border ${valorActual === op ? 'bg-primary border-primary' : 'bg-background border-border'}`}>
          <Text className={`text-xs font-medium ${valorActual === op ? 'text-primary-foreground' : 'text-foreground'}`}>
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

export default function AlumnoFormScreen({navigation, route}: Props) {
  const alumnoExistente = route.params?.alumno;
  const esEdicion = !!alumnoExistente;

  const [form, setForm] = useState<CreateAlumnoInput>({
    matricula:           alumnoExistente?.matricula           ?? '',
    nombre:              alumnoExistente?.nombre              ?? '',
    apellido_p:          alumnoExistente?.apellido_p          ?? '',
    apellido_m:          alumnoExistente?.apellido_m          ?? '',
    genero:              alumnoExistente?.genero              ?? Genero.MASCULINO,
    curp:                alumnoExistente?.curp                ?? '',
    email_institucional: alumnoExistente?.email_institucional ?? '',
    direccion:           alumnoExistente?.direccion           ?? '',
    tipo_sangre:         alumnoExistente?.tipo_sangre         ?? TipoSangre.O_POSITIVO,
    alergias:            alumnoExistente?.alergias            ?? '',
    condiciones_medicas: alumnoExistente?.condiciones_medicas ?? '',
    fecha_ingreso:       alumnoExistente?.fecha_ingreso       ?? new Date().toISOString().split('T')[0],
    activo:              alumnoExistente?.activo              ?? true,
  });

  const [loading, setLoading] = useState(false);

  const setField = <K extends keyof CreateAlumnoInput>(key: K, value: CreateAlumnoInput[K]) =>
    setForm((prev) => ({...prev, [key]: value}));

  const validar = (): boolean => {
    if (!form.matricula.trim())  { Alert.alert('Requerido', 'La matrícula es obligatoria.');  return false; }
    if (!form.nombre.trim())     { Alert.alert('Requerido', 'El nombre es obligatorio.');     return false; }
    if (!form.apellido_p.trim()) { Alert.alert('Requerido', 'El apellido paterno es obligatorio.'); return false; }
    if (!form.curp.trim())       { Alert.alert('Requerido', 'El CURP es obligatorio.');       return false; }
    return true;
  };

  const guardar = async () => {
    if (!validar()) return;
    try {
      setLoading(true);
      if (esEdicion && alumnoExistente) {
        // ── CORRECCIÓN: construye UpdateAlumnoInput igual que el web ──────────
        const input: UpdateAlumnoInput = {...form, id_alumno: Number(alumnoExistente.id_alumno)};
        await updateAlumno(alumnoExistente.id_alumno, input);
      } else {
        await createAlumno(form);
      }
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo guardar el alumno.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{padding: 16}} keyboardShouldPersistTaps="handled">

      <Text className="mb-6 text-2xl font-bold text-foreground">
        {esEdicion ? 'Editar alumno' : 'Nuevo alumno'}
      </Text>

      <Seccion titulo="Datos personales" />
      <Campo label="Matrícula *"      valor={form.matricula}     onChange={(v) => setField('matricula', v)}     placeholder="2024-001" />
      <Campo label="Nombre *"         valor={form.nombre}        onChange={(v) => setField('nombre', v)}        placeholder="Juan" />
      <Campo label="Apellido Paterno *" valor={form.apellido_p}  onChange={(v) => setField('apellido_p', v)}    placeholder="Pérez" />
      <Campo label="Apellido Materno" valor={form.apellido_m}    onChange={(v) => setField('apellido_m', v)}    placeholder="García" />
      <Campo label="CURP *"           valor={form.curp}          onChange={(v) => setField('curp', v.toUpperCase())} placeholder="PEGJ020101HDFRZN01" />

      {/* CORRECCIÓN: chips usan valores del enum (MASCULINO, FEMENINO, OTRO) */}
      <SelectorChips
        label="Género"
        opciones={Object.values(Genero) as Genero[]}
        valorActual={form.genero}
        onChange={(v) => setField('genero', v)}
      />

      <Seccion titulo="Contacto y dirección" />
      <Campo label="Email Institucional" valor={form.email_institucional}
        onChange={(v) => setField('email_institucional', v)}
        placeholder="alumno@pandora.edu.mx" teclado="email-address" />
      <Campo label="Dirección"  valor={form.direccion}
        onChange={(v) => setField('direccion', v)} placeholder="Calle, Col., Ciudad" multiline />

      <Seccion titulo="Datos médicos" />
      {/* CORRECCIÓN: chips usan valores reales del enum: 'A+', 'A-', 'B+', etc. */}
      <SelectorChips
        label="Tipo de Sangre"
        opciones={Object.values(TipoSangre) as TipoSangre[]}
        valorActual={form.tipo_sangre}
        onChange={(v) => setField('tipo_sangre', v)}
      />
      <Campo label="Alergias"            valor={form.alergias}            onChange={(v) => setField('alergias', v)}            placeholder="Ninguna / Penicilina..." multiline />
      <Campo label="Condiciones médicas" valor={form.condiciones_medicas} onChange={(v) => setField('condiciones_medicas', v)} placeholder="Ninguna..."              multiline />

      <Seccion titulo="Datos de ingreso" />
      <Campo label="Fecha de Ingreso (YYYY-MM-DD)" valor={form.fecha_ingreso}
        onChange={(v) => setField('fecha_ingreso', v)} placeholder="2024-08-15" />

      <View className="flex-row items-center justify-between mt-1 mb-6">
        <Text className="text-sm font-medium text-foreground">Alumno Activo</Text>
        <Switch value={form.activo} onValueChange={(v) => setField('activo', v)} />
      </View>

      <TouchableOpacity onPress={guardar} disabled={loading}
        className={`rounded-xl py-3 items-center mb-10 ${loading ? 'bg-muted' : 'bg-primary'}`}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text className="text-base font-semibold text-primary-foreground">
              {esEdicion ? 'Actualizar alumno' : 'Crear alumno'}
            </Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}
