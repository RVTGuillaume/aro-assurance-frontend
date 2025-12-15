/**
 * 🎯 DASHBOARD ADMIN ARO - VERSION CORRIGÉE ✅
 * ═════════════════════════════════════════════
 * ARO Assurance Madagascar
 * FIX: Labels graphique circulaire complets et visibles
 */

// ═══════════════════════════════════════════════════════════
// 📦 1. IMPORTS & DÉPENDANCES
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminApi } from '@api/adminApi';

import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';

import {
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import Loader from '@components/common/Loader';

import { formatDate, formatRelativeTime } from '@utils/formatters';
import {
  TYPE_SINISTRE_LABELS,
  STATUT_DECLARATION_LABELS,
  STATUT_DECLARATION_COLORS,
} from '@utils/constants';

// ═══════════════════════════════════════════════════════════
// 🎨 2. CONSTANTES DE COULEURS
// ═══════════════════════════════════════════════════════════

const COLORS = {
  en_attente: '#F59E0B',
  en_traitement: '#3B82F6',
  validee: '#10B981',
  refusee: '#EF4444',
  complements_requis: '#F97316',
};

const TYPE_COLORS = [
  '#006B5B',
  '#26A69A',
  '#0891B2',
  '#059669',
  '#10B981'
];

// ═══════════════════════════════════════════════════════════
// ✨ 3. VARIANTES D'ANIMATIONS
// ═══════════════════════════════════════════════════════════

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

const pulseVariants = {
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const slideVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 }
  }
};

// ═══════════════════════════════════════════════════════════
// 🎯 4. FONCTION DE LABEL PERSONNALISÉ (FIX PRINCIPAL)
// ═══════════════════════════════════════════════════════════

/**
 * Rendu personnalisé du label sur le graphique circulaire
 * Affichage optimisé avec nom abrégé + pourcentage
 */
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name
}) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30; // Distance du label
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Abréviations des labels
  const shortLabels = {
    'En attente': 'Attente',
    'En traitement': 'Traitement',
    'Validée': 'Validée',
    'Validées': 'Validées',
    'Refusée': 'Refusée',
    'Refusées': 'Refusées',
    'Compléments requis': 'Compléments',
  };

  const shortName = shortLabels[name] || name;
  const displayText = `${shortName}: ${(percent * 100).toFixed(0)}%`;

  return (
    <text
      x={x}
      y={y}
      fill="#1F2937"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize="13px"
      fontWeight="600"
      className="select-none"
    >
      {displayText}
    </text>
  );
};

