/**
 * Contexte d'authentification
 * Gestion globale de l'état d'authentification
 * ARO Assurance Madagascar
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@api/authApi';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Initialiser l'authentification au chargement
   */
  useEffect(() => {
    initAuth();
  }, []);

  /**
   * Vérifier si l'utilisateur est déjà connecté
   */
  const initAuth = async () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    console.log('🔍 Init auth - Token:', !!token, 'User:', !!savedUser);

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('👤 User chargé depuis localStorage:', userData);
        console.log('🔑 Type:', userData.type);
        
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('❌ Erreur parse user:', error);
        clearAuth();
      }
    }

    setLoading(false);
  };

  /**
   * Connexion assuré
   */
  const loginAssure = async (credentials) => {
    try {
      console.log('🔐 Login assuré...');
      const response = await authApi.loginAssure(credentials);

      console.log('📥 Réponse API assuré:', response);

      if (response.success) {
        const { token, user: assureData } = response.data;

        console.log('✅ Assuré:', assureData);
        console.log('🔑 Type:', assureData.type);

        // Sauvegarder dans localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(assureData));

        setUser(assureData);
        setIsAuthenticated(true);

        // ❌ SUPPRIMÉ : toast.success(`Bienvenue ${assureData.nom_complet} !`);
        return { success: true, user: assureData };
      }

      return { success: false, message: response.message };
    } catch (error) {
      console.error('❌ Erreur login assuré:', error);
      const message =
        error.response?.data?.message || 'Erreur lors de la connexion';
      toast.error(message);
      return { success: false, message };
    }
  };

  /**
   * Connexion administrateur
   */
  const loginAdmin = async (credentials) => {
    try {
      console.log('🔐 Login admin...');
      const response = await authApi.loginAdmin(credentials);

      console.log('📥 Réponse API admin:', response);

      if (response.success) {
        const { token, user: adminData } = response.data;

        console.log('✅ Admin:', adminData);
        console.log('🔑 Type:', adminData.type);
        console.log('🎭 Role:', adminData.role);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(adminData));

        setUser(adminData);
        setIsAuthenticated(true);

        // ❌ SUPPRIMÉ : toast.success(`Bienvenue ${adminData.nom_complet} !`);
        return { success: true, user: adminData };
      }

      return { success: false, message: response.message };
    } catch (error) {
      console.error('❌ Erreur login admin:', error);
      const message =
        error.response?.data?.message || 'Erreur lors de la connexion';
      toast.error(message);
      return { success: false, message };
    }
  };

  /**
   * Déconnexion
   */
  const logout = async () => {
    try {
      console.log('👋 Déconnexion...');
      await authApi.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      clearAuth();
      toast.success('Déconnexion réussie');
    }
  };

  /**
   * Nettoyer l'authentification
   */
  const clearAuth = () => {
    console.log('🧹 Nettoyage auth...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Mettre à jour les informations utilisateur
   */
  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    console.log('✏️ User mis à jour:', updatedUser);
  };

  /**
   * Vérifier si l'utilisateur est assuré
   */
  const isAssure = () => {
    const result = user?.type === 'assure';
    console.log('🔍 isAssure?', result, '(type:', user?.type, ')');
    return result;
  };

  /**
   * Vérifier si l'utilisateur est admin
   */
  const isAdmin = () => {
    const result = user?.type === 'admin';
    console.log('🔍 isAdmin?', result, '(type:', user?.type, ')');
    return result;
  };

  /**
   * Vérifier le rôle admin
   */
  const hasRole = (roles) => {
    if (!user || user.type !== 'admin') {
      console.log('🔍 hasRole? false - pas admin');
      return false;
    }
    const result = roles.includes(user.role);
    console.log('🔍 hasRole?', result, '(role:', user.role, 'requis:', roles, ')');
    return result;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    loginAssure,
    loginAdmin,
    logout,
    updateUser,
    isAssure,
    isAdmin,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook pour utiliser le contexte d'authentification
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }

  return context;
};

export default AuthContext;
