import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useAnimation } from 'framer-motion'
import f1CarImg from '../assets/F1Car.webp'
import globeImg from '../assets/Globe.webp'
import redLightUrl from '../assets/sounds/RedLight.mp3'
import f1CarUrl from '../assets/sounds/F1Car.mp3'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Michroma&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600&display=swap');

  @keyframes wLightOn {
    0%, 100% { opacity: 1; box-shadow: 0 0 30px rgba(0,210,255,0.6), 0 0 60px rgba(0,210,255,0.3); }
    50%       { opacity: 0.85; }
  }
  @keyframes wScanLine {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(400%); }
  }
  @keyframes globeRotateY {
    from { transform: perspective(900px) rotateY(0deg); }
    to   { transform: perspective(900px) rotateY(360deg); }
  }

  .w-light-on {
    animation: wLightOn 2.4s ease-in-out infinite;
  }
  .w-scan {
    animation: wScanLine 4s linear infinite;
  }
  .w-btn {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .w-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 0 45px rgba(0,210,255,0.85), 0 0 80px rgba(0,210,255,0.4) !important;
  }
  .w-btn:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
  .globe-spin {
    animation: globeRotateY 6s linear infinite;
    will-change: transform;
  }
`

// Orbit ellipse semi-axes (px) at full (desktop) size.
const OX = 550
const OY = 212

// Precompute 32 evenly-spaced points on the ellipse for a smooth 360° orbit.
// θ = π → 3π  (starts at leftmost point, goes up/front first, then right, then behind)
const N = 32
const ORBIT = Array.from({ length: N + 1 }, (_, i) => {
  const θ = Math.PI + (2 * Math.PI * i) / N
  const x = OX * Math.cos(θ)
  const y = OY * Math.sin(θ)
  // sin(θ) > 0 means bottom arc → behind globe
  const depth = Math.sin(θ)
  const opacity = depth > 0 ? Math.max(0.18, 1 - depth * 0.88) : 1
  const scale   = depth > 0 ? Math.max(0.70, 1 - depth * 0.32) : Math.min(1.07, 1 - depth * 0.07)
  return { x, y, opacity, scale, t: i / N }
})

export default function WelcomePage() {
  const navigate  = useNavigate()
  const [phase, setPhase]       = useState('idle')   // idle | lighting | orbit | go
  const [lightsOn, setLightsOn] = useState(0)
  const carControls = useAnimation()
  const timerRefs   = useRef([])

  // Measured audio durations (seconds); fallbacks used until metadata loads
  const beepDurRef = useRef(0.12)
  const f1DurRef   = useRef(3.2)
  const f1AudioRef = useRef(null)
  const beepAudioPoolRef = useRef([])

  // Scale the entire orbit scene so globe + car fit the current viewport.
  // Globe natural size is 900px; desktop always uses full size; tablet/mobile scale down.
  const sceneScale = useMemo(() => {
    const w = window.innerWidth
    const h = window.innerHeight
    if (w >= 1024) return 1
    return Math.min(1, (w * 0.9) / 900, (h * 0.9) / 900)
  }, [])

  // Orbit points scaled for the current viewport
  const scaledOrbit = useMemo(
    () => ORBIT.map(f => ({ ...f, x: f.x * sceneScale, y: f.y * sceneScale })),
    [sceneScale]
  )

  useEffect(() => {
    const globePreload = new Image()
    globePreload.src = globeImg

    const carPreload = new Image()
    carPreload.src = f1CarImg

    // Preload the short start-light sound up front. Reusing decoded audio avoids
    // a late first beep on slower browsers/devices.
    const beepMeta = new Audio(redLightUrl)
    beepMeta.preload = 'auto'
    beepMeta.addEventListener('loadedmetadata', () => {
      if (isFinite(beepMeta.duration) && beepMeta.duration > 0)
        beepDurRef.current = beepMeta.duration
    }, { once: true })
    beepMeta.load()

    beepAudioPoolRef.current = Array.from({ length: 5 }, () => {
      const audio = new Audio(redLightUrl)
      audio.preload = 'auto'
      audio.load()
      return audio
    })

    const f1Audio = new Audio(f1CarUrl)
    f1Audio.preload = 'auto'
    f1Audio.addEventListener('loadedmetadata', () => {
      if (isFinite(f1Audio.duration) && f1Audio.duration > 0)
        f1DurRef.current = f1Audio.duration
    }, { once: true })
    f1AudioRef.current = f1Audio

    return () => {
      try {
        if (f1AudioRef.current) {
          f1AudioRef.current.pause()
          f1AudioRef.current.src = ''
        }
        beepAudioPoolRef.current.forEach(audio => {
          audio.pause()
          audio.src = ''
        })
        beepAudioPoolRef.current = []
        timerRefs.current.forEach(clearTimeout)
        timerRefs.current = []
      } catch (_) {}
    }
  }, [])

  const playBeep = index => {
    try {
      const sound = beepAudioPoolRef.current[index % beepAudioPoolRef.current.length] || new Audio(redLightUrl)
      sound.pause()
      sound.currentTime = 0
      sound.play().catch(() => {})
    } catch (_) {}
  }

  const handleStart = async () => {
    if (phase !== 'idle') return
    const dest = localStorage.getItem('userId') ? '/landing' : '/auth'

    setPhase('lighting')

    const beepMs = beepDurRef.current * 1000

    // Light up lamps one by one; each fires exactly one beep-duration after the previous
    for (let i = 1; i <= 5; i++) {
      timerRefs.current.push(
        setTimeout(() => {
          setLightsOn(i)
          playBeep(i - 1)
        }, (i - 1) * beepMs)
      )
    }

    // Wait for all 5 beeps + brief hold before lights go out
    await delay(5 * beepMs + 200, timerRefs)

    setPhase('orbit')
    setLightsOn(0)

    // Start F1Car sound as orbit begins (called inside click-event async chain)
    try {
      if (f1AudioRef.current) {
        f1AudioRef.current.currentTime = 0
        f1AudioRef.current.play().catch(() => {})
      }
    } catch (_) {}

    // Wait for React to mount the globe + car before animating the car.
    await delay(60, timerRefs)

    // Match orbit duration to F1Car.mp3 so the car shoots off right at the sound's end
    const SHOOT_DUR = 0.55
    const NAV_DELAY = 0.16
    const orbitDuration = Math.max(1.0, f1DurRef.current - SHOOT_DUR - NAV_DELAY)

    // ── Full elliptical orbit (using viewport-scaled points) ───────────────
    await carControls.start({
      x:       scaledOrbit.map(f => f.x),
      y:       scaledOrbit.map(f => f.y),
      opacity: scaledOrbit.map(f => f.opacity),
      scale:   scaledOrbit.map(f => f.scale),
      transition: { duration: orbitDuration, ease: 'linear', times: scaledOrbit.map(f => f.t) },
    })

    // ── Car shoots off right + wipe ────────────────────────────────────────
    setPhase('go')

    await carControls.start({
      x: window.innerWidth + 400,
      scale: 1.08,
      opacity: 1,
      transition: { duration: SHOOT_DUR, ease: [0.12, 0, 0.9, 1] },
    })

    // Stop F1Car audio as the page transition completes
    try {
      if (f1AudioRef.current) {
        f1AudioRef.current.pause()
        f1AudioRef.current.currentTime = 0
      }
    } catch (_) {}

    await delay(160, timerRefs)
    navigate(dest)
  }

  const showScene = phase === 'orbit' || phase === 'go'

  // Scaled dimensions for the orbit scene elements
  const globeSize = 900 * sceneScale
  const carW      = 540 * sceneScale
  const carH      = 173 * sceneScale

  return (
    <>
      <style>{STYLES}</style>

      <div style={{
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0F2027 0%, #2C5364 100%)',
        backgroundAttachment: 'fixed',
      }}>

        {/* Tech grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: [
            'linear-gradient(rgba(120,200,220,0.12) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(120,200,220,0.12) 1px, transparent 1px)',
          ].join(','),
          backgroundSize: '48px 48px',
          opacity: 0.6,
        }} />

        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(15,32,39,0.7) 80%)',
        }} />

        {/* Scan line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', overflow: 'hidden', pointerEvents: 'none', zIndex: 5 }}>
          <div className="w-scan" style={{ height: '1px', width: '33%', background: 'linear-gradient(to right, transparent, rgba(120,200,220,0.6), transparent)' }} />
        </div>

        {/* ── Welcome content ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: showScene ? 0 : 1, scale: showScene ? 0.95 : 1 }}
          transition={{ duration: 0.38 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(0.75rem, 2.5vw, 1.2rem)',
            textAlign: 'center',
            paddingTop: 'clamp(1.5rem, 5vw, 2.5rem)',
            paddingBottom: 'clamp(1.5rem, 5vw, 2.5rem)',
            paddingLeft: 'clamp(1rem, 5vw, 2rem)',
            paddingRight: 'clamp(1rem, 5vw, 2rem)',
            zIndex: 10,
            maxWidth: 780,
            width: '100%',
            boxSizing: 'border-box',
            pointerEvents: showScene ? 'none' : 'auto',
          }}
        >
          {/* Start lights */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 0.85rem)', marginBottom: '0.4rem' }}>
            <div style={{ display: 'flex', gap: 'clamp(6px, 2vw, 12px)', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map(i => {
                const on = lightsOn >= i
                return (
                  <div
                    key={i}
                    className={on ? 'w-light-on' : ''}
                    style={{
                      width: 'clamp(28px, 10vw, 48px)',
                      height: 'clamp(28px, 10vw, 48px)',
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: on
                        ? 'radial-gradient(circle at 35% 35%, #ff6040, #FF1A00 60%, #cc1000)'
                        : 'transparent',
                      border: on ? 'none' : '2px solid rgba(100,130,145,0.45)',
                      boxShadow: on ? '0 0 30px rgba(0,210,255,0.6), 0 0 60px rgba(0,210,255,0.3)' : 'none',
                      transition: 'background 0.06s ease, box-shadow 0.06s ease',
                    }}
                  />
                )
              })}
            </div>
            <span style={{
              fontSize: 'clamp(0.5rem, 1.6vw, 0.65rem)',
              letterSpacing: 'clamp(0.1em, 1.5vw, 0.5em)',
              color: '#00D2FF',
              textTransform: 'uppercase',
              fontFamily: '"Michroma", sans-serif',
            }}>
              Lights Out &nbsp;·&nbsp; Season 2026
            </span>
          </div>

          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, lineHeight: 1, width: '100%' }}>
            <h1 style={{
              fontSize: 'clamp(1rem, 5.5vw, 4rem)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              margin: 0,
              textShadow: '0 2px 20px rgba(0,0,0,0.4)',
              fontFamily: '"Orbitron", sans-serif',
              whiteSpace: 'nowrap',
            }}>
              Welcome To
            </h1>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 9.5vw, 7rem)',
              fontWeight: 900,
              color: '#00D2FF',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              margin: 0,
              lineHeight: 0.9,
              textShadow: '0 0 20px rgba(0,210,255,0.6), 0 0 40px rgba(0,210,255,0.3)',
              fontFamily: '"Orbitron", sans-serif',
              whiteSpace: 'nowrap',
            }}>
              LapTheWorld
            </h1>
          </div>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)',
            color: 'rgba(200,220,230,0.7)',
            margin: '0.2rem 0 0',
            maxWidth: 460,
            lineHeight: 1.7,
            letterSpacing: '0.02em',
            fontFamily: '"Rajdhani", sans-serif',
          }}>
            Your ultimate guide to experiencing Formula 1 around the world.
          </p>

          {/* CTA button */}
          <button
            onClick={handleStart}
            disabled={phase !== 'idle'}
            className="w-btn"
            style={{
              marginTop: 'clamp(0.4rem, 1.5vw, 0.8rem)',
              paddingTop: 'clamp(0.65rem, 2vw, 1rem)',
              paddingBottom: 'clamp(0.65rem, 2vw, 1rem)',
              paddingLeft: 'clamp(1.4rem, 4vw, 2.8rem)',
              paddingRight: 'clamp(1.4rem, 4vw, 2.8rem)',
              background: '#00D2FF',
              border: 'none',
              color: '#ffffff',
              fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
              fontWeight: 700,
              letterSpacing: '0.25em',
              cursor: 'pointer',
              borderRadius: '2px',
              textTransform: 'uppercase',
              fontFamily: '"Orbitron", sans-serif',
              boxShadow: '0 0 30px rgba(0,210,255,0.6), 0 0 60px rgba(0,210,255,0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            Lights Out &nbsp;→
          </button>
        </motion.div>

        {/* ── Globe ────────────────────────────────────────────────────────── */}
        {showScene && (
          <motion.div
            initial={{ opacity: 0, scale: 0.65 }}
            animate={{ opacity: phase === 'go' ? 0 : 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              width: globeSize,
              height: globeSize,
              marginLeft: -(globeSize / 2) - 15,
              marginTop: -(globeSize / 2),
              zIndex: 20,
            }}
          >
            <img
              src={globeImg}
              alt=""
              loading="eager"
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          </motion.div>
        )}

        {/* ── F1 Car ───────────────────────────────────────────────────────── */}
        {showScene && (
          <motion.div
            animate={carControls}
            initial={{ x: scaledOrbit[0].x, y: scaledOrbit[0].y, opacity: 1, scale: 0.95 }}
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              marginLeft: -(carW / 2),
              marginTop: -(carH / 2),
              width: carW,
              height: carH,
              zIndex: 30,
              pointerEvents: 'none',
              filter:
                'drop-shadow(0 0 6px rgba(0,210,255,0.85)) ' +
                'drop-shadow(-28px 0 10px rgba(0,210,255,0.8)) ' +
                'drop-shadow(-60px 0 22px rgba(0,210,255,0.5)) ' +
                'drop-shadow(-110px 0 40px rgba(0,210,255,0.22))',
              willChange: 'transform',
            }}
          >
            <img
              src={f1CarImg}
              alt=""
              loading="eager"
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </motion.div>
        )}

        {/* ── Wipe / light streak transition ───────────────────────────────── */}
        {phase === 'go' && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 0.44, ease: [0.38, 0, 0.82, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 45,
              background: 'linear-gradient(to right, #0a1820 0%, #0a1820 74%, rgba(0,210,255,0.28) 87%, rgba(0,210,255,0.72) 94%, #00D2FF 100%)',
            }}
          />
        )}

      </div>
    </>
  )
}

function delay(ms, refs) {
  return new Promise(resolve => {
    const id = setTimeout(resolve, ms)
    if (refs) refs.current.push(id)
  })
}
