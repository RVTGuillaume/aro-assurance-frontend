/**
 * Composant Select réutilisable
 * Liste déroulante stylisée ARO
 * ARO Assurance Madagascar
 */

import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { AlertCircle, ChevronDown } from 'lucide-react';

const Select = forwardRef(
  (
    {
      label,
      name,
      options = [],
      placeholder = 'Sélectionner...',
      error,
      required = false,
      disabled = false,
      helpText,
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'w-full px-4 py-3 pr-10 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 appearance-none bg-white';

    const stateClasses = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : 'border-gray-300 focus:border-aro-red focus:ring-aro-red/20';

    const disabledClasses = 'bg-gray-100 cursor-not-allowed text-gray-500';

    const selectClasses = clsx(
      baseClasses,
      stateClasses,
      disabled && disabledClasses,
      className
    );

    return (
      <div className={clsx('form-group', containerClassName)}>
        {/* Label */}
        {label && (
          <label htmlFor={name} className="form-label">
            {label}
            {required && <span className="text-aro-red ml-1">*</span>}
          </label>
        )}

        {/* Container select avec icône */}
        <div className="relative">
          {/* Select */}
          <select
            ref={ref}
            name={name}
            id={name}
            disabled={disabled}
            className={selectClasses}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Icône flèche */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Message d'aide */}
        {helpText && !error && (
          <p className="text-sm text-gray-500 mt-1">{helpText}</p>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="form-error flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
