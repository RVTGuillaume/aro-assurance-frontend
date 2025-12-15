/**
 * ✨ MODIFICATION DÉCLARATION ARO - ULTRA MODERNE & RESPONSIVE ✨
 * - Design identique à NewDeclaration
 * - Pré-remplissage automatique des données existantes
 * - Modal de confirmation avec choix envoi email + BDD
 * - Gestion fichiers existants + nouveaux fichiers
 * - Animations Framer Motion fluides
 * - Email automatique à l'admin après modification
 * - Affichage des badges pour fichiers initiaux vs compléments
 * - Affichage de TOUS les champs cachés de DeclarationDetails
 * ARO Assurance Madagascar
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Upload,
  X,
  Check,
  AlertCircle,
  User,
  Calendar,
  MapPin,
  Activity,
  Heart,
  Hospital,
  Pill,
  Smile,
  ArrowLeft,
  Mail,
  Database,
  CheckCircle,
  Loader,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  FileVideo,
  File,
  Paperclip,
  PlusCircle,
} from 'lucide-react';
import declarationApi from '../../services/declarationApi';
import SuccessModal from '../../components/SuccessModal';
const EditDeclaration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // ========== ÉTATS ==========
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
  isOpen: false,
  fileId: null,
  fileName: ''
});

const [isDeleting, setIsDeleting] = useState(false);

  const [declarationData, setDeclarationData] = useState({
    numero: '',
    emailSent: false,
    dbSaved: false,
    filesUploading: false
  });
  
  const [formData, setFormData] = useState({
    adresse_assure: '',
    personne_soignee_nom: '',
    personne_soignee_profession: '',
    personne_soignee_age: '',
    personne_soignee_parente: '',
    autre_garantie_couvre: '',
    type_sinistre: '',
    // Accident
    accident_date: '',
    accident_lieu: '',
    accident_constate_par: '',
    accident_circonstances: '',
    accident_blessures: '',
    accident_soigne_par: '',
    // Maladie
    maladie_type: '',
    maladie_code_oms: '',
    maladie_designation: '',
    maladie_soignee_par: '',
    maladie_date_debut: '',
    // Hospitalisation
    hospitalisation_etablissement: '',
    hospitalisation_date_debut: '',
    hospitalisation_date_fin: '',
    hospitalisation_operation_par: '',
    hospitalisation_description: '',
    // Soins dentaires
    soins_dentaires_date_debut: '',
    soins_dentaires_date_fin: '',
    soins_dentaires_effectues_par: '',
  });

  const [existingFiles, setExistingFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [sendOptions, setSendOptions] = useState({
    sendEmail: true,
    saveToDb: true,
  });

  // ========== ANIMATIONS ==========
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.48, 0.15, 0.25, 0.96],
      },
    },
  };

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.02,
      y: -5,
      transition: { duration: 0.3 },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.48, 0.15, 0.25, 0.96],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  };

  // ========== TYPES DE SINISTRES ==========
  const TYPES_SINISTRES = [
    {
      value: 'accident',
      label: 'Accident',
      icon: Activity,
      gradient: 'from-red-500 to-orange-500',
      bgGradient: 'from-red-50 to-orange-50',
      borderColor: 'border-red-300',
      description: 'Accident corporel, collision, chute...',
    },
    {
      value: 'maladie',
      label: 'Maladie',
      icon: Heart,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300',
      description: 'Maladie, ophtalmologie...',
    },
    {
      value: 'hospitalisation',
      label: 'Hospitalisation',
      icon: Hospital,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      description: 'Séjour hospitalier, opération...',
    },
    {
      value: 'soins_dentaires',
      label: 'Soins Dentaires',
      icon: Smile,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-300',
      description: 'Soins, prothèses, orthodontie...',
    },
  ];

  // ========== CHARGEMENT DES DONNÉES EXISTANTES ==========
  useEffect(() => {
    loadDeclaration();
  }, [id]);

  const loadDeclaration = async () => {
    try {
      setLoading(true);
      console.log('🔍 Chargement déclaration ID:', id);
      
      // ✅ Charger la déclaration avec cache busting
      const response = await declarationApi.getById(id, {
        _t: Date.now()
      });

      if (response.success) {
        const data = response.data;
        
        console.log('✅ ===== DÉCLARATION RECHARGÉE =====');
        console.log('📦 Response complète:', response);
        console.log('📋 Data:', data);
        console.log('📁 Fichiers bruts:', data.fichiers);
        console.log('📊 Type de fichiers:', typeof data.fichiers);
        console.log('📈 Nombre de fichiers:', data.fichiers?.length || 0);
        
        // ✅ PRÉ-REMPLIR TOUS LES CHAMPS
        setFormData({
          adresse_assure: data.adresse_assure || '',
          personne_soignee_nom: data.personne_soignee_nom || '',
          personne_soignee_profession: data.personne_soignee_profession || '',
          personne_soignee_age: data.personne_soignee_age || '',
          personne_soignee_parente: data.personne_soignee_parente || '',
          autre_garantie_couvre: data.autre_garantie_couvre || '',
          type_sinistre: data.type_sinistre || '',
          // Accident
          accident_date: data.accident_date?.split('T')[0] || '',
          accident_lieu: data.accident_lieu || '',
          accident_constate_par: data.accident_constate_par || '',
          accident_circonstances: data.accident_circonstances || '',
          accident_blessures: data.accident_blessures || '',
          accident_soigne_par: data.accident_soigne_par || '',
          // Maladie
          maladie_type: data.maladie_type || '',
          maladie_code_oms: data.maladie_code_oms || '',
          maladie_designation: data.maladie_designation || '',
          maladie_soignee_par: data.maladie_soignee_par || '',
          maladie_date_debut: data.maladie_date_debut?.split('T')[0] || '',
          // Hospitalisation
          hospitalisation_etablissement: data.hospitalisation_etablissement || '',
          hospitalisation_date_debut: data.hospitalisation_date_debut?.split('T')[0] || '',
          hospitalisation_date_fin: data.hospitalisation_date_fin?.split('T')[0] || '',
          hospitalisation_operation_par: data.hospitalisation_operation_par || '',
          hospitalisation_description: data.hospitalisation_description || '',
          // Soins dentaires
          soins_dentaires_date_debut: data.soins_dentaires_date_debut?.split('T')[0] || '',
          soins_dentaires_date_fin: data.soins_dentaires_date_fin?.split('T')[0] || '',
          soins_dentaires_effectues_par: data.soins_dentaires_effectues_par || '',
        });

        setDeclarationData(prev => ({ ...prev, numero: data.numero_declaration }));

        // ✅ CHARGER LES FICHIERS AVEC LOGS DÉTAILLÉS (COMME DeclarationDetails)
        if (data.fichiers && Array.isArray(data.fichiers)) {
          data.fichiers.forEach((f, i) => {
            console.log(`\n📄 Fichier ${i + 1}:`, {
              id: f.id,
              nom_original: f.nom_original,
              source_fichier: f.source_fichier,
              chemin_fichier: f.chemin_fichier,
              taille_octets: f.taille_octets,
            });
          });
          
          setExistingFiles(data.fichiers);
          console.log('✅ Fichiers chargés:', data.fichiers.length);
        } else {
          console.warn('⚠️ Aucun fichier trouvé');
          setExistingFiles([]);
        }
      } else {
        alert('❌ Déclaration introuvable');
        navigate('/assure/declarations');
      }
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
      alert('❌ Erreur lors du chargement');
      navigate('/assure/declarations');
    } finally {
      setLoading(false);
    }
  };

  // ========== FILTRER FICHIERS ORIGINAUX (COMME DeclarationDetails) ==========
  const getFichiersOriginaux = () => {
    if (!existingFiles || !Array.isArray(existingFiles)) {
      return [];
    }
    
    const originaux = existingFiles.filter(f => f.source_fichier === 'original');
    console.log(`📋 Fichiers originaux: ${originaux.length}`);
    return originaux;
  };

  // ========== FILTRER FICHIERS COMPLÉMENTS (COMME DeclarationDetails) ==========
  const getFichiersComplements = () => {
    if (!existingFiles || !Array.isArray(existingFiles)) {
      return [];
    }
    
    const complements = existingFiles.filter(f => f.source_fichier === 'complement');
    console.log(`📋 Fichiers compléments: ${complements.length}`);
    return complements;
  };

  // ========== GESTION DES CHANGEMENTS ==========
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // ========== GESTION DES FICHIERS ==========
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 15 * 1024 * 1024 * 1024; // 15 Go
    const validFiles = selectedFiles.filter((file) => file.size <= maxSize);

    if (selectedFiles.length > validFiles.length) {
      alert(`⚠️ ${selectedFiles.length - validFiles.length} fichier(s) dépassent 15 Go`);
    }

    setNewFiles((prev) => [...prev, ...validFiles]);
  };

  const removeNewFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ========== OUVRIR LE MODAL DE SUPPRESSION ==========
const openDeleteModal = (fileId, fileName) => {
  setDeleteModal({
    isOpen: true,
    fileId,
    fileName
  });
};

// ========== FERMER LE MODAL ==========
const closeDeleteModal = () => {
  if (!isDeleting) {
    setDeleteModal({
      isOpen: false,
      fileId: null,
      fileName: ''
    });
  }
};


// ========== CONFIRMER LA SUPPRESSION ==========
      const confirmDelete = async () => {
        if (!deleteModal.fileId) return;

        try {
          setIsDeleting(true);
          console.log('🗑️ Suppression du fichier ID:', deleteModal.fileId);

          // ✅ APPEL de la nouvelle fonction deleteFile
          await declarationApi.deleteFile(deleteModal.fileId);

          // ✅ Mettre à jour la liste locale
          setExistingFiles((prev) => prev.filter((f) => f.id !== deleteModal.fileId));
          
          console.log('✅ Fichier supprimé de la BDD');
          closeDeleteModal();
          alert(`✅ Fichier "${deleteModal.fileName}" supprimé définitivement`);

        } catch (error) {
          console.error('❌ Erreur suppression:', error);
          alert(`❌ ${error.message}`);
        } finally {
          setIsDeleting(false);
        }
      };


  // ✅ FORMAT TAILLE FICHIER (EXACTEMENT COMME DeclarationDetails)
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Ko';
    
    const k = 1024;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // ✅ ICÔNE SELON TYPE DE FICHIER (EXACTEMENT COMME DeclarationDetails)
  const getFileIconComponent = (fichier) => {
    const fileName = fichier.nom_original?.toLowerCase() || '';
    const fileType = fichier.type_fichier?.toLowerCase() || '';
    
    if (fileType.includes('image') || /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/.test(fileName)) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    }
    
    if (fileType.includes('video') || /\.(mp4|avi|mov|mkv|webm|flv|wmv)$/.test(fileName)) {
      return <FileVideo className="w-5 h-5 text-purple-500" />;
    }
    
    if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    
    if (/\.(doc|docx|xls|xlsx|ppt|pptx)$/.test(fileName)) {
      return <FileText className="w-5 h-5 text-blue-600" />;
    }
    
    return <File className="w-5 h-5 text-[#006B5B]" />;
  };

  // ✅ OUVRIR FICHIER (EXACTEMENT COMME DeclarationDetails)
  const handleOpenFile = async (fichier) => {
    try {
      console.log('\n🔓 ===== OUVERTURE FICHIER =====');
      console.log('📄 Fichier complet:', fichier);
      console.log('📄 Nom:', fichier.nom_original);
      console.log('📂 Chemin brut:', fichier.chemin_fichier);
      console.log('📂 Nom stockage:', fichier.nom_stockage);
      console.log('🏷️ Source:', fichier.source_fichier);
      
      const cheminFichier = fichier.chemin_fichier;
      
      if (!cheminFichier) {
        console.error('❌ Aucun chemin trouvé dans:', fichier);
        alert(`⚠️ Impossible d'ouvrir "${fichier.nom_original}"\nChemin manquant dans les données`);
        return;
      }

      // ✅ DÉTERMINER LA BASE URL
      const baseURL = window.location.origin.includes('localhost') 
        ? 'http://localhost:5000'
        : window.location.origin;
      
      console.log('🌐 Base URL:', baseURL);

      let fileUrl = '';

      // ✅ CAS 1 : Chemin absolu complet
      if (cheminFichier.startsWith('/home/') || cheminFichier.includes(':\\')) {
        console.log('📍 Cas 1: Chemin absolu système');
        
        if (cheminFichier.includes('/uploads/')) {
          const relativePath = cheminFichier.substring(cheminFichier.indexOf('/uploads/'));
          fileUrl = `${baseURL}${relativePath}`;
          console.log('  → Chemin relatif extrait:', relativePath);
        } 
        else if (fichier.nom_stockage) {
          fileUrl = `${baseURL}/uploads/declarations/${fichier.nom_stockage}`;
          console.log('  → Utilisation nom_stockage:', fichier.nom_stockage);
        }
        else {
          const filename = cheminFichier.split('/').pop();
          fileUrl = `${baseURL}/uploads/declarations/${filename}`;
          console.log('  → Nom fichier extrait:', filename);
        }
      }
      
      // ✅ CAS 2 : Chemin relatif
      else if (cheminFichier.startsWith('uploads/')) {
        console.log('📍 Cas 2: Chemin relatif');
        fileUrl = `${baseURL}/${cheminFichier}`;
      }
      
      // ✅ CAS 3 : Chemin avec /uploads/ au milieu
      else if (cheminFichier.includes('/uploads/')) {
        console.log('📍 Cas 3: Chemin contenant /uploads/');
        const relativePath = cheminFichier.substring(cheminFichier.indexOf('/uploads/'));
        fileUrl = `${baseURL}${relativePath}`;
      }
      
      // ✅ CAS 4 : Seulement le nom du fichier
      else {
        console.log('📍 Cas 4: Nom de fichier uniquement');
        const filename = cheminFichier.split('/').pop();
        fileUrl = `${baseURL}/uploads/declarations/${filename}`;
      }

      console.log('🌐 URL finale construite:', fileUrl);
      
      // ✅ VÉRIFIER SI L'URL EST VALIDE
      if (!fileUrl || fileUrl === baseURL || fileUrl.endsWith('/undefined')) {
        console.error('❌ URL invalide construite:', fileUrl);
        alert(`⚠️ Impossible de construire l'URL pour "${fichier.nom_original}"\n\nDétails techniques:\nChemin: ${cheminFichier}\nNom stockage: ${fichier.nom_stockage || 'N/A'}`);
        return;
      }

      console.log('✅ Ouverture dans nouvel onglet...');
      
      // ✅ OUVRIR DANS UN NOUVEL ONGLET
      const newWindow = window.open(fileUrl, '_blank', 'noopener,noreferrer');
      
      if (!newWindow) {
        console.warn('⚠️ Popup bloquée, tentative de téléchargement...');
        
        const link = document.createElement('a');
        link.href = fileUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      console.log('✅ Fichier ouvert avec succès');
      
    } catch (error) {
      console.error('❌ Erreur ouverture fichier:', error);
      console.error('❌ Stack:', error.stack);
      alert(`⚠️ Erreur lors de l'ouverture du fichier:\n\n${error.message}\n\nConsultez la console (F12) pour plus de détails.`);
    }
  };

  // ========== VALIDATION DU FORMULAIRE ==========
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.adresse_assure.trim())
      newErrors.adresse_assure = 'Adresse obligatoire';
    if (!formData.personne_soignee_nom.trim())
      newErrors.personne_soignee_nom = 'Nom obligatoire';
    if (!formData.personne_soignee_age)
      newErrors.personne_soignee_age = 'Âge obligatoire';
    if (!formData.personne_soignee_parente)
      newErrors.personne_soignee_parente = 'Parenté obligatoire';
    if (!formData.type_sinistre) 
      newErrors.type_sinistre = 'Type de sinistre obligatoire';

    if (formData.type_sinistre === 'accident') {
      if (!formData.accident_date) 
        newErrors.accident_date = 'Date obligatoire';
      if (!formData.accident_circonstances.trim())
        newErrors.accident_circonstances = 'Circonstances obligatoires';
    }

    if (formData.type_sinistre === 'maladie') {
      if (!formData.maladie_date_debut)
        newErrors.maladie_date_debut = 'Date de début obligatoire';
    }

    if (formData.type_sinistre === 'hospitalisation') {
      if (!formData.hospitalisation_etablissement.trim())
        newErrors.hospitalisation_etablissement = 'Établissement obligatoire';
      if (!formData.hospitalisation_date_debut)
        newErrors.hospitalisation_date_debut = "Date d'entrée obligatoire";
    }

    if (formData.type_sinistre === 'soins_dentaires') {
      if (!formData.soins_dentaires_date_debut)
        newErrors.soins_dentaires_date_debut = 'Date de début obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ========== OUVERTURE DU MODAL DE CONFIRMATION ==========
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }

    setShowConfirmModal(true);
  };

  
  // ========== SOUMISSION APRÈS CONFIRMATION ==========
  const handleConfirmedSubmit = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);

    try {
      console.log('📤 Envoi de la modification:', { id, formData, sendOptions });
      console.log('📦 Nouveaux fichiers à uploader:', newFiles.length);

      // ✅ ÉTAPE 1 : ENVOYER LES DONNÉES
      const result = await declarationApi.update(id, {
        ...formData,
        sendEmail: sendOptions.sendEmail,
        saveToDb: sendOptions.saveToDb,
      });

      console.log('✅ Résultat API update:', result);

      // ✅ ÉTAPE 2 : MISE À JOUR DES DONNÉES
      setDeclarationData({
        numero: declarationData.numero || result.data?.numero_declaration || 'N/A',
        emailSent: sendOptions.sendEmail && result.success,
        dbSaved: sendOptions.saveToDb && result.success,
        filesUploading: newFiles.length > 0 && sendOptions.saveToDb
      });

      console.log('🎉 Affichage immédiat du modal de succès');

      // ✅ AFFICHE LE MODAL DE SUCCÈS IMMÉDIATEMENT
      setSubmitting(false);
      setShowSuccessModal(true);

      // ✅ ÉTAPE 3 : UPLOAD DES FICHIERS EN ARRIÈRE-PLAN
      if (newFiles.length > 0 && sendOptions.saveToDb) {
        console.log('📤 Upload de', newFiles.length, 'fichiers en arrière-plan...');
        
        (async () => {
          try {
            const uploadResult = await declarationApi.uploadFilesForDeclaration(
              id, 
              newFiles, 
              'complement'
            );
            
            console.log('✅ Upload terminé:', uploadResult);

            // ✅ RECHARGER LA LISTE DES FICHIERS
            if (uploadResult.success) {
              const updatedResponse = await declarationApi.getById(id, { _t: Date.now() });
              if (updatedResponse.success && Array.isArray(updatedResponse.data.fichiers)) {
                setExistingFiles(updatedResponse.data.fichiers);
                console.log('✅ Liste des fichiers mise à jour:', updatedResponse.data.fichiers.length);
              }
            }

            setDeclarationData(prev => ({ 
              ...prev, 
              filesUploading: false 
            }));

          } catch (uploadError) {
            console.error('❌ Erreur upload fichiers:', uploadError);
            setDeclarationData(prev => ({ 
              ...prev, 
              filesUploading: false 
            }));
          }
        })();
      }

    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('❌ Erreur: ' + (error.response?.data?.message || error.message));
      setSubmitting(false);
    }
  };

  // ========== FERMETURE DU MODAL DE SUCCÈS ==========
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/assure/declarations');
  };

  // ========== LOADER PENDANT CHARGEMENT INITIAL ==========
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{
            scale: { duration: 0.3 },
            rotate: { duration: 1, repeat: Infinity, ease: 'linear' }
          }}
          className="w-20 h-20 border-4 border-gray-300 border-t-[#006B5B] rounded-full"
        />
      </div>
    );
  }

  // ✅ RÉCUPÉRER LES FICHIERS FILTRÉS
  const fichiersOriginaux = getFichiersOriginaux();
  const fichiersComplements = getFichiersComplements();

  console.log('\n🎨 ===== RENDER =====');
  console.log('📊 Fichiers originaux à afficher:', fichiersOriginaux.length);
  console.log('📊 Fichiers compléments à afficher:', fichiersComplements.length);

  // ========== RENDU PRINCIPAL ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* ========== HEADER ========== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
              
              {/* LOGO */}
              <motion.img
                src="/AROO.png"
                alt="Assurance ARO"
                className="h-20 sm:h-24 lg:h-28 w-auto object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                onError={(e) => { e.target.src = '/AROO.jpg'; }}
              />
              
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-clip-text text-transparent">
                  Modifier la Déclaration
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  {declarationData.numero}
                </p>
              </div>
            </div>

            {/* BOUTON RETOUR */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/assure/declarations')}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-green-200 text-green-700 rounded-xl shadow-md hover:shadow-lg transition-all text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Retour
            </motion.button>
          </div>
        </motion.div>

        {/* ========== FORMULAIRE ========== */}
        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleFormSubmit}
          className="space-y-4 sm:space-y-6"
        >
          
          {/* ========== INFORMATIONS GÉNÉRALES ========== */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-green-100"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Informations Générales
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Adresse assuré */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse de l'assuré *
                </label>
                <input
                  type="text"
                  name="adresse_assure"
                  value={formData.adresse_assure}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-sm sm:text-base"
                  placeholder="Votre adresse complète"
                />
                {errors.adresse_assure && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    {errors.adresse_assure}
                  </p>
                )}
              </div>

              {/* Nom personne soignée */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom de la personne soignée *
                </label>
                <input
                  type="text"
                  name="personne_soignee_nom"
                  value={formData.personne_soignee_nom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-sm sm:text-base"
                  placeholder="Nom complet"
                />
                {errors.personne_soignee_nom && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.personne_soignee_nom}
                  </p>
                )}
              </div>

              {/* Profession */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Profession
                </label>
                <input
                  type="text"
                  name="personne_soignee_profession"
                  value={formData.personne_soignee_profession}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-sm sm:text-base"
                  placeholder="Profession"
                />
              </div>

              {/* Âge */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Âge *
                </label>
                <input
                  type="number"
                  name="personne_soignee_age"
                  value={formData.personne_soignee_age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-sm sm:text-base"
                  min="0"
                  max="150"
                />
                {errors.personne_soignee_age && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.personne_soignee_age}
                  </p>
                )}
              </div>

              {/* Lien de parenté */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lien de parenté *
                </label>
                <select
                  name="personne_soignee_parente"
                  value={formData.personne_soignee_parente}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-sm sm:text-base"
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="Assuré(e)">Assuré(e)</option>
                  <option value="Conjoint(e)">Conjoint(e)</option>
                  <option value="Enfant">Enfant</option>
                  <option value="Parent">Parent</option>
                  <option value="Autre">Autre</option>
                </select>
                {errors.personne_soignee_parente && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.personne_soignee_parente}
                  </p>
                )}
              </div>

              {/* Autre garantie */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Autre garantie couverte
                </label>
                <input
                  type="text"
                  name="autre_garantie_couvre"
                  value={formData.autre_garantie_couvre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-sm sm:text-base"
                  placeholder="Autre garantie si applicable"
                />
              </div>
            </div>
          </motion.div>

          {/* ========== TYPE DE SINISTRE ========== */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-green-100"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Type de Sinistre *
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {TYPES_SINISTRES.map((type, index) => {
                const Icon = type.icon;
                const isSelected = formData.type_sinistre === type.value;

                return (
                  <motion.div
                    key={type.value}
                    custom={index}
                    variants={cardHoverVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        type_sinistre: type.value,
                      }))
                    }
                    className={`
                      relative p-4 sm:p-6 rounded-2xl cursor-pointer border-2 transition-all
                      ${
                        isSelected
                          ? `bg-gradient-to-br ${type.bgGradient} ${type.borderColor} border-3 shadow-lg`
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${type.gradient} shadow-lg flex-shrink-0`}
                      >
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                          {type.label}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {type.description}
                        </p>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 sm:top-4 sm:right-4"
                        >
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {errors.type_sinistre && (
              <p className="text-red-500 text-xs sm:text-sm mt-4 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                {errors.type_sinistre}
              </p>
            )}
          </motion.div>

          {/* ========== SECTIONS CONDITIONNELLES ========== */}
          <AnimatePresence mode="wait">
            
            {/* ACCIDENT */}
            {formData.type_sinistre === 'accident' && (
              <motion.div
                key="accident"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-red-200"
              >
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                  <h2 className="text-xl sm:text-2xl font-bold text-red-900">
                    Détails de l'Accident
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="accident_date"
                      value={formData.accident_date}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-sm sm:text-base"
                    />
                    {errors.accident_date && (
                      <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.accident_date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Lieu</label>
                    <input
                      type="text"
                      name="accident_lieu"
                      value={formData.accident_lieu}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 transition-all text-sm sm:text-base"
                      placeholder="Lieu de l'accident"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Témoin(s)</label>
                    <input
                      type="text"
                      name="accident_constate_par"
                      value={formData.accident_constate_par}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 transition-all text-sm sm:text-base"
                      placeholder="Nom des témoins"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Soigné par</label>
                    <input
                      type="text"
                      name="accident_soigne_par"
                      value={formData.accident_soigne_par}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 transition-all text-sm sm:text-base"
                      placeholder="Médecin, établissement..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Blessures</label>
                    <textarea
                      name="accident_blessures"
                      value={formData.accident_blessures}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 transition-all text-sm sm:text-base"
                      placeholder="Décrivez les blessures..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Circonstances *</label>
                    <textarea
                      name="accident_circonstances"
                      value={formData.accident_circonstances}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 transition-all text-sm sm:text-base"
                      placeholder="Décrivez les circonstances..."
                    />
                    {errors.accident_circonstances && (
                      <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.accident_circonstances}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* MALADIE */}
            {formData.type_sinistre === 'maladie' && (
              <motion.div
                key="maladie"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-blue-200"
              >
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-900">Détails de la Maladie</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                    <select
                      name="maladie_type"
                      value={formData.maladie_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 transition-all text-sm sm:text-base"
                    >
                      <option value="">-- Sélectionner --</option>
                      <option value="maladie">Maladie générale</option>
                      <option value="ophtalmologie">Ophtalmologie</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date de début *</label>
                    <input
                      type="date"
                      name="maladie_date_debut"
                      value={formData.maladie_date_debut}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 transition-all text-sm sm:text-base"
                    />
                    {errors.maladie_date_debut && (
                      <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.maladie_date_debut}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Code OMS</label>
                    <input
                      type="text"
                      name="maladie_code_oms"
                      value={formData.maladie_code_oms}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 transition-all text-sm sm:text-base"
                      placeholder="Ex: A00.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Désignation</label>
                    <input
                      type="text"
                      name="maladie_designation"
                      value={formData.maladie_designation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 transition-all text-sm sm:text-base"
                      placeholder="Ex: Grippe"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Soigné par</label>
                    <input
                      type="text"
                      name="maladie_soignee_par"
                      value={formData.maladie_soignee_par}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 transition-all text-sm sm:text-base"
                      placeholder="Nom du médecin..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* HOSPITALISATION */}
            {formData.type_sinistre === 'hospitalisation' && (
              <motion.div
                key="hospitalisation"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-green-200"
              >
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <Hospital className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  <h2 className="text-xl sm:text-2xl font-bold text-green-900">Détails de l'Hospitalisation</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Établissement *</label>
                    <input
                      type="text"
                      name="hospitalisation_etablissement"
                      value={formData.hospitalisation_etablissement}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 transition-all text-sm sm:text-base"
                      placeholder="Nom de l'hôpital/clinique"
                    />
                    {errors.hospitalisation_etablissement && (
                      <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.hospitalisation_etablissement}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date d'entrée *</label>
                    <input
                      type="date"
                      name="hospitalisation_date_debut"
                      value={formData.hospitalisation_date_debut}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 transition-all text-sm sm:text-base"
                    />
                    {errors.hospitalisation_date_debut && (
                      <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.hospitalisation_date_debut}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date de sortie</label>
                    <input
                      type="date"
                      name="hospitalisation_date_fin"
                      value={formData.hospitalisation_date_fin}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 transition-all text-sm sm:text-base"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Opération effectuée par</label>
                    <input
                      type="text"
                      name="hospitalisation_operation_par"
                      value={formData.hospitalisation_operation_par}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 transition-all text-sm sm:text-base"
                      placeholder="Nom du chirurgien..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      name="hospitalisation_description"
                      value={formData.hospitalisation_description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 transition-all text-sm sm:text-base"
                      placeholder="Décrivez la raison de l'hospitalisation..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* SOINS DENTAIRES */}
            {formData.type_sinistre === 'soins_dentaires' && (
              <motion.div
                key="soins_dentaires"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-purple-200"
              >
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <Smile className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                  <h2 className="text-xl sm:text-2xl font-bold text-purple-900">Détails des Soins Dentaires</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date de début *</label>
                    <input
                      type="date"
                      name="soins_dentaires_date_debut"
                      value={formData.soins_dentaires_date_debut}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 transition-all text-sm sm:text-base"
                    />
                    {errors.soins_dentaires_date_debut && (
                      <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.soins_dentaires_date_debut}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date de fin</label>
                    <input
                      type="date"
                      name="soins_dentaires_date_fin"
                      value={formData.soins_dentaires_date_fin}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 transition-all text-sm sm:text-base"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Effectués par</label>
                    <input
                      type="text"
                      name="soins_dentaires_effectues_par"
                      value={formData.soins_dentaires_effectues_par}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 transition-all text-sm sm:text-base"
                      placeholder="Nom du dentiste..."
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ========== GESTION DES FICHIERS AVEC SÉPARATION ========== */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-green-100"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Pièces Justificatives</h2>
            </div>

            {/* ✅ SECTION 1 : FICHIERS ORIGINAUX */}
            {fichiersOriginaux.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <Paperclip className="w-5 h-5 text-blue-600" />
                    Fichiers originaux
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium text-sm">
                    {fichiersOriginaux.length}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-3">
                  {fichiersOriginaux.map((fichier, index) => (
                    <motion.div
                      key={`original-${fichier.id || index}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="flex items-center justify-between p-3 rounded-xl border-2 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-400 transition-all duration-200 hover:shadow-xl"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0 pr-3">
                        {getFileIconComponent(fichier)}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900 truncate text-sm">
                              {fichier.nom_original}
                            </p>
                            <span className="inline-block px-2 py-0.5 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
                              Original
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-600">
                              {formatFileSize(fichier.taille_octets)}
                            </p>
                            {fichier.date_ajout && (
                              <>
                                <span className="text-gray-400">•</span>
                                <p className="text-xs text-gray-500">
                                  {new Date(fichier.date_ajout).toLocaleDateString('fr-FR')}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleOpenFile(fichier)}
                          className="flex-shrink-0 p-2 rounded-lg transition-all shadow-md hover:shadow-xl bg-gradient-to-r from-[#006B5B] to-green-600 hover:from-green-600 hover:to-[#006B5B] text-white"
                          title="Ouvrir le document"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openDeleteModal(fichier.id, fichier.nom_original)}
                        title="Supprimer le fichier"
                        aria-label={`Supprimer ${fichier.nom_original}`}
                        disabled={isDeleting}

                                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-700 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">📎 Fichiers uploadés lors de la création</p>
                      <p className="text-blue-700">
                        Documents originaux joints au moment de la déclaration initiale
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* ✅ SECTION 2 : FICHIERS COMPLÉMENTS */}
            {fichiersComplements.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-green-600" />
                    Fichiers complémentaires
                  </h3>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium text-sm">
                    {fichiersComplements.length}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-3">
                  {fichiersComplements.map((fichier, index) => (
                    <motion.div
                      key={`complement-${fichier.id || index}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="flex items-center justify-between p-3 rounded-xl border-2 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-400 transition-all duration-200 hover:shadow-xl"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0 pr-3">
                        {getFileIconComponent(fichier)}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900 truncate text-sm">
                              {fichier.nom_original}
                            </p>
                            <span className="inline-block px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                              Complément
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-600">
                              {formatFileSize(fichier.taille_octets)}
                            </p>
                            {fichier.date_ajout && (
                              <>
                                <span className="text-gray-400">•</span>
                                <p className="text-xs text-gray-500">
                                  {new Date(fichier.date_ajout).toLocaleDateString('fr-FR')}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleOpenFile(fichier)}
                          className="flex-shrink-0 p-2 rounded-lg transition-all shadow-md hover:shadow-xl bg-gradient-to-r from-[#006B5B] to-green-600 hover:from-green-600 hover:to-[#006B5B] text-white"
                          title="Ouvrir le document"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openDeleteModal(fichier.id, fichier.nom_original)}  // ✅ CORRIGÉ
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer le fichier"
                          aria-label={`Supprimer ${fichier.nom_original}`}
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>

                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-2 border-green-200"
                >
                  <div className="flex items-start gap-3">
                    <PlusCircle className="w-5 h-5 text-green-700 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-green-800">
                      <p className="font-semibold mb-1">📤 Fichiers ajoutés après la déclaration</p>
                      <p className="text-green-700">
                        Documents complémentaires uploadés via la page de modification
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* ⚠️ SI AUCUN FICHIER */}
            {fichiersOriginaux.length === 0 && fichiersComplements.length === 0 && (
              <div className="mb-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-10 h-10 text-yellow-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-yellow-800 mb-1">
                      Aucun fichier disponible
                    </h3>
                    <p className="text-yellow-700 text-sm">
                      Aucune pièce justificative n'a été uploadée pour cette déclaration.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Nouveaux fichiers à ajouter */}
            {newFiles.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-orange-600" />
                  Nouveaux fichiers ({newFiles.length})
                </h3>
                <div className="space-y-2">
                  {newFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-200"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="w-5 h-5 text-orange-600" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <span className="px-2 py-0.5 bg-orange-200 text-orange-700 text-xs rounded-full font-medium">
                              Nouveau
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeNewFile(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Zone d'upload */}
            <div className="relative">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept="*/*"
                className="hidden"
                id="file-upload-edit"
              />
              <label
                htmlFor="file-upload-edit"
                className="flex flex-col items-center justify-center w-full px-4 py-6 sm:py-8 border-2 border-dashed border-green-300 rounded-xl bg-white hover:bg-green-50 transition-all cursor-pointer group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mb-3 group-hover:text-green-600 transition-colors" />
                </motion.div>
                <p className="text-sm sm:text-base font-semibold text-gray-700 mb-1">
                  Ajouter de nouveaux fichiers
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  PDF, Images, Vidéos... (max 15 Go/fichier)
                </p>
              </label>
            </div>
          </motion.div>

          {/* ========== BOUTONS DE SOUMISSION ========== */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/assure/declarations')}
              disabled={submitting}
              className="flex-1 py-3 sm:py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 text-sm sm:text-base"
            >
              Annuler
            </motion.button>
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={submitting}
              className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {submitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Enregistrer les modifications
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </div>

      {/* ========== MODAL DE CONFIRMATION ========== */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Confirmer la modification ?
                </h3>
                <p className="text-gray-600">
                  Déclaration: <strong>{declarationData.numero}</strong>
                </p>
              </div>

              {/* Options d'envoi */}
              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={sendOptions.sendEmail}
                    onChange={(e) =>
                      setSendOptions((prev) => ({ ...prev, sendEmail: e.target.checked }))
                    }
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <Mail className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Envoyer un email à l'administrateur
                  </span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={sendOptions.saveToDb}
                    onChange={(e) =>
                      setSendOptions((prev) => ({ ...prev, saveToDb: e.target.checked }))
                    }
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <Database className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Enregistrer dans la base de données
                  </span>
                </label>
              </div>

              {/* Boutons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmedSubmit}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Confirmer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      

           {/* ========== MODAL DE SUCCÈS ========== */}
<AnimatePresence>
  {showSuccessModal && (
    <SuccessModal
      isOpen={showSuccessModal}
      onClose={handleCloseSuccessModal}
      declarationData={{
        numero: declarationData.numero,
        emailSent: declarationData.emailSent,
        dbSaved: declarationData.dbSaved,
        filesUploading: declarationData.filesUploading,
      }}
    />
  )}
</AnimatePresence>

{/* ========== MODAL DE SUPPRESSION ========== */}
<DeleteConfirmModal
  isOpen={deleteModal.isOpen}
  onClose={closeDeleteModal}
  onConfirm={confirmDelete}
  fileName={deleteModal.fileName}
  isDeleting={isDeleting}
/>

    </div>   
  );
};

export default EditDeclaration;
