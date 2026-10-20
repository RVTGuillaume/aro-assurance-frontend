/**
 * =====================================
 * 📁 HELPERS POUR GESTION DES FICHIERS
 * ARO Assurance Madagascar
 * Version 2.5 - CORRIGÉE & OPTIMISÉE
 * =====================================
 */

// 🌐 BASE URL SELON L'ENVIRONNEMENT
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

/**
 * 🔗 Construire l'URL complète d'un fichier
 * @param {string} cheminFichier - Chemin relatif depuis uploads/
 * @returns {string} URL complète
 */
export const getFileUrl = (cheminFichier) => {
  if (!cheminFichier) {
    console.warn('⚠️ getFileUrl: Chemin fichier vide');
    return '';
  }

  // ✅ Si c'est déjà une URL complète (http:// ou https://), retourner tel quel
  if (cheminFichier.startsWith('http://') || cheminFichier.startsWith('https://')) {
    console.log('✅ URL complète détectée:', cheminFichier);
    return cheminFichier;
  }

  let relativePath = cheminFichier;

  // ✅ CAS 1: Chemin absolu avec /uploads/ (ex: /var/www/.../uploads/...)
  if (cheminFichier.includes('/uploads/')) {
    relativePath = cheminFichier.substring(cheminFichier.indexOf('/uploads/'));
    console.log('🔄 Chemin absolu normalisé:', relativePath);
  } 
  // ✅ CAS 2: Chemin relatif avec uploads/ (sans slash initial)
  else if (cheminFichier.startsWith('uploads/')) {
    relativePath = `/${cheminFichier}`;
    console.log('🔄 Chemin relatif normalisé:', relativePath);
  } 
  // ✅ CAS 3: Chemin déjà correct (/uploads/...)
  else if (cheminFichier.startsWith('/uploads/')) {
    relativePath = cheminFichier;
    console.log('✅ Chemin déjà correct:', relativePath);
  }
  // ✅ CAS 4: Nom de fichier seul (ex: "image.jpg")
  else {
    relativePath = `/uploads/${cheminFichier}`;
    console.log('🔄 Nom fichier converti:', relativePath);
  }

  // ✅ RETOURNER L'URL COMPLÈTE
  const fullUrl = `${API_BASE_URL}${relativePath}`;
  console.log('🔗 URL finale:', fullUrl);
  return fullUrl;
};

/**
 * 📂 Extraire l'extension d'un fichier
 * @param {string} fileName - Nom du fichier
 * @returns {string} Extension (ex: ".pdf", ".jpg")
 */
export const getFileExtension = (fileName) => {
  if (!fileName) return '';
  const lastDot = fileName.lastIndexOf('.');
  return lastDot === -1 ? '' : fileName.substring(lastDot).toLowerCase();
};

/**
 * 🖼️ Vérifie si un fichier est une image
 * @param {string} fileName - Nom du fichier
 * @returns {boolean}
 */
export const isImageFile = (fileName) => {
  if (!fileName) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
  return imageExtensions.includes(getFileExtension(fileName));
};

/**
 * 📄 Vérifie si un fichier est un PDF
 * @param {string} fileName - Nom du fichier
 * @returns {boolean}
 */
export const isPdfFile = (fileName) => {
  if (!fileName) return false;
  return getFileExtension(fileName) === '.pdf';
};

/**
 * 🎥 Vérifie si un fichier est une vidéo
 * @param {string} fileName - Nom du fichier
 * @returns {boolean}
 */
export const isVideoFile = (fileName) => {
  if (!fileName) return false;
  const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv', '.m4v', '.mpg', '.mpeg'];
  return videoExtensions.includes(getFileExtension(fileName));
};

/**
 * 🎵 Vérifie si un fichier est audio
 * @param {string} fileName - Nom du fichier
 * @returns {boolean}
 */
export const isAudioFile = (fileName) => {
  if (!fileName) return false;
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac'];
  return audioExtensions.includes(getFileExtension(fileName));
};

/**
 * 📝 Vérifie si un fichier est un document Office
 * @param {string} fileName - Nom du fichier
 * @returns {boolean}
 */
export const isOfficeFile = (fileName) => {
  if (!fileName) return false;
  const officeExtensions = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
  return officeExtensions.includes(getFileExtension(fileName));
};

/**
 * 🗜️ Vérifie si un fichier est une archive
 * @param {string} fileName - Nom du fichier
 * @returns {boolean}
 */
export const isArchiveFile = (fileName) => {
  if (!fileName) return false;
  const archiveExtensions = ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'];
  return archiveExtensions.includes(getFileExtension(fileName));
};

/**
 * 🗂️ Retourne une icône emoji selon le type de fichier
 * @param {string} fileName - Nom du fichier
 * @returns {string} Emoji représentant le type
 */
export const getFileIcon = (fileName) => {
  if (!fileName) return '📄';
  
  const ext = getFileExtension(fileName);
  
  // Images
  if (isImageFile(fileName)) return '🖼️';
  
  // Vidéos
  if (isVideoFile(fileName)) return '🎥';
  
  // Audio
  if (isAudioFile(fileName)) return '🎵';
  
  // PDF
  if (isPdfFile(fileName)) return '📕';
  
  // Documents Word
  if (['.doc', '.docx'].includes(ext)) return '📘';
  
  // Feuilles Excel
  if (['.xls', '.xlsx'].includes(ext)) return '📊';
  
  // Présentations PowerPoint
  if (['.ppt', '.pptx'].includes(ext)) return '📙';
  
  // Archives
  if (isArchiveFile(fileName)) return '🗜️';
  
  // Fichiers texte
  if (['.txt', '.csv', '.json', '.xml', '.log'].includes(ext)) return '📝';
  
  // Code source
  if (['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.php', '.html', '.css'].includes(ext)) return '💻';
  
  // Par défaut
  return '📄';
};

