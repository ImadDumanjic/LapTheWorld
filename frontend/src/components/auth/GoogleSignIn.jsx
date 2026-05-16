import { useEffect, useRef } from 'react'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
)

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
          width: buttonDiv.current.offsetWidth,
          shape: 'pill',
        })
      }
    }

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="relative w-full">
      <div className="w-full py-3 rounded-[50px] border border-white/20 bg-white/5 text-white text-[13px] font-extrabold tracking-[2px] uppercase flex items-center justify-center gap-2 pointer-events-none select-none">
        <GoogleIcon />
        Continue with Google
      </div>
      <div
        ref={buttonDiv}
        className="absolute inset-0 opacity-0 overflow-hidden cursor-pointer"
      />
    </div>
  )
}
