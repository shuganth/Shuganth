'use client'

import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import anime from 'animejs'

gsap.registerPlugin(ScrollTrigger)

/* ------------------------------------------------------------------ */
/*  Motion helpers                                                     */
/* ------------------------------------------------------------------ */
const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const useIsoLayout =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

/* Reveal-on-scroll wrapper (scrub-free staggered entrance) */
const Reveal = ({ children, className = '', y = 28, delay = 0, as: Tag = 'div' }) => {
  const ref = useRef(null)
  useIsoLayout(() => {
    const el = ref.current
    if (!el) return
    if (prefersReduced()) {
      gsap.set(el, { opacity: 1, y: 0 })
      return
    }
    const anim = gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      }
    )
    return () => {
      anim.scrollTrigger && anim.scrollTrigger.kill()
      anim.kill()
    }
  }, [])
  return (
    <Tag ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  )
}

/* Stagger children entrance */
const RevealGroup = ({ children, className = '', stagger = 0.08, selector = ':scope > *' }) => {
  const ref = useRef(null)
  useIsoLayout(() => {
    const el = ref.current
    if (!el) return
    const items = el.querySelectorAll(selector)
    if (!items.length) return
    if (prefersReduced()) {
      gsap.set(items, { opacity: 1, y: 0 })
      return
    }
    const anim = gsap.fromTo(
      items,
      { opacity: 0, y: 26 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger,
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      }
    )
    return () => {
      anim.scrollTrigger && anim.scrollTrigger.kill()
      anim.kill()
    }
  }, [])
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/* Magnetic hover (subtle pull toward cursor) */
const useMagnetic = (strength = 0.3) => {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) * strength
      const y = (e.clientY - (r.top + r.height / 2)) * strength
      gsap.to(el, { x, y, duration: 0.4, ease: 'power3.out' })
    }
    const reset = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' })
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', reset)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', reset)
    }
  }, [strength])
  return ref
}

/* ------------------------------------------------------------------ */
/*  Section eyebrow                                                    */
/* ------------------------------------------------------------------ */
const Eyebrow = ({ index, label }) => (
  <span className="eyebrow inline-flex items-center gap-2">
    <span className="text-indigo">{`// ${index}`}</span>
    <span className="h-px w-6 bg-white/20" />
    <span>{label}</span>
  </span>
)

const SectionHeading = ({ index, eyebrow, title, accent, sub }) => (
  <Reveal className="mb-12 md:mb-16">
    <Eyebrow index={index} label={eyebrow} />
    <h2 className="display-hero mt-5 text-[2.1rem] sm:text-5xl md:text-6xl">
      <span className="text-white/95">{title} </span>
      <span className="text-gradient">{accent}</span>
    </h2>
    {sub && <p className="mt-4 max-w-prose text-[0.98rem] leading-relaxed text-white/55">{sub}</p>}
  </Reveal>
)

/* ------------------------------------------------------------------ */
/*  Intro preloader                                                    */
/* ------------------------------------------------------------------ */
const Intro = ({ onComplete }) => {
  const rootRef = useRef(null)
  const barRef = useRef(null)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    if (prefersReduced()) {
      onComplete()
      return
    }
    const tl = anime.timeline({ easing: 'easeOutExpo' })
    tl.add({ targets: '.intro-mark', opacity: [0, 1], scale: [0.85, 1], duration: 700 })
      .add(
        { targets: '.intro-line span', translateY: ['110%', '0%'], opacity: [0, 1], delay: anime.stagger(70), duration: 700 },
        '-=350'
      )
      .add({ targets: '.intro-meta', opacity: [0, 1], duration: 500 }, '-=300')

    const counter = { v: 0 }
    anime({
      targets: counter,
      v: 100,
      duration: 1900,
      easing: 'easeInOutQuart',
      update: () => setPct(Math.round(counter.v)),
      complete: () => {
        anime({
          targets: rootRef.current,
          opacity: [1, 0],
          translateY: [0, -24],
          duration: 600,
          easing: 'easeInOutQuart',
          complete: () => onComplete(),
        })
      },
    })
    if (barRef.current) {
      anime({ targets: barRef.current, width: ['0%', '100%'], duration: 1900, easing: 'easeInOutQuart' })
    }
    return () => tl.pause()
  }, [onComplete])

  return (
    <div ref={rootRef} className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-ink">
      <div className="absolute inset-0 grid-backdrop opacity-60" />
      <div className="orb h-[420px] w-[420px] opacity-30" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.6), transparent 65%)' }} />

      <div className="relative text-center">
        <div className="intro-mark mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl glass">
          <span className="display-hero text-2xl text-gradient">SA</span>
        </div>
        <h1 className="intro-line display-hero overflow-hidden text-3xl text-white/90 sm:text-5xl">
          <span className="inline-block">SUGANTHAN&nbsp;</span>
          <span className="inline-block text-gradient">ARULVELAN</span>
        </h1>
        <p className="intro-meta mt-4 font-mono text-[0.72rem] uppercase tracking-[0.3em] text-white/40">
          Applied AI Architect
        </p>
      </div>

      <div className="intro-meta absolute bottom-12 left-1/2 w-60 -translate-x-1/2">
        <div className="mb-2 flex items-center justify-between font-mono text-[0.7rem] text-white/40">
          <span>INITIALIZING</span>
          <span className="text-indigo">{pct}%</span>
        </div>
        <div className="h-px w-full overflow-hidden bg-white/10">
          <div ref={barRef} className="progress-bar h-full w-0" />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Scroll progress rail + cursor spotlight                           */
/* ------------------------------------------------------------------ */
const ScrollProgress = () => {
  const fillRef = useRef(null)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      const p = max > 0 ? h.scrollTop / max : 0
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="fixed left-0 right-0 top-0 z-[80] h-[2px] bg-white/5">
      <div ref={fillRef} className="progress-bar h-full origin-left" style={{ transform: 'scaleX(0)' }} />
    </div>
  )
}

