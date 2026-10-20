/**
 * ═══════════════════════════════════════════════════════════════════
 * 🏥 GESTION DES DÉCLARATIONS - ADMIN - VERSION FINALE AMÉLIORÉE ✅
 * Assurance ARO Madagascar
 * ═══════════════════════════════════════════════════════════════════
 * ✅ Affichage de la date/heure COMPLÈTE de création
 * ✅ Toutes les cartes de stats sont CLIQUABLES
 * ✅ Utilise statut_declaration (ENUM) correctement
 * ✅ Statut réel dans les cartes ET détails complets
 * ✅ POPUP DÉTAILS COMPLETS AMÉLIORÉ avec structure AdminDeclarationDetails
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import adminApi from '../../api/adminApi';
import {
  FileText, Search, Filter, RefreshCw, Eye, Edit, Download, ExternalLink,
  User, Phone, Mail, Calendar, Clock, FileCheck,
  Image as ImageIcon, File, CheckCircle2, XCircle, Loader2, RotateCcw,
  Send, Bell, ChevronLeft, ChevronRight, Paperclip, PlusCircle, AlertCircle,
  TrendingUp, Shield, Activity, CircleDot, MapPin, Building2, Home, 
  UserCheck, Heart, Stethoscope, CalendarDays, Timer, Briefcase, CreditCard,
  Hospital, Package, AlertTriangle, Ambulance, Pill, ClipboardList, Smile
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import { useNotification } from '../../hooks/useNotification';
import { formatDate, formatDateTime, formatCurrency } from '../../utils/formatters';
import {
  TYPE_SINISTRE_LABELS,
  STATUT_DECLARATION_LABELS,
} from '../../utils/constants';

const AdminDeclarations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const notification = useNotification();

  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalModifierOpen, setModalModifierOpen] = useState(false);
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [newStatut, setNewStatut] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [modalVoirOpen, setModalVoirOpen] = useState(false);
  const [detailsDeclaration, setDetailsDeclaration] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [downloadingFiles, setDownloadingFiles] = useState({});

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    statut: searchParams.get('statut') || '',
    type_sinistre: searchParams.get('type_sinistre') || '',
  });

  const [pagination, setPagination] = useState({
    page: 1, limit: 20, total: 0, pages: 0,
  });

  const [stats, setStats] = useState({
    en_attente: 0,
    en_traitement: 0,
    validees: 0,
    refusees: 0,
    complements_requis: 0,
    total: 0
  });

  // ═══════════════════════════════════════════════════════════════
  // 🔧 FONCTION : Extraction du statut RÉEL
  // ═══════════════════════════════════════════════════════════════
  const extraireStatutReel = (declaration) => {
    const statutReel = declaration.statut_declaration || declaration.statut || 'en_attente';
    
    console.log(`🔍 [${declaration.numero_declaration || declaration.id}]`, {
      'statut_declaration (ENUM)': declaration.statut_declaration,
      'statut (varchar - OBSOLÈTE)': declaration.statut,
      '✅ STATUT RETENU': statutReel
    });
    
    return statutReel;
  };

  // ═══════════════════════════════════════════════════════════════
  // 🕒 FONCTION : Formatage date/heure COMPLÈTE
  // ═══════════════════════════════════════════════════════════════
  const formatDateTimeComplete = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    
    // Format : Samedi 13 décembre 2025 à 17h31m45s
    const options = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Africa/Nairobi' // EAT
    };
    
    return date.toLocaleString('fr-FR', options);
  };

  // ═══════════════════════════════════════════════════════════════
  // 🕒 FONCTION : Formatage date/heure COMPACT pour les cartes
  // ═══════════════════════════════════════════════════════════════
  const formatDateTimeCompact = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    
    // Format compact : 13/12/2025 17:31:45
    const jour = String(date.getDate()).padStart(2, '0');
    const mois = String(date.getMonth() + 1).padStart(2, '0');
    const annee = date.getFullYear();
    const heure = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const seconde = String(date.getSeconds()).padStart(2, '0');
    
    return `${jour}/${mois}/${annee} ${heure}:${minute}:${seconde}`;
  };

  // ═══════════════════════════════════════════════════════════════
  // 🕒 FONCTION : Formatage date SEULEMENT (pour les détails)
  // ═══════════════════════════════════════════════════════════════
  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // ═══════════════════════════════════════════════════════════════
  // ⏱️ FONCTION : Calculer durée entre deux dates
  // ═══════════════════════════════════════════════════════════════
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    const diff = Math.abs(new Date(endDate) - new Date(startDate));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Moins d\'un jour' : `${days} jour${days > 1 ? 's' : ''}`;
  };

  useEffect(() => {
    fetchDeclarations();
    fetchStats();
  }, [pagination.page, filters.statut, filters.type_sinistre, filters.search]);

  const fetchStats = async () => {
    try {
      const response = await adminApi.getDashboardStats();
      if (response.success) {
        setStats({
          en_attente: response.data.declarations_en_attente || 0,
          en_traitement: response.data.declarations_en_traitement || 0,
          validees: response.data.declarations_validees || 0,
          refusees: response.data.declarations_refusees || 0,
          complements_requis: response.data.declarations_complements_requis || 0,
          total: response.data.total_declarations || 0
        });
      }
    } catch (error) {
      console.error('❌ Erreur stats:', error);
    }
  };

  const fetchDeclarations = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getAllDeclarations({
        page: pagination.page,
        limit: pagination.limit,
        statut: filters.statut,
        type_sinistre: filters.type_sinistre,
        search: filters.search,
      });

      if (response.success) {
        console.log('📊 ═══════ DÉCLARATIONS REÇUES ═══════');
        console.log(`Total: ${response.data.length} déclarations`);
        
        response.data.forEach((decl, index) => {
          const statutReel = extraireStatutReel(decl);
          console.log(`${index + 1}. ${decl.numero_declaration} → ${statutReel} | Créée le: ${formatDateTimeCompact(decl.created_at || decl.date_declaration)}`);
        });
        
        console.log('═══════════════════════════════════════\n');
        
        setDeclarations(response.data);
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.pagination.total,
            pages: response.pagination.pages,
          }));
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
      notification.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 🎯 FONCTION : Filtrer par statut (appelée par les cartes stats)
  // ═══════════════════════════════════════════════════════════════
  const handleFilterByStatut = (statut) => {
    setFilters({ ...filters, statut });
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    params.set('statut', statut);
    if (filters.type_sinistre) params.set('type_sinistre', filters.type_sinistre);
    setSearchParams(params);
    setPagination(prev => ({ ...prev, page: 1 }));
    
    const labelStatut = STATUT_DECLARATION_LABELS[statut] || statut;
    notification.success(`Filtrage : ${labelStatut}`);
  };

  // ═══════════════════════════════════════════════════════════════
  // 🎯 FONCTION : Afficher toutes les déclarations (carte Total)
  // ═══════════════════════════════════════════════════════════════
  const handleShowAll = () => {
    setFilters({ ...filters, statut: '' });
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.type_sinistre) params.set('type_sinistre', filters.type_sinistre);
    setSearchParams(params);
    setPagination(prev => ({ ...prev, page: 1 }));
    notification.success('Affichage de toutes les déclarations');
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.statut) params.set('statut', filters.statut);
    if (filters.type_sinistre) params.set('type_sinistre', filters.type_sinistre);
    
    setSearchParams(params);
    setPagination(prev => ({ ...prev, page: 1 }));
    notification.success('Filtres appliqués !');
  };

  const resetFilters = () => {
    setFilters({ search: '', statut: '', type_sinistre: '' });
    setSearchParams({});
    setPagination(prev => ({ ...prev, page: 1 }));
    notification.info('Filtres réinitialisés');
  };

  const openModalVoir = async (declarationId) => {
    setModalVoirOpen(true);
    setLoadingDetails(true);
    setDetailsDeclaration(null);

    try {
      const response = await adminApi.getDeclarationDetails(declarationId);
      if (response.success) {
        const statutReel = extraireStatutReel(response.data);
        console.log(`🔍 Détails complets - Statut réel: "${statutReel}"`);
        setDetailsDeclaration(response.data);
      } else {
        notification.error('Impossible de charger les détails');
      }
    } catch (error) {
      console.error('❌ Erreur détails:', error);
      notification.error('Erreur lors du chargement');
    } finally {
      setLoadingDetails(false);
    }
  };

  const getFichiersOriginaux = (fichiers) => {
    if (!fichiers || !Array.isArray(fichiers)) return [];
    return fichiers.filter(f => f.source_fichier === 'original' || f.source_fichier === 'initial');
  };

  const getFichiersComplements = (fichiers) => {
    if (!fichiers || !Array.isArray(fichiers)) return [];
    return fichiers.filter(f => f.source_fichier === 'complement');
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Ko';
    const k = 1024;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIconComponent = (fichier) => {
    const fileName = fichier.nom_original?.toLowerCase() || '';
    const fileType = (fichier.type_fichier || fichier.type_mime || '').toLowerCase();
    
    if (fileType.includes('image') || /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/.test(fileName)) {
      return <ImageIcon className="w-4 h-4 text-blue-500" />;
    }
    
    if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
      return <FileText className="w-4 h-4 text-red-500" />;
    }
    
    return <File className="w-4 h-4 text-gray-500" />;
  };

  const handleOpenFile = async (fichier) => {
    try {
      const cheminFichier = fichier.chemin_fichier;
      if (!cheminFichier) {
        notification.error(`Chemin manquant`);
        return;
      }

      const baseURL = window.location.origin.includes('localhost') 
        ? (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '')
        : window.location.origin;
      
      let fileUrl = '';
      
      if (cheminFichier.startsWith('/home/') || cheminFichier.includes(':\\')) {
        if (cheminFichier.includes('/uploads/')) {
          fileUrl = `${baseURL}${cheminFichier.substring(cheminFichier.indexOf('/uploads/'))}`;
        } else if (fichier.nom_stockage) {
          fileUrl = `${baseURL}/uploads/declarations/${fichier.nom_stockage}`;
        } else {
          fileUrl = `${baseURL}/uploads/declarations/${cheminFichier.split('/').pop()}`;
        }
      } else if (cheminFichier.startsWith('uploads/')) {
        fileUrl = `${baseURL}/${cheminFichier}`;
      } else if (cheminFichier.includes('/uploads/')) {
        fileUrl = `${baseURL}${cheminFichier.substring(cheminFichier.indexOf('/uploads/'))}`;
      } else {
        fileUrl = `${baseURL}/uploads/declarations/${cheminFichier.split('/').pop()}`;
      }

      window.open(fileUrl, '_blank', 'noopener,noreferrer');
      
    } catch (error) {
      notification.error(`Erreur: ${error.message}`);
    }
  };

  const handleDownloadFile = async (fichier) => {
    try {
      console.log('📥 Téléchargement fichier:', fichier);
      setDownloadingFiles(prev => ({ ...prev, [fichier.id]: true }));

      const baseURL = window.location.origin.includes('localhost') 
        ? (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '')
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
      notification.success(`✅ ${fichier.nom_original} téléchargé`);
    } catch (error) {
      console.error('❌ Erreur téléchargement:', error);
      notification.error('Erreur téléchargement');
    } finally {
      setDownloadingFiles(prev => ({ ...prev, [fichier.id]: false }));
    }
  };

  const openModalModifier = (declaration) => {
    const statutActuel = extraireStatutReel(declaration);
    setSelectedDeclaration(declaration);
    setNewStatut(statutActuel);
    setCommentaire(declaration.motif_rejet || declaration.commentaire_admin || '');
    setNotifyEmail(true);
    setModalModifierOpen(true);
  };

  const handleUpdateStatut = async () => {
    if (!newStatut) {
      notification.error('Sélectionnez un statut');
      return;
    }

    if (newStatut === 'refusee' && !commentaire.trim()) {
      notification.error('Motif du refus obligatoire');
      return;
    }

    setUpdating(true);
    try {
      const response = await adminApi.updateDeclarationStatut(
        selectedDeclaration.id,
        { 
          statut: newStatut, 
          commentaire: commentaire.trim(),
          notify_email: notifyEmail 
        }
      );

      if (response.success) {
        notification.success(
          `✅ ${newStatut === 'validee' ? 'Validée' : newStatut === 'refusee' ? 'Refusée' : 'Modifiée'} !${notifyEmail ? ' Email envoyé' : ''}`
        );
        setModalModifierOpen(false);
        fetchDeclarations();
        fetchStats();
      } else {
        notification.error(response.message);
      }
    } catch (error) {
      notification.error('Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 🎨 FONCTIONS DE PRÉSENTATION DU STATUT
  // ═══════════════════════════════════════════════════════════════
  
  const getStatusIcon = (statut) => {
    const normalized = String(statut).toLowerCase().trim();
    
    if (normalized === 'validee' || normalized === 'validée') return CheckCircle2;
    if (normalized === 'refusee' || normalized === 'refusée') return XCircle;
    if (normalized === 'en_traitement' || normalized === 'en traitement') return Activity;
    if (normalized === 'complements_requis' || normalized === 'compléments requis') return Bell;
    return Clock;
  };

  const getStatusColor = (statut) => {
    const normalized = String(statut).toLowerCase().trim();
    
    if (normalized === 'validee' || normalized === 'validée') {
      return { bg: 'bg-emerald-100', border: 'border-emerald-500', text: 'text-emerald-700', icon: 'text-emerald-600' };
    }
    if (normalized === 'refusee' || normalized === 'refusée') {
      return { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700', icon: 'text-red-600' };
    }
    if (normalized === 'en_traitement' || normalized === 'en traitement') {
      return { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-700', icon: 'text-blue-600' };
    }
    if (normalized === 'complements_requis' || normalized === 'compléments requis') {
      return { bg: 'bg-orange-100', border: 'border-orange-500', text: 'text-orange-700', icon: 'text-orange-600' };
    }
    
    return { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700', icon: 'text-yellow-600' };
  };

  const getStatusLabel = (statut) => {
    const normalized = String(statut).toLowerCase().trim();
    
    const mappingExact = {
      'en_attente': 'En attente',
      'en attente': 'En attente',
      'en_traitement': 'En traitement',
      'en traitement': 'En traitement',
      'validee': 'Validée',
      'validée': 'Validée',
      'refusee': 'Refusée',
      'refusée': 'Refusée',
      'complements_requis': 'Compléments requis',
      'compléments requis': 'Compléments requis'
    };
    
    if (mappingExact[normalized]) {
      return mappingExact[normalized];
    }
    
    if (STATUT_DECLARATION_LABELS[normalized]) {
      return STATUT_DECLARATION_LABELS[normalized];
    }
    
    return statut.charAt(0).toUpperCase() + statut.slice(1).toLowerCase();
  };

  // ═══════════════════════════════════════════════════════════════
  // 🎨 COMPOSANT : InfoItemModal (pour affichage détaillé)
  // ═══════════════════════════════════════════════════════════════
  const InfoItemModal = ({ icon: Icon, label, value, highlight }) => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`flex items-start gap-2 p-2.5 rounded-xl ${
        highlight ? 'bg-emerald-100 border-2 border-emerald-300 shadow-md' : 'bg-slate-50 border border-slate-200'
      }`}
    >
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${highlight ? 'text-emerald-700' : 'text-slate-600'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-slate-500 font-semibold mb-0.5">{label}</p>
        <p className="text-slate-900 font-bold text-xs break-words">{value || 'N/A'}</p>
      </div>
    </motion.div>
  );

  // ═══════════════════════════════════════════════════════════════
  // 🎨 COMPOSANT : FileCardDetailModal (carte fichier améliorée)
  // ═══════════════════════════════════════════════════════════════
  const FileCardDetailModal = ({
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
      whileHover={{ scale: 1.02, y: -2 }}
      className={`flex items-center justify-between p-3 rounded-xl border-2 bg-gradient-to-br ${bgGradient} ${borderColor} transition-all hover:shadow-xl`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
        <div className="p-2 rounded-lg bg-white shadow-md">
          {getFileIconComponent(fichier)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="font-bold text-slate-900 truncate text-sm">
              {fichier.nom_original}
            </p>
            {isComplement && (
              <span className="px-2 py-0.5 text-[9px] font-black text-green-900 bg-green-300 rounded-full border border-green-400">
                COMPLÉMENT
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold">{formatFileSize(fichier.taille_octets)}</span>
            {(fichier.date_upload || fichier.date_ajout) && (
              <>
                <span>•</span>
                <span className="text-[10px]">{formatDateTime(fichier.date_upload || fichier.date_ajout)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-1.5">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleOpenFile(fichier)}
          className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg hover:shadow-2xl transition-all"
          title="Voir le fichier"
        >
          <Eye className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleDownloadFile(fichier)}
          disabled={downloadingFiles[fichier.id]}
          className="p-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-2xl transition-all disabled:opacity-50"
          title="Télécharger"
        >
          {downloadingFiles[fichier.id] ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-white py-4">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* ========== HEADER ========== */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-5">
            <img 
              src="/AROO.png" 
              alt="Assurance ARO Logo" 
              className="h-24 w-auto object-contain shadow-lg rounded-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/AROO.jpg';
              }}
            />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent">
                Gestion des Déclarations
              </h1>
              <p className="text-sm text-gray-600 font-medium">Assurance ARO Madagascar</p>
            </div>
          </div>

          <button
            onClick={fetchDeclarations}
            disabled={loading}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold transition-colors flex items-center gap-2 shadow-lg"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </motion.div>

        {/* ========== STATISTIQUES (TOUTES CLIQUABLES) ========== */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          {/* CARTE TOTAL - CLIQUABLE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={handleShowAll}
            className="bg-white rounded-3xl p-4 shadow-md border-2 border-gray-200 hover:shadow-xl hover:border-gray-400 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-6 h-6 text-gray-600" />
              <span className="text-xs font-semibold text-gray-500 uppercase">Total</span>
            </div>
            <p className="text-4xl font-bold text-gray-900">{stats.total || pagination.total}</p>
            <p className="text-[10px] text-gray-500 mt-1">Cliquez pour tout voir</p>
          </motion.div>

          {/* CARTE EN ATTENTE - CLIQUABLE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => handleFilterByStatut('en_attente')}
            className="bg-white rounded-3xl p-4 shadow-md border-2 border-yellow-300 hover:shadow-xl hover:border-yellow-500 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-6 h-6 text-yellow-600" />
              <span className="text-xs font-semibold text-yellow-600 uppercase">Attente</span>
            </div>
            <p className="text-4xl font-bold text-yellow-700">{stats.en_attente}</p>
            <p className="text-[10px] text-yellow-600 mt-1">Cliquez pour filtrer</p>
          </motion.div>

          {/* CARTE EN TRAITEMENT - CLIQUABLE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => handleFilterByStatut('en_traitement')}
            className="bg-white rounded-3xl p-4 shadow-md border-2 border-blue-300 hover:shadow-xl hover:border-blue-500 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-6 h-6 text-blue-600" />
              <span className="text-xs font-semibold text-blue-600 uppercase">Actif</span>
            </div>
            <p className="text-4xl font-bold text-blue-700">{stats.en_traitement}</p>
            <p className="text-[10px] text-blue-600 mt-1">Cliquez pour filtrer</p>
          </motion.div>

          {/* CARTE COMPLÉMENTS REQUIS - CLIQUABLE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            onClick={() => handleFilterByStatut('complements_requis')}
            className="bg-white rounded-3xl p-4 shadow-md border-2 border-orange-300 hover:shadow-xl hover:border-orange-500 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-6 h-6 text-orange-600" />
              <span className="text-xs font-semibold text-orange-600 uppercase">Compl.</span>
            </div>
            <p className="text-4xl font-bold text-orange-700">{stats.complements_requis}</p>
            <p className="text-[10px] text-orange-600 mt-1">Cliquez pour filtrer</p>
          </motion.div>

          {/* CARTE VALIDÉES - CLIQUABLE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => handleFilterByStatut('validee')}
            className="bg-white rounded-3xl p-4 shadow-md border-2 border-emerald-300 hover:shadow-xl hover:border-emerald-500 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-600 uppercase">Validé</span>
            </div>
            <p className="text-4xl font-bold text-emerald-700">{stats.validees}</p>
            <p className="text-[10px] text-emerald-600 mt-1">Cliquez pour filtrer</p>
          </motion.div>

          {/* CARTE REFUSÉES - CLIQUABLE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => handleFilterByStatut('refusee')}
            className="bg-white rounded-3xl p-4 shadow-md border-2 border-red-300 hover:shadow-xl hover:border-red-500 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-6 h-6 text-red-600" />
              <span className="text-xs font-semibold text-red-600 uppercase">Refusé</span>
            </div>
            <p className="text-4xl font-bold text-red-700">{stats.refusees}</p>
            <p className="text-[10px] text-red-600 mt-1">Cliquez pour filtrer</p>
          </motion.div>
        </div>

        {/* ========== FILTRES ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl p-5 shadow-lg border-2 border-emerald-200 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-semibold text-gray-900">Filtres</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-3 mb-3">
            <input
              type="text"
              placeholder="Rechercher..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
              className="px-3 py-2 border-2 border-gray-300 rounded-2xl focus:border-emerald-500 focus:outline-none text-sm"
            />

            <select
              value={filters.statut}
              onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
              className="px-3 py-2 border-2 border-gray-300 rounded-2xl focus:border-emerald-500 focus:outline-none text-sm"
            >
              <option value="">Tous les statuts</option>
              {Object.entries(STATUT_DECLARATION_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            <select
              value={filters.type_sinistre}
              onChange={(e) => setFilters({ ...filters, type_sinistre: e.target.value })}
              className="px-3 py-2 border-2 border-gray-300 rounded-2xl focus:border-emerald-500 focus:outline-none text-sm"
            >
              <option value="">Tous les types</option>
              {Object.entries(TYPE_SINISTRE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold text-sm transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Appliquer
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-2xl font-semibold text-sm transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Réinitialiser
            </button>
          </div>
        </motion.div>

        {/* ========== LISTE DES DÉCLARATIONS AVEC DATE/HEURE ========== */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 shadow-lg text-center border-2 border-gray-200">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement...</p>
          </div>
        ) : declarations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-lg text-center border-2 border-gray-200">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Aucune déclaration trouvée</p>
          </div>
        ) : (
          <div className="space-y-4">
            {declarations.map((declaration, index) => {
              const statutReel = extraireStatutReel(declaration);
              const StatusIcon = getStatusIcon(statutReel);
              const statusColor = getStatusColor(statutReel);
              const statusLabel = getStatusLabel(statutReel);
              const dateCreation = declaration.created_at || declaration.date_declaration;

              return (
                <motion.div
                  key={declaration.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-3xl p-5 shadow-lg border-2 border-emerald-200 hover:shadow-xl hover:border-emerald-400 transition-all"
                >
                  {/* EN-TÊTE */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 ${statusColor.bg} rounded-2xl border-2 ${statusColor.border}`}>
                        <StatusIcon className={`w-6 h-6 ${statusColor.icon}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {declaration.numero_declaration}
                        </h3>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusColor.bg} border-2 ${statusColor.border} mt-1`}>
                          <CircleDot className={`w-3.5 h-3.5 ${statusColor.icon}`} />
                          <span className={`text-xs font-bold ${statusColor.text} uppercase`}>
                            {statusLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openModalVoir(declaration.id)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-sm font-semibold transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Détails
                      </button>
                      <button
                        onClick={() => openModalModifier(declaration)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-semibold transition-colors flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Modifier
                      </button>
                    </div>
                  </div>

                  {/* ✅ DATE ET HEURE DE CRÉATION */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-3 mb-3 border-2 border-indigo-200">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-indigo-600" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-indigo-700 uppercase mb-0.5">Date de création</p>
                        <p className="text-sm font-bold text-gray-900">
                          📅 {formatDateTimeCompact(dateCreation)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* INFORMATIONS */}
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-3 border-2 border-emerald-200">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-700 uppercase">Assuré</span>
                      </div>
                      <p className="text-gray-900 font-bold text-sm">{declaration.assure_nom}</p>
                      {declaration.numero_dossier && (
                        <p className="text-xs text-gray-600 mt-1">📁 {declaration.numero_dossier}</p>
                      )}
                    </div>

                    {declaration.personne_soignee_nom && (
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-3 border-2 border-purple-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Heart className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-semibold text-purple-700 uppercase">Personne Soignée</span>
                        </div>
                        <p className="text-gray-900 font-bold text-sm">{declaration.personne_soignee_nom}</p>
                      </div>
                    )}

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-3 border-2 border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Stethoscope className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700 uppercase">Type</span>
                      </div>
                      <p className="text-gray-900 font-bold text-sm capitalize">
                        {TYPE_SINISTRE_LABELS[declaration.type_sinistre]}
                      </p>
                    </div>
                  </div>

                  {declaration.commentaire_admin && (
                    <div className="mt-3 bg-yellow-50 rounded-2xl p-3 border-2 border-yellow-300">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-xs font-semibold text-yellow-700 uppercase">Commentaire Admin</span>
                      </div>
                      <p className="text-sm text-gray-700">{declaration.commentaire_admin}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ========== PAGINATION ========== */}
        {pagination.pages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-4 shadow-lg border-2 border-emerald-200 mt-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">
                Page {pagination.page} sur {pagination.pages} • {pagination.total} déclarations
              </p>
              <div className="flex gap-3">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-2xl font-semibold text-sm transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </button>
                <button
                  disabled={pagination.page === pagination.pages}
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-2xl font-semibold text-sm transition-colors flex items-center gap-2"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          🎯 MODAL DÉTAILS COMPLETS AMÉLIORÉ
          ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {modalVoirOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b-2 border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-emerald-600" />
                  Détails Complets
                </h2>
                <button
                  onClick={() => setModalVoirOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {loadingDetails ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 text-base">Chargement des détails...</p>
                  </div>
                ) : detailsDeclaration ? (
                  <>
                    {/* STATUS */}
                    {(() => {
                      const statutReel = extraireStatutReel(detailsDeclaration);
                      const StatusIcon = getStatusIcon(statutReel);
                      const statusColor = getStatusColor(statutReel);
                      const statusLabel = getStatusLabel(statutReel);
                      
                      return (
                        <div className={`${statusColor.bg} rounded-2xl p-4 border-2 ${statusColor.border}`}>
                          <div className="flex items-center gap-3">
                            <StatusIcon className={`w-7 h-7 ${statusColor.icon}`} />
                            <div>
                              <p className="text-xs font-semibold text-gray-600">Statut</p>
                              <p className={`font-bold text-lg ${statusColor.text}`}>
                                {statusLabel}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* INFORMATIONS GÉNÉRALES AMÉLIORÉES */}
                    <div className="bg-gradient-to-br from-white via-slate-50 to-white border-2 border-emerald-200 shadow-xl rounded-2xl p-4">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        Informations générales
                      </h3>

                      <div className="grid md:grid-cols-2 gap-3">
                        <InfoItemModal icon={FileCheck} label="Numéro déclaration" value={detailsDeclaration.numero_declaration} />
                        <InfoItemModal 
                          icon={Calendar} 
                          label="Date de déclaration (COMPLÈTE)" 
                          value={formatDateTimeComplete(detailsDeclaration.date_declaration || detailsDeclaration.created_at)} 
                          highlight 
                        />
                        <InfoItemModal icon={FileText} label="Type de sinistre" value={TYPE_SINISTRE_LABELS[detailsDeclaration.type_sinistre]} />
                        <InfoItemModal 
                          icon={Activity} 
                          label="Statut actuel" 
                          value={STATUT_DECLARATION_LABELS[detailsDeclaration.statut_declaration || detailsDeclaration.statut]} 
                        />
                        
                        {(detailsDeclaration.accident_date || detailsDeclaration.maladie_date_debut || detailsDeclaration.hospitalisation_date_debut || detailsDeclaration.soins_dentaires_date_debut) && (
                          <InfoItemModal 
                            icon={Calendar} 
                            label="Date du sinistre" 
                            value={formatDateOnly(
                              detailsDeclaration.accident_date || 
                              detailsDeclaration.maladie_date_debut || 
                              detailsDeclaration.hospitalisation_date_debut || 
                              detailsDeclaration.soins_dentaires_date_debut
                            )} 
                            highlight 
                          />
                        )}
                        
                        {(detailsDeclaration.accident_lieu || detailsDeclaration.hospitalisation_etablissement) && (
                          <InfoItemModal 
                            icon={MapPin} 
                            label="Lieu du sinistre" 
                            value={detailsDeclaration.accident_lieu || detailsDeclaration.hospitalisation_etablissement} 
                          />
                        )}

                        {detailsDeclaration.montant_estime_frais && (
                          <div className="md:col-span-2">
                            <InfoItemModal 
                              icon={CreditCard} 
                              label="Montant estimé des frais" 
                              value={formatCurrency(detailsDeclaration.montant_estime_frais)} 
                              highlight
                            />
                          </div>
                        )}
                      </div>

                      {(detailsDeclaration.description || detailsDeclaration.description_detaillee || detailsDeclaration.accident_circonstances || detailsDeclaration.hospitalisation_description) && (
                        <div className="mt-4">
                          <p className="text-xs text-slate-600 mb-2 flex items-center gap-1.5 font-semibold">
                            <FileText className="w-4 h-4" />
                            Description détaillée
                          </p>
                          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-xl border-2 border-slate-200 shadow-inner">
                            <p className="text-slate-800 whitespace-pre-wrap leading-relaxed text-xs">
                              {detailsDeclaration.description || 
                               detailsDeclaration.description_detaillee || 
                               detailsDeclaration.accident_circonstances || 
                               detailsDeclaration.hospitalisation_description ||
                               'Aucune description détaillée'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ASSURÉ AMÉLIORÉ */}
                    <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50 border-2 border-blue-200 shadow-xl rounded-2xl p-4">
                      <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Informations Assuré
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        <InfoItemModal icon={User} label="Nom complet" value={detailsDeclaration.assure_nom} />
                        <InfoItemModal icon={FileText} label="N° Dossier" value={detailsDeclaration.numero_dossier} />
                        <InfoItemModal icon={FileText} label="N° Police" value={detailsDeclaration.numero_police} />
                        <InfoItemModal icon={Shield} label="Type" value={detailsDeclaration.type_assure?.toUpperCase()} />
                        
                        {detailsDeclaration.assure_telephone && (
                          <InfoItemModal icon={Phone} label="Téléphone" value={detailsDeclaration.assure_telephone} />
                        )}
                        {detailsDeclaration.assure_email && (
                          <InfoItemModal icon={Mail} label="Email" value={detailsDeclaration.assure_email} />
                        )}
                        {detailsDeclaration.adresse_assure && (
                          <div className="md:col-span-2">
                            <InfoItemModal icon={MapPin} label="Adresse complète" value={detailsDeclaration.adresse_assure} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* PERSONNE SOIGNÉE */}
                    {detailsDeclaration.personne_soignee_nom && (
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-xl rounded-2xl p-4">
                        <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                          <UserCheck className="w-5 h-5 text-purple-600" />
                          Personne soignée
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          <InfoItemModal icon={User} label="Nom complet" value={detailsDeclaration.personne_soignee_nom} />
                          {detailsDeclaration.personne_soignee_profession && (
                            <InfoItemModal icon={Briefcase} label="Profession" value={detailsDeclaration.personne_soignee_profession} />
                          )}
                          {detailsDeclaration.personne_soignee_age && (
                            <InfoItemModal icon={CalendarDays} label="Âge" value={`${detailsDeclaration.personne_soignee_age} ans`} />
                          )}
                          {detailsDeclaration.personne_soignee_parente && (
                            <InfoItemModal icon={Heart} label="Lien de parenté" value={detailsDeclaration.personne_soignee_parente} />
                          )}
                        </div>
                      </div>
                    )}

                    {/* DÉTAILS SELON TYPE - ACCIDENT */}
                    {detailsDeclaration.type_sinistre === 'accident' && (
                      <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 shadow-xl rounded-2xl p-4">
                        <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                          <Ambulance className="w-5 h-5" />
                          Détails de l'accident
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {detailsDeclaration.accident_date && (
                            <InfoItemModal icon={Calendar} label="Date accident" value={formatDateOnly(detailsDeclaration.accident_date)} highlight />
                          )}
                          {detailsDeclaration.accident_lieu && (
                            <InfoItemModal icon={MapPin} label="Lieu" value={detailsDeclaration.accident_lieu} />
                          )}
                          {detailsDeclaration.accident_constate_par && (
                            <InfoItemModal icon={UserCheck} label="Constaté par" value={detailsDeclaration.accident_constate_par} />
                          )}
                          {detailsDeclaration.accident_soigne_par && (
                            <InfoItemModal icon={Stethoscope} label="Soigné par" value={detailsDeclaration.accident_soigne_par} />
                          )}
                          {detailsDeclaration.accident_blessures && (
                            <div className="md:col-span-2">
                              <InfoItemModal icon={Heart} label="Nature des blessures" value={detailsDeclaration.accident_blessures} />
                            </div>
                          )}
                          {detailsDeclaration.accident_circonstances && (
                            <div className="md:col-span-2">
                              <InfoItemModal icon={AlertCircle} label="Circonstances détaillées" value={detailsDeclaration.accident_circonstances} />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* MALADIE */}
                    {detailsDeclaration.type_sinistre === 'maladie' && (
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 shadow-xl rounded-2xl p-4">
                        <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                          <Heart className="w-5 h-5" />
                          Détails de la maladie
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {detailsDeclaration.maladie_type && (
                            <InfoItemModal icon={Pill} label="Type de maladie" value={detailsDeclaration.maladie_type} />
                          )}
                          {detailsDeclaration.maladie_date_debut && (
                            <InfoItemModal icon={Calendar} label="Date début" value={formatDateOnly(detailsDeclaration.maladie_date_debut)} highlight />
                          )}
                          {detailsDeclaration.maladie_code_oms && (
                            <InfoItemModal icon={ClipboardList} label="Code OMS" value={detailsDeclaration.maladie_code_oms} />
                          )}
                          {detailsDeclaration.maladie_designation && (
                            <InfoItemModal icon={FileCheck} label="Désignation" value={detailsDeclaration.maladie_designation} />
                          )}
                          {detailsDeclaration.maladie_soignee_par && (
                            <div className="md:col-span-2">
                              <InfoItemModal icon={Stethoscope} label="Soigné par" value={detailsDeclaration.maladie_soignee_par} />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* HOSPITALISATION */}
                    {detailsDeclaration.type_sinistre === 'hospitalisation' && (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-xl rounded-2xl p-4">
                        <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                          <Hospital className="w-5 h-5" />
                          Détails hospitalisation
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {detailsDeclaration.hospitalisation_etablissement && (
                            <InfoItemModal icon={Building2} label="Établissement" value={detailsDeclaration.hospitalisation_etablissement} />
                          )}
                          {detailsDeclaration.hospitalisation_date_debut && (
                            <InfoItemModal icon={Calendar} label="Date entrée" value={formatDateOnly(detailsDeclaration.hospitalisation_date_debut)} highlight />
                          )}
                          {detailsDeclaration.hospitalisation_date_fin && (
                            <InfoItemModal icon={Calendar} label="Date sortie" value={formatDateOnly(detailsDeclaration.hospitalisation_date_fin)} highlight />
                          )}
                          <InfoItemModal 
                            icon={Timer} 
                            label="Durée séjour" 
                            value={calculateDuration(detailsDeclaration.hospitalisation_date_debut, detailsDeclaration.hospitalisation_date_fin)} 
                          />
                          {detailsDeclaration.hospitalisation_operation_par && (
                            <InfoItemModal icon={Stethoscope} label="Opération par" value={detailsDeclaration.hospitalisation_operation_par} />
                          )}
                          {detailsDeclaration.hospitalisation_description && (
                            <div className="md:col-span-2">
                              <InfoItemModal icon={FileText} label="Description" value={detailsDeclaration.hospitalisation_description} />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* SOINS DENTAIRES */}
                    {detailsDeclaration.type_sinistre === 'soins_dentaires' && (
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 shadow-xl rounded-2xl p-4">
                        <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
                          <Smile className="w-5 h-5" />
                          Détails soins dentaires
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {detailsDeclaration.soins_dentaires_date_debut && (
                            <InfoItemModal icon={Calendar} label="Date début" value={formatDateOnly(detailsDeclaration.soins_dentaires_date_debut)} highlight />
                          )}
                          {detailsDeclaration.soins_dentaires_date_fin && (
                            <InfoItemModal icon={Calendar} label="Date fin" value={formatDateOnly(detailsDeclaration.soins_dentaires_date_fin)} highlight />
                          )}
                          <InfoItemModal 
                            icon={Timer} 
                            label="Durée traitement" 
                            value={calculateDuration(detailsDeclaration.soins_dentaires_date_debut, detailsDeclaration.soins_dentaires_date_fin)} 
                          />
                          {detailsDeclaration.soins_dentaires_effectues_par && (
                            <InfoItemModal icon={Stethoscope} label="Soins par" value={detailsDeclaration.soins_dentaires_effectues_par} />
                          )}
                        </div>
                      </div>
                    )}

                    {/* FICHIERS ORIGINAUX AVEC BOUTONS VOIR + TÉLÉCHARGER */}
                    {(() => {
                      const originaux = getFichiersOriginaux(detailsDeclaration.fichiers);
                      return originaux.length > 0 ? (
                        <div className="border-2 border-blue-300 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                              <Paperclip className="w-5 h-5 text-blue-600" />
                              Pièces justificatives originales
                            </h3>
                            <span className="px-3 py-1.5 bg-blue-600 text-white rounded-full font-bold text-sm shadow-lg">
                              {originaux.length}
                            </span>
                          </div>

                          <div className="space-y-2">
                            {originaux.map((fichier, index) => (
                              <FileCardDetailModal
                                key={`orig-${fichier.id || index}`}
                                fichier={fichier}
                                index={index}
                                handleOpenFile={handleOpenFile}
                                handleDownloadFile={handleDownloadFile}
                                getFileIconComponent={getFileIconComponent}
                                formatFileSize={formatFileSize}
                                formatDateTime={formatDateTimeComplete}
                                borderColor="border-blue-300 hover:border-blue-500"
                                bgGradient="from-blue-50 to-indigo-100"
                                downloadingFiles={downloadingFiles}
                              />
                            ))}
                          </div>

                          <div className="mt-3 p-2.5 bg-blue-100 rounded-xl border-2 border-blue-300">
                            <p className="text-xs text-blue-900 flex items-center gap-1.5 font-semibold">
                              <Package className="w-4 h-4" />
                              Fichiers uploadés lors de la création de la déclaration
                            </p>
                          </div>
                        </div>
                      ) : null;
                    })()}

                    {/* FICHIERS COMPLÉMENTS AVEC BOUTONS VOIR + TÉLÉCHARGER */}
                    {(() => {
                      const complements = getFichiersComplements(detailsDeclaration.fichiers);
                      return complements.length > 0 ? (
                        <div className="border-2 border-green-300 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                              <PlusCircle className="w-5 h-5 text-green-600" />
                              Fichiers complémentaires
                            </h3>
                            <span className="px-3 py-1.5 bg-green-600 text-white rounded-full font-bold text-sm shadow-lg">
                              {complements.length}
                            </span>
                          </div>

                          <div className="space-y-2">
                            {complements.map((fichier, index) => (
                              <FileCardDetailModal
                                key={`comp-${fichier.id || index}`}
                                fichier={fichier}
                                index={index}
                                handleOpenFile={handleOpenFile}
                                handleDownloadFile={handleDownloadFile}
                                getFileIconComponent={getFileIconComponent}
                                formatFileSize={formatFileSize}
                                formatDateTime={formatDateTimeComplete}
                                borderColor="border-green-300 hover:border-green-500"
                                bgGradient="from-green-50 to-emerald-100"
                                isComplement={true}
                                downloadingFiles={downloadingFiles}
                              />
                            ))}
                          </div>

                          <div className="mt-3 p-2.5 bg-green-100 rounded-xl border-2 border-green-300">
                            <p className="text-xs text-green-900 flex items-center gap-1.5 font-semibold">
                              <PlusCircle className="w-4 h-4" />
                              Documents ajoutés après la déclaration initiale
                            </p>
                          </div>
                        </div>
                      ) : null;
                    })()}

                    {/* SI AUCUN FICHIER */}
                    {(() => {
                      const originaux = getFichiersOriginaux(detailsDeclaration.fichiers);
                      const complements = getFichiersComplements(detailsDeclaration.fichiers);
                      return originaux.length === 0 && complements.length === 0 ? (
                        <div className="p-8 text-center bg-yellow-50 border-2 border-yellow-300 shadow-xl rounded-2xl">
                          <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-3" />
                          <h3 className="text-lg font-bold text-yellow-800 mb-2">Aucun fichier</h3>
                          <p className="text-yellow-700 text-sm">Aucune pièce justificative n'a été uploadée pour cette déclaration</p>
                        </div>
                      ) : null;
                    })()}

                    {/* MOTIF REJET */}
                    {detailsDeclaration.motif_rejet && (
                      <div className="p-4 border-l-4 border-rose-600 bg-rose-50 shadow-xl rounded-xl">
                        <h3 className="text-base font-bold text-rose-700 mb-3 flex items-center gap-2">
                          <XCircle className="w-5 h-5" />
                          Motif de refus
                        </h3>
                        <p className="text-slate-900 whitespace-pre-wrap bg-white p-3 rounded-xl border-2 border-rose-200 leading-relaxed text-sm">
                          {detailsDeclaration.motif_rejet}
                        </p>
                      </div>
                    )}

                    {/* COMMENTAIRE ADMIN */}
                    {detailsDeclaration.commentaire_admin && (
                      <div className="p-4 border-l-4 border-blue-600 bg-blue-50 shadow-xl rounded-xl">
                        <h3 className="text-base font-bold text-blue-700 mb-3 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          Commentaire administrateur
                        </h3>
                        <p className="text-slate-900 whitespace-pre-wrap bg-white p-3 rounded-xl border-2 border-blue-200 leading-relaxed text-sm">
                          {detailsDeclaration.commentaire_admin}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune donnée disponible</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========== MODAL MODIFIER STATUT ========== */}
      <AnimatePresence>
        {modalModifierOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md"
            >
              <div className="flex items-center justify-between p-5 border-b-2 border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Edit className="w-6 h-6 text-emerald-600" />
                  Modifier Statut
                </h2>
                <button
                  onClick={() => setModalModifierOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nouveau Statut *
                  </label>
                  <select
                    value={newStatut}
                    onChange={(e) => setNewStatut(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-2xl focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">Sélectionner...</option>
                    {Object.entries(STATUT_DECLARATION_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Commentaire {newStatut === 'refusee' && '*'}
                  </label>
                  <textarea
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    placeholder={newStatut === 'refusee' ? 'Motif du refus obligatoire...' : 'Commentaire optionnel...'}
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-2xl focus:border-emerald-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="notifyEmail"
                    checked={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.checked)}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="notifyEmail" className="text-sm font-semibold text-gray-700">
                    Envoyer un email à l'assuré
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleUpdateStatut}
                    disabled={updating}
                    className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Enregistrer
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setModalModifierOpen(false)}
                    disabled={updating}
                    className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-2xl font-bold transition-colors disabled:opacity-50"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDeclarations;
