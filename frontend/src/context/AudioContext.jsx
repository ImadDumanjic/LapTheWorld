import { createContext, useContext, useRef, useState, useCallback } from 'react'

// Vite resolves these to hashed, production-safe URLs at build time
import canadaUrl    from '../assets/sounds/Canada.mp3'
import monacoUrl    from '../assets/sounds/Monaco.mp3'
import silverstoneUrl from '../assets/sounds/Silverstone.mp3'
import spaUrl       from '../assets/sounds/Spa.mp3'
import monzaUrl     from '../assets/sounds/Monza.mp3'
import singaporeUrl from '../assets/sounds/Singapore.mp3'
import azerbaijanUrl from '../assets/sounds/Azerbaijan.mp3'
import texasUrl     from '../assets/sounds/Texas.mp3'
import interllagosUrl from '../assets/sounds/Interlagos.mp3'
import lasVegasUrl  from '../assets/sounds/Las vegas.mp3'
import abuDhabiUrl  from '../assets/sounds/AbuDhabi.mp3'

// Maps travel-guide URL slugs → resolved audio URLs
const CIRCUIT_AUDIO = {
  canada:      canadaUrl,
  monaco:      monacoUrl,
  british:     silverstoneUrl,
  belgium:     spaUrl,
  italy:       monzaUrl,
  singapore:   singaporeUrl,
  azerbaijan:  azerbaijanUrl,
  usa:         texasUrl,
  brazil:      interllagosUrl,
  'las-vegas': lasVegasUrl,
  uae:         abuDhabiUrl,
}

const AudioCtx = createContext(null)

export function AudioProvider({ children }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying]           = useState(false)
  const [currentCircuit, setCurrentCircuit] = useState(null)

  const stopCurrent = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setIsPlaying(false)
    setCurrentCircuit(null)
  }, [])

  const loadCircuit = useCallback((slug) => {
    // Stop whatever is playing first
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }

    const url = CIRCUIT_AUDIO[slug]
    if (!url) {
      setCurrentCircuit(null)
      setIsPlaying(false)
      return
    }

    setCurrentCircuit(slug)

    const audio = new Audio(url)
    audio.addEventListener('ended', () => setIsPlaying(false), { once: true })
    audioRef.current = audio

    // Attempt autoplay; fall back silently to paused state if browser blocks it
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))
  }, [])

  const toggle = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {})
    }
  }, [isPlaying])

  return (
    <AudioCtx.Provider value={{ isPlaying, currentCircuit, loadCircuit, stopCurrent, toggle }}>
      {children}
    </AudioCtx.Provider>
  )
}

export const useAudio = () => useContext(AudioCtx)
