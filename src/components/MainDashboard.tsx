'use client'

import React, { useEffect, useState } from 'react';
import { SongData } from '@/lib/data';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import PlayerFooter from '@/components/PlayFooter';
import AudioCard from '@/components/AudioCard';
import AIGenerator from '@/components/AIGenerator';
import { useLibrary } from '@/context/LibraryContext';

export default function MainDashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  const [songs, setSongs] = useState<SongData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { currentView, likedSongs, selectedPlaylistId, playlists } = useLibrary();

  useEffect(() => {
    const fetchSongs = async () => {
        try {
            const res = await fetch('/api/songs');
            const data = await res.json();
            if (Array.isArray(data)) setSongs(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchSongs();
  }, []);

  // --- LÓGICA DE VISUALIZACIÓN ---
  let displayedSongs = songs; 
  let viewTitle = greeting;
  
  // 👁️ CONTROL DE LA IA: Por defecto aparece (true)
  let showAI = true; 

  if (currentView === 'liked') {
      // Si estamos en 'Me Gusta', filtramos canciones
      displayedSongs = songs.filter(song => likedSongs.includes(song.id));
      viewTitle = "Tus Me Gusta 💜";
      
      // 👁️ AQUÍ LA OCULTAMOS:
      showAI = false; 
  } else if (currentView === 'playlist' && selectedPlaylistId) {
      // Si estamos en una Playlist, filtramos canciones
      const playlist = playlists.find(p => p.id === selectedPlaylistId);
      if (playlist) {
          displayedSongs = songs.filter(song => playlist.songs.includes(song.id));
          viewTitle = `Playlist: ${playlist.name}`;
          
          // 👁️ AQUÍ TAMBIÉN LA OCULTAMOS:
          showAI = false;
      }
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden font-sans">
        <div className="flex-1 flex overflow-hidden">
            <Sidebar />
            <div className="flex-1 bg-[#121212] rounded-lg my-2 mr-2 overflow-y-auto relative bg-gradient-to-b from-[#1f1f1f] to-[#121212]">
                <TopBar />

                <main className="p-6 pt-2">
                    <h2 className="text-3xl font-bold mb-6">{viewTitle}</h2>
                    
                    {/* 👁️ RENDERIZADO CONDICIONAL: Solo si showAI es true */}
                    {showAI && <AIGenerator />}
                    
                    {isLoading ? (
                        <div className="text-gray-500 animate-pulse mt-10">Cargando...</div>
                    ) : (
                        <>
                            {displayedSongs.length === 0 && currentView !== 'home' && (
                                <div className="text-center py-20 text-gray-500">
                                    <p className="text-xl">Esta lista está vacía.</p>
                                    <p className="text-sm mt-2">Agrega canciones dándole click al corazón ❤️</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-20">
                                {displayedSongs.map(song => (
                                    <AudioCard key={song.id} song={song} />
                                ))}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
        <PlayerFooter />
    </div>
  );
}