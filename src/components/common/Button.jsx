/**
 * Composant Button réutilisable
 * Boutons stylisés ARO avec variantes
 * ARO Assurance Madagascar
 */

import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  onClick,
  ...props
}) => {
  // Classes de base
  const baseClasses = 'btn font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Variantes de couleur
  const variants = {
    primary: 'bg-aro-red text-white hover:bg-aro-darkRed focus:ring-aro-red shadow-md hover:shadow-lg active:scale-95',
    secondary: 'bg-aro-blue text-white hover:bg-aro-darkBlue focus:ring-aro-blue shadow-md hover:shadow-lg active:scale-95',
    outline: 'border-2 border-aro-red text-aro-red hover:bg-aro-red hover:text-white focus:ring-aro-red active:scale-95',
    ghost: 'text-aro-red hover:bg-aro-red/10 focus:ring-aro-red active:scale-95',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg active:scale-95',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-md hover:shadow-lg active:scale-95',
    white: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400 shadow-sm',
  };

  // Tailles
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-md',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-lg',
  };

  // Classes disabled
  const disabledClasses = 'opacity-50 cursor-not-allowed hover:transform-none';

  // Combiner toutes les classes
  const buttonClasses = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    (disabled || loading) && disabledClasses,
    className
  );

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClasses}
      {...props}
    >
      {/* Icône à gauche */}
      {Icon && iconPosition === 'left' && !loading && (
        <Icon className="w-5 h-5" />
      )}

      {/* Loader pendant chargement */}
      {loading && (
        <Loader2 className="w-5 h-5 animate-spin" />
      )}

      {/* Texte du bouton */}
      <span>{children}</span>

      {/* Icône à droite */}
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className="w-5 h-5" />
      )}
    </button>
  );
};

export default Button;
