import { useEffect, useRef } from 'react'

export default function GoogleSignIn({ onSuccess, onError, googleLogin }) {
  const buttonDiv = useRef(null)

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) return

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          if (!response?.credential) return onError?.('Sign-in failed')
          try {
            const result = await googleLogin({ credential: response.credential })
            onSuccess?.(result)
          } catch (err) {
            onError?.(err.message || 'Google sign-in failed')
          }
        },
      })

      if (buttonDiv.current) {
        window.google.accounts.id.renderButton(buttonDiv.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          shape: 'pill',
        })
      }
    }

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script)
    }
  }, [])

  return <div ref={buttonDiv} className="w-full" />
}
