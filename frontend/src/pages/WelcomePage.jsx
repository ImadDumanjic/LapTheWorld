import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import f1CarImg from '../assets/F1Car.png'

// ─── CSS keyframes & class definitions ────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Michroma&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600&display=swap');

  @keyframes wCarBlast {
    0%   { transform: translateY(-50%) translateX(0); }
    22%  { transform: translateY(-50%) translateX(0); }
    100% { transform: translateY(-50%) translateX(130vw); }
  }
  @keyframes wScreenWipe {
    from { transform: translateX(-100%); }
    to   { transform: translateX(0%); }
  }
  @keyframes wContentExit {
    from { opacity: 1; transform: scale(1); }
    to   { opacity: 0; transform: scale(0.97); }
  }
  @keyframes wLightOn {
    0%, 100% { opacity: 1; box-shadow: 0 0 30px rgba(0,210,255,0.6), 0 0 60px rgba(0,210,255,0.3); }
    50%       { opacity: 0.85; }
  }
  @keyframes wScanLine {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(400%); }
  }

  .w-car {
    animation: wCarBlast 2s ease-in both;
  }
  .w-exit {
    animation: wContentExit 0.6s ease forwards;
  }
  .w-wipe {
    animation: wScreenWipe 1.0s cubic-bezier(0.4, 0, 0.2, 1) 0.65s both;
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
`

// ─── Main component ───────────────────────────────────────────────────────────
export default function WelcomePage() {
  const navigate   = useNavigate()
  const [phase, setPhase]       = useState('idle')    // idle | lighting | go
  const [lightsOn, setLightsOn] = useState(0)         // 0–5
  const timerRefs = useRef([])

  const handleStart = () => {
    if (phase !== 'idle') return

    const dest = localStorage.getItem('token') ? '/landing' : '/auth'
    setPhase('lighting')

    // Light up one by one — 120 ms apart
    for (let i = 1; i <= 5; i++) {
      const id = setTimeout(() => setLightsOn(i), i * 120)
      timerRefs.current.push(id)
    }

    // After all 5 lit + 300 ms hold → lights out, start transition
    const goId = setTimeout(() => {
      setPhase('go')
      setLightsOn(0)
      const navId = setTimeout(() => navigate(dest), 2000)
      timerRefs.current.push(navId)
    }, 5 * 120 + 300) // 900 ms

    timerRefs.current.push(goId)
  }

  const isGo = phase === 'go'

  return (
    <>
      <style>{STYLES}</style>

      <div
        style={{
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0F2027 0%, #2C5364 100%)',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* ── Cyan tech grid ── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(120,200,220,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120,200,220,0.12) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          opacity: 0.6,
        }} />

        {/* ── Vignette ── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(15,32,39,0.7) 80%)',
        }} />

        {/* ── Scan line ── */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 5,
        }}>
          <div
            className="w-scan"
            style={{
              height: '1px',
              width: '33%',
              background: 'linear-gradient(to right, transparent, rgba(120,200,220,0.6), transparent)',
            }}
          />
        </div>

        {/* ── Main content ── */}
        <div
          className={isGo ? 'w-exit' : ''}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.2rem',
            textAlign: 'center',
            padding: '2.5rem 2rem',
            zIndex: 10,
            maxWidth: 780,
            width: '100%',
          }}
        >
          {/* ── F1 start lights ── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem', marginBottom: '0.4rem' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map(i => {
                const on = lightsOn >= i
                return (
                  <div
                    key={i}
                    className={on ? 'w-light-on' : ''}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: on
                        ? 'radial-gradient(circle at 35% 35%, #ff6040, #FF1A00 60%, #cc1000)'
                        : 'transparent',
                      border: on ? 'none' : '2px solid rgba(100,130,145,0.45)',
                      boxShadow: on
                        ? '0 0 30px rgba(0,210,255,0.6), 0 0 60px rgba(0,210,255,0.3)'
                        : 'none',
                      transition: 'background 0.06s ease, box-shadow 0.06s ease',
                      flexShrink: 0,
                    }}
                  />
                )
              })}
            </div>

            {/* Label below lights */}
            <span style={{
              fontSize: '0.65rem',
              letterSpacing: '0.5em',
              color: '#00D2FF',
              textTransform: 'uppercase',
              fontFamily: '"Michroma", sans-serif',
            }}>
              Lights Out &nbsp;·&nbsp; Season 2026
            </span>
          </div>

          {/* ── Title ── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, lineHeight: 1 }}>
            <h1 style={{
              fontSize: 'clamp(1.8rem, 5.5vw, 4rem)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              margin: 0,
              textShadow: '0 2px 20px rgba(0,0,0,0.4)',
              fontFamily: '"Orbitron", sans-serif',
            }}>
              Welcome To
            </h1>
            <h1 style={{
              fontSize: 'clamp(2.8rem, 9.5vw, 7rem)',
              fontWeight: 900,
              color: '#00D2FF',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              margin: 0,
              lineHeight: 0.9,
              textShadow: '0 0 20px rgba(0,210,255,0.6), 0 0 40px rgba(0,210,255,0.3)',
              fontFamily: '"Orbitron", sans-serif',
            }}>
              LapTheWorld
            </h1>
          </div>

          {/* ── Subtitle ── */}
          <p style={{
            fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
            color: 'rgba(200,220,230,0.7)',
            margin: '0.2rem 0 0',
            maxWidth: 460,
            lineHeight: 1.7,
            letterSpacing: '0.02em',
            fontFamily: '"Rajdhani", sans-serif',
          }}>
            Your ultimate guide to experiencing Formula 1 around the world.
          </p>

          {/* ── CTA button ── */}
          <button
            onClick={handleStart}
            disabled={phase !== 'idle'}
            className="w-btn"
            style={{
              marginTop: '0.8rem',
              padding: '1rem 2.8rem',
              background: '#00D2FF',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.85rem',
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

        </div>

        {/* ── F1 car ── */}
        {isGo && (
          <div
            className="w-car"
            style={{
              position: 'fixed',
              top: '50%',
              left: 0,
              width: 'clamp(680px, 110vw, 1200px)',
              height: 'clamp(160px, 28vw, 290px)',
              zIndex: 25,
              filter:
                'drop-shadow(-30px 0 18px rgba(0,210,255,0.99)) ' +
                'drop-shadow(-80px 0 40px rgba(0,210,255,0.55)) ' +
                'drop-shadow(-160px 0 65px rgba(0,210,255,0.22))',
            }}
          >
            <img src={f1CarImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'left center' }} />
          </div>
        )}

      </div>
    </>
  )
}
