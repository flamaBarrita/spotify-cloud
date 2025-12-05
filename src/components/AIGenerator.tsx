'use client'

import React, { useState } from 'react';
// Importamos el icono Save
import { Sparkles, Save } from 'lucide-react';
import { SongData } from '@/lib/data';
import AudioCard from './AudioCard';
// Importamos el contexto
import { useLibrary } from '@/context/LibraryContext';

export default function AIGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [playlist, setPlaylist] = useState<SongData[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // 1. Traemos la función de guardar
  const { saveAIPlaylist } = useLibrary();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setPlaylist([]);

    try {
        const res = await fetch('/api/ia-dj', {
            method: 'POST',
            body: JSON.stringify({ userPrompt: prompt })
        });
        const data = await res.json();
        if (data.playlist) {
            setPlaylist(data.playlist);
        }
    } catch (error) {
        console.error("Error generando playlist:", error);
    } finally {
        setIsLoading(false);
    }
  };

  // 2. Manejador para el botón de guardar
  const handleSave = () => {
      const name = window.prompt("¿Qué nombre le ponemos a esta Playlist?", `Mix IA: ${prompt}`);
      if (name) {
          // Extraemos solo los IDs para guardarlos
          const ids = playlist.map(s => s.id);
          saveAIPlaylist(name, ids);
          alert("¡Playlist guardada en tu biblioteca!");
      }
  };

  return (
    <div className="mb-8 bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-6 rounded-xl border border-white/10">
        
        <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-yellow-400" />
            <h3 className="text-xl font-bold text-white">IA DJ: Crea tu Vibe</h3>
        </div>

        <form onSubmit={handleGenerate} className="flex gap-2 mb-6">
            <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='Ej: "Música triste para programar" o "Reggaeton para entrenar"'
                className="flex-1 bg-[#282828] text-white p-4 rounded-full border border-transparent focus:border-[#1DB954] focus:outline-none transition placeholder-gray-500"
            />
            <button 
                type="submit" 
                disabled={isLoading}
                className="bg-[#1DB954] text-black font-bold py-3 px-8 rounded-full hover:scale-105 hover:bg-[#1ed760] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Creando...' : 'Generar'}
            </button>
        </form>

        {isLoading && (
            <div className="text-center text-gray-400 py-4 animate-pulse">
                🤖 La IA está analizando tus gustos...
            </div>
        )}

        {!isLoading && hasSearched && playlist.length === 0 && (
            <div className="text-center text-gray-400 py-4">
                No encontré canciones exactas para eso.
            </div>
        )}

        {playlist.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* ENCABEZADO DE RESULTADOS CON BOTÓN GUARDAR */}
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-gray-300 text-sm font-semibold uppercase tracking-wider">
                        Playlist Generada ({playlist.length} canciones)
                    </h4>
                    
                    {/* BOTÓN DE GUARDAR */}
                    <button 
                        onClick={handleSave}
                        className="flex items-center gap-2 text-sm font-bold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition"
                    >
                        <Save size={16} /> Guardar Playlist
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {playlist.map(song => (
                        <AudioCard key={song.id} song={song} />
                    ))}
                </div>
            </div>
        )}
    </div>
  );
}