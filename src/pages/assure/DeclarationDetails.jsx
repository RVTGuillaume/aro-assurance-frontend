import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import declarationApi from '../../services/declarationApi';
import {
  ArrowLeft,
  FileText,
  Calendar,
  MapPin,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Heart,
  Ambulance,
  Building2,
  Pill,
  Stethoscope,
  Hospital,
  ClipboardList,
  Home,
  UserCheck,
  Briefcase,
  Shield,
  FileCheck,
  CalendarDays,
  Timer,
  ExternalLink,
  Image as ImageIcon,
  FileVideo,
  File,
  Smile,
  Paperclip,
  PlusCircle,
} from 'lucide-react';

// 🎨 COULEURS ARO
const COLORS = {
  en_attente: '#FFA500',
  en_traitement: '#2196F3',
  validee: '#4CAF50',
  refusee: '#F44336',
  complements_requis: '#FF9800',
};

// 🎬 VARIANTS ANIMATIONS
const pageVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: 'easeOut'
    }
  }),
  hover: {
    y: -5,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.2 }
  }
};

const badgeVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { delay: 0.3, duration: 0.5, type: 'spring' }
  }
};

const DeclarationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [declaration, setDeclaration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDeclaration();
  }, [id]);

  const loadDeclaration = async () => {
    try {
      setLoading(true);
      
      const response = await declarationApi.getById(id, {
        _t: Date.now()
      });

      if (response.success) {
        console.log('✅ ===== DÉCLARATION RECHARGÉE =====');
        console.log('📦 Response complète:', response);
        console.log('📋 Data:', response.data);
        console.log('📁 Fichiers bruts:', response.data.fichiers);
        console.log('📊 Type de fichiers:', typeof response.data.fichiers);
        console.log('📈 Nombre de fichiers:', response.data.fichiers?.length || 0);
        
        if (response.data.fichiers && Array.isArray(response.data.fichiers)) {
          response.data.fichiers.forEach((f, i) => {
            console.log(`\n📄 Fichier ${i + 1}:`, {
              id: f.id,
              nom_original: f.nom_original,
              source_fichier: f.source_fichier,
              chemin_fichier: f.chemin_fichier,
              taille_octets: f.taille_octets,
            });
          });
        }
        
        setDeclaration(response.data);
      } else {
        setError('Déclaration non trouvée');
      }
    } catch (err) {
      console.error('❌ Erreur chargement:', err);
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FILTRER FICHIERS ORIGINAUX
  const getFichiersOriginaux = () => {
    if (!declaration?.fichiers || !Array.isArray(declaration.fichiers)) {
      return [];
    }
    
    const originaux = declaration.fichiers.filter(f => f.source_fichier === 'original');
    console.log(`📋 Fichiers originaux: ${originaux.length}`);
    return originaux;
  };

  // ✅ FILTRER FICHIERS COMPLÉMENTS
  const getFichiersComplements = () => {
    if (!declaration?.fichiers || !Array.isArray(declaration.fichiers)) {
      return [];
    }
    
    const complements = declaration.fichiers.filter(f => f.source_fichier === 'complement');
    console.log(`📋 Fichiers compléments: ${complements.length}`);
    return complements;
  };

  // ✅ FONCTION POUR FORMATER LA TAILLE DES FICHIERS
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Ko';
    
    const k = 1024;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // ✅ ICÔNE SELON TYPE DE FICHIER
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

  const getStatutBadge = (statut) => {
    const badges = {
      en_attente: {
        color: COLORS.en_attente,
        icon: Clock,
        label: 'En attente',
        desc: 'Votre déclaration est en attente de traitement'
      },
      en_traitement: {
        color: COLORS.en_traitement,
        icon: Activity,
        label: 'En traitement',
        desc: 'Votre déclaration est en cours d\'analyse'
      },
      validee: {
        color: COLORS.validee,
        icon: CheckCircle,
        label: 'Validée',
        desc: 'Votre déclaration a été validée'
      },
      refusee: {
        color: COLORS.refusee,
        icon: XCircle,
        label: 'Refusée',
        desc: 'Votre déclaration a été refusée'
      },
      complements_requis: {
        color: COLORS.complements_requis,
        icon: AlertCircle,
        label: 'Compléments requis',
        desc: 'Documents supplémentaires nécessaires'
      }
    };

    const badge = badges[statut] || badges.en_attente;
    const Icon = badge.icon;

    return (
      <motion.div
        variants={badgeVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center space-x-3 p-4 rounded-xl border-2"
        style={{
          backgroundColor: `${badge.color}15`,
          borderColor: badge.color
        }}
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Icon className="w-8 h-8" style={{ color: badge.color }} />
        </motion.div>
        <div>
          <p className="font-semibold text-lg" style={{ color: badge.color }}>
            {badge.label}
          </p>
          <p className="text-sm text-gray-600">{badge.desc}</p>
        </div>
      </motion.div>
    );
  };

  const formatDateTimeFull = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Indian/Antananarivo'
    });
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTypeLabel = (type) => {
    const labels = {
      accident: { label: '🚑 Accident', color: 'red' },
      maladie: { label: '💊 Maladie', color: 'blue' },
      hospitalisation: { label: '🏥 Hospitalisation', color: 'green' },
      soins_dentaires: { label: '🦷 Soins Dentaires', color: 'purple' },
    };
    return labels[type] || { label: type, color: 'gray' };
  };

  
  // ✅ OUVRIR FICHIER - VERSION ULTRA-ROBUSTE
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

      // ✅ CAS 1 : Chemin absolu complet (commence par /home/ ou C:/)
      if (cheminFichier.startsWith('/home/') || cheminFichier.includes(':\\')) {
        console.log('📍 Cas 1: Chemin absolu système');
        
        // Extraire seulement la partie après "uploads/"
        if (cheminFichier.includes('/uploads/')) {
          const relativePath = cheminFichier.substring(cheminFichier.indexOf('/uploads/'));
          fileUrl = `${baseURL}${relativePath}`;
          console.log('  → Chemin relatif extrait:', relativePath);
        } 
        // Si pas "uploads/" dans le chemin, utiliser le nom de fichier
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
      
      // ✅ CAS 2 : Chemin relatif (commence par uploads/)
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
        
        // Si popup bloquée, créer un lien temporaire
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
  if (loading) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{
              scale: { duration: 0.3 },
              rotate: { duration: 1, repeat: Infinity, ease: 'linear' }
            }}
            className="w-20 h-20 border-4 border-gray-300 border-t-[#006B5B] rounded-full"
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-6"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h3>
          <p className="text-gray-600 mb-6">{error}</p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/assure/declarations')}
            className="px-6 py-3 bg-gradient-to-r from-[#006B5B] to-green-400 text-white rounded-lg font-medium"
          >
            Retour aux déclarations
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (!declaration) return null;

  const typeInfo = getTypeLabel(declaration.type_sinistre);
  const fichiersOriginaux = getFichiersOriginaux();
  const fichiersComplements = getFichiersComplements();

  console.log('\n🎨 ===== RENDER =====');
  console.log('📊 Fichiers originaux à afficher:', fichiersOriginaux.length);
  console.log('📊 Fichiers compléments à afficher:', fichiersComplements.length);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <motion.div
          variants={headerVariants}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center space-x-5">
            <motion.img
              src="/AROO.png"
              alt="ARO Assurance"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="h-20 w-auto drop-shadow-lg"
              onError={(e) => { e.target.src = '/AROO.jpg'; }}
            />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-[#006B5B] to-gray-900 bg-clip-text text-transparent">
                Détails de la déclaration
              </h1>
              <p className="text-gray-600 text-sm font-medium">
                {declaration.numero_declaration}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/assure/declarations')}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour</span>
          </motion.button>
        </motion.div>

        {/* STATUT BADGE */}
        <motion.div custom={0} variants={cardVariants} className="mb-6">
          {getStatutBadge(declaration.statut_declaration)}
        </motion.div>

        {/* INFORMATIONS GÉNÉRALES */}
        <motion.div
          custom={1}
          variants={cardVariants}
          whileHover="hover"
          className="bg-white rounded-2xl shadow-xl p-8 mb-6 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full" />

          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FileText className="w-6 h-6 mr-3 text-[#006B5B]" />
            Informations générales
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <InfoItem
              icon={FileCheck}
              label="Numéro de déclaration"
              value={declaration.numero_declaration}
            />
            
            <InfoItem
              icon={Calendar}
              label="Date de déclaration"
              value={formatDateTimeFull(declaration.date_declaration)}
              highlight
            />

            <InfoItem
              icon={FileText}
              label="Type de sinistre"
              value={typeInfo.label}
            />

            <InfoItem
              icon={Activity}
              label="Statut"
              value={declaration.statut_declaration?.replace('_', ' ').toUpperCase()}
            />

            <InfoItem
              icon={Home}
              label="Adresse de l'assuré"
              value={declaration.adresse_assure || 'N/A'}
            />

            {declaration.autre_garantie_couvre && (
              <InfoItem
                icon={Shield}
                label="Autre garantie couvrant le sinistre"
                value={declaration.autre_garantie_couvre}
              />
            )}
          </div>
        </motion.div>

        {/* PERSONNE SOIGNÉE */}
        {declaration.personne_soignee_nom && (
          <motion.div
            custom={2}
            variants={cardVariants}
            whileHover="hover"
            className="bg-white rounded-2xl shadow-xl p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <User className="w-6 h-6 mr-3 text-[#006B5B]" />
              Personne soignée
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <InfoItem
                icon={User}
                label="Nom complet"
                value={declaration.personne_soignee_nom}
              />

              {declaration.personne_soignee_profession && (
                <InfoItem
                  icon={Briefcase}
                  label="Profession"
                  value={declaration.personne_soignee_profession}
                />
              )}

              {declaration.personne_soignee_age && (
                <InfoItem
                  icon={CalendarDays}
                  label="Âge"
                  value={`${declaration.personne_soignee_age} ans`}
                />
              )}

              {declaration.personne_soignee_parente && (
                <InfoItem
                  icon={Heart}
                  label="Lien de parenté"
                  value={declaration.personne_soignee_parente}
                />
              )}
            </div>
          </motion.div>
        )}

        {/* DÉTAILS SELON TYPE DE SINISTRE */}
        {/* (Garder votre code existant pour accident, maladie, hospitalisation, soins_dentaires) */}

        {/* DÉTAILS ACCIDENT */}
        {declaration.type_sinistre === 'accident' && (
          <motion.div
            custom={3}
            variants={cardVariants}
            whileHover="hover"
            className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-xl p-8 mb-6 border-2 border-red-200"
          >
            <h2 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
              <Ambulance className="w-6 h-6 mr-3" />
              Détails de l'accident
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <InfoItem
                icon={Calendar}
                label="Date de l'accident"
                value={formatDateOnly(declaration.accident_date)}
                highlight
              />

              {declaration.accident_lieu && (
                <InfoItem
                  icon={MapPin}
                  label="Lieu de l'accident"
                  value={declaration.accident_lieu}
                />
              )}

              {declaration.accident_constate_par && (
                <InfoItem
                  icon={UserCheck}
                  label="Témoin(s) / Constaté par"
                  value={declaration.accident_constate_par}
                />
              )}

              {declaration.accident_soigne_par && (
                <InfoItem
                  icon={Stethoscope}
                  label="Soigné par"
                  value={declaration.accident_soigne_par}
                />
              )}

              {declaration.accident_blessures && (
                <div className="md:col-span-2">
                  <InfoItem
                    icon={Heart}
                    label="Nature des blessures"
                    value={declaration.accident_blessures}
                  />
                </div>
              )}

              {declaration.accident_circonstances && (
                <div className="md:col-span-2">
                  <InfoItem
                    icon={AlertCircle}
                    label="Circonstances de l'accident"
                    value={declaration.accident_circonstances}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* DÉTAILS MALADIE */}
        {declaration.type_sinistre === 'maladie' && (
          <motion.div
            custom={3}
            variants={cardVariants}
            whileHover="hover"
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-xl p-8 mb-6 border-2 border-blue-200"
          >
            <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
              <Heart className="w-6 h-6 mr-3" />
              Détails de la maladie
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {declaration.maladie_type && (
                <InfoItem
                  icon={Pill}
                  label="Type de maladie"
                  value={declaration.maladie_type}
                />
              )}

              <InfoItem
                icon={Calendar}
                label="Date de début"
                value={formatDateOnly(declaration.maladie_date_debut)}
                highlight
              />

              {declaration.maladie_code_oms && (
                <InfoItem
                  icon={ClipboardList}
                  label="Code OMS"
                  value={declaration.maladie_code_oms}
                />
              )}

              {declaration.maladie_designation && (
                <InfoItem
                  icon={FileCheck}
                  label="Désignation de la maladie"
                  value={declaration.maladie_designation}
                />
              )}

              {declaration.maladie_soignee_par && (
                <div className="md:col-span-2">
                  <InfoItem
                    icon={Stethoscope}
                    label="Soigné par (médecin)"
                    value={declaration.maladie_soignee_par}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* DÉTAILS HOSPITALISATION */}
        {declaration.type_sinistre === 'hospitalisation' && (
          <motion.div
            custom={3}
            variants={cardVariants}
            whileHover="hover"
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8 mb-6 border-2 border-green-200"
          >
            <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
              <Hospital className="w-6 h-6 mr-3" />
              Détails de l'hospitalisation
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <InfoItem
                icon={Building2}
                label="Établissement hospitalier"
                value={declaration.hospitalisation_etablissement || 'N/A'}
              />

              <InfoItem
                icon={Calendar}
                label="Date d'entrée"
                value={formatDateOnly(declaration.hospitalisation_date_debut)}
                highlight
              />

              {declaration.hospitalisation_date_fin && (
                <InfoItem
                  icon={Calendar}
                  label="Date de sortie"
                  value={formatDateOnly(declaration.hospitalisation_date_fin)}
                  highlight
                />
              )}

              <InfoItem
                icon={Timer}
                label="Durée totale du séjour"
                value={calculateDuration(
                  declaration.hospitalisation_date_debut,
                  declaration.hospitalisation_date_fin
                )}
              />

              {declaration.hospitalisation_operation_par && (
                <InfoItem
                  icon={Stethoscope}
                  label="Opération effectuée par"
                  value={declaration.hospitalisation_operation_par}
                />
              )}

              {declaration.hospitalisation_description && (
                <div className="md:col-span-2">
                  <InfoItem
                    icon={FileText}
                    label="Description médicale"
                    value={declaration.hospitalisation_description}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* DÉTAILS SOINS DENTAIRES */}
        {declaration.type_sinistre === 'soins_dentaires' && (
          <motion.div
            custom={3}
            variants={cardVariants}
            whileHover="hover"
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-8 mb-6 border-2 border-purple-200"
          >
            <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center">
              <Smile className="w-6 h-6 mr-3" />
              Détails des soins dentaires
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <InfoItem
                icon={Calendar}
                label="Date de début des soins"
                value={formatDateOnly(declaration.soins_dentaires_date_debut)}
                highlight
              />

              {declaration.soins_dentaires_date_fin && (
                <InfoItem
                  icon={Calendar}
                  label="Date de fin des soins"
                  value={formatDateOnly(declaration.soins_dentaires_date_fin)}
                  highlight
                />
              )}

              <InfoItem
                icon={Timer}
                label="Durée totale du traitement"
                value={calculateDuration(
                  declaration.soins_dentaires_date_debut,
                  declaration.soins_dentaires_date_fin
                )}
              />

              {declaration.soins_dentaires_effectues_par && (
                <InfoItem
                  icon={Stethoscope}
                  label="Soins effectués par (dentiste)"
                  value={declaration.soins_dentaires_effectues_par}
                />
              )}
            </div>
          </motion.div>
        )}

        {/* ✅ SECTION 1 : PIÈCES JUSTIFICATIVES ORIGINALES */}
        {fichiersOriginaux.length > 0 && (
          <motion.div
            custom={4}
            variants={cardVariants}
            whileHover="hover"
            className="bg-white rounded-2xl shadow-xl p-8 mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Paperclip className="w-6 h-6 mr-3 text-blue-600" />
                Pièces justificatives originales
              </h2>
              
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {fichiersOriginaux.length} fichier{fichiersOriginaux.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {fichiersOriginaux.map((fichier, index) => (
                <FileCard
                  key={`original-${fichier.id || index}`}
                  fichier={fichier}
                  index={index}
                  handleOpenFile={handleOpenFile}
                  getFileIconComponent={getFileIconComponent}
                  formatFileSize={formatFileSize}
                  borderColor="border-blue-200 hover:border-blue-400"
                  bgGradient="from-blue-50 to-indigo-50"
                />
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-700 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">📎 Fichiers uploadés lors de la création de la déclaration</p>
                  <p className="text-blue-700">
                    Documents originaux joints au moment de la déclaration initiale
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ✅ SECTION 2 : FICHIERS COMPLÉMENTAIRES */}
        {fichiersComplements.length > 0 && (
          <motion.div
            custom={5}
            variants={cardVariants}
            whileHover="hover"
            className="bg-white rounded-2xl shadow-xl p-8 mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <PlusCircle className="w-6 h-6 mr-3 text-green-600" />
                Fichiers complémentaires
              </h2>
              
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {fichiersComplements.length} fichier{fichiersComplements.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {fichiersComplements.map((fichier, index) => (
                <FileCard
                  key={`complement-${fichier.id || index}`}
                  fichier={fichier}
                  index={index}
                  handleOpenFile={handleOpenFile}
                  getFileIconComponent={getFileIconComponent}
                  formatFileSize={formatFileSize}
                  borderColor="border-green-200 hover:border-green-400"
                  bgGradient="from-green-50 to-emerald-50"
                  isComplement={true}
                />
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-2 border-green-200"
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
          </motion.div>
        )}

        {/* ⚠️ SI AUCUN FICHIER */}
        {fichiersOriginaux.length === 0 && fichiersComplements.length === 0 && (
          <motion.div
            custom={4}
            variants={cardVariants}
            className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl shadow-xl p-8 mb-6"
          >
            <div className="flex items-center gap-4">
              <AlertCircle className="w-12 h-12 text-yellow-600 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-yellow-800 mb-2">
                  Aucun fichier disponible
                </h3>
                <p className="text-yellow-700">
                  Aucune pièce justificative n'a été uploadée pour cette déclaration.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* COMMENTAIRE ADMIN */}
        {declaration.commentaire_admin && (
          <motion.div
            custom={6}
            variants={cardVariants}
            whileHover="hover"
            className="bg-orange-50 border-2 border-orange-200 rounded-2xl shadow-xl p-8 mb-6"
          >
            <h2 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
              <AlertCircle className="w-6 h-6 mr-3" />
              Commentaire de l'administrateur
            </h2>
            <p className="text-gray-700 leading-relaxed">{declaration.commentaire_admin}</p>
          </motion.div>
        )}

        {/* CHRONOLOGIE COMPLÈTE */}
        <motion.div
          custom={7}
          variants={cardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-3 text-[#006B5B]" />
            Chronologie complète
          </h2>

          <div className="space-y-4">
            <TimelineItem
              icon={FileCheck}
              label="Déclaration créée"
              date={formatDateTimeFull(declaration.date_declaration)}
              color="green"
            />

            {declaration.date_traitement && (
              <TimelineItem
                icon={Activity}
                label="Mise en traitement"
                date={formatDateTimeFull(declaration.date_traitement)}
                color="blue"
              />
            )}

            {declaration.date_validation && (
              <TimelineItem
                icon={CheckCircle}
                label="Validation finale"
                date={formatDateTimeFull(declaration.date_validation)}
                color="emerald"
              />
            )}

            {declaration.updated_at && declaration.updated_at !== declaration.date_declaration && (
              <TimelineItem
                icon={Clock}
                label="Dernière modification"
                date={formatDateTimeFull(declaration.updated_at)}
                color="gray"
              />
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ✅ COMPOSANT POUR AFFICHER UNE CARTE DE FICHIER
const FileCard = ({
  fichier,
  index,
  handleOpenFile,
  getFileIconComponent,
  formatFileSize,
  borderColor = "border-blue-200 hover:border-blue-400",
  bgGradient = "from-blue-50 to-indigo-50",
  isComplement = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`flex items-center justify-between p-4 rounded-xl border-2 bg-gradient-to-br ${bgGradient} ${borderColor} transition-all duration-200 hover:shadow-xl`}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0 pr-3">
        {getFileIconComponent(fichier)}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-gray-900 truncate text-sm">
              {fichier.nom_original}
            </p>
            {isComplement && (
              <span className="inline-block px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                Complément
              </span>
            )}
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

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleOpenFile(fichier)}
        className="flex-shrink-0 p-3 rounded-xl transition-all shadow-md hover:shadow-xl bg-gradient-to-r from-[#006B5B] to-green-600 hover:from-green-600 hover:to-[#006B5B] text-white"
        title="Ouvrir le document"
      >
        <ExternalLink className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};

// COMPOSANTS AUXILIAIRES
const InfoItem = ({ icon: Icon, label, value, highlight }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`flex items-start space-x-3 p-4 rounded-lg ${
      highlight ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'
    }`}
  >
    <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${highlight ? 'text-green-600' : 'text-[#006B5B]'}`} />
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-gray-800 font-medium mt-1 break-words">{value}</p>
    </div>
  </motion.div>
);

const TimelineItem = ({ icon: Icon, label, date, color }) => {
  const colorClasses = {
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-600' }
  };

  const colors = colorClasses[color] || colorClasses.gray;

  return (
    <div className="flex items-start space-x-4">
      <div className={`p-2 rounded-full ${colors.bg}`}>
        <Icon className={`w-5 h-5 ${colors.text}`} />
      </div>
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        <p className="text-sm text-gray-600">{date}</p>
      </div>
    </div>
  );
};

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 'N/A';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.abs(end - start);
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Moins d\'un jour';
  
  return `${days} jour${days > 1 ? 's' : ''}`;
};

export default DeclarationDetails;
