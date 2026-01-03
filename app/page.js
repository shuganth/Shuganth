'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

// Section configuration - the pages of our app
const SECTIONS = ['home', 'orchestrator', 'achievements', 'skills', 'connect']

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, scale: 0.98, y: 20 },
  enter: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    y: -20,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

// Stagger container for child animations
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

// Preloader Component
const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 300)
          return 100
        }
        return prev + 2
      })
    }, 30)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-void flex flex-col items-center justify-center"
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        className="text-6xl md:text-8xl font-display font-black gradient-text mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        SA
      </motion.div>
      <div className="w-48 h-1 bg-obsidian rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-ember to-gold rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      <motion.p
        className="mt-4 text-mercury text-sm font-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Initializing experience...
      </motion.p>
    </motion.div>
  )
}

// Navigation Dots
const NavigationDots = ({ currentSection, onNavigate }) => {
  return (
    <motion.nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      {SECTIONS.map((section, i) => (
        <motion.button
          key={section}
          onClick={() => onNavigate(i)}
          className="group relative flex items-center justify-end"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="absolute right-8 opacity-0 group-hover:opacity-100 text-xs font-body text-mercury capitalize transition-opacity whitespace-nowrap">
            {section}
          </span>
          <motion.div
            className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
              currentSection === i
                ? 'bg-ember border-ember scale-125'
                : 'bg-transparent border-mercury/50 hover:border-ember'
            }`}
            animate={{
              boxShadow: currentSection === i ? '0 0 20px rgba(255, 77, 0, 0.5)' : 'none'
            }}
          />
        </motion.button>
      ))}
    </motion.nav>
  )
}

// Mobile Navigation Bar
const MobileNavBar = ({ currentSection, onNavigate }) => {
  return (
    <motion.nav
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <div className="flex items-center gap-3 px-4 py-3 bg-obsidian/90 backdrop-blur-xl rounded-full border border-platinum/10">
        {SECTIONS.map((section, i) => (
          <motion.button
            key={section}
            onClick={() => onNavigate(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentSection === i
                ? 'bg-ember scale-125'
                : 'bg-mercury/30 hover:bg-mercury/50'
            }`}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </motion.nav>
  )
}

// Top Navigation Header
const TopHeader = ({ currentSection, onNavigate }) => {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.button
          onClick={() => onNavigate(0)}
          className="text-2xl font-display font-black gradient-text"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          SA
        </motion.button>

        <div className="hidden md:flex items-center gap-8">
          {SECTIONS.slice(1).map((section, i) => (
            <motion.button
              key={section}
              onClick={() => onNavigate(i + 1)}
              className={`text-sm font-body capitalize transition-colors ${
                currentSection === i + 1 ? 'text-ember' : 'text-mercury hover:text-platinum'
              }`}
              whileHover={{ y: -2 }}
            >
              {section}
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={() => onNavigate(4)}
          className="px-4 py-2 bg-ember text-void text-sm font-body font-bold rounded-full"
          whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255, 77, 0, 0.3)' }}
          whileTap={{ scale: 0.95 }}
        >
          Let&apos;s Talk
        </motion.button>
      </div>
    </motion.header>
  )
}

// ===== HOME SECTION =====
const HomeSection = ({ onNavigate }) => {
  const roles = ['Architect', 'Engineer', 'Leader', 'Innovator']
  const [currentRole, setCurrentRole] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole(prev => (prev + 1) % roles.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.section
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ember/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 text-center max-w-4xl"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={staggerItem} className="mb-6">
          <span className="inline-block px-4 py-2 bg-obsidian border border-ember/30 rounded-full text-ember text-sm font-body">
            Associate Director @ Syneos Health
          </span>
        </motion.div>

        <motion.h1
          variants={staggerItem}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-6"
        >
          <span className="text-platinum">Suganthan</span>
          <br />
          <span className="gradient-text">Arulvelan</span>
        </motion.h1>

        <motion.div
          variants={staggerItem}
          className="text-xl md:text-2xl font-body text-mercury mb-8 h-8"
        >
          <span className="text-platinum">Software </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={currentRole}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-ember inline-block"
            >
              {roles[currentRole]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.p
          variants={staggerItem}
          className="text-mercury font-body max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          7+ years crafting enterprise solutions. Zero production incidents.
          Building systems that scale from 10 to 150+ users with precision.
        </motion.p>

        <motion.div
          variants={staggerItem}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <motion.button
            onClick={() => onNavigate(1)}
            className="group px-8 py-4 bg-ember text-void font-body font-bold rounded-xl flex items-center gap-3"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 77, 0, 0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            See How I Orchestrate
            <motion.svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
          </motion.button>

          <motion.a
            href="/Suganthan_Arulvelan_Resume.html"
            target="_blank"
            className="px-8 py-4 border border-platinum/30 text-platinum font-body rounded-xl hover:border-ember hover:text-ember transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Resume
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={staggerItem}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '7+', label: 'Years Experience' },
            { value: '0', label: 'Production Incidents' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: '20+', label: 'Team Size Led' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-display font-black gradient-text">
                {stat.value}
              </div>
              <div className="text-sm font-body text-mercury mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, y: { repeat: Infinity, duration: 1.5 } }}
      >
        <button onClick={() => onNavigate(1)} className="text-mercury hover:text-ember transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </motion.div>
    </motion.section>
  )
}

// ===== KUBERNETES-STYLE ORCHESTRATOR SECTION =====
const OrchestratorSection = () => {
  const [activeNode, setActiveNode] = useState(null)
  const [requests, setRequests] = useState([])

  const workers = [
    {
      id: 'frontend',
      name: 'Frontend Pod',
      tech: 'Svelte • React • WPF',
      status: 'Running',
      replicas: 3,
      description: 'Building pixel-perfect UIs that users love'
    },
    {
      id: 'backend',
      name: 'Backend Pod',
      tech: '.NET Core • Node.js • Python',
      status: 'Running',
      replicas: 5,
      description: 'Architecting scalable APIs with 99.9% uptime'
    },
    {
      id: 'data',
      name: 'Data Pod',
      tech: 'Snowflake • KDB+ • Databricks',
      status: 'Running',
      replicas: 2,
      description: 'Processing millions of records with precision'
    },
    {
      id: 'cloud',
      name: 'Cloud Pod',
      tech: 'Azure AKS • KEDA • Service Bus',
      status: 'Running',
      replicas: 4,
      description: 'Orchestrating infrastructure at enterprise scale'
    },
  ]

  // Simulate requests flowing through the system
  useEffect(() => {
    const interval = setInterval(() => {
      const newRequest = {
        id: Date.now(),
        targetPod: workers[Math.floor(Math.random() * workers.length)].id,
      }
      setRequests(prev => [...prev.slice(-5), newRequest])
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.section
      className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-10 max-w-6xl w-full">
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={staggerItem} className="inline-flex items-center gap-2 px-4 py-2 bg-obsidian border border-green-500/30 rounded-full text-green-400 text-sm font-body mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Cluster: Production • Status: Healthy
          </motion.div>
          <motion.h2
            variants={staggerItem}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-black"
          >
            <span className="text-platinum">The </span>
            <span className="gradient-text">Orchestrator</span>
          </motion.h2>
          <motion.p variants={staggerItem} className="text-mercury font-body mt-4 max-w-2xl mx-auto">
            Like Kubernetes manages containers, I architect and coordinate complex systems.
            Every component has a purpose. Every deployment is zero-downtime.
          </motion.p>
        </motion.div>

        {/* Architecture Diagram */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {/* Control Plane (Me) */}
          <div className="flex justify-center mb-12">
            <motion.div
              className="relative px-8 py-6 bg-obsidian border-2 border-ember rounded-2xl text-center"
              whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(255, 77, 0, 0.3)' }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-ember text-void text-xs font-body font-bold rounded-full">
                CONTROL PLANE
              </div>
              <div className="text-3xl font-display font-black gradient-text mb-2">SA</div>
              <div className="text-platinum font-body text-sm">Associate Director</div>
              <div className="text-mercury font-body text-xs mt-1">API Server • Scheduler • Controller</div>

              {/* Animated pulse */}
              <motion.div
                className="absolute inset-0 border-2 border-ember rounded-2xl"
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </div>

          {/* Connection Lines */}
          <svg className="absolute top-32 left-0 w-full h-24 pointer-events-none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF4D00" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#FFD700" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FF4D00" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            {workers.map((_, i) => {
              const startX = '50%'
              const endX = `${12.5 + i * 25}%`
              return (
                <motion.line
                  key={i}
                  x1={startX}
                  y1="0"
                  x2={endX}
                  y2="100%"
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                />
              )
            })}
          </svg>

          {/* Worker Nodes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24">
            {workers.map((worker, i) => (
              <motion.div
                key={worker.id}
                className={`relative p-5 bg-void border rounded-xl cursor-pointer transition-all ${
                  activeNode === worker.id
                    ? 'border-ember shadow-lg shadow-ember/20'
                    : 'border-platinum/20 hover:border-ember/50'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setActiveNode(activeNode === worker.id ? null : worker.id)}
              >
                {/* Status indicator */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs font-body text-green-400">{worker.status}</span>
                  </div>
                  <span className="text-xs font-body text-mercury">×{worker.replicas}</span>
                </div>

                {/* Pod icon */}
                <div className="w-10 h-10 mb-3 rounded-lg bg-obsidian border border-platinum/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-ember" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>

                <h4 className="text-sm font-display font-bold text-platinum mb-1">{worker.name}</h4>
                <p className="text-xs font-body text-mercury mb-2">{worker.tech}</p>

                {/* Expanded content */}
                <AnimatePresence>
                  {activeNode === worker.id && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs font-body text-ember pt-2 border-t border-platinum/10"
                    >
                      {worker.description}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Request animation */}
                {requests.filter(r => r.targetPod === worker.id).slice(-1).map(req => (
                  <motion.div
                    key={req.id}
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-ember rounded-full"
                    initial={{ y: -50, opacity: 0, scale: 0 }}
                    animate={{ y: 0, opacity: [0, 1, 0], scale: [0, 1, 0] }}
                    transition={{ duration: 0.5 }}
                  />
                ))}
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-6 text-xs font-body text-mercury"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span>Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-ember rounded-full" />
              <span>Control Plane</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-gradient-to-r from-ember to-gold" />
              <span>Data Flow</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

// ===== ACHIEVEMENTS SECTION =====
const AchievementsSection = () => {
  const achievements = [
    {
      icon: '🚀',
      achievement: 'Scaled User Base 16x',
      description: 'Built the first fully enterprise-standard application end-to-end, growing from 10 to 150+ users across Commercial StratOps and Deployment Solutions.',
      impact: '1600%',
      impactLabel: 'User Growth',
      tags: ['Enterprise Scale', 'Zero Incidents', 'Full Stack'],
    },
    {
      icon: '🤖',
      achievement: 'Integrated AI at Enterprise Scale',
      description: 'Architected distributed processing for complex 1-4 hour analytical queries using GPT-4o, Kubernetes workers, and KEDA autoscaling.',
      impact: 'GPT-4o',
      impactLabel: 'AI Powered',
      tags: ['OpenAI', 'Kubernetes', 'KEDA', 'Event-Driven'],
    },
    {
      icon: '⚡',
      achievement: '30-Day Platform Migration',
      description: 'Rewrote legacy Node.js platform to .NET Core in just 30 days with zero downtime. Enabled multi-database support including Snowflake, KDB+, and Databricks.',
      impact: '30',
      impactLabel: 'Days',
      tags: ['Zero Downtime', 'Multi-DB', 'Performance'],
    },
    {
      icon: '🏢',
      achievement: 'Enterprise Desktop Solution',
      description: 'Delivered native desktop application with spreadsheet functionality, SSH views, and autocomplete. Successfully deployed to production with SSO.',
      impact: '100%',
      impactLabel: 'Enterprise Ready',
      tags: ['Desktop App', 'SSO', 'Production'],
    },
  ]

  return (
    <motion.section
      className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-10 max-w-6xl w-full">
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={staggerItem} className="text-ember text-sm font-body tracking-widest uppercase mb-4">
            Impact & Outcomes
          </motion.div>
          <motion.h2
            variants={staggerItem}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-black"
          >
            <span className="text-platinum">What I </span>
            <span className="gradient-text">Delivered</span>
          </motion.h2>
          <motion.p variants={staggerItem} className="text-mercury font-body mt-4 max-w-2xl mx-auto">
            Not just projects shipped, but transformations achieved.
            Each milestone represents real business impact.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {achievements.map((item, i) => (
            <motion.div
              key={i}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <motion.div
                className="relative p-8 bg-obsidian border border-platinum/10 rounded-2xl overflow-hidden h-full"
                whileHover={{
                  borderColor: 'rgba(255, 77, 0, 0.5)',
                  y: -5,
                  boxShadow: '0 25px 50px -12px rgba(255, 77, 0, 0.15)'
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-ember/5 via-transparent to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon and impact */}
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <motion.span
                    className="text-4xl"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {item.icon}
                  </motion.span>
                  <div className="text-right">
                    <div className="text-3xl font-display font-black gradient-text">{item.impact}</div>
                    <div className="text-xs font-body text-mercury">{item.impactLabel}</div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-bold text-platinum mb-3 group-hover:text-white transition-colors relative z-10">
                  {item.achievement}
                </h3>
                <p className="text-mercury font-body text-sm leading-relaxed mb-6 relative z-10">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 relative z-10">
                  {item.tags.map((tag, j) => (
                    <motion.span
                      key={tag}
                      className="px-3 py-1.5 bg-void border border-platinum/20 rounded-lg text-xs font-body text-platinum/80 group-hover:border-ember/30 transition-all"
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 77, 0, 0.1)' }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                {/* Bottom accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-ember via-gold to-ember"
                  initial={{ scaleX: 0, originX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Career Timeline Mini */}
        <motion.div
          className="mt-16 p-6 bg-obsidian border border-platinum/10 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center mb-6">
            <h3 className="text-lg font-display font-bold text-platinum">Career Progression</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { role: 'Embedded Engineer', year: '2018-2021', company: 'SUGUS' },
              { role: 'Senior Full Stack', year: '2023-2024', company: 'Syneos' },
              { role: 'Principal Engineer', year: '2024-2025', company: 'Syneos' },
              { role: 'Associate Director', year: '2025-Present', company: 'Syneos' },
            ].map((exp, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 px-4 py-2 bg-void border border-platinum/10 rounded-full"
                whileHover={{ borderColor: 'rgba(255, 77, 0, 0.5)' }}
              >
                <div className="w-2 h-2 rounded-full bg-ember" />
                <div>
                  <span className="text-sm font-body text-platinum">{exp.role}</span>
                  <span className="text-xs font-body text-mercury ml-2">{exp.year}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

// ===== SKILLS SECTION =====
const SkillsSection = () => {
  const skillCategories = [
    {
      title: 'Backend & Cloud',
      icon: '☁️',
      skills: [
        { name: '.NET Core', level: 95 },
        { name: 'Azure AKS', level: 92 },
        { name: 'Python', level: 85 },
        { name: 'Node.js', level: 80 },
      ],
    },
    {
      title: 'Data & Analytics',
      icon: '📊',
      skills: [
        { name: 'Snowflake', level: 95 },
        { name: 'KDB+', level: 85 },
        { name: 'Databricks', level: 82 },
        { name: 'SQL Server', level: 90 },
      ],
    },
    {
      title: 'Frontend & UI',
      icon: '🎨',
      skills: [
        { name: 'Svelte', level: 90 },
        { name: 'React', level: 82 },
        { name: 'WPF/WinForms', level: 88 },
        { name: 'Excel-DNA', level: 85 },
      ],
    },
    {
      title: 'DevOps & Architecture',
      icon: '🔧',
      skills: [
        { name: 'Kubernetes/KEDA', level: 90 },
        { name: 'Azure DevOps', level: 92 },
        { name: 'OpenAI Integration', level: 85 },
        { name: 'Auth0', level: 88 },
      ],
    },
  ]

  const techStack = [
    '.NET Core', 'Kubernetes', 'Azure', 'Snowflake', 'Svelte', 'React',
    'KEDA', 'OpenAI', 'Auth0', 'KDB+', 'Databricks', 'Service Bus'
  ]

  return (
    <motion.section
      className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-10 max-w-6xl w-full">
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={staggerItem} className="text-ember text-sm font-body tracking-widest uppercase mb-4">
            Technical Expertise
          </motion.div>
          <motion.h2
            variants={staggerItem}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-black"
          >
            <span className="text-platinum">The </span>
            <span className="gradient-text">Stack</span>
          </motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {skillCategories.map((category, i) => (
            <motion.div
              key={category.title}
              className="p-6 bg-obsidian border border-platinum/10 rounded-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ borderColor: 'rgba(255, 77, 0, 0.3)' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="text-lg font-display font-bold text-platinum">{category.title}</h3>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill, j) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm font-body mb-2">
                      <span className="text-platinum">{skill.name}</span>
                      <span className="text-ember">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-void rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-ember to-gold rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + j * 0.1, duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack Marquee */}
        <motion.div
          className="overflow-hidden py-6 border-t border-b border-platinum/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            className="flex gap-4"
            animate={{ x: [0, -1200] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            {[...techStack, ...techStack].map((tech, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-obsidian border border-platinum/20 rounded-full text-sm font-body text-platinum whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

// ===== CONNECT SECTION =====
const ConnectSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <motion.section
      className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-ember/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        <motion.div
          className="text-center mb-12"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={staggerItem} className="text-ember text-sm font-body tracking-widest uppercase mb-4">
            Get In Touch
          </motion.div>
          <motion.h2
            variants={staggerItem}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6"
          >
            <span className="text-platinum">Let&apos;s Build </span>
            <span className="gradient-text">Together</span>
          </motion.h2>
          <motion.p variants={staggerItem} className="text-mercury font-body max-w-xl mx-auto">
            Have a challenging project? Looking for a technical leader?
            Let&apos;s discuss how I can help transform your vision into reality.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="p-6 bg-obsidian border border-platinum/10 rounded-2xl">
              <h3 className="text-lg font-display font-bold text-platinum mb-4">Quick Connect</h3>
              <div className="space-y-4">
                <a
                  href="mailto:suganthan94@yahoo.com"
                  className="flex items-center gap-4 text-mercury hover:text-ember transition-colors"
                >
                  <div className="w-10 h-10 bg-void rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-body text-sm">suganthan94@yahoo.com</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/suganthan-arulvelan-a9356073/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-mercury hover:text-ember transition-colors"
                >
                  <div className="w-10 h-10 bg-void rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <span className="font-body text-sm">LinkedIn Profile</span>
                </a>
                <a
                  href="https://github.com/shuganth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-mercury hover:text-ember transition-colors"
                >
                  <div className="w-10 h-10 bg-void rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <span className="font-body text-sm">GitHub</span>
                </a>
              </div>
            </div>

            <div className="p-6 bg-obsidian border border-platinum/10 rounded-2xl">
              <h3 className="text-lg font-display font-bold text-platinum mb-2">Location</h3>
              <p className="text-mercury font-body text-sm">Salem, Tamil Nadu, India</p>
              <p className="text-mercury/60 font-body text-xs mt-1">Available for remote opportunities</p>
            </div>
          </div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="p-6 bg-obsidian border border-platinum/10 rounded-2xl"
          >
            <h3 className="text-lg font-display font-bold text-platinum mb-6">Send a Message</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-void border border-platinum/20 rounded-xl font-body text-platinum focus:border-ember focus:outline-none transition-colors"
              />
              <input
                type="email"
                placeholder="your@email.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-void border border-platinum/20 rounded-xl font-body text-platinum focus:border-ember focus:outline-none transition-colors"
              />
              <textarea
                placeholder="Tell me about your project..."
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-void border border-platinum/20 rounded-xl font-body text-platinum focus:border-ember focus:outline-none transition-colors resize-none"
              />
              <motion.button
                type="submit"
                disabled={isSubmitting || submitted}
                className="w-full py-4 bg-ember text-void font-body font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(255, 77, 0, 0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-void border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : submitted ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Message Sent!
                  </>
                ) : (
                  <>
                    Send Message
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-mercury/60 font-body text-sm">
            © {new Date().getFullYear()} Suganthan Arulvelan. Crafted with precision.
          </p>
        </motion.div>
      </div>
    </motion.section>
  )
}

// ===== MAIN PAGE COMPONENT =====
export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)

  const navigateToSection = useCallback((index) => {
    setCurrentSection(index)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLoaded) return
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        setCurrentSection(prev => Math.min(prev + 1, SECTIONS.length - 1))
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setCurrentSection(prev => Math.max(prev - 1, 0))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLoaded])

  // Touch/swipe navigation
  const [touchStart, setTouchStart] = useState(null)

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientY)
  }

  const handleTouchEnd = (e) => {
    if (!touchStart) return
    const diff = touchStart - e.changedTouches[0].clientY
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentSection(prev => Math.min(prev + 1, SECTIONS.length - 1))
      } else {
        setCurrentSection(prev => Math.max(prev - 1, 0))
      }
    }
    setTouchStart(null)
  }

  // Wheel navigation with debounce
  const wheelTimeout = useRef(null)
  const handleWheel = (e) => {
    if (!isLoaded || wheelTimeout.current) return

    wheelTimeout.current = setTimeout(() => {
      wheelTimeout.current = null
    }, 800)

    if (e.deltaY > 30) {
      setCurrentSection(prev => Math.min(prev + 1, SECTIONS.length - 1))
    } else if (e.deltaY < -30) {
      setCurrentSection(prev => Math.max(prev - 1, 0))
    }
  }

  const renderSection = () => {
    switch (SECTIONS[currentSection]) {
      case 'home':
        return <HomeSection onNavigate={navigateToSection} />
      case 'orchestrator':
        return <OrchestratorSection />
      case 'achievements':
        return <AchievementsSection />
      case 'skills':
        return <SkillsSection />
      case 'connect':
        return <ConnectSection />
      default:
        return <HomeSection onNavigate={navigateToSection} />
    }
  }

  return (
    <div
      className="h-screen overflow-hidden bg-void"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        {!isLoaded && <Preloader key="preloader" onComplete={() => setIsLoaded(true)} />}
      </AnimatePresence>

      {isLoaded && (
        <>
          <TopHeader currentSection={currentSection} onNavigate={navigateToSection} />
          <NavigationDots currentSection={currentSection} onNavigate={navigateToSection} />
          <MobileNavBar currentSection={currentSection} onNavigate={navigateToSection} />

          <AnimatePresence mode="wait">
            <motion.div key={currentSection} className="h-full overflow-hidden">
              {renderSection()}
            </motion.div>
          </AnimatePresence>

          {/* Grain overlay */}
          <div className="grain pointer-events-none" />
        </>
      )}
    </div>
  )
}
