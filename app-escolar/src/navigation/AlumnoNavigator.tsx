// ============================================
// RUTA: src/navigation/AlumnoNavigator.tsx
// ============================================

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AlumnosListScreen from '@/dashboard/alumnos/AlumnosListScreen';
import AlumnoFormScreen from '@/dashboard/alumnos/AlumnoFormScreen';
import {type Alumno} from '@/interfaces/alumno.interface';

export type AlumnoStackParamList = {
  AlumnosList: undefined;
  AlumnoForm: {alumno?: Alumno};
};

const Stack = createNativeStackNavigator<AlumnoStackParamList>();

export default function AlumnoNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AlumnosList" component={AlumnosListScreen} options={{headerShown: false}} />
      <Stack.Screen name="AlumnoForm" component={AlumnoFormScreen}
        options={({route}) => ({title: route.params?.alumno ? 'Editar alumno' : 'Nuevo alumno'})} />
    </Stack.Navigator>
  );
}
