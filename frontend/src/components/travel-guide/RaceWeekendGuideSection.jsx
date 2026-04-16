import { useState } from 'react'

// ── Icons ─────────────────────────────────────────────────────────────────────
function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function FlagIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  )
}

function CompassIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

// ── CardShell — shared visual foundation for all guide cards ──────────────────
// Provides: gradient bg, blurred orb, dot texture, inset top-highlight, hover glow.
// Both FeaturedCard and GuideCard render through this — only padding/minHeight differ.
function CardShell({ children, className = '', style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer ${className}`}
      style={{
        background: 'linear-gradient(145deg, rgba(10,26,38,0.98) 0%, rgba(5,14,22,0.99) 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderLeft: '2px solid rgba(44,83,100,0.42)',
        boxShadow: 'inset 0 1px 0 rgba(100,168,200,0.09)',
        ...style,
      }}
    >
      {/* Blurred orb — top-right corner */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -50,
          right: -50,
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(44,83,100,0.52) 0%, transparent 70%)',
          filter: 'blur(52px)',
        }}
      />

      {/* Dot grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.028) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* Hover inner border glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(44,83,100,0.3)' }}
      />

      {children}
    </div>
  )
}

// ── Expandable tips list ───────────────────────────────────────────────────────
function TipsList({ tips, isOpen }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: isOpen ? '1fr' : '0fr',
        transition: 'grid-template-rows 360ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div style={{ overflow: 'hidden' }}>
        <div
          style={{
            paddingTop: 20,
            opacity: isOpen ? 1 : 0,
            transition: `opacity ${isOpen ? '260ms' : '120ms'} ease`,
            transitionDelay: isOpen ? '140ms' : '0ms',
          }}
        >
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
            <ol className="flex flex-col gap-3">
              {tips.map((tip, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span
                    className="text-[10px] font-extrabold tabular-nums flex-shrink-0"
                    style={{ color: 'rgba(44,83,100,0.85)', lineHeight: '1.6', minWidth: 20 }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="text-[12px] leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.52)' }}
                  >
                    {tip}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Featured card — Before the Race ──────────────────────────────────────────
function FeaturedCard({ section }) {
  const [isOpen, setIsOpen] = useState(false)
  if (!section) return null

  const tips    = section.tips ?? []
  const words   = (section.title ?? '').split(' ')
  const lineOne = words[0] ?? ''
  const lineTwo = words.slice(1).join(' ')

  return (
    <CardShell
      onClick={() => setIsOpen(o => !o)}
      className="flex flex-col justify-between"
      style={{ minHeight: 300, padding: '32px 36px' }}
    >
      <div className="relative z-10 flex flex-col gap-6 flex-1">
        {/* Small icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(44,83,100,0.2)', border: '1px solid rgba(44,83,100,0.35)', color: 'rgba(100,168,200,0.75)' }}
        >
          <CalendarIcon />
        </div>

        {/* Title — two bold lines */}
        <h3
          className="font-extrabold uppercase text-white leading-none"
          style={{ fontSize: 'clamp(38px, 4.5vw, 54px)', letterSpacing: '-0.5px', lineHeight: 0.88 }}
        >
          <span className="block">{lineOne.toUpperCase()}</span>
          {lineTwo && <span className="block">{lineTwo.toUpperCase()}</span>}
        </h3>

        {/* Description */}
        {section.description && (
          <p className="text-[13px] leading-relaxed max-w-[340px]" style={{ color: 'rgba(255,255,255,0.36)' }}>
            {section.description}
          </p>
        )}

        {/* Expandable tips */}
        {tips.length > 0 && <TipsList tips={tips} isOpen={isOpen} />}
      </div>

      {/* Toggle row */}
      <div className="relative z-10 mt-6">
        <button
          onClick={e => { e.stopPropagation(); setIsOpen(o => !o) }}
          className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[2px] focus:outline-none focus:ring-0"
          style={{ color: 'rgba(100,168,200,0.7)' }}
        >
          {tips.length} tips inside
          <span
            className="inline-flex transition-transform duration-300 ease-in-out"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <ChevronDownIcon />
          </span>
        </button>
      </div>
    </CardShell>
  )
}

// ── Smaller card — During Race / Travel Advice ────────────────────────────────
function GuideCard({ section, icon }) {
  const [isOpen, setIsOpen] = useState(false)
  if (!section) return null

  const tips = section.tips ?? []

  return (
    <CardShell
      onClick={() => setIsOpen(o => !o)}
      className="flex flex-col justify-between"
      style={{ padding: '22px 24px', minHeight: 148 }}
    >
      <div className="relative z-10 flex flex-col gap-3">
        {/* Icon + title on same row */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(44,83,100,0.2)', border: '1px solid rgba(44,83,100,0.35)', color: 'rgba(100,168,200,0.75)' }}
          >
            {icon}
          </div>
          <h3 className="text-[12px] font-extrabold uppercase tracking-[1.5px] text-white leading-tight">
            {section.title}
          </h3>
        </div>

        {section.description && (
          <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.33)' }}>
            {section.description}
          </p>
        )}

        {/* Expandable tips */}
        {tips.length > 0 && <TipsList tips={tips} isOpen={isOpen} />}
      </div>

      {/* Toggle row */}
      <div className="relative z-10 mt-4">
        <button
          onClick={e => { e.stopPropagation(); setIsOpen(o => !o) }}
          className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[2px] focus:outline-none focus:ring-0"
          style={{ color: 'rgba(100,168,200,0.62)' }}
        >
          {tips.length} tips inside
          <span
            className="inline-flex transition-transform duration-300 ease-in-out"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <ChevronDownIcon />
          </span>
        </button>
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
      <div
        className="mt-3"
        style={{ width: 52, height: 2, borderRadius: 2, background: 'linear-gradient(to right, rgba(44,83,100,0.9), rgba(44,83,100,0.1))' }}
      />
    </div>
  )
}

// ── RaceWeekendGuideSection ───────────────────────────────────────────────────
export default function RaceWeekendGuideSection({ guide }) {
  const { beforeRace, duringRace, travelAdvice } = guide.guideSections ?? {}

  return (
    <section>
      <SectionTitle title="Your Race Weekend Guide" />

      {/* Layout: featured card (2/3) + two stacked cards (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Featured — Before the Race */}
        <div className="lg:col-span-2">
          <FeaturedCard section={beforeRace} />
        </div>

        {/* Stacked — During Race + Travel Advice */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <GuideCard section={duringRace}   icon={<FlagIcon />}    />
          <GuideCard section={travelAdvice} icon={<CompassIcon />} />
        </div>

      </div>
    </section>
  )
}
