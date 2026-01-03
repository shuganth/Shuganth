'use client'

import { useEffect, useRef } from 'react'

// ============ MAIN COMPONENT ============
export default function Home() {
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)

  useEffect(() => {
    // Custom cursor
    const cursor = cursorRef.current
    const dot = cursorDotRef.current

    const moveCursor = (e) => {
      cursor.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`
      dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
    }

    window.addEventListener('mousemove', moveCursor)

    // Intersection Observer for reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))

    // Parallax on scroll
    const handleScroll = () => {
      const scrolled = window.scrollY
      document.querySelectorAll('.parallax').forEach((el) => {
        const speed = el.dataset.speed || 0.5
        el.style.transform = `translateY(${scrolled * speed}px)`
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Magnetic buttons
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
      })
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)'
      })
    })

    // 3D tilt cards
    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        const rotateX = (y - 0.5) * -20
        const rotateY = (x - 0.5) * 20
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
      })
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'
      })
    })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  const experiences = [
    { period: '2025 - Present', role: 'Associate Director', company: 'Syneos Health', highlight: 'Leading 20 engineers' },
    { period: '2024 - 2025', role: 'Principal Engineer', company: 'Syneos Health', highlight: '30-day migration' },
    { period: '2023 - 2024', role: 'Senior Full Stack Developer', company: 'Syneos Health', highlight: 'KDB IDE shipped' },
    { period: '2021 - 2022', role: 'Project Development Engineer', company: 'Open Systems International', highlight: 'Web services' },
  ]

  const projects = [
    { name: 'Precision Targeting', metric: '1600%', label: 'User Growth', tech: 'Svelte • .NET • Snowflake' },
    { name: 'AIP Modernization', metric: '30 Days', label: 'Full Migration', tech: '.NET Core • Multi-DB' },
    { name: 'KOL Analytics', metric: 'GPT-4o', label: 'AI Powered', tech: 'Kubernetes • KEDA • OpenAI' },
  ]

  const techStack = [
    { name: '.NET Core', level: 95 },
    { name: 'Azure / Kubernetes', level: 90 },
    { name: 'Snowflake / SQL', level: 92 },
    { name: 'Svelte / React', level: 88 },
    { name: 'Python / AI', level: 85 },
  ]

  return (
    <>
      {/* Custom Cursor */}
      <div ref={cursorRef} className="cursor-ring" />
      <div ref={cursorDotRef} className="cursor-dot" />

      <main className="bg-void text-white overflow-x-hidden">

        {/* ========== HERO SECTION ========== */}
        <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0">
            <div className="gradient-orb gradient-orb-1" />
            <div className="gradient-orb gradient-orb-2" />
            <div className="gradient-orb gradient-orb-3" />
          </div>

          {/* Grid pattern */}
          <div className="absolute inset-0 grid-pattern opacity-20" />

          {/* Floating shapes */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="floating-shape shape-1 parallax" data-speed="-0.2" />
            <div className="floating-shape shape-2 parallax" data-speed="0.3" />
            <div className="floating-shape shape-3 parallax" data-speed="-0.15" />
          </div>

          {/* Main content */}
          <div className="relative z-10 text-center px-6 max-w-6xl">
            {/* Animated SA logo */}
            <div className="mb-8 reveal">
              <div className="inline-flex items-center gap-2">
                <span className="text-8xl md:text-[12rem] font-black sa-letter animate-float-slow">S</span>
                <span className="text-8xl md:text-[12rem] font-black sa-letter-alt animate-float-slow-delayed">A</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 reveal reveal-delay-1">
              <span className="text-white">SUGANTHAN</span>
              <br />
              <span className="gradient-text-animated">ARULVELAN</span>
            </h1>

            <p className="text-xl md:text-2xl text-silver mb-2 reveal reveal-delay-2">
              Associate Director at Syneos Health
            </p>

            <p className="text-base md:text-lg text-silver/60 mb-12 max-w-2xl mx-auto reveal reveal-delay-3">
              Building Healthcare Analytics Platforms that scale to thousands of users with zero incidents
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12 reveal reveal-delay-4">
              {[
                { value: '1600%', label: 'User Growth' },
                { value: 'Zero', label: 'Incidents' },
                { value: '20+', label: 'Engineers Led' },
                { value: '99.9%', label: 'Uptime' },
              ].map((stat, i) => (
                <div key={i} className="stat-item group">
                  <div className="text-3xl md:text-5xl font-black gradient-text group-hover:scale-110 transition-transform">
                    {stat.value}
                  </div>
                  <div className="text-sm text-silver mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 reveal reveal-delay-5">
              <a href="mailto:suganthan94@yahoo.com" className="magnetic cta-primary">
                <span className="relative z-10">Get in Touch</span>
                <div className="cta-glow" />
              </a>
              <a href="https://linkedin.com/in/suganthan-arulvelan-a9356073" target="_blank" rel="noopener noreferrer" className="magnetic cta-secondary">
                LinkedIn
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="scroll-indicator">
              <div className="scroll-dot" />
            </div>
            <span className="text-xs text-silver/50 mt-2 block">Scroll</span>
          </div>
        </section>

        {/* ========== ABOUT SECTION ========== */}
        <section className="py-32 relative">
          <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-ember/5 to-transparent pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Text */}
              <div>
                <span className="tag reveal">// ABOUT</span>
                <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 reveal reveal-delay-1">
                  From <span className="gradient-text">Microcontrollers</span> to
                  <br />Enterprise Platforms
                </h2>
                <p className="text-lg text-silver leading-relaxed mb-6 reveal reveal-delay-2">
                  My journey started programming embedded systems for Bosch and TVS.
                  Today I lead teams building healthcare analytics platforms used by
                  hundreds of professionals across the globe.
                </p>
                <p className="text-silver/70 leading-relaxed reveal reveal-delay-3">
                  I care deeply about craft—clean architecture, proper abstractions,
                  systems that don&apos;t break at 2 AM. Equally passionate about helping
                  engineers grow from writing code to thinking in systems.
                </p>

                {/* Education pills */}
                <div className="flex flex-wrap gap-3 mt-8 reveal reveal-delay-4">
                  {['M.E. Control Systems', 'B.E. Electrical', 'Udacity ML Nanodegree'].map((edu, i) => (
                    <span key={i} className="edu-pill">{edu}</span>
                  ))}
                </div>
              </div>

              {/* Right: Tech Stack */}
              <div className="reveal reveal-delay-2">
                <span className="tag">// TECH STACK</span>
                <div className="mt-6 space-y-5">
                  {techStack.map((tech, i) => (
                    <div key={i} className="skill-bar-container">
                      <div className="flex justify-between mb-2">
                        <span className="text-white font-medium">{tech.name}</span>
                        <span className="text-ember">{tech.level}%</span>
                      </div>
                      <div className="skill-bar">
                        <div
                          className="skill-bar-fill"
                          style={{ '--fill-width': `${tech.level}%`, '--delay': `${i * 0.1}s` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional tech */}
                <div className="flex flex-wrap gap-2 mt-8">
                  {['KEDA', 'Service Bus', 'KDB+', 'Databricks', 'WPF', 'Auth0', 'Docker', 'Git'].map((t, i) => (
                    <span key={i} className="tech-chip">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== EXPERIENCE SECTION ========== */}
        <section className="py-32 relative bg-obsidian">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-ember/10 rounded-full blur-[150px] pointer-events-none" />

          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="tag reveal">// EXPERIENCE</span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 reveal reveal-delay-1">
                Career <span className="gradient-text">Journey</span>
              </h2>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-ember via-gold to-ember timeline-glow" />

              {experiences.map((exp, i) => (
                <div
                  key={i}
                  className={`relative flex flex-col md:flex-row gap-8 mb-12 reveal ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                  style={{ '--delay': `${i * 0.15}s` }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-ember timeline-dot" />

                  {/* Card */}
                  <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} pl-8 md:pl-0`}>
                    <div className="tilt-card exp-card">
                      <span className="text-ember font-mono text-sm">{exp.period}</span>
                      <h3 className="text-xl font-bold text-white mt-2">{exp.role}</h3>
                      <p className="text-silver">{exp.company}</p>
                      <div className="mt-3 inline-block px-3 py-1 bg-ember/20 text-ember text-sm rounded-full">
                        {exp.highlight}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== PROJECTS SECTION ========== */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-30" />

          <div className="max-w-6xl mx-auto px-6 relative">
            <div className="text-center mb-16">
              <span className="tag reveal">// IMPACT</span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 reveal reveal-delay-1">
                What I <span className="gradient-text">Delivered</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {projects.map((project, i) => (
                <div
                  key={i}
                  className="tilt-card project-card reveal"
                  style={{ '--delay': `${i * 0.1}s` }}
                >
                  <div className="project-card-inner">
                    <div className="project-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-4">{project.name}</h3>
                    <div className="text-5xl font-black gradient-text mb-1">{project.metric}</div>
                    <div className="text-silver mb-4">{project.label}</div>
                    <div className="text-xs text-ember font-mono mt-auto">{project.tech}</div>
                  </div>
                  <div className="project-card-shine" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== CONTACT SECTION ========== */}
        <section className="py-32 relative bg-obsidian overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0">
            <div className="contact-gradient-1" />
            <div className="contact-gradient-2" />
          </div>

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <span className="tag reveal">// CONNECT</span>
            <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6 reveal reveal-delay-1">
              Let&apos;s Build
              <br />
              <span className="gradient-text-animated">Together</span>
            </h2>
            <p className="text-lg text-silver mb-12 max-w-xl mx-auto reveal reveal-delay-2">
              Always happy to connect with folks working on healthcare tech,
              distributed systems, or thoughtful AI integration.
            </p>

            {/* Contact cards */}
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
              <a href="mailto:suganthan94@yahoo.com" className="tilt-card contact-card reveal reveal-delay-3">
                <div className="contact-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <path d="M22 6l-10 7L2 6"/>
                  </svg>
                </div>
                <span className="text-white font-medium">suganthan94@yahoo.com</span>
              </a>
              <a href="tel:+919080704073" className="tilt-card contact-card reveal reveal-delay-4">
                <div className="contact-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <span className="text-white font-medium">+91 9080704073</span>
              </a>
            </div>

            {/* Social links */}
            <div className="flex justify-center gap-6 reveal reveal-delay-5">
              <a href="https://linkedin.com/in/suganthan-arulvelan-a9356073" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="mailto:suganthan94@yahoo.com" className="social-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <path d="M22 6l-10 7L2 6"/>
                </svg>
              </a>
            </div>

            {/* Location */}
            <div className="mt-12 text-silver/50 text-sm reveal reveal-delay-5">
              <span>📍 Salem, Tamil Nadu, India</span>
              <span className="mx-3">•</span>
              <span>🇬🇧 English</span>
              <span className="mx-2">•</span>
              <span>🇮🇳 Tamil</span>
              <span className="mx-2">•</span>
              <span>🇫🇷 French</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 text-center text-silver/40 text-sm">
            © {new Date().getFullYear()} Suganthan Arulvelan. Crafted with precision.
          </div>
        </footer>
      </main>
    </>
  )
}
