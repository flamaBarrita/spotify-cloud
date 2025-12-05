'use client'

import { createContext, useState, useContext, ReactNode } from 'react'

interface Song {
  title: string;
  description: string;
  urlImage: string;
  audioSrc?: string; // Enlace a AWS CloudFront
}

interface PlayerContextData {
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song) => void;
  togglePlayPause: () => void;
  setIsPlaying: (playing: boolean) => void;
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  function playSong(song: Song) {
    setCurrentSong(song)
    setIsPlaying(true) 
  }
  
  function togglePlayPause() {
      setIsPlaying(prev => !prev);
  }

  return (
    <PlayerContext.Provider value={{ currentSong, playSong, isPlaying, togglePlayPause, setIsPlaying }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => useContext(PlayerContext)