import { NextResponse } from 'next/server';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: "us-west-2", // <--- TU REGIÓN (Oregon)
    credentials: {
        accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!
    }
});

const docClient = DynamoDBDocumentClient.from(client);

export async function GET() {
    try {
        const command = new ScanCommand({
            TableName: "StreamingContent",
        });

        const response = await docClient.send(command);

        // 💥 EL MAPEO CORREGIDO 💥
        const cleanedSongs = (response.Items || []).map((item: any) => ({
            // ID: 
            id: item.id || item.itemId,
            
            // TITULO: 
            title: item.title || item.name || "Sin Título",
            
            // IMAGEN: 
            urlImage: item.urlImage || item.image || item.cover || "/images/default_cover.png",
            
            // DESCRIPCION:
            description: item.description || item.artist || "Artista Desconocido",
            
            // 🚨 AQUÍ ESTABA EL ERROR 🚨
            // Agregamos 'item.audioSRC' a la lista de búsqueda
            audioSrc: item.audioSrc || item.audiosrc || item.audioSRC || item.url || "", 
            
            // EXTRAS:
            genre: item.genre || "General",
            mood: item.mood || "General"
        }));

        return NextResponse.json(cleanedSongs);

    } catch (error) {
        console.error("Error leyendo DynamoDB:", error);
        return NextResponse.json({ error: "Error cargando canciones" }, { status: 500 });
    }
}