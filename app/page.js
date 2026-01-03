'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

// ============ CONFIGURATION ============
const SECTIONS = ['intro', 'about', 'neural', 'achievements', 'timeline', 'connect']

// ============ PRELOADER ============
const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null)
  const progressRef = useRef(null)
  const textRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => setTimeout(onComplete, 500)
    })

    // Animate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 25)

    // Text glitch effect
    tl.fromTo(textRef.current,
      { opacity: 0, scale: 0.8, filter: 'blur(20px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }
    )

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-space flex flex-col items-center justify-center"
      exit={{
        clipPath: 'circle(0% at 50% 50%)',
        transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
      }}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridMove 20s linear infinite'
        }} />
      </div>

      {/* Glowing orbs */}
      <div className="absolute w-96 h-96 bg-cyan/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute w-64 h-64 bg-violet/20 rounded-full blur-[100px] animate-pulse delay-500" />

      {/* Logo */}
      <div ref={textRef} className="relative z-10 mb-12">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-violet to-pink">
            SA
          </span>
        </h1>
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan/20 via-violet/20 to-pink/20 blur-2xl -z-10" />
      </div>

      {/* Progress bar */}
      <div className="w-64 md:w-80 h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
        <motion.div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-cyan via-violet to-pink rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Loading text */}
      <p className="mt-6 text-white/40 text-sm font-mono tracking-wider">
        INITIALIZING EXPERIENCE <span className="text-cyan">{progress}%</span>
      </p>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />
    </motion.div>
  )
}

// ============ NAVIGATION ============
const Navigation = ({ currentSection, onNavigate, isVisible }) => {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.button
          onClick={() => onNavigate(0)}
          className="text-2xl font-black tracking-tighter"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-violet">SA</span>
        </motion.button>

        {/* Nav links - Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {SECTIONS.map((section, i) => (
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

        {/* CTA Button */}
        <motion.button
          onClick={() => onNavigate(5)}
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

// ============ SECTION INDICATOR ============
const SectionIndicator = ({ currentSection, onNavigate, total }) => {
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
            {SECTIONS[i]}
          </span>
          <motion.div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSection === i
                ? 'bg-cyan scale-150 shadow-[0_0_15px_rgba(0,240,255,0.8)]'
                : 'bg-white/30 hover:bg-white/60'
            }`}
            animate={currentSection === i ? { scale: [1.5, 1.8, 1.5] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
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

// ============ INTRO SECTION ============
const IntroSection = ({ onNavigate }) => {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered title reveal
      gsap.fromTo(titleRef.current?.children || [],
        { y: 100, opacity: 0, rotateX: -90 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.1, ease: 'power4.out', delay: 0.3 }
      )

      gsap.fromTo(subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: 'power3.out' }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section ref={containerRef} className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
      {/* Animated gradient orbs */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-30 blur-[150px]"
        style={{
          background: 'radial-gradient(circle, rgba(0,240,255,0.4) 0%, transparent 70%)',
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-30 blur-[120px] right-0 bottom-0"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
          transform: `translate(${-mousePos.x * 0.5}px, ${-mousePos.y * 0.5}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 240, 255, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 240, 255, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px'
      }} />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl">
        {/* Terminal-style badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-white/60 font-mono">~/associate-director</span>
        </motion.div>

        {/* Main title */}
        <h1 ref={titleRef} className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 overflow-hidden" style={{ perspective: '1000px' }}>
          <span className="block text-white">SUGANTHAN</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan via-violet to-pink">
            ARULVELAN
          </span>
        </h1>

        {/* Subtitle */}
        <div ref={subtitleRef} className="mb-12">
          <p className="text-xl md:text-2xl text-white/60 font-light mb-4">
            Software <span className="text-cyan font-medium">Architect</span> & <span className="text-violet font-medium">Engineering Leader</span>
          </p>
          <p className="text-white/40 max-w-2xl mx-auto leading-relaxed">
            7+ years crafting enterprise systems with zero production incidents.
            Scaling teams from 0 to 20. Building what others say is impossible.
          </p>
        </div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {[
            { value: '7+', label: 'Years' },
            { value: '0', label: 'Incidents' },
            { value: '99.9%', label: 'Uptime' },
            { value: '20+', label: 'Team Size' },
          ].map((stat, i) => (
            <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan to-violet">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.button
            onClick={() => onNavigate(2)}
            className="group px-8 py-4 bg-gradient-to-r from-cyan to-violet text-space font-bold rounded-full flex items-center gap-3"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0, 240, 255, 0.4)' }}
            whileTap={{ scale: 0.95 }}
          >
            Explore My Universe
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
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.5, y: { repeat: Infinity, duration: 1.5 } }}
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

