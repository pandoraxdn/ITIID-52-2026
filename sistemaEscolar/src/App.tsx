// ============================================
// RUTA: src/App.tsx
// ARCHIVO: App.tsx
// PROPÓSITO: Componente raíz de la aplicación.
//            Envuelve todo con <AuthProvider> para que cualquier
//            componente pueda acceder al contexto de autenticación
//            usando el hook useAuth().
// ============================================

import {RouterProvider} from 'react-router';
import {appRouter} from './router/app.router';
import {AuthProvider} from './context/AuthContext';
import './index.css';

const App = () => {
  return (
    // AuthProvider debe estar en el nivel más alto posible
    // para que todos los componentes (incluido el router) puedan usar useAuth()
    <AuthProvider>
      <RouterProvider router={appRouter} />
    </AuthProvider>
  );
};

export default App;