// ═══════════════════════════════════════════════════════════
// 🔧 5. COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastFetchRef = useRef(null);

  // ═══════════════════════════════════════════════════════════
  // 📡 CHARGEMENT DES DONNÉES
  // ═══════════════════════════════════════════════════════════

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchDashboardStats(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchDashboardStats(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const fetchDashboardStats = async (silent = false) => {
    if (isRefreshing) return;

    const now = Date.now();
    if (silent && lastFetchRef.current && (now - lastFetchRef.current) < 10000) {
      return;
    }

    try {
      setIsRefreshing(true);
      if (!silent) setLoading(true);

      const response = await adminApi.getDashboardStats();

      if (response.success) {
        setStats(response.data);
        setLastUpdate(new Date());
        lastFetchRef.current = now;
        setError(null);
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setIsRefreshing(false);
      if (!silent) setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // 📊 PRÉPARATION DES DONNÉES
  // ═══════════════════════════════════════════════════════════

  const dataStatuts = stats?.declarations_par_statut?.map(item => ({
    name: STATUT_DECLARATION_LABELS[item.statut] || item.statut,
    value: item.count,
    statut: item.statut,
  })) || [];

  const dataTypes = stats?.declarations_par_type?.map(item => ({
    name: TYPE_SINISTRE_LABELS[item.type] || item.type,
    count: item.count,
  })) || [];

  const dataEvolution = stats?.evolution_par_mois?.map(item => ({
    mois: item.mois,
    declarations: item.count,
  })) || [];

  // ═══════════════════════════════════════════════════════════
  // 🎨 RENDU
  // ═══════════════════════════════════════════════════════════

  if (loading) {
    return <Loader fullScreen text="Chargement du dashboard..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => fetchDashboardStats()}
            className="px-6 py-3 bg-aro-green text-white rounded-lg hover:bg-opacity-90 transition-all"
          >
            Réessayer
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 py-8">
      <div className="container-aro">
        {/* ═══════════════════════════════════════════════════════════
            📍 HEADER
            ═══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-6">
            {/* Logo + Titre */}
            <div className="flex items-center gap-4">
              <motion.img
                src="/AROO.png"
                alt="ARO Assurance"
                className="h-32 w-auto object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                onError={(e) => { e.target.src = '/AROO.jpg'; }}
              />

              <div>
                <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-gray-900 via-aro-green to-gray-900 bg-clip-text text-transparent mb-2">
                  Dashboard Administrateur
                </h1>
                <p className="text-gray-600 mb-2">
                  Vue d'ensemble complète et analytique
                </p>
                
                {/* Dernière mise à jour */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-sm text-gray-500"
                >
                  <motion.div variants={pulseVariants} animate="animate">
                    <Clock className="w-4 h-4 text-aro-green" />
                  </motion.div>
                  <span>
                    Mis à jour {lastUpdate ? formatRelativeTime(lastUpdate) : 'à l\'instant'}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Contrôles */}
            <div className="flex items-center gap-4">
              {/* Toggle auto-refresh */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4 text-aro-green rounded focus:ring-aro-green"
                />
                <span className="text-sm text-gray-600">
                  Auto {autoRefresh ? '(30s)' : '(off)'}
                </span>
              </label>

              {/* Bouton actualiser */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-aro-green text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                onClick={() => fetchDashboardStats()}
                disabled={isRefreshing}
              >
                <motion.div
                  animate={{ rotate: isRefreshing ? 360 : 0 }}
                  transition={{ 
                    duration: 1, 
                    repeat: isRefreshing ? Infinity : 0, 
                    ease: "linear" 
                  }}
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.div>
                {isRefreshing ? 'Actualisation...' : 'Actualiser'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            📊 CARTES STATISTIQUES PRINCIPALES
            ═══════════════════════════════════════════════════════════ */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Assurés',
              value: stats?.total_assures || 0,
              trend: `+${stats?.nouveaux_assures_mois || 0} ce mois`,
              icon: Users,
              color: 'blue',
              bgColor: 'bg-blue-100',
              iconColor: 'text-blue-600',
              onClick: () => navigate('/admin/assures'),
            },
            {
              title: 'Déclarations',
              value: stats?.total_declarations || 0,
              trend: `+${stats?.declarations_jour || 0} aujourd'hui`,
              icon: FileText,
              color: 'green',
              bgColor: 'bg-green-100',
              iconColor: 'text-green-600',
              onClick: () => navigate('/admin/declarations'),
            },
            {
              title: 'En attente',
              value: stats?.declarations_en_attente || 0,
              trend: 'À traiter rapidement',
              icon: Clock,
              color: 'yellow',
              bgColor: 'bg-yellow-100',
              iconColor: 'text-yellow-600',
              onClick: () => navigate('/admin/declarations?statut=en_attente'),
            },
            {
              title: 'Taux validation',
              value: `${stats?.taux_validation || 0}%`,
              trend: `Refus: ${stats?.taux_refus || 0}%`,
              icon: CheckCircle,
              color: 'green',
              bgColor: 'bg-green-100',
              iconColor: 'text-green-600',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <motion.div
                variants={card3DVariants}
                className={`relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden group ${
                  item.onClick ? 'hover:bg-gray-50' : ''
                }`}
                onClick={item.onClick}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px',
                }}
              >
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full" />
                
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <p className="text-gray-600 text-sm mb-2 font-medium">{item.title}</p>
                    <motion.p
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 + 0.2 }}
                      className="text-4xl font-bold text-gray-900 mb-2"
                    >
                      {item.value}
                    </motion.p>
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>{item.trend}</span>
                    </div>
                  </div>
                  
                  {/* Icône */}
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-14 h-14 ${item.bgColor} rounded-xl flex items-center justify-center shadow-inner`}
                  >
                    <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                  </motion.div>
                </div>

                {/* Barre de progression */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-aro-green to-green-400 origin-left"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            🎯 CARTES DÉTAILS PAR STATUT
            ═══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
        >
          {[
            { 
              label: 'En attente', 
              value: stats?.declarations_en_attente || 0, 
              icon: Clock, 
              color: 'yellow' 
            },
            { 
              label: 'En traitement', 
              value: stats?.declarations_en_traitement || 0, 
              icon: Activity, 
              color: 'blue' 
            },
            { 
              label: 'Validées', 
              value: stats?.declarations_validees || 0, 
              icon: CheckCircle, 
              color: 'green' 
            },
            { 
              label: 'Refusées', 
              value: stats?.declarations_refusees || 0, 
              icon: XCircle, 
              color: 'red' 
            },
            { 
              label: 'Compléments', 
              value: stats?.declarations_complements_requis || 0, 
              icon: AlertCircle, 
              color: 'orange' 
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className={`p-4 bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 border border-${item.color}-200 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-600 font-medium">{item.label}</p>
                <item.icon className={`w-6 h-6 text-${item.color}-600`} />
              </div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.6 }}
                className={`text-3xl font-bold text-${item.color}-700`}
              >
                {item.value}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            📊 GRAPHIQUES
            ═══════════════════════════════════════════════════════════ */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* 🔵 GRAPHIQUE CIRCULAIRE - RÉPARTITION PAR STATUT (CORRIGÉ) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Card className="p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <PieChart className="w-6 h-6 text-aro-green" />
                Répartition par statut
              </h3>
              
              {dataStatuts.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <RechartsPie>
                    <Pie
                      data={dataStatuts}
                      cx="50%"
                      cy="50%"
                      labelLine={{
                        stroke: '#94A3B8',
                        strokeWidth: 1,
                      }}
                      label={renderCustomLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1200}
                    >
                      {dataStatuts.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[entry.statut] || '#94A3B8'} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value} déclarations`, name]}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-gray-500">
                  <p>Aucune donnée disponible</p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* 📊 GRAPHIQUE BARRES - DÉCLARATIONS PAR TYPE */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Card className="p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-aro-green" />
                Déclarations par type
              </h3>
              
              {dataTypes.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dataTypes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      angle={-20} 
                      textAnchor="end" 
                      height={90} 
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#006B5B" 
                      radius={[8, 8, 0, 0]} 
                      animationDuration={1000}
                    >
                      {dataTypes.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={TYPE_COLORS[index % TYPE_COLORS.length]} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <p>Aucune donnée disponible</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* 📈 GRAPHIQUE LIGNE - ÉVOLUTION */}
        {dataEvolution.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mb-8"
          >
            <Card className="p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-aro-green" />
                Évolution des déclarations (6 derniers mois)
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={dataEvolution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="mois" fontSize={12} />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="declarations"
                    stroke="#006B5B"
                    strokeWidth={3}
                    name="Déclarations"
                    dot={{ fill: '#006B5B', r: 5 }}
                    activeDot={{ r: 8 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            🔔 ACTIVITÉS RÉCENTES
            ═══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-aro-green" />
              Activité récente
            </h3>
            
            <div className="space-y-3">
              {stats?.activites_recentes?.length > 0 ? (
                stats.activites_recentes.map((activite, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all cursor-pointer border border-gray-100 group"
                    onClick={() => navigate(`/admin/declarations/${activite.id}`)}
                  >
                    {/* Icône */}
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner"
                      style={{ backgroundColor: `${COLORS[activite.statut]}20` }}
                    >
                      <FileText 
                        className="w-6 h-6" 
                        style={{ color: COLORS[activite.statut] }} 
                      />
                    </motion.div>
                    
                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-semibold truncate">
                        {activite.titre}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {activite.description}
                      </p>
                      
                      {/* Heure exacte */}
                      <p className="text-xs text-aro-green font-semibold mt-1">
                        🕒 {activite.date_exacte || formatDate(activite.date_creation)}
                      </p>
                    </div>
                    
                    {/* Badge statut */}
                    <Badge 
                      variant={STATUT_DECLARATION_COLORS[activite.statut]} 
                      size="sm"
                    >
                      {STATUT_DECLARATION_LABELS[activite.statut]}
                    </Badge>
                    
                    {/* Flèche */}
                    <ArrowUpRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Aucune activité récente
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
