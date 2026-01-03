'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import anime from 'animejs'

// ============ SA REVEAL INTRO ============
const SARevealIntro = ({ onComplete }) => {
  const containerRef = useRef(null)
  const sRef = useRef(null)
  const aRef = useRef(null)
  const lineRef = useRef(null)
  const wordsRef = useRef(null)
  const [phase, setPhase] = useState('logo') // logo -> split -> reveal -> complete

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Main timeline
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
      translateX: [0, -150],
      rotateY: [0, -15],
      duration: 800,
      easing: 'easeInOutQuart',
      begin: () => setPhase('split'),
    }, '+=500')

    timeline.add({
      targets: '.letter-a',
      translateX: [0, 150],
      rotateY: [0, 15],
      duration: 800,
      easing: 'easeInOutQuart',
    }, '-=800')

    // Phase 3: Light beam emerges from center
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
      translateY: [0, (el, i) => (i % 2 === 0 ? -100 - i * 30 : 100 + i * 30)],
      translateX: () => anime.random(-200, 200),
      opacity: [0, 1],
      scale: [0.5, 1],
      duration: 800,
      delay: anime.stagger(80),
      easing: 'easeOutExpo',
      begin: () => setPhase('reveal'),
    }, '-=300')

    // Phase 5: Everything converges and fades
    timeline.add({
      targets: '.exp-word',
      opacity: [1, 0],
      scale: [1, 0.8],
      translateY: (el, i) => [(i % 2 === 0 ? -100 - i * 30 : 100 + i * 30), 0],
      duration: 600,
      easing: 'easeInQuart',
    }, '+=800')

    timeline.add({
      targets: ['.letter-s', '.letter-a'],
      translateX: 0,
      translateY: -300,
      scale: 0.3,
      opacity: 0,
      duration: 800,
      easing: 'easeInQuart',
    }, '-=400')

    timeline.add({
      targets: '.center-beam',
      scaleX: [1, 50],
      opacity: [1, 0],
      duration: 600,
      easing: 'easeInQuart',
      complete: () => {
        setPhase('complete')
        setTimeout(onComplete, 100)
      },
    }, '-=600')

    return () => timeline.pause()
  }, [onComplete])

  const experienceWords = [
    '.NET', 'Kubernetes', 'Azure', 'Svelte', 'Snowflake',
    'AI', 'Leadership', 'Architecture', 'OpenAI', 'KEDA'
  ]

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-space flex items-center justify-center overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 240, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 240, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Radial glow behind letters */}
      <div className="sa-glow absolute w-[600px] h-[600px] rounded-full opacity-0"
        style={{
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.3) 0%, rgba(139, 92, 246, 0.2) 40%, transparent 70%)',
        }}
      />

      {/* Main SA container */}
      <div className="relative flex items-center justify-center" style={{ perspective: '1000px' }}>
        {/* Letter S */}
        <div ref={sRef} className="letter-s sa-letter relative" style={{ transformStyle: 'preserve-3d' }}>
          <span
            className="text-[20vw] md:text-[15vw] font-black leading-none select-none"
            style={{
              background: 'linear-gradient(135deg, #00F0FF 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 30px rgba(0, 240, 255, 0.5))',
            }}
          >
            S
          </span>
        </div>

        {/* Center beam of light */}
        <div
          ref={lineRef}
          className="center-beam absolute w-1 h-[50vh] opacity-0"
          style={{
            background: 'linear-gradient(180deg, transparent, #00F0FF, #8B5CF6, #EC4899, #8B5CF6, #00F0FF, transparent)',
            boxShadow: '0 0 30px rgba(0, 240, 255, 0.8), 0 0 60px rgba(139, 92, 246, 0.5)',
            transformOrigin: 'center',
          }}
        />

        {/* Letter A */}
        <div ref={aRef} className="letter-a sa-letter relative" style={{ transformStyle: 'preserve-3d' }}>
          <span
            className="text-[20vw] md:text-[15vw] font-black leading-none select-none"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.5))',
            }}
          >
            A
          </span>
        </div>
      </div>

      {/* Experience words that fly out */}
      <div ref={wordsRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {experienceWords.map((word, i) => (
          <span
            key={word}
            className="exp-word absolute text-sm md:text-lg font-bold opacity-0 whitespace-nowrap"
            style={{
              color: i % 3 === 0 ? '#00F0FF' : i % 3 === 1 ? '#8B5CF6' : '#EC4899',
              textShadow: `0 0 20px currentColor`,
            }}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 rounded-full opacity-0"
            style={{
              left: '50%',
              top: '50%',
              background: i % 3 === 0 ? '#00F0FF' : i % 3 === 1 ? '#8B5CF6' : '#EC4899',
              boxShadow: `0 0 10px currentColor`,
            }}
          />
        ))}
      </div>

      {/* Loading indicator at bottom */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan via-violet to-pink rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 4, ease: 'easeInOut' }}
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

