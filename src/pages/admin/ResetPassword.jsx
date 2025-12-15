/**
 * Réinitialisation de mot de passe
 * Avec code OTP (pour admin uniquement)
 * ARO Assurance Madagascar
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authApi } from '@api/authApi';
import { useNotification } from '@hooks/useNotification';
import {
  ArrowLeft,
  Mail,
  Lock,
  Key,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Alert from '@components/common/Alert';

// Schéma étape 1 : Demande de réinitialisation
const step1Schema = yup.object({
  identifier: yup
    .string()
    .required('Email ou nom d\'utilisateur requis')
    .min(3, 'Minimum 3 caractères'),
});

// Schéma étape 2 : Nouveau mot de passe
const step2Schema = yup.object({
  code_otp: yup
    .string()
    .required('Code OTP requis')
    .matches(/^\d{6}$/, 'Le code doit contenir 6 chiffres'),
  nouveau_mot_de_passe: yup
    .string()
    .required('Nouveau mot de passe requis')
    .min(8, 'Minimum 8 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Doit contenir au moins une majuscule, une minuscule et un chiffre'
    ),
  confirmation_mot_de_passe: yup
    .string()
    .required('Confirmation requise')
    .oneOf([yup.ref('nouveau_mot_de_passe')], 'Les mots de passe ne correspondent pas'),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const notification = useNotification();

  const [step, setStep] = useState(1); // 1: Demande, 2: Reset
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Formulaire étape 1
  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
  } = useForm({
    resolver: yupResolver(step1Schema),
  });

  // Formulaire étape 2
  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    formState: { errors: errorsStep2 },
  } = useForm({
    resolver: yupResolver(step2Schema),
  });

  // Étape 1 : Demander le code OTP
  const onSubmitStep1 = async (data) => {
    setLoading(true);

    try {
      const response = await authApi.requestPasswordReset(data.identifier);

      if (response.success) {
        setIdentifier(data.identifier);
        setStep(2);
        setCountdown(300); // 5 minutes
        notification.success(
          'Un code de vérification a été envoyé à votre email'
        );

        // Décompte
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        notification.error(
          response.message || 'Utilisateur introuvable'
        );
      }
    } catch (error) {
      notification.error(
        error.response?.data?.message ||
          'Erreur lors de l\'envoi du code'
      );
    } finally {
      setLoading(false);
    }
  };

  // Étape 2 : Réinitialiser le mot de passe
  const onSubmitStep2 = async (data) => {
    setLoading(true);

    try {
      const response = await authApi.resetPassword({
        identifier,
        code_otp: data.code_otp,
        nouveau_mot_de_passe: data.nouveau_mot_de_passe,
      });

      if (response.success) {
        notification.success('Mot de passe réinitialisé avec succès !');
        setTimeout(() => {
          navigate('/login-admin');
        }, 2000);
      } else {
        notification.error(
          response.message || 'Code invalide ou expiré'
        );
      }
    } catch (error) {
      notification.error(
        error.response?.data?.message ||
          'Erreur lors de la réinitialisation'
      );
    } finally {
      setLoading(false);
    }
  };

  // Renvoyer le code
  const handleResendCode = async () => {
    if (countdown > 0) {
      notification.warning(
        `Veuillez attendre ${Math.floor(countdown / 60)}:${(countdown % 60)
          .toString()
          .padStart(2, '0')} avant de renvoyer`
      );
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.requestPasswordReset(identifier);

      if (response.success) {
        setCountdown(300);
        notification.success('Nouveau code envoyé !');

        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      notification.error('Erreur lors du renvoi du code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Retour */}
        <Link
          to="/login-admin"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-aro-red transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la connexion
        </Link>

        <Card className="shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-aro rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
              {step === 1
                ? 'Mot de passe oublié ?'
                : 'Nouveau mot de passe'}
            </h1>
            <p className="text-gray-600">
              {step === 1
                ? 'Entrez votre email pour recevoir un code'
                : 'Entrez le code reçu et votre nouveau mot de passe'}
            </p>
          </div>

          {/* Étape 1 : Demande */}
          {step === 1 && (
            <form onSubmit={handleSubmitStep1(onSubmitStep1)}>
              <Alert type="info" className="mb-6">
                <p className="text-sm">
                  Un code de vérification à 6 chiffres sera envoyé à votre
                  adresse email.
                </p>
              </Alert>

              <Input
                label="Email ou nom d'utilisateur"
                name="identifier"
                icon={Mail}
                placeholder="admin@aro.mg"
                error={errorsStep1.identifier?.message}
                {...registerStep1('identifier')}
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                loading={loading}
                disabled={loading}
                className="mt-6"
              >
                {loading ? 'Envoi...' : 'Envoyer le code'}
              </Button>
            </form>
          )}

          {/* Étape 2 : Reset */}
          {step === 2 && (
            <form onSubmit={handleSubmitStep2(onSubmitStep2)}>
              <Alert type="success" className="mb-6">
                <p className="text-sm">
                  Un code a été envoyé à votre email. Il expire dans{' '}
                  <strong>
                    {Math.floor(countdown / 60)}:
                    {(countdown % 60).toString().padStart(2, '0')}
                  </strong>
                </p>
              </Alert>

              <div className="space-y-5">
                <Input
                  label="Code de vérification (6 chiffres)"
                  name="code_otp"
                  type="text"
                  icon={Key}
                  placeholder="123456"
                  maxLength={6}
                  error={errorsStep2.code_otp?.message}
                  {...registerStep2('code_otp')}
                />

                <div className="relative">
                  <Input
                    label="Nouveau mot de passe"
                    name="nouveau_mot_de_passe"
                    type={showPassword ? 'text' : 'password'}
                    icon={Lock}
                    placeholder="••••••••"
                    helpText="Min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre"
                    error={errorsStep2.nouveau_mot_de_passe?.message}
                    {...registerStep2('nouveau_mot_de_passe')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirmer le mot de passe"
                    name="confirmation_mot_de_passe"
                    type={showConfirmPassword ? 'text' : 'password'}
                    icon={Shield}
                    placeholder="••••••••"
                    error={errorsStep2.confirmation_mot_de_passe?.message}
                    {...registerStep2('confirmation_mot_de_passe')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  Retour
                </Button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={countdown > 0 || loading}
                  className="text-sm text-aro-blue hover:text-aro-darkBlue disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Renvoyer le code
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                loading={loading}
                disabled={loading}
                className="mt-4"
              >
                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </Button>
            </form>
          )}

          {/* Aide */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>💡 Astuce :</strong> Si vous ne recevez pas le code,
              vérifiez vos spams ou contactez le support.
            </p>
          </div>

          {/* Lien retour */}
          <div className="mt-6 text-center">
            <Link
              to="/login-admin"
              className="text-sm text-aro-red hover:text-aro-darkRed transition-colors"
            >
              Je me souviens de mon mot de passe
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
