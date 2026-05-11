import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// ── Simple inline markdown renderer ──────────────────────────────────────────
function renderMarkdown(text) {
  const lines = text.split('\n')
  const elements = []
  let listItems = []
  let key = 0

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} style={{ paddingLeft: 18, margin: '6px 0' }}>
          {listItems.map((li, i) => (
            <li key={i} style={{ marginBottom: 3, color: 'rgba(255,255,255,0.85)' }}>
              {parseLine(li)}
            </li>
          ))}
        </ul>
      )
      listItems = []
    }
  }

  const parseLine = (line) => {
    const parts = []
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g
    let last = 0
    let m
    let idx = 0
    while ((m = regex.exec(line)) !== null) {
      if (m.index > last) parts.push(<span key={idx++}>{line.slice(last, m.index)}</span>)
      if (m[2]) parts.push(<strong key={idx++} style={{ color: '#fff', fontWeight: 700 }}>{m[2]}</strong>)
      else if (m[3]) parts.push(<em key={idx++}>{m[3]}</em>)
      else if (m[4]) parts.push(
        <code key={idx++} style={{
          background: 'rgba(77,208,225,0.12)',
          color: '#4DD0E1',
          padding: '1px 5px',
          borderRadius: 4,
          fontSize: '0.88em',
          fontFamily: 'monospace',
        }}>{m[4]}</code>
      )
      last = m.index + m[0].length
    }
    if (last < line.length) parts.push(<span key={idx++}>{line.slice(last)}</span>)
    return parts.length > 0 ? parts : line
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      flushList()
      elements.push(<div key={key++} style={{ height: 8 }} />)
      continue
    }

    if (/^#{1,2}\s/.test(trimmed)) {
      flushList()
      const headingText = trimmed.replace(/^#{1,2}\s/, '')
      elements.push(
        <p key={key++} style={{
          color: '#4DD0E1',
          fontWeight: 800,
          fontSize: '0.92em',
          letterSpacing: '0.5px',
          marginBottom: 4,
          marginTop: 10,
          textTransform: 'uppercase',
        }}>
          {parseLine(headingText)}
        </p>
      )
      continue
    }

    if (/^###\s/.test(trimmed)) {
      flushList()
      const headingText = trimmed.replace(/^###\s/, '')
      elements.push(
        <p key={key++} style={{
          color: 'rgba(77,208,225,0.8)',
          fontWeight: 700,
          fontSize: '0.88em',
          marginBottom: 3,
          marginTop: 8,
        }}>
          {parseLine(headingText)}
        </p>
      )
      continue
    }

    if (/^[-*]\s/.test(trimmed)) {
      listItems.push(trimmed.replace(/^[-*]\s/, ''))
      continue
    }

    if (/^\d+\.\s/.test(trimmed)) {
      flushList()
      elements.push(
        <p key={key++} style={{ margin: '3px 0', color: 'rgba(255,255,255,0.85)' }}>
          {parseLine(trimmed)}
        </p>
      )
      continue
    }

    flushList()
    elements.push(
      <p key={key++} style={{ margin: '2px 0', color: 'rgba(255,255,255,0.85)' }}>
        {parseLine(trimmed)}
      </p>
    )
  }

  flushList()
  return elements
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #2C5364, #0F2027)',
        border: '1px solid rgba(77,208,225,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: 14,
      }}>
        🏎️
      </div>
      <div style={{
        background: 'rgba(13,28,36,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderLeft: '3px solid #4DD0E1',
        borderRadius: '4px 16px 16px 16px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
      }}>
        {[0, 1, 2].map(i => (
          <span
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#4DD0E1',
              display: 'inline-block',
              animation: `typingBounce 1.2s ease-in-out infinite`,
              animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ── Message bubble ────────────────────────────────────────────────────────────
function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <div style={{
          background: 'linear-gradient(135deg, #2C5364 0%, #1a3d50 100%)',
          border: '1px solid rgba(77,208,225,0.25)',
          borderRadius: '16px 4px 16px 16px',
          padding: '11px 16px',
          maxWidth: '72%',
          fontSize: 14,
          lineHeight: 1.55,
          color: 'rgba(255,255,255,0.92)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        }}>
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #2C5364, #0F2027)',
        border: '1px solid rgba(77,208,225,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: 14,
      }}>
        🏎️
      </div>
      <div style={{
        background: message.isError
          ? 'rgba(30,10,10,0.85)'
          : 'rgba(13,28,36,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: message.isError
          ? '1px solid rgba(220,50,50,0.2)'
          : '1px solid rgba(255,255,255,0.07)',
        borderLeft: `3px solid ${message.isError ? 'rgba(220,80,80,0.6)' : '#4DD0E1'}`,
        borderRadius: '4px 16px 16px 16px',
        padding: '12px 16px',
        maxWidth: '80%',
        fontSize: 14,
        lineHeight: 1.6,
        boxShadow: '0 2px 16px rgba(0,0,0,0.35)',
      }}>
        {renderMarkdown(message.content)}
      </div>
    </div>
  )
}

// ── Chat input ────────────────────────────────────────────────────────────────
function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleInput = (e) => {
    setValue(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
  }

  return (
    <div style={{ padding: '12px 16px 20px' }}>
      <div style={{
        maxWidth: 860,
        margin: '0 auto',
        position: 'relative',
        background: 'rgba(0,0,0,0.25)',
        border: '1px solid rgba(77,208,225,0.45)',
        borderRadius: 16,
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Describe your trip — arrival date, budget, interests..."
          rows={1}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'rgba(255,255,255,0.9)',
            fontSize: 14,
            lineHeight: 1.55,
            resize: 'none',
            padding: '14px 52px 14px 16px',
            fontFamily: 'inherit',
            maxHeight: 160,
            overflowY: 'auto',
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="Send"
          style={{
            position: 'absolute',
            right: 10,
            bottom: 10,
            width: 34,
            height: 34,
            borderRadius: 10,
            border: 'none',
            cursor: disabled || !value.trim() ? 'default' : 'pointer',
            background: disabled || !value.trim()
              ? 'rgba(77,208,225,0.12)'
              : 'linear-gradient(135deg, #4DD0E1, #2C5364)',
            color: disabled || !value.trim() ? 'rgba(77,208,225,0.4)' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s ease, color 0.2s ease',
            flexShrink: 0,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"/>
            <polyline points="5 12 12 5 19 12"/>
          </svg>
        </button>
      </div>
      <p style={{
        textAlign: 'center',
        fontSize: 10,
        color: 'rgba(255,255,255,0.2)',
        marginTop: 8,
        letterSpacing: '0.5px',
      }}>
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}

// ── Back button ───────────────────────────────────────────────────────────────
function BackButton({ onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Go back"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        background: hovered ? 'rgba(77,208,225,0.1)' : 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(77,208,225,0.2)',
        borderRadius: 10,
        padding: '7px 13px',
        color: hovered ? '#4DD0E1' : 'rgba(255,255,255,0.55)',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: 'inherit',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      Back
    </button>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CustomPlanPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const circuit = searchParams.get('circuit') || ''

  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const circuitDisplay = circuit || 'Your Race'
  const gpLabel = circuit ? `${circuit} Grand Prix` : 'Grand Prix'

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `Hey! I'm your personal race weekend planner 🏎️ Tell me when you're arriving, how long you're staying, and what you're most excited about — and I'll build your perfect ${gpLabel} plan!`,
      isGreeting: true,
    }])
  }, [gpLabel])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = useCallback(async (text) => {
    if (!text.trim() || isTyping) return

    const userMsg = { role: 'user', content: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    try {
      const history = messages
        .filter(m => !m.isGreeting)
        .map(m => ({ role: m.role, content: m.content }))

      const res = await fetch(`${BASE_URL}/api/groq/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), circuit, history }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`)
      }

      if (data.error) throw new Error(data.error)

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      const msg = err?.message || ''
      const userFacingError = msg.includes('quota') || msg.includes('429')
        ? `The AI planner is temporarily rate-limited. ${msg.replace('API quota exceeded.', '').trim() || 'Please try again in a moment.'}`
        : "Sorry, I couldn't connect to the planner right now. Please check your internet connection and try again."

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: userFacingError, isError: true },
      ])
    } finally {
      setIsTyping(false)
    }
  }, [messages, isTyping, circuit])

  return (
    <>
      {/* Typing bounce keyframes */}
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>

      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #0F2027 0%, #203A43 55%, #2C5364 100%)',
        overflow: 'hidden',
      }}>

        {/* ── Top bar ── */}
        <div style={{ flexShrink: 0, padding: '14px 20px 0' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <BackButton onClick={() => navigate(-1)} />
            {circuit && (
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'rgba(77,208,225,0.55)',
                background: 'rgba(77,208,225,0.07)',
                border: '1px solid rgba(77,208,225,0.15)',
                borderRadius: 20,
                padding: '4px 12px',
              }}>
                {circuitDisplay} GP
              </span>
            )}
          </div>
        </div>

        {/* ── Hero ── */}
        <div style={{
          flexShrink: 0,
          textAlign: 'center',
          padding: '28px 24px 20px',
          position: 'relative',
        }}>
          {/* Radial glow */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(44,83,100,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <p style={{
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '5px',
            textTransform: 'uppercase',
            color: 'rgba(77,208,225,0.55)',
            marginBottom: 10,
            position: 'relative',
          }}>
            AI Race Weekend Planner
          </p>

          <h1 style={{
            fontSize: 'clamp(26px, 4.5vw, 48px)',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-1px',
            lineHeight: 0.95,
            color: '#fff',
            marginBottom: 10,
            position: 'relative',
          }}>
            Your Race Weekend.<br />
            <span style={{ color: '#4DD0E1' }}>Your Way.</span>
          </h1>

          <p style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.38)',
            maxWidth: 420,
            margin: '0 auto',
            lineHeight: 1.5,
            position: 'relative',
          }}>
            Tell us about your trip and we'll build your perfect race weekend plan.
          </p>

          {circuit && (
            <div style={{
              marginTop: 14,
              display: 'inline-block',
              fontSize: 11,
              fontWeight: 700,
              color: 'rgba(77,208,225,0.7)',
              background: 'rgba(77,208,225,0.07)',
              border: '1px solid rgba(77,208,225,0.18)',
              borderRadius: 20,
              padding: '5px 14px',
              letterSpacing: '1px',
              position: 'relative',
            }}>
              Planning your {gpLabel} weekend
            </div>
          )}

          {/* Divider */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
            <div style={{
              width: 60,
              height: 2,
              background: 'linear-gradient(90deg, transparent, rgba(77,208,225,0.45), transparent)',
              borderRadius: 2,
            }} />
          </div>
        </div>

        {/* ── Messages ── */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 20px 8px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none', // IE/Edge
        }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ── Input ── */}
        <div style={{ flexShrink: 0 }}>
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>

      </div>
    </>
  )
}
