'use client'

import React from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { SongData } from '@/lib/data';
import { usePlayer } from '@/context/PlayerContext';

interface AudioCardProps {
    song: SongData;
}

export default function AudioCard({ song }: AudioCardProps) {
    const { playSong } = usePlayer();

    return (
        <div 
            className="group bg-[#181818] hover:bg-[#282828] p-4 rounded-lg transition duration-300 cursor-pointer relative"
            onClick={() => playSong(song)}
        >
            <div className="relative w-full aspect-square mb-4 shadow-lg rounded-md overflow-hidden">
                <Image 
                    src={song.urlImage} 
                    alt={song.title} 
                    fill 
                    style={{objectFit: 'cover'}}
                />
                
                {/* Botón de Play Verde flotante (Aparece al hacer hover) */}
                <button className="absolute bottom-2 right-2 bg-[#1DB954] p-3 rounded-full shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 hover:bg-[#1ed760]">
                    <Play fill="black" size={20} />
                </button>
            </div>
            
            <h3 className="text-white font-bold truncate mb-1">{song.title}</h3>
            <p className="text-[#a7a7a7] text-sm line-clamp-2">{song.description}</p>
        </div>
    );
}