const Spotlight = () => {
  const ref = useRef(null)
  useEffect(() => {
    if (prefersReduced()) return
    const move = (e) => {
      if (ref.current) ref.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])
  return <div ref={ref} className="spotlight" aria-hidden="true" />
}

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */
const NAV_LINKS = [
  { id: 'about', n: '01', label: 'About' },
  { id: 'experience', n: '02', label: 'Experience' },
  { id: 'ai', n: '03', label: 'AI Work' },
  { id: 'skills', n: '04', label: 'Skills' },
  { id: 'impact', n: '05', label: 'Impact' },
  { id: 'education', n: '06', label: 'Education' },
  { id: 'contact', n: '07', label: 'Contact' },
]

const Navigation = ({ active, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    if (!prefersReduced()) gsap.from(navRef.current, { y: -80, opacity: 0, duration: 0.7, delay: 0.15, ease: 'power3.out' })
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id) => {
    onNavigate(id)
    setOpen(false)
  }

  return (
    <nav
      ref={navRef}
      className={`fixed inset-x-0 top-0 z-[70] transition-all duration-500 ${
        scrolled ? 'py-2.5' : 'py-4'
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 transition-all duration-500 md:px-5 ${
          scrolled ? 'glass-strong py-2.5 shadow-glass' : 'border border-transparent py-3'
        }`}
        style={{ marginLeft: 'max(1rem, env(safe-area-inset-left))', marginRight: 'max(1rem, env(safe-area-inset-right))' }}
      >
        <button onClick={() => go('hero')} className="group flex items-center gap-2.5" aria-label="Back to top">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl glass text-sm">
            <span className="display-hero text-gradient">SA</span>
          </span>
          <span className="hidden font-mono text-xs tracking-widest text-white/50 transition-colors group-hover:text-white/80 sm:block">
            ARULVELAN
          </span>
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className={`group relative rounded-lg px-3 py-1.5 text-sm transition-colors ${
                active === l.id ? 'text-white' : 'text-white/55 hover:text-white/90'
              }`}
            >
              <span className="mr-1 font-mono text-[0.62rem] text-indigo/70">{l.n}</span>
              {l.label}
              <span
                className={`absolute inset-x-2 -bottom-0.5 h-px origin-left bg-accent-gradient transition-transform duration-300 ${
                  active === l.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href="/Suganthan_Arulvelan_Resume.html"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/80 transition-colors hover:border-white/30 hover:text-white"
          >
            Resume
          </a>
          <button onClick={() => go('contact')} className="btn-primary rounded-full px-4 py-1.5 text-sm font-medium text-white">
            Let&apos;s Talk
          </button>
        </div>

        <button onClick={() => setOpen((o) => !o)} className="rounded-lg p-2 text-white lg:hidden" aria-label="Toggle menu" aria-expanded={open}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        className={`mx-4 overflow-hidden rounded-2xl transition-all duration-300 lg:hidden ${
          open ? 'mt-2 max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="glass-strong rounded-2xl p-3">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                active === l.id ? 'bg-white/5 text-white' : 'text-white/65 hover:bg-white/5'
              }`}
            >
              <span className="font-mono text-[0.65rem] text-indigo/70">{l.n}</span>
              {l.label}
            </button>
          ))}
          <div className="mt-2 flex gap-2 px-1 pb-1">
            <a
              href="/Suganthan_Arulvelan_Resume.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-full border border-white/15 py-2.5 text-center text-sm text-white/80"
            >
              Resume
            </a>
            <button onClick={() => go('contact')} className="btn-primary flex-1 rounded-full py-2.5 text-sm font-medium text-white">
              Let&apos;s Talk
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
const MODELS = ['Claude (API & for Work)', 'Google Gemini', 'Azure OpenAI']

const Hero = ({ onNavigate }) => {
  const sectionRef = useRef(null)
  const orb1 = useRef(null)
  const orb2 = useRef(null)
  const ctaRef = useMagnetic(0.25)

  useIsoLayout(() => {
    const ctx = gsap.context(() => {
      if (!prefersReduced()) {
        const tl = gsap.timeline({ delay: 0.25 })
        tl.from('.hero-rise', { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1 })
          .from('.hero-photo', { scale: 0.85, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.8')

        gsap.to([orb1.current, orb2.current], {
          x: (i) => (i === 0 ? 40 : -30),
          y: (i) => (i === 0 ? 26 : -22),
          duration: (i) => (i === 0 ? 9 : 7),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })

        gsap.to('.hero-inner', {
          y: 120,
          opacity: 0.15,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        gsap.to('.hero-scroll', { y: 8, duration: 1, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" ref={sectionRef} className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pb-16 pt-28">
      <div className="absolute inset-0 grid-backdrop" />
      <div ref={orb1} className="orb left-[6%] top-[14%] h-[440px] w-[440px] opacity-40" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.5), transparent 65%)' }} />
      <div ref={orb2} className="orb bottom-[10%] right-[8%] h-[380px] w-[380px] opacity-30" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.45), transparent 65%)' }} />

      <div className="hero-inner relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1.15fr_0.85fr]">
        {/* Left: copy */}
        <div>
          <div className="hero-rise mb-6 inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[0.72rem] tracking-wide text-white/70">Open to Applied AI Architect roles</span>
          </div>

          <p className="hero-rise eyebrow mb-4">Salem · Bengaluru, India — 13.04°N, 80.24°E</p>

          <h1 className="hero-rise display-hero text-[3rem] leading-[0.92] sm:text-[4.4rem] md:text-[5.2rem]">
            <span className="text-white/95">SUGANTHAN</span>
            <br />
            <span className="text-gradient">ARULVELAN</span>
          </h1>

          <p className="hero-rise mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
            <span className="font-medium text-white">Applied AI Architect</span> shipping production LLM systems for global
            pharma — <span className="text-white/85">RAG, agentic &amp; multi-agent pipelines, evals at scale</span> — and the
            trusted technical advisor from C-suite to engineering.
          </p>

          <div className="hero-rise mt-6 flex flex-wrap gap-2">
            {MODELS.map((m) => (
              <span key={m} className="kbd">{m}</span>
            ))}
          </div>

          <div className="hero-rise mt-8 flex flex-wrap items-center gap-3">
            <button ref={ctaRef} onClick={() => onNavigate('contact')} className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white">
              Start a conversation
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12h14m-6-6 6 6-6 6" /></svg>
            </button>
            <a href="/Suganthan_Arulvelan_Resume.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-white/80 transition-colors hover:border-white/30 hover:text-white">
              View Resume
            </a>
          </div>

          <div className="hero-rise mt-8 flex items-center gap-3">
            {[
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/suganthan-arulvelan-a9356073/', d: 'M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.76-1.75 1.76zm13.5 12.27h-3v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96v5.7h-3v-11h2.88v1.5h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v6.46z' },
              { label: 'GitHub', href: 'https://github.com/shuganth', d: 'M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z' },
              { label: 'Email', href: 'mailto:suganthan94@yahoo.com', d: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z' },
            ].map((s) => (
              <a key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-xl glass text-white/60 transition-all hover:-translate-y-0.5 hover:text-white">
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor"><path d={s.d} /></svg>
              </a>
            ))}
          </div>
        </div>

        {/* Right: portrait card */}
        <div className="hero-photo relative mx-auto w-full max-w-sm">
          <div className="gradient-border relative overflow-hidden rounded-[1.75rem] glass p-2">
            <div className="relative overflow-hidden rounded-[1.4rem]">
              <img src="/profile.jpg" alt="Portrait of Suganthan Arulvelan" className="aspect-[4/5] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl glass-strong px-3 py-2">
                <span className="font-mono text-[0.66rem] text-white/60">STATUS</span>
                <span className="font-mono text-[0.66rem] text-emerald-300">● ONLINE</span>
              </div>
            </div>
          </div>
          {/* floating stat chips */}
          <div className="absolute -left-5 top-10 hidden rounded-2xl glass px-4 py-3 shadow-glass sm:block">
            <div className="display-hero text-2xl text-gradient">2M+</div>
            <div className="font-mono text-[0.62rem] text-white/50">docs in production</div>
          </div>
          <div className="absolute -right-4 bottom-12 hidden rounded-2xl glass px-4 py-3 shadow-glass sm:block">
            <div className="display-hero text-2xl text-gradient-ember">174K/hr</div>
            <div className="font-mono text-[0.62rem] text-white/50">peak throughput</div>
          </div>
        </div>
      </div>

      <div className="hero-scroll absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 md:flex">
        <span className="font-mono text-[0.62rem] tracking-[0.3em] text-white/35">SCROLL</span>
        <svg className="h-4 w-4 text-white/35" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="m19 14-7 7-7-7" /></svg>
      </div>
    </section>
  )
}

/* Marquee of capabilities under hero */
const Marquee = () => {
  const items = ['RAG', 'Multi-Agent Pipelines', 'Prompt Engineering', 'Evaluation Frameworks', 'Kubernetes / KEDA', 'Azure', 'Snowflake Cortex', '.NET Core', 'Client Advisory', 'Live Exec Demos']
  return (
    <div className="relative overflow-hidden border-y border-line py-4" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center">
            {items.map((it, i) => (
              <span key={`${dup}-${i}`} className="flex items-center font-mono text-sm text-white/45">
                <span className="px-6">{it}</span>
                <span className="text-indigo/60">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  About                                                              */
/* ------------------------------------------------------------------ */
const STRENGTHS = [
  { t: 'Trusted Technical Advisor', d: 'Primary technical voice on high-priority initiatives — guiding stakeholders from discovery through architecture to production.', c: '#6366F1' },
  { t: 'Audience-Range Communication', d: 'From value-focused C-suite demos to deep technical sessions for engineering — cited as a model for enterprise AI adoption.', c: '#3B82F6' },
  { t: 'LLM Solution Design', d: 'RAG, multi-agent, and high-throughput systems on Claude, Gemini, and Azure OpenAI, integrated into enterprise stacks.', c: '#8B5CF6' },
  { t: 'Evaluation Frameworks', d: 'Confidence scoring, evidence extraction, and hallucination controls — evals validated across 2M+ documents.', c: '#6366F1' },
  { t: 'India / APAC Delivery', d: 'Lead engineering for global pharma from India across distributed, cross-time-zone, multi-stakeholder teams.', c: '#3B82F6' },
  { t: 'Teaching & Mentoring', d: 'Scaled a cross-discipline team from 10 to 20 engineers with zero attrition; set architecture standards.', c: '#F97316' },
]

const About = () => (
  <section id="about" className="relative px-5 py-24 md:py-32">
    <div className="mx-auto max-w-6xl">
      <SectionHeading
        index="01"
        eyebrow="About"
        title="The"
        accent="operator's profile"
        sub="Enterprise AI & platform engineering leader who turns ambiguous business problems into scalable, secure, compliant cloud architecture — and proves value through live executive demonstrations."
      />

      <div className="grid items-start gap-10 md:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <div className="gradient-border relative overflow-hidden rounded-3xl glass p-2.5">
            <div className="relative overflow-hidden rounded-[1.3rem]">
              <img src="/photo2.jpg" alt="Suganthan presenting" className="aspect-[4/5] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            </div>
            <div className="absolute -bottom-5 -right-4 h-28 w-28 overflow-hidden rounded-2xl border border-line shadow-glass">
              <img src="/photo3.jpg" alt="Suganthan portrait" className="h-full w-full object-cover" />
            </div>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-3">
            {[
              { k: 'Location', v: 'Salem / Bengaluru' },
              { k: 'Languages', v: 'EN · TA · FR' },
              { k: 'Phone', v: '+91 90807 04073' },
              { k: 'Email', v: 'suganthan94@yahoo.com' },
            ].map((x) => (
              <div key={x.k} className="rounded-xl glass px-3.5 py-3">
                <dt className="font-mono text-[0.62rem] uppercase tracking-wider text-indigo/80">{x.k}</dt>
                <dd className="mt-0.5 truncate text-sm text-white/85">{x.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="space-y-5 text-[1.02rem] leading-relaxed text-white/70">
            <p>
              I design and ship <span className="font-medium text-white">production LLM systems</span> for global
              pharmaceutical clients — and act as the <span className="text-gradient-ember font-medium">trusted technical advisor</span> across
              C-suite, engineering, and IT.
            </p>
            <p>
              I&apos;m hands-on across the modern LLM stack — <span className="text-white/90">Claude (API &amp; Claude for Work)</span>,
              Google Gemini, and Azure OpenAI — with production depth in RAG, agentic &amp; multi-agent pipelines, prompt
              engineering, and evaluation frameworks <span className="font-medium text-white">validated across 2M+ documents</span>.
            </p>
            <p>
              My edge is range: translating ambiguous business problems into secure, compliant cloud architecture, then
              proving value through <span className="text-white/90">live executive demonstrations</span> — pairing engineering
              credibility with the communication and mentoring to carry diverse audiences from discovery to deployment.
            </p>
          </div>

          <p className="eyebrow mt-12">// Core strengths for applied AI architecture</p>
          <RevealGroup className="mt-5 grid gap-3 sm:grid-cols-2" stagger={0.06}>
            {STRENGTHS.map((s) => (
              <article key={s.t} className="gradient-border group rounded-2xl glass p-4 transition-transform duration-300 hover:-translate-y-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.c, boxShadow: `0 0 12px ${s.c}` }} />
                  <h3 className="text-sm font-semibold text-white">{s.t}</h3>
                </div>
                <p className="text-[0.86rem] leading-relaxed text-white/55">{s.d}</p>
              </article>
            ))}
          </RevealGroup>
        </Reveal>
      </div>
    </div>
  </section>
)

/* ------------------------------------------------------------------ */
/*  Experience (sticky-rail timeline)                                 */
/* ------------------------------------------------------------------ */
const EXPERIENCE = [
  {
    role: 'Director — Technical Delivery Center',
    company: 'Syneos Health · Salem, India',
    period: 'Jul 2026 — Present',
    accent: '#6366F1',
    summary: 'Promoted to Director (effective 1 July 2026); leads a 20-engineer org across UI, middleware, data, and QA.',
    points: [
      'Leads a 20-engineer organization across UI, middleware, data, and QA disciplines',
      'Delivers enterprise healthcare-analytics and AI platforms for global pharmaceutical clients',
      'Owns architecture standards, the AI-first delivery approach, and executive technical advisory',
    ],
    tech: ['Leadership', 'Enterprise AI', 'Architecture', 'Client Advisory'],
  },
  {
    role: 'Associate Director — Technical Delivery Center',
    company: 'Syneos Health · Salem, India',
    period: 'Nov 2025 — Jun 2026',
    accent: '#3B82F6',
    summary: 'Architected high-throughput LLM pipelines, RAG platforms, and multi-agent systems for global pharma.',
    points: [
      'Distributed AI classification pipeline: classified 2M+ legacy files with Gemini 2.0 Flash across Kubernetes workers + Azure Service Bus — 174K files/hour peak with adaptive concurrency throttling, real-time dashboard, prompt-validation playground, and role-based review app',
      'Proposal Generator using a Gemini-embedding RAG pipeline on Snowflake',
      'Insights Studio: natural-language prompt → complete interactive dashboards',
      'Delivered Precision Targeting Phase 1 to 150+ users: 1,600% user growth, 3,001% login engagement; leading Phase 3',
      'KOL Analytics on Kubernetes / KEDA autoscaling for 1–4 hr analytical queries, event-driven Azure Service Bus backbone',
      'Node.js → .NET Core AIP migration in 30 days: 30% perf gain, zero downtime, zero incidents',
    ],
    tech: ['Gemini 2.0 Flash', 'RAG', 'Multi-Agent', 'Kubernetes', 'KEDA', 'Azure Service Bus', 'Snowflake', '.NET Core'],
  },
  {
    role: 'Principal Engineer',
    company: 'Syneos Health · Salem, India',
    period: 'Jul 2024 — Nov 2025',
    accent: '#8B5CF6',
    summary: 'Led 8–10 engineers across three concurrent healthcare-analytics platforms — zero production incidents, 99.9%+ uptime.',
    points: [
      'Led 8–10 engineers across three concurrent platforms with zero production incidents and 99.9%+ uptime',
      'Pioneered LLM integration for medical-code lookup and ICD-10 validation',
      'Built the GPU-server ROI case for an agentic AI code-generation pipeline',
      'Established reusable .NET Core patterns, CI/CD, and compliance (GxP, HIPAA, SOX) — cutting future build time 30–40%',
    ],
    tech: ['LLM Integration', 'Agentic AI', '.NET Core', 'CI/CD', 'GxP / HIPAA / SOX'],
  },
  {
    role: 'Senior Software Engineer → Senior Full-Stack Developer',
    company: 'Syneos Health · Salem, India',
    period: 'Aug 2022 — Jun 2024',
    accent: '#6366F1',
    summary: 'Native desktop tooling, reporting automation, and advanced Excel integrations.',
    points: [
      'Native KDB IDE desktop app (spreadsheet, SSH views, autocomplete)',
      'Diversity Equity Index reporting tool with automated PowerPoint generation',
      'Excel add-ins (Excel-DNA) for API integrations and complex business logic',
    ],
    tech: ['KDB+', 'Excel-DNA', '.NET Core', 'WPF', 'WinForms'],
  },
  {
    role: 'Project Development Engineer',
    company: 'Open Systems International · Bengaluru, India',
    period: 'Mar 2021 — Jul 2022',
    accent: '#3B82F6',
    summary: 'Enterprise web applications with secure auth and an F# → C# migration.',
    points: [
      'Enterprise ASP.NET / C# / ADO.NET web apps with secure auth and SQL stored procedures',
      'Led an F# → C# migration with comprehensive unit testing',
    ],
    tech: ['ASP.NET', 'C#', 'ADO.NET', 'SQL', 'F#'],
  },
  {
    role: 'Embedded Design Engineer',
    company: 'SUGUS (Clients: Bosch, TVS) · Salem, India',
    period: 'Jul 2018 — Mar 2021',
    accent: '#8B5CF6',
    summary: 'IoT, instrumentation, and HMI automation for industrial clients.',
    points: [
      'TDS meter for Bosch and counter meter for TVS',
      'Offline GPS recorder with tracking',
      'Complete Python-based HMI automation for RO plants',
    ],
    tech: ['Embedded C', 'Python', 'IoT', 'HMI', 'GPS'],
  },
]

const ExperienceCard = ({ item, index }) => {
  const [open, setOpen] = useState(index < 2)
  return (
    <Reveal>
      <article className="gradient-border relative rounded-2xl glass">
        {/* accent rail */}
        <span className="absolute left-0 top-5 bottom-5 w-[3px] rounded-full" style={{ background: `linear-gradient(${item.accent}, transparent)` }} />
        <button onClick={() => setOpen((o) => !o)} className="flex w-full items-start gap-4 p-5 text-left md:p-6" aria-expanded={open}>
          <div className="flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="kbd" style={{ color: item.accent, borderColor: `${item.accent}55` }}>{item.period}</span>
            </div>
            <h3 className="display-hero text-lg leading-tight text-white md:text-xl">{item.role}</h3>
            <p className="mt-0.5 text-sm text-white/50">{item.company}</p>
          </div>
          <span
            className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-line text-white/60 transition-transform duration-300"
            style={{ transform: open ? 'rotate(180deg)' : 'none' }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m6 9 6 6 6-6" /></svg>
          </span>
        </button>
        <div className={`grid overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="min-h-0">
            <div className="border-t border-line px-5 pb-6 pt-4 md:px-6">
              <p className="mb-4 text-[0.95rem] italic text-white/60">{item.summary}</p>
              <ul className="space-y-2.5">
                {item.points.map((p, i) => (
                  <li key={i} className="flex gap-3 text-[0.9rem] leading-relaxed text-white/72">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: item.accent }} />
                    <span className="text-white/70">{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {item.tech.map((t) => (
                  <span key={t} className="rounded-md border border-line bg-white/[0.03] px-2 py-1 font-mono text-[0.68rem] text-white/55">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  )
}

const Experience = () => (
  <section id="experience" className="relative px-5 py-24 md:py-32">
    <div className="orb left-[-6%] top-1/4 h-[360px] w-[360px] opacity-25" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4), transparent 65%)' }} />
    <div className="mx-auto max-w-3xl">
      <SectionHeading index="02" eyebrow="Experience" title="Career" accent="trajectory" sub="Eight years from embedded systems to directing enterprise AI delivery — newest first. Tap a role to expand." />
      <div className="space-y-4">
        {EXPERIENCE.map((item, i) => (
          <ExperienceCard key={i} item={item} index={i} />
        ))}
      </div>
    </div>
  </section>
)

/* ------------------------------------------------------------------ */
/*  AI Innovation                                                      */
/* ------------------------------------------------------------------ */
const AI_HIGHLIGHTS = [
  {
    n: '01',
    title: 'Multi-Model Production Pipelines',
    desc: 'Gemini 2.0 Flash, Azure OpenAI GPT-4o, and Claude routed to classification, medical-terminology, and code-generation workloads respectively.',
    tags: ['Claude', 'Gemini 2.0 Flash', 'GPT-4o', 'Routing'],
    accent: '#6366F1',
  },
  {
    n: '02',
    title: 'Prompt Engineering at Scale',
    desc: 'Structured JSON outputs with confidence scoring, evidence extraction, and hallucination prevention — validated across 2M+ documents in production.',
    tags: ['Structured Output', 'Confidence Scoring', 'Hallucination Controls'],
    accent: '#3B82F6',
  },
  {
    n: '03',
    title: 'Adaptive Concurrency Throttling',
    desc: 'Auto-scaling controller backs off on 429 rate limits (75% steps) and recovers gradually for stable high-throughput LLM processing across distributed workers.',
    tags: ['Rate-Limit Backoff', 'Distributed Workers', '174K files/hr'],
    accent: '#8B5CF6',
  },
  {
    n: '04',
    title: 'AI-Augmented Development',
    desc: 'Claude Code for scaffolding, Snowflake Cortex for debugging, hand-authored architecture for security-sensitive code — cited by leadership as an org model.',
    tags: ['Claude Code', 'Snowflake Cortex', 'Security-First'],
    accent: '#F97316',
  },
]

const MODEL_STACK = [
  { name: 'Claude', note: 'API & for Work', c: '#F97316' },
  { name: 'Google Gemini', note: 'Embeddings & 2.0 Flash', c: '#3B82F6' },
  { name: 'Azure OpenAI', note: 'GPT-4o', c: '#8B5CF6' },
  { name: 'RAG', note: 'Snowflake retrieval', c: '#6366F1' },
  { name: 'Multi-Agent', note: 'Agentic pipelines', c: '#3B82F6' },
  { name: 'Evals', note: '2M+ docs validated', c: '#8B5CF6' },
]

const AIInnovation = () => (
  <section id="ai" className="relative overflow-hidden px-5 py-24 md:py-32">
    <div className="absolute inset-0 grid-backdrop opacity-70" />
    <div className="orb right-[-4%] top-1/3 h-[420px] w-[420px] opacity-25" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent 65%)' }} />
    <div className="relative mx-auto max-w-6xl">
      <SectionHeading index="03" eyebrow="AI Work" title="Production" accent="LLM systems" sub="Real systems, real scale — across the modern LLM stack." />

      <RevealGroup className="mb-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" stagger={0.05}>
        {MODEL_STACK.map((s) => (
          <div key={s.name} className="gradient-border rounded-2xl glass px-4 py-4 text-center transition-transform duration-300 hover:-translate-y-1">
            <div className="text-sm font-semibold" style={{ color: s.c }}>{s.name}</div>
            <div className="mt-1 font-mono text-[0.62rem] leading-tight text-white/45">{s.note}</div>
          </div>
        ))}
      </RevealGroup>

      <RevealGroup className="grid gap-4 md:grid-cols-2" stagger={0.08}>
        {AI_HIGHLIGHTS.map((h) => (
          <article key={h.n} className="gradient-border group relative overflow-hidden rounded-2xl glass p-6 transition-transform duration-300 hover:-translate-y-1.5">
            <span className="absolute right-5 top-4 display-hero text-5xl text-white/[0.04]">{h.n}</span>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${h.accent}1a`, border: `1px solid ${h.accent}40` }}>
              <span className="h-2 w-2 rounded-full" style={{ background: h.accent, boxShadow: `0 0 14px ${h.accent}` }} />
            </div>
            <h3 className="display-hero text-lg text-white md:text-xl">{h.title}</h3>
            <p className="mt-2.5 text-[0.92rem] leading-relaxed text-white/60">{h.desc}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {h.tags.map((t) => (
                <span key={t} className="rounded-full border px-2.5 py-1 font-mono text-[0.66rem]" style={{ color: h.accent, borderColor: `${h.accent}40`, background: `${h.accent}10` }}>{t}</span>
              ))}
            </div>
          </article>
        ))}
      </RevealGroup>
    </div>
  </section>
)

/* ------------------------------------------------------------------ */
/*  Skills                                                             */
/* ------------------------------------------------------------------ */
const SKILL_GROUPS = [
  {
    name: 'AI & ML',
    accent: '#6366F1',
    items: ['Claude (API & for Work)', 'RAG & multi-agent architecture', 'Prompt engineering', 'Evaluation frameworks & evals', 'Embeddings & vector search', 'OCR', 'NLP'],
  },
  {
    name: 'Cloud & Infra',
    accent: '#3B82F6',
    items: ['Azure (AKS, Service Bus, Blob/Table, Key Vault, Monitor)', 'Kubernetes', 'KEDA', 'Docker', 'CI/CD (GitHub Actions, Azure DevOps)', 'Event-driven & distributed systems'],
  },
  {
    name: 'Languages & Backend',
    accent: '#8B5CF6',
    items: ['Python', 'C#', 'TypeScript', 'JavaScript', 'SQL', 'F#', '.NET Core', 'Node.js', 'Entity Framework', 'REST APIs', 'Microservices'],
  },
  {
    name: 'Data, Frontend & Security',
    accent: '#F97316',
    items: ['Snowflake (Cortex, embeddings)', 'PostgreSQL', 'KDB+', 'React / Next.js', 'Svelte', 'Auth0 RBAC', 'Azure Key Vault', 'GxP / HIPAA / SOX', 'Data classification'],
  },
]

const Skills = () => (
  <section id="skills" className="relative px-5 py-24 md:py-32">
    <div className="mx-auto max-w-6xl">
      <SectionHeading index="04" eyebrow="Skills" title="Technical" accent="arsenal" sub="A full-stack span from the modern LLM toolchain down to cloud infrastructure, backend systems, and compliance." />
      <RevealGroup className="grid gap-4 md:grid-cols-2" stagger={0.08}>
        {SKILL_GROUPS.map((g) => (
          <article key={g.name} className="gradient-border rounded-2xl glass p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="display-hero text-lg text-white">{g.name}</h3>
              <span className="font-mono text-[0.66rem]" style={{ color: g.accent }}>{String(g.items.length).padStart(2, '0')}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {g.items.map((it) => (
                <span
                  key={it}
                  className="cursor-default rounded-lg border border-line bg-white/[0.03] px-3 py-1.5 text-[0.82rem] text-white/65 transition-all duration-200 hover:-translate-y-0.5 hover:text-white"
                  style={{ '--c': g.accent }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${g.accent}66`; e.currentTarget.style.background = `${g.accent}14` }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.background = '' }}
                >
                  {it}
                </span>
              ))}
            </div>
          </article>
        ))}
      </RevealGroup>
    </div>
  </section>
)

