import { useEffect, useRef, useState } from 'react'
import { ConversationProvider } from '@elevenlabs/react'
import { Toaster } from 'react-hot-toast'
import { VoiceAssistantInner, VOICE_AGENT_ID } from './VoiceAssistantButton'
import CustomPlanButton from './CustomPlanButton'

const TOAST_STYLE = {
  background: '#1a3340',
  color: '#fff',
  border: '1px solid rgba(44,83,100,0.45)',
  fontSize: '13px',
}

const AT_TOP_PX    = 80    // always visible within this many px of the top
const AT_BOTTOM_PX = 60    // always visible within this many px of the bottom
const IDLE_MS      = 1500  // reappear after this many ms of no scrolling

function useScrollVisibility() {
  const [visible, setVisible] = useState(true)
  const idleTimer = useRef(null)
  const ticking   = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 1024) return   // always visible on desktop
      if (ticking.current) return
      ticking.current = true

      requestAnimationFrame(() => {
        const currentY  = window.scrollY
        const docHeight = document.documentElement.scrollHeight
        const atTop     = currentY < AT_TOP_PX
        const atBottom  = currentY + window.innerHeight >= docHeight - AT_BOTTOM_PX

        if (atTop || atBottom) {
          clearTimeout(idleTimer.current)
          setVisible(true)
        } else {
          // hide on any scroll activity; reappear only after idle
          setVisible(false)
          clearTimeout(idleTimer.current)
          idleTimer.current = setTimeout(() => setVisible(true), IDLE_MS)
        }

        ticking.current = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(idleTimer.current)
    }
  }, [])

  return visible
}

export default function FloatingButtonGroup({ guide }) {
  const visible = useScrollVisibility()
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: TOAST_STYLE }} />

      <div
        className="fixed bottom-6 right-6 z-[9999]"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          // slide off to the right when hidden; reduced-motion users get opacity only
          transform: reducedMotion
            ? undefined
            : visible ? 'translateX(0)' : 'translateX(calc(100% + 1.5rem))',
          opacity: visible ? 1 : 0,
          transition: reducedMotion
            ? 'opacity 250ms ease-out'
            : 'transform 250ms ease-out, opacity 250ms ease-out',
          // prevent hidden buttons from intercepting taps on content beneath
          pointerEvents: visible ? 'auto' : 'none',
          // keep in tab order for keyboard/screen-reader users; aria-hidden handled below
          willChange: 'transform, opacity',
        }}
        aria-hidden={!visible}
      >
        <CustomPlanButton guide={guide} />

        <ConversationProvider agentId={VOICE_AGENT_ID} connectionType="webrtc">
          <VoiceAssistantInner circuitName={guide.circuit} autoStart />
        </ConversationProvider>
      </div>
    </>
  )
}
