'use client'

import React from 'react';
// Quitamos 'Search' de los imports
import { Home, Library, PlusSquare, Heart, Music, Trash2 } from 'lucide-react';
import { useLibrary } from '@/context/LibraryContext';

export default function Sidebar() {
  const { playlists, createPlaylist, likedSongs, setView, deletePlaylist } = useLibrary();

  const handleCreate = () => {
    const name = prompt("Nombre de la nueva playlist:");
    if (name) createPlaylist(name);
  };

  return (
    <div className="w-64 bg-black h-full flex-col hidden md:flex gap-2 p-2">
      
      {/* BLOQUE DE NAVEGACIÓN (Ahora solo tiene Inicio) */}
      <div className="bg-[#121212] rounded-lg p-4 flex flex-col gap-4">
        <div 
            onClick={() => setView('home')} 
            className="flex items-center gap-4 text-white font-bold cursor-pointer hover:text-green-400 transition"
        >
            <Home /> <span>Inicio</span>
        </div>
        {/* Se eliminó el botón de Buscar aquí */}
      </div>

      {/* BLOQUE DE LIBRERÍA */}
      <div className="bg-[#121212] rounded-lg p-4 flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between text-gray-400 hover:text-white cursor-pointer transition">
            <div className="flex items-center gap-2 font-bold">
                <Library /> <span>Tu Biblioteca</span>
            </div>
            <button onClick={handleCreate} className="hover:text-white hover:scale-110 transition" title="Crear Playlist">
                <PlusSquare size={24} />
            </button>
        </div>
        
        <div className="mt-4 flex flex-col gap-2 overflow-y-auto">
            {/* Tus Me Gusta */}
            <div 
                onClick={() => setView('liked')} 
                className="flex items-center gap-3 cursor-pointer hover:bg-[#1a1a1a] p-2 rounded group"
            >
                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 w-12 h-12 rounded flex items-center justify-center group-hover:scale-105 transition">
                    <Heart fill="white" size={20}/>
                </div>
                <div>
                    <p className="text-white font-medium">Tus Me Gusta</p>
                    <p className="text-gray-400 text-sm">Playlist • {likedSongs.length} canciones</p>
                </div>
            </div>

            {/* LISTA DE PLAYLISTS */}
            {playlists.map(pl => (
                <div 
                    key={pl.id} 
                    onClick={() => setView('playlist', pl.id)} 
                    className="flex items-center justify-between cursor-pointer hover:bg-[#1a1a1a] p-2 rounded group"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-[#282828] w-12 h-12 rounded flex items-center justify-center">
                            <Music size={20} className="text-gray-400"/>
                        </div>
                        <div>
                            <p className="text-white font-medium truncate w-24">{pl.name}</p>
                            <p className="text-gray-400 text-sm">{pl.songs.length} canciones</p>
                        </div>
                    </div>

                    {/* Botón de Borrar */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            deletePlaylist(pl.id);
                        }}
                        className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-2"
                        title="Eliminar Playlist"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}