export default function Button({ children, onClick, type = 'button', disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 mt-[6px] border-0 rounded-[50px] bg-[linear-gradient(135deg,#3d7a96,#2C5364,#1a3340)] text-white text-[13px] font-extrabold font-[inherit] tracking-[2px] uppercase cursor-pointer transition-[box-shadow,transform] duration-300 hover:shadow-[0_0_26px_rgba(44,83,100,0.55)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}
