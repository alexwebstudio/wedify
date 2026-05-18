'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Music2, Volume2, VolumeX } from 'lucide-react'
import type { ProjectMusic } from '@/types'

interface MusicPlayerProps {
  music: ProjectMusic
  accentColor?: string
}

export function MusicPlayer({ music, accentColor = '#C4A97D' }: MusicPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [interacted, setInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!music.url) return
    audioRef.current = new Audio(music.url)
    audioRef.current.loop = true
    audioRef.current.volume = 0.6

    return () => {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [music.url])

  useEffect(() => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.play().catch(() => setPlaying(false))
    } else {
      audioRef.current.pause()
    }
  }, [playing])

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

  // Autoplay after first interaction
  useEffect(() => {
    if (!music.autoplay || interacted || !music.url) return
    const handler = () => {
      setInteracted(true)
      setPlaying(true)
    }
    document.addEventListener('click', handler, { once: true })
    document.addEventListener('touchstart', handler, { once: true })
    return () => {
      document.removeEventListener('click', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [music.autoplay, interacted, music.url])

  if (!music.url) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2"
    >
      {/* Title pill */}
      <AnimatePresence>
        {playing && music.title && (
          <motion.div
            initial={{ opacity: 0, x: 10, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 'auto' }}
            exit={{ opacity: 0, x: 10, width: 0 }}
            className="glass-dark rounded-full px-4 py-2 text-xs text-white/80 whitespace-nowrap overflow-hidden"
          >
            ♪ {music.title}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mute button */}
      {playing && (
        <button
          onClick={() => setMuted(!muted)}
          className="w-10 h-10 rounded-full glass-dark flex items-center justify-center text-white/70 hover:text-white transition-colors"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      )}

      {/* Play/Pause */}
      <button
        onClick={() => setPlaying(!playing)}
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{ background: `linear-gradient(135deg, ${accentColor}, #8B6F47)` }}
      >
        <AnimatePresence mode="wait">
          {playing ? (
            <motion.div key="pause" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Pause size={18} className="text-white fill-white" />
            </motion.div>
          ) : (
            <motion.div key="play" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Play size={18} className="text-white fill-white ml-0.5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse rings when playing */}
        {playing && (
          <>
            <span className="absolute w-full h-full rounded-full animate-ping opacity-20"
              style={{ background: accentColor }} />
          </>
        )}
      </button>
    </motion.div>
  )
}
