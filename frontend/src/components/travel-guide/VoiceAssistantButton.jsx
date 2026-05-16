import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ConversationProvider,
  useConversationControls,
  useConversationStatus,
  useConversationMode,
} from '@elevenlabs/react'
import toast from 'react-hot-toast'
import { Mic, Square } from 'lucide-react'

export const VOICE_AGENT_ID = 'agent_0001kqad7r09f7j8yx9vw9b67k4t'

// Renders just the status indicator + mic button, no fixed positioning.
// Must be rendered inside a ConversationProvider.
export function VoiceAssistantInner({ circuitName, autoStart = false }) {
  const { startSession, endSession, sendContextualUpdate } = useConversationControls()
  const { status } = useConversationStatus()
  const { mode } = useConversationMode()

  const [hovered, setHovered] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const autoStartAttempted = useRef(false)

  const isActive = status === 'connected' || status === 'connecting'
  const isConnecting = status === 'connecting' || isStarting

  const requestMicrophone = useCallback(async ({ showError = true } = {}) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      return true
    } catch {
      if (showError) toast.error('Microphone access is required to use the voice assistant')
      return false
    }
  }, [])

  const startAssistant = useCallback(async ({ showMicError = true } = {}) => {
    if (isActive || isStarting) return
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error('Voice assistant is not supported in this browser')
      return
    }

    const micAllowed = await requestMicrophone({ showError: showMicError })
    if (!micAllowed) return

    setIsStarting(true)
    startSession({
      onConnect: () => {
        setIsStarting(false)
        sendContextualUpdate(
          `The user is currently viewing the ${circuitName} Grand Prix travel guide page.`
        )
      },
      onError: message => {
        setIsStarting(false)
        toast.error(message || 'Connection failed. Please try again.')
      },
    })
  }, [isActive, isStarting, requestMicrophone, startSession, sendContextualUpdate, circuitName])

  const handleClick = useCallback(() => {
    if (isActive) {
      endSession()
      return
    }

    startAssistant()
  }, [isActive, endSession, startAssistant])

  useEffect(() => {
    if (!autoStart || autoStartAttempted.current || isActive) return
    autoStartAttempted.current = true

    const timer = setTimeout(() => {
      startAssistant({ showMicError: false })
    }, 650)

    return () => clearTimeout(timer)
  }, [autoStart, isActive, startAssistant])

  useEffect(() => {
    if (status !== 'connecting') setIsStarting(false)
  }, [status])

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      {hovered && !isActive && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: 'calc(100% + 10px)',
            transform: 'translateY(-50%)',
            background: 'rgba(15,32,39,0.95)',
            border: '1px solid rgba(44,83,100,0.6)',
            color: 'rgba(100,168,200,0.95)',
            fontSize: '10px',
            fontWeight: '800',
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            padding: '6px 12px',
            borderRadius: '20px',
            backdropFilter: 'blur(8px)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          Get More Info
        </div>
      )}

      {status === 'connected' && (
        <div
          style={{
            background: 'rgba(15,32,39,0.92)',
            border: '1px solid rgba(44,83,100,0.55)',
            color: 'rgba(100,168,200,0.9)',
            fontSize: '10px',
            fontWeight: '800',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            padding: '5px 12px',
            borderRadius: '20px',
            backdropFilter: 'blur(8px)',
            whiteSpace: 'nowrap',
          }}
        >
          {mode === 'speaking' ? 'Speaking...' : 'Listening...'}
        </div>
      )}

      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={isConnecting}
        className={isActive ? 'voice-btn-active' : 'voice-btn-idle'}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: `2px solid ${isActive ? 'rgba(220,38,38,0.7)' : 'rgba(44,83,100,0.8)'}`,
          background: isActive ? '#7f1d1d' : '#2C5364',
          color: 'white',
          cursor: isConnecting ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isConnecting ? 0.7 : 1,
          transition: 'background 0.3s ease, border-color 0.3s ease, opacity 0.2s ease',
          outline: 'none',
          flexShrink: 0,
        }}
        aria-label={isActive ? 'Stop voice assistant' : 'Start voice assistant'}
      >
        {isActive
          ? <Square size={18} fill="white" strokeWidth={0} />
          : <Mic size={22} strokeWidth={2} />
        }
      </button>
    </div>
  )
}

// Standalone usage (backwards-compatible): renders its own fixed container.
export default function VoiceAssistantButton({ circuitName }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <ConversationProvider agentId={VOICE_AGENT_ID} connectionType="webrtc">
        <VoiceAssistantInner circuitName={circuitName} autoStart />
      </ConversationProvider>
    </div>
  )
}
