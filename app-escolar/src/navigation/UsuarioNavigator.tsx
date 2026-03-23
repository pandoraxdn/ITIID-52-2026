// ============================================
// RUTA: src/navigation/UsuarioNavigator.tsx
// ============================================

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import UsuariosListScreen from '@/dashboard/usuarios/UsuariosListScreen';
import UsuarioFormScreen from '@/dashboard/usuarios/UsuarioFormScreen';
import {type Usuario} from '@/interfaces/usuario.interface';

export type UsuarioStackParamList = {
  UsuariosList: undefined;
  UsuarioForm: {usuario?: Usuario};
};

const Stack = createNativeStackNavigator<UsuarioStackParamList>();

export default function UsuarioNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UsuariosList" component={UsuariosListScreen} options={{headerShown: false}} />
      <Stack.Screen name="UsuarioForm" component={UsuarioFormScreen}
        options={({route}) => ({title: route.params?.usuario ? 'Editar usuario' : 'Nuevo usuario'})} />
    </Stack.Navigator>
  );
}
