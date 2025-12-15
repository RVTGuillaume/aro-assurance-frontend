/**
 * Composant Textarea réutilisable
 * Zone de texte multiligne stylisée ARO
 * ARO Assurance Madagascar
 */

import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { AlertCircle } from 'lucide-react';

const Textarea = forwardRef(
  (
    {
      label,
      name,
      placeholder,
      rows = 4,
      error,
      required = false,
      disabled = false,
      helpText,
      maxLength,
      showCounter = false,
      className = '',
      containerClassName = '',
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 resize-none';

    const stateClasses = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : 'border-gray-300 focus:border-aro-red focus:ring-aro-red/20';

    const disabledClasses = 'bg-gray-100 cursor-not-allowed text-gray-500';

    const textareaClasses = clsx(
      baseClasses,
      stateClasses,
      disabled && disabledClasses,
      className
    );

    const currentLength = value?.length || 0;

    return (
      <div className={clsx('form-group', containerClassName)}>
        {/* Label */}
        {label && (
          <label htmlFor={name} className="form-label">
            {label}
            {required && <span className="text-aro-red ml-1">*</span>}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          name={name}
          id={name}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={textareaClasses}
          value={value}
          onChange={onChange}
          {...props}
        />

        {/* Compteur de caractères */}
        {showCounter && maxLength && (
          <div className="flex justify-end mt-1">
            <span className={clsx(
              'text-sm',
              currentLength > maxLength * 0.9 ? 'text-red-500' : 'text-gray-500'
            )}>
              {currentLength} / {maxLength}
            </span>
          </div>
        )}

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

Textarea.displayName = 'Textarea';

export default Textarea;
