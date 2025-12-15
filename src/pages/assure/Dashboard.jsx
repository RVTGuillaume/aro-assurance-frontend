/**
 * =====================================
 * 📊 DASHBOARD ASSURÉ ULTRA-MODERNE
 * ARO Assurance Madagascar
 * =====================================
 * ✅ RESPONSIVE: Zoom +/-, tous appareils
 * ✅ Logo AROO.png adaptatif
 * ✅ Grilles flexibles
 * ✅ Textes et espaces proportionnels
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import declarationApi from '@/services/declarationApi';
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  ArrowUpRight,
  Loader,
  RefreshCw,
  Plus,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// ========== DESIGN SYSTEM ARO ==========
const COLORS = {
  en_attente: '#F59E0B',
  en_traitement: '#3B82F6',
  validee: '#10B981',
  refusee: '#EF4444',
  complements_requis: '#F97316',
};

const TYPE_COLORS = ['#006B5B', '#26A69A', '#0891B2', '#059669', '#10B981'];

const STATUT_LABELS = {
  en_attente: 'En attente',
  en_traitement: 'En traitement',
  validee: 'Validées',
  refusee: 'Refusées',
  complements_requis: 'Compléments',
};

const TYPE_LABELS = {
  accident: 'Accident',
  maladie: 'Maladie / Ophtalmologie',
  soins_dentaires: 'Soins Dentaires',
  hospitalisation: 'Hospitalisation',
};

// ========== ANIMATIONS ==========
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.48, 0.15, 0.25, 0.96],
    },
  }),
};

const card3DVariants = {
  rest: { scale: 1, rotateX: 0, rotateY: 0 },
  hover: {
    scale: 1.02,
    rotateX: -2,
    rotateY: 2,
    transition: { duration: 0.3 },
  },
};

// ========== COMPOSANT PRINCIPAL ==========
const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [declarations, setDeclarations] = useState([]);
  const [previousStats, setPreviousStats] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  // ========== CHARGEMENT AUTOMATIQUE AU MONTAGE ==========
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ========== FONCTION DE CALCUL DES TENDANCES ==========
  const calculateTrend = (currentValue, previousValue) => {
    if (!previousValue || previousValue === 0) {
      return currentValue > 0 ? '+100%' : '0%';
    }
    const diff = currentValue - previousValue;
    const percentage = ((diff / previousValue) * 100).toFixed(0);
    return `${percentage >= 0 ? '+' : ''}${percentage}%`;
  };

  // ========== FONCTION D'ACTUALISATION PRINCIPALE ==========
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await declarationApi.getMyDeclarations();

      if (response.success) {
        const data = response.data || [];
        setDeclarations(data);

        if (stats) {
          setPreviousStats(stats);
        }

        const newStats = {
          total: data.length,
          en_attente: data.filter((d) => d.statut_declaration === 'en_attente').length,
          en_traitement: data.filter((d) => d.statut_declaration === 'en_traitement').length,
          validees: data.filter((d) => d.statut_declaration === 'validee').length,
          refusees: data.filter((d) => d.statut_declaration === 'refusee').length,
          complements_requis: data.filter((d) => d.statut_declaration === 'complements_requis')
            .length,
        };

        setStats(newStats);
        setLastUpdateTime(new Date());
      }
    } catch (error) {
      console.error('❌ Erreur chargement dashboard:', error);
      setStats({
        total: 0,
        en_attente: 0,
        en_traitement: 0,
        validees: 0,
        refusees: 0,
        complements_requis: 0,
      });
      setLastUpdateTime(new Date());
    } finally {
      setLoading(false);
    }
  };

  // ========== ACTUALISATION MANUELLE ==========
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setTimeout(() => setRefreshing(false), 500);
  };

  // ========== FORMATAGE DE L'HEURE (HH:MM:SS) ==========
  const formatTime = (date) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // ========== FORMATAGE DATE ET HEURE COMPLÈTES ==========
  const formatFullDateTime = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString('fr-FR');
    const timePart = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return `${datePart} à ${timePart}`;
  };

  // ========== LOADER ==========
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#006B5B]" />
        </motion.div>
      </div>
    );
  }

  // ========== PRÉPARATION DONNÉES GRAPHIQUES ==========
  const dataStatuts = Object.keys(STATUT_LABELS)
    .map((statut) => {
      const count = declarations.filter((d) => d.statut_declaration === statut).length;
      return {
        name: STATUT_LABELS[statut],
        value: count,
        statut,
      };
    })
    .filter((item) => item.value > 0);

  const dataTypes = Object.keys(TYPE_LABELS).map((type, index) => ({
    name: TYPE_LABELS[type],
    count: declarations.filter((d) => d.type_sinistre === type).length,
    color: TYPE_COLORS[index],
  }));

  const declarationsRecentes = [...declarations]
    .sort((a, b) => new Date(b.date_declaration) - new Date(a.date_declaration))
    .slice(0, 5);

  // ========== CARTES STATISTIQUES ==========
  const statsCards = [
    {
      title: 'Total Déclarations',
      value: stats?.total || 0,
      icon: FileText,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-500',
      trend: previousStats
        ? calculateTrend(stats?.total || 0, previousStats.total)
        : '+0%',
      isPositive: (stats?.total || 0) >= (previousStats?.total || 0),
      isClickable: true,
    },
    {
      title: 'En attente',
      value: stats?.en_attente || 0,
      icon: Clock,
      color: 'amber',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-500',
      trend: previousStats
        ? calculateTrend(stats?.en_attente || 0, previousStats.en_attente)
        : '+0%',
      isPositive: (stats?.en_attente || 0) <= (previousStats?.en_attente || 0),
      isClickable: false,
    },
    {
      title: 'En traitement',
      value: stats?.en_traitement || 0,
      icon: Activity,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-500',
      trend: previousStats
        ? calculateTrend(stats?.en_traitement || 0, previousStats.en_traitement)
        : '+0%',
      isPositive: (stats?.en_traitement || 0) >= (previousStats?.en_traitement || 0),
      isClickable: false,
    },
    {
      title: 'Validées',
      value: stats?.validees || 0,
      icon: CheckCircle,
      color: 'emerald',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-500',
      trend: previousStats
        ? calculateTrend(stats?.validees || 0, previousStats.validees)
        : '+0%',
      isPositive: (stats?.validees || 0) >= (previousStats?.validees || 0),
      isClickable: false,
    },
    {
      title: 'Refusées',
      value: stats?.refusees || 0,
      icon: XCircle,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      borderColor: 'border-red-500',
      trend: previousStats
        ? calculateTrend(stats?.refusees || 0, previousStats.refusees)
        : '+0%',
      isPositive: (stats?.refusees || 0) <= (previousStats?.refusees || 0),
      isClickable: false,
    },
  ];

  // ========== RENDER RESPONSIVE ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 pb-4 sm:pb-6 md:pb-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
        {/* ========== HEADER RESPONSIVE ========== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 sm:mb-5 md:mb-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6"
        >
          {/* Logo AROO - Responsive */}
          <motion.img
            src="/AROO.png"
            alt="ARO Assurance"
            className="h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 w-auto object-contain"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              e.target.src = '/AROO.jpg';
            }}
          />

          {/* Titre et infos - Responsive */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#004D40] via-[#00695C] to-[#00796B] bg-clip-text text-transparent mb-1">
              Dashboard Assuré(e)
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2">
              <p className="text-xs sm:text-sm text-gray-600">Aperçu de vos déclarations</p>
              {lastUpdateTime && (
                <>
                  <span className="hidden sm:inline text-gray-400">•</span>
                  <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-gray-500">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">Dernière mise à jour :</span>
                    <span className="sm:hidden">MAJ :</span>
                    <span className="font-mono font-semibold text-[#006B5B]">
                      {formatTime(lastUpdateTime)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bouton actualisation - Responsive */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-3 py-2 sm:px-4 sm:py-2.5 bg-white shadow-lg rounded-lg flex items-center gap-1.5 sm:gap-2 hover:shadow-xl transition-shadow disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#006B5B] ${
                refreshing ? 'animate-spin' : ''
              }`}
            />
            <span className="text-xs sm:text-sm text-gray-700 font-semibold">Actualiser</span>
          </motion.button>
        </motion.div>

        {/* ========== CARDS STATISTIQUES - RESPONSIVE ========== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
          {statsCards.map((item, i) => {
            const TrendIcon = item.isPositive ? TrendingUp : TrendingDown;
            const trendColorClass = item.isPositive ? 'text-emerald-600' : 'text-red-600';

            return (
              <motion.div
                key={i}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                onClick={item.isClickable ? () => navigate('/assure/declarations') : undefined}
                className={`group relative ${item.isClickable ? 'cursor-pointer' : ''}`}
              >
                <motion.div
                  variants={card3DVariants}
                  style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                  className={`relative bg-white rounded-lg sm:rounded-xl shadow-lg p-2.5 sm:p-3 md:p-4 border-l-4 ${item.borderColor} overflow-hidden`}
                >
                  {item.isClickable && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full" />
                  )}

                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`p-1.5 sm:p-2 ${item.bgColor} rounded-lg`}
                    >
                      <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.textColor}`} />
                    </motion.div>

                    <span
                      className={`text-[10px] sm:text-xs font-semibold ${trendColorClass} flex items-center gap-0.5 sm:gap-1`}
                    >
                      <TrendIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {item.trend}
                    </span>
                  </div>

                  <motion.p
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                    className="text-2xl sm:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1"
                  >
                    {item.value}
                  </motion.p>

                  <p className="text-[11px] sm:text-sm text-gray-600 font-medium leading-tight">
                    {item.title}
                  </p>

                  {item.isClickable && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute top-2 right-2"
                    >
                      <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-[#006B5B]" />
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${item.color}-500 to-${item.color}-400 origin-left`}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* ========== GRAPHIQUES - RESPONSIVE ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-5 md:mb-6">
          {/* Graphique Circulaire */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                <PieChartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#006B5B]" />
              </div>
              <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-[#004D40] via-[#00695C] to-[#00796B] bg-clip-text text-transparent">
                Répartition par Statut
              </h2>
            </div>

            {dataStatuts.length > 0 ? (
              <ResponsiveContainer width="100%" height={240} className="sm:hidden">
                <PieChart>
                  <Pie
                    data={dataStatuts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent }) =>
                      percent > 0 ? `${(percent * 100).toFixed(0)}%` : null
                    }
                    outerRadius={70}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {dataStatuts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.statut] || '#94A3B8'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : null}

            {dataStatuts.length > 0 ? (
              <ResponsiveContainer width="100%" height={280} className="hidden sm:block">
                <PieChart>
                  <Pie
                    data={dataStatuts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : null
                    }
                    outerRadius={90}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {dataStatuts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.statut] || '#94A3B8'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[240px] sm:h-[280px]">
                <p className="text-xs sm:text-sm text-gray-500">Aucune donnée disponible</p>
              </div>
            )}
          </motion.div>

          {/* Graphique Barres */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-lg">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-[#006B5B]" />
              </div>
              <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-[#004D40] via-[#00695C] to-[#00796B] bg-clip-text text-transparent">
                Déclarations par Type
              </h2>
            </div>

            <ResponsiveContainer width="100%" height={240} className="sm:hidden">
              <BarChart data={dataTypes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  angle={-30}
                  textAnchor="end"
                  height={80}
                  style={{ fontSize: '9px' }}
                />
                <YAxis style={{ fontSize: '9px' }} />
                <Tooltip contentStyle={{ fontSize: '10px' }} />
                <Bar
                  dataKey="count"
                  fill="#006B5B"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                >
                  {dataTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={280} className="hidden sm:block">
              <BarChart data={dataTypes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  angle={-20}
                  textAnchor="end"
                  height={70}
                  style={{ fontSize: '11px' }}
                />
                <YAxis style={{ fontSize: '11px' }} />
                <Tooltip contentStyle={{ fontSize: '12px' }} />
                <Bar
                  dataKey="count"
                  fill="#006B5B"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1000}
                >
                  {dataTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* ========== ACTIVITÉS RÉCENTES - RESPONSIVE ========== */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#006B5B]" />
              </div>
              <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-[#004D40] via-[#00695C] to-[#00796B] bg-clip-text text-transparent">
                Déclarations Récentes
              </h2>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/assure/declarations')}
              className="text-[#006B5B] hover:text-[#005B4D] text-xs sm:text-sm font-semibold flex items-center gap-1 self-start sm:self-auto"
            >
              Voir tout
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.button>
          </div>

          {declarationsRecentes.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                Aucune déclaration
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/assure/declarations/new')}
                className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-[#006B5B] to-green-600 text-white text-xs sm:text-sm rounded-lg shadow-lg inline-flex items-center gap-1.5 sm:gap-2"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Créer une déclaration
              </motion.button>
            </div>
          ) : (
            <div className="space-y-2">
              {declarationsRecentes.map((activite, index) => (
                <motion.div
                  key={activite.numero_declaration}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + index * 0.05 }}
                  whileHover={{ scale: 1.01, x: 5 }}
                  onClick={() =>
                    navigate(`/assure/declarations/${activite.numero_declaration}`)
                  }
                  className="group bg-gradient-to-r from-gray-50 to-white p-2.5 sm:p-3 rounded-lg border border-gray-200 hover:border-[#006B5B] hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0"
                      >
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#006B5B]" />
                      </motion.div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                          {activite.numero_declaration}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-600 truncate">
                          {TYPE_LABELS[activite.type_sinistre] || activite.type_sinistre}
                        </p>
                        <p className="text-[9px] sm:text-xs text-gray-400 font-mono">
                          {formatFullDateTime(activite.date_declaration)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                      <span
                        style={{
                          backgroundColor: `${COLORS[activite.statut_declaration]}20`,
                          color: COLORS[activite.statut_declaration],
                        }}
                        className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-semibold whitespace-nowrap"
                      >
                        {STATUT_LABELS[activite.statut_declaration] ||
                          activite.statut_declaration}
                      </span>

                      <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-[#006B5B] opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
