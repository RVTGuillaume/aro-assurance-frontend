/** 
 * Historique des déclarations - Assuré
 * Timeline chronologique avec animations Framer Motion
 * ARO Assurance Madagascar
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import declarationApi from '../../services/declarationApi';
import {
  Calendar,
  FileText,
  Filter,
  TrendingUp,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Loader,
  Package,
  RefreshCw,
} from 'lucide-react';

// 🎨 COULEURS ARO
const COLORS = {
  en_attente: 'amber',
  en_traitement: 'blue',
  validee: 'emerald',
  refusee: 'red',
  complements_requis: 'orange',
};

const TYPE_COLORS = [
  '#006B5B', '#26A69A', '#0891B2', '#059669', '#10B981'
];

// 🎬 VARIANTS ANIMATIONS
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, staggerChildren: 0.1 }
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

const card3DVariants = {
  rest: { scale: 1, rotateX: 0, rotateY: 0 },
  hover: {
    scale: 1.02,
    rotateX: -2,
    rotateY: 2,
    y: -5,
    transition: { duration: 0.3 }
  }
};

const timelineItemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut'
    }
  }),
  hover: {
    x: 10,
    transition: { duration: 0.2 }
  }
};

const DeclarationHistory = () => {
  const navigate = useNavigate();

  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, [selectedYear, selectedMonth]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await declarationApi.getMyDeclarations({
        annee: selectedYear,
        mois: selectedMonth,
        limit: 100,
      });

      if (response.success) {
        setDeclarations(response.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await declarationApi.getStatistiques();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    await fetchStats();
    setTimeout(() => setRefreshing(false), 500);
  };

  // 🗓️ Grouper par mois
  const groupedByMonth = declarations.reduce((acc, declaration) => {
    const date = new Date(declaration.date_sinistre);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(declaration);
    return acc;
  }, {});

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const months = [
    { value: '', label: 'Tous les mois' },
    { value: '01', label: 'Janvier' },
    { value: '02', label: 'Février' },
    { value: '03', label: 'Mars' },
    { value: '04', label: 'Avril' },
    { value: '05', label: 'Mai' },
    { value: '06', label: 'Juin' },
    { value: '07', label: 'Juillet' },
    { value: '08', label: 'Août' },
    { value: '09', label: 'Septembre' },
    { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Décembre' },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return `Il y a ${Math.floor(diffDays / 30)} mois`;
  };

  const getStatutIcon = (statut) => {
    const icons = {
      en_attente: Clock,
      en_traitement: Activity,
      validee: CheckCircle,
      refusee: XCircle,
      complements_requis: AlertCircle,
    };
    return icons[statut] || Package;
  };

  const getStatutColor = (statut) => {
    const colors = {
      en_attente: '#FFA500',
      en_traitement: '#2196F3',
      validee: '#4CAF50',
      refusee: '#F44336',
      complements_requis: '#FF9800',
    };
    return colors[statut] || '#999';
  };

  // 🔄 LOADER
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* 🎨 HEADER */}
        <motion.div
          variants={headerVariants}
          className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between"
        >
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <motion.img
              src="/AROO.png"
              alt="ARO"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-[#006B5B] to-gray-900 bg-clip-text text-transparent">
                Historique des déclarations
              </h1>
              <p className="text-gray-600 text-sm">
                Vue chronologique de toutes vos déclarations
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              {refreshing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <RefreshCw className="w-5 h-5 text-[#006B5B]" />
                </motion.div>
              ) : (
                <RefreshCw className="w-5 h-5 text-[#006B5B]" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <Download className="w-5 h-5 text-[#006B5B]" />
              <span className="text-sm font-medium">Exporter</span>
            </motion.button>
          </div>
        </motion.div>

        {/* 📊 STATISTIQUES */}
        {stats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total', value: stats.total || 0, icon: FileText, color: '#006B5B' },
              { label: 'En cours', value: (stats.en_attente || 0) + (stats.en_traitement || 0), icon: Clock, color: '#FFA500' },
              { label: 'Validées', value: stats.validees || 0, icon: CheckCircle, color: '#4CAF50' },
              { label: 'Taux succès', value: `${stats.total > 0 ? Math.round((stats.validees / stats.total) * 100) : 0}%`, icon: TrendingUp, color: '#2196F3' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  custom={index}
                  initial="rest"
                  whileHover="hover"
                  variants={card3DVariants}
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
                  }}
                  className="bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden group"
                >
                  {/* Effet brillance */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <motion.p
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="text-3xl font-bold"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>

                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      <Icon className="w-8 h-8" style={{ color: stat.color }} />
                    </motion.div>
                  </div>

                  {/* Barre de progression */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                    className="origin-left mt-4 h-2 rounded-full bg-gradient-to-r from-[#006B5B] to-green-400"
                  />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* 🔍 FILTRES */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Filter className="w-5 h-5 text-[#006B5B]" />
            <h3 className="text-lg font-semibold text-gray-800">Filtres</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Année
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B5B] focus:border-transparent"
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mois
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B5B] focus:border-transparent"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* 📋 TIMELINE */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {Object.keys(groupedByMonth).length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 bg-white rounded-2xl shadow-lg"
            >
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Aucune déclaration trouvée pour cette période
              </p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedByMonth)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([monthKey, items], monthIndex) => {
                  const [year, month] = monthKey.split('-');
                  const monthName = new Date(year, parseInt(month) - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

                  return (
                    <motion.div
                      key={monthKey}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: monthIndex * 0.1 }}
                    >
                      {/* TITRE MOIS */}
                      <div className="flex items-center mb-6">
                        <div className="flex-1 h-px bg-gradient-to-r from-[#006B5B] to-transparent" />
                        <h3 className="px-6 text-xl font-bold text-gray-800 capitalize">
                          {monthName}
                        </h3>
                        <div className="flex-1 h-px bg-gradient-to-l from-[#006B5B] to-transparent" />
                      </div>

                      {/* ITEMS */}
                      <div className="space-y-4">
                        <AnimatePresence>
                          {items.map((declaration, itemIndex) => {
                            const Icon = getStatutIcon(declaration.statut_declaration);
                            const color = getStatutColor(declaration.statut_declaration);

                            return (
                              <motion.div
                                key={declaration.numero_declaration}
                                custom={itemIndex}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                variants={timelineItemVariants}
                                className="bg-white rounded-xl shadow-md p-6 border-l-4 cursor-pointer"
                                style={{ borderLeftColor: color }}
                                onClick={() => navigate(`/assure/declarations/${declaration.numero_declaration}`)}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-4 flex-1">
                                    <div
                                      className="p-3 rounded-xl"
                                      style={{ backgroundColor: `${color}15` }}
                                    >
                                      <Icon className="w-6 h-6" style={{ color }} />
                                    </div>

                                    <div className="flex-1">
                                      <div className="flex items-center space-x-3 mb-2">
                                        <h4 className="text-lg font-semibold text-gray-800">
                                          {declaration.numero_declaration}
                                        </h4>
                                        <span
                                          className="px-3 py-1 rounded-full text-xs font-medium"
                                          style={{
                                            backgroundColor: `${color}15`,
                                            color: color
                                          }}
                                        >
                                          {declaration.type_sinistre}
                                        </span>
                                      </div>

                                      <div className="grid md:grid-cols-3 gap-3 text-sm text-gray-600">
                                        <div className="flex items-center space-x-2">
                                          <Calendar className="w-4 h-4" />
                                          <span>{formatDate(declaration.date_sinistre)}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Clock className="w-4 h-4" />
                                          <span>{formatRelativeTime(declaration.created_at)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <motion.button
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/assure/declarations/${declaration.numero_declaration}`);
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                  >
                                    <Eye className="w-5 h-5 text-gray-600" />
                                  </motion.button>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DeclarationHistory;
