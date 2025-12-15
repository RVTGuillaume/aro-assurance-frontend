/**
 * Profil de l'assuré - VERSION OPTIMISÉE COMPACTE
 * ARO Assurance Madagascar
 * @version 4.1 - Espacement réduit + Design préservé
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Calendar, 
  Camera, Loader2, Shield, CheckCircle, 
  X, AlertCircle, Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import assureService from '../../services/assureService';
import { toast } from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const clickTimeout = useRef(null);
  const fileInputRef = useRef(null);

  // ============================================
  // CHARGEMENT INITIAL
  // ============================================
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await assureService.getMyProfile();
      if (response.success) {
        setProfile(response.data);
      } else {
        toast.error(response.message || 'Erreur lors du chargement');
      }
    } catch (error) {
      console.error('❌ Erreur chargement profil:', error);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // GESTION SINGLE/DOUBLE CLICK
  // ============================================
  const handlePhotoClick = () => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      setShowPhotoModal(true);
    } else {
      clickTimeout.current = setTimeout(() => {
        clickTimeout.current = null;
        fileInputRef.current?.click();
      }, 300);
    }
  };

  // ============================================
  // UPLOAD PHOTO
  // ============================================
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`❌ Photo trop volumineuse (max 5MB)`);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('❌ Format non supporté (JPG, PNG, WebP)');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('📸 Upload en cours...');
    
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const response = await assureService.updateMyProfilePhoto(formData);

      if (response.success) {
        await loadProfile();
        toast.success('✅ Photo mise à jour !', { id: toastId });
      }
    } catch (error) {
      toast.error('❌ Erreur upload', { id: toastId });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // ============================================
  // BADGE STATUT
  // ============================================
  const StatusBadge = ({ status }) => {
    const configs = {
      actif: { bg: 'bg-green-500', text: 'Actif' },
      suspendu: { bg: 'bg-yellow-500', text: 'Suspendu' },
      resilie: { bg: 'bg-red-500', text: 'Résilié' }
    };
    const config = configs[status?.toLowerCase()] || configs.actif;

    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${config.bg}`}></div>
        <span className="text-sm font-semibold text-gray-700">{config.text}</span>
      </div>
    );
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Profil non trouvé</h2>
          <button onClick={loadProfile} className="px-6 py-2 bg-emerald-600 text-white rounded-lg">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const photoUrl = profile.photo_url || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.nom_complet)}&size=400&background=047857&color=fff&bold=true`;

  // ============================================
  // RENDU PRINCIPAL
  // ============================================
  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        
        {/* ===== CARTE PRINCIPALE ULTRA-ARRONDIE ===== */}
        <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden">
          
          {/* ===== HEADER GRADIENT VERT (COMPACT) ===== */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-5">
            <div className="flex items-center gap-4">
              {/* Photo */}
              <div className="relative group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative cursor-pointer"
                  onClick={handlePhotoClick}
                >
                  <img
                    src={photoUrl}
                    alt={profile.nom_complet}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                  <div className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${isUploading ? 'opacity-100' : ''}`}>
                    {isUploading ? (
                      <Loader2 className="w-7 h-7 text-white animate-spin" />
                    ) : (
                      <Camera className="w-7 h-7 text-white" />
                    )}
                  </div>
                </motion.div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </div>

              {/* Nom et badge */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-1.5 drop-shadow-lg">
                  {profile.nom_complet}
                </h1>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit">
                  <Shield className="w-3.5 h-3.5 text-white" />
                  <span className="text-white text-xs font-medium">
                    {profile.type_assure === 'titulaire' ? 'Titulaire' : 'Ayant droit'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ===== CORPS DE LA CARTE (COMPACT) ===== */}
          <div className="p-6">
            
            {/* Sections en 2 colonnes */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              
              {/* Colonne gauche */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1.5">
                    Adresse Email
                  </p>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-gray-900 font-medium text-sm">{profile.email}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1.5">
                    Nom complet
                  </p>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-gray-900 font-medium text-sm">{profile.nom_complet}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1.5">
                    Téléphone
                  </p>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-gray-900 font-medium text-sm">{profile.telephone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Colonne droite */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1.5">
                    Numéro de dossier
                  </p>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-gray-900 font-medium text-sm">{profile.numero_dossier}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1.5">
                    Numéro de police
                  </p>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-gray-900 font-medium text-sm">{profile.numero_police}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1.5">
                    Numéro de compte
                  </p>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-gray-900 font-medium text-sm">{profile.numero_compte || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Statut du compte */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1.5">
                Statut du compte
              </p>
              <div className="bg-gray-50 rounded-xl p-3">
                <StatusBadge status={profile.statut_contrat} />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Infos supplémentaires */}
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Agence</p>
                  <p className="text-sm text-gray-900 font-semibold">{profile.agence}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Date de naissance</p>
                  <p className="text-sm text-gray-900 font-semibold">
                    {profile.date_naissance ? new Date(profile.date_naissance).toLocaleDateString('fr-FR') : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Adresse</p>
                  <p className="text-sm text-gray-900 font-semibold truncate">{profile.adresse || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="grid md:grid-cols-2 gap-3 mb-5">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                Modifier la photo
              </button>
              
              <button
                disabled
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-500 rounded-xl cursor-not-allowed font-medium"
              >
                <Lock className="w-4 h-4" />
                Changer le mot de passe
              </button>
            </div>

            {/* Note info */}
            <div className="bg-blue-50 border-l-4 border-blue-400 rounded-xl p-3.5">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900 leading-relaxed">
                  <strong className="font-semibold">ℹ️ Information :</strong> Vous pouvez uniquement modifier votre photo. 
                  Pour toute modification de vos informations, contactez votre administrateur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== MODAL PHOTO AGRANDIE ===== */}
      <AnimatePresence>
        {showPhotoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPhotoModal(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-8"
          >
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute top-6 right-6 text-white hover:text-gray-300 bg-black/30 backdrop-blur-md rounded-full p-3"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={photoUrl}
              alt={profile.nom_complet}
              className="max-w-full max-h-[85vh] rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
