import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import EmpleadoNavigation from './EmpleadoNavigator';
import LoginScreen from '@/screens/LoginScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: '#ffffff'},
        headerTintColor: '#0f172a',
        headerTitleStyle: {fontWeight: 'bold'},
        drawerActiveTintColor: '#0f172a',
        drawerInactiveTintColor: '#6b7280',
      }}
    >
      {/* Módulo de empleados */}
      {/* component apunta al Stack Navigator de empleados, no a la pantalla directamente */}
      <Drawer.Screen
        name="Empleados"
        component={EmpleadoNavigation}
        options={{title: 'Empleados'}}
      />

      <Drawer.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{title: 'Login'}}
      />
      {/* Ejemplo:
      <Drawer.Screen
        name="Profesores"
        component={ProfesorNavigation}
        options={{ title: 'Profesores' }}
      />
      */}
    </Drawer.Navigator>
  );
}
