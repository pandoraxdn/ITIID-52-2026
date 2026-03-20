// ============================================
// RUTA: src/navigation/DrawerNavigator.tsx
// PROPÓSITO: Controla qué se muestra según la sesión:
//            Sin sesión  → LoginScreen
//            Con sesión  → Drawer con avatar y botón logout
// ============================================

import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import EmpleadoNavigation from './EmpleadoNavigator';
import LoginScreen from '@/screens/LoginScreen';
import {useAuth} from '@/context/AuthContext';

const Drawer = createDrawerNavigator();

const C = {
  bg: '#0a0806',
  accent: '#c9a84c',
  glassBorder: 'rgba(192,164,100,0.22)',
  textSub: '#a89070',
  textMain: '#f0ebe0',
};

// ─── Contenido personalizado del drawer ──────────────────────────────────────
function CustomDrawerContent(props: DrawerContentComponentProps) {
  const {user, cerrarSesion} = useAuth();

  // avatar_url viene en base64 — agregamos el prefijo si no lo tiene
  const avatarUri = user?.avatar_url
    ? (user.avatar_url.startsWith('data:')
        ? user.avatar_url
        : `data:image/jpeg;base64,${user.avatar_url}`)
    : null;

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>

      {/* ── Perfil ── */}
      <View style={styles.profileSection}>
        {avatarUri ? (
          <Image source={{uri: avatarUri}} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarFallbackText}>
              {user?.username?.charAt(0).toUpperCase() ?? '?'}
            </Text>
          </View>
        )}
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.userRole}>Sistema Escolar</Text>
      </View>

      <View style={styles.separator} />

      {/* ── Rutas del drawer ── */}
      <DrawerItemList {...props} />

      <View style={styles.separator} />

      {/* ── Botón cerrar sesión ── */}
      <Pressable
        style={({pressed}) => [styles.logoutBtn, pressed && {opacity: 0.7}]}
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

  // Spinner mientras se recupera la sesión de AsyncStorage al arrancar
  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={C.accent} />
      </View>
    );
  }

  // Sin sesión → solo el login, sin drawer
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Con sesión → drawer completo con tema dorado
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {backgroundColor: C.bg},
        headerTintColor: C.accent,
        headerTitleStyle: {fontWeight: 'bold', color: C.textMain},
        drawerStyle: {backgroundColor: C.bg},
        drawerActiveTintColor: C.accent,
        drawerInactiveTintColor: C.textSub,
        drawerActiveBackgroundColor: 'rgba(201,168,76,0.1)',
      }}
    >
      <Drawer.Screen
        name="Empleados"
        component={EmpleadoNavigation}
        options={{title: 'Empleados'}}
      />
    </Drawer.Navigator>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  loadingContainer: {flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg},
  drawerContainer: {flex: 1, backgroundColor: C.bg, paddingBottom: 24},
  profileSection: {alignItems: 'center', paddingTop: 32, paddingBottom: 20, paddingHorizontal: 16},
  avatar: {width: 120, height: 120, borderRadius: 100, borderWidth: 5, borderColor: C.accent, marginBottom: 12},
  avatarFallback: {width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(201,168,76,0.15)', borderWidth: 2, borderColor: C.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 12},
  avatarFallbackText: {fontSize: 28, fontWeight: '700', color: C.accent},
  username: {fontSize: 30, fontWeight: '700', color: C.textMain, letterSpacing: 0.3},
  userRole: {fontSize: 12, color: C.textSub, marginTop: 2},
  separator: {height: 1, backgroundColor: C.glassBorder, marginHorizontal: 16, marginVertical: 8},
  logoutBtn: {flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginTop: 8, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, backgroundColor: 'rgba(180,40,40,0.12)', borderWidth: 1, borderColor: 'rgba(220,60,60,0.2)'},
  logoutIcon: {fontSize: 18, color: '#e55'},
  logoutText: {fontSize: 14, fontWeight: '600', color: '#e55'},
});
