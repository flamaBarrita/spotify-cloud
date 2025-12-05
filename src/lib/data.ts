export interface SongData {
    id: number;
    title: string;
    description: string;
    urlImage: string;
    audioSrc: string; // URL de AWS CloudFront
}

export const contentList: SongData[] = [
    {
        id: 1,
        urlImage: '/images/Frame1.png', // Crea una carpeta 'public/images' y pon una imagen
        title: `Mi Video Híbrido`,
        description: 'Streaming desde AWS CloudFront y OCI Object Storage.',
        audioSrc: 'https://d3dzx21eajwj7z.cloudfront.net/c4.mp3', // ¡REEMPLAZA CON TU URL REAL!
    },
    {
        id: 2,
        urlImage: '/images/Frame2.png',
        title: `Canción de Prueba`,
        description: 'Música sin derechos de autor.',
        audioSrc: 'https://d3dzx21eajwj7z.cloudfront.net/c2.mp3', // Reemplaza con otra canción
    },
    {
        id: 3,
        urlImage: '/images/Frame3.png',
        title: `Otro Género`,
        description: 'Para probar la interfaz de IA.',
        audioSrc: 'https://d3dzx21eajwj7z.cloudfront.net/c1.mp3',
    },
];