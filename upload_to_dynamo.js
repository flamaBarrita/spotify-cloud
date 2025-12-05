require('dotenv').config({ path: '.env.local' }); // Carga tus claves de AWS
const fs = require('fs');
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, BatchWriteCommand } = require("@aws-sdk/lib-dynamodb");

// --- CONFIGURACIÓN ---
const TABLE_NAME = "StreamingContent"; // El nombre exacto de tu tabla en AWS
const REGION = "us-west-2"; // <--- ⚠️ IMPORTANTE: Usa la región donde creaste la tabla (Oregon)

// 1. Conexión a AWS
const client = new DynamoDBClient({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});
const docClient = DynamoDBDocumentClient.from(client);

async function uploadData() {
    try {
        // 2. Leer el archivo JSON generado
        if (!fs.existsSync('database_seed.json')) {
            throw new Error("No encuentro el archivo 'database_seed.json'. Corre primero 'node generator.js'");
        }

        const rawData = fs.readFileSync('database_seed.json', 'utf-8');
        const songs = JSON.parse(rawData);

        console.log(`🚀 Iniciando carga masiva de ${songs.length} canciones a la tabla '${TABLE_NAME}'...`);

        // 3. Subir en lotes de 25 (Límite de DynamoDB)
        const chunkSize = 25;
        for (let i = 0; i < songs.length; i += chunkSize) {
            const chunk = songs.slice(i, i + chunkSize);
            
            // Preparamos el paquete de escritura
            const putRequests = chunk.map(song => ({
                PutRequest: {
                    Item: song
                }
            }));

            const command = new BatchWriteCommand({
                RequestItems: {
                    [TABLE_NAME]: putRequests
                }
            });

            await docClient.send(command);
            console.log(`✅ Lote ${(i / chunkSize) + 1} subido con éxito (${chunk.length} items).`);
        }

        console.log("\n🎉 ¡Carga Completa! Tu base de datos está llena y lista para la IA.");

    } catch (error) {
        console.error("❌ Error subiendo datos:", error);
        console.error("👉 Tip: Revisa que tus claves en .env.local sean correctas y que la región sea la misma que en la consola de AWS.");
    }
}

uploadData();