'use client'

import React from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useAuthenticator } from '@aws-amplify/ui-react'; // Hook mágico de AWS

export default function TopBar() {
  const { signOut, user } = useAuthenticator((context) => [context.user]);

  return (
    <header className="h-16 bg-[#101010]/90 sticky top-0 z-10 flex items-center justify-between px-6 backdrop-blur-md">
        {/* Flechas de navegación (Decorativas) */}
        <div className="flex gap-2">
            <button className="bg-black/70 rounded-full p-1 text-gray-400 cursor-not-allowed">
                <ChevronLeft />
            </button>
            <button className="bg-black/70 rounded-full p-1 text-gray-400 cursor-not-allowed">
                <ChevronRight />
            </button>
        </div>

        {/* Botón de Perfil y Salir */}
        <div className="flex items-center gap-4">
            {/* Botón Premium simulado */}
            <button className="bg-white text-black font-bold text-sm px-4 py-1.5 rounded-full hover:scale-105 transition hidden sm:block">
                Ver Planes Premium
            </button>

            {/* Botón de Logout Real */}
            <div className="group relative">
                <button className="bg-black p-1 rounded-full border border-transparent hover:border-gray-500 transition flex items-center gap-2 pr-3">
                    <div className="bg-[#2a2a2a] p-1 rounded-full">
                        <User size={20} className="text-white"/>
                    </div>
                    <span className="text-white font-bold text-sm max-w-[100px] truncate">
                        {user?.signInDetails?.loginId || 'Usuario'}
                    </span>
                </button>
                
                {/* Menú desplegable simple al hacer hover */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#282828] rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-1">
                    <button 
                        onClick={signOut} // <--- ESTO CIERRA SESIÓN EN COGNITO
                        className="w-full text-left text-sm text-white hover:bg-[#3e3e3e] p-2 rounded"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    </header>
  );
}