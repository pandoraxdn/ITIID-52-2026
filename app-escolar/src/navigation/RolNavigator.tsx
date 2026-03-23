// ============================================
// RUTA: src/navigation/RolNavigator.tsx
// ============================================

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RolesListScreen from '@/dashboard/roles/RolesListScreen';
import RolFormScreen from '@/dashboard/roles/RolFormScreen';
import {type Rol} from '@/interfaces/rol.interface';

export type RolStackParamList = {
  RolesList: undefined;
  RolForm: {rol?: Rol};
};

const Stack = createNativeStackNavigator<RolStackParamList>();

export default function RolNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RolesList" component={RolesListScreen} options={{headerShown: false}} />
      <Stack.Screen name="RolForm" component={RolFormScreen}
        options={({route}) => ({title: route.params?.rol ? 'Editar rol' : 'Nuevo rol'})} />
    </Stack.Navigator>
  );
}
