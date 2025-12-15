import api from './api';

const adminService = {
  // Profil
  getMyProfile: async () => {
    return await api.get('/admin/profile/me');
  },

  updateMyProfile: async (data) => {
    return await api.patch('/admin/profile/me', data);
  },

  uploadProfilePhoto: async (formData) => {
    return await api.post('/admin/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  deleteProfilePhoto: async () => {
    return await api.delete('/admin/profile/photo');
  },

  changePassword: async (data) => {
    return await api.patch('/admin/profile/password', data);
  },

  // Dashboard
  getDashboardStats: async () => {
    return await api.get('/admin/dashboard/stats');
  },

  // Déclarations
  getAllDeclarations: async (params) => {
    return await api.get('/admin/declarations', { params });
  },

  getDeclarationById: async (id) => {
    return await api.get(`/admin/declarations/${id}`);
  },

  updateDeclarationStatus: async (id, status, commentaire) => {
    return await api.patch(`/admin/declarations/${id}/statut`, {
      statut: status,
      commentaire_admin: commentaire
    });
  },

  // Assurés
  getAllAssures: async (params) => {
    return await api.get('/admin/assures', { params });
  },

  getAssureById: async (id) => {
    return await api.get(`/admin/assures/${id}`);
  },

  createAssure: async (data) => {
    return await api.post('/admin/assures', data);
  },

  updateAssure: async (id, data) => {
    return await api.put(`/admin/assures/${id}`, data);
  },

  deleteAssure: async (id) => {
    return await api.delete(`/admin/assures/${id}`);
  },

  // Statistiques
  getStats: async () => {
    return await api.get('/admin/stats');
  },

  // Statut admin
  updateStatus: async (adminId, statut) => {
    return await api.patch(`/admin/users/${adminId}/status`, { statut });
  }
};

export default adminService;
