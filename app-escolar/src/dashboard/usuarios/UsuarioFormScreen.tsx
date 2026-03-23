// ============================================
// RUTA: src/dashboard/usuarios/UsuarioFormScreen.tsx
// ============================================

import React, {useState, useEffect} from 'react';
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
import {Usuario, CreateUsuarioInput, UpdateUsuarioInput} from '@/interfaces/usuario.interface';
import {Empleado} from '@/interfaces/empleado.interface';
import {Alumno} from '@/interfaces/alumno.interface';
import {Tutor} from '@/interfaces/tutor.interface';
import {Rol} from '@/interfaces/rol.interface';
import {createUsuario, updateUsuario} from '@/graphql/usuario-crud';
import {getEmpleados} from '@/graphql/empleado';
import {getAlumnos} from '@/graphql/alumno';
import {getTutores} from '@/graphql/tutor';
import {getAllRoles} from '@/graphql/rol';
import {SelectorModal} from '@/components/SelectorModal';

interface Props {
  navigation: any;
  route: {params?: {usuario?: Usuario}};
}

const Campo = ({label, valor, onChange, placeholder, teclado = 'default', secureTextEntry = false}: {
  label: string; valor: string; onChange: (v: string) => void;
  placeholder?: string; teclado?: any; secureTextEntry?: boolean;
}) => (
  <View className="mb-4">
    <Text className="mb-1 text-sm font-medium text-foreground">{label}</Text>
    <TextInput
      value={valor} onChangeText={onChange} placeholder={placeholder}
      keyboardType={teclado} secureTextEntry={secureTextEntry}
      placeholderTextColor="#9ca3af"
      className="border border-border rounded-lg px-3 py-2.5 text-foreground bg-background"
    />
  </View>
);

const CampoFK = ({label, valor, onSeleccionar, onLimpiar}: {
  label: string; valor: string; onSeleccionar: () => void; onLimpiar: () => void;
}) => (
  <View className="mb-4">
    <Text className="mb-1 text-sm font-medium text-foreground">{label}</Text>
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
  </View>
);

