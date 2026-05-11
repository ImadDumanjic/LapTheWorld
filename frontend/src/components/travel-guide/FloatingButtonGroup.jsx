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

export default function FloatingButtonGroup({ guide }) {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: TOAST_STYLE }} />

      <div
        className="fixed bottom-6 right-6 z-[9999]"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
      >
        <CustomPlanButton guide={guide} />

        <ConversationProvider agentId={VOICE_AGENT_ID} connectionType="webrtc">
          <VoiceAssistantInner circuitName={guide.circuit} />
        </ConversationProvider>
      </div>
    </>
  )
}
