/**
 * Composant principal App
 * Point d'entrée de l'application React
 * ARO Assurance Madagascar
 * @version CORRIGÉE - Sans warnings React Router
 */

import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from '@routes/AppRoutes';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,      // ✅ Active React.startTransition pour les navigations
        v7_relativeSplatPath: true     // ✅ Active la nouvelle résolution des routes splat
      }}
    >
      <AuthProvider>
        <AppRoutes />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff'
              }
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff'
              }
            }
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