const SelectorRol = ({roles, rolIdActual, onChange}: {
  roles: Rol[]; rolIdActual: number; onChange: (id: number) => void;
}) => (
  <View className="mb-4">
    <Text className="mb-2 text-sm font-medium text-foreground">Rol *</Text>
    {roles.length === 0
      ? <ActivityIndicator size="small" />
      : (
        <View className="flex-row flex-wrap gap-2">
          {roles.map((rol) => (
            <TouchableOpacity key={rol.id_rol} onPress={() => onChange(rol.id_rol)}
              className={`px-3 py-1.5 rounded-full border ${rolIdActual === rol.id_rol ? 'bg-primary border-primary' : 'bg-background border-border'}`}>
              <Text className={`text-sm font-medium ${rolIdActual === rol.id_rol ? 'text-primary-foreground' : 'text-foreground'}`}>
                {rol.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    {!rolIdActual && <Text className="mt-1 text-xs text-destructive">Debes seleccionar un rol</Text>}
  </View>
);

const Seccion = ({titulo}: {titulo: string}) => (
  <Text className="mt-2 mb-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
    {titulo}
  </Text>
);

type SelectorType = 'empleado' | 'alumno' | 'tutor' | null;

export default function UsuarioFormScreen({navigation, route}: Props) {
  const usuarioExistente = route.params?.usuario;
  const esEdicion = !!usuarioExistente;

  const [form, setForm] = useState({
    username:      usuarioExistente?.username      ?? '',
    password_hash: '',                              // Siempre vacío al abrir — igual que el web
    rol_id:        usuarioExistente?.rol_id        ?? 0,
    empleado_id:   usuarioExistente?.empleado_id   ?? null as number | null,
    alumno_id:     usuarioExistente?.alumno_id     ?? null as number | null,
    tutor_id:      usuarioExistente?.tutor_id      ?? null as number | null,
    avatar_url:    usuarioExistente?.avatar_url    ?? '',
    ultimo_acceso: usuarioExistente?.ultimo_acceso ?? new Date().toISOString().split('T')[0],
    activo:        usuarioExistente?.activo        ?? true,
  });

  const [empleadoNombre, setEmpleadoNombre] = useState(
    usuarioExistente?.empleado_id ? `ID: ${usuarioExistente.empleado_id}` : ''
  );
  const [alumnoNombre, setAlumnoNombre] = useState(
    usuarioExistente?.alumno_id ? `ID: ${usuarioExistente.alumno_id}` : ''
  );
  const [tutorNombre, setTutorNombre] = useState(
    usuarioExistente?.tutor_id ? `ID: ${usuarioExistente.tutor_id}` : ''
  );

  const [selectorAbierto, setSelectorAbierto] = useState<SelectorType>(null);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllRoles()
      .then(setRoles)
      .catch((e) => console.error('Error al cargar roles:', e));
  }, []);

  const set = (key: string, value: any) =>
    setForm((prev) => ({...prev, [key]: value}));

  const handleSelectEmpleado = (emp: Empleado) => {
    set('empleado_id', emp.id_empleado);
    setEmpleadoNombre(`${emp.nombre} ${emp.apellido_p}${emp.apellido_m ? ' ' + emp.apellido_m : ''}`);
  };
  const handleSelectAlumno = (al: Alumno) => {
    set('alumno_id', al.id_alumno);
    setAlumnoNombre(`${al.nombre} ${al.apellido_p} · ${al.matricula}`);
  };
  const handleSelectTutor = (tu: Tutor) => {
    set('tutor_id', tu.id_tutor);
    setTutorNombre(`${tu.nombre} ${tu.apellido_p} (${tu.relacion})`);
  };

  const guardar = async () => {
    if (!form.username.trim()) {
      Alert.alert('Requerido', 'El nombre de usuario es obligatorio.');
      return;
    }
    if (!esEdicion && !form.password_hash.trim()) {
      Alert.alert('Requerido', 'La contraseña es obligatoria al crear un usuario.');
      return;
    }
    if (!form.rol_id) {
      Alert.alert('Requerido', 'Debes seleccionar un rol.');
      return;
    }

    try {
      setLoading(true);

      // ── Construye el payload limpio (igual que el web) ───────────────────
      const inputParaEnvio = {
        username:      form.username.trim(),
        password_hash: form.password_hash,
        rol_id:        Number(form.rol_id),
        empleado_id:   form.empleado_id ? Number(form.empleado_id) : null,
        alumno_id:     form.alumno_id   ? Number(form.alumno_id)   : null,
        tutor_id:      form.tutor_id    ? Number(form.tutor_id)    : null,
        avatar_url:    form.avatar_url  || '',
        ultimo_acceso: form.ultimo_acceso,
        activo:        form.activo,
      };

      if (esEdicion && usuarioExistente) {
        // ── CORRECCIÓN: construye UpdateUsuarioInput correctamente ──────────
        const input: UpdateUsuarioInput = {
          ...inputParaEnvio,
          id_usuario: Number(usuarioExistente.id_usuario),
        };
        // ── CORRECCIÓN: elimina password_hash si está vacío ─────────────────
        // (no sobreescribe la contraseña si el usuario no quiso cambiarla)
        if (!input.password_hash) delete input.password_hash;

        await updateUsuario(usuarioExistente.id_usuario, input);
      } else {
        await createUsuario(inputParaEnvio as CreateUsuarioInput);
      }

      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo guardar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{padding: 16}} keyboardShouldPersistTaps="handled">

      <Text className="mb-6 text-2xl font-bold text-foreground">
        {esEdicion ? 'Editar usuario' : 'Nuevo usuario'}
      </Text>

      <Seccion titulo="Credenciales" />
      <Campo label="Username *" valor={form.username}
        onChange={(v) => set('username', v)} placeholder="admin_pandora" />
      <Campo
        label={esEdicion ? 'Nueva contraseña (vacío = sin cambios)' : 'Contraseña *'}
        valor={form.password_hash} onChange={(v) => set('password_hash', v)}
        placeholder="••••••••" secureTextEntry />

      <Seccion titulo="Rol" />
      <SelectorRol roles={roles} rolIdActual={form.rol_id} onChange={(id) => set('rol_id', id)} />

      <View className="flex-row items-center justify-between mt-1 mb-4">
        <Text className="text-sm font-medium text-foreground">Usuario Activo</Text>
        <Switch value={form.activo} onValueChange={(v) => set('activo', v)} />
      </View>

      <Seccion titulo="Vínculos (opcionales)" />

      <CampoFK label="Empleado" valor={empleadoNombre}
        onSeleccionar={() => setSelectorAbierto('empleado')}
        onLimpiar={() => { set('empleado_id', null); setEmpleadoNombre(''); }} />

      <CampoFK label="Alumno" valor={alumnoNombre}
        onSeleccionar={() => setSelectorAbierto('alumno')}
        onLimpiar={() => { set('alumno_id', null); setAlumnoNombre(''); }} />

      <CampoFK label="Tutor" valor={tutorNombre}
        onSeleccionar={() => setSelectorAbierto('tutor')}
        onLimpiar={() => { set('tutor_id', null); setTutorNombre(''); }} />

      <TouchableOpacity onPress={guardar} disabled={loading}
        className={`rounded-xl py-3 items-center mb-10 mt-4 ${loading ? 'bg-muted' : 'bg-primary'}`}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text className="text-base font-semibold text-primary-foreground">
              {esEdicion ? 'Actualizar usuario' : 'Crear usuario'}
            </Text>}
      </TouchableOpacity>

      {/* ═══ Selectores modales ═══════════════════════════════════════════ */}

      <SelectorModal<Empleado>
        visible={selectorAbierto === 'empleado'}
        onClose={() => setSelectorAbierto(null)}
        onSelect={handleSelectEmpleado}
        title="Seleccionar Empleado"
        fetchItems={(p, l) => getEmpleados(p, l)}
        renderItem={(emp) => ({
          id:       emp.id_empleado,
          title:    `${emp.nombre} ${emp.apellido_p}${emp.apellido_m ? ' ' + emp.apellido_m : ''}`,
          subtitle: `#${emp.numero_empleado} · ${emp.puesto} · ${emp.departamento}`,
          badge:    emp.activo ? 'Activo' : 'Inactivo',
        })}
        searchFields={['nombre', 'apellido_p', 'numero_empleado', 'departamento']}
        emptyMessage="No hay empleados registrados"
      />

      <SelectorModal<Alumno>
        visible={selectorAbierto === 'alumno'}
        onClose={() => setSelectorAbierto(null)}
        onSelect={handleSelectAlumno}
        title="Seleccionar Alumno"
        fetchItems={(p, l) => getAlumnos(p, l)}
        renderItem={(al) => ({
          id:       al.id_alumno,
          title:    `${al.nombre} ${al.apellido_p}${al.apellido_m ? ' ' + al.apellido_m : ''}`,
          subtitle: `Matrícula: ${al.matricula} · ${al.genero}`,
          badge:    al.activo ? 'Activo' : 'Inactivo',
        })}
        searchFields={['nombre', 'apellido_p', 'matricula', 'curp']}
        emptyMessage="No hay alumnos registrados"
      />

      <SelectorModal<Tutor>
        visible={selectorAbierto === 'tutor'}
        onClose={() => setSelectorAbierto(null)}
        onSelect={handleSelectTutor}
        title="Seleccionar Tutor"
        fetchItems={(p, l) => getTutores(p, l)}
        renderItem={(tu) => ({
          id:       tu.id_tutor,
          title:    `${tu.nombre} ${tu.apellido_p}${tu.apellido_m ? ' ' + tu.apellido_m : ''}`,
          subtitle: `${tu.relacion} · ${tu.telefono_principal}`,
          badge:    tu.relacion,
        })}
        searchFields={['nombre', 'apellido_p', 'email', 'telefono_principal']}
        emptyMessage="No hay tutores registrados"
      />

    </ScrollView>
  );
}
