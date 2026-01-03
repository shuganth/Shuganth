'use client'

import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ============ PRELOADER ============
const Preloader = ({ onComplete }) => {
  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => setTimeout(onComplete, 200)
    })

    tl.fromTo('.preload-letter',
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out' }
    )
    .to('.preload-letter', {
      y: -100,
      opacity: 0,
      stagger: 0.05,
      duration: 0.4,
      ease: 'power3.in',
      delay: 0.5
    })
    .to('.preload-bar', {
      scaleX: 1,
      duration: 1.5,
      ease: 'power2.inOut'
    }, 0)
    .to('.preloader', {
      yPercent: -100,
      duration: 0.8,
      ease: 'power4.inOut'
    })

    return () => tl.kill()
  }, [onComplete])

  return (
    <div className="preloader fixed inset-0 z-[100] bg-void flex flex-col items-center justify-center">
      <div className="flex overflow-hidden">
        {'SUGANTHAN'.split('').map((letter, i) => (
          <span
            key={i}
            className="preload-letter text-4xl md:text-6xl font-display gradient-text"
          >
            {letter}
          </span>
        ))}
      </div>
      <div className="mt-8 w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
        <div className="preload-bar h-full w-full origin-left scale-x-0 bg-gradient-to-r from-ember to-gold rounded-full" />
      </div>
    </div>
  )
}

// ============ NAVIGATION ============
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    gsap.to(window, {
      scrollTo: { y: `#${id}`, offsetY: 80 },
      duration: 1.2,
      ease: 'power3.inOut'
    })
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500 ${
        scrolled ? 'glass-dark' : ''
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 2.5, duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-2xl font-display gradient-text"
        >
          SA
        </button>

        <div className="hidden md:flex items-center gap-8">
          {['about', 'experience', 'skills', 'contact'].map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item)}
              className="text-sm text-silver hover:text-white transition-colors capitalize"
            >
              {item}
            </button>
          ))}
        </div>

        <a
          href="#contact"
          className="px-6 py-2 rounded-full gradient-ember text-void font-semibold text-sm hover:scale-105 transition-transform"
        >
          Connect
        </a>
      </div>
    </motion.nav>
  )
}

