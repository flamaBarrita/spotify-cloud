'use client'; // <--- ESTA LÍNEA ES OBLIGATORIA Y DEBE IR AL PRINCIPIO

import Image from "next/image";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";

import { PlayerProvider } from '@/context/PlayerContext';
import MainDashboard from '@/components/MainDashboard'; // Lo crearemos en el siguiente paso
import { LibraryProvider } from '@/context/LibraryContext'; // <

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-west-2_kGK9hV71v",
      userPoolClientId: "37aa0sd8enkuui83natm82gtm2",
      signUpVerificationMethod: "code",
      loginWith: {
        email: true,
      },
    },
  },
});



// Componente que maneja la lógica de la App una vez logueado
const ProtectedApp = () => (
    <PlayerProvider>
        <LibraryProvider>
            <MainDashboard />
        </LibraryProvider>
        
    </PlayerProvider>
)

export default function Home() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <ProtectedApp />
      )}
    </Authenticator>
  )
}