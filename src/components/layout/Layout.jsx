/**
 * Composant Layout - Version Finale Optimisée
 * Footer compact avec textes extra-lisibles
 * ARO Assurance Madagascar
 */

import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from '@components/common/Navbar';
import { Phone, Mail, Globe, Facebook, Linkedin } from 'lucide-react';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navbar avec Glassmorphism */}
      <Navbar />
      
      {/* Contenu principal - Padding réduit avec marge top pour navbar */}
      <main className="flex-1 flex flex-col pt-10">
        <div className="flex-1 px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-5">
          <Outlet />
        </div>
        
        {/* Footer compact avec textes agrandis */}
        <footer className="relative mt-4">
          <div className="backdrop-blur-xl bg-white/70 border-t border-white/50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
              
              {/* Layout principal du footer - Compact */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                
                {/* Logo + Slogan - Police agrandie */}
                <div className="flex items-center gap-2.5">
                  <img 
                    src="/AROO.png" 
                    alt="ARO" 
                    className="h-9 w-auto drop-shadow-md" 
                    onError={(e) => e.target.style.display = 'none'}
                  />
                  <div>
                    <h3 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-blue-600 leading-tight">
                      Assurance ARO
                    </h3>
                    <p className="text-[13px] text-slate-600 font-bold leading-tight">Leader depuis 50+ ans</p>
                  </div>
                </div>

                {/* Contact - Police agrandie */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <a 
                    href="tel:+261202220154" 
                    className="group flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-xl bg-white/80 border border-white/60 hover:bg-emerald-50/80 hover:border-emerald-300/60 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <Phone className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span className="text-[15px] font-bold text-slate-900">020 22 201 54</span>
                  </a>
                  
                  <a 
                    href="mailto:contact@aro.mg" 
                    className="group flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-xl bg-white/80 border border-white/60 hover:bg-blue-50/80 hover:border-blue-300/60 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <Mail className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span className="text-[15px] font-bold text-slate-900">contact@aro.mg</span>
                  </a>
                  
                  <a 
                    href="https://www.aro.mg" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-xl bg-white/80 border border-white/60 hover:bg-purple-50/80 hover:border-purple-300/60 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <Globe className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                    <span className="text-[15px] font-bold text-slate-900">www.aro.mg</span>
                  </a>
                </div>

                {/* Réseaux + Copyright - Police agrandie */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <a 
                      href="https://www.facebook.com/ASSURANCESARO" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group p-2 rounded-lg backdrop-blur-xl bg-white/80 border border-white/60 hover:bg-blue-600 hover:border-blue-700 transition-all duration-300 shadow-sm hover:shadow-md"
                      aria-label="Facebook ARO"
                    >
                      <Facebook className="w-4 h-4 text-blue-600 group-hover:text-white group-hover:scale-110 transition-all" />
                    </a>
                    <a 
                      href="https://mg.linkedin.com/company/assurances-aro" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group p-2 rounded-lg backdrop-blur-xl bg-white/80 border border-white/60 hover:bg-blue-700 hover:border-blue-800 transition-all duration-300 shadow-sm hover:shadow-md"
                      aria-label="LinkedIn ARO"
                    >
                      <Linkedin className="w-4 h-4 text-blue-700 group-hover:text-white group-hover:scale-110 transition-all" />
                    </a>
                  </div>
                  <p className="text-[13px] text-slate-600 hidden lg:block font-bold">
                    © {new Date().getFullYear()} <span className="font-black text-emerald-700">ARO</span>
                  </p>
                </div>
              </div>

              {/* Copyright mobile uniquement - Police agrandie */}
              <div className="lg:hidden mt-2.5 text-center">
                <p className="text-[13px] text-slate-600 font-bold">
                  © {new Date().getFullYear()} <span className="font-black text-emerald-700">ARO</span>. Tous droits réservés.
                </p>
                <div className="flex flex-wrap justify-center gap-2.5 mt-1.5 text-[13px] text-slate-600">
                  <a href="#" className="hover:text-emerald-700 font-bold transition-colors">Mentions légales</a>
                  <span className="font-bold">•</span>
                  <a href="#" className="hover:text-emerald-700 font-bold transition-colors">Confidentialité</a>
                  <span className="font-bold">•</span>
                  <a href="#" className="hover:text-emerald-700 font-bold transition-colors">CGU</a>
                </div>
              </div>

              {/* Copyright desktop uniquement - Police agrandie */}
              <div className="hidden lg:flex justify-center gap-3 text-[13px] text-slate-600 mt-2.5 pt-2.5 border-t border-white/40">
                <a href="#" className="hover:text-emerald-700 font-bold transition-colors">Mentions légales</a>
                <span className="font-bold">•</span>
                <a href="#" className="hover:text-emerald-700 font-bold transition-colors">Politique de confidentialité</a>
                <span className="font-bold">•</span>
                <a href="#" className="hover:text-emerald-700 font-bold transition-colors">CGU</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
      
      {/* Toaster avec glassmorphism */}
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'backdrop-blur-xl bg-white/90 border border-white/60 shadow-2xl',
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </div>
  );
};

export default Layout;
