import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Shield, Edit, Lock, Loader2, Camera, CheckCircle, X, Eye, EyeOff, ZoomIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import adminService from "../../services/adminService";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Profil() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [editData, setEditData] = useState({
    nom_complet: '',
    username: '',
    email: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await adminService.getMyProfile();
      const data = response.data.data;
      
      setProfile(data);
      setEditData({
        nom_complet: data.nom_complet || '',
        username: data.username || '',
        email: data.email || ''
      });
    } catch (error) {
      console.error('Erreur chargement profil:', error);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await adminService.updateMyProfile(editData);
      await loadProfile();
      
      // Mettre à jour localStorage
      const updatedUser = { ...user, ...editData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // FORCER LE REFRESH du navbar immédiatement avec StorageEvent
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'user',
        newValue: JSON.stringify(updatedUser),
      }));
      
      // Déclencher aussi l'événement personnalisé
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
      
      // Appeler updateUser du context si disponible
      if (updateUser) {
        updateUser(updatedUser);
      }
      
      setIsEditing(false);
      toast.success('✅ Profil mis à jour avec succès !', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      toast.error('❌ Erreur lors de la mise à jour');
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier 15MB max
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`❌ La photo ne doit pas dépasser 15MB (Taille: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await adminService.uploadProfilePhoto(formData);
      
      if (response.data.success) {
        await loadProfile();
        toast.success('✅ Photo mise à jour avec succès !', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      toast.error('❌ Erreur lors de l\'upload de la photo');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="animate-spin text-emerald-600" size={64} />
      </div>
    );
  }

  const photoUrl = profile?.photo_profil 
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${profile.photo_profil}` 
    : '/AROO.png';

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 pt-8">
        <div className="w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-6">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={photoUrl}
                    alt="Profil"
                    className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-xl cursor-pointer"
                    onError={(e) => {
                      e.target.src = '/AROO.png';
                    }}
                    onDoubleClick={() => setShowPhotoModal(true)}
                    title="Double-cliquez pour agrandir"
                  />
                  
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <ZoomIn className="text-white" size={32} />
                  </div>
                  
                  <label className="absolute bottom-0 right-0 bg-white hover:bg-gray-50 text-emerald-600 p-3 rounded-full shadow-lg cursor-pointer transition-all hover:scale-110">
                    {isUploading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Camera size={20} />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="text-white flex-1">
                  <h2 className="text-2xl font-bold mb-2">
                    {profile?.nom_complet || 'Non renseigné'}
                  </h2>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full inline-flex">
                    <Shield size={18} />
                    <span className="font-semibold">
                      {profile?.role === 'super_admin' ? 'Super Administrateur' : 'Administrateur'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <InfoCard
                  icon={<Mail className="text-blue-600" size={20} />}
                  label="Adresse Email"
                  value={isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
                    />
                  ) : profile?.email}
                />

                <InfoCard
                  icon={<User className="text-purple-600" size={20} />}
                  label="Nom Complet"
                  value={isEditing ? (
                    <input
                      type="text"
                      value={editData.nom_complet}
                      onChange={(e) => setEditData({ ...editData, nom_complet: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
                    />
                  ) : profile?.nom_complet}
                />

                <InfoCard
                  icon={<User className="text-orange-600" size={20} />}
                  label="Nom d'utilisateur"
                  value={isEditing ? (
                    <input
                      type="text"
                      value={editData.username}
                      onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
                    />
                  ) : profile?.username}
                />

                <InfoCard
                  icon={
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${profile?.statut === 'actif' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                      <CheckCircle className={profile?.statut === 'actif' ? 'text-green-600' : 'text-gray-400'} size={20} />
                    </div>
                  }
                  label="Statut du compte"
                  value={
                    <span className={`font-bold ${profile?.statut === 'actif' ? 'text-green-600' : 'text-gray-600'}`}>
                      {profile?.statut === 'actif' ? 'Actif' : 'Inactif'}
                    </span>
                  }
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={20} />
                      Enregistrer
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <Edit size={20} />
                      Modifier le profil
                    </button>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <Lock size={20} />
                      Changer le mot de passe
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <PhotoModal 
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        photoUrl={photoUrl}
      />

      <ChangePasswordModal 
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3 border border-gray-100 hover:border-emerald-200 transition-all">
      <div className="flex-shrink-0 bg-white p-2 rounded-lg shadow-sm">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          {label}
        </p>
        {typeof value === 'string' ? (
          <p className="font-semibold text-gray-900 text-sm truncate">{value}</p>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

function PhotoModal({ isOpen, onClose, photoUrl }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all"
        >
          <X size={24} />
        </button>

        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          src={photoUrl}
          alt="Photo de profil"
          className="max-w-2xl max-h-[80vh] object-contain rounded-3xl shadow-2xl border-8 border-white/20"
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>
  );
}

function ChangePasswordModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      toast.error('❌ Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.new_password.length < 8) {
      toast.error('❌ Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);

    try {
      await adminService.changePassword({
        old_password: formData.old_password,
        new_password: formData.new_password
      });

      toast.success('✅ Mot de passe changé avec succès !');
      onClose();
      setFormData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      toast.error('❌ Erreur: ' + (error.response?.data?.message || 'Ancien mot de passe incorrect'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Lock className="text-amber-600" size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Changer le mot de passe</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
              label="Ancien mot de passe"
              value={formData.old_password}
              onChange={(e) => setFormData({ ...formData, old_password: e.target.value })}
              show={showPasswords.old}
              onToggle={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
            />

            <PasswordInput
              label="Nouveau mot de passe"
              value={formData.new_password}
              onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
              show={showPasswords.new}
              onToggle={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
            />

            <PasswordInput
              label="Confirmer le mot de passe"
              value={formData.confirm_password}
              onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
              show={showPasswords.confirm}
              onToggle={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
            />

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Changement...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Valider
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function PasswordInput({ label, value, onChange, show, onToggle }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
