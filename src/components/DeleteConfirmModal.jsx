/**
 * 🗑️ MODAL DE CONFIRMATION SUPPRESSION - GLASSMORPHISM ROUGE
 * - Design ultra-moderne avec effet verre (glassmorphism)
 * - Animations Framer Motion fluides
 * - Thème rouge pour action destructive
 * - Boutons avec gradients et effets hover
 * ARO Assurance Madagascar
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2, AlertCircle } from 'lucide-react';

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  fileName,
  isDeleting = false 
}) => {
  
  // ========== VARIANTS ANIMATIONS ==========
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: -50 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: { 
        duration: 0.3 
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        delay: 0.2,
        duration: 0.5,
        type: 'spring',
        stiffness: 200
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95 
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ========== BACKDROP GLASSMORPHISM ========== */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
          >
            {/* ========== MODAL CARD ========== */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(254, 226, 226, 0.95) 0%, rgba(252, 165, 165, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                boxShadow: '0 20px 60px rgba(239, 68, 68, 0.4)'
              }}
            >
              {/* ========== GRADIENT OVERLAY ========== */}
              <div 
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at top right, rgba(239, 68, 68, 0.5) 0%, transparent 60%)'
                }}
              />

              {/* ========== CONTENT ========== */}
              <div className="relative z-10 p-8">
                
                {/* BOUTON FERMER */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-all backdrop-blur-sm"
                  disabled={isDeleting}
                >
                  <X className="w-5 h-5 text-red-800" />
                </motion.button>

                {/* ICÔNE ALERTE ANIMÉE */}
                <motion.div
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    {/* Cercle pulsant en arrière-plan */}
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0.2, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      className="absolute inset-0 rounded-full bg-red-500"
                    />
                    
                    {/* Icône principale */}
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-xl">
                      <AlertTriangle className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                </motion.div>

                {/* TITRE */}
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="text-3xl font-bold text-center text-red-900 mb-3"
                >
                  Confirmer la suppression
                </motion.h3>

                {/* MESSAGE D'AVERTISSEMENT */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="mb-6"
                >
                  <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-red-300/50">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-red-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-900 mb-2">
                          ⚠️ Action irréversible
                        </p>
                        <p className="text-sm text-red-800 leading-relaxed">
                          Vous êtes sur le point de supprimer définitivement ce fichier :
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* NOM DU FICHIER */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="mb-8 p-4 bg-white/60 backdrop-blur-sm rounded-xl border-2 border-red-400"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center flex-shrink-0">
                      <Trash2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-red-700 mb-1">Fichier à supprimer</p>
                      <p className="text-sm font-bold text-red-900 truncate">
                        {fileName || 'Fichier sélectionné'}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* BOUTONS D'ACTION */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="flex gap-3"
                >
                  {/* BOUTON ANNULER */}
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={onClose}
                    disabled={isDeleting}
                    className="flex-1 py-4 bg-white/80 backdrop-blur-sm text-red-900 rounded-xl font-bold shadow-lg hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-red-300"
                  >
                    Annuler
                  </motion.button>

                  {/* BOUTON SUPPRIMER */}
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={onConfirm}
                    disabled={isDeleting}
                    className="flex-1 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-red-800/50 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        {/* ✅ SPINNER CORRIGÉ */}
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            fill="none"
                          />
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Suppression...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        Supprimer
                      </>
                    )}
                  </motion.button>
                </motion.div>

                {/* NOTE DE SÉCURITÉ */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="text-xs text-center text-red-800 mt-4 font-medium"
                >
                  💡 Cette action ne pourra pas être annulée
                </motion.p>
              </div>

              {/* ========== EFFET BRILLANT ========== */}
              <motion.div
                animate={{
                  x: [-500, 500],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
                  width: '200%',
                  height: '100%',
                  transform: 'skewX(-20deg)'
                }}
              />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
