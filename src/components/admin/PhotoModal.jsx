import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PhotoModal({ photoUrl, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X size={32} />
          </button>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photoUrl}
              alt="Photo de profil"
              className="w-full h-auto rounded-3xl shadow-2xl object-cover max-h-[85vh]"
              style={{ borderRadius: '48px' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
