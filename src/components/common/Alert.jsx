/**
 * Composant Alert réutilisable avec auto-dismiss
 * Messages d'alerte stylisés ARO
 * ARO Assurance Madagascar
 */

import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

const Alert = ({
  type = 'info',
  title,
  message,
  children,
  dismissible = false,
  autoDismiss = true,        // ✅ NOUVEAU : Auto-dismiss activé par défaut
  duration = 3000,            // ✅ NOUVEAU : Durée 3 secondes
  onDismiss,
  className = '',
}) => {
  const [visible, setVisible] = useState(true);

  // ✅ NOUVEAU : Auto-dismiss après 3 secondes
  useEffect(() => {
    if (autoDismiss && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, duration);

      // Nettoyer le timer si le composant est démonté
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, duration, visible, onDismiss]);

  // ✅ Fonction de fermeture manuelle
  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  // ✅ Si invisible, ne rien afficher
  if (!visible) return null;

  // Configuration par type
  const configs = {
    success: {
      containerClass: 'alert-success',
      icon: CheckCircle,
      iconClass: 'text-green-600',
    },
    error: {
      containerClass: 'alert-error',
      icon: AlertCircle,
      iconClass: 'text-red-600',
    },
    warning: {
      containerClass: 'alert-warning',
      icon: AlertTriangle,
      iconClass: 'text-yellow-600',
    },
    info: {
      containerClass: 'alert-info',
      icon: Info,
      iconClass: 'text-blue-600',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-4 rounded-lg',
        config.containerClass,
        className,
        'animate-in fade-in slide-in-from-top-2 duration-300' // ✅ Animation d'entrée
      )}
    >
      {/* Icône */}
      <Icon className={clsx('w-5 h-5 flex-shrink-0', config.iconClass)} />

      {/* Contenu */}
      <div className="flex-1">
        {title && <p className="font-semibold mb-1">{title}</p>}
        {message && <p className="text-sm">{message}</p>}
        {children && <div className="mt-2">{children}</div>}
      </div>

      {/* Bouton de fermeture manuelle */}
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
