/**
 * =====================================
 * ✨ SUCCESS MODAL - GLASSMORPHISM
 * =====================================
 * Style : Apple Glassmorphism Design
 * Animations : Framer Motion
 * Design : Modern & Professional
 */

import React, { useEffect } from 'react';
import { CheckCircle, X, FileText, Mail, Database, Upload } from 'lucide-react';
import './SuccessModal.css';

const SuccessModal = ({ 
  isOpen, 
  onClose, 
  declarationNumber,
  emailSent = false,
  dbSaved = false,
  filesUploading = false
}) => {
  
  // ✅ Fermeture avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Bloque le scroll
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container glassmorphism" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* ✅ ICÔNE DE SUCCÈS ANIMÉE */}
        <div className="success-icon-wrapper">
          <div className="success-circle-bg"></div>
          <CheckCircle className="success-icon" size={64} />
        </div>

        {/* ✅ TITRE */}
        <h2 className="modal-title">
          Déclaration créée avec succès !
        </h2>

        {/* ✅ NUMÉRO DE DÉCLARATION */}
        <div className="declaration-number-card">
          <FileText size={20} className="card-icon" />
          <div className="card-content">
            <span className="card-label">Numéro de déclaration</span>
            <span className="card-value">{declarationNumber}</span>
          </div>
        </div>

        {/* ✅ STATUTS */}
        <div className="status-list">
          {/* Email */}
          <div className={`status-item ${emailSent ? 'success' : 'pending'}`}>
            <Mail size={18} />
            <span>Email : {emailSent ? 'Envoyé' : 'En cours...'}</span>
            {emailSent && <span className="status-badge">✓</span>}
          </div>

          {/* Base de données */}
          <div className={`status-item ${dbSaved ? 'success' : 'pending'}`}>
            <Database size={18} />
            <span>Base de données : {dbSaved ? 'Enregistré' : 'En cours...'}</span>
            {dbSaved && <span className="status-badge">✓</span>}
          </div>

          {/* Upload fichiers */}
          {filesUploading && (
            <div className="status-item pending">
              <Upload size={18} />
              <span>Upload des fichiers : En arrière-plan</span>
              <div className="spinner-small"></div>
            </div>
          )}
        </div>

        {/* ✅ BOUTON OK (Style Apple) */}
        <button 
          className="modal-btn-primary" 
          onClick={onClose}
          autoFocus
        >
          <span>Compris</span>
          <div className="btn-shine"></div>
        </button>

        {/* ✅ BOUTON FERMER (X) */}
        <button 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Fermer"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
