/**
 * Composant Card réutilisable
 * Cartes de contenu stylisées ARO
 * ARO Assurance Madagascar
 */

import { clsx } from 'clsx';

const Card = ({
  children,
  title,
  subtitle,
  footer,
  variant = 'default',
  hover = false,
  padding = 'md',
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
}) => {
  // Classes de base
  const baseClasses = 'bg-white rounded-xl border border-gray-100';

  // Variantes
  const variants = {
    default: 'shadow-md',
    bordered: 'shadow-sm border-2',
    elevated: 'shadow-lg',
    flat: 'shadow-none',
  };

  // Hover effect
  const hoverClasses = hover
    ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer'
    : '';

  // Padding
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // Combiner les classes
  const cardClasses = clsx(
    baseClasses,
    variants[variant],
    hoverClasses,
    className
  );

  const bodyClasses = clsx(paddings[padding], bodyClassName);

  return (
    <div className={cardClasses}>
      {/* Header */}
      {(title || subtitle) && (
        <div
          className={clsx(
            'border-b border-gray-100 px-6 py-4',
            headerClassName
          )}
        >
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      )}

      {/* Body */}
      <div className={bodyClasses}>{children}</div>

      {/* Footer */}
      {footer && (
        <div
          className={clsx(
            'border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-xl',
            footerClassName
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
