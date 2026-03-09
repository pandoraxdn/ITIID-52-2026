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
import {Empleado, CreateEmpleadoInput, TipoEmpleado, TipoPuesto}
  from '@/interfaces/empleado.interface';
import {createEmpleado, updateEmpleado}
  from '@/graphql/empleado';

interface Props {
  navigation: any;
  route: {
    params?: {
      empleado?: Empleado; // Si viene un empleado → modo edición
    };
  };
}

// ─── Campo de texto reutilizable ──────────────────────────────────────────────
const Campo = ({
  label,
  valor,
  onChange,
  placeholder,
  teclado = 'default',
}: {
  label: string;
  valor: string;
  onChange: (v: string) => void;
  placeholder?: string;
  teclado?: 'default' | 'email-address' | 'phone-pad';
}) => (
  <View className="mb-4">
    <Text className="mb-1 text-sm font-medium text-foreground">{label}</Text>
    <TextInput
      value={valor}
      onChangeText={onChange}
      placeholder={placeholder}
      keyboardType={teclado}
      placeholderTextColor="#9ca3af"
      className="border border-border rounded-lg px-3 py-2.5 text-foreground bg-background"
    />
  </View>
);

// ─── Selector de opciones tipo chips ─────────────────────────────────────────
// Muestra botones para elegir entre un conjunto fijo de valores
const SelectorChips = <T extends string>({
  label,
  opciones,
  valorActual,
  onChange,
}: {
  label: string;
  opciones: T[];
  valorActual: T;
  onChange: (v: T) => void;
}) => (
  <View className="mb-4">
    <Text className="mb-2 text-sm font-medium text-foreground">{label}</Text>
    <View className="flex-row flex-wrap gap-2">
      {opciones.map((op) => (
        <TouchableOpacity
          key={op}
          onPress={() => onChange(op)}
          className={`px-3 py-1.5 rounded-lg border ${valorActual === op
            ? 'bg-primary border-primary'
            : 'bg-background border-border'
            }`}
        >
          <Text className={`text-sm ${valorActual === op ? 'text-primary-foreground' : 'text-foreground'}`}>
            {op}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// ─── Separador de sección ─────────────────────────────────────────────────────
const Seccion = ({titulo}: {titulo: string}) => (
  <Text className="mt-2 mb-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
    {titulo}
  </Text>
);

// ─── Pantalla del formulario ──────────────────────────────────────────────────
export default function EmpleadoFormScreen({navigation, route}: Props) {
  const empleadoEditar = route.params?.empleado;
  const esEdicion = !!empleadoEditar;    // true → editar | false → crear

  // Estado del formulario
  // Si estamos editando, precargamos los valores del empleado
  const [form, setForm] = useState<CreateEmpleadoInput>({
    numero_empleado: empleadoEditar?.numero_empleado ?? '',
    nombre: empleadoEditar?.nombre ?? '',
    apellido_p: empleadoEditar?.apellido_p ?? '',
    apellido_m: empleadoEditar?.apellido_m ?? '',
    email_personal: empleadoEditar?.email_personal ?? '',
    email_institucional: empleadoEditar?.email_institucional ?? '',
    telefono: empleadoEditar?.telefono ?? '',
    tipo_empleado: empleadoEditar?.tipo_empleado ?? 'DOCENTE',
    puesto: empleadoEditar?.puesto ?? 'MAESTRO',
    departamento: empleadoEditar?.departamento ?? '',
    fecha_contratacion: empleadoEditar?.fecha_contratacion ?? '',
    activo: empleadoEditar?.activo ?? true,
  });

  const [loading, setLoading] = useState(false);

  // Actualiza un campo individual del formulario
  const setField = <K extends keyof CreateEmpleadoInput>(
    campo: K,
    valor: CreateEmpleadoInput[K]
  ) => setForm((prev) => ({...prev, [campo]: valor}));

  // Validación mínima antes de enviar
  const validar = (): boolean => {
    const requeridos: (keyof CreateEmpleadoInput)[] = [
      'numero_empleado', 'nombre', 'apellido_p',
      'email_personal', 'email_institucional',
      'telefono', 'departamento', 'fecha_contratacion',
    ];
    for (const campo of requeridos) {
      if (!form[campo]) {
        Alert.alert('Campo requerido', `El campo "${campo}" no puede estar vacío.`);
        return false;
      }
    }
    return true;
  };

  // Enviar al servidor
  const guardar = async () => {
    if (!validar()) return;
    try {
      setLoading(true);
      if (esEdicion) {
        await updateEmpleado(empleadoEditar!.id_empleado, form);
        Alert.alert('Éxito', 'Empleado actualizado correctamente.');
      } else {
        await createEmpleado(form);
        Alert.alert('Éxito', 'Empleado creado correctamente.');
      }
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Ocurrió un error al guardar.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{padding: 16}}
      keyboardShouldPersistTaps="handled"
    >
      <Text className="mb-6 text-2xl font-bold text-foreground">
        {esEdicion ? 'Editar empleado' : 'Nuevo empleado'}
      </Text>

      {/* ── Datos personales ── */}
      <Seccion titulo="Datos personales" />
      <Campo label="Número de empleado" valor={form.numero_empleado}
        onChange={(v) => setField('numero_empleado', v)} placeholder="EMP-001" />
      <Campo label="Nombre" valor={form.nombre}
        onChange={(v) => setField('nombre', v)} placeholder="Juan" />
      <Campo label="Apellido paterno" valor={form.apellido_p}
        onChange={(v) => setField('apellido_p', v)} placeholder="García" />
      <Campo label="Apellido materno" valor={form.apellido_m}
        onChange={(v) => setField('apellido_m', v)} placeholder="López" />

      {/* ── Contacto ── */}
      <Seccion titulo="Contacto" />
      <Campo label="Email personal" valor={form.email_personal}
        onChange={(v) => setField('email_personal', v)}
        placeholder="juan@gmail.com" teclado="email-address" />
      <Campo label="Email institucional" valor={form.email_institucional}
        onChange={(v) => setField('email_institucional', v)}
        placeholder="juan@escuela.edu.mx" teclado="email-address" />
      <Campo label="Teléfono" valor={form.telefono}
        onChange={(v) => setField('telefono', v)}
        placeholder="7221234567" teclado="phone-pad" />

      {/* ── Datos laborales ── */}
      <Seccion titulo="Datos laborales" />
      <SelectorChips
        label="Tipo de empleado"
        opciones={['DOCENTE', 'ADMINISTRATIVO', 'OPERATIVO'] as TipoEmpleado[]}
        valorActual={form.tipo_empleado}
        onChange={(v) => setField('tipo_empleado', v)}
      />
      <SelectorChips
        label="Puesto"
        opciones={['MAESTRO', 'DIRECTOR', 'LIMPIEZA', 'SEGURIDAD'] as TipoPuesto[]}
        valorActual={form.puesto}
        onChange={(v) => setField('puesto', v)}
      />
      <Campo label="Departamento" valor={form.departamento}
        onChange={(v) => setField('departamento', v)} placeholder="Matemáticas" />
      <Campo label="Fecha de contratación (YYYY-MM-DD)" valor={form.fecha_contratacion}
        onChange={(v) => setField('fecha_contratacion', v)} placeholder="2024-01-15" />

      {/* ── Activo ── */}
      <View className="flex-row items-center justify-between mt-1 mb-6">
        <Text className="text-sm font-medium text-foreground">Empleado activo</Text>
        <Switch value={form.activo} onValueChange={(v) => setField('activo', v)} />
      </View>

      {/* ── Botón guardar ── */}
      <TouchableOpacity
        onPress={guardar}
        disabled={loading}
        className={`rounded-xl py-3 items-center mb-10 ${loading ? 'bg-muted' : 'bg-primary'}`}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text className="text-base font-semibold text-primary-foreground">
            {esEdicion ? 'Actualizar empleado' : 'Crear empleado'}
          </Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
}
