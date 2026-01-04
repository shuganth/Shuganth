'use client'

import { useEffect, useState, useRef } from 'react'

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState(0)
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(progress)

      // Determine active section
      const sections = document.querySelectorAll('section')
      sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          setActiveSection(i)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={containerRef} className="bg-black text-white overflow-x-hidden">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-white/10 z-[100]">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-amber-400"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Fixed SA Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <div
          className="text-[50vw] font-black text-white/[0.02] select-none leading-none tracking-tighter"
          style={{
            transform: `translateY(${scrollProgress * 0.5}px) scale(${1 + scrollProgress * 0.001})`,
          }}
        >
          SA
        </div>
      </div>

      {/* Side Navigation Dots */}
      <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
        {['Intro', 'About', 'Work', 'Stack', 'Contact'].map((label, i) => (
          <button
            key={i}
            onClick={() => document.querySelectorAll('section')[i]?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center gap-3"
          >
            <span className={`text-xs font-medium transition-all duration-300 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 ${activeSection === i ? 'text-orange-500' : 'text-gray-500'}`}>
              {label}
            </span>
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSection === i ? 'bg-orange-500 scale-125' : 'bg-white/20 group-hover:bg-white/40'}`} />
          </button>
        ))}
      </nav>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SECTION 1: HERO - Full Impact */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 relative">
        <div className="max-w-7xl mx-auto w-full">
          {/* Overline */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-px bg-orange-500" />
            <span className="text-orange-500 text-sm font-medium tracking-wider uppercase">Associate Director</span>
          </div>

          {/* Main Title - Dramatic */}
          <h1 className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-black leading-[0.85] tracking-tight mb-8">
            <span className="block">Suganthan</span>
            <span className="block bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Arulvelan
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-400 max-w-3xl leading-relaxed mb-12">
            I build <span className="text-white">healthcare platforms</span> that scale to
            thousands with <span className="text-orange-500">zero incidents</span>.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-12 md:gap-20">
            {[
              { num: '1,600%', label: 'User Growth' },
              { num: '20+', label: 'Engineers Led' },
              { num: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className="text-4xl md:text-5xl font-black text-white group-hover:text-orange-500 transition-colors">
                  {stat.num}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs text-gray-600 uppercase tracking-widest">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-orange-500 to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SECTION 2: ABOUT - Split Screen */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex items-center relative">
        <div className="grid lg:grid-cols-2 w-full">
          {/* Left - Dark */}
          <div className="bg-black p-12 md:p-20 lg:p-24 flex flex-col justify-center">
            <span className="text-orange-500 text-sm font-medium tracking-wider uppercase mb-6">The Journey</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-8">
              From micro-<br/>controllers to<br/>
              <span className="text-orange-500">enterprise scale</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Started programming embedded systems for Bosch and TVS. Today I architect
              platforms processing millions of healthcare data points daily.
            </p>
            <div className="flex gap-4">
              <a href="mailto:suganthan94@yahoo.com" className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-orange-500 hover:text-white transition-all">
                Get in Touch
              </a>
              <a href="https://linkedin.com/in/suganthan-arulvelan-a9356073" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-white/20 font-semibold rounded-lg hover:border-orange-500 hover:text-orange-500 transition-all">
                LinkedIn
              </a>
            </div>
          </div>

          {/* Right - Bento Grid */}
          <div className="bg-zinc-950 p-8 md:p-12 grid grid-cols-2 gap-4">
            {[
              { title: 'Syneos Health', role: 'Associate Director', year: '2025', color: 'orange' },
              { title: 'Principal Engineer', role: '30-day migration', year: '2024', color: 'amber' },
              { title: 'M.E. Control Systems', role: 'Mahendra College', year: 'Education', color: 'zinc' },
              { title: 'ML Nanodegree', role: 'Udacity', year: 'Certified', color: 'zinc' },
            ].map((item, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] cursor-default ${
                  item.color === 'orange' ? 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500' :
                  item.color === 'amber' ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500' :
                  'bg-white/5 border-white/10 hover:border-white/30'
                }`}
              >
                <span className="text-xs text-gray-500 uppercase tracking-wider">{item.year}</span>
                <h3 className="text-lg font-bold text-white mt-2">{item.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{item.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SECTION 3: WORK - Large Cards */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-12 lg:px-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <span className="text-orange-500 text-sm font-medium tracking-wider uppercase">Featured Work</span>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mt-4">
                Impact<span className="text-orange-500">.</span>
              </h2>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-6xl font-black text-white/10">03</div>
              <div className="text-sm text-gray-500">Projects</div>
            </div>
          </div>

          <div className="space-y-8">
            {[
              {
                num: '01',
                title: 'Precision Targeting',
                desc: 'Enterprise analytics platform. First to meet company-wide standards.',
                metric: '1,600% growth',
                tech: 'Svelte • .NET Core • Snowflake',
              },
              {
                num: '02',
                title: 'AIP Modernization',
                desc: 'Complete backend rewrite. Zero downtime. Multi-database unlocked.',
                metric: '30-day migration',
                tech: '.NET Core • KDB+ • Databricks',
              },
              {
                num: '03',
                title: 'KOL Analytics',
                desc: 'Distributed processing with KEDA. GPT-4o powered insights.',
                metric: 'AI-powered',
                tech: 'Kubernetes • Azure • OpenAI',
              },
            ].map((project, i) => (
              <div
                key={i}
                className="group relative p-8 md:p-12 rounded-3xl bg-black border border-white/10 hover:border-orange-500/50 transition-all duration-500 overflow-hidden"
              >
                {/* Background Number */}
                <div className="absolute -right-8 -top-8 text-[15rem] font-black text-white/[0.02] select-none leading-none group-hover:text-orange-500/[0.05] transition-colors duration-500">
                  {project.num}
                </div>

                <div className="relative flex flex-col md:flex-row md:items-center gap-8">
                  <div className="flex-1">
                    <span className="text-orange-500 font-mono text-sm">{project.num}</span>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mt-2 group-hover:text-orange-500 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 mt-3 text-lg">{project.desc}</p>
                    <p className="text-gray-600 mt-4 text-sm font-mono">{project.tech}</p>
                  </div>
                  <div className="md:text-right">
                    <div className="text-3xl md:text-4xl font-black text-orange-500">{project.metric}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SECTION 4: TECH STACK - Marquee Style */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-16">
          <span className="text-orange-500 text-sm font-medium tracking-wider uppercase">Arsenal</span>
          <h2 className="text-5xl md:text-6xl font-black mt-4">
            Tech Stack<span className="text-orange-500">.</span>
          </h2>
        </div>

        {/* Scrolling Tech */}
        <div className="relative">
          <div className="flex gap-4 animate-marquee whitespace-nowrap py-4">
            {['.NET Core', 'Azure', 'Kubernetes', 'Snowflake', 'Svelte', 'React', 'Python', 'OpenAI', 'Docker', 'Auth0', 'KDB+', 'Databricks', 'KEDA', 'Service Bus'].map((tech, i) => (
              <span
                key={i}
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-lg font-medium hover:bg-orange-500 hover:border-orange-500 hover:text-black transition-all cursor-default"
              >
                {tech}
              </span>
            ))}
            {/* Duplicate for seamless loop */}
            {['.NET Core', 'Azure', 'Kubernetes', 'Snowflake', 'Svelte', 'React', 'Python', 'OpenAI', 'Docker', 'Auth0', 'KDB+', 'Databricks', 'KEDA', 'Service Bus'].map((tech, i) => (
              <span
                key={`dup-${i}`}
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-lg font-medium hover:bg-orange-500 hover:border-orange-500 hover:text-black transition-all cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mt-16 grid md:grid-cols-3 gap-8">
          {[
            { title: 'Cloud & DevOps', items: ['Azure Kubernetes', 'Docker', 'KEDA', 'Service Bus', 'CI/CD'] },
            { title: 'Backend & Data', items: ['.NET Core', 'Python', 'Snowflake', 'KDB+', 'SQL Server'] },
            { title: 'Frontend & AI', items: ['Svelte', 'React', 'OpenAI GPT-4', 'Auth0', 'TypeScript'] },
          ].map((group, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">{group.title}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item, j) => (
                  <span key={j} className="px-3 py-1 bg-black rounded-full text-sm text-gray-400 border border-white/10">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SECTION 5: CONTACT - Big & Bold */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 bg-zinc-950 relative">
        <div className="text-center max-w-4xl">
          <span className="text-orange-500 text-sm font-medium tracking-wider uppercase">Let's Talk</span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mt-6 mb-8">
            Build something<br/>
            <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">together</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto">
            Healthcare tech, distributed systems, or enterprise architecture—I'm always up for a conversation.
          </p>

          <a
            href="mailto:suganthan94@yahoo.com"
            className="group inline-flex items-center gap-4 text-2xl md:text-3xl font-bold text-white hover:text-orange-500 transition-colors"
          >
            suganthan94@yahoo.com
            <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>

          <div className="flex justify-center gap-8 mt-16 text-gray-500">
            <a href="https://linkedin.com/in/suganthan-arulvelan-a9356073" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
              LinkedIn
            </a>
            <span>•</span>
            <span>Salem, India</span>
            <span>•</span>
            <span>+91 9080704073</span>
          </div>
        </div>

        {/* Corner SA */}
        <div className="absolute bottom-8 right-8 text-8xl font-black text-white/5">
          SA
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-white/5 flex justify-between items-center text-sm text-gray-600">
        <span>© {new Date().getFullYear()} Suganthan Arulvelan</span>
        <span>English • Tamil • French</span>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
