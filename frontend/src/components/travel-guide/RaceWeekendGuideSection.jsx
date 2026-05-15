import { useState } from 'react'

// ── Icons ─────────────────────────────────────────────────────────────────────
function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8"  y1="2" x2="8"  y2="6" />
      <line x1="3"  y1="10" x2="21" y2="10" />
    </svg>
  )
}

function FlagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  )
}

function CompassIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

// ── CardShell ─────────────────────────────────────────────────────────────────
function CardShell({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group relative rounded-3xl overflow-hidden cursor-pointer"
      style={{
        background: 'linear-gradient(145deg, rgba(10,26,38,0.98) 0%, rgba(5,14,22,0.99) 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderLeft: '2px solid rgba(44,83,100,0.42)',
        boxShadow: 'inset 0 1px 0 rgba(100,168,200,0.09)',
      }}
    >
      {/* Top-right orb glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -40, right: -40,
          width: 220, height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(44,83,100,0.35) 0%, transparent 70%)',
          filter: 'blur(56px)',
        }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      {/* Full-bleed circuit lines */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.14 }}
      >
        <path
          d="M 60 720 C 200 720 240 600 360 580 C 480 560 520 460 620 420 C 700 388 740 320 700 240 C 670 180 740 130 840 150 C 940 170 1020 110 1100 60"
          stroke="rgba(100,168,200,1)"
          strokeWidth="1.5"
          strokeDasharray="2 7"
          strokeLinecap="round"
        />
        <path
          d="M 0 500 C 160 500 220 380 380 360 C 540 340 600 240 760 240 C 880 240 980 180 1200 200"
          stroke="rgba(100,168,200,1)"
          strokeWidth="0.75"
        />
        <path
          d="M 0 680 C 100 670 200 620 340 580 C 500 535 580 480 720 460 C 860 440 980 400 1200 380"
          stroke="rgba(44,83,100,1)"
          strokeWidth="1"
          strokeDasharray="4 10"
          strokeLinecap="round"
        />
      </svg>
      {/* Hover glow ring */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(44,83,100,0.28)' }}
      />
      {children}
    </div>
  )
}

// ── Single tip row ─────────────────────────────────────────────────────────────
function TipRow({ number, text }) {
  return (
    <li
      className="flex gap-4 rounded-2xl p-4 sm:p-5"
      style={{
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <span
        className="text-[11px] font-mono tabular-nums flex-shrink-0 pt-0.5"
        style={{ color: 'rgba(100,168,200,0.75)' }}
      >
        {String(number).padStart(2, '0')}
      </span>
      <p
        className="text-[13px] sm:text-[14px] flex-1"
        style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }}
      >
        {text}
      </p>
    </li>
  )
}

