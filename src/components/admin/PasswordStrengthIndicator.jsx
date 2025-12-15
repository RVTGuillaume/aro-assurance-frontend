import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordStrengthIndicator({ password, onVisibilityChange }) {
  const [strength, setStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!password) {
      setStrength(0);
      return;
    }

    let score = 0;
    
    // Longueur
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    
    // Complexité
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^a-zA-Z0-9]/.test(password)) score += 15;

    setStrength(Math.min(score, 100));
  }, [password]);

  const getStrengthColor = () => {
    if (strength < 30) return 'bg-red-500';
    if (strength < 60) return 'bg-orange-500';
    if (strength < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength === 0) return '';
    if (strength < 30) return 'Très faible';
    if (strength < 60) return 'Faible';
    if (strength < 80) return 'Moyen';
    return 'Fort';
  };

  const toggleVisibility = () => {
    const newValue = !showPassword;
    setShowPassword(newValue);
    if (onVisibilityChange) onVisibilityChange(newValue);
  };

  return (
    <div className="space-y-2">
      {/* Barre de progression */}
      {password && (
        <div className="w-full">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getStrengthColor()}`}
              style={{ width: `${strength}%` }}
            />
          </div>
          <p className={`text-xs mt-1 font-medium ${
            strength < 30 ? 'text-red-500' :
            strength < 60 ? 'text-orange-500' :
            strength < 80 ? 'text-yellow-500' :
            'text-green-500'
          }`}>
            {getStrengthText()}
          </p>
        </div>
      )}

      {/* Bouton œil */}
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}
