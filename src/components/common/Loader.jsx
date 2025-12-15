/**
 * Composant Loader - Indicateur de chargement
 * ARO Assurance Madagascar
 */

import { Loader2 } from 'lucide-react';

const Loader = ({ 
  fullScreen = false, 
  text = 'Chargement...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <Loader2 className={`${sizeClasses.lg} text-aro-red animate-spin mx-auto mb-4`} />
          <p className="text-gray-600 font-medium">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} text-aro-red animate-spin mx-auto mb-3`} />
        <p className="text-gray-600 text-sm">{text}</p>
      </div>
    </div>
  );
};

export default Loader;
