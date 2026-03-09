import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import EmpleadosListScreen from '../dashboard/empleados/EmpleadosListScreen';
import EmpleadoFormScreen from '../dashboard/empleados/EmpleadoFormScreen';
import {Empleado} from '@/interfaces/empleado.interface';

export type EmpleadoStackParamList = {
  EmpleadosList: undefined;
  EmpleadoForm: {empleado?: Empleado};
};

const Stack = createNativeStackNavigator<EmpleadoStackParamList>();

export default function EmpleadoNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: '#ffffff'},
        headerTintColor: '#0f172a',
        headerTitleStyle: {fontWeight: 'bold'},
      }}
    >
      {/* Lista principal — sin header porque el Drawer ya tiene su propio header */}
      <Stack.Screen
        name="EmpleadosList"
        component={EmpleadosListScreen}
        options={{headerShown: false}}
      />

      {/* Formulario — muestra "Nuevo empleado" o "Editar empleado" según el modo */}
      <Stack.Screen
        name="EmpleadoForm"
        component={EmpleadoFormScreen}
        options={({route}) => ({
          title: route.params?.empleado ? 'Editar empleado' : 'Nuevo empleado',
        })}
      />
    </Stack.Navigator>
  );
}
