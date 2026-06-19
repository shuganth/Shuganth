'use client'

import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import anime from 'animejs'

gsap.registerPlugin(ScrollTrigger)

// ============ SA REVEAL INTRO ============
const SARevealIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState('logo')
  const progressRef = useRef(null)

  useEffect(() => {
    const timeline = anime.timeline({ easing: 'easeOutExpo' })

    timeline.add({
      targets: '.sa-letter',
      scale: [0, 1],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(150),
      easing: 'easeOutElastic(1, .5)',
    })

    timeline.add({
      targets: '.sa-glow',
      opacity: [0, 0.6],
      scale: [0.8, 1.2],
      duration: 800,
    }, '-=400')

    timeline.add({
      targets: '.letter-s',
      translateX: [0, -100],
      duration: 600,
      begin: () => setPhase('split'),
    }, '+=300')

    timeline.add({
      targets: '.letter-a',
      translateX: [0, 100],
      duration: 600,
    }, '-=600')

    timeline.add({
      targets: '.exp-word',
      translateY: [0, (el, i) => (i % 2 === 0 ? -60 - i * 15 : 60 + i * 15)],
      translateX: () => anime.random(-120, 120),
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(50),
      begin: () => setPhase('reveal'),
    }, '-=200')

    timeline.add({
      targets: ['.sa-letter', '.exp-word', '.sa-glow'],
      opacity: 0,
      scale: 0.8,
      duration: 400,
      complete: () => setTimeout(onComplete, 100),
    }, '+=400')

    // Progress bar animation
    gsap.to(progressRef.current, {
      width: '100%',
      duration: 2.5,
      ease: 'power2.inOut'
    })

    return () => timeline.pause()
  }, [onComplete])

  const words = ['Claude', 'RAG', 'Multi-Agent', 'Evals', 'Gemini', 'LLM', 'Architecture']

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden intro-overlay">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div className="sa-glow absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full opacity-0"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(249,115,22,0.2) 50%, transparent 70%)' }}
      />

      <div className="relative flex items-center justify-center" style={{ perspective: '1000px' }}>
        <div className="letter-s sa-letter">
          <span className="text-[20vw] md:text-[12vw] font-black" style={{
            background: 'linear-gradient(135deg, #3B82F6, #F97316)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 30px rgba(59,130,246,0.5))'
          }}>S</span>
        </div>
        <div className="letter-a sa-letter">
          <span className="text-[20vw] md:text-[12vw] font-black" style={{
            background: 'linear-gradient(135deg, #F97316, #EC4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 30px rgba(249,115,22,0.5))'
          }}>A</span>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {words.map((word, i) => (
          <span key={word} className="exp-word absolute text-xs md:text-base font-bold opacity-0"
            style={{ color: i % 3 === 0 ? '#3B82F6' : i % 3 === 1 ? '#F97316' : '#EC4899', textShadow: '0 0 15px currentColor' }}>
            {word}
          </span>
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-32 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div ref={progressRef} className="h-full rounded-full w-0" style={{ background: 'linear-gradient(90deg, #3B82F6, #F97316, #EC4899)' }} />
        </div>
        <p className="text-white/30 text-xs mt-2 text-center font-mono">
          {phase === 'logo' ? 'Loading...' : phase === 'split' ? 'Building experience...' : 'Welcome'}
        </p>
      </div>
    </div>
  )
}

// ============ GSAP ANIMATED SECTION ============
const AnimatedSection = ({ children, className = '' }) => {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    )
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

// ============ SKILL BAR CHART ============
const SkillBar = ({ name, level, color, delay = 0 }) => {
  const barRef = useRef(null)
  const containerRef = useRef(null)

  useLayoutEffect(() => {
    gsap.fromTo(barRef.current,
      { width: '0%' },
      {
        width: `${level}%`,
        duration: 1.2,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    )
  }, [level, delay])

  return (
    <div ref={containerRef} className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-white/80">{name}</span>
        <span className="text-white/40">{level}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div ref={barRef} className="h-full rounded-full" style={{ background: color, width: 0 }} />
      </div>
    </div>
  )
}

// ============ EXPANDABLE CARD ============
const ExpandableCard = ({ title, subtitle, period, color, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        gsap.fromTo(contentRef.current,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
        )
      } else {
        gsap.to(contentRef.current, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' })
      }
    }
  }, [isOpen])

  return (
    <div ref={cardRef} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden card-hover"
      onMouseEnter={() => gsap.to(cardRef.current, { borderColor: color + '40', duration: 0.3 })}
      onMouseLeave={() => gsap.to(cardRef.current, { borderColor: 'rgba(255,255,255,0.1)', duration: 0.3 })}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 md:p-5 text-left flex items-start gap-4"
      >
        <div className="w-1 h-full min-h-[60px] rounded-full flex-shrink-0" style={{ background: color }} />
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white">{title}</h3>
              <p className="text-white/50 text-sm">{subtitle}</p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 self-start" style={{ color }}>{period}</span>
          </div>
        </div>
        <div className="text-white/40 flex-shrink-0 mt-2 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div ref={contentRef} className="overflow-hidden" style={{ height: defaultOpen ? 'auto' : 0, opacity: defaultOpen ? 1 : 0 }}>
        <div className="px-4 md:px-5 pb-5 pl-8 md:pl-10 border-t border-white/5 pt-4">
          {children}
        </div>
      </div>
    </div>
  )
}

