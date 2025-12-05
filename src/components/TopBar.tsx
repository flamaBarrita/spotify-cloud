'use client'

import React from 'react';
import { ChevronLeft, ChevronRight, User, LogOut } from 'lucide-react';
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function TopBar() {
  const { signOut, user } = useAuthenticator((context) => [context.user]);

  return (
    <header className="h-16 bg-[#101010]/90 sticky top-0 z-10 flex items-center justify-between px-6 backdrop-blur-md">
        <div className="flex gap-2">
            <button className="bg-black/70 rounded-full p-1 text-gray-400 cursor-not-allowed">
                <ChevronLeft />
            </button>
            <button className="bg-black/70 rounded-full p-1 text-gray-400 cursor-not-allowed">
                <ChevronRight />
            </button>
        </div>

        <div className="flex items-center gap-4">
            {/* ELIMINADO EL BOTÓN PREMIUM */}

            <div className="group relative">
                <button className="bg-black p-1 rounded-full border border-transparent hover:border-gray-500 transition flex items-center gap-2 pr-3">
                    <div className="bg-[#2a2a2a] p-1 rounded-full">
                        <User size={20} className="text-white"/>
                    </div>
                    <span className="text-white font-bold text-sm max-w-[150px] truncate">
                        {user?.signInDetails?.loginId || 'Usuario'}
                    </span>
                </button>
                
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#282828] rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-1">
                    <button 
                        onClick={signOut} 
                        className="w-full text-left text-sm text-white hover:bg-[#3e3e3e] p-2 rounded flex items-center gap-2"
                    >
                        <LogOut size={16} /> Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    </header>
  );
}