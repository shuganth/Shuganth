'use client'

import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState('default')
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  const containerRef = useRef(null)
  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const workRef = useRef(null)
  const techRef = useRef(null)
  const contactRef = useRef(null)

  useEffect(() => {
    setMounted(true)

    // Custom cursor movement
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })

      // GSAP cursor animation
      if (cursorRef.current && cursorDotRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX - 20,
          y: e.clientY - 20,
          duration: 0.5,
          ease: 'power2.out'
        })
        gsap.to(cursorDotRef.current, {
          x: e.clientX - 4,
          y: e.clientY - 4,
          duration: 0.1
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    // GSAP Animations
    const ctx = gsap.context(() => {
      // Hero section animations
      gsap.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.2
      })

      gsap.from('.hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out'
      })

      gsap.from('.hero-stats', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
      })

      // Floating SA watermark
      gsap.to('.floating-sa', {
        y: -50,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      // Gradient orbs animation
      gsap.to('.gradient-orb-1', {
        x: 100,
        y: -50,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      gsap.to('.gradient-orb-2', {
        x: -80,
        y: 60,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      // Scroll-triggered animations
      // About section
      gsap.from('.about-image', {
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      })

      gsap.from('.about-content', {
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        x: 100,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
      })

      // Work section - cards stagger
      gsap.from('.work-card', {
        scrollTrigger: {
          trigger: workRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      })

      // Tech icons
      gsap.from('.tech-icon', {
        scrollTrigger: {
          trigger: techRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'back.out(1.7)'
      })

      // Contact section
      gsap.from('.contact-content', {
        scrollTrigger: {
          trigger: contactRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      })

      // Parallax effect on scroll
      gsap.to('.parallax-bg', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
        },
        y: 300,
        ease: 'none'
      })

    }, containerRef)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      ctx.revert()
    }
  }, [])

  // Magnetic effect for buttons
  const handleMagneticMove = (e, element) => {
    const rect = element.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    gsap.to(element, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const handleMagneticLeave = (element) => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)'
    })
  }

  const techStack = [
    { name: 'Azure', color: '#0078D4' },
    { name: 'Kubernetes', color: '#326CE5' },
    { name: 'Docker', color: '#2496ED' },
    { name: 'React', color: '#61DAFB' },
    { name: 'Python', color: '#3776AB' },
    { name: 'Snowflake', color: '#29B5E8' },
    { name: '.NET', color: '#512BD4' },
    { name: 'Svelte', color: '#FF3E00' },
    { name: 'OpenAI', color: '#00A67E' },
    { name: 'TypeScript', color: '#3178C6' },
    { name: 'Auth0', color: '#EB5424' },
    { name: 'SQL Server', color: '#CC2927' },
    { name: 'Git', color: '#F05032' },
    { name: 'Databricks', color: '#FF3621' },
  ]

  return (
    <div ref={containerRef} className="bg-black text-white overflow-hidden relative">
      {/* Custom Cursor */}
      {mounted && (
        <>
          <div
            ref={cursorRef}
            className={`fixed w-10 h-10 border-2 rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-200 ${
              cursorVariant === 'hover' ? 'scale-150 border-orange-500 bg-orange-500/20' : 'border-white'
            }`}
            style={{ left: 0, top: 0 }}
          />
          <div
            ref={cursorDotRef}
            className="fixed w-2 h-2 bg-orange-500 rounded-full pointer-events-none z-[9999]"
            style={{ left: 0, top: 0 }}
          />
        </>
      )}

      {/* Gradient Orbs - Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="gradient-orb-1 absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-[120px]" />
        <div className="gradient-orb-2 absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-amber-500/15 to-orange-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-600/10 to-transparent rounded-full blur-[150px]" />
      </div>

      {/* Floating SA Watermark */}
      <div className="floating-sa fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <span className="text-[40vw] font-black text-white/[0.02] select-none leading-none tracking-tighter">
          SA
        </span>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a
            href="#"
            className="group relative"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <span className="text-2xl font-black bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              SA
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-400 group-hover:w-full transition-all duration-300" />
          </a>

          <div className="flex items-center gap-8">
            {['About', 'Work', 'Tech', 'Contact'].map((item, i) => (
              <a
                key={i}
                href={`#${item.toLowerCase()}`}
                className="relative group text-sm font-medium text-gray-400 hover:text-white transition-colors"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 relative pt-24">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          {/* Overline with animation */}
          <div className="flex items-center gap-4 mb-8 hero-title">
            <div className="w-12 h-px bg-gradient-to-r from-orange-500 to-transparent" />
            <span className="text-orange-500 text-sm font-medium tracking-wider uppercase">Associate Director @ Syneos Health</span>
          </div>

          {/* Main Title */}
          <h1 className="mb-8">
            <span className="hero-title block text-[12vw] md:text-[10vw] lg:text-[8vw] font-black leading-[0.85] tracking-tight text-white">
              Suganthan
            </span>
            <span className="hero-title block text-[12vw] md:text-[10vw] lg:text-[8vw] font-black leading-[0.85] tracking-tight bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Arulvelan
            </span>
          </h1>

          {/* Tagline */}
          <p className="hero-subtitle text-xl md:text-2xl lg:text-3xl text-gray-400 max-w-3xl leading-relaxed mb-12">
            I architect <span className="text-white font-medium">healthcare platforms</span> that scale to
            thousands with <span className="text-orange-500 font-medium">zero incidents</span>.
            From embedded systems to enterprise cloud.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-12 md:gap-20">
            {[
              { num: '1,600%', label: 'User Growth', color: 'from-orange-500 to-amber-400' },
              { num: '20+', label: 'Engineers Led', color: 'from-amber-400 to-yellow-300' },
              { num: '99.9%', label: 'Uptime SLA', color: 'from-red-500 to-orange-500' },
            ].map((stat, i) => (
              <div
                key={i}
                className="hero-stats group cursor-default"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                <div className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}>
                  {stat.num}
                </div>
                <div className="text-sm text-gray-500 mt-1 group-hover:text-gray-300 transition-colors">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 mt-12">
            <a
              href="mailto:suganthan94@yahoo.com"
              className="magnetic-btn relative px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold rounded-full overflow-hidden group"
              onMouseEnter={(e) => { setCursorVariant('hover'); handleMagneticMove(e, e.currentTarget) }}
              onMouseLeave={(e) => { setCursorVariant('default'); handleMagneticLeave(e.currentTarget) }}
              onMouseMove={(e) => handleMagneticMove(e, e.currentTarget)}
            >
              <span className="relative z-10">Get in Touch</span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </a>
            <a
              href="https://linkedin.com/in/suganthan-arulvelan-a9356073"
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-btn px-8 py-4 border-2 border-white/20 text-white font-bold rounded-full hover:border-orange-500 hover:text-orange-500 transition-all"
              onMouseEnter={(e) => { setCursorVariant('hover'); handleMagneticMove(e, e.currentTarget) }}
              onMouseLeave={(e) => { setCursorVariant('default'); handleMagneticLeave(e.currentTarget) }}
              onMouseMove={(e) => handleMagneticMove(e, e.currentTarget)}
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs text-gray-600 uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-orange-500 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ABOUT SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="about" ref={aboutRef} className="min-h-screen py-32 px-6 md:px-12 lg:px-24 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <div className="about-image relative group">
              {/* Decorative elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Main image container */}
              <div className="relative rounded-2xl overflow-hidden bg-zinc-900">
                <img
                  src="/profile.jpg"
                  alt="Suganthan Arulvelan"
                  className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Glitch effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-color-dodge">
                  <div className="absolute inset-0 bg-orange-500/20 animate-pulse" />
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-orange-500 to-amber-500 text-black px-6 py-3 rounded-2xl font-bold shadow-2xl shadow-orange-500/30">
                <span className="text-2xl">10+</span>
                <span className="text-sm ml-1">Years</span>
              </div>

              {/* Corner accents */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-l-4 border-t-4 border-orange-500" />
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-4 border-b-4 border-orange-500" />
            </div>

            {/* Content Side */}
            <div className="about-content">
              <span className="text-orange-500 text-sm font-medium tracking-wider uppercase mb-4 block">The Journey</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-8">
                From <span className="text-gradient">microcontrollers</span><br/>
                to enterprise scale
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Started programming embedded systems for <span className="text-white">Bosch</span> and <span className="text-white">TVS</span>.
                Led engineering teams at Syneos Health building platforms that process
                <span className="text-orange-500"> millions of healthcare data points</span> daily.
              </p>

              {/* Timeline */}
              <div className="space-y-6">
                {[
                  { year: '2025', title: 'Associate Director', company: 'Syneos Health' },
                  { year: '2024', title: 'Principal Engineer', company: '30-day AIP Migration' },
                  { year: '2019', title: 'Senior Engineer', company: 'Platform Architecture' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 group cursor-default"
                    onMouseEnter={() => setCursorVariant('hover')}
                    onMouseLeave={() => setCursorVariant('default')}
                  >
                    <div className="w-16 text-orange-500 font-mono font-bold group-hover:scale-110 transition-transform">{item.year}</div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:scale-150 transition-transform" />
                    <div>
                      <div className="font-bold text-white group-hover:text-orange-500 transition-colors">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.company}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* WORK SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="work" ref={workRef} className="py-32 px-6 md:px-12 lg:px-24 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <span className="text-orange-500 text-sm font-medium tracking-wider uppercase">Featured Work</span>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mt-4">
                Impact<span className="text-orange-500">.</span>
              </h2>
            </div>
          </div>

          <div className="space-y-8">
            {[
              {
                num: '01',
                title: 'Precision Targeting Platform',
                desc: 'Enterprise analytics platform serving 8,000+ users. First to meet company-wide security and performance standards.',
                metric: '1,600%',
                metricLabel: 'User Growth',
                tech: ['Svelte', '.NET Core', 'Snowflake', 'Azure'],
                gradient: 'from-orange-500 to-red-500'
              },
              {
                num: '02',
                title: 'AIP Modernization',
                desc: 'Complete backend rewrite enabling multi-database architecture. Zero downtime during migration.',
                metric: '30 days',
                metricLabel: 'Migration Time',
                tech: ['.NET Core', 'KDB+', 'Databricks', 'SQL Server'],
                gradient: 'from-amber-500 to-orange-500'
              },
              {
                num: '03',
                title: 'KOL Analytics Engine',
                desc: 'Distributed processing with KEDA auto-scaling. GPT-4o powered insights for healthcare professionals.',
                metric: 'AI-Powered',
                metricLabel: 'Analytics',
                tech: ['Kubernetes', 'Azure', 'OpenAI', 'Python'],
                gradient: 'from-yellow-500 to-amber-500'
              },
            ].map((project, i) => (
              <div
                key={i}
                className="work-card group relative p-8 md:p-12 rounded-3xl bg-zinc-900/50 border border-white/10 hover:border-orange-500/50 transition-all duration-500 overflow-hidden cursor-default"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                {/* Background Number */}
                <div className="absolute -right-8 -top-8 text-[15rem] font-black text-white/[0.02] select-none leading-none group-hover:text-orange-500/[0.05] transition-colors duration-500">
                  {project.num}
                </div>

                <div className="relative flex flex-col md:flex-row md:items-center gap-8">
                  <div className="flex-1">
                    <span className={`text-transparent bg-gradient-to-r ${project.gradient} bg-clip-text font-mono text-sm font-bold`}>{project.num}</span>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mt-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 group-hover:bg-clip-text transition-all duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 mt-3 text-lg">{project.desc}</p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.tech.map((tech, j) => (
                        <span key={j} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 group-hover:border-orange-500/30 group-hover:text-orange-400 transition-all">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="md:text-right">
                    <div className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                      {project.metric}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{project.metricLabel}</div>
                  </div>
                </div>

                {/* Hover line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500 group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TECH STACK SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="tech" ref={techRef} className="py-32 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 text-sm font-medium tracking-wider uppercase">Arsenal</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4">
              Tech Stack<span className="text-orange-500">.</span>
            </h2>
          </div>

          {/* Tech Grid with Color */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {techStack.map((tech, i) => (
              <div
                key={i}
                className="tech-icon group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-transparent transition-all duration-300 cursor-default overflow-hidden"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
                style={{ '--tech-color': tech.color }}
              >
                {/* Glow effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"
                  style={{ backgroundColor: tech.color }}
                />

                {/* Border glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{ boxShadow: `inset 0 0 0 2px ${tech.color}` }}
                />

                {/* Tech initial as icon */}
                <div
                  className="text-4xl font-black text-gray-600 group-hover:text-white transition-colors duration-300"
                  style={{ '--hover-color': tech.color }}
                >
                  {tech.name.charAt(0)}
                </div>

                <span
                  className="mt-2 text-xs font-medium text-gray-500 group-hover:text-white transition-colors duration-300"
                >
                  {tech.name}
                </span>
              </div>
            ))}
          </div>

          {/* Skill Categories */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              { title: 'Cloud & DevOps', icon: '☁️', color: 'from-blue-500 to-cyan-500', items: ['Azure Kubernetes', 'Docker', 'KEDA', 'Service Bus', 'CI/CD'] },
              { title: 'Backend & Data', icon: '⚡', color: 'from-purple-500 to-pink-500', items: ['.NET Core', 'Python', 'Snowflake', 'KDB+', 'SQL Server'] },
              { title: 'Frontend & AI', icon: '🧠', color: 'from-orange-500 to-red-500', items: ['Svelte', 'React', 'OpenAI GPT-4', 'Auth0', 'TypeScript'] },
            ].map((group, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl bg-zinc-900/50 border border-white/10 hover:border-white/30 transition-all duration-300"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{group.icon}</span>
                  <h3 className={`text-xl font-bold bg-gradient-to-r ${group.color} bg-clip-text text-transparent`}>{group.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item, j) => (
                    <span
                      key={j}
                      className="px-4 py-2 bg-white/5 rounded-lg text-sm text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white transition-all cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CONTACT SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="contact" ref={contactRef} className="min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 relative">
        <div className="contact-content text-center max-w-4xl relative z-10">
          <span className="text-orange-500 text-sm font-medium tracking-wider uppercase">Let's Connect</span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mt-6 mb-8">
            Build something<br/>
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              extraordinary
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto">
            Healthcare tech, distributed systems, or enterprise architecture—let's create something remarkable together.
          </p>

          <a
            href="mailto:suganthan94@yahoo.com"
            className="magnetic-btn group inline-flex items-center gap-4 text-2xl md:text-3xl font-bold text-white hover:text-orange-500 transition-colors"
            onMouseEnter={(e) => { setCursorVariant('hover'); handleMagneticMove(e, e.currentTarget) }}
            onMouseLeave={(e) => { setCursorVariant('default'); handleMagneticLeave(e.currentTarget) }}
            onMouseMove={(e) => handleMagneticMove(e, e.currentTarget)}
          >
            <span className="relative">
              suganthan94@yahoo.com
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </span>
            <svg className="w-8 h-8 group-hover:translate-x-2 group-hover:text-orange-500 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>

          <div className="flex justify-center gap-8 mt-16 text-gray-500">
            <a
              href="https://linkedin.com/in/suganthan-arulvelan-a9356073"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition-colors"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              LinkedIn
            </a>
            <span>•</span>
            <span>Salem, India</span>
            <span>•</span>
            <span>+91 9080704073</span>
          </div>
        </div>

        {/* Background SA */}
        <div className="absolute bottom-0 right-0 text-[30vw] font-black text-white/[0.02] select-none leading-none pointer-events-none">
          SA
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <span>© {new Date().getFullYear()} Suganthan Arulvelan</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Available for opportunities
          </span>
          <span>English • Tamil • French</span>
        </div>
      </footer>

      {/* Styles */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        .text-gradient {
          background: linear-gradient(to right, #f97316, #fbbf24);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Hide cursor on mobile */
        @media (max-width: 768px) {
          .fixed.w-10,
          .fixed.w-2 {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
