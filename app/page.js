'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import anime from 'animejs'

// ============ SA REVEAL INTRO ============
const SARevealIntro = ({ onComplete }) => {
  const containerRef = useRef(null)
  const [phase, setPhase] = useState('logo')

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const timeline = anime.timeline({
      easing: 'easeOutExpo',
    })

    // Phase 1: Logo appears with glow
    timeline.add({
      targets: '.sa-letter',
      scale: [0, 1],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(150),
      easing: 'easeOutElastic(1, .5)',
    })

    // Glow pulse
    timeline.add({
      targets: '.sa-glow',
      opacity: [0, 0.8, 0.4],
      scale: [0.8, 1.2, 1],
      duration: 1000,
      easing: 'easeInOutQuad',
    }, '-=400')

    // Phase 2: Letters split apart
    timeline.add({
      targets: '.letter-s',
      translateX: [0, -120],
      rotateY: [0, -15],
      duration: 800,
      easing: 'easeInOutQuart',
      begin: () => setPhase('split'),
    }, '+=400')

    timeline.add({
      targets: '.letter-a',
      translateX: [0, 120],
      rotateY: [0, 15],
      duration: 800,
      easing: 'easeInOutQuart',
    }, '-=800')

    // Phase 3: Light beam emerges
    timeline.add({
      targets: '.center-beam',
      scaleY: [0, 1],
      opacity: [0, 1],
      duration: 600,
      easing: 'easeOutQuart',
    }, '-=400')

    // Phase 4: Experience words fly out
    timeline.add({
      targets: '.exp-word',
      translateY: [0, (el, i) => (i % 2 === 0 ? -80 - i * 20 : 80 + i * 20)],
      translateX: () => anime.random(-150, 150),
      opacity: [0, 1],
      scale: [0.5, 1],
      duration: 800,
      delay: anime.stagger(60),
      easing: 'easeOutExpo',
      begin: () => setPhase('reveal'),
    }, '-=300')

    // Phase 5: Everything converges and fades
    timeline.add({
      targets: '.exp-word',
      opacity: [1, 0],
      scale: [1, 0.8],
      duration: 500,
      easing: 'easeInQuart',
    }, '+=600')

    timeline.add({
      targets: ['.letter-s', '.letter-a'],
      translateX: 0,
      translateY: -200,
      scale: 0.3,
      opacity: 0,
      duration: 700,
      easing: 'easeInQuart',
    }, '-=300')

    timeline.add({
      targets: '.center-beam',
      scaleX: [1, 30],
      opacity: [1, 0],
      duration: 500,
      easing: 'easeInQuart',
      complete: () => {
        setPhase('complete')
        setTimeout(onComplete, 100)
      },
    }, '-=500')

    return () => timeline.pause()
  }, [onComplete])

  const experienceWords = [
    '.NET', 'Kubernetes', 'Azure', 'Svelte', 'Snowflake',
    'AI', 'Leadership', 'Architecture', 'OpenAI', 'KEDA'
  ]

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Radial glow behind letters */}
      <div className="sa-glow absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full opacity-0"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(249, 115, 22, 0.2) 40%, transparent 70%)',
        }}
      />

      {/* Main SA container */}
      <div className="relative flex items-center justify-center" style={{ perspective: '1000px' }}>
        <div className="letter-s sa-letter relative" style={{ transformStyle: 'preserve-3d' }}>
          <span
            className="text-[25vw] md:text-[15vw] font-black leading-none select-none"
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #F97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.5))',
            }}
          >
            S
          </span>
        </div>

        <div
          className="center-beam absolute w-1 h-[40vh] opacity-0"
          style={{
            background: 'linear-gradient(180deg, transparent, #3B82F6, #F97316, #EC4899, #F97316, #3B82F6, transparent)',
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(249, 115, 22, 0.5)',
            transformOrigin: 'center',
          }}
        />

        <div className="letter-a sa-letter relative" style={{ transformStyle: 'preserve-3d' }}>
          <span
            className="text-[25vw] md:text-[15vw] font-black leading-none select-none"
            style={{
              background: 'linear-gradient(135deg, #F97316 0%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 30px rgba(249, 115, 22, 0.5))',
            }}
          >
            A
          </span>
        </div>
      </div>

      {/* Experience words that fly out */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {experienceWords.map((word, i) => (
          <span
            key={word}
            className="exp-word absolute text-xs md:text-lg font-bold opacity-0 whitespace-nowrap"
            style={{
              color: i % 3 === 0 ? '#3B82F6' : i % 3 === 1 ? '#F97316' : '#EC4899',
              textShadow: '0 0 20px currentColor',
            }}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Loading indicator */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="w-32 md:w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #3B82F6, #F97316, #EC4899)' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 3.5, ease: 'easeInOut' }}
          />
        </div>
        <span className="text-white/30 text-xs font-mono tracking-widest uppercase">
          {phase === 'logo' && 'Initializing...'}
          {phase === 'split' && 'Loading experience...'}
          {phase === 'reveal' && 'Almost there...'}
        </span>
      </div>
    </motion.div>
  )
}

// ============ ANIMATED SECTION WRAPPER ============
const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ============ FLOATING NAVIGATION ============
const FloatingNav = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : ''
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <button onClick={() => scrollTo('home')} className="text-xl md:text-2xl font-black tracking-tighter">
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #3B82F6, #F97316)' }}>SA</span>
        </button>

        <div className="hidden md:flex items-center gap-6">
          {['experience', 'skills', 'impact', 'connect'].map((section) => (
            <button
              key={section}
              onClick={() => scrollTo(section)}
              className="text-sm text-white/60 hover:text-white transition-colors capitalize"
            >
              {section}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollTo('connect')}
          className="px-4 md:px-6 py-2 text-sm font-bold rounded-full"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #F97316)' }}
        >
          Connect
        </button>
      </div>
    </motion.nav>
  )
}

// ============ HERO SECTION ============
const HeroSection = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section id="home" ref={ref} className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 md:px-6">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full blur-[100px] md:blur-[150px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, transparent 70%)',
            top: '10%',
            left: '10%',
          }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[250px] md:w-[500px] h-[250px] md:h-[500px] rounded-full blur-[80px] md:blur-[120px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(249,115,22,0.6) 0%, transparent 70%)',
            bottom: '10%',
            right: '10%',
          }}
          animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div className="relative z-10 text-center max-w-4xl" style={{ y, opacity }}>
        {/* Status badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-3 md:px-4 py-2 mb-6 md:mb-8 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs md:text-sm text-white/60 font-mono">associate-director @ syneos-health</span>
        </motion.div>

        {/* Name */}
        <motion.h1
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4 md:mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className="block text-white">SUGANTHAN</span>
          <span
            className="block text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #3B82F6, #F97316, #EC4899)' }}
          >
            ARULVELAN
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl lg:text-2xl text-white/60 font-light mb-3 md:mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Software <span className="text-blue font-medium">Architect</span> & <span className="text-orange font-medium">Engineering Leader</span>
        </motion.p>

        <motion.p
          className="text-sm md:text-base text-white/40 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          7+ years crafting enterprise systems with zero production incidents.
          Scaling teams from 0 to 20. Building what others say can&apos;t be done.
        </motion.p>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {[
            { value: '7+', label: 'Years' },
            { value: '0', label: 'Incidents' },
            { value: '99.9%', label: 'Uptime' },
            { value: '20+', label: 'Engineers' },
          ].map((stat, i) => (
            <div key={i} className="p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/10">
              <div
                className="text-xl md:text-2xl lg:text-3xl font-black text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #3B82F6, #F97316)' }}
              >
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto group px-6 md:px-8 py-3 md:py-4 font-bold rounded-full flex items-center justify-center gap-3"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #F97316)' }}
          >
            Explore Experience
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <a
            href="/Suganthan_Arulvelan_Resume.html"
            target="_blank"
            className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-colors text-center"
          >
            View Resume
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  )
}

// ============ EXPERIENCE SECTION ============
const ExperienceSection = () => {
  const experiences = [
    {
      period: '2025 - Present',
      role: 'Associate Director',
      company: 'Syneos Health',
      description: 'Leading 20+ engineers. Enterprise architecture. AI integration.',
      tech: ['Azure', 'Kubernetes', 'OpenAI', 'Leadership'],
      color: '#3B82F6'
    },
    {
      period: '2024 - 2025',
      role: 'Principal Engineer',
      company: 'Syneos Health',
      description: '30-day platform migration. KEDA autoscaling. Zero downtime.',
      tech: ['Svelte', '.NET Core', 'Snowflake', 'KEDA'],
      color: '#F97316'
    },
    {
      period: '2023 - 2024',
      role: 'Senior Full Stack',
      company: 'Syneos Health',
      description: 'Desktop apps. Excel add-ins. Visualization dashboards.',
      tech: ['WPF', 'Excel-DNA', 'Plotly', 'Syncfusion'],
      color: '#EC4899'
    },
    {
      period: '2018 - 2021',
      role: 'Embedded Engineer',
      company: 'SUGUS',
      description: 'Industrial IoT. Automotive clients. HMI systems.',
      tech: ['Embedded C', 'MicroPython', 'IoT', 'Bosch'],
      color: '#3B82F6'
    },
  ]

  return (
    <section id="experience" className="py-20 md:py-32 px-4 md:px-6 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue/5 rounded-full blur-[100px] md:blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-orange/5 rounded-full blur-[80px] md:blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <AnimatedSection className="text-center mb-12 md:mb-16">
          <span className="text-blue text-xs md:text-sm font-mono tracking-wider mb-3 md:mb-4 block">// EXPERIENCE</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight">
            <span className="text-white">Career </span>
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #3B82F6, #F97316)' }}>Journey</span>
          </h2>
        </AnimatedSection>

        <div className="space-y-4 md:space-y-6">
          {experiences.map((exp, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <motion.div
                className="p-4 md:p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl relative overflow-hidden group"
                whileHover={{ borderColor: exp.color + '50' }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-0 left-0 w-1 h-full" style={{ background: exp.color }} />

                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 pl-3 md:pl-4">
                  <div className="md:w-36 flex-shrink-0">
                    <span className="font-mono text-xs md:text-sm" style={{ color: exp.color }}>{exp.period}</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg md:text-xl font-bold text-white">{exp.role}</h3>
                    <p className="text-white/40 text-sm">{exp.company}</p>
                    <p className="text-white/60 mt-1 md:mt-2 text-sm md:text-base">{exp.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2 md:mt-3">
                      {exp.tech.map((t, j) => (
                        <span key={j} className="px-2 py-1 bg-white/5 rounded-md text-xs text-white/60">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ SKILLS SECTION ============
const SkillsSection = () => {
  const skillGroups = [
    { name: 'Backend', skills: ['.NET Core', 'Python', 'Node.js'], color: '#3B82F6' },
    { name: 'Cloud', skills: ['Azure', 'Kubernetes', 'KEDA'], color: '#F97316' },
    { name: 'Data', skills: ['Snowflake', 'KDB+', 'Databricks'], color: '#EC4899' },
    { name: 'Frontend', skills: ['Svelte', 'React', 'WPF'], color: '#3B82F6' },
    { name: 'AI', skills: ['OpenAI', 'GPT-4', 'LangChain'], color: '#F97316' },
    { name: 'DevOps', skills: ['Azure DevOps', 'Docker', 'CI/CD'], color: '#EC4899' },
  ]

  return (
    <section id="skills" className="py-20 md:py-32 px-4 md:px-6 relative">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-12 md:mb-16">
          <span className="text-orange text-xs md:text-sm font-mono tracking-wider mb-3 md:mb-4 block">// SKILLS</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight">
            <span className="text-white">Tech </span>
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #3B82F6, #F97316, #EC4899)' }}>Arsenal</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {skillGroups.map((group, i) => (
            <AnimatedSection key={group.name} delay={i * 0.08}>
              <motion.div
                className="p-4 md:p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl text-center h-full"
                whileHover={{ borderColor: group.color + '50', y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4" style={{ color: group.color }}>{group.name}</h3>
                <div className="space-y-1 md:space-y-2">
                  {group.skills.map((skill, j) => (
                    <div key={j} className="text-white/60 text-xs md:text-sm">{skill}</div>
                  ))}
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ ACHIEVEMENTS SECTION ============
const AchievementsSection = () => {
  const achievements = [
    { metric: '1600%', label: 'User Growth', desc: 'Scaled platform to 150+ users', color: '#3B82F6' },
    { metric: '30', suffix: 'days', label: 'Migration', desc: 'Node.js to .NET Core', color: '#F97316' },
    { metric: 'GPT-4', label: 'AI Integration', desc: 'Enterprise-grade processing', color: '#EC4899' },
    { metric: '99.9%', label: 'Uptime', desc: 'Production SLA maintained', color: '#3B82F6' },
  ]

  return (
    <section id="impact" className="py-20 md:py-32 px-4 md:px-6 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-orange/5 rounded-full blur-[150px] md:blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-12 md:mb-16">
          <span className="text-pink text-xs md:text-sm font-mono tracking-wider mb-3 md:mb-4 block">// IMPACT</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight">
            <span className="text-white">What I </span>
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #3B82F6, #F97316, #EC4899)' }}>Delivered</span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {achievements.map((item, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <motion.div
                className="p-6 md:p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl md:rounded-3xl h-full"
                whileHover={{ y: -10, borderColor: 'rgba(255,255,255,0.2)' }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-3 md:mb-4">
                  <span
                    className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text"
                    style={{ backgroundImage: `linear-gradient(135deg, ${item.color}, ${item.color === '#3B82F6' ? '#F97316' : item.color === '#F97316' ? '#EC4899' : '#3B82F6'})` }}
                  >
                    {item.metric}
                  </span>
                  {item.suffix && <span className="text-xl md:text-2xl text-white/40 ml-2">{item.suffix}</span>}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">{item.label}</h3>
                <p className="text-white/40 text-sm md:text-base">{item.desc}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ CONNECT SECTION ============
const ConnectSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    await new Promise(r => setTimeout(r, 1500))
    setStatus('sent')
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <section id="connect" className="py-20 md:py-32 px-4 md:px-6 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-orange/5 rounded-full blur-[150px] md:blur-[200px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-blue/5 rounded-full blur-[120px] md:blur-[180px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <AnimatedSection className="text-center mb-10 md:mb-12">
          <span className="text-blue text-xs md:text-sm font-mono tracking-wider mb-3 md:mb-4 block">// CONNECT</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-3 md:mb-4">
            <span className="text-white">Let&apos;s Build </span>
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #3B82F6, #F97316, #EC4899)' }}>Together</span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <AnimatedSection delay={0.1}>
            <div className="space-y-3 md:space-y-4">
              {[
                { icon: '📧', label: 'Email', value: 'suganthan94@yahoo.com', href: 'mailto:suganthan94@yahoo.com' },
                { icon: '💼', label: 'LinkedIn', value: 'Connect', href: 'https://www.linkedin.com/in/suganthan-arulvelan-a9356073/' },
                { icon: '🐙', label: 'GitHub', value: 'Code', href: 'https://github.com/shuganth' },
              ].map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl hover:border-blue/50 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <span className="text-xl md:text-2xl">{item.icon}</span>
                  <div>
                    <div className="text-white/40 text-xs">{item.label}</div>
                    <div className="text-white text-sm md:text-base">{item.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <form onSubmit={handleSubmit} className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl">
              <div className="space-y-3 md:space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white text-sm placeholder:text-white/30 focus:border-blue focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white text-sm placeholder:text-white/30 focus:border-blue focus:outline-none"
                />
                <textarea
                  placeholder="Message"
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white text-sm placeholder:text-white/30 focus:border-blue focus:outline-none resize-none"
                />
                <motion.button
                  type="submit"
                  disabled={status !== 'idle'}
                  className="w-full py-3 md:py-4 font-bold rounded-lg md:rounded-xl disabled:opacity-50 text-sm md:text-base"
                  style={{ background: 'linear-gradient(135deg, #3B82F6, #F97316)' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {status === 'sending' ? 'Sending...' : status === 'sent' ? '✓ Sent!' : 'Send Message'}
                </motion.button>
              </div>
            </form>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.3} className="mt-12 md:mt-16 text-center text-white/20 text-xs md:text-sm">
          © {new Date().getFullYear()} Suganthan Arulvelan
        </AnimatedSection>
      </div>
    </section>
  )
}

// ============ MAIN COMPONENT ============
export default function Home() {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <div className="bg-black text-white min-h-screen">
      <AnimatePresence mode="wait">
        {showIntro && <SARevealIntro key="intro" onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FloatingNav />
          <HeroSection />
          <ExperienceSection />
          <SkillsSection />
          <AchievementsSection />
          <ConnectSection />
        </motion.div>
      )}
    </div>
  )
}
