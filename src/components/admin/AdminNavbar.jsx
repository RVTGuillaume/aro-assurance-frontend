import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Users,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* LOGO */}
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-emerald-600">Assurances ARO</span>
              <span className="ml-2 text-sm text-gray-500">Madagascar</span>
            </Link>
          </div>

          {/* NAVIGATION DESKTOP */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                isActive('/admin/dashboard') 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>

            {/* ✅ BOUTON ASSURÉS */}
            <Link
              to="/admin/assures"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                isActive('/admin/assures') 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="h-5 w-5" />
              Assurés
            </Link>

            <Link
              to="/admin/declarations"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                isActive('/admin/declarations') 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText className="h-5 w-5" />
              Déclarations
            </Link>
          </div>

          {/* USER MENU */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold">
                  {user?.nom?.charAt(0) || 'T'}
                </div>
                <span className="text-sm font-medium">{user?.nom || 'Tiana Guillaume'}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-600 hover:text-gray-900"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/admin/dashboard"
              onClick={() => setShowMobileMenu(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isActive('/admin/dashboard') ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>

            {/* ✅ BOUTON ASSURÉS MOBILE */}
            <Link
              to="/admin/assures"
              onClick={() => setShowMobileMenu(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isActive('/admin/assures') ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'
              }`}
            >
              <Users className="h-5 w-5" />
              Assurés
            </Link>

            <Link
              to="/admin/declarations"
              onClick={() => setShowMobileMenu(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isActive('/admin/declarations') ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'
              }`}
            >
              <FileText className="h-5 w-5" />
              Déclarations
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
