/**
 * API de gestion des fichiers - VERSION PRODUCTION
 * Upload et téléchargement de pièces jointes
 * ARO Assurance Madagascar
 */

import axios from './nothing';

const fileApi = {
  /**
   * Upload de fichiers pour une déclaration
   */
  upload: async (declarationId, formData, onProgress = null) => {
    try {
      const response = await axios.post(
        `/files/upload/${declarationId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              
              if (onProgress) {
                onProgress(percentCompleted);
              }
              
              if (import.meta.env.DEV) {
                console.log(`📤 Upload: ${percentCompleted}%`);
              }
            }
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('❌ Erreur upload:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Télécharger un fichier
   */
  download: async (pieceId) => {
    try {
      const response = await axios.get(`/files/download/${pieceId}`, {
        responseType: 'blob',
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Erreur download:', error);
      throw error;
    }
  },

  /**
   * Supprimer un fichier
   */
  delete: async (pieceId) => {
    try {
      const response = await axios.delete(`/files/${pieceId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur delete:', error);
      throw error;
    }
  },

  /**
   * Lister les fichiers d'une déclaration
   */
  listFiles: async (declarationId) => {
    try {
      const response = await axios.get(`/files/declaration/${declarationId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur listFiles:', error);
      throw error;
    }
  },
};

export default fileApi;
