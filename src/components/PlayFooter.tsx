'use client'

import React, { useContext, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { PlayerContext } from '@/context/PlayerContext';

export default function PlayerFooter() {
    const { currentSong, isPlaying, togglePlayPause, setIsPlaying } = useContext(PlayerContext);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Conecta el estado del Contexto al elemento HTML <audio>
    useEffect(() => {
      if (audioRef.current && currentSong) {
        if (isPlaying) {
          audioRef.current.play().catch(e => console.log("Autoplay bloqueado:", e));
        } else {
          audioRef.current.pause();
        }
      }
    }, [isPlaying, currentSong]);
    console.log("🎵 Datos de la canción actual:", currentSong);
    console.log("🔗 URL del audio:", currentSong?.audioSrc);

    if (!currentSong) {
        return (
            <footer className="bg-gray-800 p-4 text-center border-t border-gray-700">
                Selecciona una canción para reproducir.
            </footer>
        );
    }

    return (
        <footer className="bg-gray-800 p-4 border-t border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <button 
                    onClick={togglePlayPause} 
                    className="bg-white text-black p-3 rounded-full hover:scale-105 transition"
                >
                    {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className='ml-[2px]' />}
                </button>
                <div>
                    <p className="font-semibold">{currentSong.title}</p>
                    <p className="text-xs text-gray-400">Streaming Híbrido (OCI via AWS)</p>
                </div>
            </div>
            
            {/* Elemento de audio real - Oculto */}
            <audio 
                ref={audioRef} 
                src={currentSong.audioSrc} 
                onEnded={() => setIsPlaying(false)}
            />
        </footer>
    );
}