// ============ NAVIGATION ============
const Navigation = ({ currentSection, onNavigate, sections }) => {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.button
          onClick={() => onNavigate(0)}
          className="text-2xl font-black tracking-tighter"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-violet">SA</span>
        </motion.button>

        <div className="hidden md:flex items-center gap-1">
          {sections.map((section, i) => (
            <motion.button
              key={section}
              onClick={() => onNavigate(i)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all capitalize ${
                currentSection === i
                  ? 'text-space bg-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {section}
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={() => onNavigate(sections.length - 1)}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan to-violet text-space text-sm font-bold rounded-full"
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 240, 255, 0.5)' }}
          whileTap={{ scale: 0.95 }}
        >
          Connect
        </motion.button>
      </div>
    </motion.nav>
  )
}

// ============ SECTION DOTS ============
const SectionDots = ({ currentSection, onNavigate, total, sections }) => {
  return (
    <motion.div
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <motion.button
          key={i}
          onClick={() => onNavigate(i)}
          className="group relative flex items-center justify-end"
          whileHover={{ scale: 1.2 }}
        >
          <span className="absolute right-6 opacity-0 group-hover:opacity-100 text-xs text-white/60 capitalize whitespace-nowrap transition-opacity">
            {sections[i]}
          </span>
          <motion.div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSection === i
                ? 'bg-cyan scale-150 shadow-[0_0_15px_rgba(0,240,255,0.8)]'
                : 'bg-white/30 hover:bg-white/60'
            }`}
          />
        </motion.button>
      ))}
    </motion.div>
  )
}

// ============ MOBILE NAV ============
const MobileNav = ({ currentSection, onNavigate, total }) => {
  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-2 px-4 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onNavigate(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              currentSection === i
                ? 'bg-cyan scale-125 shadow-[0_0_10px_rgba(0,240,255,0.8)]'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </motion.div>
  )
}

// ============ HOME SECTION ============
const HomeSection = ({ onNavigate }) => {
  const containerRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Animate elements on mount
  useEffect(() => {
    anime({
      targets: '.home-animate',
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: anime.stagger(100, { start: 300 }),
      easing: 'easeOutExpo',
    })
  }, [])

  return (
    <section ref={containerRef} className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
      {/* Animated orbs */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-[150px]"
        style={{
          background: 'radial-gradient(circle, rgba(0,240,255,0.5) 0%, transparent 70%)',
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] right-0 bottom-0"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)',
          transform: `translate(${-mousePos.x * 0.5}px, ${-mousePos.y * 0.5}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      />

      {/* Grid */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 240, 255, 0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 240, 255, 0.5) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px'
      }} />

      <div className="relative z-10 text-center max-w-5xl">
        {/* Badge */}
        <div className="home-animate opacity-0 inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-white/60 font-mono">~/associate-director @ syneos-health</span>
        </div>

        {/* Name */}
        <h1 className="home-animate opacity-0 text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6">
          <span className="block text-white">SUGANTHAN</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan via-violet to-pink">
            ARULVELAN
          </span>
        </h1>

        {/* Subtitle */}
        <p className="home-animate opacity-0 text-xl md:text-2xl text-white/60 font-light mb-4">
          Software <span className="text-cyan font-medium">Architect</span> & <span className="text-violet font-medium">Engineering Leader</span>
        </p>
        <p className="home-animate opacity-0 text-white/40 max-w-2xl mx-auto mb-12 leading-relaxed">
          7+ years crafting enterprise systems with zero production incidents.
          Scaling teams from 0 to 20. Building what others say can&apos;t be done.
        </p>

        {/* Stats */}
        <div className="home-animate opacity-0 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12">
          {[
            { value: '7+', label: 'Years' },
            { value: '0', label: 'Incidents' },
            { value: '99.9%', label: 'Uptime' },
            { value: '20+', label: 'Engineers' },
          ].map((stat, i) => (
            <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan to-violet">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="home-animate opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            onClick={() => onNavigate(1)}
            className="group px-8 py-4 bg-gradient-to-r from-cyan to-violet text-space font-bold rounded-full flex items-center gap-3"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0, 240, 255, 0.4)' }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Experience
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
          <motion.a
            href="/Suganthan_Arulvelan_Resume.html"
            target="_blank"
            className="px-8 py-4 border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Resume
          </motion.a>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <button onClick={() => onNavigate(1)} className="text-white/30 hover:text-cyan transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
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
      color: 'cyan'
    },
    {
      period: '2024 - 2025',
      role: 'Principal Engineer',
      company: 'Syneos Health',
      description: '30-day platform migration. KEDA autoscaling. Zero downtime.',
      tech: ['Svelte', '.NET Core', 'Snowflake', 'KEDA'],
      color: 'violet'
    },
    {
      period: '2023 - 2024',
      role: 'Senior Full Stack',
      company: 'Syneos Health',
      description: 'Desktop apps. Excel add-ins. Visualization dashboards.',
      tech: ['WPF', 'Excel-DNA', 'Plotly', 'Syncfusion'],
      color: 'pink'
    },
    {
      period: '2018 - 2021',
      role: 'Embedded Engineer',
      company: 'SUGUS',
      description: 'Industrial IoT. Automotive clients. HMI systems.',
      tech: ['Embedded C', 'MicroPython', 'IoT', 'Bosch'],
      color: 'cyan'
    },
  ]

  useEffect(() => {
    anime({
      targets: '.exp-card',
      translateX: [-50, 0],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(150),
      easing: 'easeOutExpo',
    })
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 py-24">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-cyan/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-violet/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl w-full">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-cyan text-sm font-mono tracking-wider mb-4 block">// EXPERIENCE</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            <span className="text-white">Career </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-violet">Journey</span>
          </h2>
        </motion.div>

        <div className="space-y-6">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              className="exp-card opacity-0"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.div
                className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl relative overflow-hidden group"
                whileHover={{ borderColor: `rgba(${exp.color === 'cyan' ? '0, 240, 255' : exp.color === 'violet' ? '139, 92, 246' : '236, 72, 153'}, 0.5)` }}
              >
                <div className={`absolute top-0 left-0 w-1 h-full bg-${exp.color}`} />

                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="md:w-40 flex-shrink-0">
                    <span className={`text-${exp.color} font-mono text-sm`}>{exp.period}</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                    <p className="text-white/40 text-sm">{exp.company}</p>
                    <p className="text-white/60 mt-2">{exp.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {exp.tech.map((t, j) => (
                        <span key={j} className="px-2 py-1 bg-white/5 rounded-md text-xs text-white/60">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ SKILLS SECTION ============
const SkillsSection = () => {
  const skillGroups = [
    { name: 'Backend', skills: ['.NET Core', 'Python', 'Node.js'], color: 'cyan' },
    { name: 'Cloud', skills: ['Azure', 'Kubernetes', 'KEDA'], color: 'violet' },
    { name: 'Data', skills: ['Snowflake', 'KDB+', 'Databricks'], color: 'pink' },
    { name: 'Frontend', skills: ['Svelte', 'React', 'WPF'], color: 'cyan' },
    { name: 'AI', skills: ['OpenAI', 'GPT-4', 'LangChain'], color: 'violet' },
    { name: 'DevOps', skills: ['Azure DevOps', 'Docker', 'CI/CD'], color: 'pink' },
  ]

  useEffect(() => {
    anime({
      targets: '.skill-orb',
      scale: [0, 1],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(50, { grid: [3, 6], from: 'center' }),
      easing: 'easeOutElastic(1, .5)',
    })
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 py-24">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(rgba(0, 240, 255, 0.3) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-violet text-sm font-mono tracking-wider mb-4 block">// SKILLS</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            <span className="text-white">Tech </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-violet to-pink">Arsenal</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.name}
              className="skill-orb opacity-0 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-center"
              whileHover={{
                borderColor: `rgba(${group.color === 'cyan' ? '0, 240, 255' : group.color === 'violet' ? '139, 92, 246' : '236, 72, 153'}, 0.5)`,
                y: -5
              }}
            >
              <h3 className={`text-lg font-bold text-${group.color} mb-4`}>{group.name}</h3>
              <div className="space-y-2">
                {group.skills.map((skill, j) => (
                  <div key={j} className="text-white/60 text-sm">{skill}</div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ ACHIEVEMENTS SECTION ============
const AchievementsSection = () => {
  const achievements = [
    { metric: '1600%', label: 'User Growth', desc: 'Scaled platform to 150+ users', color: 'cyan' },
    { metric: '30', suffix: 'days', label: 'Migration', desc: 'Node.js to .NET Core', color: 'violet' },
    { metric: 'GPT-4', label: 'AI Integration', desc: 'Enterprise-grade processing', color: 'pink' },
    { metric: '99.9%', label: 'Uptime', desc: 'Production SLA maintained', color: 'cyan' },
  ]

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 py-24">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-pink text-sm font-mono tracking-wider mb-4 block">// IMPACT</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            <span className="text-white">What I </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-violet to-pink">Delivered</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {achievements.map((item, i) => (
            <motion.div
              key={i}
              className="group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.div
                className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl h-full"
                whileHover={{ y: -10, borderColor: 'rgba(255,255,255,0.2)' }}
              >
                <div className="mb-4">
                  <span className={`text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-${item.color} to-${item.color === 'cyan' ? 'violet' : item.color === 'violet' ? 'pink' : 'cyan'}`}>
                    {item.metric}
                  </span>
                  {item.suffix && <span className="text-2xl text-white/40 ml-2">{item.suffix}</span>}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.label}</h3>
                <p className="text-white/40">{item.desc}</p>
              </motion.div>
            </motion.div>
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
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 py-24">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-violet/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-cyan/5 rounded-full blur-[180px]" />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-cyan text-sm font-mono tracking-wider mb-4 block">// CONNECT</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            <span className="text-white">Let&apos;s Build </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-violet to-pink">Together</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
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
                className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-cyan/50 transition-colors"
                whileHover={{ x: 5 }}
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="text-white/40 text-xs">{item.label}</div>
                  <div className="text-white">{item.value}</div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-cyan focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-cyan focus:outline-none"
              />
              <textarea
                placeholder="Message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-cyan focus:outline-none resize-none"
              />
              <motion.button
                type="submit"
                disabled={status !== 'idle'}
                className="w-full py-4 bg-gradient-to-r from-cyan to-violet text-space font-bold rounded-xl disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {status === 'sending' ? 'Sending...' : status === 'sent' ? '✓ Sent!' : 'Send Message'}
              </motion.button>
            </div>
          </motion.form>
        </div>

        <div className="mt-16 text-center text-white/20 text-sm">
          © {new Date().getFullYear()} Suganthan Arulvelan
        </div>
      </div>
    </section>
  )
}

// ============ MAIN COMPONENT ============
const SECTIONS = ['home', 'experience', 'skills', 'impact', 'connect']

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [currentSection, setCurrentSection] = useState(0)
  const isTransitioning = useRef(false)

  const navigateTo = useCallback((index) => {
    if (index < 0 || index >= SECTIONS.length || isTransitioning.current) return
    isTransitioning.current = true
    setCurrentSection(index)
    setTimeout(() => { isTransitioning.current = false }, 800)
  }, [])

  // Wheel navigation
  useEffect(() => {
    if (showIntro) return

    let wheelTimeout = null
    const handleWheel = (e) => {
      if (wheelTimeout) return
      wheelTimeout = setTimeout(() => { wheelTimeout = null }, 1000)

      if (e.deltaY > 50) navigateTo(currentSection + 1)
      else if (e.deltaY < -50) navigateTo(currentSection - 1)
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [showIntro, currentSection, navigateTo])

  // Touch navigation
  const touchStartY = useRef(0)
  useEffect(() => {
    if (showIntro) return

    const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY }
    const handleTouchEnd = (e) => {
      const diff = touchStartY.current - e.changedTouches[0].clientY
      if (Math.abs(diff) > 80) navigateTo(currentSection + (diff > 0 ? 1 : -1))
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [showIntro, currentSection, navigateTo])

  // Keyboard navigation
  useEffect(() => {
    if (showIntro) return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') navigateTo(currentSection + 1)
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') navigateTo(currentSection - 1)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showIntro, currentSection, navigateTo])

  const sections = [
    <HomeSection key="home" onNavigate={navigateTo} />,
    <ExperienceSection key="exp" />,
    <SkillsSection key="skills" />,
    <AchievementsSection key="achievements" />,
    <ConnectSection key="connect" />,
  ]

  return (
    <div className="h-screen overflow-hidden bg-space">
      <AnimatePresence mode="wait">
        {showIntro && <SARevealIntro key="intro" onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <>
          <Navigation currentSection={currentSection} onNavigate={navigateTo} sections={SECTIONS} />
          <SectionDots currentSection={currentSection} onNavigate={navigateTo} total={SECTIONS.length} sections={SECTIONS} />
          <MobileNav currentSection={currentSection} onNavigate={navigateTo} total={SECTIONS.length} />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              className="h-full overflow-y-auto overflow-x-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            >
              {sections[currentSection]}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
