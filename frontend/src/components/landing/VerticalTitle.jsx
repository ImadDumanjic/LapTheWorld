const LEFT  = ['L', 'A', 'P', null, 'T', 'H', 'E']
const RIGHT = ['W', 'O', 'R', 'L', 'D']

function LetterColumn({ letters, side }) {
  const positionKey   = side === 'left' ? 'right' : 'left'
  const positionValue = 'calc(50% + 310px + 52px)'

  return (
    <div
      className="fixed top-1/2 z-10 pointer-events-none hidden lg:flex flex-col items-center justify-between h-[48vh]"
      style={{
        [positionKey]: positionValue,
        transform: 'translateY(-50%)',
        maskImage: 'linear-gradient(to bottom, transparent 0%, white 18%, white 82%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, white 18%, white 82%, transparent 100%)',
      }}
    >
      {letters.map((letter, i) =>
        letter === null
          ? <span key={i} className="h-4 block" />
          : <span key={i} className="text-white/45 text-[40px] font-black uppercase tracking-[0.28em] leading-none select-none">{letter}</span>
      )}
    </div>
  )
}

export default function VerticalTitle() {
  return (
    <>
      <LetterColumn letters={LEFT}  side="left"  />
      <LetterColumn letters={RIGHT} side="right" />
    </>
  )
}
