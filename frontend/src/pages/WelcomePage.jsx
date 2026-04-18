import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── F1 Car SVG silhouette (nose points RIGHT — direction of travel) ──────────
const F1Car = () => (
  <svg viewBox="0 0 500 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    {/* Mirror horizontally so nose leads to the right */}
    <g transform="translate(500,0) scale(-1,1)">
      {/* Front wing */}
      <path d="M8 72 L8 82 L95 78 L95 70 Z" fill="#00D2FF" />
      <rect x="4" y="68" width="4" height="18" rx="1" fill="#00AACC" />
      {/* Nose cone */}
      <path d="M8 72 L8 82 L125 78 L125 58 Z" fill="#00B8D9" />
      {/* Main body */}
      <path d="M125 58 L155 44 L220 40 L300 40 L340 44 L390 55 L430 65 L430 80 L125 80 Z" fill="#00D2FF" />
      {/* Cockpit opening */}
      <path d="M210 54 L225 36 L285 36 L300 54 Z" fill="#061520" />
      {/* Halo safety bar */}
      <path d="M225 38 C 255 28 275 28 300 38" stroke="#00D2FF" strokeWidth="4" fill="none" strokeLinecap="round" />
      <rect x="247" y="25" width="18" height="14" rx="3" fill="#00D2FF" />
      {/* Engine air intake */}
      <path d="M295 50 L310 36 L330 36 L345 50 Z" fill="#00AACC" />
      {/* Rear wing supports */}
      <rect x="418" y="20" width="5" height="50" rx="1" fill="#00D2FF" />
      <rect x="432" y="20" width="5" height="50" rx="1" fill="#00D2FF" />
      {/* Rear wing planes */}
      <rect x="405" y="16" width="48" height="11" rx="2" fill="#00D2FF" />
      <rect x="408" y="30" width="42" height="8" rx="1" fill="#00AACC" />
      {/* Front wheel */}
      <circle cx="135" cy="88" r="20" fill="#071828" />
      <circle cx="135" cy="88" r="12" fill="#0d2235" />
      <circle cx="135" cy="88" r="5" fill="#00D2FF" opacity="0.35" />
      {/* Rear wheel */}
      <ellipse cx="395" cy="88" rx="23" ry="20" fill="#071828" />
      <ellipse cx="395" cy="88" rx="14" ry="12" fill="#0d2235" />
      <ellipse cx="395" cy="88" rx="5" ry="5" fill="#00D2FF" opacity="0.35" />
      {/* Rear diffuser */}
      <path d="M430 72 L462 80 L430 80 Z" fill="#00AACC" />
      {/* Exhaust glow */}
      <circle cx="425" cy="65" r="3" fill="#FF4400" opacity="0.75" />
    </g>
  </svg>
)

