// ============================================
// RUTA: App.tsx
// ============================================

import './global.css';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider} from '@/context/AuthContext';
import {ThemeProvider} from '@/context/ThemeContext';
import DrawerNavigator from '@/navigation/DrawerNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <DrawerNavigator />
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  );
}
