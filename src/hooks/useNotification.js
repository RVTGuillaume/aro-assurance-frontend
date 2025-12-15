/**
 * Hook useNotification
 * Gestion des notifications toast
 * ARO Assurance Madagascar
 */

import toast from 'react-hot-toast';

export const useNotification = () => {
  /**
   * Afficher une notification de succès
   */
  const success = (message, options = {}) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#059669',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#059669',
      },
      ...options,
    });
  };

  /**
   * Afficher une notification d'erreur
   */
  const error = (message, options = {}) => {
    toast.error(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#E31E24',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#E31E24',
      },
      ...options,
    });
  };

  /**
   * Afficher une notification d'information
   */
  const info = (message, options = {}) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#1E40AF',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      ...options,
    });
  };

  /**
   * Afficher une notification d'avertissement
   */
  const warning = (message, options = {}) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: '⚠️',
      style: {
        background: '#F59E0B',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      ...options,
    });
  };

  /**
   * Afficher une notification avec chargement
   */
  const loading = (message, options = {}) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#4B5563',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      ...options,
    });
  };

  /**
   * Mettre à jour une notification existante
   */
  const update = (toastId, message, type = 'success') => {
    const styles = {
      success: {
        background: '#059669',
        color: '#fff',
      },
      error: {
        background: '#E31E24',
        color: '#fff',
      },
      info: {
        background: '#1E40AF',
        color: '#fff',
      },
    };

    toast.dismiss(toastId);
    toast[type](message, {
      style: styles[type],
      duration: 3000,
      position: 'top-right',
    });
  };

  /**
   * Fermer une notification spécifique
   */
  const dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  /**
   * Fermer toutes les notifications
   */
  const dismissAll = () => {
    toast.dismiss();
  };

  /**
   * Notification avec promesse (async)
   */
  const promise = (
    promiseFn,
    messages = {
      loading: 'Chargement...',
      success: 'Succès !',
      error: 'Erreur',
    }
  ) => {
    return toast.promise(
      promiseFn,
      {
        loading: messages.loading,
        success: (data) =>
          typeof messages.success === 'function'
            ? messages.success(data)
            : messages.success,
        error: (err) =>
          typeof messages.error === 'function'
            ? messages.error(err)
            : messages.error,
      },
      {
        position: 'top-right',
        style: {
          padding: '16px',
          borderRadius: '8px',
        },
      }
    );
  };

  return {
    success,
    error,
    info,
    warning,
    loading,
    update,
    dismiss,
    dismissAll,
    promise,
  };
};

export default useNotification;