// ============ STAT CARD ============
const StatCard = ({ value, label, suffix = '', color }) => {
  const ref = useRef(null)
  const countRef = useRef(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useLayoutEffect(() => {
    if (typeof value !== 'number') return

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 90%',
      onEnter: () => {
        if (!hasAnimated) {
          setHasAnimated(true)
          gsap.fromTo(countRef.current,
            { innerText: 0 },
            {
              innerText: value,
              duration: 2,
              ease: 'power2.out',
              snap: { innerText: 1 },
              onUpdate: function() {
                if (countRef.current) {
                  countRef.current.innerText = Math.round(gsap.getProperty(countRef.current, 'innerText'))
                }
              }
            }
          )
        }
      }
    })
    return () => trigger.kill()
  }, [value, hasAnimated])

  return (
    <div
      ref={ref}
      className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-xl text-center stat-card"
      onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -5, borderColor: color + '40', duration: 0.3 })}
      onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, borderColor: 'rgba(255,255,255,0.1)', duration: 0.3 })}
    >
      <div className="text-3xl md:text-4xl font-black mb-1" style={{ color }}>
        {typeof value === 'number' ? <><span ref={countRef}>0</span>{suffix}</> : value}
      </div>
      <div className="text-white/40 text-sm">{label}</div>
    </div>
  )
}

