import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'

export default function CustomPlanButton({ guide }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)

  const handleClick = () => {
    navigate(`/custom-plan?circuit=${encodeURIComponent(guide.country)}`)
  }

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {hovered && (
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
          Create Your Own Plan
        </div>
      )}

      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="voice-btn-idle"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: '2px solid rgba(44,83,100,0.8)',
          background: '#2C5364',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.3s ease, border-color 0.3s ease',
          outline: 'none',
          flexShrink: 0,
        }}
        aria-label="Create your own plan"
      >
        <MessageSquare size={22} strokeWidth={2} />
      </button>
    </div>
  )
}
