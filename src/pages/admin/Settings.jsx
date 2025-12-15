/**
 * Paramètres Admin
 * ARO Assurance Madagascar
 */

import Card from '@components/common/Card';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-aro">
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8">
          Paramètres
        </h1>

        <Card>
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="w-6 h-6 text-gray-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Configuration du système
            </h2>
          </div>

          <p className="text-gray-600">
            Page de paramètres en cours de développement...
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
