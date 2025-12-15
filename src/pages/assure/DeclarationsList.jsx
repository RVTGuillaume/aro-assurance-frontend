/**
 * =====================================
 * 📋 LISTE DES DÉCLARATIONS - ASSURÉ
 * ARO Assurance Madagascar
 * =====================================
 * ✅ Navigation Voir → DeclarationDetails
 * ✅ Navigation Modifier → EditDeclaration
 * ✅ Cartes avec effet de flottance au survol
 * ✅ Grille responsive (1/2/3 colonnes)
 * ✅ Animations Framer Motion optimisées
 * ✅ Date de création avec heures:minutes:secondes
 * ✅ Valeurs réelles depuis la base de données
 * ✅ ACTUALISATION EN TEMPS RÉEL DES STATISTIQUES
 * ✅ POP-UP MODERNE DE SUPPRESSION GLASSMORPHISM
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import declarationApi from '@/services/declarationApi';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  Loader,
  TrendingUp,
  Activity,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

// ========== DESIGN SYSTEM ARO ==========
const COLORS = {
  en_attente: 'amber',
  en_traitement: 'blue',
  validee: 'emerald',
  refusee: 'red',
  complements_requis: 'orange',
};

const TYPE_COLORS = [
  '#006B5B', // Vert foncé ARO
  '#26A69A', // Turquoise
  '#0891B2', // Cyan
  '#059669', // Émeraude
  '#10B981', // Vert clair
];

// ========== TYPES D'ASSURANCE SANTÉ ==========
const TYPES_ASSURANCE = [
  { value: 'accident', label: 'Accident', color: TYPE_COLORS[0] },
  { value: 'maladie', label: 'Maladie / Ophtalmologie', color: TYPE_COLORS[1] },
  { value: 'soins_dentaires', label: 'Soins et Chirurgie Dentaires', color: TYPE_COLORS[2] },
  { value: 'hospitalisation', label: 'Hospitalisation', color: TYPE_COLORS[3] },
];

// ========== VARIANTS ANIMATIONS ==========
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
  hover: {
    y: -5,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: { duration: 0.2 },
  },
};

const card3DVariants = {
  rest: { scale: 1, rotateX: 0, rotateY: 0 },
  hover: {
    scale: 1.02,
    rotateX: -2,
    rotateY: 2,
    y: -5,
    transition: { duration: 0.3 },
  },
};

const DeclarationsList = () => {
  const navigate = useNavigate();
  const [declarations, setDeclarations] = useState([]);
  const [filteredDeclarations, setFilteredDeclarations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  // ✅ État pour le pop-up de suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [declarationToDelete, setDeclarationToDelete] = useState(null);

  // Stats calculées depuis la BDD
  const [stats, setStats] = useState({
    total: 0,
    en_attente: 0,
    en_traitement: 0,
    validee: 0,
    refusee: 0,
    complements_requis: 0,
  });

  // Filtres
  const [filters, setFilters] = useState({
    search: '',
    statut: '',
    type_sinistre: '',
  });

  // ========== 🕐 FONCTION DE FORMATAGE DATE AVEC HEURES:MINUTES:SECONDES ==========
  const formatDateTimeFull = (dateString) => {
    if (!dateString) return 'Date inconnue';

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return 'Date invalide';

    return date.toLocaleString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Indian/Antananarivo',
    });
  };

  // ========== 📅 FONCTION DE FORMATAGE DATE COURTE ==========
  const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';

    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // ========== ✅ FONCTION DE CALCUL DES STATISTIQUES (RÉUTILISABLE) ==========
  const calculateStats = (data) => {
    return {
      total: data.length,
      en_attente: data.filter((d) => d.statut_declaration === 'en_attente').length,
      en_traitement: data.filter((d) => d.statut_declaration === 'en_traitement').length,
      validee: data.filter((d) => d.statut_declaration === 'validee').length,
      refusee: data.filter((d) => d.statut_declaration === 'refusee').length,
      complements_requis: data.filter((d) => d.statut_declaration === 'complements_requis')
        .length,
    };
  };

  // ========== CHARGEMENT INITIAL AUTOMATIQUE ==========
  useEffect(() => {
    fetchDeclarations();
  }, []);

  // ========== ✅ ACTUALISATION AUTOMATIQUE DES STATS QUAND DECLARATIONS CHANGE ==========
  useEffect(() => {
    const newStats = calculateStats(declarations);
    setStats(newStats);
    console.log('📊 Statistiques actualisées:', newStats);
  }, [declarations]);

  // ========== FONCTION D'ACTUALISATION PRINCIPALE ==========
  const fetchDeclarations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await declarationApi.getMyDeclarations();

      if (response.success) {
        const data = response.data || [];
        setDeclarations(data);
      } else {
        setError('Erreur lors du chargement des données');
      }
    } catch (error) {
      console.error('❌ Erreur chargement déclarations:', error);
      setError(error.message || 'Erreur réseau');
      setDeclarations([]);
    } finally {
      setLoading(false);
    }
  };

  // ========== APPLIQUER FILTRES ==========
  useEffect(() => {
    applyFilters();
  }, [filters, declarations]);

  const applyFilters = () => {
    let filtered = [...declarations];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.numero_declaration?.toLowerCase().includes(searchLower) ||
          d.personne_soignee_nom?.toLowerCase().includes(searchLower) ||
          d.type_sinistre?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.statut) {
      filtered = filtered.filter((d) => d.statut_declaration === filters.statut);
    }

    if (filters.type_sinistre) {
      filtered = filtered.filter((d) => d.type_sinistre === filters.type_sinistre);
    }

    setFilteredDeclarations(filtered);
  };

  // ========== ACTUALISATION MANUELLE ==========
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDeclarations();
    setTimeout(() => setRefreshing(false), 500);
  };

  // ========== ✅ OUVRIR LE POP-UP DE SUPPRESSION ==========
  const handleDeleteClick = (numeroDeclaration) => {
    setDeclarationToDelete(numeroDeclaration);
    setShowDeleteModal(true);
  };

  // ========== ✅ CONFIRMER LA SUPPRESSION ==========
  const handleConfirmDelete = async () => {
    if (!declarationToDelete) return;

    setDeletingId(declarationToDelete);
    try {
      const response = await declarationApi.deleteDeclaration(declarationToDelete);
      if (response.success) {
        // ✅ MISE À JOUR IMMÉDIATE DE L'ÉTAT LOCAL
        setDeclarations((prev) => {
          const updated = prev.filter((d) => d.numero_declaration !== declarationToDelete);
          console.log('🗑️ Déclaration supprimée. Nouvelles données:', updated);
          return updated;
        });

        // Fermer le modal
        setShowDeleteModal(false);
        setDeclarationToDelete(null);
      } else {
        alert('❌ ' + (response.message || 'Erreur lors de la suppression'));
      }
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
      alert('❌ Erreur: ' + (error.response?.data?.message || 'Erreur serveur'));
    } finally {
      setDeletingId(null);
    }
  };

  // ========== ✅ ANNULER LA SUPPRESSION ==========
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeclarationToDelete(null);
  };

  // ========== ACTIONS DE NAVIGATION ==========
  const handleView = (numeroDeclaration) => {
    console.log('🔹 Navigation vers détails:', numeroDeclaration);
    navigate(`/assure/declarations/${numeroDeclaration}`);
  };

  const handleEdit = (numeroDeclaration) => {
    console.log('🔹 Navigation vers modification:', numeroDeclaration);
    navigate(`/assure/declarations/edit/${numeroDeclaration}`);
  };

  // ========== STYLES SELON STATUT ==========
  const getStatutConfig = (statut) => {
    const color = COLORS[statut] || 'gray';

    const icons = {
      en_attente: Clock,
      en_traitement: Activity,
      validee: CheckCircle,
      refusee: XCircle,
      complements_requis: AlertCircle,
    };

    const labels = {
      en_attente: 'En attente',
      en_traitement: 'En traitement',
      validee: 'Validée',
      refusee: 'Refusée',
      complements_requis: 'Compléments requis',
    };

    return {
      color,
      icon: icons[statut] || Package,
      label: labels[statut] || statut,
    };
  };

  // ========== AFFICHAGE LOADER ==========
  if (loading) {
    return (
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
            rotate: { duration: 1, repeat: Infinity, ease: 'linear' },
          }}
          className="w-20 h-20 border-4 border-gray-300 border-t-[#006B5B] rounded-full"
        />
      </motion.div>
    );
  }

  // ========== AFFICHAGE ERREUR ==========
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
        >
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Erreur</h3>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchDeclarations}
            className="w-full px-6 py-3 bg-[#006B5B] text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
          >
            Réessayer
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ========== HEADER ========== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.img
                src="/AROO.png"
                alt="ARO Assurance"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="h-24 w-auto object-contain"
                onError={(e) => {
                  e.target.src = '/AROO.jpg';
                }}
              />
              <div>
                <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-gray-900 via-[#006B5B] to-gray-900 bg-clip-text text-transparent">
                  Mes Déclarations
                </h1>
                <p className="text-gray-600 text-sm mt-1">Gérez vos déclarations de sinistre</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2 bg-[#006B5B] text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {refreshing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <RefreshCw className="w-5 h-5" />
                    </motion.div>
                    Actualisation...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Actualiser
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/assure/declarations/new')}
                className="px-6 py-2 bg-gradient-to-r from-[#006B5B] to-green-400 text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-semibold"
              >
                <Plus className="w-5 h-5" />
                Nouvelle Déclaration
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ========== ✅ STATISTIQUES AVEC ACTUALISATION TEMPS RÉEL ========== */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { key: 'total', label: 'Total', icon: FileText, color: 'gray', value: stats.total },
            {
              key: 'en_attente',
              label: 'En attente',
              icon: Clock,
              color: 'amber',
              value: stats.en_attente,
            },
            {
              key: 'en_traitement',
              label: 'En traitement',
              icon: Activity,
              color: 'blue',
              value: stats.en_traitement,
            },
            {
              key: 'validee',
              label: 'Validées',
              icon: CheckCircle,
              color: 'emerald',
              value: stats.validee,
            },
            { key: 'refusee', label: 'Refusées', icon: XCircle, color: 'red', value: stats.refusee },
          ].map((item, index) => (
            <motion.div
              key={item.key}
              custom={index}
              variants={card3DVariants}
              initial="rest"
              whileHover="hover"
              className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden group"
              onClick={() => setFilters({ ...filters, statut: item.key === 'total' ? '' : item.key })}
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full" />

              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-gray-600 text-sm mb-2 font-medium">{item.label}</p>
                  <motion.p
                    key={`${item.key}-${item.value}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl font-bold text-gray-900"
                  >
                    {item.value}
                  </motion.p>
                </div>

                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-14 h-14 bg-${item.color}-100 rounded-xl flex items-center justify-center shadow-inner`}
                >
                  <item.icon className={`w-7 h-7 text-${item.color}-600`} />
                </motion.div>
              </div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#006B5B] to-green-400 origin-left"
              />
            </motion.div>
          ))}
        </div>

        {/* ========== FILTRES ========== */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#006B5B] focus:outline-none transition-colors"
              />
            </div>

            <select
              value={filters.statut}
              onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#006B5B] focus:outline-none transition-colors"
            >
              <option value="">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="en_traitement">En traitement</option>
              <option value="validee">Validée</option>
              <option value="refusee">Refusée</option>
              <option value="complements_requis">Compléments requis</option>
            </select>

            <select
              value={filters.type_sinistre}
              onChange={(e) => setFilters({ ...filters, type_sinistre: e.target.value })}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#006B5B] focus:outline-none transition-colors"
            >
              <option value="">Tous les types</option>
              {TYPES_ASSURANCE.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* ========== LISTE DES DÉCLARATIONS AVEC DATE ========== */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#006B5B]" />
                Déclarations ({filteredDeclarations.length})
              </h3>
            </div>

            {filteredDeclarations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {filters.search || filters.statut || filters.type_sinistre
                    ? 'Aucun résultat ne correspond à vos critères'
                    : "Vous n'avez pas encore créé de déclaration"}
                </p>
                {!filters.search && !filters.statut && !filters.type_sinistre && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/assure/declarations/new')}
                    className="mt-6 px-6 py-3 bg-[#006B5B] text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
                  >
                    Créer ma première déclaration
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {filteredDeclarations.map((declaration, i) => {
                    const statutConfig = getStatutConfig(declaration.statut_declaration);
                    const StatutIcon = statutConfig.icon;

                    return (
                      <motion.div
                        key={declaration.numero_declaration}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        whileHover="hover"
                        variants={cardVariants}
                        className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                      >
                        <div className="p-6 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-900 mb-2">
                                {declaration.numero_declaration || 'INCONNU'}
                              </h4>
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border-2 bg-${statutConfig.color}-100 text-${statutConfig.color}-800 border-${statutConfig.color}-300`}
                              >
                                <StatutIcon className="w-4 h-4" />
                                {statutConfig.label}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-700 font-medium">
                            {declaration.type_sinistre || 'Type non spécifié'}
                          </p>

                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-start gap-2">
                              <Calendar className="w-4 h-4 text-[#006B5B] mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-500 mb-1">
                                  📅 Date de création
                                </p>
                                <p className="text-sm text-gray-900 font-semibold leading-tight break-words">
                                  {formatDateShort(
                                    declaration.date_declaration || declaration.created_at
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                            <motion.button
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleView(declaration.numero_declaration);
                              }}
                              className="flex-1 p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                              title="Voir les détails"
                            >
                              <Eye className="w-5 h-5" />
                              <span className="text-sm font-medium">Voir</span>
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(declaration.numero_declaration);
                              }}
                              className="flex-1 p-3 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 transition-colors flex items-center justify-center gap-2"
                              title="Modifier la déclaration"
                            >
                              <Edit2 className="w-5 h-5" />
                              <span className="text-sm font-medium">Modifier</span>
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(declaration.numero_declaration);
                              }}
                              disabled={deletingId === declaration.numero_declaration}
                              className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center justify-center"
                              title="Supprimer"
                            >
                              {deletingId === declaration.numero_declaration ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                  <Loader className="w-5 h-5" />
                                </motion.div>
                              ) : (
                                <Trash2 className="w-5 h-5" />
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ========== ✅✅✅ POP-UP MODERNE DE SUPPRESSION GLASSMORPHISM ROUGE ✅✅✅ ========== */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={handleCancelDelete}
          >
            {/* ✅ ARRIÈRE-PLAN FLOU */}
            <motion.div
              initial={{ backdropFilter: 'blur(0px)' }}
              animate={{ backdropFilter: 'blur(12px)' }}
              exit={{ backdropFilter: 'blur(0px)' }}
              className="absolute inset-0 bg-black/40"
            />

            {/* ✅ MODAL GLASSMORPHISM ROUGE */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full rounded-3xl shadow-2xl overflow-hidden"
              style={{
                background:
                  'linear-gradient(135deg, rgba(220, 38, 38, 0.95) 0%, rgba(185, 28, 28, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

              <div className="relative p-8">
                {/* Icône */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-6 shadow-lg"
                >
                  <AlertTriangle className="w-10 h-10 text-white" />
                </motion.div>

                {/* Titre */}
                <h3 className="text-2xl font-bold text-white text-center mb-3">
                  Confirmer la suppression
                </h3>

                {/* Description */}
                <p className="text-white/90 text-center mb-2 leading-relaxed">
                  Êtes-vous sûr de vouloir supprimer cette déclaration ?
                </p>
                <p className="text-white/80 text-sm text-center mb-6 font-mono bg-white/10 rounded-lg p-2">
                  {declarationToDelete}
                </p>

                <p className="text-white/70 text-xs text-center mb-8">
                  ⚠️ Cette action est <strong>irréversible</strong>
                </p>

                {/* Boutons */}
                <div className="flex gap-3">
                  {/* Bouton Annuler */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancelDelete}
                    className="flex-1 px-6 py-3.5 bg-white/20 hover:bg-white/30 backdrop-blur-xl text-white font-semibold rounded-xl transition-all duration-200 border border-white/30"
                  >
                    Annuler
                  </motion.button>

                  {/* Bouton Supprimer */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfirmDelete}
                    disabled={deletingId}
                    className="flex-1 px-6 py-3.5 bg-white text-red-600 hover:bg-gray-100 font-bold rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {deletingId ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Loader className="w-5 h-5" />
                        </motion.div>
                        Suppression...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        Supprimer
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeclarationsList;
