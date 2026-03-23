// ============================================
// RUTA: src/navigation/TutorNavigator.tsx
// ============================================

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TutoresListScreen from '@/dashboard/tutores/TutoresListScreen';
import TutorFormScreen from '@/dashboard/tutores/TutorFormScreen';
import {type Tutor} from '@/interfaces/tutor.interface';

export type TutorStackParamList = {
  TutoresList: undefined;
  TutorForm: {tutor?: Tutor};
};

const Stack = createNativeStackNavigator<TutorStackParamList>();

export default function TutorNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TutoresList" component={TutoresListScreen} options={{headerShown: false}} />
      <Stack.Screen name="TutorForm" component={TutorFormScreen}
        options={({route}) => ({title: route.params?.tutor ? 'Editar tutor' : 'Nuevo tutor'})} />
    </Stack.Navigator>
  );
}
