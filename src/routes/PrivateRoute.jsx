/**
 * Route privée (protégée)
 * Redirige vers login si non authentifié
 * ARO Assurance Madagascar
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import Loader from '@components/common/Loader';
import { useEffect } from 'react';

const PrivateRoute = ({ children, requiredType = null }) => {
  const { isAuthenticated, loading, user } = useAuth();

  useEffect(() => {
    console.log('🔒 PrivateRoute - State:', {
      isAuthenticated,
      loading,
      userType: user?.type,
      requiredType,
    });
  }, [isAuthenticated, loading, user, requiredType]);

  // Attendre que le loading soit terminé
  if (loading) {
    console.log('⏳ PrivateRoute - En attente...');
    return <Loader fullScreen text="Vérification de l'authentification..." />;
  }

  // Si pas authentifié, rediriger vers login assuré
  if (!isAuthenticated) {
    console.log('❌ PrivateRoute - Non authentifié, redirection vers login');
    return <Navigate to="/login-assure" replace />;
  }

  // Si un type spécifique est requis, vérifier
  if (requiredType) {
    console.log('🔍 PrivateRoute - Vérification type:', user?.type, 'vs', requiredType);
    
    if (user?.type !== requiredType) {
      console.log('❌ PrivateRoute - Type incorrect');
      
      // Admin essaie d'accéder à une route assuré
      if (user?.type === 'admin' && requiredType === 'assure') {
        console.log('➡️ Redirection admin vers /admin/dashboard');
        return <Navigate to="/admin/dashboard" replace />;
      }
      
      // Assuré essaie d'accéder à une route admin
      if (user?.type === 'assure' && requiredType === 'admin') {
        console.log('➡️ Redirection assuré vers /assure/dashboard');
        return <Navigate to="/assure/dashboard" replace />;
      }
    }
  }

  console.log('✅ PrivateRoute - Accès autorisé');
  return children;
};

export default PrivateRoute;
