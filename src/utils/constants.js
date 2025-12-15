/**
 * Constantes de l'application
 * ARO Assurance Madagascar
 * @version CORRIGÉE - Sans Ophtalmologie
 */

// Types de sinistre
export const TYPE_SINISTRE = {
  MALADIE: 'maladie',
  ACCIDENT: 'accident',
  HOSPITALISATION: 'hospitalisation',
  SOINS_DENTAIRES: 'soins_dentaires',
};

export const TYPE_SINISTRE_LABELS = {
  [TYPE_SINISTRE.MALADIE]: 'Maladie',
  [TYPE_SINISTRE.ACCIDENT]: 'Accident',
  [TYPE_SINISTRE.HOSPITALISATION]: 'Hospitalisation',
  [TYPE_SINISTRE.SOINS_DENTAIRES]: 'Soins dentaires',
};

// Statuts de déclaration
export const STATUT_DECLARATION = {
  EN_ATTENTE: 'en_attente',
  EN_TRAITEMENT: 'en_traitement',
  VALIDEE: 'validee',
  REFUSEE: 'refusee',
  COMPLEMENTS_REQUIS: 'complements_requis',
};

export const STATUT_DECLARATION_LABELS = {
  [STATUT_DECLARATION.EN_ATTENTE]: 'En attente',
  [STATUT_DECLARATION.EN_TRAITEMENT]: 'En traitement',
  [STATUT_DECLARATION.VALIDEE]: 'Validée',
  [STATUT_DECLARATION.REFUSEE]: 'Refusée',
  [STATUT_DECLARATION.COMPLEMENTS_REQUIS]: 'Compléments requis',
};

export const STATUT_DECLARATION_COLORS = {
  [STATUT_DECLARATION.EN_ATTENTE]: 'warning',
  [STATUT_DECLARATION.EN_TRAITEMENT]: 'info',
  [STATUT_DECLARATION.VALIDEE]: 'success',
  [STATUT_DECLARATION.REFUSEE]: 'error',
  [STATUT_DECLARATION.COMPLEMENTS_REQUIS]: 'warning',
};

// Statuts de contrat
export const STATUT_CONTRAT = {
  ACTIF: 'actif',
  SUSPENDU: 'suspendu',
  RESILIE: 'resilie',
  EXPIRE: 'expire',
};

export const STATUT_CONTRAT_LABELS = {
  [STATUT_CONTRAT.ACTIF]: 'Actif',
  [STATUT_CONTRAT.SUSPENDU]: 'Suspendu',
  [STATUT_CONTRAT.RESILIE]: 'Résilié',
  [STATUT_CONTRAT.EXPIRE]: 'Expiré',
};

// Types d'assuré
export const TYPE_ASSURE = {
  TITULAIRE: 'titulaire',
  AYANT_DROIT: 'ayant_droit',
};

export const TYPE_ASSURE_LABELS = {
  [TYPE_ASSURE.TITULAIRE]: 'Titulaire',
  [TYPE_ASSURE.AYANT_DROIT]: 'Ayant-droit',
};

// Parentés
export const PARENTE_OPTIONS = [
  { value: 'conjoint', label: 'Conjoint(e)' },
  { value: 'enfant', label: 'Enfant' },
  { value: 'parent', label: 'Parent' },
  { value: 'autre', label: 'Autre' },
];

// Catégories de documents
export const CATEGORIE_DOCUMENT = {
  ORDONNANCE: 'ordonnance',
  FACTURE: 'facture',
  CERTIFICAT_MEDICAL: 'certificat_medical',
  RADIO: 'radio',
  AUTRE: 'autre',
};

export const CATEGORIE_DOCUMENT_LABELS = {
  [CATEGORIE_DOCUMENT.ORDONNANCE]: 'Ordonnance',
  [CATEGORIE_DOCUMENT.FACTURE]: 'Facture',
  [CATEGORIE_DOCUMENT.CERTIFICAT_MEDICAL]: 'Certificat médical',
  [CATEGORIE_DOCUMENT.RADIO]: 'Radio/Imagerie',
  [CATEGORIE_DOCUMENT.AUTRE]: 'Autre',
};

// Rôles administrateur
export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  GESTIONNAIRE: 'gestionnaire',
};

export const ADMIN_ROLES_LABELS = {
  [ADMIN_ROLES.SUPER_ADMIN]: 'Super Administrateur',
  [ADMIN_ROLES.ADMIN]: 'Administrateur',
  [ADMIN_ROLES.GESTIONNAIRE]: 'Gestionnaire',
};

// Agences ARO
export const AGENCES = [
  { value: 'antananarivo', label: 'Antananarivo' },
  { value: 'antsirabe', label: 'Antsirabe' },
  { value: 'mahajanga', label: 'Mahajanga' },
  { value: 'toamasina', label: 'Toamasina' },
  { value: 'fianarantsoa', label: 'Fianarantsoa' },
  { value: 'toliara', label: 'Toliara' },
  { value: 'antsiranana', label: 'Antsiranana' },
];

// Configuration upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 10,
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.pdf'],
};

// Messages
export const MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie !',
  LOGIN_ERROR: 'Identifiants incorrects',
  LOGOUT_SUCCESS: 'Déconnexion réussie',
  DECLARATION_CREATED: 'Déclaration créée avec succès',
  DECLARATION_UPDATED: 'Déclaration mise à jour',
  DECLARATION_DELETED: 'Déclaration supprimée',
  FILE_UPLOAD_SUCCESS: 'Fichier(s) uploadé(s) avec succès',
  FILE_UPLOAD_ERROR: 'Erreur lors de l\'upload',
  GENERIC_ERROR: 'Une erreur est survenue',
  NETWORK_ERROR: 'Erreur de connexion au serveur',
};

// Patterns regex
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_MG: /^(\+261|0)(3[2-49]|2[0-9])\s?\d{2}\s?\d{3}\s?\d{2}$/,
  NUMERO_DOSSIER: /^DOS-\d{4}-\d{6}$/,
  NUMERO_POLICE: /^POL-\d{6}$/,
  NUMERO_COMPTE: /^CPT-\d{6}$/,
};

export default {
  TYPE_SINISTRE,
  TYPE_SINISTRE_LABELS,
  STATUT_DECLARATION,
  STATUT_DECLARATION_LABELS,
  STATUT_DECLARATION_COLORS,
  STATUT_CONTRAT,
  STATUT_CONTRAT_LABELS,
  TYPE_ASSURE,
  TYPE_ASSURE_LABELS,
  PARENTE_OPTIONS,
  CATEGORIE_DOCUMENT,
  CATEGORIE_DOCUMENT_LABELS,
  ADMIN_ROLES,
  ADMIN_ROLES_LABELS,
  AGENCES,
  UPLOAD_CONFIG,
  MESSAGES,
  PATTERNS,
};
