import { useState, useRef, useEffect, useMemo } from 'react'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'

const NAMES = new Intl.DisplayNames(['en'], { type: 'region' })

const getFlagEmoji = (code) =>
  [...code.toUpperCase()].map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join('')

const ALL_COUNTRIES = getCountries()
  .map(code => ({
    code,
    name: NAMES.of(code) ?? code,
    callingCode: getCountryCallingCode(code),
    flag: getFlagEmoji(code),
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

export default function PhoneInputField({ value, onChange }) {
  const [country, setCountry]       = useState('BA')
  const [localNumber, setLocalNumber] = useState('')
  const [open, setOpen]             = useState(false)
  const [search, setSearch]         = useState('')
  const [focused, setFocused]       = useState(false)
  const containerRef = useRef(null)
  const searchRef    = useRef(null)
  const listRef      = useRef(null)

  const selected = useMemo(
    () => ALL_COUNTRIES.find(c => c.code === country) ?? ALL_COUNTRIES[0],
    [country],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase().replace(/^\+/, '')
    if (!q) return ALL_COUNTRIES
    return ALL_COUNTRIES.filter(
      c => c.name.toLowerCase().includes(q) || c.callingCode.includes(q),
    )
  }, [search])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Focus search when dropdown opens
  useEffect(() => {
    if (open) searchRef.current?.focus()
  }, [open])

  // Scroll selected item into view when list opens
  useEffect(() => {
    if (open && listRef.current) {
      const el = listRef.current.querySelector('[data-selected="true"]')
      el?.scrollIntoView({ block: 'center' })
    }
  }, [open])

  const notify = (callingCode, num) => {
    const combined = `+${callingCode}${num}`
    onChange(combined)
  }

  const handleLocalChange = (e) => {
    const num = e.target.value.replace(/[^\d\s\-()+]/g, '')
    setLocalNumber(num)
    notify(selected.callingCode, num)
  }

  const handleCountrySelect = (code) => {
    const c = ALL_COUNTRIES.find(x => x.code === code)
    setCountry(code)
    setOpen(false)
    setSearch('')
    notify(c.callingCode, localNumber)
  }

  const borderColor = focused || open
    ? 'rgba(44,83,100,0.9)'
    : 'rgba(255,255,255,0.18)'

  return (
    <div className="relative w-full mb-[22px]" ref={containerRef}>

      {/* Input row */}
      <div
        className="flex items-center"
        style={{ borderBottom: `1px solid ${borderColor}`, transition: 'border-color 0.25s' }}
      >
        {/* Country trigger */}
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex items-center gap-[5px] py-[9px] pr-2 flex-shrink-0 cursor-pointer select-none transition-opacity duration-200"
          style={{ background: 'transparent', border: 'none', outline: 'none', opacity: open ? 1 : 0.75 }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1 }}
          onMouseLeave={e => { if (!open) e.currentTarget.style.opacity = 0.75 }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>{selected.flag}</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
            +{selected.callingCode}
          </span>
          {/* Chevron */}
          <svg
            width="9" height="9" viewBox="0 0 10 10" fill="none"
            style={{
              color: 'rgba(255,255,255,0.28)',
              transition: 'transform 0.2s ease',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Divider */}
        <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.12)', flexShrink: 0, marginRight: 10 }} />

        {/* Number input */}
        <input
          type="tel"
          placeholder="Phone number"
          autoComplete="tel-national"
          value={localNumber}
          onChange={handleLocalChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent border-0 py-[9px] text-white text-[14px] font-[inherit] outline-none placeholder:text-white/30"
        />
      </div>

      {/* Dropdown */}
      <div
        className="absolute z-[200] w-full rounded-xl overflow-hidden"
        style={{
          top: 'calc(100% + 6px)',
          background: 'rgba(8,18,26,0.98)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(44,83,100,0.45)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(44,83,100,0.12)',
          transformOrigin: 'top center',
          transform: open ? 'scaleY(1)' : 'scaleY(0)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'transform 0.2s ease, opacity 0.15s ease',
        }}
      >
        {/* Search */}
        <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search country or code…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent text-white text-[12px] font-[inherit] outline-none placeholder:text-white/20"
          />
        </div>

        {/* List */}
        <div ref={listRef} style={{ maxHeight: 200, overflowY: 'auto' }}>
          {filtered.map(c => {
            const isSelected = c.code === country
            return (
              <button
                key={c.code}
                type="button"
                data-selected={isSelected}
                onClick={() => handleCountrySelect(c.code)}
                className="w-full flex items-center gap-2 px-3 py-[7px] text-left cursor-pointer transition-colors duration-100"
                style={{
                  background: isSelected ? 'rgba(44,83,100,0.4)' : 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: isSelected ? '#fff' : 'rgba(255,255,255,0.58)',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isSelected ? '#fff' : 'rgba(255,255,255,0.58)' }}
              >
                <span style={{ fontSize: 15, lineHeight: 1, flexShrink: 0 }}>{c.flag}</span>
                <span className="text-[12px] flex-1 truncate">{c.name}</span>
                <span className="text-[11px] flex-shrink-0" style={{ color: 'rgba(100,168,200,0.65)' }}>
                  +{c.callingCode}
                </span>
              </button>
            )
          })}
          {filtered.length === 0 && (
            <p className="px-3 py-4 text-[12px] text-center" style={{ color: 'rgba(255,255,255,0.22)' }}>
              No results
            </p>
          )}
        </div>
      </div>

    </div>
  )
}
