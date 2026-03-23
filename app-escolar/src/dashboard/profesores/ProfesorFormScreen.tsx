// ============================================
// RUTA: src/dashboard/profesores/ProfesorFormScreen.tsx
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
import {
  Profesor,
  CreateProfesorInput,
  UpdateProfesorInput,
  TipoNivelEstudio,
} from '@/interfaces/profesor.interface';
import {Empleado} from '@/interfaces/empleado.interface';
import {createProfesor, updateProfesor} from '@/graphql/profesor';
import {getEmpleados} from '@/graphql/empleado';
import {SelectorModal} from '@/components/SelectorModal';

interface Props {
  navigation: any;
  route: {params?: {profesor?: Profesor}};
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

const CampoFK = ({label, valor, onSeleccionar, onLimpiar, requerido = false}: {
  label: string; valor: string; onSeleccionar: () => void; onLimpiar: () => void; requerido?: boolean;
}) => (
  <View className="mb-4">
    <Text className="mb-1 text-sm font-medium text-foreground">{label}{requerido ? ' *' : ''}</Text>
    <View className="flex-row gap-2">
      <View className="flex-1 border border-border rounded-lg px-3 py-2.5 bg-muted justify-center">
        <Text className={valor ? 'text-foreground' : 'text-muted-foreground'} numberOfLines={1}>
          {valor || 'Ninguno seleccionado'}
        </Text>
      </View>
      <TouchableOpacity onPress={onLimpiar}
        className="px-3 py-2.5 border border-border rounded-lg bg-background justify-center">
        <Text className="text-sm text-muted-foreground">Limpiar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSeleccionar}
        className="px-3 py-2.5 rounded-lg bg-primary justify-center">
        <Text className="text-sm font-medium text-primary-foreground">Elegir</Text>
      </TouchableOpacity>
    </View>
    {requerido && !valor && (
      <Text className="mt-1 text-xs text-destructive">Debes seleccionar un empleado</Text>
    )}
  </View>
);

const Seccion = ({titulo}: {titulo: string}) => (
  <Text className="mt-2 mb-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
    {titulo}
  </Text>
);

export default function ProfesorFormScreen({navigation, route}: Props) {
  const profesorExistente = route.params?.profesor;
  const esEdicion = !!profesorExistente;

  const [form, setForm] = useState<CreateProfesorInput>({
    empleado_id:        profesorExistente?.empleado_id        ?? 0,
    especialidad:       profesorExistente?.especialidad       ?? '',
    nivel_estudios:     profesorExistente?.nivel_estudios     ?? TipoNivelEstudio.LICENCIATURA,
    cedula_profesional: profesorExistente?.cedula_profesional ?? '',
  });

  const [empleadoNombre, setEmpleadoNombre] = useState<string>(
    profesorExistente?.empleado_id ? `ID: ${profesorExistente.empleado_id}` : ''
  );
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const setField = <K extends keyof CreateProfesorInput>(key: K, value: CreateProfesorInput[K]) =>
    setForm((prev) => ({...prev, [key]: value}));

  const handleSelectEmpleado = (emp: Empleado) => {
    setField('empleado_id', emp.id_empleado);
    setEmpleadoNombre(
      `${emp.nombre} ${emp.apellido_p}${emp.apellido_m ? ' ' + emp.apellido_m : ''}`
    );
  };

  const validar = (): boolean => {
    if (!form.empleado_id)             { Alert.alert('Requerido', 'Debes seleccionar un empleado.');  return false; }
    if (!form.especialidad.trim())     { Alert.alert('Requerido', 'La especialidad es obligatoria.'); return false; }
    if (!form.cedula_profesional.trim()) { Alert.alert('Requerido', 'La cédula es obligatoria.');     return false; }
    return true;
  };

  const guardar = async () => {
    if (!validar()) return;
    try {
      setLoading(true);
      if (esEdicion && profesorExistente) {
        // ── CORRECCIÓN: construye UpdateProfesorInput igual que el web ────────
        const input: UpdateProfesorInput = {
          ...form,
          empleado_id: Number(form.empleado_id),   // ← cast a Number() explícito
          id_profesor: Number(profesorExistente.id_profesor),
        };
        await updateProfesor(profesorExistente.id_profesor, input);
      } else {
        await createProfesor({
          ...form,
          empleado_id: Number(form.empleado_id),   // ← cast a Number() explícito
        });
      }
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo guardar el profesor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{padding: 16}} keyboardShouldPersistTaps="handled">

      <Text className="mb-6 text-2xl font-bold text-foreground">
        {esEdicion ? 'Editar profesor' : 'Nuevo profesor'}
      </Text>

      <Seccion titulo="Empleado vinculado" />
      <CampoFK
        label="Empleado"
        valor={empleadoNombre}
        onSeleccionar={() => setSelectorVisible(true)}
        onLimpiar={() => { setField('empleado_id', 0); setEmpleadoNombre(''); }}
        requerido
      />

      <Seccion titulo="Datos académicos" />
      <Campo label="Especialidad *" valor={form.especialidad}
        onChange={(v) => setField('especialidad', v)} placeholder="Matemáticas, Física..." />
      <Campo label="Cédula Profesional *" valor={form.cedula_profesional}
        onChange={(v) => setField('cedula_profesional', v)} placeholder="12345678" />
      <SelectorChips
        label="Nivel de Estudios"
        opciones={Object.values(TipoNivelEstudio)}
        valorActual={form.nivel_estudios}
        onChange={(v) => setField('nivel_estudios', v)}
      />

      <TouchableOpacity onPress={guardar} disabled={loading}
        className={`rounded-xl py-3 items-center mb-10 mt-4 ${loading ? 'bg-muted' : 'bg-primary'}`}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text className="text-base font-semibold text-primary-foreground">
              {esEdicion ? 'Actualizar profesor' : 'Crear profesor'}
            </Text>}
      </TouchableOpacity>

      {/* ── Modal selector de empleados ── */}
      <SelectorModal<Empleado>
        visible={selectorVisible}
        onClose={() => setSelectorVisible(false)}
        onSelect={handleSelectEmpleado}
        title="Seleccionar Empleado"
        fetchItems={(p, l) => getEmpleados(p, l)}
        renderItem={(emp) => ({
          id:       emp.id_empleado,
          title:    `${emp.nombre} ${emp.apellido_p}${emp.apellido_m ? ' ' + emp.apellido_m : ''}`,
          subtitle: `#${emp.numero_empleado} · ${emp.puesto} · ${emp.departamento}`,
          badge:    emp.activo ? 'Activo' : 'Inactivo',
        })}
        searchFields={['nombre', 'apellido_p', 'numero_empleado', 'email_institucional']}
        emptyMessage="No hay empleados registrados"
      />
    </ScrollView>
  );
}
