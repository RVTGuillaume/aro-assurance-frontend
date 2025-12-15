/**
 * =====================================
 * 📋 API DÉCLARATIONS - ARO ASSURANCE
 * Version 3.1 - AVEC SUPPRESSION FICHIERS
 * =====================================
 */

import axios from '../config/axios';

const isDevelopment = import.meta.env.MODE === 'development';

const declarationApi = {
  /**
   * 🆕 CRÉER DÉCLARATION
   */
  async createDeclaration(formData, fichiers = [], sendOptions = { sendEmail: true, saveToDb: true }) {
    try {
      if (isDevelopment) {
        console.log('📝 Création déclaration avec', fichiers.length, 'fichiers');
      }

      const dataToSend = {
        ...formData,
        sendEmail: sendOptions.sendEmail,
        saveToDb: sendOptions.saveToDb
      };

      const response = await axios.post('/declarations', dataToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.data?.data?.declaration_id) {
        throw new Error('ID de déclaration manquant dans la réponse');
      }

      const { declaration_id, numero_declaration } = response.data.data;

      if (isDevelopment) {
        console.log('✅ Déclaration créée - ID:', declaration_id);
      }

      // Upload des fichiers en arrière-plan
      if (fichiers && fichiers.length > 0) {
        this.uploadFilesInBackground(declaration_id, fichiers, 'original')
          .catch(err => console.error('❌ Erreur upload:', err));
      }

      return {
        success: true,
        ...response.data,
        data: {
          ...response.data.data,
          declaration_id,
          numero_declaration
        }
      };
    } catch (error) {
      console.error('❌ Erreur createDeclaration:', error);
      throw {
        success: false,
        message: error.response?.data?.message || error.message,
        details: error.response?.data
      };
    }
  },

  /**
   * 📎 UPLOAD FICHIERS POUR DÉCLARATION EXISTANTE
   */
  async uploadFilesForDeclaration(declarationId, fichiers, sourceFichier = 'complement') {
    try {
      if (!declarationId) {
        throw new Error('ID de déclaration manquant');
      }

      if (!fichiers || fichiers.length === 0) {
        return { success: true, message: 'Aucun fichier à uploader' };
      }

      if (isDevelopment) {
        console.log(`📤 Upload de ${fichiers.length} fichier(s) - source: ${sourceFichier}`);
      }

      const formDataFiles = new FormData();
      formDataFiles.append('source_fichier', sourceFichier);
      
      fichiers.forEach((file, index) => {
        if (isDevelopment) {
          console.log(`  📄 ${index + 1}. ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        }
        formDataFiles.append('fichiers', file);
      });
      
      const response = await axios.post(
        `/declarations/${declarationId}/upload`,
        formDataFiles,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 0,
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );

      if (isDevelopment) {
        console.log('✅ Fichiers uploadés:', response.data);
      }

      return {
        success: true,
        ...response.data
      };
    } catch (error) {
      console.error('❌ Erreur upload fichiers:', error);
      throw {
        success: false,
        message: error.response?.data?.message || error.message,
        details: error.response?.data
      };
    }
  },

  async uploadFilesInBackground(declarationId, fichiers, sourceFichier = 'original') {
    return this.uploadFilesForDeclaration(declarationId, fichiers, sourceFichier);
  },

  /**
   * 📋 RÉCUPÉRER MES DÉCLARATIONS
   */
  async getMyDeclarations(page = 1, limit = 10, statut = '') {
    try {
      const params = { page, limit };
      if (statut) params.statut = statut;
      
      const response = await axios.get('/declarations', { params });
      
      return {
        success: true,
        ...response.data
      };
    } catch (error) {
      console.error('❌ Erreur getMyDeclarations:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la récupération'
      };
    }
  },

  /**
   * 🔍 RÉCUPÉRER UNE DÉCLARATION PAR ID
   */
  async getById(id) {
    try {
      if (!id) {
        throw new Error('ID de déclaration manquant');
      }

      if (isDevelopment) {
        console.log('🔍 getById appelé avec:', id);
      }

      const response = await axios.get(`/declarations/${id}`);

      if (!response.data) {
        throw new Error('Réponse API vide');
      }

      // Normalisation des fichiers
      let normalizedData = { ...response.data };

      if (response.data.data?.fichiers && !response.data.fichiers) {
        normalizedData.fichiers = response.data.data.fichiers;
      } else if (!response.data.fichiers) {
        normalizedData.fichiers = [];
      }

      if (isDevelopment) {
        console.log('✅ Fichiers normalisés:', normalizedData.fichiers?.length || 0);
      }

      return {
        success: true,
        ...normalizedData
      };
    } catch (error) {
      console.error('❌ Erreur getById:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la récupération'
      };
    }
  },

  async getDeclarationById(id) {
    return this.getById(id);
  },

  /**
   * ✏️ MODIFIER UNE DÉCLARATION
   */
  async update(id, data) {
    try {
      if (!id) {
        throw new Error('ID de déclaration manquant');
      }

      if (isDevelopment) {
        console.log('✏️ Modification déclaration:', id);
      }

      const response = await axios.put(`/declarations/${id}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (isDevelopment) {
        console.log('✅ Déclaration modifiée:', response.data);
      }

      return {
        success: true,
        ...response.data
      };
    } catch (error) {
      console.error('❌ Erreur update:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la modification'
      };
    }
  },

  async updateDeclaration(id, data) {
    return this.update(id, data);
  },

  /**
   * 🗑️ SUPPRIMER UNE DÉCLARATION
   */
  async deleteDeclaration(id) {
    try {
      if (isDevelopment) {
        console.log('🗑️ Suppression déclaration:', id);
      }

      const response = await axios.delete(`/declarations/${id}`);

      return {
        success: true,
        ...response.data
      };
    } catch (error) {
      console.error('❌ Erreur deleteDeclaration:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la suppression'
      };
    }
  },

  /**
   * 🗑️ SUPPRIMER UN FICHIER SPÉCIFIQUE
   * ✅ NOUVELLE FONCTION AJOUTÉE
   */
  async deleteFile(fileId) {
    try {
      if (!fileId) {
        throw new Error('ID du fichier manquant');
      }

      if (isDevelopment) {
        console.log('🗑️ Suppression fichier ID:', fileId);
      }

      const response = await axios.delete(`/declarations/fichiers/${fileId}`);

      if (isDevelopment) {
        console.log('✅ Fichier supprimé:', response.data);
      }

      return {
        success: true,
        ...response.data
      };
    } catch (error) {
      console.error('❌ Erreur deleteFile:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la suppression du fichier',
        details: error.response?.data
      };
    }
  }
};

export default declarationApi;
