/**
 * Gestion avancée des déclarations - Admin
 * Design glassmorphism avec dégradés verts sombres
 * ARO Assurance Madagascar
 */

import { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';
import { useNotification } from '@hooks/useNotification';
import {
  FileText,
  Filter,
  Download,
  CheckSquare,
  Square,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  TrendingUp,
} from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import Select from '@components/common/Select';
import Modal from '@components/common/Modal';
import Loader from '@components/common/Loader';
import { formatDate, formatCurrency } from '@utils/formatters';
import {
  STATUT_DECLARATION,
  STATUT_DECLARATION_LABELS,
  STATUT_DECLARATION_COLORS,
  TYPE_SINISTRE_LABELS,
} from '@utils/constants';

const ManageDeclarations = () => {
  const notification = useNotification();
  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkStatut, setBulkStatut] = useState('');
  const [bulkProcessing, setBulkProcessing] = useState(false);

  const [filters, setFilters] = useState({
    statut: '',
    date_debut: '',
    date_fin: '',
  });

  const [stats, setStats] = useState({
    en_attente: 0,
    en_traitement: 0,
    validees: 0,
    refusees: 0,
  });

  useEffect(() => {
    fetchDeclarations();
    fetchStats();
  }, [filters]);

  const fetchDeclarations = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getAllDeclarations({
        ...filters,
        limit: 100,
      });

      if (response.success) {
        setDeclarations(response.data);
      }
    } catch (error) {
      notification.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminApi.getDashboardStats();

      if (response.success) {
        setStats({
          en_attente: response.data.declarations_en_attente || 0,
          en_traitement: response.data.declarations_en_traitement || 0,
          validees: response.data.declarations_validees || 0,
          refusees: response.data.declarations_refusees || 0,
        });
      }
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

  // Sélection
  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === declarations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(declarations.map((d) => d.id));
    }
  };

  // Traitement en masse
  const handleBulkUpdate = async () => {
    if (!bulkStatut || selectedIds.length === 0) {
      notification.warning('Sélectionnez un statut et au moins une déclaration');
      return;
    }

    setBulkProcessing(true);

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const id of selectedIds) {
        try {
          const response = await adminApi.updateDeclarationStatut(id, {
            statut: bulkStatut,
            commentaire: 'Mise à jour en masse',
          });

          if (response.success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      if (successCount > 0) {
        notification.success(
          `${successCount} déclaration(s) mise(s) à jour avec succès`
        );
      }

      if (errorCount > 0) {
        notification.error(`${errorCount} erreur(s) rencontrée(s)`);
      }

      setSelectedIds([]);
      setBulkModalOpen(false);
      fetchDeclarations();
      fetchStats();
    } catch (error) {
      notification.error('Erreur lors de la mise à jour');
    } finally {
      setBulkProcessing(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Numéro',
      'Assuré',
      'Type',
      'Date sinistre',
      'Date création',
      'Statut',
      'Montant',
    ];

    const rows = declarations.map((d) => [
      d.numero_declaration,
      d.assure_nom,
      TYPE_SINISTRE_LABELS[d.type_sinistre],
      formatDate(d.date_sinistre),
      formatDate(d.created_at),
      STATUT_DECLARATION_LABELS[d.statut],
      d.montant_estime || '0',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `declarations_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    notification.success('Export CSV lancé');
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-8">
      {/* Fond avec dégradé vert sombre élégant */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-green-950 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(5,150,105,0.08),transparent_50%)]" />
      </div>

      <div className="container-aro relative z-10">
        {/* Header avec effet glassmorphism */}
        <div className="mb-12 text-center">
          <div className="inline-block glass-card-header p-8 rounded-3xl animate-float">
            <h1 className="text-5xl font-heading font-bold bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent mb-3">
              Gestion des Déclarations
            </h1>
            <p className="text-emerald-100/80 text-lg">
              Tableau de bord avancé avec actions en masse
            </p>
          </div>
        </div>

        {/* Stats avec cartes glassmorphism innovantes */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {/* En Attente */}
          <div
            className="glass-stat-card group cursor-pointer animate-float"
            style={{ animationDelay: '0s' }}
            onClick={() =>
              setFilters({ ...filters, statut: STATUT_DECLARATION.EN_ATTENTE })
            }
          >
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm">
                  <Clock className="w-8 h-8 text-yellow-300" />
                </div>
                <div className="px-3 py-1 rounded-full bg-yellow-500/10 backdrop-blur-sm border border-yellow-400/20">
                  <span className="text-xs text-yellow-200 font-semibold">
                    ATTENTE
                  </span>
                </div>
              </div>
              <p className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                {stats.en_attente}
              </p>
              <p className="text-emerald-100/60 text-sm font-medium">
                En attente de traitement
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* En Traitement */}
          <div
            className="glass-stat-card group cursor-pointer animate-float"
            style={{ animationDelay: '0.1s' }}
            onClick={() =>
              setFilters({
                ...filters,
                statut: STATUT_DECLARATION.EN_TRAITEMENT,
              })
            }
          >
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm">
                  <AlertCircle className="w-8 h-8 text-blue-300" />
                </div>
                <div className="px-3 py-1 rounded-full bg-blue-500/10 backdrop-blur-sm border border-blue-400/20">
                  <span className="text-xs text-blue-200 font-semibold">
                    ACTIF
                  </span>
                </div>
              </div>
              <p className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                {stats.en_traitement}
              </p>
              <p className="text-emerald-100/60 text-sm font-medium">
                Dossiers en cours d'analyse
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Validées */}
          <div
            className="glass-stat-card group cursor-pointer animate-float"
            style={{ animationDelay: '0.2s' }}
            onClick={() =>
              setFilters({ ...filters, statut: STATUT_DECLARATION.VALIDEE })
            }
          >
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm">
                  <CheckCircle className="w-8 h-8 text-emerald-300" />
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 backdrop-blur-sm border border-emerald-400/20">
                  <span className="text-xs text-emerald-200 font-semibold">
                    VALIDÉ
                  </span>
                </div>
              </div>
              <p className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                {stats.validees}
              </p>
              <p className="text-emerald-100/60 text-sm font-medium">
                Déclarations approuvées
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Refusées */}
          <div
            className="glass-stat-card group cursor-pointer animate-float"
            style={{ animationDelay: '0.3s' }}
            onClick={() =>
              setFilters({ ...filters, statut: STATUT_DECLARATION.REFUSEE })
            }
          >
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-sm">
                  <XCircle className="w-8 h-8 text-red-300" />
                </div>
                <div className="px-3 py-1 rounded-full bg-red-500/10 backdrop-blur-sm border border-red-400/20">
                  <span className="text-xs text-red-200 font-semibold">
                    REFUSÉ
                  </span>
                </div>
              </div>
              <p className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                {stats.refusees}
              </p>
              <p className="text-emerald-100/60 text-sm font-medium">
                Dossiers non conformes
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Filtres et actions */}
        <div className="glass-card mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm">
                <Filter className="w-6 h-6 text-emerald-300" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Filtres et Actions
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {selectedIds.length > 0 && (
                <button
                  onClick={() => setBulkModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5" />
                    Modifier {selectedIds.length}
                  </span>
                </button>
              )}

              <button
                onClick={handleExportCSV}
                className="glass-button-secondary"
              >
                <Download className="w-5 h-5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="glass-input-wrapper">
              <Select
                placeholder="Tous les statuts"
                value={filters.statut}
                onChange={(e) =>
                  setFilters({ ...filters, statut: e.target.value })
                }
                options={Object.entries(STATUT_DECLARATION_LABELS).map(
                  ([value, label]) => ({ value, label })
                )}
                className="glass-input"
              />
            </div>

            <div className="glass-input-wrapper">
              <input
                type="date"
                value={filters.date_debut}
                onChange={(e) =>
                  setFilters({ ...filters, date_debut: e.target.value })
                }
                className="glass-input"
                placeholder="Date début"
              />
            </div>

            <div className="glass-input-wrapper">
              <input
                type="date"
                value={filters.date_fin}
                onChange={(e) =>
                  setFilters({ ...filters, date_fin: e.target.value })
                }
                className="glass-input"
                placeholder="Date fin"
              />
            </div>
          </div>

          <button
            onClick={() =>
              setFilters({ statut: '', date_debut: '', date_fin: '' })
            }
            className="text-emerald-300 hover:text-emerald-200 text-sm font-medium transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>

        {/* Tableau des déclarations */}
        {loading ? (
          <div className="glass-card flex items-center justify-center py-20">
            <Loader text="Chargement des déclarations..." />
          </div>
        ) : (
          <div className="glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleSelectAll}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
                >
                  {selectedIds.length === declarations.length ? (
                    <CheckSquare className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <Square className="w-6 h-6 text-emerald-100/50" />
                  )}
                </button>
                <span className="text-emerald-100/80 font-medium">
                  {selectedIds.length} / {declarations.length} sélectionné(s)
                </span>
              </div>

              <div className="px-4 py-2 rounded-full glass-badge">
                <span className="text-emerald-200 font-semibold">
                  {declarations.length} déclarations
                </span>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-emerald-500/20">
                    <th className="px-4 py-4 text-left text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      Sélection
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      Numéro
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      Assuré
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      Type Sinistre
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      Date Sinistre
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      Date Création
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      Montant Estimé
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/10">
                  {declarations.map((declaration, index) => (
                    <tr
                      key={declaration.id}
                      className={`glass-table-row group ${
                        selectedIds.includes(declaration.id)
                          ? 'bg-emerald-500/10'
                          : ''
                      }`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleSelect(declaration.id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
                        >
                          {selectedIds.includes(declaration.id) ? (
                            <CheckSquare className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Square className="w-5 h-5 text-emerald-100/40" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-400" />
                          <span className="text-white font-semibold">
                            {declaration.numero_declaration}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-emerald-400/60" />
                          <span className="text-emerald-100">
                            {declaration.assure_nom}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-emerald-100/80 capitalize">
                          {TYPE_SINISTRE_LABELS[declaration.type_sinistre]}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-400/60" />
                          <span className="text-emerald-100/80">
                            {formatDate(declaration.date_sinistre)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-emerald-100/80 text-sm">
                            {formatDate(declaration.created_at)}
                          </span>
                          <span className="text-emerald-100/50 text-xs">
                            {new Date(declaration.created_at).toLocaleTimeString(
                              'fr-FR',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div
                          className={`inline-flex items-center px-3 py-1.5 rounded-full glass-badge ${
                            declaration.statut === STATUT_DECLARATION.VALIDEE
                              ? 'bg-emerald-500/20 border-emerald-400/30'
                              : declaration.statut ===
                                STATUT_DECLARATION.EN_TRAITEMENT
                              ? 'bg-blue-500/20 border-blue-400/30'
                              : declaration.statut ===
                                STATUT_DECLARATION.EN_ATTENTE
                              ? 'bg-yellow-500/20 border-yellow-400/30'
                              : 'bg-red-500/20 border-red-400/30'
                          }`}
                        >
                          <span
                            className={`text-xs font-semibold ${
                              declaration.statut === STATUT_DECLARATION.VALIDEE
                                ? 'text-emerald-300'
                                : declaration.statut ===
                                  STATUT_DECLARATION.EN_TRAITEMENT
                                ? 'text-blue-300'
                                : declaration.statut ===
                                  STATUT_DECLARATION.EN_ATTENTE
                                ? 'text-yellow-300'
                                : 'text-red-300'
                            }`}
                          >
                            {STATUT_DECLARATION_LABELS[declaration.statut]}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          <span className="text-white font-bold">
                            {declaration.montant_estime
                              ? formatCurrency(declaration.montant_estime)
                              : '-'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal modification en masse */}
      <Modal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        title="Modifier plusieurs déclarations"
        footer={
          <>
            <button
              onClick={() => setBulkModalOpen(false)}
              disabled={bulkProcessing}
              className="glass-button-secondary"
            >
              Annuler
            </button>
            <button
              onClick={handleBulkUpdate}
              disabled={bulkProcessing}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bulkProcessing ? 'Traitement...' : `Appliquer à ${selectedIds.length}`}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-emerald-100/80">
            Vous êtes sur le point de modifier {selectedIds.length}{' '}
            déclaration(s).
          </p>

          <Select
            label="Nouveau statut"
            value={bulkStatut}
            onChange={(e) => setBulkStatut(e.target.value)}
            options={Object.entries(STATUT_DECLARATION_LABELS).map(
              ([value, label]) => ({ value, label })
            )}
            required
            className="glass-input"
          />
        </div>
      </Modal>

      {/* Styles CSS intégrés */}
      <style jsx>{`
        /* Glassmorphism Cards */
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 48px rgba(16, 185, 129, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          border-color: rgba(16, 185, 129, 0.3);
        }

        .glass-card-header {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 12px 48px rgba(16, 185, 129, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .glass-stat-card {
          position: relative;
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .glass-stat-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 60px rgba(16, 185, 129, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          border-color: rgba(16, 185, 129, 0.4);
        }

        .glass-badge {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .glass-button-secondary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .glass-button-secondary:hover {
          background: rgba(255, 255, 255, 0.12);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
        }

        .glass-input-wrapper {
          position: relative;
        }

        .glass-input {
          width: 100%;
          padding: 1rem 1.25rem;
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          color: white;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .glass-input:focus {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(16, 185, 129, 0.5);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .glass-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .glass-table-row {
          transition: all 0.3s ease;
          animation: fadeInUp 0.5s ease forwards;
          opacity: 0;
        }

        .glass-table-row:hover {
          background: rgba(16, 185, 129, 0.08) !important;
          transform: translateX(4px);
        }

        /* Animations */
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }

        /* Scrollbar personnalisée */
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 10px;
          transition: background 0.3s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
};

export default ManageDeclarations;
