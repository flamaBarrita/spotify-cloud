export interface SongData {
    id: number;
    title: string;
    description: string;
    urlImage: string;
    audioSrc: string;
    // NUEVOS CAMPOS PARA LA IA (Opcionales por si alguna canción no tiene)
    genre?: string; 
    mood?: string;  
}

export const contentList: SongData[] = [
    {
        id: 1,
        urlImage: 'https://d3dzx21eajwj7z.cloudfront.net/covers/navidenas/navi3.jpg', // Crea una carpeta 'public/images' y pon una imagen
        title: `Mi Video Híbrido`,
        description: 'Streaming desde AWS CloudFront y OCI Object Storage.',
        audioSrc: 'https://d3dzx21eajwj7z.cloudfront.net/c4.mp3', // ¡REEMPLAZA CON TU URL REAL!
        genre: 'Tech',
        mood: 'Educativo'
    },
    {
        id: 2,
        urlImage: 'https://d3dzx21eajwj7z.cloudfront.net/covers/navidenas/navi1.jpg',
        title: `Canción de Prueba`,
        description: 'Música sin derechos de autor.',
        audioSrc: 'https://d3dzx21eajwj7z.cloudfront.net/c2.mp3', // Reemplaza con otra canción
        genre: 'Piano',
        mood: 'Triste'
    },
    {
        id: 3,
        urlImage: 'https://d3dzx21eajwj7z.cloudfront.net/covers/navidenas/navi3.jpg',
        title: `Otro Género`,
        description: 'Para probar la interfaz de IA.',
        audioSrc: 'https://d3dzx21eajwj7z.cloudfront.net/c1.mp3',
        genre: 'Trap',
        mood: 'Enérgico'
    },
];