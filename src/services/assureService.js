/**
 * Service Assurés - ARO Assurance Madagascar
 * VERSION COMPLÈTE avec gestion profil assuré
 */

import axios from '../config/axios';

const BASE_URL = '/assures';

// ============================================
// GESTION ADMIN DES ASSURÉS (existant)
// ============================================

// Récupérer tous les assurés avec filtres
export const getAll = async (params = {}) => {
  try {
    console.log('📋 Récupération assurés avec filtres:', params);
    const response = await axios.get(BASE_URL, { params });
    console.log('✅ Assurés récupérés:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur getAll:', error);
    throw error;
  }
};

// Récupérer un assuré par ID
export const getById = async (id) => {
  try {
    console.log(`🔍 Récupération assuré ${id}`);
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur getById:', error);
    throw error;
  }
};

// Créer un nouvel assuré
export const create = async (data) => {
  try {
    console.log('📝 Création assuré:', data);
    const response = await axios.post(BASE_URL, data);
    console.log('✅ Assuré créé:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur create:', error);
    throw error;
  }
};

// Mettre à jour un assuré
export const update = async (id, data) => {
  try {
    console.log(`📝 Mise à jour assuré ${id}:`, data);
    const response = await axios.put(`${BASE_URL}/${id}`, data);
    console.log('✅ Assuré mis à jour:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur update:', error);
    throw error;
  }
};

// Supprimer un assuré
export const deleteAssure = async (id) => {
  try {
    console.log(`🗑️ Suppression assuré ${id}`);
    const response = await axios.delete(`${BASE_URL}/${id}`);
    console.log('✅ Assuré supprimé');
    return response.data;
  } catch (error) {
    console.error('❌ Erreur deleteAssure:', error);
    throw error;
  }
};

// Upload photo (ADMIN uploade pour un assuré spécifique)
export const uploadPhoto = async (id, formData) => {
  try {
    console.log(`📸 Upload photo pour assuré ${id}`);
    const response = await axios.post(`${BASE_URL}/${id}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('✅ Photo uploadée:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur uploadPhoto:', error);
    throw error;
  }
};

// Statistiques
export const getStats = async () => {
  try {
    console.log('📊 Récupération stats');
    const response = await axios.get(`${BASE_URL}/stats`);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur getStats:', error);
    throw error;
  }
};

// Liste des agences
export const getAgences = async () => {
  try {
    console.log('🏢 Récupération agences');
    const response = await axios.get(`${BASE_URL}/agences`);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur getAgences:', error);
    throw error;
  }
};

// Liste des titulaires
export const getTitulaires = async () => {
  try {
    console.log('👥 Récupération titulaires');
    const response = await axios.get(`${BASE_URL}/titulaires`);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur getTitulaires:', error);
    throw error;
  }
};

// Export Excel
export const exportExcel = async (params = {}) => {
  try {
    console.log('📊 Export Excel demandé');
    const response = await axios.get(`${BASE_URL}/export`, {
      params,
      responseType: 'blob'
    });

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ARO_Assures_${new Date().toISOString().split('T')[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    console.log('✅ Export Excel téléchargé');
    return response.data;
  } catch (error) {
    console.error('❌ Erreur exportExcel:', error);
    throw error;
  }
};

// ============================================
// ✨ NOUVEAU : GESTION PROFIL ASSURÉ CONNECTÉ
// ============================================

/**
 * 👤 Récupérer mon profil (assuré connecté)
 * Endpoint: GET /api/assure/profil
 */
export const getMyProfile = async () => {
  try {
    console.log('📡 GET /api/assure/profil');
    const response = await axios.get('/assure/profil');
    console.log('✅ Mon profil récupéré:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur getMyProfile:', error);
    throw error;
  }
};

/**
 * 📸 Changer ma photo de profil (assuré connecté)
 * Endpoint: POST /api/assure/profil/photo
 */
export const updateMyProfilePhoto = async (formData) => {
  try {
    console.log('📡 POST /api/assure/profil/photo');
    const response = await axios.post('/assure/profil/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('✅ Ma photo mise à jour:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur updateMyProfilePhoto:', error);
    throw error;
  }
};

// ============================================
// EXPORT PAR DÉFAUT
// ============================================

export default {
  // Gestion admin
  getAll,
  getById,
  create,
  update,
  deleteAssure,
  uploadPhoto,
  getStats,
  getAgences,
  getTitulaires,
  exportExcel,
  
  // ✨ Gestion profil assuré
  getMyProfile,
  updateMyProfilePhoto,
};
