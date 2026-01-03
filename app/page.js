'use client'

import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [activeNav, setActiveNav] = useState('home')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      const sections = ['home', 'about', 'experience', 'work', 'contact']
      const scrollPos = window.scrollY + 200

      for (const id of sections) {
        const el = document.getElementById(id)
        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActiveNav(id)
          break
        }
      }
    }

    const handleMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouse, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const experience = [
    {
      period: 'Nov 2025 — Present',
      title: 'Associate Director',
      company: 'Syneos Health',
      description: 'Leading a cross-functional team of 20 engineers across UI, middleware, data engineering, and QA. Spearheading development of Precision Targeting, KOL Analytics, and AIP platforms.',
      highlights: ['1,600% user growth', '3,001% engagement increase', 'Zero production incidents'],
    },
    {
      period: 'Jul 2024 — Nov 2025',
      title: 'Principal Engineer',
      company: 'Syneos Health',
      description: 'Led 8-10 engineers delivering three major platforms. Executed 30-day Node.js to .NET Core migration with zero downtime. Integrated GPT-4o for intelligent data processing.',
      highlights: ['30-day platform migration', '99.9% uptime', 'AI integration'],
    },
    {
      period: 'Jun 2023 — Jun 2024',
      title: 'Senior Full Stack Developer',
      company: 'Syneos Health',
      description: 'Built KDB IDE with spreadsheet functionality, SSH views, and autocomplete. Developed DEI reporting dashboards with Plotly visualizations.',
      highlights: ['KDB IDE from scratch', 'Excel-DNA add-ins', 'SSO implementation'],
    },
    {
      period: 'Mar 2021 — Jul 2022',
      title: 'Project Development Engineer',
      company: 'Open Systems International',
      description: 'Designed ASP.NET Web Forms applications and optimized SQL stored procedures. Implemented secure web services for power grid management systems.',
      highlights: ['Enterprise web services', 'SQL optimization', 'F# to C# migration'],
    },
  ]

  const projects = [
    {
      title: 'Precision Targeting Platform',
      description: 'Enterprise analytics platform serving 150+ users across Commercial Strategic Operations. First platform to meet enterprise standards at Syneos Health.',
      metrics: '1,600% user growth',
      tech: ['Svelte', '.NET Core', 'Snowflake', 'Auth0', 'Azure'],
    },
    {
      title: 'AIP Modernization',
      description: 'Complete backend rewrite from Node.js to .NET Core in 30 days. Unlocked multi-database support including Snowflake, KDB+, and Databricks.',
      metrics: '30-day migration',
      tech: ['.NET Core', 'Snowflake', 'KDB+', 'Databricks'],
    },
    {
      title: 'KOL Analytics Engine',
      description: 'Distributed processing system for 1-4 hour analytical queries. KEDA autoscaling with Azure Service Bus. GPT-4o powered insights.',
      metrics: 'AI-powered analytics',
      tech: ['Kubernetes', 'KEDA', 'Azure Service Bus', 'OpenAI'],
    },
  ]

  const skills = [
    { category: 'Cloud & Infrastructure', items: ['Azure', 'Kubernetes', 'Docker', 'KEDA', 'Service Bus'] },
    { category: 'Backend', items: ['.NET Core', 'C#', 'Python', 'Node.js', 'SQL Server'] },
    { category: 'Frontend', items: ['Svelte', 'React', 'WPF', 'TypeScript'] },
    { category: 'Data', items: ['Snowflake', 'KDB+', 'Databricks', 'Plotly'] },
    { category: 'AI & Auth', items: ['OpenAI GPT-4', 'Auth0', 'SSO'] },
  ]

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, #ff4d00 0%, transparent 70%)',
            left: mounted ? mousePos.x - 400 : '50%',
            top: mounted ? mousePos.y - 400 : '50%',
            transition: 'left 0.3s ease-out, top 0.3s ease-out',
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo('home') }} className="text-xl font-bold tracking-tight">
            <span className="text-[#ff4d00]">S</span>
            <span className="text-[#ffd700]">A</span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'experience', label: 'Experience' },
              { id: 'work', label: 'Work' },
              { id: 'contact', label: 'Contact' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeNav === item.id
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <a
            href="mailto:suganthan94@yahoo.com"
            className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-[#ff4d00] to-[#ff6b00] text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200"
          >
            Get in Touch
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-6 lg:px-12 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-[#ff4d00] bg-[#ff4d00]/10 rounded-full border border-[#ff4d00]/20">
              Associate Director @ Syneos Health
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className="text-white">Suganthan</span>
            <br />
            <span className="bg-gradient-to-r from-[#ff4d00] via-[#ff6b00] to-[#ffd700] bg-clip-text text-transparent">
              Arulvelan
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            I build healthcare analytics platforms that scale. Leading engineering teams to deliver
            enterprise solutions with <span className="text-white">1,600% user growth</span> and
            <span className="text-white"> zero production incidents</span>.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#work"
              onClick={(e) => { e.preventDefault(); scrollTo('work') }}
              className="px-8 py-3.5 text-sm font-semibold bg-white text-black rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              View My Work
            </a>
            <a
              href="https://linkedin.com/in/suganthan-arulvelan-a9356073"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 text-sm font-semibold text-white border border-white/20 rounded-lg hover:bg-white/5 hover:border-white/40 transition-all duration-200"
            >
              LinkedIn
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-10 border-t border-white/10">
            {[
              { value: '20+', label: 'Engineers Led' },
              { value: '1,600%', label: 'User Growth' },
              { value: 'Zero', label: 'Incidents' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-sm font-semibold text-[#ff4d00] tracking-wider uppercase mb-4 block">About</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                From embedded systems to enterprise platforms
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  My journey started programming microcontrollers for Bosch and TVS. Today, I lead teams
                  building healthcare analytics platforms used by hundreds of professionals globally.
                </p>
                <p>
                  I care deeply about craft—clean architecture, proper abstractions, and systems that
                  don't break at 2 AM. Equally passionate about helping engineers grow from writing
                  code to thinking in systems.
                </p>
              </div>

              <div className="mt-10 pt-10 border-t border-white/10">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Education</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-white font-medium">M.E. Control Systems</div>
                    <div className="text-sm text-gray-500">Mahendra Engineering College</div>
                  </div>
                  <div>
                    <div className="text-white font-medium">B.E. Electrical & Electronics</div>
                    <div className="text-sm text-gray-500">Mahendra Engineering College</div>
                  </div>
                  <div>
                    <div className="text-white font-medium">Machine Learning Nanodegree</div>
                    <div className="text-sm text-gray-500">Udacity</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-6">Technical Skills</h3>
              <div className="space-y-6">
                {skills.map((group, i) => (
                  <div key={i}>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">{group.category}</div>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((skill, j) => (
                        <span
                          key={j}
                          className="px-3 py-1.5 text-sm text-gray-300 bg-white/5 rounded-lg border border-white/10 hover:border-[#ff4d00]/50 hover:bg-[#ff4d00]/5 transition-all duration-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-32 px-6 lg:px-12 bg-[#080808]">
        <div className="max-w-4xl mx-auto">
          <span className="text-sm font-semibold text-[#ff4d00] tracking-wider uppercase mb-4 block">Experience</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">
            Where I've worked
          </h2>

          <div className="space-y-12">
            {experience.map((job, i) => (
              <div
                key={i}
                className="group relative pl-8 border-l-2 border-white/10 hover:border-[#ff4d00]/50 transition-colors duration-300"
              >
                <div className="absolute left-0 top-0 w-3 h-3 -translate-x-[7px] rounded-full bg-[#0a0a0a] border-2 border-white/20 group-hover:border-[#ff4d00] group-hover:bg-[#ff4d00]/20 transition-all duration-300" />

                <div className="text-sm text-gray-500 mb-2">{job.period}</div>
                <h3 className="text-xl font-semibold text-white mb-1">{job.title}</h3>
                <div className="text-[#ff4d00] mb-4">{job.company}</div>
                <p className="text-gray-400 leading-relaxed mb-4">{job.description}</p>
                <div className="flex flex-wrap gap-2">
                  {job.highlights.map((h, j) => (
                    <span key={j} className="px-3 py-1 text-xs font-medium text-[#ff4d00] bg-[#ff4d00]/10 rounded-full">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="py-32 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <span className="text-sm font-semibold text-[#ff4d00] tracking-wider uppercase mb-4 block">Work</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">
            Featured projects
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#ff4d00]/30 hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-[#ff4d00] bg-[#ff4d00]/10 px-3 py-1 rounded-full">
                    {project.metrics}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#ff4d00] transition-colors">
                  {project.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t, j) => (
                    <span key={j} className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 lg:px-12 bg-[#080808]">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-sm font-semibold text-[#ff4d00] tracking-wider uppercase mb-4 block">Contact</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Let's work together
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Building something in healthcare tech? Scaling distributed systems?
            I'd love to hear about it.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href="mailto:suganthan94@yahoo.com"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-semibold bg-gradient-to-r from-[#ff4d00] to-[#ff6b00] text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              suganthan94@yahoo.com
            </a>
            <a
              href="https://linkedin.com/in/suganthan-arulvelan-a9356073"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-semibold text-white border border-white/20 rounded-xl hover:bg-white/5 hover:border-white/40 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Salem, Tamil Nadu, India
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +91 9080704073
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Suganthan Arulvelan
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <span>English</span>
            <span>•</span>
            <span>Tamil</span>
            <span>•</span>
            <span>French</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
