/**
 * Composant AdminLayout - Version Ultra-Compacte
 * Layout administration optimisé sans espaces vides
 * ARO Assurance Madagascar
 */

import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  Menu,
  X,
  User,
  Mail,
  Shield,
  ChevronRight,
  Settings,
  Bell,
  Search,
  Home,
  Phone,
  Globe,
  Facebook,
  Linkedin,
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleStorageChange);

    const interval = setInterval(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (JSON.stringify(parsed) !== JSON.stringify(currentUser)) {
          setCurrentUser(parsed);
        }
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleStorageChange);
      clearInterval(interval);
    };
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownOpen && !e.target.closest('#admin-dropdown')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  if (!isAuthenticated) {
    return <Navigate to="/login-admin" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login-admin');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'emerald' },
    { path: '/admin/assures', icon: Users, label: 'Assurés', color: 'blue' },
    { path: '/admin/declarations', icon: FileText, label: 'Déclarations', color: 'purple' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Top Navbar Glassmorphism */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'backdrop-blur-2xl bg-white/85 shadow-2xl border-b border-white/50' 
            : 'backdrop-blur-xl bg-white/70 shadow-lg border-b border-white/40'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2.5 rounded-xl backdrop-blur-xl bg-white/70 border border-white/60 hover:bg-emerald-50/80 hover:border-emerald-200/50 transition-all duration-300 shadow-lg"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <img 
                src="/AROO.png" 
                alt="ARO" 
                className="h-10 w-auto drop-shadow-2xl" 
                onError={(e) => e.target.style.display = 'none'}
              />
              <div className="hidden sm:block">
                <h1 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-blue-600">
                  Administration ARO
                </h1>
                <p className="text-xs text-slate-600 font-semibold">Gestion des assurances</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl bg-white/70 border border-white/60 shadow-lg">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="bg-transparent border-none outline-none text-sm text-slate-900 placeholder-slate-400 w-48"
              />
            </div>

            <button className="relative p-2.5 rounded-xl backdrop-blur-xl bg-white/70 border border-white/60 hover:bg-blue-50/80 hover:border-blue-200/50 transition-all duration-300 shadow-lg">
              <Bell className="w-5 h-5 text-slate-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="relative" id="admin-dropdown">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl backdrop-blur-xl bg-white/70 border border-white/60 hover:bg-gradient-to-r hover:from-emerald-50/80 hover:to-blue-50/80 hover:border-emerald-200/50 transition-all duration-300 shadow-lg"
              >
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200/50">
                  <Shield className="w-4 h-4 text-purple-700" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-slate-900 leading-none">{currentUser?.nom_complet || 'Admin'}</p>
                  <p className="text-xs text-slate-600">Administrateur</p>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform duration-300 ${dropdownOpen ? 'rotate-90' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 backdrop-blur-2xl bg-white/90 border border-white/60 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 bg-gradient-to-br from-purple-50/80 to-pink-50/80 border-b border-white/40">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-md">
                        <Shield className="w-6 h-6 text-purple-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">{currentUser?.nom_complet}</p>
                        <p className="text-xs text-slate-600 truncate flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {currentUser?.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 px-3 py-1.5 rounded-lg bg-purple-100/80 backdrop-blur-sm border border-purple-200/50">
                      <p className="text-xs font-bold text-purple-900">🔐 Accès Administrateur</p>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={() => {
                        navigate('/admin/profile');
                        setDropdownOpen(false);
                      }}
                      className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50/80 hover:to-blue-50/80 transition-all duration-200"
                    >
                      <User className="w-5 h-5 text-slate-600 group-hover:text-emerald-700 group-hover:scale-110 transition-all" />
                      <span className="text-sm font-semibold text-slate-900">Mon profil</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/admin/settings');
                        setDropdownOpen(false);
                      }}
                      className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-sky-50/80 transition-all duration-200"
                    >
                      <Settings className="w-5 h-5 text-slate-600 group-hover:text-blue-700 group-hover:scale-110 transition-all" />
                      <span className="text-sm font-semibold text-slate-900">Paramètres</span>
                    </button>

                    <div className="my-2 border-t border-slate-200/50"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-rose-50/80 hover:to-red-50/80 transition-all duration-200"
                    >
                      <LogOut className="w-5 h-5 text-slate-600 group-hover:text-rose-700 group-hover:scale-110 transition-all" />
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-rose-700">Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16 flex-1">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-72 flex-col backdrop-blur-2xl bg-white/70 border-r border-white/40 shadow-2xl">
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <button
              onClick={() => navigate('/')}
              className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-xl bg-white/70 border border-white/60 hover:bg-gradient-to-r hover:from-slate-50/80 hover:to-slate-100/80 hover:border-slate-200/50 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Home className="w-5 h-5 text-slate-600 group-hover:text-slate-900 group-hover:scale-110 transition-all" />
              <span className="text-sm font-semibold text-slate-900">Retour Accueil</span>
            </button>

            <div className="my-4 border-t border-white/40"></div>

            {menuItems.map((item) => (
              <SidebarLink
                key={item.path}
                to={item.path}
                icon={item.icon}
                label={item.label}
                active={isActive(item.path)}
                color={item.color}
                onClick={() => navigate(item.path)}
              />
            ))}
          </div>
        </aside>

        {/* Sidebar Mobile */}
        {isSidebarOpen && (
          <>
            <div 
              className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
            <aside className="lg:hidden fixed left-0 top-16 bottom-0 w-72 z-50 flex flex-col backdrop-blur-2xl bg-white/90 border-r border-white/60 shadow-2xl animate-in slide-in-from-left duration-300">
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <button
                  onClick={() => {
                    navigate('/');
                    setIsSidebarOpen(false);
                  }}
                  className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-xl bg-white/70 border border-white/60 hover:bg-gradient-to-r hover:from-slate-50/80 hover:to-slate-100/80 hover:border-slate-200/50 transition-all duration-300 shadow-md"
                >
                  <Home className="w-5 h-5 text-slate-600 group-hover:text-slate-900 group-hover:scale-110 transition-all" />
                  <span className="text-sm font-semibold text-slate-900">Retour Accueil</span>
                </button>

                <div className="my-4 border-t border-white/40"></div>

                {menuItems.map((item) => (
                  <SidebarLink
                    key={item.path}
                    to={item.path}
                    icon={item.icon}
                    label={item.label}
                    active={isActive(item.path)}
                    color={item.color}
                    onClick={() => {
                      navigate(item.path);
                      setIsSidebarOpen(false);
                    }}
                  />
                ))}
              </div>
            </aside>
          </>
        )}

        {/* Main Content - VERSION COMPACTE */}
        <main className="flex-1 lg:ml-72 flex flex-col">
          {/* Contenu avec padding réduit */}
          <div className="flex-1 p-4 sm:p-6">
            <Outlet />
          </div>

          {/* Footer Compact collé au contenu */}
          <footer className="relative mt-4">
            <div className="backdrop-blur-xl bg-white/70 border-t border-white/50 shadow-lg">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                
                {/* Tout en une seule ligne compacte */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                  
                  {/* Logo + Slogan compact */}
                  <div className="flex items-center gap-2">
                    <img 
                      src="/AROO.png" 
                      alt="ARO" 
                      className="h-8 w-auto drop-shadow-lg" 
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <div>
                      <h3 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-blue-600">
                        Assurances ARO
                      </h3>
                      <p className="text-xs text-slate-600 font-semibold">Administration</p>
                    </div>
                  </div>

                  {/* Contact compact */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <a 
                      href="tel:+261202220154" 
                      className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg backdrop-blur-xl bg-white/80 border border-white/60 hover:bg-emerald-50/80 transition-all duration-300 shadow-sm"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900">020 22 201 54</span>
                    </a>
                    
                    <a 
                      href="mailto:contact@aro.mg" 
                      className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg backdrop-blur-xl bg-white/80 border border-white/60 hover:bg-blue-50/80 transition-all duration-300 shadow-sm"
                    >
                      <Mail className="w-3 h-3 text-blue-600" />
                      <span className="text-xs font-bold text-slate-900">contact@aro.mg</span>
                    </a>
                    
                    <a 
                      href="https://www.aro.mg" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg backdrop-blur-xl bg-white/80 border border-white/60 hover:bg-purple-50/80 transition-all duration-300 shadow-sm"
                    >
                      <Globe className="w-3 h-3 text-purple-600" />
                      <span className="text-xs font-bold text-slate-900">www.aro.mg</span>
                    </a>
                  </div>

                  {/* Réseaux + Copyright compact */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <a 
                        href="https://www.facebook.com/ASSURANCESARO" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group p-2 rounded-lg backdrop-blur-xl bg-white/80 border border-white/60 hover:bg-blue-600 transition-all duration-300 shadow-sm"
                      >
                        <Facebook className="w-3.5 h-3.5 text-blue-600 group-hover:text-white transition-all" />
                      </a>
                      <a 
                        href="https://mg.linkedin.com/company/assurances-aro" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group p-2 rounded-lg backdrop-blur-xl bg-white/80 border border-white/60 hover:bg-blue-700 transition-all duration-300 shadow-sm"
                      >
                        <Linkedin className="w-3.5 h-3.5 text-blue-700 group-hover:text-white transition-all" />
                      </a>
                    </div>
                    <p className="text-xs text-slate-600 hidden lg:block">
                      © {new Date().getFullYear()} <span className="font-bold text-emerald-700">ARO</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

const SidebarLink = ({ to, icon: Icon, label, active, color, onClick }) => {
  const colorClasses = {
    emerald: {
      active: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-white/40',
      inactive: 'hover:from-emerald-50/80 hover:to-green-50/80 hover:border-emerald-200/50',
      icon: 'text-emerald-600'
    },
    blue: {
      active: 'bg-gradient-to-r from-blue-500 to-sky-500 text-white border-white/40',
      inactive: 'hover:from-blue-50/80 hover:to-sky-50/80 hover:border-blue-200/50',
      icon: 'text-blue-600'
    },
    purple: {
      active: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-white/40',
      inactive: 'hover:from-purple-50/80 hover:to-pink-50/80 hover:border-purple-200/50',
      icon: 'text-purple-600'
    },
  };

  const colors = colorClasses[color] || colorClasses.emerald;

  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-xl border transition-all duration-300 shadow-md hover:shadow-lg ${
        active 
          ? colors.active 
          : `bg-white/70 border-white/60 hover:bg-gradient-to-r ${colors.inactive}`
      }`}
    >
      <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
        active ? 'text-white' : colors.icon
      }`} />
      <span className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-900'}`}>
        {label}
      </span>
      {active && (
        <ChevronRight className="w-4 h-4 text-white ml-auto" />
      )}
    </button>
  );
};
