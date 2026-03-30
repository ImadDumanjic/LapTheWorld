export default function InputField({ type, placeholder, autoComplete, icon, value, onChange, action }) {
  return (
    <div className="relative w-full mb-[22px]">
      <span className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 flex items-center [&_svg]:w-4 [&_svg]:h-4">
        {icon}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        className={`w-full bg-transparent border-0 border-b border-b-white/[0.18] py-[9px] pl-8 text-white text-[14px] font-[inherit] outline-none transition-[border-color] duration-[250ms] placeholder:text-white/30 focus:border-b-[#2C5364] ${action ? 'pr-[90px]' : 'pr-[10px]'}`}
      />
      {action && (
        <span className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
          {action}
        </span>
      )}
    </div>
  )
}
