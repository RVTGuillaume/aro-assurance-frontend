/**
 * =====================================
 * 🔐 LOGIN ASSURÉ - ARO GREEN THEME
 * =====================================
 * ✅ RESPONSIVE: Zoom +/-, tous appareils
 * ✅ Bouton retour BIEN ESPACÉ du formulaire
 * ✅ Tailles adaptatives et compactes
 * ✅ Glassmorphism moderne
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@hooks/useAuth';
import { Lock, FileText, Hash, CreditCard, User, ArrowRight, Sparkles, Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const schema = yup.object({
  numero_dossier: yup
    .string()
    .required('Numéro de dossier requis')
    .matches(/^DOS-[A-Z0-9]+$/i, 'Format invalide (ex: DOS-TG001)')
    .min(5, 'Minimum 5 caractères'),
  numero_police: yup
    .string()
    .required('Numéro de police requis')
    .matches(/^POL-[A-Z0-9]+$/i, 'Format invalide (ex: POL-TG001)')
    .min(5, 'Minimum 5 caractères'),
  numero_compte: yup
    .string()
    .required('Numéro de compte requis')
    .matches(/^CPT-[A-Z0-9]+$/i, 'Format invalide (ex: CPT-TG001)')
    .min(5, 'Minimum 5 caractères'),
  nom_complet: yup
    .string()
    .required('Nom complet requis')
    .min(3, 'Minimum 3 caractères'),
});

const LoginAssure = () => {
  const navigate = useNavigate();
  const { loginAssure } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    const result = await loginAssure(data);

    if (result.success) {
      navigate('/assure/dashboard');
    } else {
      setError(result.message || 'Identifiants incorrects');
    }

    setLoading(false);
  };

  return (
    <>
      {/* Background avec dégradé VERT */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Animated Blobs VERTS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
            className="absolute -top-24 sm:-top-36 -right-24 sm:-right-36 w-72 h-72 sm:w-88 sm:h-88 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl"
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
            className="absolute -bottom-24 sm:-bottom-36 -left-24 sm:-left-36 w-72 h-72 sm:w-88 sm:h-88 bg-gradient-to-tr from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"
          />
        </div>

        {/* ========== BOUTON RETOUR RESPONSIVE (BIEN ESPACÉ) ========== */}
        <motion.a
          href="http://localhost:5173/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-3 left-3 sm:top-4 sm:left-4 md:top-5 md:left-5 lg:top-6 lg:left-6 z-50 flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-white/80 backdrop-blur-xl text-black rounded-lg sm:rounded-xl shadow-lg border border-white/50 hover:bg-white/90 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
          <span className="font-bold italic text-xs sm:text-sm text-black">Retour</span>
        </motion.a>

        {/* ========== CONTAINER PRINCIPAL RESPONSIVE ========== */}
        <div className="relative min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 pt-16 sm:pt-20 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[90%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[56rem]"
          >
            {/* Card */}
            <div className="grid lg:grid-cols-2 gap-0 rounded-xl lg:rounded-3xl overflow-hidden shadow-2xl bg-white backdrop-blur-xl border border-green-100">
              
              {/* ========== COLONNE GAUCHE - Formulaire (BLANC) ========== */}
              <div className="p-4 sm:p-5 md:p-6 bg-white relative">
                {/* Badge ASSURÉ */}
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                  <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/90 backdrop-blur-md text-gray-900 rounded-full text-[10px] sm:text-xs font-bold shadow-lg border border-white/50 italic">
                    <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-900" />
                    <span>ASSURÉ</span>
                  </div>
                </div>

                {/* Logo + Lock Icon */}
                <div className="flex items-center gap-2 sm:gap-2.5 mb-3 sm:mb-3.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <img
                    src="/AROO.png"
                    alt="ARO"
                    className="h-8 sm:h-10 w-auto"
                  />
                </div>

                {/* Titre en ITALIQUE */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-3 sm:mb-3.5"
                >
                  <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-0.5 italic">
                    Authentification
                  </h1>
                  <h2 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent italic">
                    Assuré(e)
                  </h2>
                </motion.div>

                {/* Erreur */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-2.5 sm:mb-3 p-2 bg-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl"
                  >
                    <p className="text-red-700 text-[11px] sm:text-xs font-medium">{error}</p>
                  </motion.div>
                )}

                {/* Formulaire */}
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-2 sm:space-y-2.5"
                >
                  {/* Numéro de dossier */}
                  <div>
                    <label className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-gray-700 mb-1 sm:mb-1.5">
                      <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
                      Numéro de dossier
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        {...register('numero_dossier')}
                        placeholder="DOS-TG001"
                        className={`w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm bg-white border-2 rounded-lg sm:rounded-xl outline-none transition-all duration-300 ${
                          errors.numero_dossier
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100'
                        }`}
                      />
                      <Sparkles className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-300 group-hover:text-green-400 transition-colors" />
                    </div>
                    {errors.numero_dossier && (
                      <p className="mt-0.5 text-[10px] sm:text-xs text-red-600">{errors.numero_dossier.message}</p>
                    )}
                  </div>

                  {/* Numéro de police */}
                  <div>
                    <label className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-gray-700 mb-1 sm:mb-1.5">
                      <Hash className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
                      Numéro de police
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        {...register('numero_police')}
                        placeholder="POL-TG001"
                        className={`w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm bg-white border-2 rounded-lg sm:rounded-xl outline-none transition-all duration-300 ${
                          errors.numero_police
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100'
                        }`}
                      />
                      <Sparkles className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-300 group-hover:text-green-400 transition-colors" />
                    </div>
                    {errors.numero_police && (
                      <p className="mt-0.5 text-[10px] sm:text-xs text-red-600">{errors.numero_police.message}</p>
                    )}
                  </div>

                  {/* Numéro de compte */}
                  <div>
                    <label className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-gray-700 mb-1 sm:mb-1.5">
                      <CreditCard className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
                      Numéro de compte
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        {...register('numero_compte')}
                        placeholder="CPT-TG001"
                        className={`w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm bg-white border-2 rounded-lg sm:rounded-xl outline-none transition-all duration-300 ${
                          errors.numero_compte
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100'
                        }`}
                      />
                      <Sparkles className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-300 group-hover:text-green-400 transition-colors" />
                    </div>
                    {errors.numero_compte && (
                      <p className="mt-0.5 text-[10px] sm:text-xs text-red-600">{errors.numero_compte.message}</p>
                    )}
                  </div>

                  {/* Nom complet */}
                  <div>
                    <label className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-gray-700 mb-1 sm:mb-1.5">
                      <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
                      Nom complet
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        {...register('nom_complet')}
                        placeholder="Votre nom complet"
                        className={`w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm bg-white border-2 rounded-lg sm:rounded-xl outline-none transition-all duration-300 ${
                          errors.nom_complet
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100'
                        }`}
                      />
                      <Sparkles className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-300 group-hover:text-green-400 transition-colors" />
                    </div>
                    {errors.nom_complet && (
                      <p className="mt-0.5 text-[10px] sm:text-xs text-red-600">{errors.nom_complet.message}</p>
                    )}
                  </div>

                  {/* Bouton VERT */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-green-500/30 hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 sm:gap-2 mt-1 sm:mt-1"
                  >
                    {loading ? (
                      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Connexion
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              </div>

              {/* ========== COLONNE DROITE - Branding (VERT) ========== */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="hidden lg:flex flex-col items-center justify-center p-5 md:p-6 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden"
              >
                {/* Liquid Glass */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl pointer-events-none" />
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
                  className="absolute top-10 sm:top-14 right-10 sm:right-14 w-40 h-40 sm:w-52 sm:h-52 bg-white/10 rounded-full blur-3xl pointer-events-none"
                />

                {/* Contenu */}
                <div className="relative z-10 text-center">
                  {/* Logo AROO.png */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="mb-3 sm:mb-4"
                  >
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-[1.5rem] sm:rounded-[1.75rem] transform rotate-6" />
                      <div className="relative bg-white backdrop-blur-xl p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[1.75rem] shadow-2xl border border-white/20">
                        <img
                          src="/AROO.png"
                          alt="Assurances ARO"
                          className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-2xl"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Titre en ITALIQUE BLANC */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1.5 sm:mb-2 drop-shadow-lg italic"
                  >
                    Assurance ARO
                  </motion.h2>

                  {/* Sous-titre en ITALIQUE BLANC */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-xs sm:text-sm md:text-base text-green-50 font-medium px-2 sm:px-3 leading-relaxed italic"
                  >
                    <span className="text-sm sm:text-lg md:text-xl font-bold">Plateforme de gestion et de suivi de vos contrats d'assurance en toute simplicité.</span>
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginAssure;
