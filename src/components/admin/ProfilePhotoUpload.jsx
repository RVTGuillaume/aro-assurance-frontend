import { useState } from 'react';
import { Camera, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import adminService from '../../services/adminService';
import PhotoModal from './PhotoModal';

export default function ProfilePhotoUpload({ currentPhoto, onPhotoUpdate }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier la taille (15MB max)
    if (file.size > 15 * 1024 * 1024) {
      alert('La photo ne doit pas dépasser 15MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await adminService.uploadProfilePhoto(formData);
      
      if (response.data.success) {
        onPhotoUpdate(response.data.data.photo_url);
        alert('✅ Photo mise à jour avec succès !');
      }
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      alert('Erreur lors de l\'upload de la photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer votre photo de profil ?')) return;

    try {
      await adminService.deleteProfilePhoto();
      onPhotoUpdate(null);
      alert('✅ Photo supprimée');
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
    }
  };

  const photoUrl = currentPhoto 
    ? `${(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '')}${currentPhoto}`
    : 'https://ui-avatars.com/api/?name=Admin&size=800&background=047857&color=fff&bold=true';

  return (
    <>
      <div className="relative group">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative w-48 h-48 mx-auto cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={photoUrl}
            alt="Photo de profil"
            className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl"
          />
          
          {/* Overlay hover */}
          <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="text-white" size={32} />
          </div>
        </motion.div>

        {/* Boutons */}
        <div className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 flex gap-2">
          <label className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-full shadow-lg cursor-pointer transition-colors">
            {isUploading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Camera size={20} />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
          </label>

          {currentPhoto && (
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-colors"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Format accepté */}
      <p className="text-center text-sm text-gray-500 mt-4">
        JPG, PNG ou WebP • Max 15MB • 800x800 recommandé
      </p>

      {/* Modal */}
      <PhotoModal
        photoUrl={photoUrl}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
