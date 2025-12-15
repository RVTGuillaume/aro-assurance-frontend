/**
 * Détails déclaration Admin - VERSION ULTRA-RESPONSIVE OPTIMISÉE
 * Design adaptatif parfait pour mobile, tablette et desktop
 * ARO Assurance Madagascar
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi } from '@api/adminApi';
import {
  ArrowLeft, User, FileText, Calendar, Clock, Phone, Mail, MapPin,
  Download, ExternalLink, Image as ImageIcon, File, History,
  CheckCircle2, XCircle, AlertCircle, DollarSign, Paperclip, PlusCircle,
  Building2, Stethoscope, Heart, Activity, Timer, Smile, Ambulance,
  Hospital, UserCheck, Briefcase, CalendarDays, Shield, FileCheck,
  ClipboardList, Pill, Eye, Package
} from 'lucide-react';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import Button from '@components/common/Button';
import Loader from '@components/common/Loader';
import { formatDate, formatDateTime, formatCurrency } from '@utils/formatters';
import { TYPE_SINISTRE_LABELS, STATUT_DECLARATION_LABELS, STATUT_DECLARATION_COLORS } from '@utils/constants';

// ✅ Palette professionnelle
const STATUS_STYLES = {
  validee: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'text-emerald-600' },
  refusee: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', icon: 'text-rose-600' },
  en_attente: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-600' },
  en_traitement: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', icon: 'text-sky-600' },
  complement_requis: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-600' },
};

// 🎬 ANIMATIONS
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 }
  })
};

const AdminDeclarationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [declaration, setDeclaration] = useState(null);
  const [downloadingFiles, setDownloadingFiles] = useState({});

  useEffect(() => { fetchDetails(); }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getDeclarationDetails(id);
      
      console.log('✅ Déclaration Admin chargée:', response);
      console.log('📁 Fichiers:', response.data?.fichiers);
      
      if (response.success) {
        setDeclaration(response.data);
      } else {
        navigate('/admin/declarations');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      navigate('/admin/declarations');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FILTRER FICHIERS ORIGINAUX
  const getFichiersOriginaux = () => {
    if (!declaration?.fichiers || !Array.isArray(declaration.fichiers)) return [];
    return declaration.fichiers.filter(f => 
      f.source_fichier === 'original' || f.source_fichier === 'initial'
    );
  };

  // ✅ FILTRER FICHIERS COMPLÉMENTS
  const getFichiersComplements = () => {
    if (!declaration?.fichiers || !Array.isArray(declaration.fichiers)) return [];
    return declaration.fichiers.filter(f => f.source_fichier === 'complement');
  };

  // ✅ FORMATER TAILLE FICHIER
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Ko';
    const k = 1024;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // ✅ ICÔNE SELON TYPE
  const getFileIconComponent = (fichier) => {
    const fileName = fichier.nom_original?.toLowerCase() || '';
    const fileType = (fichier.type_fichier || fichier.type_mime || '').toLowerCase();
    
    if (fileType.includes('image') || /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/.test(fileName)) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    }
    
    if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    
    return <File className="w-5 h-5 text-slate-600" />;
  };

  // ✅ OUVRIR FICHIER DANS NOUVEL ONGLET
  const handleOpenFile = async (fichier) => {
    try {
      console.log('🔓 Ouverture fichier:', fichier);
      
      const cheminFichier = fichier.chemin_fichier;
      if (!cheminFichier) {
        alert(`⚠️ Chemin manquant pour "${fichier.nom_original}"`);
        return;
      }

      const baseURL = window.location.origin.includes('localhost') 
        ? 'http://localhost:5000'
        : window.location.origin;
      
      let fileUrl = '';

      // Construction URL intelligente
      if (cheminFichier.startsWith('/home/') || cheminFichier.includes(':\\')) {
        if (cheminFichier.includes('/uploads/')) {
          fileUrl = `${baseURL}${cheminFichier.substring(cheminFichier.indexOf('/uploads/'))}`;
        } else if (fichier.nom_stockage) {
          fileUrl = `${baseURL}/uploads/declarations/${fichier.nom_stockage}`;
        } else {
          const filename = cheminFichier.split('/').pop();
          fileUrl = `${baseURL}/uploads/declarations/${filename}`;
        }
      } else if (cheminFichier.startsWith('uploads/')) {
        fileUrl = `${baseURL}/${cheminFichier}`;
      } else if (cheminFichier.includes('/uploads/')) {
        fileUrl = `${baseURL}${cheminFichier.substring(cheminFichier.indexOf('/uploads/'))}`;
      } else {
        fileUrl = `${baseURL}/uploads/declarations/${cheminFichier.split('/').pop()}`;
      }

      console.log('🌐 URL finale:', fileUrl);

      const newWindow = window.open(fileUrl, '_blank', 'noopener,noreferrer');
      
      if (!newWindow) {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(`⚠️ Erreur: ${error.message}`);
    }
  };

  // ✅ TÉLÉCHARGER FICHIER
  const handleDownloadFile = async (fichier) => {
    try {
      console.log('📥 Téléchargement fichier:', fichier);
      setDownloadingFiles(prev => ({ ...prev, [fichier.id]: true }));

      const baseURL = window.location.origin.includes('localhost') 
        ? 'http://localhost:5000'
        : window.location.origin;
      
      const cheminFichier = fichier.chemin_fichier;
      let fileUrl = '';

      if (cheminFichier.includes('/uploads/')) {
        fileUrl = `${baseURL}${cheminFichier.substring(cheminFichier.indexOf('/uploads/'))}`;
      } else if (cheminFichier.startsWith('uploads/')) {
        fileUrl = `${baseURL}/${cheminFichier}`;
      } else {
        fileUrl = `${baseURL}/uploads/declarations/${cheminFichier.split('/').pop()}`;
      }

      // Téléchargement via fetch
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Échec téléchargement');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fichier.nom_original || 'fichier';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('✅ Téléchargement réussi');
    } catch (error) {
      console.error('❌ Erreur téléchargement:', error);
      alert(`⚠️ Échec: ${error.message}`);
    } finally {
      setDownloadingFiles(prev => ({ ...prev, [fichier.id]: false }));
    }
  };

  // ✅ FORMATER DATE COMPLÈTE (avec jour, mois, année, heures, minutes, secondes)
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

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    const diff = Math.abs(new Date(endDate) - new Date(startDate));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Moins d\'un jour' : `${days} jour${days > 1 ? 's' : ''}`;
  };

  if (loading) return <Loader fullScreen text="Chargement des détails administrateur..." />;

  if (!declaration) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="p-6 sm:p-8 text-center max-w-md w-full">
          <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Déclaration introuvable</h2>
          <Button onClick={() => navigate('/admin/declarations')} className="mt-4 w-full sm:w-auto">Retour</Button>
        </Card>
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[declaration.statut_declaration || declaration.statut] || STATUS_STYLES.en_attente;
  const fichiersOriginaux = getFichiersOriginaux();
  const fichiersComplements = getFichiersComplements();

  console.log('📊 Originaux:', fichiersOriginaux.length, 'Compléments:', fichiersComplements.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-[1600px] mx-auto">
        {/* HEADER RESPONSIVE */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 sm:mb-6 lg:mb-8">
          <button
            onClick={() => navigate('/admin/declarations')}
            className="inline-flex items-center gap-2 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 text-sm sm:text-base text-slate-700 bg-white border-2 border-slate-300 rounded-lg sm:rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all shadow-md hover:shadow-lg mb-4 sm:mb-6 font-semibold w-full sm:w-auto justify-center sm:justify-start"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Retour aux déclarations</span>
            <span className="sm:hidden">Retour</span>
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <img 
                src="/AROO.png" 
                alt="ARO" 
                className="h-12 sm:h-16 lg:h-20 w-auto drop-shadow-lg flex-shrink-0" 
                onError={(e) => e.target.style.display = 'none'}
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-heading font-bold text-slate-900 mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">Admin - Déclaration</span>
                </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm lg:text-base text-slate-600">
                  <span className="font-mono font-bold text-emerald-700 break-all">{declaration.numero_declaration}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="font-semibold">{TYPE_SINISTRE_LABELS[declaration.type_sinistre]}</span>
                </div>
              </div>
            </div>
            <div className={`px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-xl sm:rounded-2xl ${statusStyle.bg} ${statusStyle.border} border-2 shadow-lg w-full sm:w-auto`}>
              <p className={`font-bold text-base sm:text-lg lg:text-xl ${statusStyle.text} flex items-center justify-center sm:justify-start gap-2`}>
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="truncate">{STATUT_DECLARATION_LABELS[declaration.statut_declaration || declaration.statut]}</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* GRID RESPONSIVE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-5 lg:space-y-6">
            {/* INFORMATIONS GÉNÉRALES RESPONSIVE */}
            <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
              <Card className="p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-white via-slate-50 to-white border-2 border-emerald-200 shadow-xl">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-4 sm:mb-5 lg:mb-6 flex items-center gap-2 sm:gap-3">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-emerald-600 flex-shrink-0" />
                  <span>Informations générales</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <InfoItem icon={FileCheck} label="Numéro déclaration" value={declaration.numero_declaration} />
                  <InfoItem 
                    icon={Calendar} 
                    label="Date de déclaration" 
                    value={formatDateTimeFull(declaration.date_declaration || declaration.created_at)} 
                    highlight 
                  />
                  <InfoItem icon={FileText} label="Type de sinistre" value={TYPE_SINISTRE_LABELS[declaration.type_sinistre]} />
                  <InfoItem 
                    icon={Activity} 
                    label="Statut actuel" 
                    value={STATUT_DECLARATION_LABELS[declaration.statut_declaration || declaration.statut]} 
                  />
                  
                  {(declaration.accident_date || declaration.maladie_date_debut || declaration.hospitalisation_date_debut || declaration.soins_dentaires_date_debut) && (
                    <InfoItem 
                      icon={Calendar} 
                      label="Date du sinistre" 
                      value={formatDateOnly(
                        declaration.accident_date || 
                        declaration.maladie_date_debut || 
                        declaration.hospitalisation_date_debut || 
                        declaration.soins_dentaires_date_debut
                      )} 
                      highlight 
                    />
                  )}
                  
                  {(declaration.accident_lieu || declaration.hospitalisation_etablissement) && (
                    <InfoItem 
                      icon={MapPin} 
                      label="Lieu du sinistre" 
                      value={declaration.accident_lieu || declaration.hospitalisation_etablissement} 
                    />
                  )}

                  {declaration.montant_estime_frais && (
                    <div className="sm:col-span-2">
                      <InfoItem 
                        icon={DollarSign} 
                        label="Montant estimé des frais" 
                        value={formatCurrency(declaration.montant_estime_frais)} 
                        highlight
                      />
                    </div>
                  )}
                </div>

                {(declaration.description || declaration.description_detaillee || declaration.accident_circonstances || declaration.hospitalisation_description) && (
                  <div className="mt-4 sm:mt-5 lg:mt-6">
                    <p className="text-xs sm:text-sm text-slate-600 mb-2 flex items-center gap-2 font-semibold">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span>Description détaillée</span>
                    </p>
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl border-2 border-slate-200 shadow-inner">
                      <p className="text-sm sm:text-base text-slate-800 whitespace-pre-wrap leading-relaxed break-words">
                        {declaration.description || 
                         declaration.description_detaillee || 
                         declaration.accident_circonstances || 
                         declaration.hospitalisation_description ||
                         'Aucune description détaillée'}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* ASSURÉ RESPONSIVE */}
            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
              <Card className="p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50 border-2 border-blue-200 shadow-xl">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 mb-4 sm:mb-5 lg:mb-6 flex items-center gap-2 sm:gap-3">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-600 flex-shrink-0" />
                  <span>Informations Assuré</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <InfoItem icon={User} label="Nom complet" value={declaration.assure_nom} />
                  <InfoItem icon={FileText} label="N° Dossier" value={declaration.numero_dossier} />
                  <InfoItem icon={FileText} label="N° Police" value={declaration.numero_police} />
                  <InfoItem icon={Shield} label="Type" value={declaration.type_assure?.toUpperCase()} />
                  
                  {declaration.assure_telephone && (
                    <InfoItem icon={Phone} label="Téléphone" value={declaration.assure_telephone} />
                  )}
                  {declaration.assure_email && (
                    <InfoItem icon={Mail} label="Email" value={declaration.assure_email} />
                  )}
                  {declaration.adresse_assure && (
                    <div className="sm:col-span-2">
                      <InfoItem icon={MapPin} label="Adresse complète" value={declaration.adresse_assure} />
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* PERSONNE SOIGNÉE RESPONSIVE */}
            {declaration.personne_soignee_nom && (
              <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
                <Card className="p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-xl">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900 mb-4 sm:mb-5 lg:mb-6 flex items-center gap-2 sm:gap-3">
                    <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-purple-600 flex-shrink-0" />
                    <span>Personne soignée</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    <InfoItem icon={User} label="Nom complet" value={declaration.personne_soignee_nom} />
                    {declaration.personne_soignee_profession && (
                      <InfoItem icon={Briefcase} label="Profession" value={declaration.personne_soignee_profession} />
                    )}
                    {declaration.personne_soignee_age && (
                      <InfoItem icon={CalendarDays} label="Âge" value={`${declaration.personne_soignee_age} ans`} />
                    )}
                    {declaration.personne_soignee_parente && (
                      <InfoItem icon={Heart} label="Lien de parenté" value={declaration.personne_soignee_parente} />
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* DÉTAILS SELON TYPE - ACCIDENT RESPONSIVE */}
            {declaration.type_sinistre === 'accident' && (
              <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
                <Card className="p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 shadow-xl">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-800 mb-4 sm:mb-5 lg:mb-6 flex items-center gap-2 sm:gap-3">
                    <Ambulance className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex-shrink-0" />
                    <span>Détails de l'accident</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    {declaration.accident_date && (
                      <InfoItem icon={Calendar} label="Date accident" value={formatDateOnly(declaration.accident_date)} highlight />
                    )}
                    {declaration.accident_lieu && (
                      <InfoItem icon={MapPin} label="Lieu" value={declaration.accident_lieu} />
                    )}
                    {declaration.accident_constate_par && (
                      <InfoItem icon={UserCheck} label="Constaté par" value={declaration.accident_constate_par} />
                    )}
                    {declaration.accident_soigne_par && (
                      <InfoItem icon={Stethoscope} label="Soigné par" value={declaration.accident_soigne_par} />
                    )}
                    {declaration.accident_blessures && (
                      <div className="sm:col-span-2">
                        <InfoItem icon={Heart} label="Nature des blessures" value={declaration.accident_blessures} />
                      </div>
                    )}
                    {declaration.accident_circonstances && (
                      <div className="sm:col-span-2">
                        <InfoItem icon={AlertCircle} label="Circonstances détaillées" value={declaration.accident_circonstances} />
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* MALADIE RESPONSIVE */}
            {declaration.type_sinistre === 'maladie' && (
              <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
                <Card className="p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 shadow-xl">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-800 mb-4 sm:mb-5 lg:mb-6 flex items-center gap-2 sm:gap-3">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex-shrink-0" />
                    <span>Détails de la maladie</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    {declaration.maladie_type && (
                      <InfoItem icon={Pill} label="Type de maladie" value={declaration.maladie_type} />
                    )}
                    {declaration.maladie_date_debut && (
                      <InfoItem icon={Calendar} label="Date début" value={formatDateOnly(declaration.maladie_date_debut)} highlight />
                    )}
                    {declaration.maladie_code_oms && (
                      <InfoItem icon={ClipboardList} label="Code OMS" value={declaration.maladie_code_oms} />
                    )}
                    {declaration.maladie_designation && (
                      <InfoItem icon={FileCheck} label="Désignation" value={declaration.maladie_designation} />
                    )}
                    {declaration.maladie_soignee_par && (
                      <div className="sm:col-span-2">
                        <InfoItem icon={Stethoscope} label="Soigné par" value={declaration.maladie_soignee_par} />
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* HOSPITALISATION RESPONSIVE */}
            {declaration.type_sinistre === 'hospitalisation' && (
              <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
                <Card className="p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-xl">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-800 mb-4 sm:mb-5 lg:mb-6 flex items-center gap-2 sm:gap-3">
                    <Hospital className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex-shrink-0" />
                    <span>Détails hospitalisation</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    {declaration.hospitalisation_etablissement && (
                      <InfoItem icon={Building2} label="Établissement" value={declaration.hospitalisation_etablissement} />
                    )}
                    {declaration.hospitalisation_date_debut && (
                      <InfoItem icon={Calendar} label="Date entrée" value={formatDateOnly(declaration.hospitalisation_date_debut)} highlight />
                    )}
                    {declaration.hospitalisation_date_fin && (
                      <InfoItem icon={Calendar} label="Date sortie" value={formatDateOnly(declaration.hospitalisation_date_fin)} highlight />
                    )}
                    <InfoItem 
                      icon={Timer} 
                      label="Durée séjour" 
                      value={calculateDuration(declaration.hospitalisation_date_debut, declaration.hospitalisation_date_fin)} 
                    />
                    {declaration.hospitalisation_operation_par && (
                      <InfoItem icon={Stethoscope} label="Opération par" value={declaration.hospitalisation_operation_par} />
                    )}
                    {declaration.hospitalisation_description && (
                      <div className="sm:col-span-2">
                        <InfoItem icon={FileText} label="Description" value={declaration.hospitalisation_description} />
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* SOINS DENTAIRES RESPONSIVE */}
            {declaration.type_sinistre === 'soins_dentaires' && (
              <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
                <Card className="p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 shadow-xl">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-800 mb-4 sm:mb-5 lg:mb-6 flex items-center gap-2 sm:gap-3">
                    <Smile className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex-shrink-0" />
                    <span>Détails soins dentaires</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    {declaration.soins_dentaires_date_debut && (
                      <InfoItem icon={Calendar} label="Date début" value={formatDateOnly(declaration.soins_dentaires_date_debut)} highlight />
                    )}
                    {declaration.soins_dentaires_date_fin && (
                      <InfoItem icon={Calendar} label="Date fin" value={formatDateOnly(declaration.soins_dentaires_date_fin)} highlight />
                    )}
                    <InfoItem 
                      icon={Timer} 
                      label="Durée traitement" 
                      value={calculateDuration(declaration.soins_dentaires_date_debut, declaration.soins_dentaires_date_fin)} 
                    />
                    {declaration.soins_dentaires_effectues_par && (
                      <InfoItem icon={Stethoscope} label="Soins par" value={declaration.soins_dentaires_effectues_par} />
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* FICHIERS ORIGINAUX RESPONSIVE */}
            {fichiersOriginaux.length > 0 && (
              <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible">
                <Card className="p-4 sm:p-5 lg:p-6 border-2 border-blue-300 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 flex items-center gap-2 sm:gap-3">
                      <Paperclip className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-600 flex-shrink-0" />
                      <span className="break-words">Pièces justificatives originales</span>
                    </h3>
                    <span className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-blue-600 text-white rounded-full font-bold text-sm sm:text-base lg:text-lg shadow-lg">
                      {fichiersOriginaux.length}
                    </span>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    {fichiersOriginaux.map((fichier, index) => (
                      <FileCard
                        key={`orig-${fichier.id || index}`}
                        fichier={fichier}
                        index={index}
                        handleOpenFile={handleOpenFile}
                        handleDownloadFile={handleDownloadFile}
                        getFileIconComponent={getFileIconComponent}
                        formatFileSize={formatFileSize}
                        formatDateTime={formatDateTimeFull}
                        borderColor="border-blue-300 hover:border-blue-500"
                        bgGradient="from-blue-50 to-indigo-100"
                        downloadingFiles={downloadingFiles}
                      />
                    ))}
                  </div>

                  <div className="mt-4 sm:mt-5 p-3 sm:p-4 bg-blue-100 rounded-lg sm:rounded-xl border-2 border-blue-300">
                    <p className="text-xs sm:text-sm text-blue-900 flex items-center gap-2 font-semibold">
                      <Package className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span>Fichiers uploadés lors de la création de la déclaration</span>
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* FICHIERS COMPLÉMENTS RESPONSIVE */}
            {fichiersComplements.length > 0 && (
              <motion.div custom={5} variants={cardVariants} initial="hidden" animate="visible">
                <Card className="p-4 sm:p-5 lg:p-6 border-2 border-green-300 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 flex items-center gap-2 sm:gap-3">
                      <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-green-600 flex-shrink-0" />
                      <span>Fichiers complémentaires</span>
                    </h3>
                    <span className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-green-600 text-white rounded-full font-bold text-sm sm:text-base lg:text-lg shadow-lg">
                      {fichiersComplements.length}
                    </span>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    {fichiersComplements.map((fichier, index) => (
                      <FileCard
                        key={`comp-${fichier.id || index}`}
                        fichier={fichier}
                        index={index}
                        handleOpenFile={handleOpenFile}
                        handleDownloadFile={handleDownloadFile}
                        getFileIconComponent={getFileIconComponent}
                        formatFileSize={formatFileSize}
                        formatDateTime={formatDateTimeFull}
                        borderColor="border-green-300 hover:border-green-500"
                        bgGradient="from-green-50 to-emerald-100"
                        isComplement={true}
                        downloadingFiles={downloadingFiles}
                      />
                    ))}
                  </div>

                  <div className="mt-4 sm:mt-5 p-3 sm:p-4 bg-green-100 rounded-lg sm:rounded-xl border-2 border-green-300">
                    <p className="text-xs sm:text-sm text-green-900 flex items-center gap-2 font-semibold">
                      <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span>Documents ajoutés après la déclaration initiale</span>
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* SI AUCUN FICHIER RESPONSIVE */}
            {fichiersOriginaux.length === 0 && fichiersComplements.length === 0 && (
              <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible">
                <Card className="p-6 sm:p-8 lg:p-10 text-center bg-yellow-50 border-2 border-yellow-300 shadow-xl">
                  <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-yellow-600 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-800 mb-2">Aucun fichier</h3>
                  <p className="text-sm sm:text-base lg:text-lg text-yellow-700">Aucune pièce justificative n'a été uploadée pour cette déclaration</p>
                </Card>
              </motion.div>
            )}

            {/* MOTIF REJET RESPONSIVE */}
            {declaration.motif_rejet && (
              <motion.div custom={6} variants={cardVariants} initial="hidden" animate="visible">
                <Card className="p-4 sm:p-5 lg:p-6 border-l-4 border-rose-600 bg-rose-50 shadow-xl">
                  <h3 className="text-lg sm:text-xl font-bold text-rose-700 mb-3 sm:mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex-shrink-0" />
                    <span>Motif de refus</span>
                  </h3>
                  <p className="text-sm sm:text-base text-slate-900 whitespace-pre-wrap bg-white p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl border-2 border-rose-200 leading-relaxed break-words">
                    {declaration.motif_rejet}
                  </p>
                </Card>
              </motion.div>
            )}

            {/* COMMENTAIRE ADMIN RESPONSIVE */}
            {declaration.commentaire_admin && (
              <motion.div custom={7} variants={cardVariants} initial="hidden" animate="visible">
                <Card className="p-4 sm:p-5 lg:p-6 border-l-4 border-blue-600 bg-blue-50 shadow-xl">
                  <h3 className="text-lg sm:text-xl font-bold text-blue-700 mb-3 sm:mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex-shrink-0" />
                    <span>Commentaire administrateur</span>
                  </h3>
                  <p className="text-sm sm:text-base text-slate-900 whitespace-pre-wrap bg-white p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl border-2 border-blue-200 leading-relaxed break-words">
                    {declaration.commentaire_admin}
                  </p>
                </Card>
              </motion.div>
            )}
          </div>

          {/* HISTORIQUE SIDEBAR RESPONSIVE */}
          <div className="lg:col-span-1">
            <motion.div custom={8} variants={cardVariants} initial="hidden" animate="visible" className="lg:sticky lg:top-8">
              <Card className="p-4 sm:p-5 lg:p-6 border-2 border-amber-200 shadow-xl">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-5 lg:mb-6 flex items-center gap-2">
                  <History className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-amber-600 flex-shrink-0" />
                  <span>Chronologie complète</span>
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  <TimelineItem
                    icon={FileCheck}
                    label="Déclaration créée"
                    date={formatDateTimeFull(declaration.date_declaration || declaration.created_at)}
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
                      icon={CheckCircle2}
                      label="Validation finale"
                      date={formatDateTimeFull(declaration.date_validation)}
                      color="emerald"
                    />
                  )}

                  {declaration.updated_at && declaration.updated_at !== declaration.created_at && (
                    <TimelineItem
                      icon={Clock}
                      label="Dernière modification"
                      date={formatDateTimeFull(declaration.updated_at)}
                      color="gray"
                    />
                  )}
                </div>

                {declaration.historique?.length > 0 && (
                  <div className="mt-4 sm:mt-5 lg:mt-6 pt-4 sm:pt-5 lg:pt-6 border-t-2 border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-3 sm:mb-4 text-base sm:text-lg">Historique des actions</h4>
                    <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-slate-300">
                      {declaration.historique.map((action, index) => (
                        <div key={action.id || index} className="text-xs sm:text-sm bg-slate-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                          <p className="font-bold text-slate-900 break-words">{action.action}</p>
                          {action.commentaire && (
                            <p className="text-slate-600 mt-1 sm:mt-2 break-words">{action.commentaire}</p>
                          )}
                          <p className="text-xs text-slate-500 mt-2 sm:mt-3 font-semibold break-words">
                            {formatDateTimeFull(action.created_at)}
                          </p>
                          {action.admin_nom && (
                            <p className="text-xs text-emerald-600 font-bold mt-1 sm:mt-2 flex items-center gap-1 break-words">
                              <Shield className="w-3 h-3 flex-shrink-0" />
                              <span>Par: {action.admin_nom}</span>
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ COMPOSANT CARTE FICHIER RESPONSIVE
const FileCard = ({
  fichier,
  index,
  handleOpenFile,
  handleDownloadFile,
  getFileIconComponent,
  formatFileSize,
  formatDateTime,
  borderColor,
  bgGradient,
  isComplement = false,
  downloadingFiles
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ scale: 1.01, y: -1 }}
    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 bg-gradient-to-br ${bgGradient} ${borderColor} transition-all hover:shadow-xl gap-3 sm:gap-4`}
  >
    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
      <div className="p-2 sm:p-3 rounded-lg bg-white shadow-md flex-shrink-0">
        {getFileIconComponent(fichier)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="font-bold text-slate-900 truncate text-sm sm:text-base">
            {fichier.nom_original}
          </p>
          {isComplement && (
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-black text-green-900 bg-green-300 rounded-full border border-green-400 flex-shrink-0">
              COMPLÉMENT
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 flex-wrap">
          <span className="font-semibold">{formatFileSize(fichier.taille_octets)}</span>
          {(fichier.date_upload || fichier.date_ajout) && (
            <>
              <span className="hidden sm:inline">•</span>
              <span className="text-xs break-words">{formatDateTime(fichier.date_upload || fichier.date_ajout)}</span>
            </>
          )}
        </div>
      </div>
    </div>

    {/* BOUTONS D'ACTION RESPONSIVE */}
    <div className="flex gap-2 w-full sm:w-auto justify-end sm:justify-start">
      {/* VOIR */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleOpenFile(fichier)}
        className="flex-1 sm:flex-initial p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        title="Voir le fichier"
      >
        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-xs sm:text-sm font-semibold sm:hidden">Voir</span>
      </motion.button>

      {/* TÉLÉCHARGER */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleDownloadFile(fichier)}
        disabled={downloadingFiles[fichier.id]}
        className="flex-1 sm:flex-initial p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        title="Télécharger"
      >
        {downloadingFiles[fichier.id] ? (
          <Loader size="sm" className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <>
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-semibold sm:hidden">Télécharger</span>
          </>
        )}
      </motion.button>
    </div>
  </motion.div>
);

// ✅ COMPOSANT INFO ITEM RESPONSIVE
const InfoItem = ({ icon: Icon, label, value, highlight }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl ${
      highlight ? 'bg-emerald-100 border-2 border-emerald-300 shadow-md' : 'bg-slate-50 border border-slate-200'
    }`}
  >
    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0 ${highlight ? 'text-emerald-700' : 'text-slate-600'}`} />
    <div className="flex-1 min-w-0">
      <p className="text-xs sm:text-sm text-slate-500 font-semibold mb-1">{label}</p>
      <p className="text-sm sm:text-base text-slate-900 font-bold break-words">{value || 'N/A'}</p>
    </div>
  </motion.div>
);

// ✅ COMPOSANT TIMELINE RESPONSIVE
const TimelineItem = ({ icon: Icon, label, date, color }) => {
  const colors = {
    green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
    gray: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' }
  };

  const c = colors[color] || colors.gray;

  return (
    <div className="flex items-start gap-3 sm:gap-4">
      <div className={`p-2 sm:p-3 rounded-full ${c.bg} border-2 ${c.border} shadow-md flex-shrink-0`}>
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${c.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-900 text-sm sm:text-base break-words">{label}</p>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold break-words">{date}</p>
      </div>
    </div>
  );
};

export default AdminDeclarationDetails;
