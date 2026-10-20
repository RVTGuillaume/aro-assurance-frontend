/**
 * Page Login Admin - FINAL ARO GREEN THEME
 * Badge ADMIN glassmorphism blanc avec texte noir
 * ARO Assurance Madagascar
 */


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@hooks/useAuth';
import { Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles, Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import ForgotPasswordModal from '@components/auth/ForgotPasswordModal';
import OTPVerificationModal from '@components/auth/OTPVerificationModal';
import ResetPasswordModal from '@components/auth/ResetPasswordModal';


const schema = yup.object({
  identifier: yup
    .string()
    .required('Email ou nom d\'utilisateur requis')
    .min(3, 'Minimum 3 caractères'),
  mot_de_passe: yup
    .string()
    .required('Mot de passe requis')
    .min(8, 'Minimum 8 caractères'),
});


const LoginAdmin = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpExpiry, setOtpExpiry] = useState(10);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });


  const onSubmit = async (data) => {
    setLoading(true);
    setError('');


    const result = await loginAdmin(data);


    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message || 'Identifiants incorrects');
    }


    setLoading(false);
  };


  const handleOTPSent = (email, expiresInMinutes) => {
    setResetEmail(email);
    setOtpExpiry(expiresInMinutes);
    setShowOTPModal(true);
  };


  const handleOTPVerified = (email, code) => {
    setResetEmail(email);
    setOtpCode(code);
    setShowResetPassword(true);
  };


  const handlePasswordResetSuccess = () => {
    setResetEmail('');
    setOtpCode('');
    setError('');
  };


  return (
    <>
      {/* Background avec dégradé VERT */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Animated Blobs VERTS */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"
          />
        </div>


        {/* Bouton de retour GLASSMORPHISM BLANC en haut à gauche */}
        <motion.a
          onClick={(e) => { e.preventDefault(); navigate("/"); }} href="/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-xl text-black rounded-xl shadow-lg border border-white/50 hover:bg-white/90 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
          <span className="font-bold italic text-black">Retour</span>
        </motion.a>


        {/* Container avec padding-top pour décaler vers le bas */}
        <div className="relative min-h-screen flex items-center justify-center p-4 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl"
          >
            {/* Card */}
            <div className="grid lg:grid-cols-2 gap-0 rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl bg-white backdrop-blur-xl border border-green-100">
              
              {/* COLONNE GAUCHE - Formulaire (BLANC) */}
              <div className="p-5 sm:p-7 bg-white relative">
                {/* Badge ADMIN GLASSMORPHISM BLANC avec texte NOIR */}
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-md text-gray-900 rounded-full text-xs font-bold shadow-lg border border-white/50 italic">
                    <Shield className="w-3 h-3 text-gray-900" />
                    <span>ADMIN</span>
                  </div>
                </div>


                {/* Logo + Lock Icon */}
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <Lock className="w-4.5 h-4.5 text-white" />
                  </div>
                  <img
                    src="/AROO.png"
                    alt="ARO"
                    className="h-11 w-auto"
                  />
                </div>


                {/* Titre en ITALIQUE */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-4"
                >
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5 italic">
                    Authentification
                  </h1>
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent italic">
                    Administrateur
                  </h2>
                </motion.div>


                {/* Erreur */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-3.5 p-2 bg-red-50 border-2 border-red-200 rounded-xl"
                  >
                    <p className="text-red-700 text-xs font-medium">{error}</p>
                  </motion.div>
                )}


                {/* Formulaire */}
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-3"
                >
                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-500" />
                      Email
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        {...register('identifier')}
                        placeholder="admin@aro.mg"
                        className={`w-full px-3 py-2 text-sm bg-white border-2 rounded-xl outline-none transition-all duration-300 ${
                          errors.identifier
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100'
                        }`}
                      />
                      <Sparkles className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 group-hover:text-green-400 transition-colors" />
                    </div>
                    {errors.identifier && (
                      <p className="mt-0.5 text-xs text-red-600">{errors.identifier.message}</p>
                    )}
                  </div>


                  {/* Mot de passe */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                      <Lock className="w-3.5 h-3.5 text-gray-500" />
                      Mot de passe
                    </label>
                    <div className="relative group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('mot_de_passe')}
                        placeholder="••••••••"
                        className={`w-full px-3 py-2 text-sm bg-white border-2 rounded-xl outline-none transition-all duration-300 pr-9 ${
                          errors.mot_de_passe
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {errors.mot_de_passe && (
                      <p className="mt-0.5 text-xs text-red-600">{errors.mot_de_passe.message}</p>
                    )}
                  </div>


                  {/* Bouton VERT */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-500/30 hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Connexion
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>


                  {/* Séparateur */}
                  <div className="flex items-center gap-2.5 py-1">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    <span className="text-xs font-medium text-gray-400">ou</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>


                  {/* Mot de passe oublié VERT */}
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="w-full text-center text-xs font-semibold text-green-600 hover:text-green-700 transition-colors"
                  >
                    Mot de passe oublié ?
                  </button>
                </motion.form>
              </div>


              {/* COLONNE DROITE - Branding (VERT) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="hidden lg:flex flex-col items-center justify-center p-7 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden"
              >
                {/* Liquid Glass */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl" />
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-16 right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl"
                />


                {/* Contenu */}
                <div className="relative z-10 text-center">
                  {/* Logo géant sur fond BLANC */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="mb-5"
                  >
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-[2rem] transform rotate-6" />
                      <div className="relative bg-white backdrop-blur-xl p-7 rounded-[2rem] shadow-2xl border border-white/20">
                        <img
                          src="/AROO.png"
                          alt="Assurances ARO"
                          className="w-36 h-36 object-contain drop-shadow-2xl"
                        />
                      </div>
                    </div>
                  </motion.div>


                  {/* Titre en ITALIQUE BLANC */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-2xl sm:text-3xl font-bold text-white mb-2.5 drop-shadow-lg italic"
                  >
                    Assurance  ARO
                  </motion.h2>


                  {/* Sous-titre en ITALIQUE BLANC */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-base sm:text-lg text-green-50 font-medium px-3 leading-relaxed italic"
                  >
                    Plateforme de gestion et de suivi de vos contrats d'assurance en toute simplicité.             
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>


      {/* MODAUX */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onOTPSent={handleOTPSent}
      />


      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={resetEmail}
        onVerified={handleOTPVerified}
        expiresInMinutes={otpExpiry}
      />


      <ResetPasswordModal
        isOpen={showResetPassword}
        onClose={() => setShowResetPassword(false)}
        email={resetEmail}
        otpCode={otpCode}
        onSuccess={handlePasswordResetSuccess}
      />
    </>
  );
};


export default LoginAdmin;
