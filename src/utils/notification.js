/**
 * Système de notifications avec react-hot-toast
 * ARO Assurance Madagascar
 */

import toast from 'react-hot-toast';

export const notification = {
  success: (message, options = {}) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      ...options,
    });
  },

  error: (message, options = {}) => {
    toast.error(message, {
      duration: 3000,
      position: 'top-right',
      ...options,
    });
  },

  warning: (message, options = {}) => {
    toast(message, {
      icon: '⚠️',
      duration: 3000,
      position: 'top-right',
      ...options,
    });
  },

  info: (message, options = {}) => {
    toast(message, {
      icon: 'ℹ️',
      duration: 3000,
      position: 'top-right',
      ...options,
    });
  },

  loading: (message) => {
    return toast.loading(message, {
      position: 'top-right',
    });
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
};

export default notification;