// ============ SA HERO WITH GSAP SCROLL SPLIT ============
const SAHero = () => {
  const sectionRef = useRef(null)
  const letterSRef = useRef(null)
  const letterARef = useRef(null)
  const contentRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  })

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Initial SA animation
      const introTl = gsap.timeline({ delay: 2.2 })

      introTl
        .fromTo([letterSRef.current, letterARef.current],
          { scale: 0, rotation: -180, opacity: 0 },
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: 'elastic.out(1, 0.5)'
          }
        )
        .fromTo(contentRef.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.4'
        )

      // Scroll-triggered SA split animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress

          // S letter moves to top-left
          gsap.to(letterSRef.current, {
            x: -window.innerWidth * 0.3 * progress,
            y: -window.innerHeight * 0.25 * progress,
            scale: 1 - progress * 0.6,
            opacity: 1 - progress * 0.8,
            rotation: -30 * progress,
            duration: 0.1
          })

          // A letter moves to bottom-right
          gsap.to(letterARef.current, {
            x: window.innerWidth * 0.3 * progress,
            y: window.innerHeight * 0.25 * progress,
            scale: 1 - progress * 0.6,
            opacity: 1 - progress * 0.8,
            rotation: 30 * progress,
            duration: 0.1
          })

          // Content fades
          gsap.to(contentRef.current, {
            opacity: 1 - progress * 2,
            y: -100 * progress,
            duration: 0.1
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="h-screen relative bg-void overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ember/10 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,77,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.3) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}
      />

      {/* SA Letters Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center">
          <span
            ref={letterSRef}
            className="sa-letter sa-letter-s text-[30vw] md:text-[25vw] select-none"
            style={{ transformOrigin: 'center' }}
          >
            S
          </span>
          <span
            ref={letterARef}
            className="sa-letter sa-letter-a text-[30vw] md:text-[25vw] select-none"
            style={{ transformOrigin: 'center' }}
          >
            A
          </span>
        </div>
      </div>

      {/* Content below SA */}
      <div ref={contentRef} className="absolute inset-0 flex items-center justify-center pt-[35vh]">
        <div className="text-center px-6 max-w-4xl">
          <h1 className="text-2xl md:text-4xl font-display text-white mb-4">
            SUGANTHAN <span className="gradient-text">ARULVELAN</span>
          </h1>
          <p className="text-lg md:text-xl text-silver mb-8">
            Associate Director • Software Architect • Engineering Leader
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm">
            {[
              { value: '7+', label: 'Years' },
              { value: '0', label: 'Incidents' },
              { value: '99.9%', label: 'Uptime' },
              { value: '20+', label: 'Engineers' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-display gradient-text">{stat.value}</div>
                <div className="text-silver text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 border-2 border-silver/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-1.5 bg-ember rounded-full animate-bounce" />
        </div>
      </motion.div>
    </section>
  )
}

// ============ ABOUT SECTION (CODE STYLE) ============
const AboutSection = () => {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      gsap.fromTo('.about-code',
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-code',
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Stagger code lines
      gsap.fromTo('.code-line',
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.about-code',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="py-32 px-6 bg-obsidian relative">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-ember/5 to-transparent" />

      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <motion.span
              className="text-ember font-mono text-sm tracking-widest"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              // ABOUT
            </motion.span>
            <motion.h2
              className="text-4xl md:text-5xl font-display text-white mt-4 mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Building the <span className="gradient-text">Future</span>
            </motion.h2>
            <motion.p
              className="text-silver text-lg leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              7+ years crafting enterprise systems with zero production incidents.
              From embedded systems to cloud architecture, I build what others
              say can&apos;t be done.
            </motion.p>
          </div>

          {/* Right: Code Block */}
          <div className="about-code code-window">
            <div className="code-header">
              <div className="code-dot red" />
              <div className="code-dot yellow" />
              <div className="code-dot green" />
              <span className="ml-3 text-silver text-xs font-mono">suganthan.ts</span>
            </div>
            <div className="code-content">
              <div className="code-line"><span className="syntax-comment">// Building the future of healthcare tech</span></div>
              <div className="code-line mt-3">
                <span className="syntax-keyword">const</span>{' '}
                <span className="syntax-property">suganthan</span>{' '}
                <span className="syntax-operator">=</span> {'{'}
              </div>
              <div className="code-line ml-4">
                <span className="syntax-property">role</span>:{' '}
                <span className="syntax-string">&quot;Associate Director&quot;</span>,
              </div>
              <div className="code-line ml-4">
                <span className="syntax-property">company</span>:{' '}
                <span className="syntax-string">&quot;Syneos Health&quot;</span>,
              </div>
              <div className="code-line ml-4">
                <span className="syntax-property">teamSize</span>:{' '}
                <span className="syntax-number">20</span>,
                <span className="syntax-comment"> // engineers</span>
              </div>
              <div className="code-line ml-4">
                <span className="syntax-property">uptime</span>:{' '}
                <span className="syntax-string">&quot;99.99%&quot;</span>,
              </div>
              <div className="code-line ml-4">
                <span className="syntax-property">incidents</span>:{' '}
                <span className="syntax-number">0</span>,
                <span className="syntax-comment"> // production</span>
              </div>
              <div className="code-line ml-4">
                <span className="syntax-property">passion</span>: [
                <span className="syntax-string">&quot;scale&quot;</span>,{' '}
                <span className="syntax-string">&quot;AI&quot;</span>,{' '}
                <span className="syntax-string">&quot;clean code&quot;</span>]
              </div>
              <div className="code-line">{'}'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ EXPERIENCE SECTION ============
const ExperienceSection = () => {
  const sectionRef = useRef(null)
  const experiences = [
    {
      period: '2025 - Present',
      role: 'Associate Director',
      company: 'Syneos Health',
      code: `class AssociateDirector : ILeader {
  TeamSize => 20;
  Growth => "1600%";
  Stack => ["Azure", "K8s", "AI"];
}`
    },
    {
      period: '2024 - 2025',
      role: 'Principal Engineer',
      company: 'Syneos Health',
      code: `class PrincipalEngineer : IArchitect {
  Migration => 30; // days
  Uptime => "99.9%";
  Stack => ["Svelte", ".NET", "KEDA"];
}`
    },
    {
      period: '2023 - 2024',
      role: 'Senior Full Stack',
      company: 'Syneos Health',
      code: `class SeniorDev : IBuilder {
  Projects => ["KDB IDE", "DEI Tool"];
  Stack => ["WPF", "Excel-DNA"];
}`
    },
    {
      period: '2018 - 2021',
      role: 'Embedded Engineer',
      company: 'SUGUS',
      code: `class EmbeddedEngineer : IIoT {
  Clients => ["Bosch", "TVS"];
  Stack => ["C", "Python", "HMI"];
}`
    },
  ]

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.exp-card').forEach((card, i) => {
        gsap.fromTo(card,
          { x: i % 2 === 0 ? -100 : 100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="experience" className="py-32 px-6 bg-void relative">
      {/* Decorative elements */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-1/2 bg-gradient-to-b from-transparent via-ember to-transparent" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            className="text-ember font-mono text-sm tracking-widest"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            // EXPERIENCE
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-display text-white mt-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Career <span className="gradient-text">Journey</span>
          </motion.h2>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, i) => (
            <div key={i} className="exp-card code-window">
              <div className="code-header">
                <div className="code-dot red" />
                <div className="code-dot yellow" />
                <div className="code-dot green" />
                <span className="ml-3 text-silver text-xs font-mono">{exp.role.replace(/\s+/g, '')}.cs</span>
                <span className="ml-auto text-ember text-xs font-mono">{exp.period}</span>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <h3 className="text-xl font-display text-white">{exp.role}</h3>
                    <p className="text-ember">{exp.company}</p>
                  </div>
                  <div className="md:w-2/3">
                    <pre className="font-mono text-sm text-silver leading-relaxed whitespace-pre-wrap">
                      <code dangerouslySetInnerHTML={{
                        __html: exp.code
                          .replace(/(class|public|string|int)/g, '<span class="syntax-keyword">$1</span>')
                          .replace(/(\w+)\s*=>/g, '<span class="syntax-property">$1</span> =>')
                          .replace(/"([^"]*)"/g, '<span class="syntax-string">"$1"</span>')
                          .replace(/(\d+)/g, '<span class="syntax-number">$1</span>')
                          .replace(/\/\/.*/g, '<span class="syntax-comment">$&</span>')
                          .replace(/(:\s*)(I\w+)/g, '$1<span class="syntax-type">$2</span>')
                      }} />
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ SKILLS SECTION ============
const SkillsSection = () => {
  const sectionRef = useRef(null)
  const skills = [
    { category: 'Backend', items: ['.NET Core', 'Python', 'Node.js'], color: 'ember' },
    { category: 'Cloud', items: ['Azure', 'Kubernetes', 'KEDA'], color: 'gold' },
    { category: 'Data', items: ['Snowflake', 'KDB+', 'Databricks'], color: 'cyan' },
    { category: 'Frontend', items: ['Svelte', 'React', 'WPF'], color: 'ember' },
    { category: 'AI/ML', items: ['OpenAI', 'GPT-4o', 'LangChain'], color: 'gold' },
    { category: 'DevOps', items: ['Azure DevOps', 'Docker', 'CI/CD'], color: 'cyan' },
  ]

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      gsap.fromTo('.skill-card',
        { y: 80, opacity: 0, rotateY: 15 },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="skills" className="py-32 px-6 bg-obsidian relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,77,0,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <motion.span
            className="text-gold font-mono text-sm tracking-widest"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            // SKILLS
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-display text-white mt-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Tech <span className="gradient-text">Arsenal</span>
          </motion.h2>
        </div>

        <div className="skills-grid grid grid-cols-2 md:grid-cols-3 gap-6" style={{ perspective: '1000px' }}>
          {skills.map((skill, i) => (
            <div
              key={i}
              className="skill-card glass rounded-2xl p-6 text-center card-hover"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <h3 className={`text-lg font-display text-${skill.color} mb-4`}>{skill.category}</h3>
              <div className="space-y-2">
                {skill.items.map((item, j) => (
                  <div key={j} className="text-silver text-sm">{item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ CONTACT SECTION (SQL STYLE) ============
const ContactSection = () => {
  const sectionRef = useRef(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    await new Promise(r => setTimeout(r, 1500))
    setSending(false)
    setFormData({ name: '', email: '', message: '' })
    alert('Message sent!')
  }

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-block',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact-container',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="contact" className="py-32 px-6 bg-void relative">
      {/* Glow effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-ember/10 rounded-full blur-[200px]" />

      <div className="max-w-5xl mx-auto relative contact-container">
        <div className="text-center mb-16">
          <motion.span
            className="text-cyan font-mono text-sm tracking-widest"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            // CONTACT
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-display text-white mt-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Let&apos;s <span className="gradient-text">Connect</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* SQL Code Block */}
          <div className="contact-block code-window">
            <div className="code-header">
              <div className="code-dot red" />
              <div className="code-dot yellow" />
              <div className="code-dot green" />
              <span className="ml-3 text-silver text-xs font-mono">contact.sql</span>
            </div>
            <div className="code-content">
              <div><span className="syntax-comment">-- Let&apos;s build something great</span></div>
              <div className="mt-3">
                <span className="syntax-keyword">SELECT</span> * <span className="syntax-keyword">FROM</span>{' '}
                <span className="syntax-type">Suganthan</span>
              </div>
              <div>
                <span className="syntax-keyword">WHERE</span>{' '}
                <span className="syntax-property">Status</span> ={' '}
                <span className="syntax-string">&apos;Open&apos;</span>
              </div>
              <div className="mt-4">
                <span className="syntax-keyword">INSERT INTO</span>{' '}
                <span className="syntax-type">Contact</span>
              </div>
              <div><span className="syntax-keyword">VALUES</span></div>
              <a href="mailto:suganthan94@yahoo.com" className="block ml-4 hover:text-ember transition-colors">
                (<span className="syntax-string">&apos;Email&apos;</span>,{' '}
                <span className="syntax-string">&apos;suganthan94@yahoo.com&apos;</span>),
              </a>
              <a href="https://linkedin.com/in/suganthan-arulvelan-a9356073" target="_blank" rel="noopener noreferrer" className="block ml-4 hover:text-ember transition-colors">
                (<span className="syntax-string">&apos;LinkedIn&apos;</span>,{' '}
                <span className="syntax-string">&apos;/suganthan-arulvelan&apos;</span>),
              </a>
              <a href="https://github.com/shuganth" target="_blank" rel="noopener noreferrer" className="block ml-4 hover:text-ember transition-colors">
                (<span className="syntax-string">&apos;GitHub&apos;</span>,{' '}
                <span className="syntax-string">&apos;/shuganth&apos;</span>);
              </a>
              <div className="mt-4">
                <span className="syntax-comment">-- Response: &lt;24 hours</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-block">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-obsidian border border-white/10 rounded-xl text-white placeholder:text-silver focus:border-ember focus:outline-none transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-obsidian border border-white/10 rounded-xl text-white placeholder:text-silver focus:border-ember focus:outline-none transition-colors"
                />
              </div>
              <div>
                <textarea
                  placeholder="Message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-obsidian border border-white/10 rounded-xl text-white placeholder:text-silver focus:border-ember focus:outline-none transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 rounded-xl gradient-ember text-void font-semibold hover:scale-[1.02] transition-transform disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ FOOTER ============
const Footer = () => (
  <footer className="py-12 px-6 bg-obsidian border-t border-white/5">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="text-2xl font-display gradient-text">SA</div>
      <p className="text-silver text-sm">
        &copy; {new Date().getFullYear()} Suganthan Arulvelan. All rights reserved.
      </p>
      <div className="flex gap-6">
        <a href="https://github.com/shuganth" target="_blank" rel="noopener noreferrer" className="text-silver hover:text-ember transition-colors">
          GitHub
        </a>
        <a href="https://linkedin.com/in/suganthan-arulvelan-a9356073" target="_blank" rel="noopener noreferrer" className="text-silver hover:text-ember transition-colors">
          LinkedIn
        </a>
      </div>
    </div>
  </footer>
)

// ============ MAIN COMPONENT ============
export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Register ScrollTo plugin
    gsap.registerPlugin(ScrollTrigger)
    if (gsap.plugins?.scrollTo) {
      gsap.registerPlugin(gsap.plugins.scrollTo)
    }
  }, [])

  return (
    <main className="bg-void text-white min-h-screen">
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          <div className="grain" />
          <Navigation />
          <SAHero />
          <AboutSection />
          <ExperienceSection />
          <SkillsSection />
          <ContactSection />
          <Footer />
        </>
      )}
    </main>
  )
}
