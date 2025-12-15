/**
 * Composant Input réutilisable SANS DOUBLE ICÔNE
 * ARO Assurance Madagascar
 */

import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(
  (
    {
      label,
      error,
      helpText,
      icon: Icon,
      rightIcon: RightIcon,
      className = '',
      containerClassName = '',
      wrapperClassName = '',
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className={`relative ${wrapperClassName}`}>
          <input
            ref={ref}
            disabled={disabled}
            className={`
              w-full px-4 py-3 
              ${Icon ? 'pl-11' : ''}
              ${RightIcon ? 'pr-11' : ''}
              border-2 border-gray-200 rounded-lg
              focus:ring-2 focus:ring-aro-red/20 focus:border-aro-red
              disabled:bg-gray-100 disabled:cursor-not-allowed
              transition-all duration-200
              placeholder:text-gray-400
              ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}
              ${className}
            `}
            {...props}
          />

          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon className="w-5 h-5" />
            </div>
          )}

          {RightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <RightIcon className="w-5 h-5" />
            </div>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}

        {helpText && !error && (
          <p className="mt-2 text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