/**
 * 📦 Formater la taille d'un fichier en octets vers KB/MB/GB
 * @param {number} bytes - Taille en octets
 * @returns {string} Taille formatée
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  if (bytes < 0) return 'Taille invalide';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  // ✅ Limiter à 2 décimales
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

/**
 * 📥 Télécharger un fichier
 * @param {string} fileUrl - URL du fichier
 * @param {string} fileName - Nom pour le téléchargement
 * @returns {Promise<void>}
 */
export const downloadFile = async (fileUrl, fileName) => {
  if (!fileUrl) {
    throw new Error('URL du fichier manquante');
  }
  
  if (!fileName) {
    throw new Error('Nom du fichier manquant');
  }

  try {
    console.log('📥 Téléchargement:', fileName);
    console.log('🔗 URL:', fileUrl);
    
    // ✅ MÉTHODE 1: Créer un lien <a> temporaire
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // ✅ Ajouter au DOM, cliquer, puis supprimer
    document.body.appendChild(link);
    link.click();
    
    // ✅ Nettoyer après un court délai
    setTimeout(() => {
      document.body.removeChild(link);
      console.log('✅ Téléchargement lancé:', fileName);
    }, 100);
    
  } catch (error) {
    console.error('❌ Erreur téléchargement:', error);
    throw new Error(`Impossible de télécharger ${fileName}: ${error.message}`);
  }
};

/**
 * 🔍 Valider un type MIME
 * @param {string} mimeType - Type MIME à valider
 * @returns {boolean}
 */
export const isValidMimeType = (mimeType) => {
  if (!mimeType) return false;
  
  const validTypes = [
    // Images
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp',
    // Documents
    'application/pdf',
    // Vidéos
    'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm',
    // Audio
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4',
    // Office
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Archives
    'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
    // Texte
    'text/plain', 'text/csv', 'application/json', 'text/xml'
  ];
  
  return validTypes.includes(mimeType);
};

/**
 * 🎨 Obtenir une couleur selon le type de fichier
 * @param {string} fileName - Nom du fichier
 * @returns {string} Classe CSS Tailwind pour la couleur
 */
export const getFileColor = (fileName) => {
  if (!fileName) return 'gray';
  
  if (isImageFile(fileName)) return 'blue';
  if (isVideoFile(fileName)) return 'purple';
  if (isAudioFile(fileName)) return 'pink';
  if (isPdfFile(fileName)) return 'red';
  if (isOfficeFile(fileName)) return 'green';
  if (isArchiveFile(fileName)) return 'yellow';
  
  return 'gray';
};

/**
 * 📊 Obtenir le type de fichier en français
 * @param {string} fileName - Nom du fichier
 * @returns {string} Type en français
 */
export const getFileType = (fileName) => {
  if (!fileName) return 'Fichier';
  
  if (isImageFile(fileName)) return 'Image';
  if (isVideoFile(fileName)) return 'Vidéo';
  if (isAudioFile(fileName)) return 'Audio';
  if (isPdfFile(fileName)) return 'PDF';
  
  const ext = getFileExtension(fileName);
  if (['.doc', '.docx'].includes(ext)) return 'Document Word';
  if (['.xls', '.xlsx'].includes(ext)) return 'Feuille Excel';
  if (['.ppt', '.pptx'].includes(ext)) return 'Présentation';
  if (isArchiveFile(fileName)) return 'Archive';
  if (['.txt'].includes(ext)) return 'Texte';
  if (['.csv'].includes(ext)) return 'CSV';
  if (['.json'].includes(ext)) return 'JSON';
  
  return 'Fichier';
};

/**
 * ✅ Valider un nom de fichier
 * @param {string} fileName - Nom du fichier
 * @returns {object} { valid: boolean, error: string }
 */
export const validateFileName = (fileName) => {
  if (!fileName) {
    return { valid: false, error: 'Nom de fichier manquant' };
  }

  // ✅ Caractères interdits sur Windows
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/g;
  if (invalidChars.test(fileName)) {
    return { valid: false, error: 'Caractères interdits dans le nom' };
  }

  // ✅ Longueur max (255 caractères)
  if (fileName.length > 255) {
    return { valid: false, error: 'Nom trop long (max 255 caractères)' };
  }

  // ✅ Noms réservés Windows
  const reserved = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
  if (reserved.test(nameWithoutExt)) {
    return { valid: false, error: 'Nom de fichier réservé' };
  }

  return { valid: true, error: null };
};

// ✅ EXPORT PAR DÉFAUT POUR COMPATIBILITÉ
export default {
  getFileUrl,
  getFileExtension,
  isImageFile,
  isPdfFile,
  isVideoFile,
  isAudioFile,
  isOfficeFile,
  isArchiveFile,
  getFileIcon,
  formatFileSize,
  downloadFile,
  isValidMimeType,
  getFileColor,
  getFileType,
  validateFileName
};