// ─── CSS keyframes & class definitions ────────────────────────────────────────
const STYLES = `
  @keyframes wGradientFlow {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  @keyframes wCarBlast {
    from { transform: translateY(-50%) translateX(-130vw); }
    to   { transform: translateY(-50%) translateX(130vw); }
  }
  @keyframes wScreenWipe {
    from { transform: translateX(-100%); }
    to   { transform: translateX(0%); }
  }
  @keyframes wContentExit {
    from { opacity: 1; transform: scale(1); }
    to   { opacity: 0; transform: scale(0.97); }
  }
  @keyframes wGlowPulse {
    0%, 100% {
      box-shadow: 0 0 14px rgba(0,210,255,0.45), 0 0 28px rgba(0,210,255,0.2), 0 0 50px rgba(0,210,255,0.08);
    }
    50% {
      box-shadow: 0 0 22px rgba(0,210,255,0.75), 0 0 48px rgba(0,210,255,0.3), 0 0 80px rgba(0,210,255,0.12);
    }
  }
  @keyframes wLightFlicker {
    0%   { opacity: 1; }
    15%  { opacity: 0.85; }
    30%  { opacity: 1; }
    100% { opacity: 1; }
  }

  .w-bg {
    background: linear-gradient(135deg, #0F2027 0%, #1a3a4a 30%, #2C5364 60%, #203a43 80%, #0F2027 100%);
    background-size: 400% 400%;
    animation: wGradientFlow 10s ease infinite;
  }
  .w-btn-glow {
    animation: wGlowPulse 2.5s ease-in-out infinite;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .w-btn-glow:hover:not(:disabled) {
    background: rgba(0,210,255,0.09) !important;
    transform: scale(1.04);
    animation: none;
    box-shadow: 0 0 28px rgba(0,210,255,0.85), 0 0 56px rgba(0,210,255,0.35) !important;
  }
  .w-btn-glow:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
  .w-car {
    animation: wCarBlast 1.3s linear both;
  }
  .w-exit {
    animation: wContentExit 0.6s ease forwards;
  }
  .w-wipe {
    animation: wScreenWipe 1.0s cubic-bezier(0.4, 0, 0.2, 1) 0.35s both;
  }
  .w-light-on {
    animation: wLightFlicker 0.12s ease forwards;
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
      const navId = setTimeout(() => navigate(dest), 1600)
      timerRefs.current.push(navId)
    }, 5 * 120 + 300) // 900 ms

    timerRefs.current.push(goId)
  }

  const isGo = phase === 'go'

  return (
    <>
      <style>{STYLES}</style>

      <div
        className="w-bg"
        style={{
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ── Grid background ── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(0,210,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,210,255,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '58px 58px',
        }} />

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
            {/* Pure circles — no housing */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map(i => {
                const on = lightsOn >= i
                return (
                  <div
                    key={i}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: on
                        ? 'radial-gradient(circle at 35% 35%, #ff6040, #FF1A00 60%, #cc1000)'
                        : 'radial-gradient(circle at 35% 35%, #2a0808, #180404)',
                      boxShadow: on
                        ? '0 0 10px 3px rgba(255,26,0,0.85), 0 0 28px 8px rgba(255,26,0,0.4), 0 0 55px 14px rgba(255,60,0,0.18)'
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
              fontSize: '0.7rem',
              letterSpacing: '0.22em',
              color: 'rgba(0,210,255,0.5)',
              textTransform: 'uppercase',
              fontWeight: 600,
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
              textShadow: '0 0 50px rgba(0,210,255,0.4), 0 0 100px rgba(0,210,255,0.15)',
            }}>
              LapTheWorld
            </h1>
          </div>

          {/* ── Subtitle ── */}
          <p style={{
            fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
            color: 'rgba(180,230,255,0.6)',
            margin: '0.2rem 0 0',
            maxWidth: 460,
            lineHeight: 1.7,
            letterSpacing: '0.02em',
          }}>
            Your ultimate guide to experiencing Formula 1 around the world.
          </p>

          {/* ── CTA button ── */}
          <button
            onClick={handleStart}
            disabled={phase !== 'idle'}
            className="w-btn-glow"
            style={{
              marginTop: '0.4rem',
              padding: '0.85rem 2.8rem',
              background: 'transparent',
              border: '1.5px solid rgba(0,210,255,0.65)',
              color: '#00D2FF',
              fontSize: '0.9rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              cursor: 'pointer',
              borderRadius: '3px',
              textTransform: 'uppercase',
              fontFamily: 'inherit',
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
              width: 'clamp(320px, 55vw, 520px)',
              height: 'clamp(70px, 12vw, 115px)',
              zIndex: 25,
              filter:
                'drop-shadow(-30px 0 18px rgba(0,210,255,0.99)) ' +
                'drop-shadow(-80px 0 40px rgba(0,210,255,0.55)) ' +
                'drop-shadow(-160px 0 65px rgba(0,210,255,0.22))',
            }}
          >
            <F1Car />
          </div>
        )}

        {/* ── Screen wipe ── */}
        {isGo && (
          <div
            className="w-wipe"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'linear-gradient(90deg, #061520 0%, #0F2027 55%, #0F2027 100%)',
              zIndex: 20,
            }}
          />
        )}
      </div>
    </>
  )
}
