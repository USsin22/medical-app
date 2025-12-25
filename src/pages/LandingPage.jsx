import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  FileText, 
  BarChart3,  
  CalendarClock, 
  Stethoscope,
  ChevronRight,
  Activity,
  TrendingUp,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
// npm install lucide-react

import Loader from '../components/Loaders';
import Animation from '../components/Animation'

export default function App() {
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <PagesPreviewSection />
      <StatisticsSection />
      <CTASection />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              MedClinic
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#fonctionnalites" className="text-gray-600 hover:text-teal-600 transition-colors">
              Fonctionnalités
            </a>
            <a href="#apercu" className="text-gray-600 hover:text-teal-600 transition-colors">
              Aperçu
            </a>
            <a href="#statistiques" className="text-gray-600 hover:text-teal-600 transition-colors">
              Statistiques
            </a>
          </nav>
          <Link to="/dashboard" className="px-6 py-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all">
            Se connecter
          </Link>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (

    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-teal-200/50 shadow-sm">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-sm text-teal-700">Solution complète de gestion médicale</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Digitalisez la gestion de votre{' '}
              <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                cabinet médical
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Patients, rendez-vous et consultations centralisés dans une seule plateforme moderne
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard" className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-2xl shadow-teal-500/40 hover:shadow-teal-500/60 transition-all hover:scale-105 flex items-center justify-center gap-2">
                Accéder au tableau de bord
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 rounded-2xl bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 hover:border-teal-300 hover:bg-white transition-all shadow-lg">
                Voir les fonctionnalités
              </button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                <span className="text-sm text-gray-600">Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                <span className="text-sm text-gray-600">Support 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                <span className="text-sm text-gray-600">Sécurisé</span>
              </div>
            </div>
          </motion.div>
          
          {/* Right 3D Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Dashboard Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 rounded-xl   "
                style={{ transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)' }}
              >
                {/* <img
                  src="https://images.unsplash.com/photo-1747224317356-6dd1a4a078fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZGFzaGJvYXJkJTIwbW9kZXJufGVufDF8fHx8MTc2NjYxMzM3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Medical Dashboard"
                  className="w-[500px] h- h-auto rounded-2xl"
                /> */}
              <Animation  /> 
              </motion.div>
              
              {/* Floating Calendar Card */}
              <motion.div
                animate={{ y: [0, 15, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-8 -right-8 w-48 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 p-4 shadow-2xl shadow-blue-500/40"
                style={{ transform: 'perspective(1000px) rotateY(-10deg)' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-white" />
                  <span className="text-white text-sm font-semibold">Rendez-vous</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/30" />
                    <div className="flex-1 h-2 bg-white/30 rounded" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/30" />
                    <div className="flex-1 h-2 bg-white/30 rounded" />
                  </div>
                </div>
              </motion.div>
              
              {/* Floating Patient Card */}
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 w-52 rounded-2xl bg-white/90 backdrop-blur-xl p-4 shadow-2xl border border-white/50"
                style={{ transform: 'perspective(1000px) rotateY(10deg)' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-teal-600" />
                  <span className="text-gray-800 text-sm font-semibold">Patients récents</span>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500" />
                      <div className="flex-1 space-y-1">
                        <div className="h-2 bg-gray-200 rounded w-3/4" />
                        <div className="h-1.5 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Background Gradient Blur */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-300/30 to-blue-300/30 rounded-full blur-3xl -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: 'Gestion des Patients',
      description: 'Dossier médical complet, calcul automatique de l\'âge, historique détaillé des consultations',
      gradient: 'from-teal-500 to-cyan-500',
      shadowColor: 'shadow-teal-500/30'
    },
    {
      icon: CalendarClock,
      title: 'Rendez-vous Intelligents',
      description: 'Planning journalier optimisé, détection automatique des conflits, rappels automatiques',
      gradient: 'from-blue-500 to-indigo-500',
      shadowColor: 'shadow-blue-500/30'
    },
    {
      icon: FileText,
      title: 'Consultations Médicales',
      description: 'Diagnostic détaillé, génération d\'ordonnances, suivi des paiements et facturation',
      gradient: 'from-indigo-500 to-purple-500',
      shadowColor: 'shadow-indigo-500/30'
    },
    {
      icon: BarChart3,
      title: 'Statistiques & Suivi',
      description: 'Chiffre d\'affaires journalier et mensuel, analyse des patients fréquents, tableaux de bord',
      gradient: 'from-purple-500 to-pink-500',
      shadowColor: 'shadow-purple-500/30'
    },
    {
      icon: Calendar,
      title: 'Planning Journalier',
      description: 'Vue calendrier interactive, gestion des disponibilités, synchronisation en temps réel',
      gradient: 'from-pink-500 to-rose-500',
      shadowColor: 'shadow-pink-500/30'
    }
  ];

  return (
    <section id="fonctionnalites" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-teal-200/50 shadow-sm mb-4">
            <Activity className="w-4 h-4 text-teal-600" />
            <span className="text-sm text-teal-700">Fonctionnalités complètes</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une solution complète pour moderniser et optimiser la gestion de votre cabinet médical
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div
                className="relative h-full rounded-3xl bg-white/80 backdrop-blur-xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all"
                style={{ 
                  transform: 'perspective(1000px) rotateX(2deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Icon Container */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg ${feature.shadowColor} group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Decorative gradient */}
                <div className={`absolute -bottom-2 -right-2 w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity -z-10`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-teal-200/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl -z-10" />
    </section>
  );
}

function PagesPreviewSection() {
  return (
    <section id="apercu" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-white/50 to-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-blue-200/50 shadow-sm mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700">Interface moderne</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Découvrez l'interface
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une expérience utilisateur fluide et intuitive pour une productivité maximale
          </p>
        </motion.div>

        <div className="relative">
          <div className="flex items-center justify-center">
            {/* Layered 3D Screens */}
            <div className="relative w-full max-w-5xl">
              {/* Back Screen */}
              <motion.div
                initial={{ opacity: 0, x: -50, rotateY: -20 }}
                whileInView={{ opacity: 0.6, x: 0, rotateY: -15 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="absolute left-0 top-8 w-2/3 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80"
                style={{ 
                  transform: 'perspective(2000px) rotateY(-15deg) rotateX(5deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="bg-gradient-to-br from-slate-100 to-blue-50 p-8 h-96">
                  <div className="flex items-center gap-2 mb-6">
                    <Users className="w-6 h-6 text-teal-600" />
                    <span className="text-lg font-semibold text-gray-800">Liste des Patients</span>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="bg-white/80 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-blue-500" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-2/3" />
                          <div className="h-2 bg-gray-100 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Middle Screen */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 0.8, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute left-1/2 -translate-x-1/2 top-16 w-2/3 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80"
                style={{ 
                  transform: 'perspective(2000px) translateX(-50%) rotateX(3deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 h-96">
                  <div className="flex items-center gap-2 mb-6">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    <span className="text-lg font-semibold text-gray-800">Planning Journalier</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div
                        key={i}
                        className={`aspect-square rounded-lg ${
                          i % 7 === 0 || i % 7 === 6
                            ? 'bg-white/40'
                            : i % 5 === 0
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-500'
                            : 'bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Front Screen */}
              <motion.div
                initial={{ opacity: 0, x: 50, rotateY: 20 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 10 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative ml-auto w-2/3 rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
                style={{ 
                  transform: 'perspective(2000px) rotateY(10deg) rotateX(5deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1758691461888-b74515208d7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjB3b3Jrc3BhY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2NjYxMzM3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Dashboard Interface"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="bg-white/90 backdrop-blur-md rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Tableau de Bord</h3>
                    <p className="text-sm text-gray-600">Vue d'ensemble complète de votre activité</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Add spacing for overlapping elements */}
          <div className="h-96" />
        </div>
      </div>
    </section>
  );
}

function StatisticsSection() {
  const [counts, setCounts] = useState({ patients: 0, presence: 0, revenue: 0 });

  useEffect(() => {
    const targetPatients = 1247;
    const targetPresence = 94;
    const targetRevenue = 45680;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        patients: Math.floor(targetPatients * progress),
        presence: Math.floor(targetPresence * progress),
        revenue: Math.floor(targetRevenue * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts({
          patients: targetPatients,
          presence: targetPresence,
          revenue: targetRevenue
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      icon: Users,
      label: 'Patients enregistrés',
      value: counts.patients.toLocaleString('fr-FR'),
      gradient: 'from-teal-500 to-cyan-500',
      shadowColor: 'shadow-teal-500/40'
    },
    {
      icon: TrendingUp,
      label: 'Taux de présence',
      value: `${counts.presence}%`,
      gradient: 'from-blue-500 to-indigo-500',
      shadowColor: 'shadow-blue-500/40'
    },
    {
      icon: BarChart3,
      label: 'CA du mois',
      value: `${counts.revenue.toLocaleString('fr-FR')} €`,
      gradient: 'from-purple-500 to-pink-500',
      shadowColor: 'shadow-purple-500/40'
    }
  ];

  return (
    <section id="statistiques" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-purple-200/50 shadow-sm mb-4">
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-purple-700">Performances en temps réel</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Des résultats mesurables
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Suivez vos indicateurs clés et optimisez votre activité médicale
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, rotateX: -20 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="relative group"
            >
              <div
                className={`relative rounded-3xl bg-gradient-to-br ${stat.gradient} p-8 shadow-2xl ${stat.shadowColor} overflow-hidden`}
                style={{ 
                  transform: 'perspective(1000px) rotateX(5deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                {/* Value */}
                <div className="relative mb-2">
                  <motion.div
                    className="text-5xl font-bold text-white"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                  >
                    {stat.value}
                  </motion.div>
                </div>
                
                {/* Label */}
                <div className="relative text-white/90 text-lg">
                  {stat.label}
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-3xl" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl -z-10" />
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[3rem] bg-gradient-to-br from-teal-500 via-blue-600 to-indigo-600 p-12 md:p-16 overflow-hidden shadow-2xl"
        >
          {/* Background patterns */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          
          {/* Content */}
          <div className="relative text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm text-white">Commencez gratuitement</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Optimisez votre cabinet médical dès aujourd'hui
            </h2>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Rejoignez des centaines de professionnels de santé qui ont modernisé leur pratique
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/dashboard" className="group px-10 py-5 rounded-2xl bg-white text-teal-600 shadow-2xl hover:shadow-white/50 transition-all hover:scale-105 flex items-center justify-center gap-2">
                Commencer maintenant
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-10 py-5 rounded-2xl bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 transition-all">
                Planifier une démo
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-8 pt-8 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Essai gratuit 14 jours</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Aucune carte requise</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shadow-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">MedClinic</span>
            </div>
            <p className="text-white/70">
              Solution complète pour la gestion digitale de votre cabinet médical
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Produit</h3>
            <ul className="space-y-2 text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Démo</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Formation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sécurité</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">RGPD</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm">
              © 2024 MedClinic – Gestion Digitale. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-white/60">
                <Stethoscope className="w-4 h-4" />
                <Calendar className="w-4 h-4" />
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
//             </ul>
//           </div>
//         </div>
        
//         {/* Bottom */}
//         <div className="pt-8 border-t border-white/10">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//             <p className="text-white/60 text-sm">
//               © 2024 MedClinic – Gestion Digitale. Tous droits réservés.
//             </p>
//             <div className="flex items-center gap-6">
//               <div className="flex items-center gap-2 text-white/60">
//                 <Stethoscope className="w-4 h-4" />
//                 <Calendar className="w-4 h-4" />
//                 <BarChart3 className="w-4 h-4" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
//             </ul>
//           </div>
//         </div>
        
//         {/* Bottom */}
//         <div className="pt-8 border-t border-white/10">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//             <p className="text-white/60 text-sm">
//               © 2024 MedClinic – Gestion Digitale. Tous droits réservés.
//             </p>
//             <div className="flex items-center gap-6">
//               <div className="flex items-center gap-2 text-white/60">
//                 <Stethoscope className="w-4 h-4" />
//                 <Calendar className="w-4 h-4" />
//                 <BarChart3 className="w-4 h-4" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
//             </ul>
//           </div>
//         </div>
        
//         {/* Bottom */}
//         <div className="pt-8 border-t border-white/10">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//             <p className="text-white/60 text-sm">
//               © 2024 MedClinic – Gestion Digitale. Tous droits réservés.
//             </p>
//             <div className="flex items-center gap-6">
//               <div className="flex items-center gap-2 text-white/60">
//                 <Stethoscope className="w-4 h-4" />
//                 <Calendar className="w-4 h-4" />
//                 <BarChart3 className="w-4 h-4" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
//             </ul>
//           </div>
//         </div>
        
//         {/* Bottom */}
//         <div className="pt-8 border-t border-white/10">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//             <p className="text-white/60 text-sm">
//               © 2024 MedClinic – Gestion Digitale. Tous droits réservés.
//             </p>
//             <div className="flex items-center gap-6">
//               <div className="flex items-center gap-2 text-white/60">
//                 <Stethoscope className="w-4 h-4" />
//                 <Calendar className="w-4 h-4" />
//                 <BarChart3 className="w-4 h-4" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
//             </ul>
//           </div>
//         </div>
        
//         {/* Bottom */}
//         <div className="pt-8 border-t border-white/10">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//             <p className="text-white/60 text-sm">
//               © 2024 MedClinic – Gestion Digitale. Tous droits réservés.
//             </p>
//             <div className="flex items-center gap-6">
//               <div className="flex items-center gap-2 text-white/60">
//                 <Stethoscope className="w-4 h-4" />
//                 <Calendar className="w-4 h-4" />
//                 <BarChart3 className="w-4 h-4" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
//             </ul>
//           </div>
//         </div>
        
//         {/* Bottom */}
//         <div className="pt-8 border-t border-white/10">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//             <p className="text-white/60 text-sm">
//               © 2024 MedClinic – Gestion Digitale. Tous droits réservés.
//             </p>
//             <div className="flex items-center gap-6">
//               <div className="flex items-center gap-2 text-white/60">
//                 <Stethoscope className="w-4 h-4" />
//                 <Calendar className="w-4 h-4" />
//                 <BarChart3 className="w-4 h-4" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
//             </ul>
//           </div>
//         </div>
        
//         {/* Bottom */}
//         <div className="pt-8 border-t border-white/10">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//             <p className="text-white/60 text-sm">
//               © 2024 MedClinic – Gestion Digitale. Tous droits réservés.
//             </p>
//             <div className="flex items-center gap-6">
//               <div className="flex items-center gap-2 text-white/60">
//                 <Stethoscope className="w-4 h-4" />
//                 <Calendar className="w-4 h-4" />
//                 <BarChart3 className="w-4 h-4" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
