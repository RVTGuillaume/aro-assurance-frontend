/**
 * ✨ MODAL DE PROGRESSION D'UPLOAD EN TEMPS RÉEL ✨
 * Affiche la progression des uploads en arrière-plan
 * ARO Assurance Madagascar
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, Loader } from 'lucide-react';

const UploadProgressModal = ({ uploadProgress }) => {
  // Ne rien afficher si aucun upload en cours
  if (!uploadProgress.uploading && !uploadProgress.completed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-200 w-80 sm:w-96 overflow-hidden">
          
          {/* Header avec gradient dynamique */}
          <div className={`p-4 sm:p-5 ${
            uploadProgress.completed 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
              : 'bg-gradient-to-r from-blue-500 to-cyan-500'
          }`}>
            <div className="flex items-center gap-3">
              {uploadProgress.completed ? (
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              ) : (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: 'linear' 
                  }}
                >
                  <Upload className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </motion.div>
              )}
              
              <div className="flex-1">
                <h3 className="font-bold text-white text-base sm:text-lg">
                  {uploadProgress.completed ? '✅ Upload terminé !' : '⏳ Upload en cours...'}
                </h3>
                <p className="text-white/80 text-xs sm:text-sm">
                  {uploadProgress.uploadedFiles}/{uploadProgress.totalFiles} fichier(s)
                </p>
              </div>
            </div>
          </div>

          {/* Body avec progression */}
          <div className="p-4 sm:p-5">
            {!uploadProgress.completed ? (
              <>
                {/* Informations du fichier en cours */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                    <span 
                      className="truncate max-w-[200px]" 
                      title={uploadProgress.currentFile}
                    >
                      📄 {uploadProgress.currentFile || 'Préparation...'}
                    </span>
                    <span className="font-semibold ml-2">
                      {uploadProgress.progress}%
                    </span>
                  </div>
                  
                  {/* Barre de progression animée */}
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress.progress}%` }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
                    />
                  </div>
                </div>

                {/* Message informatif */}
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  ⏳ Vous pouvez fermer cette fenêtre, l'upload continue en arrière-plan.
                </p>
              </>
            ) : (
              // Message de succès
              <div className="text-center py-2">
                <p className="text-sm sm:text-base text-green-600 font-semibold">
                  🎉 Tous les fichiers ont été uploadés avec succès !
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadProgressModal;
