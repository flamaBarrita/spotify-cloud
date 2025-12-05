import type { Metadata } from "next";
import { Inter } from "next/font/google";

// 1. IMPORTAR ESTILOS DE TAILWIND
import "./globals.css"; 
// 2. IMPORTAR ESTILOS BASE DE AWS (¡Esto arregla el formulario feo!)
import "@aws-amplify/ui-react/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Streaming Híbrido",
  description: "Proyecto AWS + OCI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}