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

// ── Shared card background layers ─────────────────────────────────────────────
// Large blurred orb pinned to top-right — identical across all three cards
function CardGlowOrb({ size = 260, blur = 45, offset = 80 }) {
  return (
    <>
      {/* Diffuse blurred orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(44,83,100,0.30) 0%, transparent 65%)',
          filter: `blur(${blur}px)`,
          top: -offset,
          right: -offset,
        }}
      />
      {/* Tighter teal accent spot */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: size * 0.36,
          height: size * 0.36,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(77,208,225,0.11) 0%, transparent 70%)',
          top: size * 0.06,
          right: size * 0.13,
        }}
      />
    </>
  )
}

// Shared card background style (gradient + dot-grid texture)
const CARD_BASE_STYLE = {
  background: [
    'radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)',
    'linear-gradient(148deg, rgba(12,30,44,1) 0%, rgba(4,10,18,1) 100%)',
  ].join(', '),
  backgroundSize: '24px 24px, auto',
  border: '1px solid rgba(255,255,255,0.07)',
  borderLeft: '2px solid rgba(44,83,100,0.55)',
}

// ── Featured card — Before the Race ──────────────────────────────────────────
function FeaturedCard({ section }) {
  if (!section) return null
  const tipCount = section.tips?.length ?? 0

  // Split "Before the Race" → ["Before", "the Race"]
  const words   = (section.title ?? '').split(' ')
  const lineOne = words[0] ?? ''
  const lineTwo = words.slice(1).join(' ')

  return (
    <div
      className="relative flex flex-col justify-between rounded-2xl overflow-hidden h-full"
      style={{ ...CARD_BASE_STYLE, minHeight: 300, padding: '32px 36px' }}
    >
      <CardGlowOrb size={280} blur={50} offset={90} />

      <div className="relative z-10 flex flex-col gap-6 flex-1">
        {/* Small icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(44,83,100,0.22)', border: '1px solid rgba(44,83,100,0.38)', color: 'rgba(100,168,200,0.75)' }}
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
      </div>

      {/* Tips link */}
      <div className="relative z-10 mt-6">
        <button
          className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[2px] cursor-default"
          style={{ color: 'rgba(100,168,200,0.7)' }}
        >
          {tipCount} tips inside
          <ChevronDownIcon />
        </button>
      </div>
    </div>
  )
}

// ── Smaller card — During Race / Travel Advice ────────────────────────────────
function GuideCard({ section, icon }) {
  if (!section) return null
  const tipCount = section.tips?.length ?? 0

  return (
    <div
      className="relative flex flex-col justify-between rounded-2xl overflow-hidden flex-1"
      style={{ ...CARD_BASE_STYLE, padding: '22px 24px', minHeight: 148 }}
    >
      <CardGlowOrb size={170} blur={32} offset={55} />

      <div className="relative z-10 flex flex-col gap-3">
        {/* Icon + title on same row */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(44,83,100,0.22)', border: '1px solid rgba(44,83,100,0.38)', color: 'rgba(100,168,200,0.75)' }}
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
      </div>

      {/* Tips link */}
      <div className="relative z-10 mt-4">
        <button
          className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[2px] cursor-default"
          style={{ color: 'rgba(100,168,200,0.62)' }}
        >
          {tipCount} tips inside
          <ChevronDownIcon />
        </button>
      </div>
    </div>
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

      {/* Layout: featured card (58%) + two stacked cards (42%) */}
      <div className="flex flex-col lg:flex-row gap-4">

        {/* Featured — Before the Race */}
        <div className="lg:w-[58%]">
          <FeaturedCard section={beforeRace} />
        </div>

        {/* Stacked — During Race + Travel Advice */}
        <div className="lg:w-[42%] flex flex-col gap-4">
          <GuideCard section={duringRace}    icon={<FlagIcon />}    />
          <GuideCard section={travelAdvice}  icon={<CompassIcon />} />
        </div>

      </div>
    </section>
  )
}