/* ------------------------------------------------------------------ */
/*  Impact (count-ups) + Recognition                                  */
/* ------------------------------------------------------------------ */
const CountUp = ({ value, prefix = '', suffix = '', format }) => {
  const ref = useRef(null)
  useIsoLayout(() => {
    const el = ref.current
    if (!el) return
    if (prefersReduced()) {
      el.textContent = `${prefix}${format ? format(value) : value}${suffix}`
      return
    }
    const obj = { v: 0 }
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: value,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            const n = Math.round(obj.v)
            el.textContent = `${prefix}${format ? format(n) : n}${suffix}`
          },
        })
      },
    })
    el.textContent = `${prefix}0${suffix}`
    return () => st.kill()
  }, [value])
  return <span ref={ref} />
}

const STATS = [
  { value: 2, prefix: '', suffix: 'M+', label: 'Documents in production', note: 'Evals validated at scale', c: '#6366F1' },
  { value: 174, prefix: '', suffix: 'K/hr', label: 'Peak throughput', note: 'Files classified by LLM', c: '#3B82F6' },
  { value: 1600, prefix: '', suffix: '%', label: 'User growth', note: 'Precision Targeting Phase 1', c: '#8B5CF6', fmt: true },
  { value: 3001, prefix: '', suffix: '%', label: 'Login engagement', note: 'Activity increase', c: '#6366F1', fmt: true },
  { value: 30, prefix: '', suffix: ' days', label: 'Platform migration', note: 'Node.js → .NET Core, zero downtime', c: '#3B82F6' },
  { value: 20, prefix: '', suffix: '', label: 'Engineers led', note: 'Scaled from 10, zero attrition', c: '#F97316' },
]

