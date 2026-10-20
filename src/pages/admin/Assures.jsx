/**
 * ═══════════════════════════════════════════════════════════════════
 * 👥 GESTION DES ASSURÉS - VERSION MODERNE OPTIMISÉE ✅
 * Assurance ARO Madagascar
 * ═══════════════════════════════════════════════════════════════════
 * ✅ Logo AROO agrandi (h-24)
 * ✅ Animations Framer Motion identiques
 * ✅ Cartes de stats CLIQUABLES pour filtrer
 * ✅ Bouton Actualiser avec animation spin
 * ✅ Design moderne avec gradients et shadows
 * ✅ Système similaire aux déclarations
 * ✅ NOUVEAU: Bouton "Voir Détails" pour afficher toutes les informations
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Plus, Edit2, Trash2, Download, X, Loader2, Camera,
  UserCheck, UserX, Calendar, Building2, Mail, Phone, FileText,
  ChevronLeft, ChevronRight, MapPin, Cake, Shield, AlertCircle, CreditCard,
  RefreshCw, CircleDot, Eye
} from 'lucide-react';
import assureService from '../../services/assureService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AGENCES_ARO = [
  'Antsahavola', 'Ampefiloha', 'Analakely', 'Ankorondrano', 'Département Grands Comptes',
  'Antsirabe', 'Fianarantsoa', 'Ambatondrazaka', 'Toamasina', 'Manakara',
  'Antsiranana', 'Ambanja', 'Nosy Be', 'Sambava', 'Antalaha', 'Antsohihy',
  'Mahajanga', 'Morondava', 'Toliara', 'Taolagnaro (Fort-Dauphin)',
  'Brugassur', 'AUXIMAD', 'Cabinet Mitsinjo', 'RAMANANDRAIBE Export', 'Henri Fraise Fils', 'ADEMA Assurances', 'Assur Miaro'
];

export default function Assures() {
  const [assures, setAssures] = useState([]);
  const [stats, setStats] = useState(null);
  const [titulaires, setTitulaires] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showFullPhotoModal, setShowFullPhotoModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false); // ✅ NOUVEAU
  const [selectedAssure, setSelectedAssure] = useState(null);
  const [selectedAssureForFullPhoto, setSelectedAssureForFullPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [filters, setFilters] = useState({
    search: '', statut: '', type: '', agence: '', sortBy: 'date_creation', sortOrder: 'DESC'
  });
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    numero_dossier: '', numero_police: '', numero_compte: '', nom_complet: '',
    adresse: '', telephone: '', email: '', date_naissance: '',
    type_assure: 'titulaire', titulaire_id: '', parente_avec_titulaire: '',
    agence: '', date_debut_contrat: '', date_fin_contrat: '', statut_contrat: 'actif'
  });

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    loadData();
  }, [currentPage, filters]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await assureService.getAll({ page: currentPage, limit: 10, ...filters });
      setAssures(response.data || []);
      setTotal(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 1);

      const statsResponse = await assureService.getStats();
      setStats(statsResponse.data);

      const titulairesResponse = await assureService.getTitulaires();
      setTitulaires(titulairesResponse.data || []);
    } catch (error) {
      console.error('Erreur chargement:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 🎯 FONCTION : Filtrer par statut (appelée par les cartes stats)
  // ═══════════════════════════════════════════════════════════════
  const handleFilterByStatut = (statut) => {
    setFilters({ ...filters, statut });
    setCurrentPage(1);
    const labels = {
      'actif': 'Contrats Actifs',
      'resilie': 'Résiliés'
    };
    toast.success(`Filtrage : ${labels[statut] || statut}`);
  };

  // ═══════════════════════════════════════════════════════════════
  // 🎯 FONCTION : Afficher tous les assurés (carte Total)
  // ═══════════════════════════════════════════════════════════════
  const handleShowAll = () => {
    setFilters({ ...filters, statut: '' });
    setCurrentPage(1);
    toast.success('Affichage de tous les assurés');
  };

  // ═══════════════════════════════════════════════════════════════
  // 🎯 NOUVELLE FONCTION : Voir tous les détails d'un assuré
  // ═══════════════════════════════════════════════════════════════
  const handleViewDetails = (assure) => {
    setSelectedAssure(assure);
    setShowDetailsModal(true);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleCreate = () => {
    setIsEditMode(false);
    setSelectedAssure(null);
    setFormData({
      numero_dossier: '', numero_police: '', numero_compte: '', nom_complet: '',
      adresse: '', telephone: '', email: '', date_naissance: '',
      type_assure: 'titulaire', titulaire_id: '', parente_avec_titulaire: '',
      agence: '', date_debut_contrat: '', date_fin_contrat: '', statut_contrat: 'actif'
    });
    setShowModal(true);
  };

  const handleEdit = (assure) => {
    setIsEditMode(true);
    setSelectedAssure(assure);
    setFormData({
      numero_dossier: assure.numero_dossier || '',
      numero_police: assure.numero_police || '',
      numero_compte: assure.numero_compte || '',
      nom_complet: assure.nom_complet || '',
      adresse: assure.adresse || '',
      telephone: assure.telephone || '',
      email: assure.email || '',
      date_naissance: assure.date_naissance ? assure.date_naissance.split('T')[0] : '',
      type_assure: assure.type_assure || 'titulaire',
      titulaire_id: assure.titulaire_id || '',
      parente_avec_titulaire: assure.parente_avec_titulaire || '',
      agence: assure.agence || '',
      date_debut_contrat: assure.date_debut_contrat ? assure.date_debut_contrat.split('T')[0] : '',
      date_fin_contrat: assure.date_fin_contrat ? assure.date_fin_contrat.split('T')[0] : '',
      statut_contrat: assure.statut_contrat || 'actif'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditMode && selectedAssure) {
        await assureService.update(selectedAssure.id, formData);
        toast.success('✅ Assuré modifié avec succès');
      } else {
        await assureService.create(formData);
        toast.success('✅ Assuré créé avec succès');
      }

      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Erreur soumission:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAssure) return;

    setIsSubmitting(true);
    try {
      await assureService.deleteAssure(selectedAssure.id);
      toast.success('✅ Assuré supprimé avec succès');
      setShowDeleteModal(false);
      setSelectedAssure(null);
      loadData();
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAssure) return;

    const maxSize = 30 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('❌ La photo ne doit pas dépasser 30MB');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);

      await assureService.uploadPhoto(selectedAssure.id, formData);
      toast.success('✅ Photo mise à jour avec succès');
      setShowPhotoModal(false);
      loadData();
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'upload de la photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleExport = async () => {
    try {
      await assureService.exportExcel(filters);
      toast.success('✅ Export effectué');
    } catch (error) {
      console.error('Erreur export:', error);
      toast.error('Erreur lors de l\'export');
    }
  };

  if (isLoading && !assures.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-white">
        <div className="text-center">
          <Loader2 className="animate-spin text-emerald-600 mx-auto mb-4" size={64} />
          <p className="text-gray-600 font-medium">Chargement des assurés...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ✅ CSS GLOBAL POUR OPTIONS ARRONDIES */}
      <style dangerouslySetInnerHTML={{
        __html: `
          select option {
            padding: 10px 14px !important;
            margin: 4px 8px !important;
            border-radius: 12px !important;
            font-weight: 600 !important;
            transition: all 0.2s ease !important;
            background: #ffffff !important;
          }
          
          select option:hover {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
            color: white !important;
            transform: scale(1.01) !important;
          }
          
          select option:checked {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
            color: white !important;
            font-weight: 700 !important;
          }
        `
      }} />

      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-white py-4">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* ========== HEADER AVEC LOGO AGRANDI ========== */}
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
                  Gestion des Assurés
                </h1>
                <p className="text-sm text-gray-600 font-medium">Assurance ARO Madagascar</p>
              </div>
            </div>

            <button
              onClick={loadData}
              disabled={isLoading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold transition-colors flex items-center gap-2 shadow-lg"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </motion.div>

          {/* ========== STATISTIQUES (TOUTES CLIQUABLES) ========== */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {/* CARTE TOTAL - CLIQUABLE */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onClick={handleShowAll}
                className="bg-white rounded-3xl p-4 shadow-md border-2 border-blue-200 hover:shadow-xl hover:border-blue-400 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-500 uppercase">Total</span>
                </div>
                <p className="text-4xl font-bold text-blue-900">{stats.total || 0}</p>
                <p className="text-[10px] text-blue-600 mt-1">Cliquez pour tout voir</p>
              </motion.div>

              {/* CARTE ACTIFS - CLIQUABLE */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => handleFilterByStatut('actif')}
                className="bg-white rounded-3xl p-4 shadow-md border-2 border-emerald-300 hover:shadow-xl hover:border-emerald-500 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck className="w-6 h-6 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-600 uppercase">Actifs</span>
                </div>
                <p className="text-4xl font-bold text-emerald-700">{stats.actifs || 0}</p>
                <p className="text-[10px] text-emerald-600 mt-1">Cliquez pour filtrer</p>
              </motion.div>

              {/* CARTE RÉSILIÉS - CLIQUABLE */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => handleFilterByStatut('resilie')}
                className="bg-white rounded-3xl p-4 shadow-md border-2 border-red-300 hover:shadow-xl hover:border-red-500 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <UserX className="w-6 h-6 text-red-600" />
                  <span className="text-xs font-semibold text-red-600 uppercase">Résiliés</span>
                </div>
                <p className="text-4xl font-bold text-red-700">{stats.resilies || 0}</p>
                <p className="text-[10px] text-red-600 mt-1">Cliquez pour filtrer</p>
              </motion.div>

              {/* CARTE NOUVEAUX CE MOIS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-3xl p-4 shadow-md border-2 border-purple-300 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-6 h-6 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-600 uppercase">Nouveaux</span>
                </div>
                <p className="text-4xl font-bold text-purple-700">{stats.nouveaux_ce_mois || stats.nouveaux || 0}</p>
                <p className="text-[10px] text-purple-600 mt-1">Ce mois</p>
              </motion.div>
            </div>
          )}

          {/* ========== FILTRES ========== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl p-5 shadow-lg border-2 border-emerald-200 mb-6"
          >
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex-1 min-w-[280px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email, téléphone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <select value={filters.statut} onChange={(e) => handleFilterChange('statut', e.target.value)}
                  className="px-3 py-2 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 outline-none bg-white text-sm font-medium">
                  <option value="">Tous les statuts</option>
                  <option value="actif">✅ Actif</option>
                  <option value="suspendu">⏸️ Suspendu</option>
                  <option value="resilie">❌ Résilié</option>
                  <option value="expire">⏳ Expiré</option>
                </select>

                <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="px-3 py-2 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 outline-none bg-white text-sm font-medium">
                  <option value="">Tous les types</option>
                  <option value="titulaire">👤 Titulaire</option>
                  <option value="ayant_droit">👥 Ayant droit</option>
                </select>

                <select value={filters.agence} onChange={(e) => handleFilterChange('agence', e.target.value)}
                  className="px-3 py-2 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 outline-none bg-white text-sm font-medium">
                  <option value="">Toutes les agences</option>
                  {AGENCES_ARO.map(agence => (
                    <option key={agence} value={agence}>{agence}</option>
                  ))}
                </select>

                <button onClick={handleExport}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center gap-2 transition font-semibold text-sm shadow-lg">
                  <Download size={16} />
                  Exporter
                </button>

                <button onClick={handleCreate}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl flex items-center gap-2 transition font-semibold text-sm shadow-lg">
                  <Plus size={16} />
                  Nouvel Assuré
                </button>
              </div>
            </div>
          </motion.div>

          {/* ========== TABLEAU ========== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-emerald-200"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-emerald-600 to-teal-600 border-b-2 border-emerald-700">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">Photo</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">Nom Complet</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">N° Dossier</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">Contact</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase min-w-[140px]">Type</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">Statut</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {assures.map((assure, index) => (
                    <AssureRow
                      key={assure.id}
                      assure={assure}
                      index={index}
                      onEdit={() => handleEdit(assure)}
                      onDelete={() => {
                        setSelectedAssure(assure);
                        setShowDeleteModal(true);
                      }}
                      onPhoto={() => {
                        setSelectedAssure(assure);
                        setShowPhotoModal(true);
                      }}
                      onDoubleClickPhoto={() => {
                        setSelectedAssureForFullPhoto(assure);
                        setShowFullPhotoModal(true);
                      }}
                      onViewDetails={() => handleViewDetails(assure)} // ✅ NOUVEAU
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* ========== PAGINATION ========== */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t-2 border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="text-sm text-gray-600 font-medium">
                  {((currentPage - 1) * 10) + 1} à {Math.min(currentPage * 10, total)} sur {total}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                    className="px-3 py-1.5 border-2 border-gray-300 rounded-2xl hover:bg-white hover:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm font-medium">
                    <ChevronLeft size={16} />
                    Précédent
                  </button>
                  <span className="px-3 py-1.5 border-2 border-emerald-500 rounded-2xl bg-emerald-50 text-emerald-700 font-bold text-sm">
                    Page {currentPage} / {totalPages}
                  </span>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border-2 border-gray-300 rounded-2xl hover:bg-white hover:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm font-medium">
                    Suivant
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ========== MODALS ========== */}
      
      {/* ═══════════════════════════════════════════════════════════════
       * 🆕 NOUVELLE MODAL : VOIR TOUS LES DÉTAILS DE L'ASSURÉ
       * ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showDetailsModal && selectedAssure && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetailsModal(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* En-tête */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                    <Eye className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Détails de l'assuré
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                      Toutes les informations du profil
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowDetailsModal(false)} className="p-2.5 hover:bg-white/20 rounded-xl transition text-white">
                  <X size={24} />
                </button>
              </div>

              {/* Contenu avec scroll */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Photo de profil en haut */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <img
                      src={selectedAssure.photo ? `${(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '')}${selectedAssure.photo}` : '/AROO.png'}
                      alt={selectedAssure.nom_complet}
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                      onError={(e) => { e.target.src = '/AROO.png'; }}
                    />
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2 shadow-lg">
                      <Users size={20} />
                    </div>
                  </div>
                </div>

                {/* Identifiants */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-blue-100">
                    <div className="bg-blue-100 p-2.5 rounded-xl">
                      <CreditCard className="text-blue-600" size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Identifiants</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200">
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">N° Dossier</label>
                      <p className="text-base font-bold text-gray-900">{selectedAssure.numero_dossier || '-'}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200">
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">N° Police</label>
                      <p className="text-base font-bold text-gray-900">{selectedAssure.numero_police || '-'}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200">
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">N° Compte</label>
                      <p className="text-base font-bold text-gray-900">{selectedAssure.numero_compte || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Informations Personnelles */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-emerald-100">
                    <div className="bg-emerald-100 p-2.5 rounded-xl">
                      <Users className="text-emerald-600" size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Informations Personnelles</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200">
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase flex items-center gap-1">
                        <Users size={12} /> Nom Complet
                      </label>
                      <p className="text-base font-bold text-gray-900">{selectedAssure.nom_complet || '-'}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200">
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase flex items-center gap-1">
                        <Cake size={12} /> Date de Naissance
                      </label>
                      <p className="text-base font-bold text-gray-900">
                        {selectedAssure.date_naissance ? new Date(selectedAssure.date_naissance).toLocaleDateString('fr-FR') : '-'}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200 md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase flex items-center gap-1">
                        <MapPin size={12} /> Adresse
                      </label>
                      <p className="text-base font-bold text-gray-900">{selectedAssure.adresse || '-'}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200">
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase flex items-center gap-1">
                        <Phone size={12} /> Téléphone
                      </label>
                      <p className="text-base font-bold text-gray-900">{selectedAssure.telephone || '-'}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200">
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase flex items-center gap-1">
                        <Mail size={12} /> Email
                      </label>
                      <p className="text-base font-bold text-gray-900">{selectedAssure.email || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Type d'Assuré */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-purple-100">
                    <div className="bg-purple-100 p-2.5 rounded-xl">
                      <UserCheck className="text-purple-600" size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Type d'Assuré</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200">
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Type</label>
                      <span className={`inline-flex px-3 py-1.5 text-sm font-bold rounded-full border-2 ${selectedAssure.type_assure === 'titulaire' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-purple-100 text-purple-700 border-purple-300'}`}>
                        {selectedAssure.type_assure === 'titulaire' ? '👤 Titulaire' : '👥 Ayant droit'}
                      </span>
                    </div>

                    {selectedAssure.type_assure === 'ayant_droit' && (
                      <>
                        <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200">
                          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Titulaire</label>
                          <p className="text-base font-bold text-gray-900">
                            {titulaires.find(t => t.id === selectedAssure.titulaire_id)?.nom_complet || '-'}
                          </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200">
                          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Parenté</label>
                          <p className="text-base font-bold text-gray-900 capitalize">{selectedAssure.parente_avec_titulaire || '-'}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Informations Contrat */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-orange-100">
                    <div className="bg-orange-100 p-2.5 rounded-xl">
                      <Building2 className="text-orange-600" size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Informations Contrat</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200">
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase flex items-center gap-1">
                        <Building2 size={12} /> Agence
                      </label>
                      <p className="text-base font-bold text-gray-900">{selectedAssure.agence || '-'}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200">
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase flex items-center gap-1">
                        <AlertCircle size={12} /> Statut Contrat
                      </label>
                      <span className={`inline-flex px-3 py-1.5 text-sm font-bold rounded-full border-2 ${
                        selectedAssure.statut_contrat === 'actif' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                        selectedAssure.statut_contrat === 'suspendu' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                        selectedAssure.statut_contrat === 'resilie' ? 'bg-red-100 text-red-700 border-red-300' :
                        'bg-gray-100 text-gray-700 border-gray-300'
                      }`}>
                        {selectedAssure.statut_contrat?.toUpperCase() || '-'}
                      </span>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200">
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase flex items-center gap-1">
                        <Calendar size={12} /> Date Début Contrat
                      </label>
                      <p className="text-base font-bold text-gray-900">
                        {selectedAssure.date_debut_contrat ? new Date(selectedAssure.date_debut_contrat).toLocaleDateString('fr-FR') : '-'}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200">
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase flex items-center gap-1">
                        <Calendar size={12} /> Date Fin Contrat
                      </label>
                      <p className="text-base font-bold text-gray-900">
                        {selectedAssure.date_fin_contrat ? new Date(selectedAssure.date_fin_contrat).toLocaleDateString('fr-FR') : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bouton Fermer */}
                <div className="pt-6 border-t-2 border-gray-100">
                  <button 
                    onClick={() => setShowDetailsModal(false)}
                    className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-2xl font-bold transition text-sm shadow-lg"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL CRÉATION/MODIFICATION */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* En-tête */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                    {isEditMode ? <Edit2 className="text-white" size={24} /> : <Plus className="text-white" size={24} />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {isEditMode ? 'Modifier l\'assuré' : 'Nouvel assuré'}
                    </h2>
                    <p className="text-emerald-100 text-sm mt-1">
                      {isEditMode ? 'Mettre à jour les informations' : 'Créer un nouveau profil d\'assuré'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2.5 hover:bg-white/20 rounded-xl transition text-white">
                  <X size={24} />
                </button>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Identifiants */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-emerald-100">
                    <div className="bg-emerald-100 p-2.5 rounded-xl">
                      <CreditCard className="text-emerald-600" size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Identifiants</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <FileText size={14} className="text-gray-500" />
                        N° Dossier <span className="text-red-500">*</span>
                      </label>
                      <input type="text" value={formData.numero_dossier}
                        onChange={(e) => setFormData({ ...formData, numero_dossier: e.target.value })}
                        disabled={isEditMode} required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none disabled:bg-gray-50 text-sm font-medium transition"
                        placeholder="DOS-XXX" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Shield size={14} className="text-gray-500" />
                        N° Police <span className="text-red-500">*</span>
                      </label>
                      <input type="text" value={formData.numero_police}
                        onChange={(e) => setFormData({ ...formData, numero_police: e.target.value })}
                        disabled={isEditMode} required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none disabled:bg-gray-50 text-sm font-medium transition"
                        placeholder="POL-XXX" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <FileText size={14} className="text-gray-500" />
                        N° Compte <span className="text-red-500">*</span>
                      </label>
                      <input type="text" value={formData.numero_compte}
                        onChange={(e) => setFormData({ ...formData, numero_compte: e.target.value })}
                        disabled={isEditMode} required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none disabled:bg-gray-50 text-sm font-medium transition"
                        placeholder="CPT-XXX" />
                    </div>
                  </div>
                </div>

                {/* Informations Personnelles */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-blue-100">
                    <div className="bg-blue-100 p-2.5 rounded-xl">
                      <Users className="text-blue-600" size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Informations Personnelles</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Nom Complet <span className="text-red-500">*</span>
                      </label>
                      <input type="text" value={formData.nom_complet}
                        onChange={(e) => setFormData({ ...formData, nom_complet: e.target.value })}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-sm font-medium transition"
                        placeholder="Nom complet de l'assuré" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <MapPin size={14} className="text-gray-500" />
                        Adresse <span className="text-red-500">*</span>
                      </label>
                      <textarea value={formData.adresse}
                        onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                        required rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-sm font-medium transition resize-none"
                        placeholder="Adresse complète" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <Phone size={14} className="text-gray-500" />
                          Téléphone
                        </label>
                        <input type="tel" value={formData.telephone}
                          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-sm font-medium transition"
                          placeholder="+261 XX XX XXX XX" />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <Mail size={14} className="text-gray-500" />
                          Email
                        </label>
                        <input type="email" value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-sm font-medium transition"
                          placeholder="email@example.com" />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <Cake size={14} className="text-gray-500" />
                          Date de Naissance
                        </label>
                        <input type="date" value={formData.date_naissance}
                          onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-sm font-medium transition" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Type d'Assuré */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-purple-100">
                    <div className="bg-purple-100 p-2.5 rounded-xl">
                      <UserCheck className="text-purple-600" size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Type d'Assuré</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Type <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select value={formData.type_assure}
                          onChange={(e) => setFormData({ ...formData, type_assure: e.target.value })}
                          required
                          className="w-full px-4 py-3.5 pr-10 border-3 border-purple-200 rounded-[20px] focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none bg-gradient-to-r from-white to-purple-50 text-sm font-bold transition appearance-none cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-purple-400"
                          style={{ boxShadow: '0 4px 12px rgba(147, 51, 234, 0.1)' }}>
                          <option value="titulaire">👤 Titulaire</option>
                          <option value="ayant_droit">👥 Ayant droit</option>
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 rotate-90 pointer-events-none" size={18} />
                      </div>
                    </div>

                    {formData.type_assure === 'ayant_droit' && (
                      <>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Titulaire <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select value={formData.titulaire_id}
                              onChange={(e) => setFormData({ ...formData, titulaire_id: e.target.value })}
                              required
                              className="w-full px-4 py-3.5 pr-10 border-3 border-purple-200 rounded-[20px] focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none bg-gradient-to-r from-white to-purple-50 text-sm font-bold transition appearance-none cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-purple-400"
                              style={{ boxShadow: '0 4px 12px rgba(147, 51, 234, 0.1)' }}>
                              <option value="">Sélectionner un titulaire</option>
                              {titulaires.map(t => (
                                <option key={t.id} value={t.id}>
                                  {t.nom_complet} ({t.numero_dossier})
                                </option>
                              ))}
                            </select>
                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 rotate-90 pointer-events-none" size={18} />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Parenté <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select value={formData.parente_avec_titulaire}
                              onChange={(e) => setFormData({ ...formData, parente_avec_titulaire: e.target.value })}
                              required
                              className="w-full px-4 py-3.5 pr-10 border-3 border-purple-200 rounded-[20px] focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none bg-gradient-to-r from-white to-purple-50 text-sm font-bold transition appearance-none cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-purple-400"
                              style={{ boxShadow: '0 4px 12px rgba(147, 51, 234, 0.1)' }}>
                              <option value="">Sélectionner</option>
                              <option value="conjoint">💍 Conjoint(e)</option>
                              <option value="enfant">👶 Enfant</option>
                              <option value="ascendant">👴 Ascendant</option>
                              <option value="autre">👤 Autre</option>
                            </select>
                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 rotate-90 pointer-events-none" size={18} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Informations Contrat */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-orange-100">
                    <div className="bg-orange-100 p-2.5 rounded-xl">
                      <Building2 className="text-orange-600" size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Informations Contrat</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Building2 size={14} className="text-gray-500" />
                        Agence <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select value={formData.agence}
                          onChange={(e) => setFormData({ ...formData, agence: e.target.value })}
                          required
                          className="w-full px-4 py-3.5 pr-10 border-3 border-orange-200 rounded-[20px] focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none bg-gradient-to-r from-white to-orange-50 text-sm font-bold transition appearance-none cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-orange-400"
                          style={{ boxShadow: '0 4px 12px rgba(249, 115, 22, 0.1)' }}>
                          <option value="">Sélectionner une agence</option>
                          {AGENCES_ARO.map(agence => (
                            <option key={agence} value={agence}>{agence}</option>
                          ))}
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 rotate-90 pointer-events-none" size={18} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <AlertCircle size={14} className="text-gray-500" />
                        Statut Contrat <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select value={formData.statut_contrat}
                          onChange={(e) => setFormData({ ...formData, statut_contrat: e.target.value })}
                          required
                          className="w-full px-4 py-3.5 pr-10 border-3 border-orange-200 rounded-[20px] focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none bg-gradient-to-r from-white to-orange-50 text-sm font-bold transition appearance-none cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-orange-400"
                          style={{ boxShadow: '0 4px 12px rgba(249, 115, 22, 0.1)' }}>
                          <option value="actif">✅ Actif</option>
                          <option value="suspendu">⏸️ Suspendu</option>
                          <option value="resilie">❌ Résilié</option>
                          <option value="expire">⏳ Expiré</option>
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 rotate-90 pointer-events-none" size={18} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar size={14} className="text-gray-500" />
                        Date Début Contrat <span className="text-red-500">*</span>
                      </label>
                      <input type="date" value={formData.date_debut_contrat}
                        onChange={(e) => setFormData({ ...formData, date_debut_contrat: e.target.value })}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-sm font-medium transition" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar size={14} className="text-gray-500" />
                        Date Fin Contrat
                      </label>
                      <input type="date" value={formData.date_fin_contrat}
                        onChange={(e) => setFormData({ ...formData, date_fin_contrat: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-sm font-medium transition" />
                    </div>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold transition text-sm">
                    Annuler
                  </button>
                  <button type="submit" disabled={isSubmitting}
                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-bold transition flex items-center justify-center gap-2 text-sm shadow-lg">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        {isEditMode ? '💾 Mettre à jour' : '✨ Créer l\'assuré'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL SUPPRESSION */}
      <AnimatePresence>
        {showDeleteModal && selectedAssure && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteModal(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Trash2 className="text-red-600" size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Supprimer l'assuré</h3>
              </div>

              <p className="text-gray-600 mb-6 text-sm">
                Êtes-vous sûr de vouloir supprimer <span className="font-bold">{selectedAssure.nom_complet}</span> ?
                Cette action est irréversible.
              </p>

              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition text-sm">
                  Annuler
                </button>
                <button onClick={handleDelete} disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Suppression...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Supprimer
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL PHOTO */}
      <AnimatePresence>
        {showPhotoModal && selectedAssure && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPhotoModal(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <Camera className="text-emerald-600" size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Photo de profil</h3>
              </div>

              <div className="flex flex-col items-center gap-4">
                <img
                  src={selectedAssure.photo ? `${(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '')}${selectedAssure.photo}` : '/AROO.png'}
                  alt={selectedAssure.nom_complet}
                  className="w-36 h-36 rounded-full object-cover border-4 border-gray-200"
                  onError={(e) => { e.target.src = '/AROO.png'; }}
                />

                <label className="w-full px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-semibold transition cursor-pointer flex items-center justify-center gap-2 text-sm">
                  {isUploading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Upload...
                    </>
                  ) : (
                    <>
                      <Camera size={16} />
                      Changer la photo
                    </>
                  )}
                  <input type="file" accept="image/*,image/heic,image/heif"
                    onChange={handlePhotoUpload} disabled={isUploading} className="hidden" />
                </label>
              </div>

              <button onClick={() => setShowPhotoModal(false)}
                className="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition text-sm">
                Fermer
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL PHOTO PLEIN ÉCRAN */}
      <AnimatePresence>
        {showFullPhotoModal && selectedAssureForFullPhoto && (
          <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 sm:p-8" onClick={() => setShowFullPhotoModal(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative w-full max-w-3xl flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowFullPhotoModal(false)}
                className="absolute -top-12 right-0 p-2.5 bg-white rounded-full hover:bg-gray-100 transition shadow-2xl z-10">
                <X size={24} className="text-gray-700" />
              </button>

              <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white w-full max-w-lg">
                {selectedAssureForFullPhoto.photo ? (
                  <img
                    src={`${(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '')}${selectedAssureForFullPhoto.photo}`}
                    alt={selectedAssureForFullPhoto.nom_complet}
                    className="w-full h-auto max-h-[60vh] object-contain"
                    onError={(e) => { e.target.src = '/AROO.png'; }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-96 bg-gray-100">
                    <Users className="text-gray-400" size={100} />
                  </div>
                )}

                <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center">
                  <p className="font-bold text-2xl mb-2">{selectedAssureForFullPhoto.nom_complet}</p>
                  <p className="text-emerald-100 text-lg font-medium">{selectedAssureForFullPhoto.numero_dossier}</p>
                  <p className="text-emerald-200 mt-1">{selectedAssureForFullPhoto.agence}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🎨 COMPOSANT : Ligne de tableau avec animation
// ═══════════════════════════════════════════════════════════════
function AssureRow({ assure, index, onEdit, onDelete, onPhoto, onDoubleClickPhoto, onViewDetails }) {
  const [clickCount, setClickCount] = useState(0);
  const clickTimer = useRef(null);

  const photoUrl = assure.photo ? `${(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '')}${assure.photo}` : '/AROO.png';

  const statutColors = {
    actif: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    suspendu: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    resilie: 'bg-red-100 text-red-700 border-red-300',
    expire: 'bg-gray-100 text-gray-700 border-gray-300'
  };

  const handlePhotoClick = () => {
    setClickCount(prev => prev + 1);
    
    if (clickCount === 0) {
      clickTimer.current = setTimeout(() => {
        onPhoto();
        setClickCount(0);
      }, 300);
    } else {
      clearTimeout(clickTimer.current);
      onDoubleClickPhoto();
      setClickCount(0);
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-emerald-50 transition-all"
    >
      <td className="px-4 py-3">
        <img src={photoUrl} alt={assure.nom_complet}
          className="w-14 h-14 rounded-full object-cover border-2 border-gray-300 cursor-pointer hover:scale-110 hover:border-emerald-500 transition-all shadow-md"
          onClick={handlePhotoClick} onError={(e) => { e.target.src = '/AROO.png'; }}
          title="Cliquez → Changer | Double-clic → Agrandir" />
      </td>
      <td className="px-4 py-3">
        <div>
          <p className="font-bold text-gray-900">{assure.nom_complet}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <Building2 size={12} />
            {assure.agence}
          </p>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
          {assure.numero_dossier}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="text-xs">
          <p className="text-gray-900 flex items-center gap-1">
            <Mail size={12} className="text-gray-500" />
            {assure.email || '-'}
          </p>
          <p className="text-gray-600 flex items-center gap-1 mt-1">
            <Phone size={12} className="text-gray-500" />
            {assure.telephone || '-'}
          </p>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border whitespace-nowrap ${assure.type_assure === 'titulaire' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-purple-100 text-purple-700 border-purple-300'}`}>
          {assure.type_assure === 'titulaire' ? '👤 Titulaire' : '👥 Ayant droit'}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${statutColors[assure.statut_contrat]}`}>
          {assure.statut_contrat.toUpperCase()}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          {/* ✅ NOUVEAU BOUTON "Voir Détails" */}
          <button onClick={onViewDetails}
            className="px-2.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition flex items-center gap-1 font-medium text-xs shadow-md hover:shadow-lg">
            <Eye size={14} />
            Détails
          </button>
          <button onClick={onEdit}
            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-1 font-medium text-xs">
            <Edit2 size={14} />
            Modifier
          </button>
          <button onClick={onDelete}
            className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center gap-1 font-medium text-xs">
            <Trash2 size={14} />
            Supprimer
          </button>
        </div>
      </td>
    </motion.tr>
  );
}
