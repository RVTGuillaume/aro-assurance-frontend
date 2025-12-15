import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { declarationApi } from '@/services/declarationApi';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye,
  RefreshCw 
} from 'lucide-react';

const Declarations = () => {
  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDeclarations = async () => {
    try {
      const response = await declarationApi.getMyDeclarations();
      if (response.success) {
        setDeclarations(response.data);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeclarations();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchDeclarations, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (statut) => {
    const badges = {
      en_attente: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      en_traitement: { icon: RefreshCw, color: 'bg-blue-100 text-blue-800', label: 'En traitement' },
      validee: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Validée' },
      refusee: { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Refusée' }
    };

    const { icon: Icon, color, label } = badges[statut] || badges.en_attente;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${color}`}>
        <Icon className="w-4 h-4" />
        {label}
      </span>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mes Déclarations</h1>
        <button
          onClick={() => navigate('/assure/declarations/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Nouvelle Déclaration
        </button>
      </div>

      {declarations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucune déclaration pour le moment</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {declarations.map((decl) => (
            <div key={decl.id} className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-bold text-gray-700">
                      {decl.numero_declaration}
                    </span>
                    {getStatusBadge(decl.statut)}
                  </div>
                  
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Type:</span> {decl.type_sinistre}
                  </p>
                  
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Date du sinistre:</span> {new Date(decl.date_sinistre).toLocaleDateString('fr-FR')}
                  </p>
                  
                  <p className="text-gray-600">
                    <span className="font-medium">Déclarée le:</span> {new Date(decl.date_declaration).toLocaleDateString('fr-FR')}
                  </p>

                  {decl.motif_rejet && (
                    <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                      <p className="text-sm text-red-700">
                        <strong>Motif du refus:</strong> {decl.motif_rejet}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/assure/declarations/${decl.id}`)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Eye className="w-5 h-5" />
                  Voir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Declarations;