const RECOGNITION = [
  { title: 'Repeated C-suite visibility', desc: 'Live exec demos for high-priority initiatives; commissioned to document the AI-first delivery approach as an org case study.' },
  { title: '“Strong Performance” — top tier', desc: '2025 performance review; 11 stakeholder feedbacks, all highly positive.' },
  { title: 'Scaled the team 10 → 20', desc: 'Grew a cross-functional team with zero attrition while setting architecture standards and mentorship.' },
]

const withCommas = (n) => n.toLocaleString('en-US')

const Impact = () => (
  <section id="impact" className="relative px-5 py-24 md:py-32">
    <div className="orb right-1/4 top-0 h-[460px] w-[460px] opacity-20" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.3), transparent 65%)' }} />
    <div className="mx-auto max-w-6xl">
      <SectionHeading index="05" eyebrow="Impact" title="Measured" accent="outcomes" sub="Numbers from production systems and leadership — not estimates." />

      <RevealGroup className="grid grid-cols-2 gap-3 md:grid-cols-3" stagger={0.06}>
        {STATS.map((s) => (
          <article key={s.label} className="gradient-border rounded-2xl glass p-5 transition-transform duration-300 hover:-translate-y-1 md:p-6">
            <div className="display-hero text-3xl md:text-[2.6rem]" style={{ color: s.c }}>
              <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} format={s.fmt ? withCommas : undefined} />
            </div>
            <div className="mt-2 text-sm font-medium text-white/85">{s.label}</div>
            <div className="mt-0.5 font-mono text-[0.66rem] text-white/45">{s.note}</div>
          </article>
        ))}
      </RevealGroup>

      <p className="eyebrow mt-16">// Leadership &amp; recognition</p>
      <RevealGroup className="mt-5 grid gap-4 md:grid-cols-3" stagger={0.08}>
        {RECOGNITION.map((r) => (
          <article key={r.title} className="gradient-border rounded-2xl glass p-5">
            <h3 className="text-base font-semibold text-white">{r.title}</h3>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-white/60">{r.desc}</p>
          </article>
        ))}
      </RevealGroup>

      <Reveal className="mt-4">
        <figure className="gradient-border relative overflow-hidden rounded-2xl glass p-7 md:p-9">
          <span className="display-hero absolute -left-2 -top-6 text-[7rem] leading-none text-white/[0.04]">&ldquo;</span>
          <blockquote className="relative text-xl font-light leading-snug text-white/85 md:text-2xl">
            Just give work to him and go to sleep — he will make things happen.
          </blockquote>
          <figcaption className="relative mt-4 font-mono text-[0.72rem] uppercase tracking-wider text-indigo/80">— Stakeholder testimonial</figcaption>
        </figure>
      </Reveal>
    </div>
  </section>
)