// ============ ABOUT SECTION ============
const AboutSection = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-card',
        { y: 100, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top center'
          }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 py-24">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-violet/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-cyan text-sm font-mono tracking-wider mb-4 block">// ABOUT</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            <span className="text-white">The </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-violet">Story</span>
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: '🎯',
              title: 'Mission',
              description: 'Building enterprise systems that scale infinitely while maintaining zero incidents. Every line of code is a promise of reliability.'
            },
            {
              icon: '⚡',
              title: 'Approach',
              description: 'I believe in elegant solutions to complex problems. Clean architecture, automated everything, and documentation that actually helps.'
            },
            {
              icon: '🚀',
              title: 'Impact',
              description: 'From 10 users to 150+. From legacy systems to cloud-native. From solo developer to leading a team of 20 engineers.'
            },
            {
              icon: '🧠',
              title: 'Philosophy',
              description: 'Code is poetry written for machines and humans alike. If it\'s not maintainable, it\'s not done.'
            },
            {
              icon: '🌍',
              title: 'Vision',
              description: 'Technology should empower, not complicate. I build systems that make people\'s lives easier, not harder.'
            },
            {
              icon: '💡',
              title: 'Innovation',
              description: 'AI integration, event-driven architectures, kubernetes orchestration - always pushing the boundaries of what\'s possible.'
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              className="about-card group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-cyan/50 transition-all duration-500"
              whileHover={{
                y: -10,
                boxShadow: '0 20px 40px rgba(0, 240, 255, 0.1)',
                borderColor: 'rgba(0, 240, 255, 0.5)'
              }}
            >
              <span className="text-4xl mb-4 block">{card.icon}</span>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan transition-colors">
                {card.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ NEURAL NETWORK SECTION ============
const NeuralSection = () => {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [activeSkill, setActiveSkill] = useState(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const skills = [
    { id: 'dotnet', name: '.NET Core', level: 95, x: 20, y: 30, category: 'backend' },
    { id: 'azure', name: 'Azure', level: 92, x: 35, y: 20, category: 'cloud' },
    { id: 'k8s', name: 'Kubernetes', level: 90, x: 50, y: 35, category: 'devops' },
    { id: 'svelte', name: 'Svelte', level: 90, x: 65, y: 25, category: 'frontend' },
    { id: 'snowflake', name: 'Snowflake', level: 95, x: 80, y: 30, category: 'data' },
    { id: 'python', name: 'Python', level: 85, x: 25, y: 55, category: 'backend' },
    { id: 'openai', name: 'OpenAI', level: 85, x: 40, y: 65, category: 'ai' },
    { id: 'react', name: 'React', level: 82, x: 55, y: 55, category: 'frontend' },
    { id: 'kdb', name: 'KDB+', level: 85, x: 70, y: 65, category: 'data' },
    { id: 'node', name: 'Node.js', level: 80, x: 30, y: 80, category: 'backend' },
    { id: 'keda', name: 'KEDA', level: 88, x: 50, y: 80, category: 'devops' },
    { id: 'sql', name: 'SQL', level: 90, x: 70, y: 80, category: 'data' },
  ]

  const connections = [
    ['dotnet', 'azure'], ['azure', 'k8s'], ['k8s', 'keda'],
    ['dotnet', 'snowflake'], ['snowflake', 'kdb'], ['kdb', 'sql'],
    ['svelte', 'react'], ['python', 'openai'], ['node', 'python'],
    ['azure', 'openai'], ['k8s', 'azure'], ['dotnet', 'python']
  ]

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Draw neural connections
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0) return

    const ctx = canvas.getContext('2d')
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    let animationFrame
    let time = 0

    const animate = () => {
      time += 0.02
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      connections.forEach(([from, to]) => {
        const fromSkill = skills.find(s => s.id === from)
        const toSkill = skills.find(s => s.id === to)
        if (!fromSkill || !toSkill) return

        const x1 = (fromSkill.x / 100) * canvas.width
        const y1 = (fromSkill.y / 100) * canvas.height
        const x2 = (toSkill.x / 100) * canvas.width
        const y2 = (toSkill.y / 100) * canvas.height

        // Animated gradient
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
        const offset = (Math.sin(time + fromSkill.x * 0.1) + 1) / 2
        gradient.addColorStop(0, 'rgba(0, 240, 255, 0.1)')
        gradient.addColorStop(offset, 'rgba(139, 92, 246, 0.4)')
        gradient.addColorStop(1, 'rgba(236, 72, 153, 0.1)')

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.stroke()

        // Traveling particle
        const particlePos = (time * 0.3 + fromSkill.x * 0.01) % 1
        const px = x1 + (x2 - x1) * particlePos
        const py = y1 + (y2 - y1) * particlePos

        ctx.beginPath()
        ctx.arc(px, py, 3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 240, 255, 0.8)'
        ctx.fill()
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationFrame)
  }, [dimensions])

  const categoryColors = {
    backend: 'from-cyan to-blue-500',
    frontend: 'from-violet to-purple-500',
    data: 'from-pink to-rose-500',
    cloud: 'from-cyan to-violet',
    devops: 'from-green-400 to-cyan',
    ai: 'from-violet to-pink'
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-space via-space to-[#0a0a20]" />

      <div className="relative z-10 max-w-7xl w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-violet text-sm font-mono tracking-wider mb-4 block">// SKILLS NETWORK</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            <span className="text-white">Neural </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-violet to-pink">Architecture</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            An interconnected ecosystem of technologies working in harmony
          </p>
        </motion.div>

        {/* Neural network visualization */}
        <div ref={containerRef} className="relative h-[500px] md:h-[600px]">
          <canvas ref={canvasRef} className="absolute inset-0" />

          {/* Skill nodes */}
          {skills.map((skill, i) => (
            <motion.button
              key={skill.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10`}
              style={{ left: `${skill.x}%`, top: `${skill.y}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => setActiveSkill(activeSkill === skill.id ? null : skill.id)}
            >
              <div className={`
                relative px-3 py-2 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold
                bg-gradient-to-r ${categoryColors[skill.category]}
                ${activeSkill === skill.id ? 'ring-2 ring-white ring-offset-2 ring-offset-space' : ''}
                transition-all cursor-pointer text-space
              `}>
                {skill.name}

                {/* Skill level indicator */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full px-2">
                  <div className="h-0.5 bg-black/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white/80"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.8 }}
                    />
                  </div>
                </div>

                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${categoryColors[skill.category]} blur-lg opacity-50 -z-10`} />
              </div>

              {/* Expanded info */}
              <AnimatePresence>
                {activeSkill === skill.id && (
                  <motion.div
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 p-3 bg-space/90 backdrop-blur-xl border border-white/20 rounded-xl whitespace-nowrap z-20"
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  >
                    <div className="text-white font-bold">{skill.name}</div>
                    <div className="text-cyan text-sm">{skill.level}% Proficiency</div>
                    <div className="text-white/40 text-xs capitalize">{skill.category}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* Category legend */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${color}`} />
              <span className="text-white/40 text-xs capitalize">{cat}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ============ ACHIEVEMENTS SECTION ============
const AchievementsSection = () => {
  const achievements = [
    {
      metric: '1600%',
      title: 'User Growth Achieved',
      description: 'Scaled platform from 10 to 150+ enterprise users with zero incidents',
      gradient: 'from-cyan to-blue-500'
    },
    {
      metric: '30',
      suffix: 'days',
      title: 'Full Platform Migration',
      description: 'Rewrote Node.js to .NET Core with zero downtime deployment',
      gradient: 'from-violet to-purple-500'
    },
    {
      metric: 'GPT-4',
      title: 'AI Integration at Scale',
      description: 'Enterprise-grade AI processing with Kubernetes orchestration',
      gradient: 'from-pink to-rose-500'
    },
    {
      metric: '99.9%',
      title: 'Uptime Maintained',
      description: 'Production SLA across all platforms and services',
      gradient: 'from-green-400 to-cyan'
    },
  ]

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 py-24">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink/10 rounded-full blur-[180px]" />
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        {/* Header */}
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

        {/* Achievement cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {achievements.map((item, i) => (
            <motion.div
              key={i}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.div
                className="relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden h-full"
                whileHover={{
                  y: -10,
                  borderColor: 'rgba(255,255,255,0.3)',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.3)'
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                {/* Metric */}
                <div className="mb-6">
                  <span className={`text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r ${item.gradient}`}>
                    {item.metric}
                  </span>
                  {item.suffix && <span className="text-2xl text-white/40 ml-2">{item.suffix}</span>}
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-all">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-white/40 leading-relaxed">
                  {item.description}
                </p>

                {/* Corner accent */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${item.gradient} opacity-20 blur-2xl`} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ TIMELINE SECTION ============
const TimelineSection = () => {
  const timeline = [
    { year: '2025', role: 'Associate Director', company: 'Syneos Health', highlight: 'Leading 20+ engineers' },
    { year: '2024', role: 'Principal Engineer', company: 'Syneos Health', highlight: 'AI & K8s Architecture' },
    { year: '2023', role: 'Senior Full Stack', company: 'Syneos Health', highlight: 'Desktop & Web Apps' },
    { year: '2018', role: 'Embedded Engineer', company: 'SUGUS', highlight: 'IoT & Industrial Systems' },
  ]

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 py-24">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet/30 to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-green-400 text-sm font-mono tracking-wider mb-4 block">// JOURNEY</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            <span className="text-white">Career </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-violet">Evolution</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan via-violet to-pink" />

          {timeline.map((item, i) => (
            <motion.div
              key={i}
              className={`relative flex items-center mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Dot */}
              <div className="absolute left-8 md:left-1/2 w-4 h-4 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan to-violet shadow-[0_0_20px_rgba(0,240,255,0.5)]" />

              {/* Content */}
              <div className={`ml-16 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                <motion.div
                  className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
                  whileHover={{
                    borderColor: 'rgba(0, 240, 255, 0.5)',
                    boxShadow: '0 0 30px rgba(0, 240, 255, 0.1)'
                  }}
                >
                  <span className="text-cyan font-mono text-sm">{item.year}</span>
                  <h3 className="text-xl font-bold text-white mt-1">{item.role}</h3>
                  <p className="text-white/40 text-sm">{item.company}</p>
                  <p className="text-violet text-sm mt-2">{item.highlight}</p>
                </motion.div>
              </div>
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
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-violet/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-cyan/10 rounded-full blur-[180px]" />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Header */}
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
          <p className="text-white/40 max-w-xl mx-auto">
            Have a challenging project? Looking for technical leadership?
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact info */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {[
              { icon: '📧', label: 'Email', value: 'suganthan94@yahoo.com', href: 'mailto:suganthan94@yahoo.com' },
              { icon: '💼', label: 'LinkedIn', value: 'Connect with me', href: 'https://www.linkedin.com/in/suganthan-arulvelan-a9356073/' },
              { icon: '🐙', label: 'GitHub', value: 'View my code', href: 'https://github.com/shuganth' },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-cyan/50 transition-colors group"
                whileHover={{ x: 5 }}
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="text-white/40 text-xs">{item.label}</div>
                  <div className="text-white group-hover:text-cyan transition-colors">{item.value}</div>
                </div>
              </motion.a>
            ))}

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-white/40 text-xs mb-1">Location</div>
              <div className="text-white">Salem, Tamil Nadu, India</div>
              <div className="text-cyan text-sm mt-1">Open to remote opportunities</div>
            </div>
          </motion.div>

          {/* Contact form */}
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
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-cyan focus:outline-none transition-colors"
              />
              <input
                type="email"
                placeholder="your@email.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-cyan focus:outline-none transition-colors"
              />
              <textarea
                placeholder="Tell me about your project..."
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-cyan focus:outline-none transition-colors resize-none"
              />
              <motion.button
                type="submit"
                disabled={status !== 'idle'}
                className="w-full py-4 bg-gradient-to-r from-cyan to-violet text-space font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0, 240, 255, 0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                {status === 'sending' ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-space border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : status === 'sent' ? (
                  <>✓ Message Sent!</>
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
        </div>

        {/* Footer */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-white/20 text-sm">
            © {new Date().getFullYear()} Suganthan Arulvelan. Engineered with precision.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ============ MAIN COMPONENT ============
export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const containerRef = useRef(null)
  const isTransitioning = useRef(false)

  const navigateTo = useCallback((index) => {
    if (index < 0 || index >= SECTIONS.length || isTransitioning.current) return
    isTransitioning.current = true
    setCurrentSection(index)
    setTimeout(() => { isTransitioning.current = false }, 800)
  }, [])

  // Wheel navigation
  useEffect(() => {
    if (!isLoaded) return

    let wheelTimeout = null
    const handleWheel = (e) => {
      if (wheelTimeout) return

      wheelTimeout = setTimeout(() => { wheelTimeout = null }, 1000)

      if (e.deltaY > 50) {
        navigateTo(currentSection + 1)
      } else if (e.deltaY < -50) {
        navigateTo(currentSection - 1)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [isLoaded, currentSection, navigateTo])

  // Touch navigation
  const touchStartY = useRef(0)

  useEffect(() => {
    if (!isLoaded) return

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e) => {
      const diff = touchStartY.current - e.changedTouches[0].clientY
      if (Math.abs(diff) > 80) {
        navigateTo(currentSection + (diff > 0 ? 1 : -1))
      }
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isLoaded, currentSection, navigateTo])

  // Keyboard navigation
  useEffect(() => {
    if (!isLoaded) return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        navigateTo(currentSection + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        navigateTo(currentSection - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLoaded, currentSection, navigateTo])

  const sections = [
    <IntroSection key="intro" onNavigate={navigateTo} />,
    <AboutSection key="about" />,
    <NeuralSection key="neural" />,
    <AchievementsSection key="achievements" />,
    <TimelineSection key="timeline" />,
    <ConnectSection key="connect" />,
  ]

  return (
    <div ref={containerRef} className="h-screen overflow-hidden bg-space">
      <AnimatePresence mode="wait">
        {!isLoaded && <Preloader key="preloader" onComplete={() => setIsLoaded(true)} />}
      </AnimatePresence>

      {isLoaded && (
        <>
          <Navigation currentSection={currentSection} onNavigate={navigateTo} isVisible={true} />
          <SectionIndicator currentSection={currentSection} onNavigate={navigateTo} total={SECTIONS.length} />
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
