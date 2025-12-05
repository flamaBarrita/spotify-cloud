const fs = require('fs');
const path = require('path');

// --- 1. CONFIGURACIÓN CLOUDFRONT ---
const CLOUDFRONT_DOMAIN = 'd3dzx21eajwj7z.cloudfront.net'; 

// Carpeta local donde tienes tus MP3 organizados por género
const FOLDER_PATH = './musica_descargada'; 

// Función para limpiar texto (quita extensión y guiones)
const cleanText = (text) => text.replace(/\.mp3$/i, '').trim();

function generateJSON() {
    try {
        // Leemos las carpetas locales (que representan los géneros)
        const genresFolders = fs.readdirSync(FOLDER_PATH, { withFileTypes: true });
        const allSongs = [];
        let globalIndex = 1;

        console.log(`📂 Escaneando música en ${FOLDER_PATH}...`);

        genresFolders.forEach(dirent => {
            if (!dirent.isDirectory()) return; 

            // El nombre de la carpeta local será el GENERO (ej: "navidenas", "pop")
            const genre = dirent.name; 
            const genrePath = path.join(FOLDER_PATH, genre);
            const files = fs.readdirSync(genrePath);

            console.log(`   🎵 Procesando género: ${genre} (${files.length} canciones)`);

            files.forEach(file => {
                if (!file.toLowerCase().endsWith('.mp3')) return;

                // Separar Mood y Título del nombre del archivo
                // Formato esperado: Mood_Titulo.mp3
                const parts = file.split('_');
                let mood = 'General';
                let title = cleanText(file);

                if (parts.length >= 2) {
                    mood = cleanText(parts[0]);
                    title = cleanText(parts.slice(1).join(' '));
                }

                // --- 2. GENERACIÓN DE URLS (LA CLAVE) ---

                // URL DEL AUDIO
                // Estructura OCI: music/GENERO/ARCHIVO.mp3
                // CloudFront: https://DOMINIO/music/GENERO/ARCHIVO.mp3
                const audioPath = `music/${genre}/${file}`;
                
                // Codificamos cada parte de la ruta para que los espacios y caracteres raros no rompan el link
                const finalAudioUrl = `https://${CLOUDFRONT_DOMAIN}/${audioPath.split('/').map(encodeURIComponent).join('/')}`;

                // URL DE LA IMAGEN
                // Estructura OCI: covers/GENERO/cover.jpg
                // CloudFront: https://DOMINIO/covers/GENERO/cover.jpg
                // *ASUMIMOS* que subiste una foto llamada "cover.jpg" dentro de cada carpeta de género en OCI
                const imagePath = `covers/${genre}/cover.jpg`;
                const finalImageUrl = `https://${CLOUDFRONT_DOMAIN}/${imagePath.split('/').map(encodeURIComponent).join('/')}`;

                const songObj = {
                    itemId: `song_${String(globalIndex).padStart(3, '0')}`,
                    title: title,
                    genre: genre,
                    mood: [mood],
                    audioSrc: finalAudioUrl, 
                    urlImage: finalImageUrl, 
                    description: `${genre} - Vibe: ${mood}`
                };

                allSongs.push(songObj);
                globalIndex++;
            });
        });

        fs.writeFileSync('database_seed.json', JSON.stringify(allSongs, null, 2));
        console.log(`\n✅ ¡LISTO! JSON generado apuntando a las rutas 'music/' y 'covers/' de OCI.`);
        console.log(`   🔗 Ejemplo Audio: https://${CLOUDFRONT_DOMAIN}/music/pop/Fiesta_Cancion.mp3`);
        console.log(`   🔗 Ejemplo Cover: https://${CLOUDFRONT_DOMAIN}/covers/pop/cover.jpg`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

generateJSON();