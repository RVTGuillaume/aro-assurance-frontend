/**
 * Création d'un nouvel assuré - Admin
 * Formulaire complet d'inscription
 * ARO Assurance Madagascar
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { adminApi } from '@api/adminApi';
import { useNotification } from '@hooks/useNotification';
import { ArrowLeft, Save, User, Shield } from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Select from '@components/common/Select';
import Alert from '@components/common/Alert';
import {
  TYPE_ASSURE,
  TYPE_ASSURE_LABELS,
  PARENTE_OPTIONS,
  AGENCES,
} from '@utils/constants';

// Schéma de validation
const schema = yup.object({
  // Identité
  nom: yup.string().required('Nom requis').min(2, 'Minimum 2 caractères'),
  prenom: yup.string().required('Prénom requis').min(2, 'Minimum 2 caractères'),
  date_naissance: yup
    .date()
    .required('Date de naissance requise')
    .max(new Date(), 'Date invalide'),
  lieu_naissance: yup
    .string()
    .required('Lieu de naissance requis')
    .min(2, 'Minimum 2 caractères'),
  sexe: yup.string().required('Sexe requis').oneOf(['M', 'F']),
  
  // Contact
  email: yup
    .string()
    .required('Email requis')
    .email('Email invalide'),
  telephone: yup
    .string()
    .required('Téléphone requis')
    .matches(/^(\+261|0)(3[2-49]|2[0-9])\s?\d{2}\s?\d{3}\s?\d{2}$/, 'Format invalide'),
  adresse: yup
    .string()
    .required('Adresse requise')
    .min(10, 'Minimum 10 caractères'),
  
  // Contrat
  numero_police: yup
    .string()
    .required('Numéro de police requis')
    .matches(/^POL-\d{6}$/, 'Format: POL-123456'),
  numero_compte: yup
    .string()
    .required('Numéro de compte requis')
    .matches(/^CPT-\d{6}$/, 'Format: CPT-123456'),
  type_assure: yup
    .string()
    .required('Type d\'assuré requis')
    .oneOf(Object.values(TYPE_ASSURE)),
  
  // Champs conditionnels pour ayant-droit
  titulaire_id: yup.number().when('type_assure', {
    is: TYPE_ASSURE.AYANT_DROIT,
    then: (schema) => schema.required('Titulaire requis').positive(),
    otherwise: (schema) => schema.nullable(),
  }),
  parente: yup.string().when('type_assure', {
    is: TYPE_ASSURE.AYANT_DROIT,
    then: (schema) => schema.required('Parenté requise'),
    otherwise: (schema) => schema.nullable(),
  }),
  
  // Agence
  agence: yup.string().required('Agence requise'),
});

const CreateAssure = () => {
  const navigate = useNavigate();
  const notification = useNotification();
  const [loading, setLoading] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type_assure: TYPE_ASSURE.TITULAIRE,
      sexe: '',
      agence: '',
    },
  });

  const typeAssure = watch('type_assure');

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await adminApi.createAssure(data);

      if (response.success) {
        setGeneratedCredentials(response.data.identifiants);
        notification.success('Assuré créé avec succès !');
      } else {
        notification.error(response.message);
      }
    } catch (error) {
      notification.error(
        error.response?.data?.message || 'Erreur lors de la création'
      );
    } finally {
      setLoading(false);
    }
  };

  // Si identifiants générés, afficher le récapitulatif
  if (generatedCredentials) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-aro max-w-3xl">
          <Card>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                Assuré créé avec succès ! 🎉
              </h1>
              <p className="text-gray-600">
                Transmettez ces identifiants à l'assuré
              </p>
            </div>

            <Alert type="success" className="mb-6">
              <p className="font-medium mb-2">
                ⚠️ Important : Ces identifiants ne seront affichés qu'une seule fois !
              </p>
              <p className="text-sm">
                Assurez-vous de les copier ou de les envoyer à l'assuré avant de quitter cette page.
              </p>
            </Alert>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4 mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Numéro de dossier</p>
                  <p className="font-mono font-semibold text-lg text-gray-900">
                    {generatedCredentials.numero_dossier}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Numéro de police</p>
                  <p className="font-mono font-semibold text-lg text-gray-900">
                    {generatedCredentials.numero_police}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Numéro de compte</p>
                  <p className="font-mono font-semibold text-lg text-gray-900">
                    {generatedCredentials.numero_compte}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nom complet</p>
                  <p className="font-semibold text-lg text-gray-900">
                    {generatedCredentials.nom_complet}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  // Copier dans le presse-papier
                  const text = `Vos identifiants ARO Assurance:\n\nNuméro de dossier: ${generatedCredentials.numero_dossier}\nNuméro de police: ${generatedCredentials.numero_police}\nNuméro de compte: ${generatedCredentials.numero_compte}\nNom complet: ${generatedCredentials.nom_complet}`;
                  navigator.clipboard.writeText(text);
                  notification.success('Identifiants copiés !');
                }}
              >
                📋 Copier les identifiants
              </Button>

              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate('/admin/assures')}
              >
                Retour à la liste des assurés
              </Button>

              <Button
                variant="ghost"
                fullWidth
                onClick={() => {
                  setGeneratedCredentials(null);
                  window.location.reload();
                }}
              >
                Créer un autre assuré
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-aro max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/assures')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-aro-red transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la liste
          </button>

          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            Créer un nouvel assuré
          </h1>
          <p className="text-gray-600">
            Remplissez tous les champs pour créer un compte assuré
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Informations personnelles */}
          <Card className="mb-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-gray-500" />
              <h2 className="text-xl font-semibold text-gray-900">
                Informations personnelles
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Nom"
                name="nom"
                required
                error={errors.nom?.message}
                {...register('nom')}
              />

              <Input
                label="Prénom"
                name="prenom"
                required
                error={errors.prenom?.message}
                {...register('prenom')}
              />

              <Input
                label="Date de naissance"
                type="date"
                name="date_naissance"
                required
                error={errors.date_naissance?.message}
                {...register('date_naissance')}
              />

              <Input
                label="Lieu de naissance"
                name="lieu_naissance"
                placeholder="Ex: Antananarivo"
                required
                error={errors.lieu_naissance?.message}
                {...register('lieu_naissance')}
              />

              <Select
                label="Sexe"
                name="sexe"
                required
                error={errors.sexe?.message}
                options={[
                  { value: 'M', label: 'Masculin' },
                  { value: 'F', label: 'Féminin' },
                ]}
                {...register('sexe')}
              />
            </div>
          </Card>

          {/* Coordonnées */}
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Coordonnées
            </h2>

            <div className="space-y-6">
              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="exemple@email.com"
                required
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Téléphone"
                type="tel"
                name="telephone"
                placeholder="034 12 345 67"
                required
                helpText="Format: 034 12 345 67 ou +261 34 12 345 67"
                error={errors.telephone?.message}
                {...register('telephone')}
              />

              <Input
                label="Adresse complète"
                name="adresse"
                placeholder="Ex: Lot 123, Quartier Analakely, Antananarivo"
                required
                error={errors.adresse?.message}
                {...register('adresse')}
              />
            </div>
          </Card>

          {/* Informations de contrat */}
          <Card className="mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-gray-500" />
              <h2 className="text-xl font-semibold text-gray-900">
                Informations du contrat
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Numéro de police"
                name="numero_police"
                placeholder="POL-123456"
                required
                helpText="Format: POL-XXXXXX"
                error={errors.numero_police?.message}
                {...register('numero_police')}
              />

              <Input
                label="Numéro de compte"
                name="numero_compte"
                placeholder="CPT-123456"
                required
                helpText="Format: CPT-XXXXXX"
                error={errors.numero_compte?.message}
                {...register('numero_compte')}
              />

              <Select
                label="Type d'assuré"
                name="type_assure"
                required
                error={errors.type_assure?.message}
                options={Object.entries(TYPE_ASSURE_LABELS).map(
                  ([value, label]) => ({ value, label })
                )}
                {...register('type_assure')}
              />

              <Select
                label="Agence de rattachement"
                name="agence"
                required
                error={errors.agence?.message}
                options={AGENCES}
                {...register('agence')}
              />

              {/* Champs pour ayant-droit */}
              {typeAssure === TYPE_ASSURE.AYANT_DROIT && (
                <>
                  <Input
                    label="ID du titulaire"
                    type="number"
                    name="titulaire_id"
                    placeholder="Ex: 1"
                    required
                    error={errors.titulaire_id?.message}
                    {...register('titulaire_id')}
                  />

                  <Select
                    label="Lien de parenté"
                    name="parente"
                    required
                    error={errors.parente?.message}
                    options={PARENTE_OPTIONS}
                    {...register('parente')}
                  />
                </>
              )}
            </div>
          </Card>

          {/* Info importante */}
          <Alert type="info" className="mb-6">
            <p className="font-medium mb-2">📋 Informations importantes</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Un numéro de dossier unique sera généré automatiquement</li>
              <li>L'assuré recevra ses identifiants par email</li>
              <li>Les identifiants seront affichés une seule fois après la création</li>
              <li>Assurez-vous que toutes les informations sont correctes</li>
            </ul>
          </Alert>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/assures')}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Save}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer l\'assuré'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssure;
