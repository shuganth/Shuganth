'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence, useSpring, useMotionValue } from 'framer-motion'

// Smooth scroll wrapper for Apple-like liquid feel
const useSmoothScroll = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])
}

// Apple-style parallax wrapper
const ParallaxSection = ({ children, speed = 0.5, className = '' }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed])
  const smoothY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <motion.div ref={ref} style={{ y: smoothY }} className={className}>
      {children}
    </motion.div>
  )
}

// Apple-style text reveal that scales and fades
const TextReveal = ({ children, className = '' }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.3']
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const y = useTransform(scrollYProgress, [0, 1], [60, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1])

  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 })
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      ref={ref}
      style={{ opacity: smoothOpacity, y: smoothY, scale: smoothScale }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Smooth slide in from direction
const SlideIn = ({ children, direction = 'left', delay = 0, className = '' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const xInitial = direction === 'left' ? -100 : direction === 'right' ? 100 : 0
  const yInitial = direction === 'up' ? 100 : direction === 'down' ? -100 : 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: xInitial, y: yInitial }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: xInitial, y: yInitial }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] // Apple's easing curve
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Staggered children reveal
const StaggerContainer = ({ children, className = '', staggerDelay = 0.1 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const StaggerItem = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Preloader Component
const Preloader = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      onComplete()
    }, 2000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="preloader"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.div
            className="preloader-logo font-display"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            SA
          </motion.div>
          <div className="preloader-bar">
            <div className="preloader-progress" />
          </div>
          <motion.p
            className="text-mercury text-sm font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading experience...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Custom Cursor Component
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    const handleHoverStart = () => setIsHovering(true)
    const handleHoverEnd = () => setIsHovering(false)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .magnetic-btn, .project-card')
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleHoverStart)
      el.addEventListener('mouseleave', handleHoverEnd)
    })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart)
        el.removeEventListener('mouseleave', handleHoverEnd)
      })
    }
  }, [])

  return (
    <>
      <div
        className={`custom-cursor hidden lg:block ${isHovering ? 'hover' : ''}`}
        style={{
          left: position.x,
          top: position.y,
          opacity: isVisible ? 1 : 0,
        }}
      />
      <div
        className="cursor-dot hidden lg:block"
        style={{
          left: position.x,
          top: position.y,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  )
}

// Scroll Progress Indicator
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = (window.scrollY / totalHeight) * 100
      setProgress(scrollProgress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return <div className="scroll-progress" style={{ width: `${progress}%` }} />
}

// Social Sidebar Component
const SocialSidebar = () => {
  return (
    <motion.div
      className="social-sidebar"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1.5 }}
    >
      <a href="https://github.com/suganthan" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      </a>
      <a href="https://www.linkedin.com/in/suganthan-arulvelan-a9356073/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </a>
      <a href="https://twitter.com/suganthan" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>
    </motion.div>
  )
}

// Email Sidebar Component
const EmailSidebar = () => {
  return (
    <motion.div
      className="email-sidebar"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1.5 }}
    >
      <a href="mailto:suganthan94@yahoo.com" className="font-body">
        suganthan94@yahoo.com
      </a>
    </motion.div>
  )
}

// Back to Top Button
const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.button
      className={`back-to-top ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Back to top"
    >
      <svg className="w-6 h-6 text-void" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </motion.button>
  )
}

// Typing Animation Component
const TypingAnimation = ({ words, className }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const word = words[currentWordIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < word.length) {
          setCurrentText(word.slice(0, currentText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(word.slice(0, currentText.length - 1))
        } else {
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentWordIndex, words])

  return (
    <span className={className}>
      {currentText}
      <span className="typing-text">&nbsp;</span>
    </span>
  )
}

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    const numValue = parseInt(value.replace(/[^0-9]/g, ''))
    const increment = numValue / (duration / 16)
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= numValue) {
        setCount(numValue)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isInView, value, duration])

  const prefix = value.match(/^[^0-9]*/)?.[0] || ''
  const originalSuffix = value.match(/[^0-9]*$/)?.[0] || ''

  return (
    <span ref={ref} className="counter">
      {prefix}{count}{originalSuffix}{suffix}
    </span>
  )
}

// Text Scramble Effect Component
const TextScramble = ({ text, className }) => {
  const [displayText, setDisplayText] = useState('')
  const chars = '!<>-_\\/[]{}—=+*^?#________'

  useEffect(() => {
    let iteration = 0
    const interval = setInterval(() => {
      setDisplayText(
        text.split('').map((char, index) => {
          if (index < iteration) return text[index]
          return chars[Math.floor(Math.random() * chars.length)]
        }).join('')
      )

      if (iteration >= text.length) {
        clearInterval(interval)
      }
      iteration += 1 / 3
    }, 30)

    return () => clearInterval(interval)
  }, [text])

  return <span className={className}>{displayText}</span>
}

// Subtle Cursor Glow Effect (removed trail dots)
const MouseGlow = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      className="fixed pointer-events-none z-0 hidden lg:block"
      style={{
        left: position.x,
        top: position.y,
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(255, 77, 0, 0.08) 0%, transparent 60%)',
        transform: 'translate(-50%, -50%)',
        transition: 'left 0.1s ease-out, top 0.1s ease-out',
      }}
    />
  )
}

// Interactive 3D Tilt Card Component
const Tilt3DCard = ({ children, className = '' }) => {
  const cardRef = useRef(null)
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 })

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10
    setTransform({ rotateX, rotateY })
  }

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 })
  }

  return (
    <div
      ref={cardRef}
      className={`${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
        transition: 'transform 0.1s ease-out',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  )
}

// Interactive Particle Constellation
const ParticleConstellation = () => {
  const canvasRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []
    let mouse = { x: null, y: null, radius: 150 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setDimensions({ width: canvas.width, height: canvas.height })
    }

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.radius = Math.random() * 2 + 1
      }

      update() {
        // Mouse interaction
        if (mouse.x && mouse.y) {
          const dx = mouse.x - this.x
          const dy = mouse.y - this.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius
            this.vx -= (dx / dist) * force * 0.5
            this.vy -= (dy / dist) * force * 0.5
          }
        }

        this.x += this.vx
        this.y += this.vy

        // Boundaries
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1

        // Damping
        this.vx *= 0.99
        this.vy *= 0.99
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 77, 0, 0.8)'
        ctx.fill()
      }
    }

    const init = () => {
      particles = []
      const numParticles = Math.min(100, (canvas.width * canvas.height) / 15000)
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle())
      }
    }

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(255, 77, 0, ${0.3 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.update()
        p.draw()
      })

      drawConnections()
      animationId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouse.x = null
      mouse.y = null
    }

    resize()
    init()
    animate()

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}

