/**
 * Hook useFileUpload
 * Gestion de l'upload de fichiers avec progression
 * ARO Assurance Madagascar
 */

import { useState } from 'react';
import { fileApi } from '@api/fileApi';
import { useNotification } from './useNotification';

const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState([]);

  const notification = useNotification();

  /**
   * Valider un fichier
   */
  const validateFile = (file) => {
    const errors = [];

    // Vérifier la taille
    if (file.size > MAX_FILE_SIZE) {
      errors.push(
        `${file.name}: Taille maximale dépassée (${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB)`
      );
    }

    // Vérifier le type
    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(
        `${file.name}: Type de fichier non autorisé (JPG, PNG, PDF uniquement)`
      );
    }

    return errors;
  };

  /**
   * Valider tous les fichiers
   */
  const validateFiles = (files) => {
    const allErrors = [];

    for (let i = 0; i < files.length; i++) {
      const fileErrors = validateFile(files[i]);
      allErrors.push(...fileErrors);
    }

    return allErrors;
  };

  /**
   * Upload des fichiers
   */
  const uploadFiles = async (declarationId, files) => {
    setUploading(true);
    setProgress(0);
    setErrors([]);

    // Valider les fichiers
    const validationErrors = validateFiles(files);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setUploading(false);
      validationErrors.forEach((error) => notification.error(error));
      return { success: false, errors: validationErrors };
    }

    try {
      const response = await fileApi.upload(declarationId, files);

      if (response.success) {
        setUploadedFiles(response.data);
        setProgress(100);
        notification.success(response.message);
        return { success: true, data: response.data };
      }

      return { success: false, message: response.message };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Erreur lors de l\'upload des fichiers';
      notification.error(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setUploading(false);
    }
  };

  /**
   * Supprimer un fichier uploadé
   */
  const deleteFile = async (pieceId) => {
    try {
      const response = await fileApi.delete(pieceId);

      if (response.success) {
        setUploadedFiles((prev) => prev.filter((f) => f.id !== pieceId));
        notification.success(response.message);
        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Erreur lors de la suppression du fichier';
      notification.error(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  /**
   * Réinitialiser l'état
   */
  const reset = () => {
    setUploading(false);
    setProgress(0);
    setUploadedFiles([]);
    setErrors([]);
  };

  return {
    uploading,
    progress,
    uploadedFiles,
    errors,
    uploadFiles,
    deleteFile,
    validateFiles,
    reset,
  };
};

export default useFileUpload;