// ── Animated tips panel ───────────────────────────────────────────────────────
function TipsPanel({ tips, isOpen }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: isOpen ? '1fr' : '0fr',
        transition: 'grid-template-rows 380ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div style={{ overflow: 'hidden' }}>
        <div
          style={{
            opacity: isOpen ? 1 : 0,
            transition: `opacity ${isOpen ? '280ms' : '80ms'} ease`,
            transitionDelay: isOpen ? '160ms' : '0ms',
          }}
        >
          <ul className="flex flex-col gap-3 pt-6">
            {tips.map((tip, i) => (
              <TipRow key={i} number={i + 1} text={tip} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// ── Reusable guide card ───────────────────────────────────────────────────────
function GuideCard({ section, chapterLabel, icon, isOpen, onToggle }) {
  if (!section) return null

  const tips    = section.tips ?? []
  const words   = (section.title ?? '').split(' ')
  const lineOne = words[0] ?? ''
  const lineTwo = words.slice(1).join(' ')

  return (
    <CardShell onClick={onToggle}>

      {/* Decorative circuit trace — bottom-right */}
      <svg
        aria-hidden="true"
        viewBox="0 0 220 200"
        fill="none"
        style={{
          position: 'absolute', bottom: 0, right: 0,
          width: '32%', height: '32%',
          opacity: 0.05, pointerEvents: 'none',
        }}
      >
        <path
          d="M210,185 L165,185 Q150,185 150,170 L150,105 Q150,90 135,90 L65,90 Q50,90 50,75 L50,30 Q50,15 35,15 L10,15"
          stroke="rgba(100,168,200,1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M130,185 L95,185 Q80,185 80,170 L80,130 Q80,115 95,115 L145,115"
          stroke="rgba(100,168,200,1)" strokeWidth="1.5" strokeLinecap="round"
        />
        <circle cx="10"  cy="15"  r="4"   fill="rgba(100,168,200,1)" />
        <circle cx="210" cy="185" r="3.5" fill="rgba(100,168,200,0.9)" />
        <circle cx="145" cy="115" r="2.5" fill="rgba(100,168,200,0.6)" />
      </svg>

      {/* ── Card body ── */}
      <div className="relative z-10 p-5 sm:p-8 lg:p-12">

        {/* Header: stacked on mobile, side-by-side on sm+ */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between sm:gap-6">

          {/* Text: badge + title + description — full width on mobile */}
          <div className="flex-1 min-w-0">

            {/* Chapter badge */}
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(44,83,100,0.2)', border: '1px solid rgba(44,83,100,0.35)', color: 'rgba(100,168,200,0.75)' }}
              >
                {icon}
              </div>
              <span
                className="text-[10px] font-extrabold uppercase tracking-[0.18em] sm:tracking-[0.22em]"
                style={{ color: 'rgba(100,168,200,0.45)' }}
              >
                {chapterLabel}
              </span>
            </div>

            {/* Title */}
            <h3
              className="font-extrabold uppercase text-white"
              style={{ fontSize: 'clamp(24px, 6vw, 52px)', letterSpacing: '-0.5px', lineHeight: 0.92 }}
            >
              <span className="block">{lineOne.toUpperCase()}</span>
              {lineTwo && <span className="block mt-[6px]">{lineTwo.toUpperCase()}</span>}
            </h3>

            {/* Description */}
            {section.description && (
              <p
                className="mt-3 sm:mt-5 text-[13px] sm:text-[14px] sm:max-w-2xl"
                style={{ color: 'rgba(255,255,255,0.38)', lineHeight: 1.7 }}
              >
                {section.description}
              </p>
            )}
          </div>

          {/* Pill button — below text on mobile, top-right on sm+ */}
          {tips.length > 0 && (
            <button
              onClick={e => { e.stopPropagation(); onToggle() }}
              className="inline-flex self-start items-center gap-2 rounded-full px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] focus:outline-none flex-shrink-0 mt-4 sm:mt-1"
              style={{
                color: 'rgba(100,168,200,0.8)',
                border: '1px solid rgba(44,83,100,0.4)',
                background: 'rgba(44,83,100,0.08)',
                transition: 'background 150ms ease, border-color 150ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(44,83,100,0.2)'; e.currentTarget.style.borderColor = 'rgba(44,83,100,0.65)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(44,83,100,0.08)'; e.currentTarget.style.borderColor = 'rgba(44,83,100,0.4)' }}
            >
              {isOpen ? 'Hide' : `${tips.length} Tips`}
              <span
                className="inline-flex transition-transform duration-300 ease-in-out"
                style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <ChevronDownIcon />
              </span>
            </button>
          )}
        </div>

        {/* Collapsible tips */}
        {tips.length > 0 && (
          <div style={{ borderTop: isOpen ? '1px solid rgba(255,255,255,0.055)' : 'none' }}>
            <TipsPanel tips={tips} isOpen={isOpen} />
          </div>
        )}

      </div>
    </CardShell>
  )
}

// ── Section title ─────────────────────────────────────────────────────────────
function SectionTitle({ title }) {
  return (
    <div className="mb-8">
<h2
        className="text-[28px] sm:text-[32px] font-extrabold uppercase text-white tracking-[2px]"
        style={{ lineHeight: 1 }}
      >
        {title}
      </h2>
    </div>
  )
}

// ── RaceWeekendGuideSection ───────────────────────────────────────────────────
export default function RaceWeekendGuideSection({ guide }) {
  const { beforeRace, duringRace, travelAdvice } = guide.guideSections ?? {}

  const [openCards, setOpenCards] = useState({ before: false, during: false, travel: false })
  const toggle = key => setOpenCards(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <section>
      <SectionTitle title="Your Race Weekend Guide" />

      <div className="flex flex-col gap-4">
        <GuideCard
          section={beforeRace}
          chapterLabel="Chapter 01"
          icon={<CalendarIcon />}
          isOpen={openCards.before}
          onToggle={() => toggle('before')}
        />
        <GuideCard
          section={duringRace}
          chapterLabel="Chapter 02"
          icon={<FlagIcon />}
          isOpen={openCards.during}
          onToggle={() => toggle('during')}
        />
        <GuideCard
          section={travelAdvice}
          chapterLabel="Chapter 03"
          icon={<CompassIcon />}
          isOpen={openCards.travel}
          onToggle={() => toggle('travel')}
        />
      </div>
    </section>
  )
}
