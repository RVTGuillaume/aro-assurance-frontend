import { useState } from 'react';
import { motion } from 'framer-motion';
import adminService from '../../services/adminService';

export default function StatusToggle({ initialStatus, adminId, onStatusChange }) {
  const [isActive, setIsActive] = useState(initialStatus === 'actif');
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const newStatus = !isActive;

    try {
      await adminService.updateStatus(adminId, newStatus ? 'actif' : 'inactif');
      setIsActive(newStatus);
      if (onStatusChange) onStatusChange(newStatus ? 'actif' : 'inactif');
    } catch (error) {
      console.error('Erreur changement statut:', error);
      alert('Erreur lors du changement de statut');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">
        {isActive ? 'Actif' : 'Inactif'}
      </span>
      
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`relative w-14 h-7 rounded-full transition-colors ${
          isActive ? 'bg-emerald-500' : 'bg-gray-300'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <motion.div
          animate={{ x: isActive ? 28 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
        />
      </button>
    </div>
  );
}
