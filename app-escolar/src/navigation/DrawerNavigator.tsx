// ============================================
// RUTA: src/navigation/DrawerNavigator.tsx
// ============================================

import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import EmpleadoNavigation  from './EmpleadoNavigator';
import ProfesorNavigator   from './ProfesorNavigator';
import AlumnoNavigator     from './AlumnoNavigator';
import RolNavigator        from './RolNavigator';
import TutorNavigator      from './TutorNavigator';
import UsuarioNavigator    from './UsuarioNavigator';

import HomeScreen          from '@/screens/HomeScreen';
import LoginScreen         from '@/screens/LoginScreen';

import {useAuth}  from '@/context/AuthContext';
import {useTheme} from '@/context/ThemeContext';

// ─── Stack público (Home + Login) ─────────────────────────────────────────────
const PublicStack = createNativeStackNavigator();

function PublicNavigator() {
  return (
    <PublicStack.Navigator screenOptions={{headerShown: false}}>
      <PublicStack.Screen name="Home"  component={HomeScreen} />
      <PublicStack.Screen name="Login" component={LoginScreen} />
    </PublicStack.Navigator>
  );
}

// ─── Drawer privado ────────────────────────────────────────────────────────────
const Drawer = createDrawerNavigator();

const getColors = (isDark: boolean) => ({
  bg:          isDark ? '#0a0806'              : '#faf9f7',
  accent:      '#c9a84c',
  glassBorder: 'rgba(192,164,100,0.22)',
  textSub:     isDark ? '#a89070'              : '#7a6a50',
  textMain:    isDark ? '#f0ebe0'              : '#2a1f0e',
  toggleBg:    isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
  logoutBg:    'rgba(180,40,40,0.12)',
  logoutBorder:'rgba(220,60,60,0.2)',
});

function ThemeToggleBtn() {
  const {isDark, toggleTheme} = useTheme();
  const C = getColors(isDark);
  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[styles.themeBtn, {backgroundColor: C.toggleBg, borderColor: C.glassBorder}]}
      activeOpacity={0.7}
    >
      <Text style={styles.themeIcon}>{isDark ? '☀️' : '🌙'}</Text>
      <Text style={[styles.themeText, {color: C.textMain}]}>
        {isDark ? 'Tema Claro' : 'Tema Oscuro'}
      </Text>
    </TouchableOpacity>
  );
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const {user, cerrarSesion} = useAuth();
  const {isDark} = useTheme();
  const C = getColors(isDark);

  const avatarUri = user?.avatar_url
    ? (user.avatar_url.startsWith('data:') ? user.avatar_url : `data:image/jpeg;base64,${user.avatar_url}`)
    : null;

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={[styles.drawerContainer, {backgroundColor: C.bg}]}>
      <View style={styles.profileSection}>
        {avatarUri
          ? <Image source={{uri: avatarUri}} style={[styles.avatar, {borderColor: C.accent}]} />
          : (
            <View style={[styles.avatarFallback, {borderColor: C.accent}]}>
              <Text style={[styles.avatarFallbackText, {color: C.accent}]}>
                {user?.username?.charAt(0).toUpperCase() ?? '?'}
              </Text>
            </View>
          )}
        <Text style={[styles.username, {color: C.textMain}]}>{user?.username}</Text>
        <Text style={[styles.userRole,  {color: C.textSub}]}>Sistema Escolar</Text>
      </View>

      <View style={[styles.separator, {backgroundColor: C.glassBorder}]} />
      <DrawerItemList {...props} />
      <View style={[styles.separator, {backgroundColor: C.glassBorder}]} />
      <ThemeToggleBtn />
      <View style={[styles.separator, {backgroundColor: C.glassBorder}]} />

      <Pressable
        style={({pressed}) => [styles.logoutBtn, {backgroundColor: C.logoutBg, borderColor: C.logoutBorder}, pressed && {opacity: 0.7}]}
        onPress={cerrarSesion}
      >
        <Text style={styles.logoutIcon}>⎋</Text>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </DrawerContentScrollView>
  );
}

// ─── Navigator principal ──────────────────────────────────────────────────────
export default function DrawerNavigator() {
  const {isAuthenticated, cargando} = useAuth();
  const {isDark} = useTheme();
  const C = getColors(isDark);

  if (cargando) {
    return (
      <View style={[styles.loadingContainer, {backgroundColor: C.bg}]}>
        <ActivityIndicator size="large" color={C.accent} />
      </View>
    );
  }

  // Sin sesión → stack público (Home + Login)
  if (!isAuthenticated) {
    return <PublicNavigator />;
  }

  // Con sesión → drawer completo
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle:      {backgroundColor: C.bg},
        headerTintColor:  C.accent,
        headerTitleStyle: {fontWeight: 'bold', color: C.textMain},
        drawerStyle:      {backgroundColor: C.bg},
        drawerActiveTintColor:        C.accent,
        drawerInactiveTintColor:      C.textSub,
        drawerActiveBackgroundColor:  'rgba(201,168,76,0.1)',
      }}
    >
      <Drawer.Screen name="Empleados"  component={EmpleadoNavigation} options={{title: '👔  Empleados'}} />
      <Drawer.Screen name="Profesores" component={ProfesorNavigator}  options={{title: '🎓  Profesores'}} />
      <Drawer.Screen name="Alumnos"    component={AlumnoNavigator}    options={{title: '📚  Alumnos'}} />
      <Drawer.Screen name="Tutores"    component={TutorNavigator}     options={{title: '👨‍👩‍👦  Tutores'}} />
      <Drawer.Screen name="Roles"      component={RolNavigator}       options={{title: '🔐  Roles'}} />
      <Drawer.Screen name="Usuarios"   component={UsuarioNavigator}   options={{title: '👤  Usuarios'}} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer:    {flex: 1, alignItems: 'center', justifyContent: 'center'},
  drawerContainer:     {flex: 1, paddingBottom: 24},
  profileSection:      {alignItems: 'center', paddingTop: 32, paddingBottom: 20, paddingHorizontal: 16},
  avatar:              {width: 200, height: 200, borderRadius: 100, borderWidth: 5, marginBottom: 12},
  avatarFallback:      {width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(201,168,76,0.15)', borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 12},
  avatarFallbackText:  {fontSize: 28, fontWeight: '700'},
  username:            {fontSize: 30, fontWeight: '700', letterSpacing: 0.3},
  userRole:            {fontSize: 15, marginTop: 2},
  separator:           {height: 1, marginHorizontal: 16, marginVertical: 8},
  themeBtn:            {flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, marginVertical: 8, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1},
  themeIcon:           {fontSize: 16},
  themeText:           {fontSize: 14, fontWeight: '600'},
  logoutBtn:           {flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginTop: 8, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1},
  logoutIcon:          {fontSize: 18, color: '#e55'},
  logoutText:          {fontSize: 14, fontWeight: '600', color: '#e55'},
});
