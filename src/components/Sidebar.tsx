'use client'

import React from 'react';
import { Home, Search, Library, PlusSquare, Heart } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 bg-black h-full flex-col hidden md:flex gap-2 p-2">
      {/* Bloque de Navegación Principal */}
      <div className="bg-[#121212] rounded-lg p-4 flex flex-col gap-4">
        <div className="flex items-center gap-4 text-white font-bold cursor-pointer hover:text-white transition">
            <Home /> <span>Inicio</span>
        </div>
        <div className="flex items-center gap-4 text-gray-400 font-bold cursor-pointer hover:text-white transition">
            <Search /> <span>Buscar</span>
        </div>
      </div>

      {/* Bloque de Librería */}
      <div className="bg-[#121212] rounded-lg p-4 flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between text-gray-400 hover:text-white cursor-pointer transition">
            <div className="flex items-center gap-2 font-bold">
                <Library /> <span>Tu Biblioteca</span>
            </div>
            <PlusSquare size={20} />
        </div>
        
        {/* Chips de filtros */}
        <div className="flex gap-2 mt-2">
            <span className="bg-[#2a2a2a] px-3 py-1 rounded-full text-xs font-medium text-white cursor-pointer hover:bg-[#3a3a3a]">Playlists</span>
            <span className="bg-[#2a2a2a] px-3 py-1 rounded-full text-xs font-medium text-white cursor-pointer hover:bg-[#3a3a3a]">Artistas</span>
        </div>

        {/* Lista simulada (Scrollable) */}
        <div className="overflow-y-auto flex-1 mt-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer hover:bg-[#1a1a1a] p-2 rounded">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 w-12 h-12 rounded flex items-center justify-center">
                    <Heart fill="white" size={20}/>
                </div>
                <div>
                    <p className="text-white font-medium">Tus Me Gusta</p>
                    <p className="text-gray-400 text-sm">Playlist • 123 canciones</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}