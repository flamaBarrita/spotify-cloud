'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

type ViewMode = 'home' | 'liked' | 'playlist';

interface Playlist {
  id: string;
  name: string;
  songs: (string | number)[]; // Aceptamos IDs de texto o número
}

interface LibraryContextData {
  likedSongs: (string | number)[];
  playlists: Playlist[];
  currentView: ViewMode;
  selectedPlaylistId: string | null;
  toggleLike: (songId: string | number) => void;
  isLiked: (songId: string | number) => boolean;
  createPlaylist: (name: string) => void;
  addToPlaylist: (playlistId: string, songId: string | number) => void;
  removeFromPlaylist: (playlistId: string, songId: string | number) => void;
  deletePlaylist: (playlistId: string) => void;
  saveAIPlaylist: (name: string, songIds: (string | number)[]) => void; // <--- NUEVA
  setView: (view: ViewMode, playlistId?: string) => void;
}

const LibraryContext = createContext({} as LibraryContextData);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [likedSongs, setLikedSongs] = useState<(string | number)[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedLikes = localStorage.getItem('my_likes');
        const savedPlaylists = localStorage.getItem('my_playlists');
        if (savedLikes) setLikedSongs(JSON.parse(savedLikes));
        if (savedPlaylists) setPlaylists(JSON.parse(savedPlaylists));
    }
  }, []);

  const toggleLike = (songId: string | number) => {
    let newLikes;
    if (likedSongs.includes(songId)) {
      newLikes = likedSongs.filter(id => id !== songId);
    } else {
      newLikes = [...likedSongs, songId];
    }
    setLikedSongs(newLikes);
    localStorage.setItem('my_likes', JSON.stringify(newLikes));
  };

  const isLiked = (songId: string | number) => likedSongs.includes(songId);

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      songs: []
    };
    const updated = [...playlists, newPlaylist];
    setPlaylists(updated);
    localStorage.setItem('my_playlists', JSON.stringify(updated));
  };

  // --- NUEVA FUNCIÓN PARA LA IA ---
  const saveAIPlaylist = (name: string, songIds: (string | number)[]) => {
      const newPlaylist: Playlist = {
          id: Date.now().toString(),
          name,
          songs: songIds // Guardamos todos los IDs de golpe
      };
      const updated = [...playlists, newPlaylist];
      setPlaylists(updated);
      localStorage.setItem('my_playlists', JSON.stringify(updated));
      // Opcional: Cambiar la vista a la nueva playlist inmediatamente
      // setView('playlist', newPlaylist.id); 
  };

  const deletePlaylist = (playlistId: string) => {
      if(!confirm("¿Seguro que quieres eliminar esta playlist?")) return;
      const updated = playlists.filter(pl => pl.id !== playlistId);
      setPlaylists(updated);
      localStorage.setItem('my_playlists', JSON.stringify(updated));
      if (currentView === 'playlist' && selectedPlaylistId === playlistId) {
          setView('home');
      }
  };

  const addToPlaylist = (playlistId: string, songId: string | number) => {
    const updated = playlists.map(pl => {
        if (pl.id === playlistId && !pl.songs.includes(songId)) {
            return { ...pl, songs: [...pl.songs, songId] };
        }
        return pl;
    });
    setPlaylists(updated);
    localStorage.setItem('my_playlists', JSON.stringify(updated));
  };

  const removeFromPlaylist = (playlistId: string, songId: string | number) => {
    const updated = playlists.map(pl => {
        if (pl.id === playlistId) {
            return { ...pl, songs: pl.songs.filter(id => id !== songId) };
        }
        return pl;
    });
    setPlaylists(updated);
    localStorage.setItem('my_playlists', JSON.stringify(updated));
  };

  const setView = (view: ViewMode, playlistId?: string) => {
      setCurrentView(view);
      if (playlistId) setSelectedPlaylistId(playlistId);
  };

  return (
    <LibraryContext.Provider value={{ 
        likedSongs, playlists, currentView, selectedPlaylistId,
        toggleLike, isLiked, createPlaylist, deletePlaylist, 
        addToPlaylist, removeFromPlaylist, saveAIPlaylist, // <--- EXPORTADA
        setView 
    }}>
      {children}
    </LibraryContext.Provider>
  );
}

export const useLibrary = () => useContext(LibraryContext);