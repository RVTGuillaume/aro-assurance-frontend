/**
 * ✨ NOUVELLE DÉCLARATION ARO - VERSION CORRIGÉE ✨
 * - Ajout du champ "autre_garantie_couvre"
 * - Structure optimisée pour affichage détails
 * - Design responsive & animations
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Upload,
  X,
  Check,
  AlertCircle,
  User,
  Calendar,
  MapPin,
  Activity,
  Heart,
  Hospital,
  Pill,
  Smile,
  ArrowLeft,
  Mail,
  Database,
  CheckCircle,
  Shield,
} from 'lucide-react';
import declarationApi from '../../services/declarationApi';
import SuccessModal from '../../components/SuccessModal';

const NewDeclaration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [declarationData, setDeclarationData] = useState({
    numero: '',
    emailSent: false,
    dbSaved: false,
    filesUploading: false
  });
  
  const [formData, setFormData] = useState({
    adresse_assure: '',
    personne_soignee_nom: '',
    personne_soignee_profession: '',
    personne_soignee_age: '',
    personne_soignee_parente: '',
    autre_garantie_couvre: '', // ✅ PRÉSENT
    type_sinistre: '',
    // Accident
    accident_date: '',
    accident_lieu: '',
    accident_constate_par: '',
    accident_circonstances: '',
    accident_blessures: '',
    accident_soigne_par: '',
    // Maladie
    maladie_type: '',
    maladie_code_oms: '',
    maladie_designation: '',
    maladie_soignee_par: '',
    maladie_date_debut: '',
    // Hospitalisation
    hospitalisation_etablissement: '',
    hospitalisation_date_debut: '',
    hospitalisation_date_fin: '',
    hospitalisation_operation_par: '',
    hospitalisation_description: '',
    // Soins dentaires
    soins_dentaires_date_debut: '',
    soins_dentaires_date_fin: '',
    soins_dentaires_effectues_par: '',
  });

  const [fichiers, setFichiers] = useState([]);
  const [errors, setErrors] = useState({});
  const [sendOptions, setSendOptions] = useState({
    sendEmail: true,
    saveToDb: true,
  });

  // 🎭 ANIMATIONS
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.48, 0.15, 0.25, 0.96],
      },
    },
  };

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.02,
      y: -5,
      transition: { duration: 0.3 },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.48, 0.15, 0.25, 0.96],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  };

  // TYPES DE SINISTRES
  const TYPES_SINISTRES = [
    {
      value: 'accident',
      label: 'Accident',
      icon: Activity,
      gradient: 'from-red-500 to-orange-500',
      bgGradient: 'from-red-50 to-orange-50',
      borderColor: 'border-red-300',
      description: 'Accident corporel, collision, chute...',
    },
    {
      value: 'maladie',
      label: 'Maladie',
      icon: Heart,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300',
      description: 'Maladie, ophtalmologie...',
    },
    {
      value: 'hospitalisation',
      label: 'Hospitalisation',
      icon: Hospital,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      description: 'Séjour hospitalier, opération...',
    },
    {
      value: 'soins_dentaires',
      label: 'Soins Dentaires',
      icon: Smile,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-300',
      description: 'Soins, prothèses, orthodontie...',
    },
  ];

  // Gérer les changements
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Gérer les fichiers
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 15 * 1024 * 1024 * 1024;
    const validFiles = selectedFiles.filter((file) => file.size <= maxSize);

    if (selectedFiles.length > validFiles.length) {
      alert(
        `⚠️ ${selectedFiles.length - validFiles.length} fichier(s) dépassent 15 Go`
      );
    }

    setFichiers((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFichiers((prev) => prev.filter((_, i) => i !== index));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.adresse_assure.trim())
      newErrors.adresse_assure = 'Adresse obligatoire';
    if (!formData.personne_soignee_nom.trim())
      newErrors.personne_soignee_nom = 'Nom obligatoire';
    if (!formData.personne_soignee_age)
      newErrors.personne_soignee_age = 'Âge obligatoire';
    if (!formData.personne_soignee_parente)
      newErrors.personne_soignee_parente = 'Parenté obligatoire';
    if (!formData.type_sinistre) newErrors.type_sinistre = 'Type obligatoire';

    if (formData.type_sinistre === 'accident') {
      if (!formData.accident_date) newErrors.accident_date = 'Date obligatoire';
      if (!formData.accident_circonstances.trim())
        newErrors.accident_circonstances = 'Circonstances obligatoires';
    }

    if (formData.type_sinistre === 'maladie') {
      if (!formData.maladie_date_debut)
        newErrors.maladie_date_debut = 'Date obligatoire';
    }

    if (formData.type_sinistre === 'hospitalisation') {
      if (!formData.hospitalisation_etablissement.trim())
        newErrors.hospitalisation_etablissement = 'Établissement obligatoire';
      if (!formData.hospitalisation_date_debut)
        newErrors.hospitalisation_date_debut = 'Date obligatoire';
    }

    if (formData.type_sinistre === 'soins_dentaires') {
      if (!formData.soins_dentaires_date_debut)
        newErrors.soins_dentaires_date_debut = 'Date obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Ouvrir modal de confirmation
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }

    setShowConfirmModal(true);
  };

  // Soumettre après confirmation
  const handleConfirmedSubmit = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    
    try {
      const result = await declarationApi.createDeclaration(
        formData,
        fichiers,
        sendOptions
      );
      
      setLoading(false);
      
      // ✅ MISE À JOUR DES DONNÉES POUR LE MODAL
      setDeclarationData({
        numero: result.data.numero_declaration,
        emailSent: sendOptions.sendEmail,
        dbSaved: sendOptions.saveToDb,
        filesUploading: fichiers.length > 0
      });
      
      // ✅ AFFICHE LE MODAL DE SUCCÈS
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      setLoading(false);
      alert('❌ Erreur lors de la création de la déclaration');
    }
  };

  // ✅ FONCTION DE FERMETURE
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    // Réinitialiser le formulaire
    setFormData({
      adresse_assure: '',
      personne_soignee_nom: '',
      personne_soignee_profession: '',
      personne_soignee_age: '',
      personne_soignee_parente: '',
      autre_garantie_couvre: '',
      type_sinistre: '',
      accident_date: '',
      accident_lieu: '',
      accident_constate_par: '',
      accident_circonstances: '',
      accident_blessures: '',
      accident_soigne_par: '',
      maladie_type: '',
      maladie_code_oms: '',
      maladie_designation: '',
      maladie_soignee_par: '',
      maladie_date_debut: '',
      hospitalisation_etablissement: '',
      hospitalisation_date_debut: '',
      hospitalisation_date_fin: '',
      hospitalisation_operation_par: '',
      hospitalisation_description: '',
      soins_dentaires_date_debut: '',
      soins_dentaires_date_fin: '',
      soins_dentaires_effectues_par: '',
    });
    setFichiers([]);
    setErrors({});
    // Retour au dashboard
    navigate('/assure/dashboard');
  };
 
  // Format taille fichier
  const formatFileSize = (bytes) => {
    const k = 1024;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 py-4 sm:py-8">
      <div className="container-aro px-4">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
              <motion.img
                src="/AROO.png"
                alt="Assurance ARO"
                className="h-20 sm:h-24 lg:h-28 w-auto object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                onError={(e) => { e.target.src = '/AROO.jpg'; }}
              />
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-clip-text text-transparent">
                  Nouvelle Déclaration
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Remplissez le formulaire ci-dessous
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/assure/dashboard')}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-green-200 text-green-700 rounded-xl shadow-md hover:shadow-lg transition-all text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Retour
            </motion.button>
          </div>
        </motion.div>

        {/* FORMULAIRE */}
        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleFormSubmit}
          className="space-y-4 sm:space-y-6"
        >
          {/* INFORMATIONS GÉNÉRALES */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-green-100"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Informations Générales
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse de l'assuré *
                </label>
                <input
                  type="text"
                  name="adresse_assure"
                  value={formData.adresse_assure}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-sm sm:text-base"
                  placeholder="Votre adresse complète"
                />
                {errors.adresse_assure && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    {errors.adresse_assure}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom de la personne soignée *
                </label>
                <input
                  type="text"
                  name="personne_soignee_nom"
                  value={formData.personne_soignee_nom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-sm sm:text-base"
                  placeholder="Nom complet"
                />
                {errors.personne_soignee_nom && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.personne_soignee_nom}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Profession
                </label>
                <input
                  type="text"
                  name="personne_soignee_profession"
                  value={formData.personne_soignee_profession}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-sm sm:text-base"
                  placeholder="Profession"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Âge *
                </label>
                <input
                  type="number"
                  name="personne_soignee_age"
                  value={formData.personne_soignee_age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-sm sm:text-base"
                  min="0"
                  max="150"
                />
                {errors.personne_soignee_age && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.personne_soignee_age}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lien de parenté *
                </label>
                <select
                  name="personne_soignee_parente"
                  value={formData.personne_soignee_parente}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-sm sm:text-base"
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="Assuré(e)">Assuré(e)</option>
                  <option value="Conjoint(e)">Conjoint(e)</option>
                  <option value="Enfant">Enfant</option>
                  <option value="Parent">Parent</option>
                  <option value="Autre">Autre</option>
                </select>
                {errors.personne_soignee_parente && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.personne_soignee_parente}
                  </p>
                )}
              </div>

              {/* ✅ AJOUT DU CHAMP AUTRE_GARANTIE_COUVRE */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  Autre garantie couvrant le sinistre
                </label>
                <textarea
                  name="autre_garantie_couvre"
                  value={formData.autre_garantie_couvre}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-sm sm:text-base"
                  placeholder="Précisez si une autre assurance ou garantie couvre ce sinistre (optionnel)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si vous bénéficiez d'une autre couverture, veuillez le mentionner ici
                </p>
              </div>
            </div>
          </motion.div>

          {/* TYPE DE SINISTRE */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-green-100"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Type de Sinistre *
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {TYPES_SINISTRES.map((type, index) => {
                const Icon = type.icon;
                const isSelected = formData.type_sinistre === type.value;

                return (
                  <motion.div
                    key={type.value}
                    custom={index}
                    variants={cardHoverVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        type_sinistre: type.value,
                      }))
                    }
                    className={`
                      relative p-4 sm:p-6 rounded-2xl cursor-pointer border-2 transition-all
                      ${
                        isSelected
                          ? `bg-gradient-to-br ${type.bgGradient} ${type.borderColor} border-3 shadow-lg`
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${type.gradient} shadow-lg flex-shrink-0`}
                      >
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                          {type.label}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {type.description}
                        </p>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 sm:top-4 sm:right-4"
                        >
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {errors.type_sinistre && (
              <p className="text-red-500 text-xs sm:text-sm mt-4 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                {errors.type_sinistre}
              </p>
            )}
          </motion.div>

          {/* SECTIONS CONDITIONNELLES */}
          <AnimatePresence>
            {/* ACCIDENT */}
            {formData.type_sinistre === 'accident' && (
              <motion.div
                key="accident"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-red-200"
              >
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                  <h2 className="text-xl sm:text-2xl font-bold text-red-900">
                    Détails de l'Accident
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="accident_date"
                      value={formData.accident_date}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-sm sm:text-base"
                    />
                    {errors.accident_date && (
                      <p className="text-red-600 text-xs sm:text-sm mt-1">
                        {errors.accident_date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Lieu
                    </label>
                    <input
                      type="text"
                      name="accident_lieu"
                      value={formData.accident_lieu}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 transition-all text-sm sm:text-base"
                      placeholder="Lieu de l'accident"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Témoin(s)
                    </label>
                    <input
                      type="text"
                      name="accident_constate_par"
                      value={formData.accident_constate_par}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 transition-all text-sm sm:text-base"
                      placeholder="Nom des témoins"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Soigné par
                    </label>
                    <input
                      type="text"
                      name="accident_soigne_par"
                      value={formData.accident_soigne_par}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 transition-all text-sm sm:text-base"
                      placeholder="Médecin, établissement..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Blessures
                    </label>
                    <textarea
                      name="accident_blessures"
                      value={formData.accident_blessures}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 transition-all text-sm sm:text-base"
                      placeholder="Décrivez les blessures..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Circonstances *
                    </label>
                    <textarea
                      name="accident_circonstances"
                      value={formData.accident_circonstances}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 transition-all text-sm sm:text-base"
                      placeholder="Décrivez les circonstances..."
                    />
                    {errors.accident_circonstances && (
                      <p className="text-red-600 text-xs sm:text-sm mt-1">
                        {errors.accident_circonstances}
                      </p>
                    )}
                  </div>

                  {/* UPLOAD FICHIERS */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                      Pièces justificatives
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept="*/*"
                        className="hidden"
                        id="file-upload-accident"
                      />
                      <label
                        htmlFor="file-upload-accident"
                        className="flex flex-col items-center justify-center w-full px-4 py-6 sm:py-8 border-2 border-dashed border-red-300 rounded-xl bg-white hover:bg-red-50 transition-all cursor-pointer group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 mb-3 group-hover:text-red-600 transition-colors" />
                        </motion.div>
                        <p className="text-sm sm:text-base font-semibold text-gray-700 mb-1">
                          Sélectionner des fichiers
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          PDF, Images, Vidéos... (max 15 Go/fichier)
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* MALADIE */}
            {formData.type_sinistre === 'maladie' && (
              <motion.div
                key="maladie"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-blue-200"
              >
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-900">
                    Détails de la Maladie
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      name="maladie_type"
                      value={formData.maladie_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 transition-all text-sm sm:text-base"
                    >
                      <option value="">-- Sélectionner --</option>
                      <option value="maladie">Maladie générale</option>
                      <option value="ophtalmologie">Ophtalmologie</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date de début *
                    </label>
                    <input
                      type="date"
                      name="maladie_date_debut"
                      value={formData.maladie_date_debut}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 transition-all text-sm sm:text-base"
                    />
                    {errors.maladie_date_debut && (
                      <p className="text-red-600 text-xs sm:text-sm mt-1">
                        {errors.maladie_date_debut}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Code OMS
                    </label>
                    <input
                      type="text"
                      name="maladie_code_oms"
                      value={formData.maladie_code_oms}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 transition-all text-sm sm:text-base"
                      placeholder="Ex: A00.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Désignation
                    </label>
                    <input
                      type="text"
                      name="maladie_designation"
                      value={formData.maladie_designation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 transition-all text-sm sm:text-base"
                      placeholder="Ex: Grippe"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Soigné par
                    </label>
                    <input
                      type="text"
                      name="maladie_soignee_par"
                      value={formData.maladie_soignee_par}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 transition-all text-sm sm:text-base"
                      placeholder="Nom du médecin..."
                    />
                  </div>

                  {/* UPLOAD FICHIERS */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      Pièces justificatives
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept="*/*"
                        className="hidden"
                        id="file-upload-maladie"
                      />
                      <label
                        htmlFor="file-upload-maladie"
                        className="flex flex-col items-center justify-center w-full px-4 py-6 sm:py-8 border-2 border-dashed border-blue-300 rounded-xl bg-white hover:bg-blue-50 transition-all cursor-pointer group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mb-3 group-hover:text-blue-600 transition-colors" />
                        </motion.div>
                        <p className="text-sm sm:text-base font-semibold text-gray-700 mb-1">
                          Sélectionner des fichiers
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Ordonnances, résultats d'examens...
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* HOSPITALISATION */}
            {formData.type_sinistre === 'hospitalisation' && (
              <motion.div
                key="hospitalisation"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-green-200"
              >
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <Hospital className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  <h2 className="text-xl sm:text-2xl font-bold text-green-900">
                    Détails de l'Hospitalisation
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Établissement *
                    </label>
                    <input
                      type="text"
                      name="hospitalisation_etablissement"
                      value={formData.hospitalisation_etablissement}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 transition-all text-sm sm:text-base"
                      placeholder="Nom de l'hôpital/clinique"
                    />
                    {errors.hospitalisation_etablissement && (
                      <p className="text-red-600 text-xs sm:text-sm mt-1">
                        {errors.hospitalisation_etablissement}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date d'entrée *
                    </label>
                    <input
                      type="date"
                      name="hospitalisation_date_debut"
                      value={formData.hospitalisation_date_debut}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 transition-all text-sm sm:text-base"
                    />
                    {errors.hospitalisation_date_debut && (
                      <p className="text-red-600 text-xs sm:text-sm mt-1">
                        {errors.hospitalisation_date_debut}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date de sortie
                    </label>
                    <input
                      type="date"
                      name="hospitalisation_date_fin"
                      value={formData.hospitalisation_date_fin}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 transition-all text-sm sm:text-base"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Opération effectuée par
                    </label>
                    <input
                      type="text"
                      name="hospitalisation_operation_par"
                      value={formData.hospitalisation_operation_par}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 transition-all text-sm sm:text-base"
                      placeholder="Nom du chirurgien..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="hospitalisation_description"
                      value={formData.hospitalisation_description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 transition-all text-sm sm:text-base"
                      placeholder="Détails de l'hospitalisation..."
                    />
                  </div>

                  {/* UPLOAD FICHIERS */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      Pièces justificatives
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept="*/*"
                        className="hidden"
                        id="file-upload-hospitalisation"
                      />
                      <label
                        htmlFor="file-upload-hospitalisation"
                        className="flex flex-col items-center justify-center w-full px-4 py-6 sm:py-8 border-2 border-dashed border-green-300 rounded-xl bg-white hover:bg-green-50 transition-all cursor-pointer group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mb-3 group-hover:text-green-600 transition-colors" />
                        </motion.div>
                        <p className="text-sm sm:text-base font-semibold text-gray-700 mb-1">
                          Sélectionner des fichiers
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Bulletins, factures, certificats...
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SOINS DENTAIRES */}
            {formData.type_sinistre === 'soins_dentaires' && (
              <motion.div
                key="soins_dentaires"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-purple-200"
              >
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <Smile className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                  <h2 className="text-xl sm:text-2xl font-bold text-purple-900">
                    Détails des Soins Dentaires
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date de début *
                    </label>
                    <input
                      type="date"
                      name="soins_dentaires_date_debut"
                      value={formData.soins_dentaires_date_debut}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 transition-all text-sm sm:text-base"
                    />
                    {errors.soins_dentaires_date_debut && (
                      <p className="text-red-600 text-xs sm:text-sm mt-1">
                        {errors.soins_dentaires_date_debut}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      name="soins_dentaires_date_fin"
                      value={formData.soins_dentaires_date_fin}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 transition-all text-sm sm:text-base"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Effectués par
                    </label>
                    <input
                      type="text"
                      name="soins_dentaires_effectues_par"
                      value={formData.soins_dentaires_effectues_par}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 transition-all text-sm sm:text-base"
                      placeholder="Nom du dentiste..."
                    />
                  </div>

                  {/* UPLOAD FICHIERS */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      Pièces justificatives
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept="*/*"
                        className="hidden"
                        id="file-upload-dentaire"
                      />
                      <label
                        htmlFor="file-upload-dentaire"
                        className="flex flex-col items-center justify-center w-full px-4 py-6 sm:py-8 border-2 border-dashed border-purple-300 rounded-xl bg-white hover:bg-purple-50 transition-all cursor-pointer group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 mb-3 group-hover:text-purple-600 transition-colors" />
                        </motion.div>
                        <p className="text-sm sm:text-base font-semibold text-gray-700 mb-1">
                          Sélectionner des fichiers
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Devis, factures, ordonnances...
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* LISTE FICHIERS */}
          {fichiers.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-green-100"
            >
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Fichiers ({fichiers.length})
              </h2>
              <div className="space-y-2">
                {fichiers.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                      <span className="font-medium text-gray-900 truncate text-sm sm:text-base">
                        {file.name}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFile(index)}
                      className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors flex-shrink-0 ml-2"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* BOUTONS */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/assure/dashboard')}
              disabled={loading}
              className="flex-1 py-3 sm:py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 text-sm sm:text-base"
            >
              Annuler
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  Soumettre la déclaration
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </div>

      {/* MODAL DE CONFIRMATION */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Confirmation
                  </h3>
                  <p className="text-sm text-gray-600">
                    Choisissez les options d'envoi
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    sendOptions.sendEmail
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={sendOptions.sendEmail}
                    onChange={(e) =>
                      setSendOptions((prev) => ({
                        ...prev,
                        sendEmail: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        Envoyer par email
                      </p>
                      <p className="text-xs text-gray-600">
                        à l'administrateur
                      </p>
                    </div>
                  </div>
                </motion.label>

                <motion.label
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    sendOptions.saveToDb
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={sendOptions.saveToDb}
                    onChange={(e) =>
                      setSendOptions((prev) => ({
                        ...prev,
                        saveToDb: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <Database className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        Enregistrer dans la base
                      </p>
                      <p className="text-xs text-gray-600">
                        Liste des déclarations
                      </p>
                    </div>
                  </div>
                </motion.label>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all text-sm sm:text-base"
                >
                  Annuler
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmedSubmit}
                  disabled={!sendOptions.sendEmail && !sendOptions.saveToDb}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Confirmer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DE SUCCÈS */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        declarationNumber={declarationData.numero}
        emailSent={declarationData.emailSent}
        dbSaved={declarationData.dbSaved}
        filesUploading={declarationData.filesUploading}
      />
    </div>
  );
};

export default NewDeclaration;
