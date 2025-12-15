/**
 * ============================================
 * 🏠 HOMEPAGE ARO ASSURANCE MADAGASCAR
 * 🎨 Version ultra-compacte optimisée
 * ============================================
 */


import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  Clock, 
  TrendingUp,
  Users, 
  Award,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle,
  Building2,
  Heart,
  Star,
  Sparkles,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  Calendar,
  Briefcase,
  Target,
  DollarSign,
  ChevronRight,
  UserCircle,
  ShieldCheck
} from 'lucide-react';


const Home = () => {
  const navigate = useNavigate();


  // 🎨 ANIMATIONS
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };


  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };


  const scaleIn = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };


  const slideInLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };


  // 📊 STATISTIQUES ARO 2024-2025
  const stats = [
    { 
      icon: Calendar, 
      value: '50', 
      unit: 'ans',
      label: 'D\'excellence (1976-2025)', 
      color: 'from-emerald-600 to-green-700'
    },
    { 
      icon: TrendingUp, 
      value: '57', 
      unit: '%',
      label: 'Parts de marché national', 
      color: 'from-green-600 to-teal-700'
    },
    { 
      icon: Building2, 
      value: '29', 
      unit: 'agences',
      label: 'Présence nationale', 
      color: 'from-teal-600 to-emerald-700'
    },
    { 
      icon: Users, 
      value: '358', 
      unit: 'experts',
      label: 'Collaborateurs dédiés', 
      color: 'from-emerald-700 to-green-800'
    }
  ];


  // 📈 PERFORMANCES FINANCIÈRES 2024
  const financialStats = [
    { 
      icon: DollarSign, 
      value: '194 300 000 000', 
      unit: 'Ar',
      label: 'Chiffre d\'affaires 2024', 
      trend: '+8,28%',
      color: 'from-green-600 to-emerald-700'
    },
    { 
      icon: Target, 
      value: '398 900 000 000', 
      unit: 'Ar',
      label: 'Capitaux propres', 
      trend: '+13,7%',
      color: 'from-emerald-600 to-teal-700'
    },
    { 
      icon: TrendingUp, 
      value: '15 600 000 000', 
      unit: 'Ar',
      label: 'Résultat net 2024', 
      trend: '+40,3%',
      color: 'from-teal-600 to-green-700'
    },
    { 
      icon: Shield, 
      value: '158', 
      unit: '%',
      label: 'Solvabilité technique', 
      trend: 'Norme: 100%',
      color: 'from-green-700 to-emerald-800'
    }
  ];


  // ✨ SERVICES
  const services = [
    {
      icon: FileText,
      title: 'Déclarations 24/7',
      description: 'Déclarez vos sinistres en ligne à tout moment',
      color: 'from-emerald-600 to-green-700'
    },
    {
      icon: Clock,
      title: 'Réponse < 48h',
      description: 'Traitement ultra-rapide garanti',
      color: 'from-green-600 to-teal-700'
    },
    {
      icon: Shield,
      title: 'Sécurité ISO 9001',
      description: 'Seule compagnie certifiée à Madagascar',
      color: 'from-teal-600 to-emerald-700'
    },
    {
      icon: Heart,
      title: 'Équipe Locale',
      description: '358 experts malgaches à votre service',
      color: 'from-emerald-700 to-green-800'
    }
  ];


  // 🏆 CERTIFICATIONS
  const certifications = [
    {
      title: 'ISO 9001:2015',
      description: 'Seule compagnie malgache certifiée',
      icon: Award,
      color: 'from-amber-500 to-yellow-600'
    },
    {
      title: 'Notation AA',
      description: 'Global Credit Rating (Moody\'s)',
      icon: Star,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Diamond Prize 2024',
      description: 'Prix international qualité',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-600'
    }
  ];


  // 📜 TIMELINE
  const timeline = [
    { year: '1935', event: 'Première agence "La Préservatrice" à Madagascar' },
    { year: '1974', event: 'Premier directeur malgache : Pascal Rakotomavo' },
    { year: '1975', event: 'Nationalisation par l\'État malgache' },
    { year: '1976', event: 'Naissance du nom ARO' },
    { year: '2015', event: 'Certification ISO 9001:2015' },
    { year: '2024', event: 'Notation AA + Diamond Prize' },
    { year: '2025', event: '🎉 50 ans d\'excellence - Leader 57%' }
  ];


  // ✅ AVANTAGES
  const advantages = [
    '🇲🇬 100% Malagasy depuis 1976',
    '🏆 ISO 9001:2015 unique',
    '⚡ Réponse < 48h garantie',
    '🌍 29 agences nationales',
    '💰 Capital 7 000 000 000 Ar',
    '📊 Solvabilité 158%',
    '⭐ Notation AA Moody\'s',
    '🎯 57% parts de marché'
  ];


  // 🔗 RÉSEAUX SOCIAUX
  const socialLinks = [
    { icon: Facebook, url: 'https://www.facebook.com/ASSURANCESARO', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Linkedin, url: 'https://www.linkedin.com/company/assurances-aro', label: 'LinkedIn', color: 'hover:text-blue-700' },
    { icon: Instagram, url: 'https://www.instagram.com/assurances_aro', label: 'Instagram', color: 'hover:text-pink-600' },
    { icon: Globe, url: 'https://www.aro.mg', label: 'Site Web', color: 'hover:text-green-600' }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 overflow-hidden">
      
      {/* 🌊 BACKGROUND FLUIDE */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 70%, rgba(5, 150, 105, 0.10) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 60%, rgba(6, 95, 70, 0.07) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0"
        />
        
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              background: `rgba(${Math.random() * 100 + 20}, ${Math.random() * 150 + 105}, ${Math.random() * 100 + 70}, ${Math.random() * 0.3 + 0.1})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 80 - 40],
              y: [0, Math.random() * 80 - 40],
              scale: [1, Math.random() + 0.5, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: Math.random() * 12 + 8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>


      {/* 🔝 NAVBAR STICKY FIXE */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-white/70 border-b border-gray-200/50 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            
            {/* LOGO + NOM */}
            <div className="flex items-center gap-4">
              <motion.img 
                whileHover={{ scale: 1.1, rotate: 5 }}
                src="/AROO.png" 
                alt="ARO Assurance" 
                className="h-16 w-auto drop-shadow-xl cursor-pointer"
                onClick={() => navigate('/')}
              />
              <div className="hidden md:block">
                <h1 className="text-xl font-black bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
                  Assurance ARO
                </h1>
                <p className="text-xs text-gray-600 font-medium">Leader depuis 50 ans 🇲🇬</p>
              </div>
            </div>


            {/* RÉSEAUX SOCIAUX */}
            <div className="hidden lg:flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -3 }}
                  className={`p-2 rounded-full bg-white/80 shadow-md text-gray-700 ${social.color} transition-colors`}
                  title={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>


            {/* BOUTONS PROFESSIONNELS */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login-assure')}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-700 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <UserCircle className="w-5 h-5" />
                <span className="hidden sm:inline">Mon Espace Client</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login-admin')}
                className="flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-white/80 border border-gray-300 text-gray-700 text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <ShieldCheck className="w-5 h-5" />
                <span className="hidden sm:inline">Portail Professionnel</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>


      {/* ESPACEUR POUR NAVBAR FIXE */}
      <div className="h-20" />


      {/* 🎯 HERO SECTION ULTRA-COMPACT */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative py-4 px-6"
      >
        <div className="max-w-7xl mx-auto">
          
          <div className="backdrop-blur-3xl bg-white/60 rounded-3xl p-5 shadow-2xl border border-white/50">
            
            <div className="grid lg:grid-cols-2 gap-5 items-center">
              
              {/* COLONNE GAUCHE */}
              <motion.div variants={slideInLeft}>
                
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full mb-3 shadow-xl"
                >
                  <Star className="w-4 h-4 text-white animate-pulse" />
                  <span className="text-white font-black text-sm">🎉 50 ANS D'EXCELLENCE</span>
                </motion.div>


                <h1 className="text-3xl md:text-4xl font-black mb-2 leading-tight">
                  <span className="bg-gradient-to-r from-emerald-700 via-green-600 to-teal-700 bg-clip-text text-transparent">
                    Assurance ARO
                  </span>
                </h1>


                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="h-1 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 rounded-full mb-2"
                />


                <p className="text-lg text-gray-800 font-bold mb-2">
                  🇲🇬 <span className="text-emerald-700">Leader Malagasy</span> depuis 1976
                </p>


                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  <span className="font-black text-emerald-700">57% du marché</span> · 
                  <span className="font-bold text-green-700"> 100% Malgache</span> · 
                  <span className="font-black text-teal-700"> ISO 9001:2015</span> · 
                  <span className="font-bold text-emerald-700"> Notation AA</span>
                </p>


                {/* STATS RAPIDES */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-2.5 rounded-lg border border-emerald-200">
                    <p className="text-xl font-black text-emerald-700">194 300 000 000 Ar</p>
                    <p className="text-xs text-gray-700 font-semibold">CA 2024</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-teal-100 p-2.5 rounded-lg border border-green-200">
                    <p className="text-xl font-black text-green-700">29</p>
                    <p className="text-xs text-gray-700 font-semibold">Agences</p>
                  </div>
                </div>


                {/* CTA BUTTONS */}
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(5, 150, 105, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/login-assure')}
                    className="group px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-700 rounded-xl font-bold text-white text-sm shadow-2xl transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <UserCircle className="w-4 h-4" />
                      Mon Espace Client
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </motion.button>


                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/login-admin')}
                    className="px-5 py-2.5 backdrop-blur-xl bg-white/90 border-2 border-gray-300 rounded-xl font-bold text-gray-800 text-sm shadow-xl hover:border-emerald-500 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Portail Professionnel
                    </span>
                  </motion.button>
                </div>


              </motion.div>


              {/* COLONNE DROITE - IMAGES */}
              <motion.div variants={scaleIn} className="relative space-y-2.5">
                
                {/* IMAGE 50 ANS */}
                <div className="relative group">
                  <motion.img
                    whileHover={{ scale: 1.03, rotate: 1 }}
                    src="/475486944_1041814534416839_5640078677638933229_n.jpg"
                    alt="ARO 50 ans"
                    className="w-full max-h-[350px] object-cover rounded-2xl shadow-2xl border-4 border-white"
                  />
                  
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-yellow-600 p-2.5 rounded-lg shadow-xl">
                    <p className="text-white font-black text-base">1976-2025</p>
                  </div>


                  <div className="absolute -inset-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>


                {/* IMAGE SIGNATURE - AGRANDIE */}
                <div className="flex items-center justify-center">
                  <motion.img
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    src="/Signature-A50-Fevrier-2025.png"
                    alt="Signature ARO 50 ans"
                    className="max-w-2xl w-full h-auto rounded-xl shadow-xl border-2 border-white"
                  />
                </div>
              </motion.div>


            </div>
          </div>


        </div>
      </motion.section>


      {/* 📊 STATISTIQUES COMPACTES */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-6 px-6"
      >
        <div className="max-w-7xl mx-auto">
          
          <motion.div variants={fadeInUp} className="text-center mb-5">
            <h2 className="text-2xl font-black mb-2">
              <span className="bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
                ARO en Chiffres
              </span>
            </h2>
            <p className="text-sm text-gray-700">Performances 2024-2025</p>
          </motion.div>


          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.03 }}
                className="group"
              >
                <div className="h-full backdrop-blur-2xl bg-white/80 border-2 border-gray-200 rounded-xl p-3 shadow-xl hover:shadow-2xl hover:border-emerald-400 transition-all">
                  
                  <div className={`inline-flex p-2.5 bg-gradient-to-br ${stat.color} rounded-lg mb-2 shadow-lg`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <p className="text-2xl font-black text-gray-900">
                    {stat.value}
                    <span className="text-base ml-1">{stat.unit}</span>
                  </p>
                  <p className="text-xs text-gray-700 font-bold mt-1">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>


          {/* FINANCES 2024 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {financialStats.map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -8 }}
                className="backdrop-blur-2xl bg-gradient-to-br from-white/90 to-emerald-50/50 border border-emerald-200 rounded-xl p-3 shadow-xl"
              >
                <div className={`inline-flex p-2 bg-gradient-to-br ${stat.color} rounded-lg mb-2`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-lg font-black text-gray-900">
                  {stat.value}
                  <span className="text-xs ml-1">{stat.unit}</span>
                </p>
                <p className="text-xs text-gray-700 font-semibold mb-1">{stat.label}</p>
                <div className="flex items-center gap-1 text-green-700 font-bold text-xs">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </div>
              </motion.div>
            ))}
          </div>


        </div>
      </motion.section>


      {/* 🏆 CERTIFICATIONS COMPACT */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-6 px-6 bg-gradient-to-br from-emerald-50/50 to-green-50/50"
      >
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-5">
            <h2 className="text-2xl font-black mb-2">
              <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                Certifications & Prix
              </span>
            </h2>
          </div>


          <div className="grid md:grid-cols-3 gap-3">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.03 }}
                className="backdrop-blur-2xl bg-white/90 border-2 border-gray-200 rounded-xl p-5 shadow-xl text-center"
              >
                <div className={`inline-flex p-3 bg-gradient-to-br ${cert.color} rounded-full mb-3 shadow-2xl`}>
                  <cert.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-base font-black text-gray-900 mb-2">{cert.title}</h3>
                <p className="text-sm text-gray-700">{cert.description}</p>
              </motion.div>
            ))}
          </div>


        </div>
      </motion.section>


      {/* 📜 HISTORIQUE COMPACT */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-6 px-6"
      >
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-5">
            <Calendar className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h2 className="text-2xl font-black mb-2">
              <span className="bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
                Notre Histoire
              </span>
            </h2>
            <p className="text-sm text-gray-700">90 ans à Madagascar</p>
          </div>


          <div className="backdrop-blur-3xl bg-white/80 border-2 border-gray-200 rounded-3xl p-6 shadow-2xl">
            
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-600 to-green-600" />


              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="relative pl-14 pb-4 last:pb-0"
                >
                  <div className="absolute left-3.5 top-0 w-4 h-4 bg-gradient-to-br from-emerald-600 to-green-700 rounded-full border-3 border-white shadow-lg" />
                  
                  <div className="backdrop-blur-xl bg-gradient-to-br from-white/90 to-emerald-50/50 border border-emerald-200 rounded-lg p-3 shadow-lg hover:shadow-xl transition-all">
                    <p className="text-lg font-black text-emerald-700 mb-1">{item.year}</p>
                    <p className="text-xs text-gray-800 font-medium">{item.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>


          </div>


        </div>
      </motion.section>


      {/* 🌟 SERVICES COMPACT */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-6 px-6 bg-gradient-to-br from-green-50/50 to-emerald-50/50"
      >
        <div className="max-w-7xl mx-auto">
          
          <motion.div variants={fadeInUp} className="text-center mb-5">
            <h2 className="text-2xl font-black mb-2">
              <span className="bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
                Services Digitaux
              </span>
            </h2>
          </motion.div>


          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -10, scale: 1.03 }}
                className="group"
              >
                <div className="h-full backdrop-blur-2xl bg-white/90 border-2 border-gray-200 rounded-xl p-4 shadow-xl hover:shadow-2xl hover:border-emerald-400 transition-all">
                  
                  <div className={`relative inline-flex p-2.5 bg-gradient-to-br ${service.color} rounded-lg mb-2 shadow-2xl`}>
                    <service.icon className="w-6 h-6 text-white" />
                    <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
                  </div>
                  
                  <h3 className="text-sm font-black text-gray-900 mb-1.5 group-hover:text-emerald-700 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>


        </div>
      </motion.section>


      {/* ✅ AVANTAGES COMPACT */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-6 px-6"
      >
        <div className="max-w-5xl mx-auto">
          
          <div className="backdrop-blur-3xl bg-white/80 border-2 border-gray-200 rounded-3xl p-6 shadow-2xl">
            
            <div className="text-center mb-5">
              <Star className="w-10 h-10 text-yellow-500 mx-auto mb-2 animate-pulse" />
              <h2 className="text-2xl font-black mb-2">
                Pourquoi <span className="text-emerald-700">ARO</span> ?
              </h2>
            </div>


            <div className="grid md:grid-cols-2 gap-2.5 mb-4">
              {advantages.map((advantage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-2 group"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                  <span className="text-xs text-gray-800 font-semibold group-hover:text-emerald-700 transition-colors">
                    {advantage}
                  </span>
                </motion.div>
              ))}
            </div>


            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-gradient-to-r from-emerald-600/20 to-green-700/20 border-2 border-emerald-400 rounded-xl text-center"
            >
              <p className="text-lg text-gray-900 font-black mb-1">
                🏆 N°1 Madagascar · 57% du marché
              </p>
              <p className="text-emerald-700 text-sm font-bold">
                7 000 000 000 Ar de capital · Depuis 1976
              </p>
            </motion.div>
          </div>


        </div>
      </motion.section>


      {/* 📞 CONTACT COMPACT */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-6 px-6 bg-gradient-to-br from-emerald-50/50 to-green-50/50"
      >
        <div className="max-w-5xl mx-auto">
          
          <div className="backdrop-blur-3xl bg-white/90 border-2 border-gray-200 rounded-3xl p-6 shadow-2xl">
            
            <h2 className="text-2xl font-black text-center mb-5">
              Nous <span className="text-emerald-700">Contacter</span>
            </h2>


            <div className="grid md:grid-cols-3 gap-4 mb-4">
              
              <motion.a
                href="tel:+261202220154"
                whileHover={{ scale: 1.05, y: -5 }}
                className="group text-center"
              >
                <div className="inline-flex p-4 bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl mb-2 shadow-2xl group-hover:shadow-emerald-500/50 transition-all">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <p className="text-gray-800 font-bold text-xs mb-1">Téléphone</p>
                <p className="text-emerald-700 font-black text-sm">+261 20 22 201 54</p>
              </motion.a>


              <motion.a
                href="mailto:contact@aro.mg"
                whileHover={{ scale: 1.05, y: -5 }}
                className="group text-center"
              >
                <div className="inline-flex p-4 bg-gradient-to-br from-green-600 to-teal-700 rounded-xl mb-2 shadow-2xl group-hover:shadow-green-500/50 transition-all">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <p className="text-gray-800 font-bold text-xs mb-1">Email</p>
                <p className="text-green-700 font-black text-sm">contact@aro.mg</p>
              </motion.a>


              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="group text-center"
              >
                <div className="inline-flex p-4 bg-gradient-to-br from-teal-600 to-emerald-700 rounded-xl mb-2 shadow-2xl group-hover:shadow-teal-500/50 transition-all">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <p className="text-gray-800 font-bold text-xs mb-1">Siège social</p>
                <p className="text-teal-700 font-black text-xs">Antsahavola, Antananarivo</p>
              </motion.div>


            </div>


            <div className="text-center mb-4">
              <p className="text-gray-700 text-sm font-semibold">
                <Clock className="inline w-4 h-4 mr-2 text-emerald-600" />
                <span className="font-black">Lun-Ven</span> : 8h00 - 18h00
              </p>
            </div>


            {/* RÉSEAUX SOCIAUX */}
            <div className="flex justify-center items-center gap-3 pt-4 border-t border-gray-300">
              <p className="text-gray-700 font-semibold text-xs">Suivez-nous :</p>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.3, y: -5 }}
                  className={`p-2 rounded-full bg-white shadow-lg text-gray-700 ${social.color} transition-all`}
                  title={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>


          </div>


        </div>
      </motion.section>


      {/* 🔒 FOOTER ULTRA-COMPACT */}
      <footer className="relative py-4 px-6 backdrop-blur-xl bg-gradient-to-br from-emerald-900 to-green-900 text-white">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid md:grid-cols-3 gap-3 mb-3">
            
            <div>
              <img src="/AROO.png" alt="ARO" className="h-10 mb-1.5" />
              <p className="text-emerald-200 text-[11px] leading-relaxed">
                Leader malagasy depuis 1976. 100% malgache, ISO 9001:2015.
              </p>
            </div>


            <div>
              <h3 className="font-black text-xs mb-1.5">Accès rapide</h3>
              <div className="space-y-1 text-[11px]">
                <button onClick={() => navigate('/login-assure')} className="block text-emerald-200 hover:text-white transition-colors">
                  → Mon Espace Client
                </button>
                <button onClick={() => navigate('/login-admin')} className="block text-emerald-200 hover:text-white transition-colors">
                  → Portail Professionnel
                </button>
                <a href="https://www.aro.mg" target="_blank" rel="noopener noreferrer" className="block text-emerald-200 hover:text-white transition-colors">
                  → Site officiel ARO
                </a>
              </div>
            </div>


            <div>
              <h3 className="font-black text-xs mb-1.5">Contact</h3>
              <div className="space-y-0.5 text-emerald-200 text-[11px]">
                <p>📞 +261 20 22 201 54</p>
                <p>✉️ contact@aro.mg</p>
                <p>📍 Antsahavola, Antananarivo</p>
                <p>🕒 Lun-Ven : 8h-18h</p>
              </div>
            </div>


          </div>


          <div className="border-t border-emerald-700 pt-2.5 text-center">
            <p className="text-emerald-200 mb-0.5 text-[11px]">
              © 2025 <span className="font-black text-white">Assurance ARO Madagascar</span> - Tous droits réservés
            </p>
            <p className="text-emerald-300 text-[9px]">
              Fondée en 1976 · ISO 9001:2015 · Notation AA · 100% Malagasy · 57% du marché
            </p>
          </div>


        </div>
      </footer>


    </div>
  );
};


export default Home;
