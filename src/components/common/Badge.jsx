/**
 * Composant Badge réutilisable
 * Badges de statut stylisés ARO
 * ARO Assurance Madagascar
 */

import { clsx } from 'clsx';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = true,
  className = '',
}) => {
  // Variantes de couleur
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-aro-red/10 text-aro-red',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
  };

  // Tailles
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  // Forme
  const shape = rounded ? 'rounded-full' : 'rounded-md';

  const badgeClasses = clsx(
    'inline-flex items-center font-medium',
    variants[variant],
    sizes[size],
    shape,
    className
  );

  return <span className={badgeClasses}>{children}</span>;
};

export default Badge;
