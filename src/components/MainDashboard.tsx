'use client'

import React from 'react';
import { contentList } from '@/lib/data';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import PlayerFooter from '@/components/PlayFooter';
import AudioCard from '@/components/AudioCard';

export default function MainDashboard() {
  // Saludo dinámico según la hora
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden font-sans">
        
        {/* Contenedor Central (Sidebar + Contenido) */}
        <div className="flex-1 flex overflow-hidden">
            <Sidebar />
            
            {/* Área Principal con Scroll */}
            <div className="flex-1 bg-[#121212] rounded-lg my-2 mr-2 overflow-y-auto relative bg-gradient-to-b from-[#1f1f1f] to-[#121212]">
                <TopBar />

                <main className="p-6 pt-2">
                    {/* Sección de Bienvenida */}
                    <h2 className="text-3xl font-bold mb-6">{greeting}</h2>
                    
                    {/* Grid de Canciones */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {contentList.map(song => (
                            <AudioCard key={song.id} song={song} />
                        ))}
                    </div>
                </main>
            </div>
        </div>

        {/* Reproductor Fijo Abajo */}
        <PlayerFooter />
    </div>
  );
}