// ============ NAVIGATION ============
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef(null)
  const mobileMenuRef = useRef(null)

  useEffect(() => {
    gsap.from(navRef.current, { y: -100, duration: 0.6, delay: 0.3, ease: 'power3.out' })
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileMenuRef.current) {
      if (mobileOpen) {
        gsap.fromTo(mobileMenuRef.current,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' }
        )
      } else {
        gsap.to(mobileMenuRef.current, { height: 0, opacity: 0, duration: 0.2, ease: 'power2.in' })
      }
    }
  }, [mobileOpen])

  const scrollTo = (id) => {
    gsap.to(window, { duration: 1, scrollTo: { y: `#${id}`, offsetY: 70 }, ease: 'power3.inOut' })
    setMobileOpen(false)
  }

  const links = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'ai', label: 'AI Work' },
    { id: 'skills', label: 'Skills' },
    { id: 'impact', label: 'Impact' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/5' : ''}`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <button onClick={() => scrollTo('hero')} className="text-xl font-black">
          <span style={{ background: 'linear-gradient(135deg, #3B82F6, #F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SA</span>
        </button>

        <div className="hidden md:flex items-center gap-6">
          {links.map(link => (
            <button key={link.id} onClick={() => scrollTo(link.id)} className="text-sm text-white/60 hover:text-white transition-colors">{link.label}</button>
          ))}
        </div>

        <button onClick={() => scrollTo('contact')} className="hidden md:block px-5 py-2 text-sm font-bold rounded-full" style={{ background: 'linear-gradient(135deg, #3B82F6, #F97316)' }}>
          Let&apos;s Talk
        </button>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      <div ref={mobileMenuRef} className="md:hidden overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <div className="mt-4 pb-4 border-t border-white/10 pt-4">
          {links.map(link => (
            <button key={link.id} onClick={() => scrollTo(link.id)} className="block w-full text-left py-2 text-white/60 hover:text-white">{link.label}</button>
          ))}
          <button onClick={() => scrollTo('contact')} className="mt-3 w-full py-3 text-sm font-bold rounded-full" style={{ background: 'linear-gradient(135deg, #3B82F6, #F97316)' }}>
            Let&apos;s Talk
          </button>
        </div>
      </div>
    </nav>
  )
}

// ============ HERO SECTION ============
const HeroSection = () => {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const orb1Ref = useRef(null)
  const orb2Ref = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect
      gsap.to(contentRef.current, {
        y: 150,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      })

      // Floating orbs
      gsap.to(orb1Ref.current, {
        x: 30, y: 20,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
      gsap.to(orb2Ref.current, {
        x: -20, y: -15,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      // Staggered entrance
      const tl = gsap.timeline({ delay: 0.2 })
      tl.from('.hero-photo', { scale: 0.8, opacity: 0, duration: 0.6, ease: 'back.out(1.5)' })
        .from('.hero-status', { y: 20, opacity: 0, duration: 0.4 }, '-=0.2')
        .from('.hero-title', { y: 20, opacity: 0, duration: 0.5 }, '-=0.2')
        .from('.hero-subtitle', { opacity: 0, duration: 0.4 }, '-=0.2')
        .from('.hero-desc', { opacity: 0, duration: 0.4 }, '-=0.2')
        .from('.hero-buttons', { y: 20, opacity: 0, duration: 0.4 }, '-=0.2')
        .from('.hero-social', { opacity: 0, duration: 0.4 }, '-=0.2')
        .from('.hero-scroll', { opacity: 0, duration: 0.4 }, '-=0.2')

      // Bounce scroll indicator
      gsap.to('.hero-scroll', { y: 8, duration: 0.75, repeat: -1, yoyo: true, ease: 'sine.inOut' })

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" ref={sectionRef} className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 pt-20">
      <div className="absolute inset-0">
        <div ref={orb1Ref} className="absolute w-[400px] h-[400px] rounded-full blur-[120px] opacity-20" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.6), transparent)', top: '10%', left: '10%' }} />
        <div ref={orb2Ref} className="absolute w-[350px] h-[350px] rounded-full blur-[100px] opacity-20" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.6), transparent)', bottom: '20%', right: '10%' }} />
      </div>

      <div ref={contentRef} className="relative z-10 text-center max-w-4xl">
        <div className="hero-photo mb-6">
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
            <img src="/profile.jpg" alt="Suganthan Arulvelan" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="hero-status inline-flex items-center gap-2 px-4 py-2 mb-4 bg-white/5 border border-white/10 rounded-full">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs md:text-sm text-white/60 font-mono">Open to Applied AI Architect roles</span>
        </div>

        <h1 className="hero-title text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4">
          <span className="text-white">SUGANTHAN</span><br />
          <span style={{ background: 'linear-gradient(135deg, #3B82F6, #F97316, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ARULVELAN</span>
        </h1>

        <p className="hero-subtitle text-lg md:text-xl text-white/60 mb-2">
          <span className="text-blue font-semibold">Applied AI Architect</span> • Enterprise LLM Solutions &amp; Client Advisory
        </p>

        <p className="hero-desc text-sm md:text-base text-white/40 max-w-2xl mx-auto mb-6 leading-relaxed">
          Designing &amp; shipping production LLM systems — RAG, agentic &amp; multi-agent pipelines, evals at scale<br />
          Pre-Sales Technical Lead • 2M+ Documents in Production • Zero Production Incidents
        </p>

        <div className="hero-desc flex flex-wrap justify-center gap-2 mb-8">
          {['Claude (API & for Work)', 'Google Gemini', 'Azure OpenAI'].map((m) => (
            <span key={m} className="px-3 py-1.5 text-xs font-mono rounded-full bg-white/5 border border-white/10 text-white/70">{m}</span>
          ))}
        </div>

        <div className="hero-buttons flex flex-wrap justify-center gap-3">
          <button onClick={() => gsap.to(window, { duration: 1, scrollTo: '#experience', ease: 'power3.inOut' })}
            className="px-6 py-3 font-bold rounded-full flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #3B82F6, #F97316)' }}>
            Explore My Journey
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
          </button>
          <a href="/Suganthan_Arulvelan_Resume.html" target="_blank" className="px-6 py-3 border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-colors">
            View Resume
          </a>
        </div>

        <div className="hero-social flex justify-center gap-4 mt-8">
          {[
            { icon: '💼', href: 'https://www.linkedin.com/in/suganthan-arulvelan-a9356073/', label: 'LinkedIn' },
            { icon: '🐙', href: 'https://github.com/shuganth', label: 'GitHub' },
            { icon: '📧', href: 'mailto:suganthan94@yahoo.com', label: 'Email' },
          ].map((item, i) => (
            <a key={i} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:border-blue/50 transition-colors text-lg">
              {item.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2">
        <span className="text-white/30 text-xs font-mono">SCROLL</span>
      </div>
    </section>
  )
}

// ============ ABOUT SECTION ============
const AboutSection = () => {
  return (
    <section id="about" className="py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <span className="text-blue text-sm font-mono mb-3 block">// ABOUT ME</span>
          <h2 className="text-3xl md:text-5xl font-black">
            <span className="text-white">My </span>
            <span style={{ background: 'linear-gradient(135deg, #3B82F6, #F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Story</span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <AnimatedSection>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
                <img src="/photo2.jpg" alt="Suganthan" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl overflow-hidden border-4 border-black">
                <img src="/photo3.jpg" alt="Suganthan casual" className="w-full h-full object-cover" />
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p className="text-lg">
                I design and ship <span className="text-blue font-semibold">production LLM systems</span> for global pharmaceutical clients — and act as the <span className="text-orange font-semibold">trusted technical advisor</span> across C-suite, engineering, and IT stakeholders.
              </p>
              <p>
                I&apos;m hands-on across the modern LLM stack — <span className="text-pink font-semibold">Claude (API &amp; Claude for Work)</span>, Google Gemini, and Azure OpenAI — with production-validated depth in RAG, agentic &amp; multi-agent pipelines, prompt engineering, and evaluation frameworks <span className="text-blue font-semibold">validated across 2M+ documents</span>.
              </p>
              <p>
                My edge is range: I translate ambiguous business problems into scalable, secure, compliant cloud architectures, then prove value through <span className="text-orange font-semibold">live executive demonstrations</span> — pairing genuine engineering credibility with the communication and mentoring to carry diverse audiences from discovery to deployment.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-blue font-mono text-sm">Location</div>
                  <div className="text-white">Salem / Bengaluru, India</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-orange font-mono text-sm">Languages</div>
                  <div className="text-white">English, Tamil, French</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-pink font-mono text-sm">Phone</div>
                  <div className="text-white">+91 90807 04073</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-blue font-mono text-sm">Email</div>
                  <div className="text-white text-sm">suganthan94@yahoo.com</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection className="mt-14">
          <h3 className="text-center text-white/40 text-sm font-mono mb-6">// CORE STRENGTHS FOR APPLIED AI ARCHITECTURE</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { t: 'Trusted Technical Advisor', d: 'Primary technical voice on high-priority initiatives — guiding stakeholders from discovery and evaluation through architecture to production.', c: '#3B82F6' },
              { t: 'Audience-Range Communication', d: 'From value-focused C-suite readouts and live demos to deep technical sessions for engineering teams — cited as a model for enterprise AI adoption.', c: '#F97316' },
              { t: 'LLM Solution Design', d: 'RAG, multi-agent, and high-throughput systems on Claude, Gemini, and Azure OpenAI, integrated into existing enterprise stacks.', c: '#EC4899' },
              { t: 'Evaluation Frameworks', d: 'Structured-output prompting with confidence scoring, evidence extraction, and hallucination controls — evals validated across 2M+ documents.', c: '#3B82F6' },
              { t: 'India / APAC Delivery', d: 'Lead engineering for global pharma clients from India across distributed, cross-time-zone, multi-stakeholder teams.', c: '#F97316' },
              { t: 'Teaching & Mentoring', d: 'Scaled a cross-discipline team from 10 to 20 engineers with zero attrition; established architecture standards and mentorship.', c: '#EC4899' },
            ].map((s) => (
              <div key={s.t} className="p-5 bg-white/5 border border-white/10 rounded-xl h-full transition-colors hover:border-white/20"
                onMouseEnter={(e) => gsap.to(e.currentTarget, { borderColor: s.c + '40', y: -4, duration: 0.3 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { borderColor: 'rgba(255,255,255,0.1)', y: 0, duration: 0.3 })}
              >
                <h4 className="font-bold mb-2" style={{ color: s.c }}>{s.t}</h4>
                <p className="text-white/60 text-sm leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

// ============ EXPERIENCE SECTION ============
const ExperienceSection = () => {
  const experiences = [
    {
      title: 'Director — Technical Delivery Center',
      company: 'Syneos Health · Salem, India',
      period: 'Jul 2026 - Present',
      color: '#3B82F6',
      summary: 'Promoted to Director (effective 1 July 2026), leading a 20-engineer organization across UI, middleware, data, and QA.',
      details: [
        'Continuing to lead a 20-engineer organization across UI, middleware, data, and QA disciplines',
        'Delivering enterprise healthcare-analytics and AI platforms for global pharmaceutical clients',
        'Owning architecture standards, AI-first delivery approach, and executive technical advisory',
      ],
      tech: ['Leadership', 'Enterprise AI', 'Architecture', 'Client Advisory']
    },
    {
      title: 'Associate Director — Technical Delivery Center',
      company: 'Syneos Health · Salem, India',
      period: 'Nov 2025 - Jun 2026',
      color: '#F97316',
      summary: 'Architected high-throughput LLM pipelines, RAG platforms, and multi-agent systems for global pharma clients.',
      details: [
        'Distributed AI classification pipeline: classified 2M+ legacy files with Gemini 2.0 Flash across Kubernetes workers and Azure Service Bus — 174K files/hour peak with adaptive concurrency throttling, plus real-time dashboard, prompt-validation playground, and role-based review app',
        'Built a Proposal Generator using a Gemini-embedding RAG pipeline on Snowflake for intelligent document retrieval',
        'Built Insights Studio, turning a natural-language prompt into complete interactive dashboards',
        'Delivered Precision Targeting Phase 1 to 150+ users with 1,600% user growth and 3,001% login engagement; leading Phase 3',
        'Designed KOL Analytics on Kubernetes/KEDA autoscaling for long-running (1–4 hr) analytical queries on an event-driven Azure Service Bus backbone',
        'Led a Node.js → .NET Core migration of the AIP platform in 30 days — 30% performance gain, zero downtime, zero production incidents',
      ],
      tech: ['Gemini 2.0 Flash', 'RAG', 'Multi-Agent', 'Kubernetes', 'KEDA', 'Azure Service Bus', 'Snowflake', '.NET Core']
    },
    {
      title: 'Principal Engineer',
      company: 'Syneos Health · Salem, India',
      period: 'Jul 2024 - Nov 2025',
      color: '#EC4899',
      summary: 'Led 8–10 engineers across three concurrent healthcare-analytics platforms with zero production incidents and 99.9%+ uptime.',
      details: [
        'Led 8–10 engineers across three concurrent platforms with zero production incidents and 99.9%+ uptime',
        'Pioneered LLM integration for medical-code lookup and ICD-10 validation',
        'Built the GPU-server ROI case for an agentic AI code-generation pipeline',
        'Established reusable .NET Core patterns, CI/CD, and compliance frameworks (GxP, HIPAA, SOX), cutting future build time 30–40%',
      ],
      tech: ['LLM Integration', 'Agentic AI', '.NET Core', 'CI/CD', 'GxP / HIPAA / SOX']
    },
    {
      title: 'Senior Software Engineer → Senior Full-Stack Developer',
      company: 'Syneos Health · Salem, India',
      period: 'Aug 2022 - Jun 2024',
      color: '#3B82F6',
      summary: 'Native desktop tooling, reporting automation, and advanced Excel integrations.',
      details: [
        'Built a native KDB IDE desktop app (spreadsheet, SSH views, autocomplete)',
        'Built a Diversity Equity Index reporting tool with automated PowerPoint generation',
        'Created Excel add-ins (Excel-DNA) for advanced API integrations and complex business logic',
      ],
      tech: ['KDB+', 'Excel-DNA', '.NET Core', 'WPF', 'WinForms']
    },
    {
      title: 'Project Development Engineer',
      company: 'Open Systems International · Bengaluru, India',
      period: 'Mar 2021 - Jul 2022',
      color: '#F97316',
      summary: 'Enterprise web applications with secure auth and an F# → C# migration.',
      details: [
        'Developed enterprise ASP.NET / C# / ADO.NET web applications with secure auth and SQL stored procedures',
        'Led an F# → C# migration with comprehensive unit testing',
      ],
      tech: ['ASP.NET', 'C#', 'ADO.NET', 'SQL', 'F#']
    },
    {
      title: 'Embedded Design Engineer',
      company: 'SUGUS (Clients: Bosch, TVS) · Salem, India',
      period: 'Jul 2018 - Mar 2021',
      color: '#EC4899',
      summary: 'IoT, instrumentation, and HMI automation for industrial clients.',
      details: [
        'Built a TDS meter for Bosch and a counter meter for TVS',
        'Developed an offline GPS recorder with advanced tracking',
        'Built complete Python-based HMI automation for RO plants',
      ],
      tech: ['Embedded C', 'Python', 'IoT', 'HMI', 'GPS']
    },
  ]

  return (
    <section id="experience" className="py-20 md:py-28 px-4 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-blue/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-orange/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <AnimatedSection className="text-center mb-12">
          <span className="text-orange text-sm font-mono mb-3 block">// EXPERIENCE</span>
          <h2 className="text-3xl md:text-5xl font-black">
            <span className="text-white">Career </span>
            <span style={{ background: 'linear-gradient(135deg, #3B82F6, #F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Journey</span>
          </h2>
          <p className="text-white/40 mt-3">Click each role to see detailed achievements</p>
        </AnimatedSection>

        <div className="space-y-4">
          {experiences.map((exp, i) => (
            <AnimatedSection key={i}>
              <ExpandableCard title={exp.title} subtitle={exp.company} period={exp.period} color={exp.color} defaultOpen={i === 0 || i === 1}>
                <p className="text-white/60 mb-4 italic">{exp.summary}</p>
                <ul className="space-y-2 mb-4">
                  {exp.details.map((detail, j) => (
                    <li key={j} className="flex items-start gap-2 text-white/70 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: exp.color }} />
                      {detail}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {exp.tech.map((t, j) => (
                    <span key={j} className="px-2 py-1 bg-white/5 rounded text-xs text-white/60">{t}</span>
                  ))}
                </div>
              </ExpandableCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ AI INNOVATION SECTION ============
const AIInnovationSection = () => {
  const highlights = [
    {
      title: 'Multi-Model Production Pipelines',
      desc: 'Gemini 2.0 Flash, Azure OpenAI GPT-4o, and Claude routed to classification, medical-terminology, and code-generation workloads respectively.',
      icon: '🧠',
      color: '#3B82F6',
      tags: ['Claude', 'Gemini 2.0 Flash', 'GPT-4o', 'Routing'],
    },
    {
      title: 'Prompt Engineering at Scale',
      desc: 'Structured JSON outputs with confidence scoring, evidence extraction, and hallucination prevention — validated across 2M+ documents in production.',
      icon: '🎯',
      color: '#F97316',
      tags: ['Structured Output', 'Confidence Scoring', 'Hallucination Controls'],
    },
    {
      title: 'Adaptive Concurrency Throttling',
      desc: 'Auto-scaling controller that backs off on 429 rate limits (75% steps) and recovers gradually, enabling stable high-throughput LLM processing across distributed workers.',
      icon: '⚙️',
      color: '#EC4899',
      tags: ['Rate-Limit Backoff', 'Distributed Workers', '174K files/hr'],
    },
    {
      title: 'AI-Augmented Development',
      desc: 'Claude Code for scaffolding, Cortex for debugging, hand-authored architecture for security-sensitive code — cited by leadership as an organizational model.',
      icon: '🤖',
      color: '#3B82F6',
      tags: ['Claude Code', 'Snowflake Cortex', 'Security-First'],
    },
  ]

  const stack = [
    { name: 'Claude', note: 'API & Claude for Work', color: '#F97316' },
    { name: 'Google Gemini', note: 'Embeddings & 2.0 Flash', color: '#3B82F6' },
    { name: 'Azure OpenAI', note: 'GPT-4o', color: '#EC4899' },
    { name: 'RAG', note: 'Snowflake retrieval', color: '#3B82F6' },
    { name: 'Multi-Agent', note: 'Agentic pipelines', color: '#F97316' },
    { name: 'Evals', note: '2M+ docs validated', color: '#EC4899' },
  ]

  return (
    <section id="ai" className="py-20 md:py-28 px-4 relative">
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: 'linear-gradient(rgba(59,130,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.4) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-pink/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatedSection className="text-center mb-12">
          <span className="text-blue text-sm font-mono mb-3 block">// AI INNOVATION HIGHLIGHTS</span>
          <h2 className="text-3xl md:text-5xl font-black">
            <span className="text-white">Production </span>
            <span style={{ background: 'linear-gradient(135deg, #3B82F6, #F97316, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>LLM Systems</span>
          </h2>
          <p className="text-white/40 mt-3">Real systems, real scale — across the modern LLM stack</p>
        </AnimatedSection>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {stack.map((s) => (
            <div key={s.name} className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-center transition-all"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -4, borderColor: s.color + '50', duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, borderColor: 'rgba(255,255,255,0.1)', duration: 0.3 })}
            >
              <div className="font-bold" style={{ color: s.color }}>{s.name}</div>
              <div className="text-white/40 text-xs mt-0.5">{s.note}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {highlights.map((h, i) => (
            <AnimatedSection key={i}>
              <div className="group h-full p-6 bg-white/5 border border-white/10 rounded-2xl transition-all"
                onMouseEnter={(e) => gsap.to(e.currentTarget, { borderColor: h.color + '50', y: -5, duration: 0.3 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { borderColor: 'rgba(255,255,255,0.1)', y: 0, duration: 0.3 })}
              >
                <div className="flex items-start gap-4 mb-3">
                  <span className="text-3xl flex-shrink-0">{h.icon}</span>
                  <h3 className="text-lg md:text-xl font-bold text-white pt-1">{h.title}</h3>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{h.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {h.tags.map((t) => (
                    <span key={t} className="px-2.5 py-1 text-xs rounded-full bg-white/5 border border-white/10" style={{ color: h.color }}>{t}</span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ SKILLS SECTION ============
const SkillsSection = () => {
  const skillCategories = [
    {
      name: 'AI & ML',
      color: '#3B82F6',
      skills: [
        { name: 'Claude (API & for Work)', level: 92 },
        { name: 'RAG & Multi-Agent Architecture', level: 90 },
        { name: 'Prompt Engineering', level: 92 },
        { name: 'Evaluation Frameworks & Evals', level: 88 },
        { name: 'Embeddings & Vector Search', level: 85 },
      ]
    },
    {
      name: 'Cloud & Infra',
      color: '#F97316',
      skills: [
        { name: 'Azure (AKS, Service Bus, Key Vault)', level: 90 },
        { name: 'Kubernetes & KEDA', level: 88 },
        { name: 'Docker', level: 85 },
        { name: 'CI/CD (GitHub Actions, Azure DevOps)', level: 85 },
        { name: 'Event-Driven & Distributed Systems', level: 88 },
      ]
    },
    {
      name: 'Languages & Data',
      color: '#EC4899',
      skills: [
        { name: 'Python', level: 88 },
        { name: 'C# / .NET Core', level: 95 },
        { name: 'TypeScript / JavaScript', level: 85 },
        { name: 'Snowflake (Cortex, embeddings)', level: 88 },
        { name: 'SQL / Database Design', level: 90 },
      ]
    },
  ]

  const toolsAndPatterns = [
    'Claude', 'Google Gemini', 'Azure OpenAI (GPT-4o)', 'OCR', 'NLP', 'Vector Search',
    'React / Next.js', 'Svelte', 'Node.js', 'Entity Framework', 'REST APIs', 'Microservices',
    'Auth0 RBAC', 'Azure Key Vault', 'GxP / HIPAA / SOX', 'PostgreSQL', 'KDB+', 'F#', 'Data Classification'
  ]

  return (
    <section id="skills" className="py-20 md:py-28 px-4 relative">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(rgba(59,130,246,0.4) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatedSection className="text-center mb-12">
          <span className="text-pink text-sm font-mono mb-3 block">// SKILLS</span>
          <h2 className="text-3xl md:text-5xl font-black">
            <span className="text-white">Technical </span>
            <span style={{ background: 'linear-gradient(135deg, #3B82F6, #F97316, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Arsenal</span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {skillCategories.map((category, i) => (
            <AnimatedSection key={category.name}>
              <div className="p-5 bg-white/5 border border-white/10 rounded-xl h-full">
                <h3 className="text-lg font-bold mb-4" style={{ color: category.color }}>{category.name}</h3>
                {category.skills.map((skill, j) => (
                  <SkillBar key={skill.name} name={skill.name} level={skill.level} color={category.color} delay={j * 0.1} />
                ))}
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection>
          <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
            <h3 className="text-lg font-bold text-white mb-4 text-center">Tools, Patterns & Technologies</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {toolsAndPatterns.map((tool, i) => (
                <span
                  key={tool}
                  className="tool-tag px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-white/70 cursor-default transition-all hover:scale-105"
                  style={{ '--hover-color': i % 3 === 0 ? '#3B82F640' : i % 3 === 1 ? '#F9731640' : '#EC489940' }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

// ============ ACHIEVEMENTS SECTION ============
const AchievementsSection = () => {
  const achievements = [
    { value: 2, suffix: 'M+', label: 'Documents in Production', desc: 'Evals validated at scale', color: '#3B82F6' },
    { value: 174, suffix: 'K/hr', label: 'Peak Throughput', desc: 'Files classified by LLM', color: '#F97316' },
    { value: 1600, suffix: '%', label: 'User Growth', desc: 'Precision Targeting Phase 1', color: '#EC4899' },
    { value: 3001, suffix: '%', label: 'Login Engagement', desc: 'Activity increase', color: '#3B82F6' },
    { value: 30, suffix: ' days', label: 'Platform Migration', desc: 'Node.js → .NET Core, zero downtime', color: '#F97316' },
    { value: 20, suffix: '', label: 'Engineers Led', desc: 'Scaled from 10, zero attrition', color: '#EC4899' },
  ]

  const highlights = [
    { title: 'Repeated C-Suite Visibility', desc: 'Live demonstrations to executives for high-priority initiatives; commissioned to document the AI-first delivery approach as an organizational case study.', icon: '📊' },
    { title: '“Strong Performance” — Top Tier', desc: '2025 performance review; 11 stakeholder feedbacks, all highly positive.', icon: '🏆' },
    { title: 'Scaled the Team 10 → 20', desc: 'Grew a cross-functional team with zero attrition while establishing architecture standards and mentorship.', icon: '🌱' },
    { title: 'The Testimonial', desc: '“Just give work to him and go to sleep — he will make things happen.”', icon: '💬' },
  ]

  return (
    <section id="impact" className="py-20 md:py-28 px-4 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange/5 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatedSection className="text-center mb-12">
          <span className="text-blue text-sm font-mono mb-3 block">// IMPACT &amp; RECOGNITION</span>
          <h2 className="text-3xl md:text-5xl font-black">
            <span className="text-white">Key </span>
            <span style={{ background: 'linear-gradient(135deg, #3B82F6, #F97316, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Achievements</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {achievements.map((item, i) => (
            <AnimatedSection key={i}>
              <StatCard value={item.value} suffix={item.suffix} label={item.label} color={item.color} />
            </AnimatedSection>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {highlights.map((item, i) => (
            <AnimatedSection key={i}>
              <div
                className="highlight-card p-5 bg-white/5 border border-white/10 rounded-xl transition-all"
                onMouseEnter={(e) => gsap.to(e.currentTarget, { borderColor: i % 2 === 0 ? '#3B82F640' : '#F9731640', duration: 0.3 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { borderColor: 'rgba(255,255,255,0.1)', duration: 0.3 })}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-white/60 text-sm">{item.desc}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ EDUCATION SECTION ============
const EducationSection = () => {
  const education = [
    { degree: 'Nanodegree — Machine Learning Engineer', school: 'Udacity', year: '2020', color: '#3B82F6',
      details: 'Hands-on projects applying ML to real-world problems; foundation for production AI work.' },
    { degree: 'M.S. — Control Systems', school: 'Mahendra Institutions', year: '2016-2018', color: '#F97316',
      details: 'Advanced control theory and automation systems.' },
    { degree: 'B.E. — Electrical & Electronics Engineering', school: 'Mahendra Institutions', year: '2012-2016', color: '#EC4899',
      details: 'Foundation in embedded systems and programming.' },
  ]

  return (
    <section id="education" className="py-20 md:py-28 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <span className="text-orange text-sm font-mono mb-3 block">// EDUCATION</span>
          <h2 className="text-3xl md:text-5xl font-black">
            <span className="text-white">Learning </span>
            <span style={{ background: 'linear-gradient(135deg, #3B82F6, #F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Journey</span>
          </h2>
        </AnimatedSection>

        <div className="space-y-4">
          {education.map((edu, i) => (
            <AnimatedSection key={i}>
              <div
                className="edu-card p-5 bg-white/5 border border-white/10 rounded-xl flex flex-col md:flex-row md:items-center gap-4"
                onMouseEnter={(e) => gsap.to(e.currentTarget, { borderColor: edu.color + '40', duration: 0.3 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { borderColor: 'rgba(255,255,255,0.1)', duration: 0.3 })}
              >
                <div className="w-1 md:w-1 md:h-20 h-1 rounded-full flex-shrink-0" style={{ background: edu.color }} />
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-white">{edu.degree}</h3>
                  <p className="text-white/50">{edu.school}</p>
                  <p className="text-white/60 text-sm mt-1">{edu.details}</p>
                </div>
                <span className="text-sm font-mono px-3 py-1 bg-white/5 rounded-full self-start" style={{ color: edu.color }}>{edu.year}</span>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-8">
          <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
            <h3 className="text-lg font-bold text-white mb-4">Languages</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { lang: 'English', level: 'Professional', color: '#3B82F6' },
                { lang: 'Tamil', level: 'Native', color: '#F97316' },
                { lang: 'French', level: 'Elementary', color: '#EC4899' },
              ].map((l) => (
                <div key={l.lang} className="p-3 bg-white/5 rounded-lg flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.color }} />
                  <div>
                    <div className="text-white font-medium">{l.lang}</div>
                    <div className="text-white/50 text-sm">{l.level}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

// ============ CONTACT SECTION ============
const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')
  const buttonRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    await new Promise(r => setTimeout(r, 1500))
    setStatus('sent')
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <section id="contact" className="py-20 md:py-28 px-4 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-orange/5 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <AnimatedSection className="text-center mb-12">
          <span className="text-pink text-sm font-mono mb-3 block">// CONTACT</span>
          <h2 className="text-3xl md:text-5xl font-black">
            <span className="text-white">Let&apos;s </span>
            <span style={{ background: 'linear-gradient(135deg, #3B82F6, #F97316, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Connect</span>
          </h2>
          <p className="text-white/40 mt-3">Always happy to discuss applied AI, LLM architecture, RAG &amp; multi-agent systems, or enterprise delivery</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8">
          <AnimatedSection>
            <div className="space-y-4">
              {[
                { icon: '📧', label: 'Email', value: 'suganthan94@yahoo.com', href: 'mailto:suganthan94@yahoo.com' },
                { icon: '📱', label: 'Phone', value: '+91 9080704073', href: 'tel:+919080704073' },
                { icon: '💼', label: 'LinkedIn', value: 'suganthan-arulvelan', href: 'https://www.linkedin.com/in/suganthan-arulvelan-a9356073/' },
                { icon: '🐙', label: 'GitHub', value: 'shuganth', href: 'https://github.com/shuganth' },
                { icon: '📍', label: 'Location', value: 'Salem, Tamil Nadu, India', href: '#' },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="contact-link flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-blue/50 transition-all"
                  onMouseEnter={(e) => gsap.to(e.currentTarget, { x: 5, duration: 0.3 })}
                  onMouseLeave={(e) => gsap.to(e.currentTarget, { x: 0, duration: 0.3 })}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="text-white/40 text-xs">{item.label}</div>
                    <div className="text-white">{item.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <form onSubmit={handleSubmit} className="p-5 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4">Send a Message</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Your Name" required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:border-blue focus:outline-none" />
                <input type="email" placeholder="Your Email" required value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:border-blue focus:outline-none" />
                <textarea placeholder="Your Message" required rows={4} value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:border-blue focus:outline-none resize-none" />
                <button
                  ref={buttonRef}
                  type="submit"
                  disabled={status !== 'idle'}
                  className="w-full py-3 font-bold rounded-lg disabled:opacity-50 transition-transform active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #3B82F6, #F97316)' }}
                  onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 })}
                  onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
                >
                  {status === 'sending' ? 'Sending...' : status === 'sent' ? '✓ Message Sent!' : 'Send Message'}
                </button>
              </div>
            </form>
          </AnimatedSection>
        </div>

        <AnimatedSection className="mt-16 text-center">
          <div className="text-white/20 text-sm">
            © {new Date().getFullYear()} Suganthan Arulvelan • Built with Next.js & GSAP
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

// ============ MAIN COMPONENT ============
export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const mainRef = useRef(null)

  useEffect(() => {
    // Register ScrollTo plugin
    gsap.registerPlugin(ScrollTrigger)

    // Load ScrollTo plugin dynamically
    import('gsap/ScrollToPlugin').then(({ ScrollToPlugin }) => {
      gsap.registerPlugin(ScrollToPlugin)
    })
  }, [])

  useEffect(() => {
    if (!showIntro && mainRef.current) {
      gsap.from(mainRef.current, { opacity: 0, duration: 0.5 })
    }
  }, [showIntro])

  return (
    <div className="bg-black text-white min-h-screen">
      {showIntro && <SARevealIntro onComplete={() => setShowIntro(false)} />}

      {!showIntro && (
        <div ref={mainRef}>
          <Navigation />
          <HeroSection />
          <AboutSection />
          <ExperienceSection />
          <AIInnovationSection />
          <SkillsSection />
          <AchievementsSection />
          <EducationSection />
          <ContactSection />
        </div>
      )}
    </div>
  )
}
