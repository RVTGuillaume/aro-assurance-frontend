/**
 * ============================================
 * 🌐 CONFIGURATION DES ROUTES - VERSION FINALE
 * ARO Assurance Madagascar
 * ✅ Home + LoginAssure + LoginAdmin SANS Layout/Navbar/Footer
 * ✅ Toutes les autres pages AVEC Layout/Navbar/Footer
 * ============================================
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';

// Layout
import Layout from '@components/layout/Layout';

// Routes privées
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

// Pages publiques
import Home from '@pages/Home';
import LoginAssure from '@pages/LoginAssure';
import LoginAdmin from '@pages/LoginAdmin';
import ResetPassword from '@/pages/admin/ResetPassword';
import NotFound from '@pages/NotFound';

// Pages assuré
import AssureDashboard from '@pages/assure/Dashboard';
import DeclarationsList from '@pages/assure/DeclarationsList';
import NewDeclaration from '@pages/assure/NewDeclaration';
import EditDeclaration from '@pages/assure/EditDeclaration';
import DeclarationDetails from '@pages/assure/DeclarationDetails';
import DeclarationHistory from '@pages/assure/DeclarationHistory';
import Profile from '@pages/assure/Profile';

// Pages admin
import AdminDashboard from '@pages/admin/Dashboard';
import AdminDeclarations from '@pages/admin/Declarations';
import AdminDeclarationDetails from '@pages/admin/DeclarationDetails';
import AdminAssures from '@pages/admin/Assures';
import CreateAssure from '@pages/admin/CreateAssure';
import ManageDeclarations from '@pages/admin/ManageDeclarations';
import AdminSettings from '@pages/admin/Settings';
import AdminProfil from '@pages/admin/Profil';

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* ============================================ */}
      {/* ✅ PAGES SANS LAYOUT/NAVBAR/FOOTER */}
      {/* ============================================ */}

      {/* Page d'accueil */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            user?.type === 'assure' ? (
              <Navigate to="/assure/dashboard" replace />
            ) : user?.type === 'admin' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Home />
            )
          ) : (
            <Home />
          )
        }
      />

      {/* Pages de connexion */}
      <Route path="/login-assure" element={<LoginAssure />} />
      <Route path="/login-admin" element={<LoginAdmin />} />

      {/* ============================================ */}
      {/* ✅ PAGES AVEC LAYOUT/NAVBAR/FOOTER */}
      {/* ============================================ */}
      <Route element={<Layout />}>
        {/* Reset password */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ✅✅✅ Routes ASSURÉ - ORDRE CRITIQUE ✅✅✅ */}
        <Route
          path="/assure/dashboard"
          element={
            <PrivateRoute requiredType="assure">
              <AssureDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/assure/declarations"
          element={
            <PrivateRoute requiredType="assure">
              <DeclarationsList />
            </PrivateRoute>
          }
        />
        {/* ✅ ROUTE "NEW" EN PREMIER */}
        <Route
          path="/assure/declarations/new"
          element={
            <PrivateRoute requiredType="assure">
              <NewDeclaration />
            </PrivateRoute>
          }
        />
        {/* ✅ ROUTE "EDIT" EN DEUXIÈME */}
        <Route
          path="/assure/declarations/edit/:id"
          element={
            <PrivateRoute requiredType="assure">
              <EditDeclaration />
            </PrivateRoute>
          }
        />
        {/* ✅ ROUTE DYNAMIQUE `:id` EN DERNIER */}
        <Route
          path="/assure/declarations/:id"
          element={
            <PrivateRoute requiredType="assure">
              <DeclarationDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/assure/history"
          element={
            <PrivateRoute requiredType="assure">
              <DeclarationHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/assure/profile"
          element={
            <PrivateRoute requiredType="assure">
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Routes ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/declarations"
          element={
            <AdminRoute>
              <AdminDeclarations />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/declarations/:id"
          element={
            <AdminRoute>
              <AdminDeclarationDetails />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/declarations/manage"
          element={
            <AdminRoute>
              <ManageDeclarations />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/assures"
          element={
            <AdminRoute requiredRoles={['super_admin', 'admin']}>
              <AdminAssures />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/assures/create"
          element={
            <AdminRoute requiredRoles={['super_admin', 'admin']}>
              <CreateAssure />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/profil"
          element={
            <AdminRoute>
              <AdminProfil />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute requiredRoles={['super_admin']}>
              <AdminSettings />
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
