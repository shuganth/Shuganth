'use client'

import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ============ PRELOADER ============
const Preloader = ({ onComplete }) => {
  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => setTimeout(onComplete, 100)
    })

    tl.fromTo('.pre-s',
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
    )
    .fromTo('.pre-a',
      { scale: 0, rotation: 180 },
      { scale: 1, rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' },
      '-=0.5'
    )
    .to('.preloader-content', {
      scale: 50,
      opacity: 0,
      duration: 1,
      ease: 'power4.in'
    }, '+=0.3')
    .to('.preloader', {
      opacity: 0,
      duration: 0.3
    })

    return () => tl.kill()
  }, [onComplete])

  return (
    <div className="preloader fixed inset-0 z-[200] bg-void flex items-center justify-center">
      <div className="preloader-content flex items-center">
        <span className="pre-s text-[20vw] font-black sa-letter-s">S</span>
        <span className="pre-a text-[20vw] font-black sa-letter-a">A</span>
      </div>
    </div>
  )
}

// ============ MAIN HORIZONTAL SCROLL EXPERIENCE ============
export default function Home() {
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)

  useLayoutEffect(() => {
    if (loading || typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Get all panels
      const panels = gsap.utils.toArray('.panel')
      const totalWidth = panels.length * window.innerWidth

      // Horizontal scroll on vertical scroll
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (panels.length - 1),
          end: () => `+=${totalWidth}`,
        }
      })

      // SA letters follow and transform
      const saContainer = document.querySelector('.sa-floating')
      if (saContainer) {
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress

            // SA transforms based on which panel we're on
            gsap.to('.floating-s', {
              x: progress * window.innerWidth * 0.3,
              y: Math.sin(progress * Math.PI * 2) * 100,
              scale: 1 - progress * 0.7,
              rotation: progress * 360,
              opacity: 1 - progress * 0.3,
              duration: 0.3
            })

            gsap.to('.floating-a', {
              x: progress * window.innerWidth * 0.3 + 50,
              y: Math.cos(progress * Math.PI * 2) * 100,
              scale: 1 - progress * 0.7,
              rotation: -progress * 360,
              opacity: 1 - progress * 0.3,
              duration: 0.3
            })
          }
        })
      }

      // Animate elements within each panel as they come into view
      panels.forEach((panel, i) => {
        const content = panel.querySelector('.panel-content')
        if (content) {
          gsap.fromTo(content,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              scrollTrigger: {
                trigger: panel,
                containerAnimation: gsap.getById?.('horizontal') || undefined,
                start: 'left center',
                toggleActions: 'play none none reverse',
                horizontal: true
              }
            }
          )
        }
      })

    }, containerRef)

    return () => ctx.revert()
  }, [loading])

  return (
    <main ref={containerRef} className="bg-void text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          <div className="grain" />

          {/* Fixed floating SA that transforms on scroll */}
          <div className="sa-floating fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none flex">
            <span className="floating-s text-[15vw] md:text-[10vw] font-black sa-letter-s opacity-20">S</span>
            <span className="floating-a text-[15vw] md:text-[10vw] font-black sa-letter-a opacity-20">A</span>
          </div>

          {/* Navigation */}
          <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="text-2xl font-black gradient-text">SA</div>
              <div className="hidden md:flex items-center gap-6 text-sm text-silver">
                <span>Scroll to explore</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-white/20" />
                  ))}
                </div>
              </div>
              <a href="mailto:suganthan94@yahoo.com" className="px-4 py-2 rounded-full gradient-ember text-void font-semibold text-sm">
                Connect
              </a>
            </div>
          </nav>

          {/* Horizontal scrolling wrapper */}
          <div ref={wrapperRef} className="h-screen">
            <div className="flex h-screen">

              {/* Panel 1: Hero */}
              <section className="panel w-screen h-screen flex-shrink-0 flex items-center justify-center relative">
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-ember/20 rounded-full blur-[200px]" />
                  <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/20 rounded-full blur-[150px]" />
                </div>

                <div className="panel-content text-center px-6 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h1 className="text-5xl md:text-8xl font-black mb-4">
                      <span className="text-white">SUGANTHAN</span>
                    </h1>
                    <h2 className="text-4xl md:text-7xl font-black gradient-text mb-8">
                      ARULVELAN
                    </h2>
                    <p className="text-xl md:text-2xl text-silver max-w-xl mx-auto">
                      Associate Director • Software Architect
                    </p>
                  </motion.div>

                  {/* Stats */}
                  <motion.div
                    className="flex justify-center gap-8 md:gap-16 mt-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    {[
                      { value: '7+', label: 'Years' },
                      { value: '0', label: 'Incidents' },
                      { value: '99.9%', label: 'Uptime' },
                      { value: '20+', label: 'Engineers' },
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className="text-3xl md:text-5xl font-black gradient-text">{stat.value}</div>
                        <div className="text-silver text-sm mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Scroll hint */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-silver text-sm">
                  <span>Scroll</span>
                  <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </section>

              {/* Panel 2: About */}
              <section className="panel w-screen h-screen flex-shrink-0 flex items-center justify-center relative bg-obsidian">
                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-ember/10 to-transparent" />

                <div className="panel-content max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <span className="text-ember font-mono text-sm tracking-widest">// ABOUT</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white mt-4 mb-6">
                      Building the<br/><span className="gradient-text">Future</span>
                    </h2>
                    <p className="text-silver text-lg leading-relaxed">
                      7+ years crafting enterprise systems with zero production incidents.
                      From embedded IoT to cloud architecture, from Bosch to healthcare AI.
                    </p>
                  </div>

                  <div className="code-window">
                    <div className="code-header">
                      <div className="code-dot red" />
                      <div className="code-dot yellow" />
                      <div className="code-dot green" />
                      <span className="ml-3 text-silver text-xs font-mono">suganthan.ts</span>
                    </div>
                    <div className="code-content text-sm">
                      <div><span className="syntax-keyword">const</span> <span className="syntax-property">suganthan</span> = {'{'}</div>
                      <div className="ml-4"><span className="syntax-property">role</span>: <span className="syntax-string">&quot;Associate Director&quot;</span>,</div>
                      <div className="ml-4"><span className="syntax-property">company</span>: <span className="syntax-string">&quot;Syneos Health&quot;</span>,</div>
                      <div className="ml-4"><span className="syntax-property">team</span>: <span className="syntax-number">20</span>, <span className="syntax-comment">// engineers</span></div>
                      <div className="ml-4"><span className="syntax-property">uptime</span>: <span className="syntax-string">&quot;99.99%&quot;</span>,</div>
                      <div className="ml-4"><span className="syntax-property">incidents</span>: <span className="syntax-number">0</span></div>
                      <div>{'}'}</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Panel 3: Experience */}
              <section className="panel w-screen h-screen flex-shrink-0 flex items-center justify-center relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-2/3 bg-gradient-to-b from-transparent via-ember to-transparent" />

                <div className="panel-content max-w-5xl mx-auto px-6">
                  <div className="text-center mb-12">
                    <span className="text-gold font-mono text-sm tracking-widest">// EXPERIENCE</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white mt-4">
                      Career <span className="gradient-text">Journey</span>
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { period: '2025-Now', role: 'Associate Director', company: 'Syneos Health', highlight: '20 engineers' },
                      { period: '2024-2025', role: 'Principal Engineer', company: 'Syneos Health', highlight: '30-day migration' },
                      { period: '2023-2024', role: 'Senior Full Stack', company: 'Syneos Health', highlight: 'KDB IDE' },
                      { period: '2018-2021', role: 'Embedded Engineer', company: 'SUGUS', highlight: 'Bosch, TVS' },
                    ].map((exp, i) => (
                      <div key={i} className="glass rounded-2xl p-6 card-hover">
                        <div className="text-ember font-mono text-sm">{exp.period}</div>
                        <h3 className="text-xl font-bold text-white mt-2">{exp.role}</h3>
                        <p className="text-silver">{exp.company}</p>
                        <div className="mt-3 text-sm text-gold">{exp.highlight}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Panel 4: Skills */}
              <section className="panel w-screen h-screen flex-shrink-0 flex items-center justify-center relative bg-obsidian">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(rgba(255,77,0,0.5) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }} />
                </div>

                <div className="panel-content max-w-6xl mx-auto px-6">
                  <div className="text-center mb-12">
                    <span className="text-cyan font-mono text-sm tracking-widest">// SKILLS</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white mt-4">
                      Tech <span className="gradient-text">Arsenal</span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { name: 'Backend', skills: '.NET, Python, Node.js', color: 'ember' },
                      { name: 'Cloud', skills: 'Azure, Kubernetes, KEDA', color: 'gold' },
                      { name: 'Data', skills: 'Snowflake, KDB+, Databricks', color: 'cyan' },
                      { name: 'Frontend', skills: 'Svelte, React, WPF', color: 'ember' },
                      { name: 'AI/ML', skills: 'OpenAI, GPT-4o, LangChain', color: 'gold' },
                      { name: 'DevOps', skills: 'Azure DevOps, Docker, CI/CD', color: 'cyan' },
                    ].map((skill, i) => (
                      <div key={i} className="glass rounded-xl p-5 text-center card-hover">
                        <h3 className={`text-${skill.color} font-bold mb-2`}>{skill.name}</h3>
                        <p className="text-silver text-sm">{skill.skills}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Panel 5: Contact */}
              <section className="panel w-screen h-screen flex-shrink-0 flex items-center justify-center relative">
                <div className="absolute inset-0">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-ember/20 rounded-full blur-[250px]" />
                </div>

                <div className="panel-content max-w-4xl mx-auto px-6 text-center">
                  <span className="text-ember font-mono text-sm tracking-widest">// CONNECT</span>
                  <h2 className="text-4xl md:text-7xl font-black text-white mt-4 mb-8">
                    Let&apos;s Build<br/><span className="gradient-text">Together</span>
                  </h2>

                  <div className="code-window max-w-lg mx-auto mb-8">
                    <div className="code-header">
                      <div className="code-dot red" />
                      <div className="code-dot yellow" />
                      <div className="code-dot green" />
                      <span className="ml-3 text-silver text-xs font-mono">contact.sql</span>
                    </div>
                    <div className="code-content text-sm text-left">
                      <div><span className="syntax-keyword">SELECT</span> * <span className="syntax-keyword">FROM</span> <span className="syntax-type">Suganthan</span></div>
                      <div><span className="syntax-keyword">WHERE</span> <span className="syntax-property">Status</span> = <span className="syntax-string">&apos;Open&apos;</span></div>
                      <div className="mt-3"><span className="syntax-keyword">INSERT INTO</span> <span className="syntax-type">Contact</span></div>
                      <a href="mailto:suganthan94@yahoo.com" className="block ml-4 hover:text-ember transition-colors">
                        (<span className="syntax-string">&apos;suganthan94@yahoo.com&apos;</span>)
                      </a>
                    </div>
                  </div>

                  <div className="flex justify-center gap-6">
                    <a href="mailto:suganthan94@yahoo.com" className="px-8 py-4 rounded-full gradient-ember text-void font-bold hover:scale-105 transition-transform">
                      Email Me
                    </a>
                    <a href="https://linkedin.com/in/suganthan-arulvelan-a9356073" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">
                      LinkedIn
                    </a>
                  </div>

                  <div className="mt-16 text-silver text-sm">
                    © {new Date().getFullYear()} Suganthan Arulvelan
                  </div>
                </div>
              </section>

            </div>
          </div>

          {/* Progress indicator */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="flex gap-2">
              {['Hero', 'About', 'Experience', 'Skills', 'Contact'].map((label, i) => (
                <div key={i} className="group relative">
                  <div className="w-3 h-3 rounded-full bg-white/20 group-hover:bg-ember transition-colors cursor-pointer" />
                  <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-silver opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  )
}
