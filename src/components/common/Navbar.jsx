/**
 * Composant Navbar - Minimum Height + Grande Police
 * Hauteur 40px avec textes extra-lisibles
 * ARO Assurance Madagascar
 */

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import {
  Menu,
  X,
  User,
  LogOut,
  FileText,
  LayoutDashboard,
  Users,
  ChevronDown,
  Shield,
} from 'lucide-react';
import Button from './Button';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, isAssure, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-2xl bg-white/90 shadow-xl border-b border-white/60'
          : 'backdrop-blur-xl bg-white/80 shadow-md border-b border-white/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10">
          {/* Titre compact SANS LOGO */}
          <Link to="/" className="flex items-center group">
            <div>
              <h1 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-blue-600 group-hover:from-emerald-600 group-hover:to-blue-500 transition-all duration-300 leading-tight">
                Assurance ARO
              </h1>
              <p className="text-xs text-slate-600 font-semibold leading-none">Madagascar</p>
            </div>
          </Link>

          {/* Navigation desktop - Police agrandie */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1.5">
              {isAssure() && (
                <>
                  <NavLink
                    to="/assure/dashboard"
                    icon={LayoutDashboard}
                    label="Dashboard"
                    active={isActivePath('/assure/dashboard')}
                  />
                  <NavLink
                    to="/assure/declarations"
                    icon={FileText}
                    label="Déclarations"
                    active={isActivePath('/assure/declarations')}
                  />
                </>
              )}

              {isAdmin() && (
                <>
                  <NavLink
                    to="/admin/dashboard"
                    icon={LayoutDashboard}
                    label="Dashboard"
                    active={isActivePath('/admin/dashboard')}
                  />
                  <NavLink
                    to="/admin/assures"
                    icon={Users}
                    label="Assurés"
                    active={isActivePath('/admin/assures')}
                  />
                  <NavLink
                    to="/admin/declarations"
                    icon={FileText}
                    label="Déclarations"
                    active={isActivePath('/admin/declarations')}
                  />
                </>
              )}
            </div>
          )}

          {/* Actions desktop - Police agrandie */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1 rounded-lg backdrop-blur-xl bg-white/70 border border-white/60 hover:bg-gradient-to-r hover:from-emerald-50/80 hover:to-blue-50/80 hover:border-emerald-200/50 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className={`p-0.5 rounded-md ${
                    isAdmin() 
                      ? 'bg-gradient-to-br from-purple-100 to-pink-100' 
                      : 'bg-gradient-to-br from-emerald-100 to-blue-100'
                  }`}>
                    {isAdmin() ? (
                      <Shield className="w-4 h-4 text-purple-700" />
                    ) : (
                      <User className="w-4 h-4 text-emerald-700" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900 leading-tight">
                      {user?.nom_complet || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-slate-600 leading-none">
                      {isAdmin() ? 'Administrateur' : 'Assuré'}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-600 transition-transform duration-300 ${
                      profileMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown menu - Police agrandie */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 backdrop-blur-2xl bg-white/95 border border-white/60 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className={`p-3.5 border-b border-white/40 ${
                      isAdmin()
                        ? 'bg-gradient-to-br from-purple-50/80 to-pink-50/80'
                        : 'bg-gradient-to-br from-emerald-50/80 to-blue-50/80'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg backdrop-blur-sm border shadow-sm ${
                          isAdmin()
                            ? 'bg-white/80 border-purple-200/50'
                            : 'bg-white/80 border-emerald-200/50'
                        }`}>
                          {isAdmin() ? (
                            <Shield className="w-5 h-5 text-purple-700" />
                          ) : (
                            <User className="w-5 h-5 text-emerald-700" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-slate-900 truncate">
                            {user?.nom_complet}
                          </p>
                          <p className="text-sm text-slate-600 truncate">
                            {user?.email}
                          </p>
                          {isAssure() && user?.numero_dossier && (
                            <p className="text-sm text-slate-600 mt-0.5">
                              N° {user.numero_dossier}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className={`mt-2.5 px-3 py-1.5 rounded-md backdrop-blur-sm border ${
                        isAdmin()
                          ? 'bg-purple-100/80 border-purple-200/50'
                          : 'bg-emerald-100/80 border-emerald-200/50'
                      }`}>
                        <p className={`text-sm font-bold ${
                          isAdmin() ? 'text-purple-900' : 'text-emerald-900'
                        }`}>
                          {isAdmin() ? '🔐 Accès Admin' : '✓ Compte Actif'}
                        </p>
                      </div>
                    </div>

                    <div className="p-2">
                      <Link
                        to={isAssure() ? '/assure/profile' : '/admin/profil'}
                        className="group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-emerald-50/80 hover:to-blue-50/80 transition-all duration-200"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <User className="w-5 h-5 text-slate-600 group-hover:text-emerald-700 group-hover:scale-110 transition-all" />
                        <span className="text-base font-semibold text-slate-900">
                          Mon profil
                        </span>
                      </Link>

                      <div className="my-1.5 border-t border-slate-200/50"></div>

                      <button
                        onClick={handleLogout}
                        className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-rose-50/80 hover:to-red-50/80 transition-all duration-200"
                      >
                        <LogOut className="w-5 h-5 text-slate-600 group-hover:text-rose-700 group-hover:scale-110 transition-all" />
                        <span className="text-base font-semibold text-slate-900 group-hover:text-rose-700">
                          Déconnexion
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login-assure')}
                  className="backdrop-blur-xl bg-white/70 border-white/60 hover:bg-emerald-50/80 hover:border-emerald-200/50 shadow-sm hover:shadow-md text-sm py-1 px-3 font-bold"
                >
                  Espace Assuré
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/login-admin')}
                  className="backdrop-blur-xl shadow-sm hover:shadow-md text-sm py-1 px-3 font-bold"
                >
                  Espace Admin
                </Button>
              </div>
            )}
          </div>

          {/* Bouton menu mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg backdrop-blur-xl bg-white/70 border border-white/60 hover:bg-emerald-50/80 hover:border-emerald-200/50 transition-all duration-300 shadow-sm"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-slate-900" />
            ) : (
              <Menu className="w-5 h-5 text-slate-900" />
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile - Police agrandie */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/40 backdrop-blur-2xl bg-white/95 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-2.5 space-y-2">
            {isAuthenticated ? (
              <>
                <div className={`p-3 rounded-lg backdrop-blur-xl border shadow-sm ${
                  isAdmin()
                    ? 'bg-gradient-to-br from-purple-50/80 to-pink-50/80 border-purple-200/50'
                    : 'bg-gradient-to-br from-emerald-50/80 to-blue-50/80 border-emerald-200/50'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-md ${
                      isAdmin()
                        ? 'bg-white/80 border border-purple-200/50'
                        : 'bg-white/80 border border-emerald-200/50'
                    }`}>
                      {isAdmin() ? (
                        <Shield className="w-5 h-5 text-purple-700" />
                      ) : (
                        <User className="w-5 h-5 text-emerald-700" />
                      )}
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900">
                        {user?.nom_complet}
                      </p>
                      <p className="text-sm text-slate-600">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  {isAssure() && (
                    <>
                      <MobileNavLink
                        to="/assure/dashboard"
                        icon={LayoutDashboard}
                        label="Dashboard"
                        active={isActivePath('/assure/dashboard')}
                        onClick={() => setMobileMenuOpen(false)}
                      />
                      <MobileNavLink
                        to="/assure/declarations"
                        icon={FileText}
                        label="Déclarations"
                        active={isActivePath('/assure/declarations')}
                        onClick={() => setMobileMenuOpen(false)}
                      />
                    </>
                  )}

                  {isAdmin() && (
                    <>
                      <MobileNavLink
                        to="/admin/dashboard"
                        icon={LayoutDashboard}
                        label="Dashboard"
                        active={isActivePath('/admin/dashboard')}
                        onClick={() => setMobileMenuOpen(false)}
                      />
                      <MobileNavLink
                        to="/admin/assures"
                        icon={Users}
                        label="Assurés"
                        active={isActivePath('/admin/assures')}
                        onClick={() => setMobileMenuOpen(false)}
                      />
                      <MobileNavLink
                        to="/admin/declarations"
                        icon={FileText}
                        label="Déclarations"
                        active={isActivePath('/admin/declarations')}
                        onClick={() => setMobileMenuOpen(false)}
                      />
                    </>
                  )}

                  <div className="my-1.5 border-t border-white/40"></div>

                  <button
                    onClick={handleLogout}
                    className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg backdrop-blur-xl bg-white/70 border border-white/60 hover:bg-gradient-to-r hover:from-rose-50/80 hover:to-red-50/80 hover:border-rose-200/50 transition-all duration-300 shadow-sm"
                  >
                    <LogOut className="w-5 h-5 text-slate-600 group-hover:text-rose-700 group-hover:scale-110 transition-all" />
                    <span className="text-base font-semibold text-slate-900 group-hover:text-rose-700">
                      Déconnexion
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    navigate('/login-assure');
                    setMobileMenuOpen(false);
                  }}
                  className="backdrop-blur-xl bg-white/70 border-white/60 shadow-sm text-sm font-bold"
                >
                  Espace Assuré
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    navigate('/login-admin');
                    setMobileMenuOpen(false);
                  }}
                  className="backdrop-blur-xl shadow-sm text-sm font-bold"
                >
                  Espace Admin
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// NavLink desktop - Police agrandie
const NavLink = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`group flex items-center gap-2 px-2 py-1 rounded-lg backdrop-blur-xl border transition-all duration-300 shadow-sm hover:shadow-md ${
      active
        ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-white/40'
        : 'bg-white/70 border-white/60 text-slate-700 hover:bg-gradient-to-r hover:from-emerald-50/80 hover:to-blue-50/80 hover:border-emerald-200/50'
    }`}
  >
    <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
      active ? 'text-white' : 'text-slate-600'
    }`} />
    <span className={`text-[15px] font-bold ${active ? 'text-white' : 'text-slate-900'}`}>
      {label}
    </span>
  </Link>
);

// NavLink mobile - Police agrandie
const MobileNavLink = ({ to, icon: Icon, label, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg backdrop-blur-xl border transition-all duration-300 shadow-sm ${
      active
        ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-white/40'
        : 'bg-white/70 border-white/60 text-slate-700 hover:bg-gradient-to-r hover:from-emerald-50/80 hover:to-blue-50/80 hover:border-emerald-200/50'
    }`}
  >
    <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
      active ? 'text-white' : 'text-slate-600'
    }`} />
    <span className={`text-base font-bold ${active ? 'text-white' : 'text-slate-900'}`}>
      {label}
    </span>
  </Link>
);

export default Navbar;
