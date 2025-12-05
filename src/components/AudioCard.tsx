'use client'

import React, { useState } from 'react';
import Image from 'next/image';
// Importamos Trash2
import { Play, Heart, ListPlus, Check, Trash2 } from 'lucide-react'; 
import { SongData } from '@/lib/data';
import { usePlayer } from '@/context/PlayerContext';
import { useLibrary } from '@/context/LibraryContext';

interface AudioCardProps {
    song: SongData;
}

export default function AudioCard({ song }: AudioCardProps) {
    const { playSong } = usePlayer();
    // Traemos todo lo necesario del contexto
    const { toggleLike, isLiked, playlists, addToPlaylist, removeFromPlaylist, currentView, selectedPlaylistId } = useLibrary();
    
    const [showMenu, setShowMenu] = useState(false);
    const liked = isLiked(song.id);

    // Lógica inteligente para el botón de playlist
    const handlePlaylistAction = (playlistId: string, isAlreadyIn: boolean) => {
        if (isAlreadyIn) {
            removeFromPlaylist(playlistId, song.id); // Si ya está, la quita (Toggle)
        } else {
            addToPlaylist(playlistId, song.id); // Si no está, la pone
        }
    };

    // ¿Estamos viendo una playlist específica ahora mismo?
    const isInsidePlaylistView = currentView === 'playlist' && selectedPlaylistId;

    return (
        <div 
            className="group bg-[#181818] hover:bg-[#282828] p-4 rounded-lg transition duration-300 cursor-pointer relative flex flex-col gap-2"
            onMouseLeave={() => setShowMenu(false)}
        >
            {/* Imagen */}
            <div 
                className="relative w-full aspect-square shadow-lg rounded-md overflow-hidden"
                onClick={() => playSong(song)}
            >
                <Image src={song.urlImage} alt={song.title} fill style={{objectFit: 'cover'}} />
                <button className="absolute bottom-2 right-2 bg-[#1DB954] p-3 rounded-full shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 hover:bg-[#1ed760]">
                    <Play fill="black" size={20} />
                </button>
            </div>
            
            {/* Info */}
            <div className="flex justify-between items-start mt-2 relative">
                <div onClick={() => playSong(song)} className="flex-1 pr-2 overflow-hidden">
                    <h3 className="text-white font-bold truncate text-base">{song.title}</h3>
                    <p className="text-[#a7a7a7] text-sm line-clamp-2">{song.description}</p>
                </div>
                
                <div className="flex items-center gap-1">
                    
                    {/* --- BOTÓN INTELIGENTE (Lista o Basura) --- */}
                    {isInsidePlaylistView ? (
                        // MODO: DENTRO DE PLAYLIST -> Muestra Basura para quitarla rápido
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                removeFromPlaylist(selectedPlaylistId!, song.id);
                            }}
                            className="transition p-1 rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-500"
                            title="Quitar de esta playlist"
                        >
                            <Trash2 size={20} />
                        </button>
                    ) : (
                        // MODO: INICIO/LIKES -> Muestra Menú para añadir
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            className={`transition p-1 rounded-full hover:bg-white/10 ${showMenu ? 'text-white' : 'text-gray-400'}`}
                            title="Gestionar Playlists"
                        >
                            <ListPlus size={20} />
                        </button>
                    )}

                    {/* Botón Like */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            toggleLike(song.id);
                        }}
                        className={`transition p-1 hover:scale-110 ${liked ? 'text-[#1DB954]' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Heart size={20} fill={liked ? '#1DB954' : 'none'} />
                    </button>
                </div>

                {/* MENÚ DESPLEGABLE (Solo si NO estamos dentro de una playlist específica) */}
                {showMenu && !isInsidePlaylistView && (
                    <div className="absolute bottom-8 right-0 w-48 bg-[#282828] rounded-md shadow-2xl border border-white/5 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-2 border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Tus Playlists
                        </div>
                        
                        <div className="max-h-40 overflow-y-auto">
                            {playlists.length === 0 ? (
                                <div className="p-3 text-sm text-gray-500 text-center italic">
                                    Crea una playlist primero.
                                </div>
                            ) : (
                                playlists.map(pl => {
                                    const isAlreadyIn = pl.songs.includes(song.id);
                                    
                                    return (
                                        <button
                                            key={pl.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePlaylistAction(pl.id, isAlreadyIn);
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm text-white hover:bg-[#3e3e3e] flex items-center justify-between transition group/item"
                                        >
                                            <span className={`truncate pr-2 ${isAlreadyIn ? 'text-[#1DB954]' : ''}`}>
                                                {pl.name}
                                            </span>
                                            {/* Si ya está, mostramos Check (o X al pasar mouse) */}
                                            {isAlreadyIn && <Check size={14} className="text-[#1DB954]" />}
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}