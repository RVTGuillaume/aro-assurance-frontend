/**
 * Hook useDeclarations
 * Gestion des déclarations avec cache
 * ARO Assurance Madagascar
 */

import { useState, useEffect, useCallback } from 'react';
import declarationApi from '../../services/declarationApi';
import { useNotification } from './useNotification';

export const useDeclarations = (initialParams = {}) => {
  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const notification = useNotification();

  /**
   * Charger les déclarations
   */
  const fetchDeclarations = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await declarationApi.getMyDeclarations({
          ...initialParams,
          ...params,
        });

        if (response.success) {
          setDeclarations(response.data);
          if (response.pagination) {
            setPagination(response.pagination);
          }
        }
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          'Erreur lors du chargement des déclarations';
        setError(errorMsg);
        notification.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [initialParams, notification]
  );

  /**
   * Créer une nouvelle déclaration
   */
  const createDeclaration = async (data) => {
    try {
      const response = await declarationApi.create(data);

      if (response.success) {
        notification.success(response.message);
        // Recharger la liste
        await fetchDeclarations();
        return { success: true, data: response.data };
      }

      return { success: false, message: response.message };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        'Erreur lors de la création de la déclaration';
      notification.error(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  /**
   * Supprimer une déclaration
   */
  const deleteDeclaration = async (id) => {
    try {
      const response = await declarationApi.delete(id);

      if (response.success) {
        notification.success(response.message);
        // Retirer de la liste locale
        setDeclarations((prev) => prev.filter((d) => d.id !== id));
        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        'Erreur lors de la suppression de la déclaration';
      notification.error(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  /**
   * Rafraîchir la liste
   */
  const refresh = () => {
    fetchDeclarations({ page: pagination.page });
  };

  /**
   * Charger au montage du composant
   */
  useEffect(() => {
    fetchDeclarations();
  }, [fetchDeclarations]);

  return {
    declarations,
    loading,
    error,
    pagination,
    fetchDeclarations,
    createDeclaration,
    deleteDeclaration,
    refresh,
  };
};

export default useDeclarations;
