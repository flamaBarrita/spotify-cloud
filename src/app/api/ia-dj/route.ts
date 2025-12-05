import { NextResponse } from 'next/server';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
// 1. Nuevas importaciones para leer la Base de Datos
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

// --- CLIENTE DE BEDROCK (IA) ---
const bedrock = new BedrockRuntimeClient({
    region: "us-east-1", 
    credentials: {
        accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!, 
        secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!
    }
});

// --- CLIENTE DE DYNAMODB (Datos) ---
const dbClient = new DynamoDBClient({
    region: "us-west-2", // <--- ⚠️ CONFIRMA QUE SEA TU REGIÓN (Oregon us-west-2)
    credentials: {
        accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!
    }
});
const docClient = DynamoDBDocumentClient.from(dbClient);

export async function POST(request: Request) {
    try {
        const { userPrompt } = await request.json();
        console.log("🤖 IA (Titan) Recibió petición:", userPrompt);

        // --- PASO A: OBTENER DATOS FRESCOS DE DYNAMODB ---
        // En lugar de leer el archivo estático, leemos la nube
        const dbCommand = new ScanCommand({
            TableName: "StreamingContent",
        });
        const dbResponse = await docClient.send(dbCommand);
        
        // Limpiamos los datos igual que en tu dashboard
        const realSongs = (dbResponse.Items || []).map((item: any) => ({
            id: item.id || item.itemId,
            title: item.title || item.name || "Sin Título",
            genre: item.genre || "General",
            mood: item.mood || "General",
            // Guardamos esto para devolver la respuesta completa al final
            originalItem: item 
        }));

        console.log(`📚 La IA está analizando ${realSongs.length} canciones de la BD.`);

        // --- PASO B: PREPARAR EL PROMPT ---
        // Le damos a la IA la lista que acabamos de bajar
        const prompt = `
            Eres un DJ experto. Tienes el siguiente catálogo de música:
            ${JSON.stringify(realSongs.map(s => ({ id: s.id, title: s.title, genre: s.genre, mood: s.mood })))}

            El usuario me pide: "${userPrompt}"

            INSTRUCCIONES:
            1. Analiza el catálogo y encuentra las canciones que coinciden.
            2. RESPONDE ÚNICAMENTE con un JSON Array que contenga los IDs.
            3. NO escribas explicaciones. SOLO el array.
            
            Ejemplo: ["song_001", "song_005"]
            
            Respuesta:
        `;

        // --- PASO C: INVOCAR A TITAN ---
        const payload = {
            inputText: prompt,
            textGenerationConfig: {
                maxTokenCount: 1000,
                temperature: 0, 
                topP: 1,
                stopSequences: []
            }
        };

        const command = new InvokeModelCommand({
            modelId: "amazon.titan-text-express-v1",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify(payload),
        });

        const response = await bedrock.send(command);
        
        // --- PASO D: PROCESAR RESPUESTA ---
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const aiText = responseBody.results[0].outputText; 
        
        console.log("🤖 Respuesta bruta de Titan:", aiText);

        const jsonMatch = aiText.match(/\[.*\]/s);
        if (!jsonMatch) {
            throw new Error("La IA no devolvió una lista válida.");
        }

        const ids = JSON.parse(jsonMatch[0]);
        
        // Filtramos usando la lista que bajamos de DynamoDB
        const playlist = realSongs
            .filter((song: any) => ids.includes(song.id))
            .map((song: any) => ({
                id: song.id,
                title: song.title,
                genre: song.genre,
                mood: song.mood,
                // Recuperamos las URLs del objeto original de Dynamo
                urlImage: song.originalItem.urlImage || song.originalItem.image || "/images/default_cover.png",
                audioSrc: song.originalItem.audioSrc || song.originalItem.audioSRC || "",
                description: song.originalItem.description || ""
            }));

        return NextResponse.json({ playlist });

    } catch (error: any) {
        console.error("❌ Error en IA-DJ:", error);
        return NextResponse.json(
            { error: error.message || "Error generando playlist" }, 
            { status: 500 }
        );
    }
}