/* ------------------------------------------------------------------ */
/*  Education + Languages                                              */
/* ------------------------------------------------------------------ */
const EDUCATION = [
  { degree: 'Nanodegree — Machine Learning Engineer', school: 'Udacity', year: '2020', desc: 'Hands-on ML projects; foundation for production AI work.', c: '#6366F1' },
  { degree: 'M.S. — Control Systems', school: 'Mahendra Institutions', year: '2016 — 2018', desc: 'Advanced control theory and automation systems.', c: '#3B82F6' },
  { degree: 'B.E. — Electrical & Electronics Engineering', school: 'Mahendra Institutions', year: '2012 — 2016', desc: 'Foundation in embedded systems and programming.', c: '#8B5CF6' },
]

const LANGUAGES = [
  { lang: 'English', level: 'Professional', c: '#6366F1' },
  { lang: 'Tamil', level: 'Native', c: '#3B82F6' },
  { lang: 'French', level: 'Elementary', c: '#F97316' },
]

const Education = () => (
  <section id="education" className="relative px-5 py-24 md:py-32">
    <div className="mx-auto max-w-4xl">
      <SectionHeading index="06" eyebrow="Education" title="Academic" accent="foundation" />
      <div className="relative space-y-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-line md:before:left-2">
        {EDUCATION.map((e) => (
          <Reveal key={e.degree}>
            <div className="relative pl-8 md:pl-10">
              <span className="absolute left-0 top-6 h-3.5 w-3.5 rounded-full border-2" style={{ borderColor: e.c, background: '#08090d', boxShadow: `0 0 14px ${e.c}99` }} />
              <article className="gradient-border flex flex-col gap-3 rounded-2xl glass p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white md:text-lg">{e.degree}</h3>
                  <p className="mt-0.5 text-sm text-white/50">{e.school}</p>
                  <p className="mt-1.5 text-[0.86rem] text-white/55">{e.desc}</p>
                </div>
                <span className="kbd self-start whitespace-nowrap" style={{ color: e.c, borderColor: `${e.c}55` }}>{e.year}</span>
              </article>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8">
        <div className="gradient-border rounded-2xl glass p-6">
          <p className="eyebrow mb-4">// Languages</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {LANGUAGES.map((l) => (
              <div key={l.lang} className="flex items-center gap-3 rounded-xl border border-line bg-white/[0.03] px-4 py-3">
                <span className="h-2 w-2 rounded-full" style={{ background: l.c, boxShadow: `0 0 10px ${l.c}` }} />
                <div>
                  <div className="text-sm font-medium text-white">{l.lang}</div>
                  <div className="font-mono text-[0.66rem] text-white/45">{l.level}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  </section>
)

/* ------------------------------------------------------------------ */
/*  Contact                                                            */
/* ------------------------------------------------------------------ */
const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    await new Promise((r) => setTimeout(r, 1400))
    setStatus('sent')
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setStatus('idle'), 3500)
  }

  const channels = [
    { label: 'Email', value: 'suganthan94@yahoo.com', href: 'mailto:suganthan94@yahoo.com', d: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z' },
    { label: 'Phone', value: '+91 90807 04073', href: 'tel:+919080704073', d: 'M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.21 2.2z' },
    { label: 'LinkedIn', value: 'suganthan-arulvelan', href: 'https://www.linkedin.com/in/suganthan-arulvelan-a9356073/', d: 'M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.76-1.75 1.76zm13.5 12.27h-3v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96v5.7h-3v-11h2.88v1.5h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v6.46z' },
    { label: 'GitHub', value: 'shuganth', href: 'https://github.com/shuganth', d: 'M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z' },
  ]

  const input = 'w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-indigo focus:outline-none focus:ring-1 focus:ring-indigo/40'

  return (
    <section id="contact" className="relative overflow-hidden px-5 py-24 md:py-32">
      <div className="orb bottom-0 left-1/4 h-[480px] w-[480px] opacity-25" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4), transparent 65%)' }} />
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading index="07" eyebrow="Contact" title="Let's" accent="build something" sub="Happy to discuss applied AI, LLM architecture, RAG & multi-agent systems, or enterprise delivery." />

        <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="flex h-full flex-col gap-3">
              <div className="gradient-border rounded-2xl glass p-5">
                <p className="eyebrow mb-3">// Direct channels</p>
                <div className="space-y-2">
                  {channels.map((c) => (
                    <a
                      key={c.label}
                      href={c.href}
                      target={c.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-all hover:border-line hover:bg-white/[0.03]"
                    >
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg glass text-white/55 transition-colors group-hover:text-white">
                        <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="currentColor"><path d={c.d} /></svg>
                      </span>
                      <span className="min-w-0">
                        <span className="block font-mono text-[0.62rem] uppercase tracking-wider text-white/40">{c.label}</span>
                        <span className="block truncate text-sm text-white/85">{c.value}</span>
                      </span>
                      <svg className="ml-auto h-4 w-4 flex-shrink-0 text-white/25 transition-transform group-hover:translate-x-0.5 group-hover:text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M7 17 17 7M9 7h8v8" /></svg>
                    </a>
                  ))}
                </div>
              </div>
              <div className="gradient-border flex items-center justify-between rounded-2xl glass px-5 py-4">
                <div>
                  <div className="text-sm font-medium text-white">Salem / Bengaluru, India</div>
                  <div className="font-mono text-[0.66rem] text-white/45">IST · UTC+5:30 · Available now</div>
                </div>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <form onSubmit={submit} className="gradient-border rounded-2xl glass p-6">
              <h3 className="display-hero mb-5 text-lg text-white">Send a message</h3>
              <div className="space-y-3">
                <input type="text" required placeholder="Your name" aria-label="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
                <input type="email" required placeholder="Your email" aria-label="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
                <textarea required rows={5} placeholder="What are you working on?" aria-label="Your message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${input} resize-none`} />
                <button type="submit" disabled={status !== 'idle'} className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60">
                  {status === 'sending' ? 'Sending…' : status === 'sent' ? '✓ Message sent' : 'Send message'}
                </button>
                <p className="text-center font-mono text-[0.66rem] text-white/35">
                  Prefer email? <a href="mailto:suganthan94@yahoo.com" className="text-indigo hover:underline">suganthan94@yahoo.com</a>
                </p>
              </div>
            </form>
          </Reveal>
        </div>

        <footer className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg glass"><span className="display-hero text-xs text-gradient">SA</span></span>
            <span className="font-mono text-[0.7rem] text-white/40">© {new Date().getFullYear()} Suganthan Arulvelan</span>
          </div>
          <span className="font-mono text-[0.7rem] text-white/30">Applied AI Architect · Built with Next.js + GSAP</span>
        </footer>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */
export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [active, setActive] = useState('hero')
  const scrollToRef = useRef(null)
  const mainRef = useRef(null)

  // Load ScrollToPlugin once
  useEffect(() => {
    let mounted = true
    import('gsap/ScrollToPlugin').then(({ ScrollToPlugin }) => {
      if (mounted) {
        gsap.registerPlugin(ScrollToPlugin)
        scrollToRef.current = true
      }
    })
    return () => { mounted = false }
  }, [])

  // Skip intro for reduced motion
  useEffect(() => {
    if (prefersReduced()) setShowIntro(false)
  }, [])

  const navigate = useCallback((id) => {
    const target = document.getElementById(id)
    if (!target) return
    if (scrollToRef.current && !prefersReduced()) {
      gsap.to(window, { duration: 1.05, scrollTo: { y: `#${id}`, offsetY: id === 'hero' ? 0 : 70 }, ease: 'power3.inOut' })
    } else {
      target.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })
    }
  }, [])

  // Active section observer
  useEffect(() => {
    if (showIntro) return
    const ids = ['hero', ...NAV_LINKS.map((l) => l.id)]
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [showIntro])

  // Fade main content in + refresh ScrollTrigger after intro
  useEffect(() => {
    if (!showIntro && mainRef.current) {
      if (!prefersReduced()) gsap.from(mainRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' })
      ScrollTrigger.refresh()
    }
  }, [showIntro])

  return (
    <>
      {showIntro && <Intro onComplete={() => setShowIntro(false)} />}

      {!showIntro && (
        <div ref={mainRef}>
          <Spotlight />
          <div className="grain" aria-hidden="true" />
          <ScrollProgress />
          <Navigation active={active} onNavigate={navigate} />

          <main>
            <Hero onNavigate={navigate} />
            <Marquee />
            <About />
            <Experience />
            <AIInnovation />
            <Skills />
            <Impact />
            <Education />
            <Contact />
          </main>
        </div>
      )}
    </>
  )
}
