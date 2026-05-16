export default function OverlayPanel({ isRegister }) {
  const clipPath = isRegister
    ? 'polygon(0 0, 60% 0, 15% 100%, 0 100%)'
    : 'polygon(85% 0, 100% 0, 100% 100%, 40% 100%)'

  return (
    <div
      className="absolute top-0 left-0 w-full h-full z-20 flex items-center justify-center bg-[linear-gradient(155deg,#3d7a96_0%,#2C5364_40%,#1a3340_70%,#0F2027_100%)] transition-[clip-path] duration-[600ms] ease-in-out max-sm:hidden overflow-hidden"
      style={{ clipPath }}
    >
      <div
        className="absolute bottom-0 left-0 w-full h-[30%] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(255,255,255,0.09) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(255,255,255,0.09) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.09) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.09) 75%)
          `,
          backgroundSize: '64px 64px',
          backgroundPosition: '0 0, 0 32px, 32px -32px, -32px 0px',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
        }}
      />
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center text-center text-white pointer-events-none pl-[calc(55%+165px)] pr-[60px] transition-opacity duration-200 ${
          isRegister ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-[4px] uppercase leading-[1.15] mb-[14px] [text-shadow:0_2px_16px_rgba(0,0,0,0.2)]">
          Welcome Back
        </h3>
        <p className="text-xs md:text-sm lg:text-base opacity-[0.82] max-w-[185px] leading-[1.6]">
          Sign in to continue your journey
        </p>
      </div>

      <div
        className={`absolute inset-0 flex flex-col items-center justify-center text-center text-white pointer-events-none pl-[40px] pr-[calc(60%+60px)] transition-opacity duration-200 ${
          isRegister ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-[4px] uppercase leading-[1.15] mb-[14px] [text-shadow:0_2px_16px_rgba(0,0,0,0.2)]">
          Join the Grid
        </h3>
        <p className="text-xs md:text-sm lg:text-base opacity-[0.82] max-w-[185px] leading-[1.6]">
          Create your account and start planning your ultimate race weekend
        </p>
      </div>
    </div>
  )
}
