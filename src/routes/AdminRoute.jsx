/**
 * Route administrateur (protégée)
 * Redirige si pas admin ou rôle insuffisant
 * ARO Assurance Madagascar
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import Loader from '@components/common/Loader';

const AdminRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, loading, isAdmin, hasRole, user } = useAuth();

  console.log('🔒 AdminRoute check:', {
    isAuthenticated,
    loading,
    userType: user?.type,
    isAdminResult: isAdmin(),
  });

  if (loading) {
    return <Loader fullScreen text="Vérification des permissions..." />;
  }

  if (!isAuthenticated) {
    console.log('❌ Non authentifié -> Redirection /login-admin');
    return <Navigate to="/login-admin" replace />;
  }

  // Vérifier directement le type dans user au lieu d'appeler isAdmin()
  if (user?.type !== 'admin') {
    console.log('❌ Pas admin (type:', user?.type, ') -> Redirection /login-admin');
    return <Navigate to="/login-admin" replace />;
  }

  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    console.log('❌ Rôle insuffisant -> Redirection /admin/dashboard');
    return <Navigate to="/admin/dashboard" replace />;
  }

  console.log('✅ Accès autorisé');
  return children;
};

export default AdminRoute;
