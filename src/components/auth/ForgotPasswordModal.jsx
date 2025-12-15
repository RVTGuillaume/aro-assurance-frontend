/**
 * Modal Mot de Passe Oublié - VERSION COMPACTE
 * Design Apple-style optimisé et réduit
 * ARO Assurance Madagascar
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { authApi } from '@api/authApi';
import toast from 'react-hot-toast';

const ForgotPasswordModal = ({ isOpen, onClose, onOTPSent }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Veuillez saisir votre email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email invalide');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.requestPasswordReset(email);

      if (response.success) {
        toast.success('📧 Code envoyé par email !');
        onOTPSent(email, response.data?.expiresInMinutes || 3);
        onClose();
      } else {
        setError(response.message || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.response?.data?.message || 'Erreur serveur');
      toast.error('Erreur lors de l\'envoi du code');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* En-tête COMPACT */}
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 px-5 py-4 relative">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-lg transition text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pr-10">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm flex-shrink-0">
                <Mail className="text-white w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-white truncate">
                  Mot de passe oublié ?
                </h2>
                <p className="text-emerald-100 text-xs mt-0.5 truncate">
                  Entrez votre email
                </p>
              </div>
            </div>
          </div>

          {/* Logo RÉDUIT */}
          <div className="flex justify-center py-4 bg-gradient-to-b from-emerald-50 to-white">
            <img
              src="/AROO.png"
              alt="ARO Assurance"
              className="h-16 w-auto"
              onError={(e) => (e.target.style.display = 'none')}
            />
          </div>

          {/* Formulaire COMPACT */}
          <form onSubmit={handleSubmit} className="p-5">
            {/* Message d'erreur */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-2.5 bg-red-50 border-2 border-red-200 rounded-xl"
              >
                <p className="text-red-700 text-xs font-medium flex items-center gap-2">
                  <span className="text-sm">⚠️</span>
                  <span className="break-words">{error}</span>
                </p>
              </motion.div>
            )}

            {/* Champ email */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-500" />
                Email administrateur
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aro.mg"
                disabled={isLoading}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-sm font-medium transition disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Info COMPACTE - ⚡ MODIFICATION ICI */}
            <div className="mb-4 p-2.5 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <p className="text-blue-800 text-xs flex items-start gap-1.5">
                <span className="text-sm flex-shrink-0">ℹ️</span>
                <span className="leading-relaxed">
                  Vous recevrez un code à <strong>8 chiffres</strong> valable
                  pendant <strong>03 minutes</strong> avec{' '}
                  <strong>3 essais maximum</strong>.
                </span>
              </p>
            </div>

            {/* Boutons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-3 py-2 border-2 border-gray-300 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Annuler</span>
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-bold hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-1.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>Envoi...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Envoyer le code</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;
