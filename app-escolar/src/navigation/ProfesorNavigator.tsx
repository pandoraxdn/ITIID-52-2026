// ============================================
// RUTA: src/navigation/ProfesorNavigator.tsx
// ============================================

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfesoresListScreen from '@/dashboard/profesores/ProfesoresListScreen';
import ProfesorFormScreen from '@/dashboard/profesores/ProfesorFormScreen';
import {type Profesor} from '@/interfaces/profesor.interface';

export type ProfesorStackParamList = {
  ProfesoresList: undefined;
  ProfesorForm: {profesor?: Profesor};
};

const Stack = createNativeStackNavigator<ProfesorStackParamList>();

export default function ProfesorNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfesoresList" component={ProfesoresListScreen} options={{headerShown: false}} />
      <Stack.Screen name="ProfesorForm" component={ProfesorFormScreen}
        options={({route}) => ({title: route.params?.profesor ? 'Editar profesor' : 'Nuevo profesor'})} />
    </Stack.Navigator>
  );
}
