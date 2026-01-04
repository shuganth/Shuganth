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
          {/* Left - Photo */}
          <div className="bg-zinc-950 p-8 md:p-12 lg:p-16 flex items-center justify-center relative overflow-hidden">
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute -inset-4 rounded-full border-2 border-orange-500/20 animate-pulse" />
              <div className="absolute -inset-8 rounded-full border border-orange-500/10" />

              {/* Profile Image */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-orange-500/50 shadow-2xl shadow-orange-500/20">
                <img
                  src="/profile.jpg"
                  alt="Suganthan Arulvelan"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-2 -right-2 bg-orange-500 text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                10+ Years
              </div>
            </div>

            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white rounded-full" />
              <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-white rounded-full" />
            </div>
          </div>

          {/* Right - Content */}
          <div className="bg-black p-12 md:p-16 lg:p-20 flex flex-col justify-center">
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
        </div>

        {/* Bento Grid - Below */}
        <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-sm p-4 lg:p-6">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
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
      {/* SECTION 4: TECH STACK - Visual Grid */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-16">
          <span className="text-orange-500 text-sm font-medium tracking-wider uppercase">Arsenal</span>
          <h2 className="text-5xl md:text-6xl font-black mt-4">
            Tech Stack<span className="text-orange-500">.</span>
          </h2>
        </div>

        {/* Tech Icons Grid */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {[
              { name: 'Azure', icon: (
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
                  <path d="M5.483 21.3H24L14.025 4.013l-3.038 8.347 5.836 6.938L5.483 21.3zM13.23 2.7L6.105 8.677 0 19.253h5.505l7.725-16.553z"/>
                </svg>
              )},
              { name: 'Kubernetes', icon: (
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
                  <path d="M10.204 14.35l.007.01-.999 2.413a5.171 5.171 0 01-2.075-2.597l2.578-.437.004.005a.44.44 0 01.485.606zm-.833-2.129a.44.44 0 00.173-.756l.002-.011L7.585 9.7a5.143 5.143 0 00-.73 3.255l2.514-.725.002-.009zm1.145-1.98a.44.44 0 00.699-.337l.01-.005.15-2.62a5.144 5.144 0 00-3.01 1.442l2.147 1.523.004-.003zm.76 2.75l.723.349.722-.347.18-.78-.5-.623h-.804l-.5.623.179.778zm1.5-2.095a.44.44 0 00.7.336l.008.003 2.134-1.513a5.188 5.188 0 00-2.992-1.442l.148 2.615.002.001zm10.876 5.97l-5.773 7.181a1.6 1.6 0 01-1.248.594H9.261a1.6 1.6 0 01-1.247-.594l-5.773-7.181a1.583 1.583 0 01-.307-1.34L3.823 5.81a1.6 1.6 0 01.947-1.086l7.253-2.911a1.6 1.6 0 011.198 0l7.253 2.911a1.6 1.6 0 01.946 1.087l1.89 9.717c.092.47-.038.96-.307 1.338zM12 5.835a5.61 5.61 0 00-3.86 9.696l-.013.011.013.01.02-.018a5.61 5.61 0 007.68 0l.02.018.013-.01-.013-.01A5.61 5.61 0 0012 5.835zm4.297 4.86l-1.96-1.39a.987.987 0 00-.532-.192.986.986 0 00-.708.306.986.986 0 00-.207.734l-.132 2.313a.98.98 0 00-.38.102.986.986 0 00-.505.658l-.638 2.762a.98.98 0 00-.134.38c.02.266.135.5.32.675a.986.986 0 00.696.29.99.99 0 00.392-.08l2.28-1.101a.987.987 0 00.632.232.99.99 0 00.724-.318.984.984 0 00.236-.725l.638-2.765a.983.983 0 00.134-.38.986.986 0 00-.32-.674.986.986 0 00-.536-.287z"/>
                </svg>
              )},
              { name: 'Docker', icon: (
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
                  <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288z"/>
                </svg>
              )},
              { name: 'React', icon: (
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
                  <path d="M14.23 12.004a2.236 2.236 0 01-2.235 2.236 2.236 2.236 0 01-2.236-2.236 2.236 2.236 0 012.235-2.236 2.236 2.236 0 012.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"/>
                </svg>
              )},
              { name: 'Python', icon: (
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
                  <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/>
                </svg>
              )},
              { name: 'Snowflake', icon: (
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
                  <path d="M12 0L10.5 1.5v4.293l-3.146-3.147L6.293 3.707 10.5 7.914v2.764L8.013 9.04 4.867 5.893 3.806 6.954l2.44 2.44H3.707l-1.06 1.06L3.706 11.5h4.293l-3.146 3.146 1.061 1.061L9.06 12.56l2.44-2.439v4.293l-1.5 1.5 1.5 1.5v2.879l1.5-1.5V16.5l1.5 1.5v-4.293l2.44 2.44 3.146 3.146 1.061-1.061-3.146-3.146h4.293l1.06-1.06-1.06-1.061h-2.539l2.44-2.44-1.061-1.061-3.146 3.147L15.5 10.68V7.914l4.207-4.207-1.061-1.061-3.146 3.147V1.5L14 0h-2z"/>
                </svg>
              )},
              { name: '.NET', icon: (
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
                  <path d="M24 8.77h-2.468v7.565h-1.425V8.77h-2.462V7.53H24zm-6.852 7.565h-4.821V7.53h4.63v1.24h-3.205v2.494h2.953v1.234h-2.953v2.604h3.396zm-6.708 0H8.882L4.78 9.863a2.896 2.896 0 01-.258-.51h-.036c.032.189.048.592.048 1.21v5.772H3.157V7.53h1.659l3.965 6.32c.167.261.275.442.323.54h.024c-.04-.233-.06-.629-.06-1.185V7.529h1.372zM3.496 12.54a2.51 2.51 0 01-.702 1.848 2.586 2.586 0 01-1.946.741 2.59 2.59 0 01-1.946-.74A2.51 2.51 0 01-.8 12.538c0-.745.234-1.356.702-1.833a2.586 2.586 0 011.946-.716c.78 0 1.426.239 1.946.716.468.477.702 1.088.702 1.833z"/>
                </svg>
              )},
              { name: 'Svelte', icon: (
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
                  <path d="M20.347 3.542c-2.345-3.387-6.97-4.17-10.28-1.852L5.01 5.674c-1.532 1.087-2.553 2.77-2.82 4.628-.215 1.49.09 3.02.877 4.341-.577.792-.964 1.7-1.126 2.661-.27 1.863.2 3.783 1.332 5.331 2.345 3.387 6.97 4.17 10.28 1.852l5.057-3.984c1.532-1.087 2.553-2.77 2.82-4.628.215-1.49-.09-3.02-.877-4.341.577-.792.964-1.7 1.126-2.661.27-1.863-.2-3.783-1.332-5.331zM9.87 21.38c-1.83.488-3.792-.121-5.018-1.613-.86-1.045-1.158-2.415-.84-3.706l.117-.396.092-.25.24.147c.643.394 1.337.695 2.06.894l.196.056-.018.197c-.036.258.03.521.186.733.314.398.805.594 1.293.503.112-.022.22-.057.323-.105l5.028-3.967c.271-.203.433-.514.453-.855.019-.34-.112-.674-.361-.903-.314-.398-.805-.594-1.293-.503-.112.022-.22.057-.323.105l-1.917 1.511c-.343.157-.711.26-1.088.306-1.83.488-3.792-.121-5.018-1.613-.86-1.045-1.158-2.415-.84-3.706.242-1.028.872-1.937 1.764-2.556l5.028-3.967c.343-.157.711-.26 1.088-.306 1.83-.488 3.792.121 5.018 1.613.86 1.045 1.158 2.415.84 3.706l-.117.396-.092.25-.24-.147c-.643-.394-1.337-.695-2.06-.894l-.196-.056.018-.197c.036-.258-.03-.521-.186-.733-.314-.398-.805-.594-1.293-.503-.112.022-.22.057-.323.105l-5.028 3.967c-.271.203-.433.514-.453.855-.019.34.112.674.361.903.314.398.805.594 1.293.503.112-.022.22-.057.323-.105l1.917-1.511c.343-.157.711-.26 1.088-.306 1.83-.488 3.792.121 5.018 1.613.86 1.045 1.158 2.415.84 3.706-.242 1.028-.872 1.937-1.764 2.556l-5.028 3.967c-.343.157-.711.26-1.088.306z"/>
                </svg>
              )},
              { name: 'OpenAI', icon: (
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
                  <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0012 .075c-1.64 0-3.183.654-4.334 1.827a6.027 6.027 0 00-1.5 4.034c-1.87.343-3.513 1.376-4.538 2.927a6.027 6.027 0 00.475 7.122 5.985 5.985 0 00.516 4.91 6.046 6.046 0 006.51 2.9A6.065 6.065 0 0012 23.925c1.64 0 3.183-.654 4.334-1.827a6.027 6.027 0 001.5-4.034c1.87-.343 3.513-1.376 4.538-2.927a6.027 6.027 0 00-.475-7.122l-.115.757zM12 20.67a3.95 3.95 0 01-2.54-.924l.126-.072 4.215-2.433a.68.68 0 00.344-.6v-5.942l1.782 1.029c.02.01.033.03.038.052v4.92a3.98 3.98 0 01-3.965 3.97zM4.6 16.89a3.95 3.95 0 01-.474-2.647l.126.076 4.215 2.432a.69.69 0 00.688 0l5.148-2.973v2.058c0 .023-.01.045-.028.062l-4.262 2.461A3.98 3.98 0 014.6 16.89zM3.25 7.63a3.95 3.95 0 012.066-1.735v5.015c0 .245.13.472.344.599l5.148 2.973-1.782 1.028a.063.063 0 01-.066.005l-4.262-2.461A3.98 3.98 0 013.25 7.63zm14.51 3.38l-5.148-2.973 1.782-1.028a.063.063 0 01.066-.005l4.262 2.461a3.977 3.977 0 01-.614 7.165v-5.021a.685.685 0 00-.348-.599zm1.773-2.745l-.126-.075-4.215-2.433a.69.69 0 00-.688 0l-5.148 2.973V6.673c0-.023.01-.045.028-.062l4.262-2.46a3.98 3.98 0 015.887 4.114zm-11.16 3.66L6.59 10.896a.063.063 0 01-.038-.052V5.924a3.98 3.98 0 016.505-3.057l-.126.072-4.215 2.433a.68.68 0 00-.344.6v5.952zm.968-2.089l2.294-1.324 2.294 1.324v2.648l-2.294 1.324-2.294-1.324v-2.648z"/>
                </svg>
              )},
              { name: 'TypeScript', icon: (
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
                  <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 011.306.34v2.458a3.95 3.95 0 00-.643-.361 5.093 5.093 0 00-.717-.26 5.453 5.453 0 00-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 00-.623.242c-.17.104-.3.229-.393.374a.888.888 0 00-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 01-1.012 1.085 4.38 4.38 0 01-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 01-1.84-.164 5.544 5.544 0 01-1.512-.493v-2.63a5.033 5.033 0 003.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 00-.074-1.089 2.12 2.12 0 00-.537-.5 5.597 5.597 0 00-.807-.444 27.72 27.72 0 00-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 011.47-.629 7.536 7.536 0 011.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/>
                </svg>
              )},
              { name: 'Auth0', icon: (
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
                  <path d="M21.98 7.448L19.62 0H4.347L2.02 7.448c-1.352 4.312.03 9.206 3.815 12.015L12.007 24l6.157-4.552c3.755-2.81 5.182-7.688 3.815-12.015l-6.16 4.58 2.343 7.45-6.157-4.597-6.158 4.58 2.358-7.433-6.188-4.55 7.63-.045L12.008 0l2.356 7.404 7.615.044z"/>
                </svg>
              )},
              { name: 'SQL Server', icon: (
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
                  <path d="M4.105 4.105S9.158 1.58 11.684.316a3.079 3.079 0 011.481-.315c.766.047 1.677.788 1.677.788L24 9.948v9.789h-4.263V24H.526V9.948zM9.79 23.263h9.684v-9.105l-9.684 9.105zM1.315 9.948V20.21l6.316-6.316-6.316-3.946zm8.684 9.842l12.316-11.63-11.368-6.57-4.579 2.526 3.631 2.104v4.736l-3.631 2.104V8.316L.79 5.263c.316-.158.632-.316 1.053-.474l4.105 2.42V3.158L.79 5.263v4.685l5.263 3.158v4.736L.526 14.684v8.579h8.684v-3.158l.789-.315zM12 9.948a.79.79 0 110 1.578.79.79 0 010-1.578z"/>
                </svg>
              )},
              { name: 'Git', icon: (
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
                  <path d="M23.546 10.93L13.067.452a1.55 1.55 0 00-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 012.327 2.341l2.658 2.66a1.838 1.838 0 11-1.103 1.033l-2.48-2.48v6.53a1.838 1.838 0 11-1.512-.033V8.73a1.838 1.838 0 01-.999-2.413L7.629 3.587.452 10.765a1.55 1.55 0 000 2.188l10.48 10.477a1.55 1.55 0 002.186 0l10.428-10.43a1.55 1.55 0 000-2.07z"/>
                </svg>
              )},
              { name: 'Databricks', icon: (
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
                  <path d="M.95 14.184L12 20.403l9.919-5.55v2.21L12 22.662l-10.484-5.96-.566.319v.637L12 24l11.05-6.34V6.34L12 0 .95 6.34v7.844zm22.1 0l-1.132.632L12 20.403l-9.918-5.55L.95 14.184V15.5L12 21.72l11.05-6.22v-1.316z"/>
                </svg>
              )},
            ].map((tech, i) => (
              <div
                key={i}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300 cursor-default"
              >
                <div className="text-gray-400 group-hover:text-orange-500 transition-colors">
                  {tech.icon}
                </div>
                <span className="mt-3 text-sm font-medium text-gray-500 group-hover:text-white transition-colors">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Categories */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mt-16 grid md:grid-cols-3 gap-8">
          {[
            { title: 'Cloud & DevOps', icon: '☁️', items: ['Azure Kubernetes', 'Docker', 'KEDA', 'Service Bus', 'CI/CD'] },
            { title: 'Backend & Data', icon: '⚡', items: ['.NET Core', 'Python', 'Snowflake', 'KDB+', 'SQL Server'] },
            { title: 'Frontend & AI', icon: '🧠', items: ['Svelte', 'React', 'OpenAI GPT-4', 'Auth0', 'TypeScript'] },
          ].map((group, i) => (
            <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{group.icon}</span>
                <h3 className="text-xl font-bold text-white">{group.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item, j) => (
                  <span key={j} className="px-4 py-2 bg-black rounded-lg text-sm text-gray-400 border border-white/10 hover:border-orange-500/50 hover:text-orange-500 transition-all">
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
