import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Silenciar advertencia de Turbopack (opcional, pero recomendado)
  turbopack: {},

  // 2. AUTORIZAR A CLOUDFRONT PARA LAS IMÁGENES
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd3dzx21eajwj7z.cloudfront.net', // Tu dominio de CloudFront
        port: '',
        pathname: '/**', // Permitir cualquier ruta dentro de ese dominio
      },
      // Agrega otros dominios si usas imágenes de Unsplash o Pexels
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },

  // 3. Configuración para arreglar el error de 'fs' (File System)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false, 
        path: false, 
      };
    }
    return config;
  },
};

export default nextConfig;