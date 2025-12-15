/**
 * Modal Vérification OTP - RESPONSIVE COMPACT
 * Code séparé en 2 blocs de 4 chiffres
 * ARO Assurance Madagascar
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Loader2, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { authApi } from '@api/authApi';
import toast from 'react-hot-toast';

const OTPVerificationModal = ({ isOpen, onClose, email, onVerified, expiresInMinutes }) => {
  // ⚡ FORCE 3 MINUTES : ignore la valeur reçue du parent
  const EXPIRY_MINUTES = 3;
  
  const [otp, setOtp] = useState(['', '', '', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [timeLeft, setTimeLeft] = useState(EXPIRY_MINUTES * 60); // 180 secondes fixes
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setError('Code expiré. Veuillez demander un nouveau code.');
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  useEffect(() => {
    if (!isOpen) return;
    const resendTimer = setTimeout(() => setCanResend(true), 30000);
    return () => clearTimeout(resendTimer);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 8);

    if (!/^\d+$/.test(pastedData)) {
      toast.error('Veuillez coller uniquement des chiffres');
      return;
    }

    const newOtp = pastedData.split('').concat(Array(8).fill('')).slice(0, 8);
    setOtp(newOtp);

    const lastIndex = Math.min(pastedData.length, 7);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 8) {
      setError('Veuillez saisir les 8 chiffres');
      return;
    }

    if (timeLeft <= 0) {
      setError('Code expiré. Veuillez demander un nouveau code.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.verifyOTP(email, otpCode);

      if (response.success) {
        toast.success('✅ Code vérifié !');
        onVerified(email, otpCode);
        onClose();
      } else {
        setError(response.message || 'Code incorrect');
        setAttemptsLeft(response.attemptsLeft || attemptsLeft - 1);
        setOtp(['', '', '', '', '', '', '', '']);
        inputRefs.current[0]?.focus();

        if (response.attemptsLeft === 0) {
          toast.error('Trop de tentatives. Demandez un nouveau code.');
          setTimeout(() => onClose(), 2000);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.response?.data?.message || 'Erreur de vérification');
      toast.error('Erreur de vérification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsLoading(true);
    try {
      const response = await authApi.requestPasswordReset(email);

      if (response.success) {
        toast.success('📧 Nouveau code envoyé !');
        setTimeLeft(EXPIRY_MINUTES * 60); // Réinitialiser à 3 minutes
        setCanResend(false);
        setAttemptsLeft(3);
        setOtp(['', '', '', '', '', '', '', '']);
        setError('');
        inputRefs.current[0]?.focus();

        setTimeout(() => setCanResend(true), 30000);
      }
    } catch (error) {
      toast.error('Erreur lors du renvoi');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

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
          <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 relative">
            <button
              onClick={onClose}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 hover:bg-white/20 rounded-lg sm:rounded-xl transition text-white"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="flex items-center gap-3 sm:gap-4 pr-10 sm:pr-12">
              <div className="bg-white/20 p-2 sm:p-2.5 rounded-xl backdrop-blur-sm flex-shrink-0">
                <Shield className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Code de vérification
                </h2>
                <p className="text-purple-100 text-xs mt-0.5 truncate">
                  {email}
                </p>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center py-3 sm:py-4 bg-gradient-to-b from-purple-50 to-white">
            <img
              src="/AROO.png"
              alt="ARO"
              className="h-20 sm:h-24 lg:h-28 w-auto"
              onError={(e) => (e.target.style.display = 'none')}
            />
          </div>

          {/* Contenu */}
          <div className="p-4 sm:p-6">
            {/* Timer */}
            <div className="mb-4 flex items-center justify-center gap-2">
              <Clock
                className={`${
                  timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-purple-600'
                } w-5 h-5`}
              />
              <span
                className={`text-xl font-bold ${
                  timeLeft < 60 ? 'text-red-500' : 'text-purple-600'
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Message d'erreur */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-2.5 sm:p-3 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-2"
              >
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5 w-4 h-4" />
                <p className="text-red-700 text-xs font-medium break-words">{error}</p>
              </motion.div>
            )}

            {/* 8 Cases OTP (2 groupes de 4) */}
            <div className="mb-4">
              <label className="block text-center text-xs sm:text-sm font-bold text-gray-700 mb-3">
                Entrez le code à 8 chiffres
              </label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center" onPaste={handlePaste}>
                {/* Premier groupe de 4 */}
                <div className="flex gap-1.5">
                  {otp.slice(0, 4).map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      disabled={isLoading || timeLeft <= 0}
                      className="w-10 h-11 sm:w-11 sm:h-12 text-center text-xl font-bold border-2 border-purple-300 rounded-lg focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  ))}
                </div>

                {/* Séparateur */}
                <div className="hidden sm:block text-xl font-bold text-purple-400">-</div>

                {/* Deuxième groupe de 4 */}
                <div className="flex gap-1.5">
                  {otp.slice(4, 8).map((digit, index) => (
                    <input
                      key={index + 4}
                      ref={(el) => (inputRefs.current[index + 4] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index + 4, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index + 4, e)}
                      disabled={isLoading || timeLeft <= 0}
                      className="w-10 h-11 sm:w-11 sm:h-12 text-center text-xl font-bold border-2 border-purple-300 rounded-lg focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Essais restants */}
            <div className="mb-4 text-center">
              <p
                className={`text-xs font-bold ${
                  attemptsLeft <= 1 ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                {attemptsLeft <= 1 ? '⚠️' : '🔐'} Essais restants :{' '}
                <span className="text-sm">{attemptsLeft}/3</span>
              </p>
            </div>

            {/* Bouton Vérifier */}
            <button
              onClick={handleVerify}
              disabled={isLoading || otp.join('').length !== 8 || timeLeft <= 0}
              className="w-full mb-3 px-3 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  <span>Vérification...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Vérifier le code</span>
                </>
              )}
            </button>

            {/* Bouton Renvoyer */}
            <button
              onClick={handleResend}
              disabled={!canResend || isLoading}
              className="w-full text-purple-600 hover:text-purple-700 font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{canResend ? 'Renvoyer un nouveau code' : 'Renvoyer le code (00:30)'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OTPVerificationModal;
