/**
 * Fonctions de formatage
 * ARO Assurance Madagascar
 */

import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formater une date (JJ/MM/AAAA)
 */
export const formatDate = (date, pattern = 'dd/MM/yyyy') => {
  if (!date) return '-';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, pattern, { locale: fr });
  } catch (error) {
    console.error('Erreur formatage date:', error);
    return '-';
  }
};

/**
 * Formater date avec heure complète (JJ/MM/AAAA à HH:MM:SS)
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${day}/${month}/${year} à ${hours}:${minutes}:${seconds}`;
};

/**
 * Temps relatif (il y a X jours)
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: fr,
    });
  } catch (error) {
    return '-';
  }
};

/**
 * Formater une taille de fichier
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Formater un numéro de téléphone malgache
 */
export const formatPhone = (phone) => {
  if (!phone) return '-';

  // Supprimer espaces et caractères spéciaux
  const cleaned = phone.replace(/\D/g, '');

  // Format: +261 34 12 345 67
  if (cleaned.startsWith('261')) {
    return `+261 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 10)} ${cleaned.slice(10, 12)}`;
  }

  // Format: 034 12 345 67
  if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)}`;
  }

  return phone;
};

/**
 * Formater un montant en Ariary
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '-';

  return new Intl.NumberFormat('fr-MG', {
    style: 'currency',
    currency: 'MGA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formater un pourcentage
 */
export const formatPercentage = (value, decimals = 0) => {
  if (!value && value !== 0) return '-';

  return `${value.toFixed(decimals)}%`;
};

/**
 * Tronquer un texte
 */
export const truncate = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength) + '...';
};

/**
 * Capitaliser la première lettre
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Formater un nom complet
 */
export const formatFullName = (firstName, lastName) => {
  if (!firstName && !lastName) return '-';
  return `${firstName || ''} ${lastName || ''}`.trim();
};

/**
 * Masquer un email (ex: j***@example.com)
 */
export const maskEmail = (email) => {
  if (!email) return '-';

  const [username, domain] = email.split('@');
  if (!domain) return email;

  const maskedUsername = username.charAt(0) + '***';
  return `${maskedUsername}@${domain}`;
};

/**
 * Masquer un numéro (ex: DOS-****-123456)
 */
export const maskNumber = (number, visibleChars = 4) => {
  if (!number) return '-';

  const length = number.length;
  if (length <= visibleChars) return number;

  return number.slice(0, -visibleChars).replace(/./g, '*') + number.slice(-visibleChars);
};

export default {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatFileSize,
  formatPhone,
  formatCurrency,
  formatPercentage,
  truncate,
  capitalize,
  formatFullName,
  maskEmail,
  maskNumber,
};