// Magnetic Element Component
const MagneticElement = ({ children, className = '', strength = 0.3 }) => {
  const ref = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const x = (e.clientX - centerX) * strength
    const y = (e.clientY - centerY) * strength
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.div>
  )
}

// Glowing Orbs Background
const GlowingOrbs = () => {
  const orbs = [
    { size: 300, color: 'rgba(255, 77, 0, 0.15)', top: '10%', left: '10%', delay: 0 },
    { size: 400, color: 'rgba(255, 215, 0, 0.1)', top: '60%', right: '5%', delay: 2 },
    { size: 250, color: 'rgba(255, 77, 0, 0.12)', bottom: '20%', left: '30%', delay: 4 },
    { size: 350, color: 'rgba(255, 0, 255, 0.08)', top: '30%', right: '20%', delay: 1 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="glowing-orb"
          style={{
            width: orb.size,
            height: orb.size,
            background: orb.color,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Letter by Letter Text Reveal
const LetterReveal = ({ text, className = '', delay = 0 }) => {
  return (
    <span className={className}>
      {text.split('').map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: 'inline-block' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  )
}

// Reveal on Scroll Component
const RevealOnScroll = ({ children, className = '', direction = 'up' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
      x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
    },
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Profile Image Component with Fallback
const ProfileImage = () => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <>
      {!imageError && (
        <img
          src="/profile.jpg"
          alt="Suganthan Arulvelan"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}
      {(imageError || !imageLoaded) && (
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${imageLoaded && !imageError ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-center">
            <motion.div
              className="text-8xl md:text-9xl font-display font-black gradient-text mb-4"
              animate={{
                textShadow: [
                  '0 0 20px rgba(255, 77, 0, 0.5)',
                  '0 0 40px rgba(255, 77, 0, 0.8)',
                  '0 0 20px rgba(255, 77, 0, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              SA
            </motion.div>
            <motion.div
              className="px-6 py-2 bg-ember/10 rounded-full border border-ember/30"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="font-body text-ember text-sm">Technical Leader</span>
            </motion.div>
          </div>
        </div>
      )}
    </>
  )
}

// Enhanced Floating Particles
const EnhancedParticles = () => {
  const particles = [...Array(30)].map((_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: Math.random() * 10 + 10,
    color: Math.random() > 0.5 ? 'var(--ember)' : 'var(--gold)',
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle-enhanced"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            background: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
        />
      ))}
    </div>
  )
}

// Navigation Component
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = ['About', 'Experience', 'Projects', 'Skills', 'Contact']

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-void/90 backdrop-blur-xl border-b border-ember/10' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <motion.a
          href="#"
          className="text-2xl font-display font-bold gradient-text"
          whileHover={{ scale: 1.05 }}
        >
          SA
        </motion.a>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative text-sm font-body text-mercury hover:text-platinum transition-colors group"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
            >
              <span className="glitch" data-text={item}>{item}</span>
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-ember group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
        </div>
        <a
          href="#contact"
          className="px-4 sm:px-6 py-2 bg-ember text-void font-body text-sm font-bold rounded-full hover:bg-ember/90 transition-colors"
        >
          Let's Talk
        </a>
      </div>
    </motion.nav>
  )
}

// Hero Section with Apple-style animations
const HeroSection = () => {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  })

  // Parallax and fade effects as user scrolls
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  const smoothOpacity = useSpring(heroOpacity, { stiffness: 100, damping: 30 })
  const smoothScale = useSpring(heroScale, { stiffness: 100, damping: 30 })
  const smoothY = useSpring(heroY, { stiffness: 100, damping: 30 })

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle gradient background with parallax */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-void via-obsidian to-void"
        style={{ scale: useTransform(scrollYProgress, [0, 1], [1, 1.1]) }}
      />
      <div className="absolute inset-0 grid-bg opacity-20" />

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center py-20"
        style={{ opacity: smoothOpacity, scale: smoothScale, y: smoothY }}
      >
        {/* Status Badge - Smooth fade in */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-ember/30 bg-ember/5"
        >
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-body text-mercury">Available for Strategic Projects</span>
        </motion.div>

        {/* Main Title - Liquid letter animation */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-black leading-tight mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            className="block text-platinum"
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            SUGANTHAN
          </motion.span>
          <motion.span
            className="block gradient-text"
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            ARULVELAN
          </motion.span>
        </motion.h1>

        {/* Subtitle - Staggered reveal */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.span
            className="px-3 sm:px-4 py-2 bg-obsidian rounded-lg font-body text-ember border border-ember/20 text-sm sm:text-base"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            Associate Director
          </motion.span>
          <motion.span
            className="text-mercury hidden sm:inline"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.0 }}
          >
            @
          </motion.span>
          <motion.span
            className="px-3 sm:px-4 py-2 bg-obsidian rounded-lg font-body text-platinum border border-platinum/20 text-sm sm:text-base"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            Syneos Health
          </motion.span>
        </motion.div>

        {/* Interactive Code Block - Unique Element */}
        <motion.div
          className="max-w-xl mx-auto mb-8 rounded-xl overflow-hidden border border-platinum/10 bg-obsidian/80 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Code header */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-platinum/10 bg-smoke/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs font-body text-mercury ml-2">suganthan.ts</span>
          </div>
          {/* Code content */}
          <div className="p-4 font-mono text-sm text-left">
            <div className="text-mercury/60">// Building the future of healthcare tech</div>
            <div className="mt-2">
              <span className="text-purple-400">const</span>{' '}
              <span className="text-ember">suganthan</span>{' '}
              <span className="text-platinum">=</span>{' '}
              <span className="text-platinum">{'{'}</span>
            </div>
            <div className="ml-4">
              <span className="text-blue-400">role</span>
              <span className="text-platinum">:</span>{' '}
              <span className="text-green-400">"Associate Director"</span>
              <span className="text-platinum">,</span>
            </div>
            <div className="ml-4">
              <span className="text-blue-400">passion</span>
              <span className="text-platinum">:</span>{' '}
              <span className="text-platinum">[</span>
              <span className="text-green-400">"</span>
              <TypingAnimation
                words={['scalable platforms', 'AI integration', 'clean architecture', 'zero downtime']}
                className="text-green-400"
              />
              <span className="text-green-400">"</span>
              <span className="text-platinum">]</span>
              <span className="text-platinum">,</span>
            </div>
            <div className="ml-4">
              <span className="text-blue-400">impact</span>
              <span className="text-platinum">:</span>{' '}
              <span className="text-gold">1600</span>
              <span className="text-platinum">% </span>
              <span className="text-mercury/60">// user growth</span>
            </div>
            <div className="text-platinum">{'}'}</div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          className="max-w-2xl mx-auto text-lg text-mercury font-body leading-relaxed mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p>Engineering leader transforming healthcare through technology.</p>
        </motion.div>

        {/* CTA Buttons - Liquid hover effects */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.a
            href="#projects"
            className="px-6 sm:px-8 py-3 sm:py-4 bg-ember text-void font-body font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 77, 0, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            View My Work
            <motion.svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
          </motion.a>
          <motion.a
            href="/Suganthan_Arulvelan_Resume.html"
            target="_blank"
            className="px-6 sm:px-8 py-3 sm:py-4 border border-platinum/30 text-platinum font-body font-bold rounded-lg text-center"
            whileHover={{ scale: 1.05, borderColor: 'rgb(255, 77, 0)', color: 'rgb(255, 77, 0)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            View Resume
          </motion.a>
        </motion.div>

        {/* Scroll Indicator - Smooth breathing */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-mercury/30 flex justify-center pt-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              className="w-1.5 h-3 bg-ember rounded-full"
              animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

// Simplified SA Brand Section - Clean and elegant
const SABrandSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-32 relative overflow-hidden bg-void">
      {/* Subtle background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(255, 77, 0, 0.4) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center">
          {/* Large SA with smooth animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <h2 className="text-[25vw] md:text-[20vw] lg:text-[15vw] font-display font-black leading-none tracking-tighter">
              <span className="bg-gradient-to-r from-ember via-gold to-ember bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                SA
              </span>
            </h2>
          </motion.div>

          {/* Name reveal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h3 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-platinum mb-2">
              SUGANTHAN ARULVELAN
            </h3>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-lg md:text-xl font-body text-mercury mt-4">
              Engineering Excellence. <span className="text-ember font-bold">Delivered.</span>
            </p>
          </motion.div>

          {/* Decorative line */}
          <motion.div
            className="flex items-center justify-center gap-4 mt-8"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-ember" />
            <div className="w-2 h-2 rounded-full bg-ember" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-ember" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Stats Section with smooth counter animations
const StatsSection = () => {
  const stats = [
    { value: '7+', label: 'Years Experience' },
    { value: '20+', label: 'Engineers Led' },
    { value: '1600%', label: 'User Growth' },
    { value: '99.9%', label: 'Uptime' },
  ]

  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-obsidian relative overflow-hidden">
      <motion.div style={{ y: smoothY }} className="max-w-7xl mx-auto px-4 sm:px-6">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8" staggerDelay={0.15}>
          {stats.map((stat, i) => (
            <StaggerItem key={stat.label}>
              <motion.div
                className="text-center p-4 sm:p-6 relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-ember/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-ember mb-2">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-xs sm:text-sm font-body text-mercury">{stat.label}</div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </motion.div>
    </section>
  )
}

// About Section with parallax effects
const AboutSection = () => {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  // Parallax for image - moves slower
  const imageY = useTransform(scrollYProgress, [0, 1], [80, -80])
  const smoothImageY = useSpring(imageY, { stiffness: 100, damping: 30 })

  // Parallax for content - moves faster
  const contentY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const smoothContentY = useSpring(contentY, { stiffness: 100, damping: 30 })

  // Scale effect for image
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.95])
  const smoothImageScale = useSpring(imageScale, { stiffness: 100, damping: 30 })

  return (
    <section ref={sectionRef} id="about" className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left - Profile Image with parallax */}
          <motion.div
            className="relative order-2 lg:order-1"
            style={{ y: smoothImageY }}
          >
            <SlideIn direction="left">
              <motion.div
                className="relative w-full max-w-sm mx-auto aspect-square"
                style={{ scale: smoothImageScale }}
              >
                {/* Profile Image */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-platinum/20 group">
                  <motion.img
                    src="/profile.jpg"
                    alt="Suganthan Arulvelan"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-transparent" />

                  {/* Hover shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                </div>

                {/* Floating accent border with animation */}
                <motion.div
                  className="absolute -inset-2 border border-ember/20 rounded-2xl -z-10"
                  animate={{ rotate: [0, 1, 0, -1, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Background glow */}
                <div className="absolute -inset-8 bg-ember/5 rounded-full blur-3xl -z-20" />
              </motion.div>
            </SlideIn>
          </motion.div>

          {/* Right - Content with text reveals */}
          <motion.div
            className="order-1 lg:order-2"
            style={{ y: smoothContentY }}
          >
            <TextReveal>
              <div className="font-body text-ember text-sm mb-4 tracking-widest">ABOUT ME</div>
            </TextReveal>
            <TextReveal>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-6">
                Engineering the <span className="gradient-text">Future of Healthcare</span>
              </h2>
            </TextReveal>
            <TextReveal>
              <div className="space-y-4 text-mercury font-body leading-relaxed text-sm sm:text-base">
                <p>
                  From programming microcontrollers to leading enterprise platform teams—my journey
                  has been about solving progressively harder problems. As Associate Director at
                  Syneos Health, I lead 20+ engineers building healthcare analytics platforms used
                  by pharmaceutical companies worldwide.
                </p>
                <p>
                  Our work sits at the intersection of complex medical data, enterprise architecture,
                  and emerging AI capabilities. I care deeply about craft—clean architecture, proper
                  abstractions, systems that don't break at 2 AM.
                </p>
              </div>
            </TextReveal>

            {/* Key Highlights with stagger */}
            <StaggerContainer className="mt-8 grid grid-cols-2 gap-3 sm:gap-4" staggerDelay={0.1}>
              {[
                { label: 'Leadership', value: 'Team of 20+' },
                { label: 'Domain', value: 'Healthcare Analytics' },
                { label: 'Location', value: 'Salem, India' },
                { label: 'Focus', value: 'AI & Architecture' },
              ].map((item) => (
                <StaggerItem key={item.label}>
                  <motion.div
                    className="p-3 sm:p-4 bg-obsidian rounded-xl border border-platinum/10 group cursor-default"
                    whileHover={{ scale: 1.02, borderColor: 'rgba(255, 77, 0, 0.3)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <div className="text-xs font-body text-mercury mb-1 group-hover:text-ember transition-colors">{item.label}</div>
                    <div className="font-body text-platinum text-sm sm:text-base">{item.value}</div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Tech Stack Code Showcase - Interactive Code Snippets
const TechShowcaseSection = () => {
  const [activeTab, setActiveTab] = useState(0)

  const codeSnippets = [
    {
      name: 'Kubernetes',
      file: 'precision-targeting.yaml',
      icon: '☸️',
      color: 'text-blue-400',
      code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: precision-targeting
  labels:
    app: healthcare-analytics
    engineer: suganthan
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0  # Zero downtime
  template:
    spec:
      containers:
      - name: analytics-engine
        image: syneos/precision:latest
        resources:
          limits:
            memory: "2Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
          initialDelaySeconds: 30`
    },
    {
      name: 'C# .NET',
      file: 'AnalyticsService.cs',
      icon: '💜',
      color: 'text-purple-400',
      code: `public class AnalyticsService : IAnalyticsService
{
    private readonly ISnowflakeClient _snowflake;
    private readonly IOpenAIClient _openAI;

    public async Task<AnalyticsResult> ProcessAsync(
        AnalyticsRequest request)
    {
        // Suganthan's architecture pattern
        await using var scope = _logger
            .BeginScope("Request: {Id}", request.Id);

        var data = await _snowflake
            .QueryAsync<HcpData>(request.Query);

        // GPT-4o integration for medical terms
        var enriched = await _openAI
            .EnrichMedicalTermsAsync(data);

        return new AnalyticsResult
        {
            Data = enriched,
            ProcessedAt = DateTime.UtcNow,
            Uptime = "99.9%"  // Always
        };
    }
}`
    },
    {
      name: 'SQL',
      file: 'precision_query.sql',
      icon: '🗄️',
      color: 'text-yellow-400',
      code: `-- Precision Targeting Analytics Query
-- Author: Suganthan Arulvelan
-- Performance: Optimized for 1M+ records

WITH hcp_segments AS (
    SELECT
        hcp.physician_id,
        hcp.specialty,
        hcp.prescribing_volume,
        RANK() OVER (
            PARTITION BY hcp.region
            ORDER BY hcp.engagement_score DESC
        ) as rank
    FROM healthcare_providers hcp
    WHERE hcp.active = TRUE
),
engagement_metrics AS (
    SELECT
        physician_id,
        COUNT(*) as total_interactions,
        AVG(response_time) as avg_response
    FROM interactions
    GROUP BY physician_id
)
SELECT
    s.physician_id,
    s.specialty,
    m.total_interactions,
    -- 1600% user growth achieved
    CASE WHEN s.rank <= 10 THEN 'Priority'
         ELSE 'Standard' END as tier
FROM hcp_segments s
JOIN engagement_metrics m USING (physician_id);`
    },
    {
      name: 'Svelte',
      file: 'Dashboard.svelte',
      icon: '🔥',
      color: 'text-orange-400',
      code: `<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { analytics } from '$lib/stores';

  // Real-time dashboard by Suganthan
  let metrics: DashboardMetrics;
  let loading = true;

  onMount(async () => {
    metrics = await analytics.fetchMetrics();
    loading = false;
  });

  $: growth = metrics?.userGrowth ?? 0;
  $: uptime = metrics?.uptime ?? '99.9%';
</script>

<div class="dashboard" in:fade>
  {#if loading}
    <Skeleton />
  {:else}
    <MetricCard
      label="User Growth"
      value="{growth}%"
      trend="up"
    />
    <MetricCard
      label="Uptime"
      value={uptime}
      status="healthy"
    />
    <!-- Zero production incidents -->
  {/if}
</div>`
    },
    {
      name: 'Azure',
      file: 'infrastructure.bicep',
      icon: '☁️',
      color: 'text-cyan-400',
      code: `// Azure Infrastructure as Code
// Architect: Suganthan Arulvelan

@description('AKS Cluster for Healthcare Platform')
resource aksCluster 'Microsoft.ContainerService/
    managedClusters@2023-01-01' = {
  name: 'aks-precision-targeting'
  location: resourceGroup().location
  properties: {
    kubernetesVersion: '1.28'
    dnsPrefix: 'precision'

    agentPoolProfiles: [{
      name: 'systempool'
      count: 3
      vmSize: 'Standard_D4s_v3'
      mode: 'System'
      enableAutoScaling: true  // KEDA ready
      minCount: 3
      maxCount: 10
    }]

    addonProfiles: {
      azureKeyvaultSecretsProvider: {
        enabled: true  // Secure secrets
      }
    }

    // 99.9% SLA guaranteed
    sku: { tier: 'Standard' }
  }
}`
    }
  ]

  const activeSnippet = codeSnippets[activeTab]

  return (
    <section className="py-24 bg-obsidian relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <TextReveal className="text-center mb-12">
          <div className="font-body text-ember text-sm mb-4 tracking-widest uppercase">Tech Stack in Action</div>
          <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
            Code That <span className="gradient-text">Powers Healthcare</span>
          </h2>
          <p className="text-mercury font-body max-w-2xl mx-auto">
            From Kubernetes orchestration to real-time analytics—here's how I build enterprise systems.
          </p>
        </TextReveal>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {codeSnippets.map((snippet, index) => (
            <motion.button
              key={snippet.name}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 rounded-lg font-body text-sm flex items-center gap-2 transition-all ${
                activeTab === index
                  ? 'bg-ember text-void'
                  : 'bg-smoke border border-platinum/10 text-mercury hover:border-ember/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{snippet.icon}</span>
              <span>{snippet.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Code Display */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-xl overflow-hidden border border-platinum/10 bg-void/80 backdrop-blur-sm shadow-2xl">
            {/* Code header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-platinum/10 bg-smoke/50">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs font-mono text-mercury">{activeSnippet.file}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-lg ${activeSnippet.color}`}>{activeSnippet.icon}</span>
                <span className="text-xs font-body text-ember">{activeSnippet.name}</span>
              </div>
            </div>

            {/* Code content with syntax highlighting simulation */}
            <div className="p-6 overflow-x-auto">
              <pre className="font-mono text-sm leading-relaxed">
                <code>
                  {activeSnippet.code.split('\n').map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02, duration: 0.3 }}
                      className="flex"
                    >
                      <span className="text-mercury/30 w-8 text-right mr-4 select-none">{i + 1}</span>
                      <span className="text-platinum/90">
                        {line
                          .replace(/(\/\/.*|#.*|--.*)/g, '<span class="text-mercury/50">$1</span>')
                          .replace(/(["'`].*?["'`])/g, '<span class="text-green-400">$1</span>')
                          .replace(/\b(const|let|var|function|async|await|return|import|export|from|class|public|private|readonly|interface|type|namespace|using|SELECT|FROM|WHERE|JOIN|ORDER BY|GROUP BY|WITH|AS|CASE|WHEN|THEN|ELSE|END|AND|OR|TRUE|FALSE|NULL)\b/g, '<span class="text-purple-400">$1</span>')
                          .replace(/\b(apiVersion|kind|metadata|spec|name|replicas|template|containers|image|resources|limits|enabled)\b(?=:)/g, '<span class="text-blue-400">$1</span>')
                          .replace(/(@\w+)/g, '<span class="text-yellow-400">$1</span>')
                          .split(/(<span.*?<\/span>)/)
                          .map((part, j) =>
                            part.startsWith('<span')
                              ? <span key={j} dangerouslySetInnerHTML={{ __html: part }} />
                              : part
                          )
                        }
                      </span>
                    </motion.div>
                  ))}
                </code>
              </pre>
            </div>

            {/* Footer with stats */}
            <div className="px-6 py-3 border-t border-platinum/10 bg-smoke/30 flex items-center justify-between">
              <span className="text-xs font-body text-mercury/50">
                Built with precision • Zero production incidents
              </span>
              <div className="flex items-center gap-4">
                <span className="text-xs font-body text-ember">99.9% Uptime</span>
                <span className="text-xs font-body text-green-400">● Live</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tech logos marquee */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-body text-mercury/50 mb-4">Technologies I architect with daily</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['.NET Core', 'Kubernetes', 'Snowflake', 'Azure', 'Svelte', 'OpenAI', 'KEDA', 'Auth0'].map((tech, i) => (
              <motion.span
                key={tech}
                className="px-3 py-1.5 bg-void border border-platinum/10 rounded-full text-xs font-body text-mercury"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ borderColor: 'rgba(255, 77, 0, 0.5)', color: 'rgb(255, 77, 0)' }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Innovation Philosophy Section - Unique to Suganthan
const InnovationSection = () => {
  const philosophies = [
    {
      icon: '🔬',
      title: 'Build, Don\'t Buy',
      description: 'When off-the-shelf solutions don\'t fit, we engineer custom solutions. From rewriting platforms in 30 days to building real-time analytics engines.',
    },
    {
      icon: '🎯',
      title: 'Zero Tolerance for Downtime',
      description: '99.9% uptime isn\'t a metric—it\'s a promise. Every system I architect is designed for resilience, not just functionality.',
    },
    {
      icon: '🧠',
      title: 'AI-First Thinking',
      description: 'Integrating GPT-4o for medical terminology isn\'t futuristic—it\'s current. I bring AI capabilities into production, not just prototypes.',
    },
    {
      icon: '📈',
      title: 'Growth Through Craft',
      description: 'From 1 user to 1600% growth. Clean architecture, proper abstractions, and obsessive attention to user experience drive exponential results.',
    },
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-void via-obsidian/50 to-void" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <TextReveal className="text-center mb-16">
          <div className="font-body text-ember text-sm mb-4 tracking-widest uppercase">My Approach</div>
          <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
            Engineering <span className="gradient-text">Philosophy</span>
          </h2>
          <p className="text-mercury font-body max-w-2xl mx-auto">
            Not just writing code—building systems that scale, evolve, and never break at 2 AM.
          </p>
        </TextReveal>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
          {philosophies.map((item, i) => (
            <StaggerItem key={item.title}>
              <motion.div
                className="relative p-6 bg-smoke/50 rounded-2xl border border-platinum/10 h-full group"
                whileHover={{
                  y: -8,
                  borderColor: 'rgba(255, 77, 0, 0.3)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Icon with glow */}
                <motion.div
                  className="text-4xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  {item.icon}
                </motion.div>

                <h3 className="text-lg font-display font-bold text-platinum mb-3 group-hover:text-ember transition-colors">
                  {item.title}
                </h3>

                <p className="text-mercury font-body text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* Hover accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-ember to-gold rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Unique signature quote */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <blockquote className="text-2xl md:text-3xl font-display font-bold text-platinum/80 italic">
            "Great software isn't just built—it's <span className="text-ember">engineered</span>."
          </blockquote>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="w-12 h-px bg-ember" />
            <span className="font-body text-ember text-sm">Suganthan Arulvelan</span>
            <div className="w-12 h-px bg-ember" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Experience Section
const ExperienceSection = () => {
  const experiences = [
    {
      period: 'Nov 2025 - Present',
      className: 'AssociateDirector',
      role: 'Associate Director',
      company: 'Syneos Health',
      location: 'Salem, Tamil Nadu',
      teamSize: 20,
      uptime: '99.99%',
      growth: '1600%',
      stack: ['Azure Kubernetes', 'AI Integration', 'Enterprise Architecture'],
    },
    {
      period: 'Jul 2024 - Nov 2025',
      className: 'PrincipalEngineer',
      role: 'Principal Engineer',
      company: 'Syneos Health',
      location: 'Salem, Tamil Nadu',
      teamSize: 10,
      uptime: '99.9%',
      migrationDays: 30,
      stack: ['Svelte', '.NET Core', 'Snowflake', 'KEDA'],
    },
    {
      period: 'Jun 2023 - Jun 2024',
      className: 'SeniorFullStackDev',
      role: 'Senior Full Stack Developer',
      company: 'Syneos Health',
      location: 'Salem, Tamil Nadu',
      projects: ['KDB IDE', 'DEI Reports', 'Excel Add-ins'],
      stack: ['WPF', 'Excel-DNA', 'Plotly', 'Syncfusion'],
    },
    {
      period: 'Jul 2018 - Mar 2021',
      className: 'EmbeddedEngineer',
      role: 'Embedded Design Engineer',
      company: 'SUGUS',
      location: 'Salem, Tamil Nadu',
      clients: ['Bosch', 'TVS'],
      stack: ['Embedded C', 'MicroPython', 'Industrial HMI', 'IoT'],
    },
  ]

  return (
    <section id="experience" className="py-32 bg-obsidian relative">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="font-body text-ember text-sm mb-4 tracking-widest">CAREER JOURNEY</div>
          <h2 className="text-4xl md:text-5xl font-display font-black">
            <span className="text-purple-400">class</span> <span className="gradient-text">CareerPath</span> <span className="text-platinum">{'{'}</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 lg:gap-8">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.role + exp.company}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              {/* Code Block Style Card */}
              <div className="bg-void rounded-xl border border-platinum/10 overflow-hidden hover:border-ember/30 transition-colors">
                {/* Code header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-platinum/10 bg-smoke/50">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs font-mono text-mercury ml-2">{exp.className}.cs</span>
                  </div>
                  <span className="text-xs font-mono text-ember">{exp.period}</span>
                </div>

                {/* Code content */}
                <div className="p-4 sm:p-6 font-mono text-sm">
                  <div className="text-mercury/60">// {exp.location}</div>
                  <div className="mt-2">
                    <span className="text-purple-400">public class</span>{' '}
                    <span className="text-green-400">{exp.className}</span>{' '}
                    <span className="text-platinum">: </span>
                    <span className="text-blue-400">IEngineer</span>
                  </div>
                  <div className="text-platinum">{'{'}</div>

                  <div className="ml-4 mt-2">
                    <span className="text-purple-400">public string</span>{' '}
                    <span className="text-blue-400">Role</span>{' '}
                    <span className="text-platinum">{'=> '}</span>
                    <span className="text-green-400">"{exp.role}"</span>
                    <span className="text-platinum">;</span>
                  </div>

                  <div className="ml-4">
                    <span className="text-purple-400">public string</span>{' '}
                    <span className="text-blue-400">Company</span>{' '}
                    <span className="text-platinum">{'=> '}</span>
                    <span className="text-green-400">"{exp.company}"</span>
                    <span className="text-platinum">;</span>
                  </div>

                  {exp.teamSize && (
                    <div className="ml-4">
                      <span className="text-purple-400">public int</span>{' '}
                      <span className="text-blue-400">TeamSize</span>{' '}
                      <span className="text-platinum">{'=> '}</span>
                      <span className="text-gold">{exp.teamSize}</span>
                      <span className="text-platinum">;</span>
                      <span className="text-mercury/60"> // engineers</span>
                    </div>
                  )}

                  {exp.uptime && (
                    <div className="ml-4">
                      <span className="text-purple-400">public string</span>{' '}
                      <span className="text-blue-400">Uptime</span>{' '}
                      <span className="text-platinum">{'=> '}</span>
                      <span className="text-green-400">"{exp.uptime}"</span>
                      <span className="text-platinum">;</span>
                      <span className="text-mercury/60"> // production SLA</span>
                    </div>
                  )}

                  {exp.growth && (
                    <div className="ml-4">
                      <span className="text-purple-400">public string</span>{' '}
                      <span className="text-blue-400">UserGrowth</span>{' '}
                      <span className="text-platinum">{'=> '}</span>
                      <span className="text-green-400">"{exp.growth}"</span>
                      <span className="text-platinum">;</span>
                    </div>
                  )}

                  {exp.migrationDays && (
                    <div className="ml-4">
                      <span className="text-purple-400">public int</span>{' '}
                      <span className="text-blue-400">MigrationDays</span>{' '}
                      <span className="text-platinum">{'=> '}</span>
                      <span className="text-gold">{exp.migrationDays}</span>
                      <span className="text-platinum">;</span>
                      <span className="text-mercury/60"> // Node.js to .NET Core</span>
                    </div>
                  )}

                  {exp.projects && (
                    <div className="ml-4">
                      <span className="text-purple-400">public string[]</span>{' '}
                      <span className="text-blue-400">Projects</span>{' '}
                      <span className="text-platinum">{'=> ['}</span>
                      <span className="text-green-400">"{exp.projects.join('", "')}"</span>
                      <span className="text-platinum">{'];'}</span>
                    </div>
                  )}

                  {exp.clients && (
                    <div className="ml-4">
                      <span className="text-purple-400">public string[]</span>{' '}
                      <span className="text-blue-400">Clients</span>{' '}
                      <span className="text-platinum">{'=> ['}</span>
                      <span className="text-green-400">"{exp.clients.join('", "')}"</span>
                      <span className="text-platinum">{'];'}</span>
                    </div>
                  )}

                  <div className="ml-4 mt-2">
                    <span className="text-purple-400">public string[]</span>{' '}
                    <span className="text-blue-400">Stack</span>{' '}
                    <span className="text-platinum">{'=> new[] {'}</span>
                  </div>
                  <div className="ml-8 flex flex-wrap gap-x-1">
                    {exp.stack.map((tech, idx) => (
                      <span key={tech}>
                        <span className="text-green-400">"{tech}"</span>
                        {idx < exp.stack.length - 1 && <span className="text-platinum">, </span>}
                      </span>
                    ))}
                  </div>
                  <div className="ml-4 text-platinum">{'}; '}</div>

                  <div className="text-platinum mt-2">{'}'}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="text-4xl md:text-5xl font-display font-black text-platinum">{'}'}</span>
        </motion.div>
      </div>
    </section>
  )
}

// Projects Section with Apple-style card animations
const ProjectsSection = () => {
  const projects = [
    {
      title: 'Precision Targeting Platform',
      category: 'Healthcare Analytics',
      description: 'First fully enterprise-standard application built end-to-end by TDC team. Serving 150+ users across Commercial StratOps and Deployment Solutions with zero production incidents.',
      impact: '1600%',
      impactLabel: 'User Growth',
      tech: ['Svelte', '.NET Core', 'Snowflake', 'Auth0'],
      icon: '🎯',
    },
    {
      title: 'KOL Analytics Platform',
      category: 'AI-Powered Analytics',
      description: 'Architected distributed processing for 1-4 hour analytical queries with Kubernetes workers, KEDA autoscaling, and Azure Service Bus event-driven architecture.',
      impact: 'GPT-4o',
      impactLabel: 'AI Integration',
      tech: ['Kubernetes', 'KEDA', 'Azure Service Bus', 'OpenAI'],
      icon: '🤖',
    },
    {
      title: 'AIP Platform Modernization',
      category: 'Enterprise Migration',
      description: 'Rewrote legacy Node.js platform to .NET Core in just 30 days with zero downtime migration. Enabled multi-database support including Snowflake, KDB+, and Databricks.',
      impact: '30%',
      impactLabel: 'Faster Performance',
      tech: ['.NET Core', 'Snowflake', 'KDB+', 'Databricks'],
      icon: '⚡',
    },
    {
      title: 'KDB IDE Desktop App',
      category: 'Developer Tools',
      description: 'Native desktop application integrating spreadsheet functionality, SSH views, and autocomplete. Successfully deployed to production with SSO enabled.',
      impact: '100%',
      impactLabel: 'Enterprise Ready',
      tech: ['.NET Framework', 'WinForms', 'SSH', 'API Integration'],
      icon: '💻',
    },
  ]

  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const smoothBackgroundY = useSpring(backgroundY, { stiffness: 100, damping: 30 })

  return (
    <section ref={sectionRef} id="projects" className="py-32 relative bg-obsidian overflow-hidden">
      <motion.div
        className="absolute inset-0 grid-bg opacity-30"
        style={{ y: smoothBackgroundY }}
      />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <TextReveal className="text-center mb-20">
          <div className="font-body text-ember text-sm mb-4 tracking-widest uppercase">Featured Work</div>
          <h2 className="text-4xl md:text-5xl font-display font-black">
            Projects That <span className="gradient-text">Made Impact</span>
          </h2>
        </TextReveal>

        {/* Project Cards with stagger */}
        <StaggerContainer className="grid md:grid-cols-2 gap-6 lg:gap-8" staggerDelay={0.15}>
          {projects.map((project, i) => (
            <StaggerItem key={project.title}>
              <motion.div
                className="group relative h-full"
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Card with 3D tilt effect on hover */}
                <motion.div
                  className="relative h-full p-8 rounded-2xl bg-void border border-platinum/10 overflow-hidden"
                  whileHover={{
                    borderColor: 'rgba(255, 77, 0, 0.5)',
                    boxShadow: '0 25px 50px -12px rgba(255, 77, 0, 0.15)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Animated gradient overlay on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-ember/10 via-transparent to-gold/10"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  />

                  {/* Top row: Icon + Category */}
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                      <motion.span
                        className="text-3xl"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      >
                        {project.icon}
                      </motion.span>
                      <span className="text-xs font-body text-ember uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-display font-bold text-platinum mb-4 group-hover:text-white transition-colors duration-300 relative z-10">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-mercury font-body text-sm leading-relaxed mb-6 relative z-10">
                    {project.description}
                  </p>

                  {/* Impact Metric with animation */}
                  <div className="flex items-baseline gap-2 mb-6 relative z-10">
                    <motion.span
                      className="text-4xl font-display font-black text-ember"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      {project.impact}
                    </motion.span>
                    <span className="text-sm font-body text-mercury">
                      {project.impactLabel}
                    </span>
                  </div>

                  {/* Tech Stack with stagger animation */}
                  <div className="flex flex-wrap gap-2 relative z-10">
                    {project.tech.map((tech, techIndex) => (
                      <motion.span
                        key={tech}
                        className="px-3 py-1.5 bg-obsidian border border-platinum/20 rounded-lg text-xs font-body text-platinum/80 group-hover:border-ember/30 group-hover:text-platinum transition-all"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: techIndex * 0.05 }}
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 77, 0, 0.1)' }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>

                  {/* Animated bottom accent line */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-ember via-gold to-ember"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </motion.div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

// Skills Section with liquid progress bars
const SkillsSection = () => {
  const skillCategories = [
    {
      title: 'Backend & Cloud',
      skills: [
        { name: '.NET Core', level: 95 },
        { name: 'Azure (AKS, Service Bus)', level: 92 },
        { name: 'Python', level: 85 },
        { name: 'Node.js', level: 80 },
      ],
    },
    {
      title: 'Data & Analytics',
      skills: [
        { name: 'Snowflake', level: 95 },
        { name: 'KDB+', level: 85 },
        { name: 'Databricks', level: 82 },
        { name: 'SQL Server', level: 90 },
      ],
    },
    {
      title: 'Frontend & UI',
      skills: [
        { name: 'Svelte', level: 90 },
        { name: 'WPF / WinForms', level: 88 },
        { name: 'React', level: 82 },
        { name: 'Excel-DNA', level: 85 },
      ],
    },
    {
      title: 'DevOps & Architecture',
      skills: [
        { name: 'Kubernetes / KEDA', level: 90 },
        { name: 'Azure DevOps', level: 92 },
        { name: 'OpenAI Integration', level: 85 },
        { name: 'Auth0', level: 88 },
      ],
    },
  ]

  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const smoothBackgroundY = useSpring(backgroundY, { stiffness: 100, damping: 30 })

  return (
    <section ref={sectionRef} id="skills" className="py-32 bg-obsidian relative overflow-hidden">
      <motion.div className="absolute inset-0 grid-bg opacity-30" style={{ y: smoothBackgroundY }} />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <TextReveal className="text-center mb-16">
          <div className="font-body text-ember text-sm mb-4 tracking-widest">TECHNICAL EXPERTISE</div>
          <h2 className="text-4xl md:text-5xl font-display font-black">
            Skills That <span className="gradient-text">Deliver Results</span>
          </h2>
        </TextReveal>

        <StaggerContainer className="grid md:grid-cols-2 gap-4 sm:gap-6" staggerDelay={0.15}>
          {skillCategories.map((category, catIndex) => (
            <StaggerItem key={category.title}>
              <motion.div
                className="p-5 sm:p-6 bg-smoke rounded-xl border border-platinum/10 h-full"
                whileHover={{ borderColor: 'rgba(255, 77, 0, 0.2)', y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <h3 className="text-lg sm:text-xl font-display font-bold text-platinum mb-4 sm:mb-6">{category.title}</h3>
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: skillIndex * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-body text-mercury text-sm">{skill.name}</span>
                        <motion.span
                          className="font-body text-ember text-sm"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: skillIndex * 0.1 + 0.3 }}
                        >
                          {skill.level}%
                        </motion.span>
                      </div>
                      <div className="h-2 bg-void rounded-full overflow-hidden relative">
                        {/* Background glow */}
                        <motion.div
                          className="absolute inset-0 bg-ember/20 blur-sm"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: skillIndex * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        />
                        {/* Main bar */}
                        <motion.div
                          className="h-full bg-gradient-to-r from-ember to-gold rounded-full relative"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: skillIndex * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                          {/* Shine effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            initial={{ x: '-100%' }}
                            whileInView={{ x: '200%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: skillIndex * 0.1 + 0.5, ease: 'easeOut' }}
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Tech Stack Marquee with smooth hover */}
        <motion.div
          className="mt-16 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="marquee">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex gap-8 mx-4">
                {['.NET', 'Azure', 'React', 'Snowflake', 'Docker', 'Kubernetes', 'TypeScript', 'Python', 'SQL Server', 'Power BI', 'Git', 'CI/CD'].map((tech) => (
                  <motion.span
                    key={tech + setIndex}
                    className="px-6 py-3 bg-void border border-platinum/10 rounded-full font-body text-mercury whitespace-nowrap"
                    whileHover={{
                      scale: 1.1,
                      borderColor: 'rgb(255, 77, 0)',
                      color: 'rgb(255, 77, 0)',
                      boxShadow: '0 0 20px rgba(255, 77, 0, 0.3)'
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Contact Section with smooth animations
const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setFormData({ name: '', email: '', message: '' })
      alert('Message sent successfully!')
    }, 1000)
  }

  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  const backgroundScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])
  const smoothBackgroundScale = useSpring(backgroundScale, { stiffness: 100, damping: 30 })

  return (
    <section ref={sectionRef} id="contact" className="py-32 relative overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{ scale: smoothBackgroundScale }}
      >
        <div className="morph-bg" style={{ top: '-20%', right: '-20%' }} />
      </motion.div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left - Contact as Code */}
          <SlideIn direction="left">
            <div>
              <TextReveal>
                <div className="font-body text-ember text-sm mb-4 tracking-widest">GET IN TOUCH</div>
              </TextReveal>

              {/* Code Block for Contact */}
              <motion.div
                className="bg-void rounded-xl border border-platinum/10 overflow-hidden mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Code header */}
                <div className="flex items-center gap-2 px-4 py-2 border-b border-platinum/10 bg-smoke/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs font-mono text-mercury ml-2">contact.sql</span>
                </div>

                {/* SQL Code content */}
                <div className="p-4 sm:p-6 font-mono text-sm">
                  <div className="text-mercury/60">-- Let's connect and build something great</div>
                  <div className="mt-3">
                    <span className="text-purple-400">SELECT</span>{' '}
                    <span className="text-platinum">*</span>{' '}
                    <span className="text-purple-400">FROM</span>{' '}
                    <span className="text-blue-400">Suganthan</span>
                  </div>
                  <div>
                    <span className="text-purple-400">WHERE</span>{' '}
                    <span className="text-blue-400">Status</span>{' '}
                    <span className="text-platinum">=</span>{' '}
                    <span className="text-green-400">'Open to Opportunities'</span>
                  </div>
                  <div className="mt-4 text-mercury/60">-- Connection endpoints:</div>
                  <div className="mt-2">
                    <span className="text-purple-400">INSERT INTO</span>{' '}
                    <span className="text-blue-400">Contact</span>{' '}
                    <span className="text-platinum">(</span>
                    <span className="text-blue-400">Type</span>
                    <span className="text-platinum">,</span>{' '}
                    <span className="text-blue-400">Value</span>
                    <span className="text-platinum">)</span>
                  </div>
                  <div>
                    <span className="text-purple-400">VALUES</span>
                  </div>

                  {/* Email Row - Clickable */}
                  <motion.a
                    href="mailto:suganthan94@yahoo.com"
                    className="block ml-4 hover:bg-ember/10 -mx-2 px-2 py-1 rounded transition-colors group"
                  >
                    <span className="text-platinum">(</span>
                    <span className="text-green-400">'Email'</span>
                    <span className="text-platinum">,</span>{' '}
                    <span className="text-green-400 group-hover:text-ember transition-colors">'suganthan94@yahoo.com'</span>
                    <span className="text-platinum">),</span>
                  </motion.a>

                  {/* LinkedIn Row - Clickable */}
                  <motion.a
                    href="https://www.linkedin.com/in/suganthan-arulvelan-a9356073/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block ml-4 hover:bg-ember/10 -mx-2 px-2 py-1 rounded transition-colors group"
                  >
                    <span className="text-platinum">(</span>
                    <span className="text-green-400">'LinkedIn'</span>
                    <span className="text-platinum">,</span>{' '}
                    <span className="text-green-400 group-hover:text-ember transition-colors">'linkedin.com/in/suganthan-arulvelan'</span>
                    <span className="text-platinum">),</span>
                  </motion.a>

                  {/* GitHub Row - Clickable */}
                  <motion.a
                    href="https://github.com/shuganth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block ml-4 hover:bg-ember/10 -mx-2 px-2 py-1 rounded transition-colors group"
                  >
                    <span className="text-platinum">(</span>
                    <span className="text-green-400">'GitHub'</span>
                    <span className="text-platinum">,</span>{' '}
                    <span className="text-green-400 group-hover:text-ember transition-colors">'github.com/shuganth'</span>
                    <span className="text-platinum">),</span>
                  </motion.a>

                  {/* Location Row */}
                  <div className="ml-4">
                    <span className="text-platinum">(</span>
                    <span className="text-green-400">'Location'</span>
                    <span className="text-platinum">,</span>{' '}
                    <span className="text-green-400">'Salem, Tamil Nadu, India'</span>
                    <span className="text-platinum">);</span>
                  </div>

                  <div className="mt-4 text-mercury/60">-- Response time: &lt; 24 hours</div>
                  <div className="text-mercury/60">-- Rows affected: 1 new connection</div>
                </div>
              </motion.div>

              <TextReveal>
                <p className="text-mercury font-body leading-relaxed text-sm">
                  Whether you're looking for technical leadership, architecture consulting,
                  or want to discuss the future of healthcare technology—execute that query.
                </p>
              </TextReveal>
            </div>
          </SlideIn>

          {/* Right - Form with smooth animations */}
          <SlideIn direction="right" delay={0.2}>
            <motion.form
              onSubmit={handleSubmit}
              className="bg-obsidian p-6 sm:p-8 rounded-2xl border border-platinum/10"
              whileHover={{ borderColor: 'rgba(255, 77, 0, 0.2)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                {['name', 'email', 'message'].map((field, index) => (
                  <motion.div
                    key={field}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <label className="block text-sm font-body text-mercury mb-2 capitalize">{field}</label>
                    {field === 'message' ? (
                      <motion.textarea
                        required
                        rows={5}
                        value={formData[field]}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        className="w-full px-4 py-3 bg-void border border-platinum/20 rounded-xl font-body text-platinum focus:border-ember focus:outline-none transition-all resize-none"
                        placeholder="What challenge can we solve together?"
                        whileFocus={{ borderColor: 'rgb(255, 77, 0)', boxShadow: '0 0 20px rgba(255, 77, 0, 0.1)' }}
                      />
                    ) : (
                      <motion.input
                        type={field === 'email' ? 'email' : 'text'}
                        required
                        value={formData[field]}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        className="w-full px-4 py-3 bg-void border border-platinum/20 rounded-xl font-body text-platinum focus:border-ember focus:outline-none transition-all"
                        placeholder={field === 'email' ? 'you@company.com' : 'Your name'}
                        whileFocus={{ borderColor: 'rgb(255, 77, 0)', boxShadow: '0 0 20px rgba(255, 77, 0, 0.1)' }}
                      />
                    )}
                  </motion.div>
                ))}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 sm:py-4 bg-ember text-void font-body font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                  whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(255, 77, 0, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {isSubmitting ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-void border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    <>
                      Send Message
                      <motion.svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </motion.svg>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          </SlideIn>
        </div>
      </div>
    </section>
  )
}

// Footer
const Footer = () => {
  return (
    <footer className="py-8 border-t border-platinum/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-body text-mercury text-sm">
            © {new Date().getFullYear()} Suganthan Arulvelan. Crafted with precision.
          </div>
          <div className="flex items-center gap-6">
            <a href="https://www.linkedin.com/in/suganthan-arulvelan-a9356073/" target="_blank" rel="noopener noreferrer" className="text-mercury hover:text-ember transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a href="https://github.com/shuganth" target="_blank" rel="noopener noreferrer" className="text-mercury hover:text-ember transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a href="mailto:suganthan94@yahoo.com" className="text-mercury hover:text-ember transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main Page Component with smooth scrolling
export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  // Enable smooth scroll behavior
  useSmoothScroll()

  return (
    <>
      <Preloader onComplete={() => setIsLoaded(true)} />
      <ScrollProgress />

      {/* Desktop only - subtle cursor */}
      <div className="hidden lg:block">
        <CustomCursor />
      </div>

      {isLoaded && (
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <SocialSidebar />
          <EmailSidebar />
        </motion.div>
      )}

      <main className="relative overflow-x-hidden">
        <Navigation />
        <HeroSection />
        <SABrandSection />
        <StatsSection />
        <AboutSection />
        <TechShowcaseSection />
        <InnovationSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
        <Footer />
      </main>

      <BackToTop />
    </>
  )
}
