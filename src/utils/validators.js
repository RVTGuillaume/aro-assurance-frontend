/**
 * Fonctions de validation
 * ARO Assurance Madagascar
 */

import { PATTERNS } from './constants';

/**
 * Valider un email
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  return PATTERNS.EMAIL.test(email);
};

/**
 * Valider un téléphone malgache
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  return PATTERNS.PHONE_MG.test(phone);
};

/**
 * Valider un numéro de dossier
 */
export const isValidNumeroDossier = (numero) => {
  if (!numero) return false;
  return PATTERNS.NUMERO_DOSSIER.test(numero);
};

/**
 * Valider un numéro de police
 */
export const isValidNumeroPolice = (numero) => {
  if (!numero) return false;
  return PATTERNS.NUMERO_POLICE.test(numero);
};

/**
 * Valider un numéro de compte
 */
export const isValidNumeroCompte = (numero) => {
  if (!numero) return false;
  return PATTERNS.NUMERO_COMPTE.test(numero);
};

/**
 * Valider un fichier
 */
export const validateFile = (file, maxSize = 10 * 1024 * 1024) => {
  const errors = [];

  if (!file) {
    errors.push('Aucun fichier sélectionné');
    return errors;
  }

  // Vérifier la taille
  if (file.size > maxSize) {
    errors.push(`Fichier trop volumineux (max ${maxSize / 1024 / 1024}MB)`);
  }

  // Vérifier le type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Type de fichier non autorisé (JPG, PNG, PDF uniquement)');
  }

  return errors;
};

/**
 * Valider plusieurs fichiers
 */
export const validateFiles = (files, maxSize = 10 * 1024 * 1024, maxFiles = 10) => {
  const errors = [];

  if (!files || files.length === 0) {
    errors.push('Aucun fichier sélectionné');
    return errors;
  }

  if (files.length > maxFiles) {
    errors.push(`Nombre maximum de fichiers dépassé (max ${maxFiles})`);
    return errors;
  }

  for (let i = 0; i < files.length; i++) {
    const fileErrors = validateFile(files[i], maxSize);
    errors.push(...fileErrors);
  }

  return errors;
};

/**
 * Valider une date
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Valider qu'une date est dans le passé
 */
export const isPastDate = (dateString) => {
  if (!isValidDate(dateString)) return false;

  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date < today;
};

/**
 * Valider qu'une date est dans le futur
 */
export const isFutureDate = (dateString) => {
  if (!isValidDate(dateString)) return false;

  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date > today;
};

/**
 * Valider un âge
 */
export const isValidAge = (age) => {
  return Number.isInteger(age) && age >= 0 && age <= 120;
};

/**
 * Valider une chaîne non vide
 */
export const isNotEmpty = (value) => {
  return value && value.trim().length > 0;
};

/**
 * Valider une longueur minimale
 */
export const hasMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

/**
 * Valider une longueur maximale
 */
export const hasMaxLength = (value, maxLength) => {
  return !value || value.length <= maxLength;
};

export default {
  isValidEmail,
  isValidPhone,
  isValidNumeroDossier,
  isValidNumeroPolice,
  isValidNumeroCompte,
  validateFile,
  validateFiles,
  isValidDate,
  isPastDate,
  isFutureDate,
  isValidAge,
  isNotEmpty,
  hasMinLength,
  hasMaxLength,
};
