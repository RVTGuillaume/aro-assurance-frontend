/**
 * Page 404 - Page non trouvée
 * ARO Assurance Madagascar
 */

import { useNavigate } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import Button from '@components/common/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-aro-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-12 h-12 text-aro-red" />
        </div>

        <h1 className="text-6xl font-heading font-bold text-gray-900 mb-4">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Page non trouvée
        </h2>

        <p className="text-gray-600 mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>

          <Button
            variant="primary"
            icon={Home}
            onClick={() => navigate('/')}
          >
            Accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
