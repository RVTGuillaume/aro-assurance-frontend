/**
 * Modal Réinitialisation Mot de Passe - RESPONSIVE COMPACT
 * Design adaptatif avec force du mot de passe
 * ARO Assurance Madagascar
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { authApi } from '@api/authApi';
import toast from 'react-hot-toast';

const ResetPasswordModal = ({ isOpen, onClose, email, otpCode, onSuccess }) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const getStrengthConfig = (strength) => {
    if (strength === 0) return { label: '', color: '', bgColor: '' };
    if (strength <= 2) return { label: 'Faible', color: 'text-red-600', bgColor: 'bg-red-500' };
    if (strength === 3) return { label: 'Moyen', color: 'text-yellow-600', bgColor: 'bg-yellow-500' };
    if (strength === 4) return { label: 'Fort', color: 'text-green-600', bgColor: 'bg-green-500' };
    return { label: 'Très fort', color: 'text-emerald-600', bgColor: 'bg-emerald-500' };
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Minimum 8 caractères';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation requise';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await authApi.resetPassword({
        identifier: email,
        code_otp: otpCode,
        nouveau_mot_de_passe: formData.password,
      });

      if (response.success) {
        toast.success('✅ Mot de passe réinitialisé !');
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || 'Erreur lors de la réinitialisation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur serveur');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const strengthConfig = getStrengthConfig(passwordStrength);

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* En-tête */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 relative">
            <button
              onClick={onClose}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 hover:bg-white/20 rounded-lg sm:rounded-xl transition text-white"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="flex items-center gap-3 sm:gap-4 pr-10 sm:pr-12">
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm flex-shrink-0">
                <Lock className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Nouveau mot de passe
                </h2>
                <p className="text-blue-100 text-xs mt-0.5 truncate">
                  Choisissez un mot de passe sécurisé
                </p>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center py-3 sm:py-4 bg-gradient-to-b from-blue-50 to-white">
            <img
              src="/AROO.png"
              alt="ARO"
              className="h-20 sm:h-24 lg:h-28 w-auto"
              onError={(e) => (e.target.style.display = 'none')}
            />
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            {/* Mot de passe */}
            <div className="mb-3">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  disabled={isLoading}
                  className={`w-full px-3 py-2.5 pr-10 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none text-sm font-medium transition ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder="Minimum 8 caractères"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-red-600 text-xs font-medium flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Indicateur de force */}
            {formData.password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-3"
              >
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        i < passwordStrength ? strengthConfig.bgColor : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-bold ${strengthConfig.color}`}>
                  Force : {strengthConfig.label}
                </p>
              </motion.div>
            )}

            {/* Confirmation */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  disabled={isLoading}
                  className={`w-full px-3 py-2.5 pr-10 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none text-sm font-medium transition ${
                    errors.confirmPassword
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder="Confirmer le mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-red-600 text-xs font-medium flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword}
                </motion.p>
              )}
            </div>

            {/* Critères */}
            <div className="mb-4 p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
              <p className="text-xs font-bold text-gray-700 mb-1.5">
                Le mot de passe doit contenir :
              </p>
              <ul className="space-y-0.5 text-xs text-gray-600">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 flex-shrink-0 ${
                      formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'
                    }`}
                  />
                  <span>Au moins 8 caractères</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 flex-shrink-0 ${
                      /[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password)
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`}
                  />
                  <span>Majuscules et minuscules</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 flex-shrink-0 ${
                      /\d/.test(formData.password) ? 'text-green-600' : 'text-gray-400'
                    }`}
                  />
                  <span>Au moins un chiffre</span>
                </li>
              </ul>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-3 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-sm font-bold hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  <span>Réinitialisation...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Réinitialiser le mot de passe</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ResetPasswordModal;
