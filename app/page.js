'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export default function Home() {
  const canvasRef = useRef(null)
  const [activeSection, setActiveSection] = useState('hero')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [terminalText, setTerminalText] = useState('')
  const [showContent, setShowContent] = useState(false)
  const [expandedCard, setExpandedCard] = useState(null)
  const [mounted, setMounted] = useState(false)
  const particlesRef = useRef([])
  const animationRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Particle system
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width = window.innerWidth
    let height = window.innerHeight

    canvas.width = width
    canvas.height = height

    // Create particles
    const particleCount = 150
    particlesRef.current = []

    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        hue: Math.random() > 0.5 ? 20 : 45, // ember or gold
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, width, height)

      particlesRef.current.forEach((p, i) => {
        // Mouse influence
        const dx = mousePos.x - p.x
        const dy = mousePos.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 150) {
          const force = (150 - dist) / 150
          p.vx -= (dx / dist) * force * 0.02
          p.vy -= (dy / dist) * force * 0.02
        }

        // Update position
        p.x += p.vx
        p.y += p.vy

        // Boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        // Draw
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 100%, 50%, ${p.opacity})`
        ctx.fill()

        // Connect nearby particles
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2)
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(255, 77, 0, ${0.1 * (1 - d / 100)})`
            ctx.stroke()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [mousePos])

  // Mouse tracking
  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  // Terminal boot sequence
  useEffect(() => {
    const bootSequence = [
      { text: '> Initializing system...', delay: 0 },
      { text: '> Loading neural networks...', delay: 400 },
      { text: '> Establishing connections...', delay: 800 },
      { text: '> Building healthcare analytics...', delay: 1200 },
      { text: '> Deploying to Azure Kubernetes...', delay: 1600 },
      { text: '> System ready.', delay: 2000 },
      { text: '> Welcome to SA.', delay: 2400 },
    ]

    let currentText = ''

    bootSequence.forEach(({ text, delay }) => {
      setTimeout(() => {
        currentText += text + '\n'
        setTerminalText(currentText)
      }, delay)
    })

    setTimeout(() => {
      setIsLoaded(true)
      setTimeout(() => setShowContent(true), 500)
    }, 3000)
  }, [])

  const navItems = [
    { id: 'hero', label: 'Home', icon: '◈' },
    { id: 'journey', label: 'Journey', icon: '◉' },
    { id: 'arsenal', label: 'Arsenal', icon: '⬡' },
    { id: 'impact', label: 'Impact', icon: '◆' },
    { id: 'connect', label: 'Connect', icon: '◇' },
  ]

  const journeyData = [
    {
      year: '2018',
      title: 'The Beginning',
      role: 'Embedded Engineer',
      company: 'SUGUS',
      description: 'Started my journey programming microcontrollers. Built TDS meters for Bosch, counter systems for TVS.',
      tech: ['Embedded C', 'MicroPython', 'IoT'],
      color: '#00d4ff',
    },
    {
      year: '2021',
      title: 'Enterprise Shift',
      role: 'Project Engineer',
      company: 'Open Systems International',
      description: 'Transitioned to enterprise software. Designed ASP.NET applications and SQL optimization.',
      tech: ['ASP.NET', 'C#', 'SQL Server'],
      color: '#8b5cf6',
    },
    {
      year: '2023',
      title: 'Full Stack Mastery',
      role: 'Senior Developer',
      company: 'Syneos Health',
      description: 'Built KDB IDE with spreadsheet functionality. Created DEI reporting tools.',
      tech: ['WPF', 'Svelte', 'Plotly'],
      color: '#ffd700',
    },
    {
      year: '2024',
      title: 'Principal Role',
      role: 'Principal Engineer',
      company: 'Syneos Health',
      description: '30-day migration from Node.js to .NET Core. Zero downtime. GPT-4o integration.',
      tech: ['.NET Core', 'OpenAI', 'Snowflake'],
      color: '#ff4d00',
    },
    {
      year: '2025',
      title: 'Leadership',
      role: 'Associate Director',
      company: 'Syneos Health',
      description: 'Leading 20 engineers. 1600% user growth. Enterprise platforms at scale.',
      tech: ['Azure', 'Kubernetes', 'KEDA'],
      color: '#ff4d00',
    },
  ]

  const techArsenal = [
    { name: 'Azure', category: 'Cloud', power: 95, description: 'Kubernetes, Service Bus, Functions' },
    { name: '.NET Core', category: 'Backend', power: 98, description: 'High-performance APIs, microservices' },
    { name: 'Snowflake', category: 'Data', power: 92, description: 'Data warehousing, analytics' },
    { name: 'Svelte', category: 'Frontend', power: 90, description: 'Reactive UIs, blazing fast' },
    { name: 'Python', category: 'AI/ML', power: 85, description: 'Machine learning, automation' },
    { name: 'Kubernetes', category: 'DevOps', power: 88, description: 'Container orchestration, KEDA' },
  ]

  const impactData = [
    { metric: '1,600%', label: 'User Growth', detail: 'From pilot to enterprise-wide adoption' },
    { metric: '3,001%', label: 'Engagement', detail: 'Active usage across all teams' },
    { metric: 'Zero', label: 'Incidents', detail: 'Production stability maintained' },
    { metric: '30', label: 'Day Migration', detail: 'Node.js to .NET Core rewrite' },
    { metric: '20+', label: 'Engineers', detail: 'Cross-functional team leadership' },
    { metric: '99.9%', label: 'Uptime', detail: 'Enterprise reliability standard' },
  ]

  const scrollToSection = (id) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Particle Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)' }}
      />

      {/* Boot Sequence Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-1000 ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="font-mono text-sm text-green-400 max-w-lg p-8">
          <pre className="whitespace-pre-wrap">{terminalText}</pre>
          <span className="animate-pulse">▌</span>
        </div>
      </div>

      {/* Floating Navigation */}
      <nav
        className={`fixed left-1/2 -translate-x-1/2 bottom-8 z-40 transition-all duration-700 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-black'
                  : 'hover:bg-white/10'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium hidden md:block">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className={`relative z-10 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>

        {/* ═══════════════ HERO ═══════════════ */}
        <section id="hero" className="min-h-screen flex items-center justify-center relative px-6">
          <div className="text-center max-w-5xl">
            {/* 3D SA Logo */}
            <div
              className="relative mb-12 inline-block"
              style={mounted ? {
                transform: `perspective(1000px) rotateX(${(mousePos.y - window.innerHeight / 2) * 0.01}deg) rotateY(${(mousePos.x - window.innerWidth / 2) * 0.01}deg)`,
                transition: 'transform 0.1s ease-out',
              } : {}}
            >
              <h1 className="text-[20vw] md:text-[15vw] font-black leading-none select-none">
                <span className="inline-block bg-gradient-to-br from-orange-500 via-yellow-500 to-orange-600 bg-clip-text text-transparent drop-shadow-[0_0_80px_rgba(255,77,0,0.5)]">
                  S
                </span>
                <span className="inline-block bg-gradient-to-br from-yellow-500 via-orange-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_80px_rgba(255,215,0,0.5)]">
                  A
                </span>
              </h1>
              <div className="absolute -inset-10 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 blur-3xl -z-10 animate-pulse" />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-white">Suganthan</span>{' '}
              <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Arulvelan
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-400 mb-8">
              Associate Director • Healthcare Analytics • AI Integration
            </p>

            {/* Interactive Stats Orbs */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              {[
                { value: '1600%', label: 'Growth' },
                { value: 'Zero', label: 'Incidents' },
                { value: '20+', label: 'Engineers' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group relative cursor-pointer"
                  style={{
                    transform: `translateY(${Math.sin(Date.now() / 1000 + i) * 5}px)`,
                  }}
                >
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-xl border border-orange-500/30 flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-orange-500">
                    <span className="text-2xl font-black bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                      {stat.value}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">{stat.label}</span>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
              <span className="text-xs text-gray-500">Explore</span>
              <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex justify-center pt-2">
                <div className="w-1 h-2 bg-orange-500 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ JOURNEY ═══════════════ */}
        <section id="journey" className="min-h-screen py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-center mb-4">
              The <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Journey</span>
            </h2>
            <p className="text-gray-400 text-center mb-20 max-w-xl mx-auto">
              From programming microcontrollers to leading enterprise platform teams
            </p>

            {/* Interactive Timeline */}
            <div className="relative">
              {/* Center Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-orange-500 to-transparent" />

              {journeyData.map((item, i) => (
                <div
                  key={i}
                  className={`relative flex items-center gap-8 mb-16 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Year Marker */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-black border-4 flex items-center justify-center z-10"
                    style={{ borderColor: item.color }}
                  >
                    <span className="text-sm font-bold" style={{ color: item.color }}>{item.year}</span>
                  </div>

                  {/* Content Card */}
                  <div
                    className={`md:w-[calc(50%-4rem)] ${i % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'} ml-20 md:ml-0`}
                    onClick={() => setExpandedCard(expandedCard === i ? null : i)}
                  >
                    <div
                      className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 cursor-pointer transition-all duration-500 hover:bg-white/10 hover:border-orange-500/50 hover:scale-[1.02]"
                      style={{
                        boxShadow: expandedCard === i ? `0 0 40px ${item.color}40` : 'none',
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3" style={{ justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start' }}>
                        <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                        <span className="text-sm text-gray-400">{item.title}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{item.role}</h3>
                      <p className="text-gray-400 text-sm mb-3">{item.company}</p>

                      <div className={`overflow-hidden transition-all duration-500 ${expandedCard === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-300 text-sm mb-3">{item.description}</p>
                        <div className="flex flex-wrap gap-2" style={{ justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start' }}>
                          {item.tech.map((t, j) => (
                            <span key={j} className="px-2 py-1 text-xs rounded-full bg-white/10" style={{ color: item.color }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <span className="text-xs text-gray-500 mt-2 block">
                        {expandedCard === i ? '← Click to collapse' : 'Click to expand →'}
                      </span>
                    </div>
                  </div>

                  {/* Spacer for other side */}
                  <div className="hidden md:block md:w-[calc(50%-4rem)]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ ARSENAL ═══════════════ */}
        <section id="arsenal" className="min-h-screen py-32 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent pointer-events-none" />

          <div className="max-w-6xl mx-auto relative">
            <h2 className="text-4xl md:text-6xl font-black text-center mb-4">
              Tech <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Arsenal</span>
            </h2>
            <p className="text-gray-400 text-center mb-20 max-w-xl mx-auto">
              The tools I wield to build enterprise-grade solutions
            </p>

            {/* Hexagonal Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {techArsenal.map((tech, i) => (
                <div
                  key={i}
                  className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 transition-all duration-500 hover:bg-white/10 hover:border-orange-500/50 cursor-pointer overflow-hidden"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  {/* Power Bar Background */}
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-orange-500/20 to-transparent transition-all duration-700"
                    style={{ height: `${tech.power}%`, opacity: 0.3 }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-orange-500 font-mono">{tech.category}</span>
                      <span className="text-xs text-gray-500">{tech.power}%</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{tech.name}</h3>
                    <p className="text-sm text-gray-400">{tech.description}</p>

                    {/* Power Meter */}
                    <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-1000"
                        style={{ width: `${tech.power}%` }}
                      />
                    </div>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 pointer-events-none" />
                </div>
              ))}
            </div>

            {/* Additional Skills */}
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {['Auth0', 'Docker', 'KDB+', 'Databricks', 'WPF', 'Plotly', 'KEDA', 'Service Bus', 'Git'].map((skill, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 hover:border-orange-500/50 hover:text-orange-500 transition-all cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ IMPACT ═══════════════ */}
        <section id="impact" className="min-h-screen py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-center mb-4">
              Real <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Impact</span>
            </h2>
            <p className="text-gray-400 text-center mb-20 max-w-xl mx-auto">
              Numbers that tell the story of transformation
            </p>

            {/* Impact Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {impactData.map((item, i) => (
                <div
                  key={i}
                  className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur border border-white/10 text-center transition-all duration-500 hover:bg-white/10 hover:border-orange-500/50 hover:scale-105 cursor-default overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-2">
                      {item.metric}
                    </div>
                    <div className="text-white font-medium mb-2">{item.label}</div>
                    <div className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.detail}
                    </div>
                  </div>

                  {/* Animated Background */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl" />
                  </div>
                </div>
              ))}
            </div>

            {/* Featured Projects */}
            <div className="mt-20">
              <h3 className="text-2xl font-bold text-center mb-10">Featured Platforms</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name: 'Precision Targeting', desc: 'First enterprise-standard platform. 150+ users across Commercial StratOps.', color: '#ff4d00' },
                  { name: 'AIP Modernization', desc: '30-day Node.js to .NET Core migration. Multi-database support unlocked.', color: '#ffd700' },
                  { name: 'KOL Analytics', desc: 'GPT-4o powered distributed processing. KEDA autoscaling.', color: '#00d4ff' },
                ].map((project, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-black/50 backdrop-blur border border-white/10 transition-all duration-500 hover:border-opacity-50"
                    style={{ '--hover-color': project.color, borderColor: project.color + '30' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = project.color}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = project.color + '30'}
                  >
                    <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ background: project.color + '20' }}>
                      <span style={{ color: project.color }}>◆</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{project.name}</h4>
                    <p className="text-sm text-gray-400">{project.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ CONNECT ═══════════════ */}
        <section id="connect" className="min-h-screen py-32 px-6 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative">
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              Let's <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Connect</span>
            </h2>
            <p className="text-gray-400 mb-12 max-w-xl mx-auto">
              Building something in healthcare tech? Scaling distributed systems?
              Let's talk architecture.
            </p>

            {/* Contact Cards */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <a
                href="mailto:suganthan94@yahoo.com"
                className="group flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,77,0,0.4)]"
              >
                <span className="text-2xl">✉</span>
                <span>suganthan94@yahoo.com</span>
              </a>
              <a
                href="https://linkedin.com/in/suganthan-arulvelan-a9356073"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/5 backdrop-blur border border-white/10 font-bold transition-all duration-300 hover:scale-105 hover:border-orange-500/50"
              >
                <span className="text-2xl">in</span>
                <span>LinkedIn</span>
              </a>
            </div>

            {/* Location & Languages */}
            <div className="flex flex-wrap justify-center gap-6 text-gray-500 text-sm">
              <span>📍 Salem, Tamil Nadu</span>
              <span>•</span>
              <span>🇬🇧 English</span>
              <span>•</span>
              <span>🇮🇳 Tamil</span>
              <span>•</span>
              <span>🇫🇷 French</span>
            </div>

            {/* Large SA Watermark */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-[30vw] font-black text-white/[0.02] pointer-events-none select-none">
              SA
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-white/5 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Suganthan Arulvelan. Crafted with precision.
        </footer>
      </main>
    </div>
  )
}
