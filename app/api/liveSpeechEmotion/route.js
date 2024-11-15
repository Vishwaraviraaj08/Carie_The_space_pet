import { AssemblyAI } from 'assemblyai';

const assemblyAI = new AssemblyAI({
    apiKey: "46d14b41d4d14927ba625df326abbcac"
});

export async function POST(req) {
    try {
        const { audioData } = await req.json();

        if (!audioData) {
            console.error("audioData is undefined. Ensure the client is sending base64 audio data.");
            return new Response(JSON.stringify({ error: "audioData is missing from the request" }), { status: 400 });
        }

        const base64Audio = audioData.includes(",") ? audioData.split(",")[1] : audioData;

        const buffer = Buffer.from(base64Audio, 'base64');

        // Log buffer info for debugging
        console.log("Buffer length:", buffer.length);

        // Use fetch to upload the binary audio file to AssemblyAI
        const formData = new FormData();
        formData.append('file', new Blob([buffer], { type: 'audio/wav' }));

        const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
            method: 'POST',
            headers: {
                'authorization': '46d14b41d4d14927ba625df326abbcac', // Your API key
            },
            body: formData,
        });

        if (!uploadResponse.ok) {
            throw new Error(`Failed to upload audio: ${uploadResponse.statusText}`);
        }

        const uploadResult = await uploadResponse.json();
        const audioUrl = uploadResult.upload_url;

        // Now send the uploaded URL to AssemblyAI for transcription
        const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
            method: 'POST',
            headers: {
                'authorization': '46d14b41d4d14927ba625df326abbcac', // Your API key
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                audio_url: audioUrl,
                sentiment_analysis: true // Enable sentiment analysis
            }),
        });

        if (!transcriptResponse.ok) {
            throw new Error(`Failed to create transcript: ${transcriptResponse.statusText}`);
        }

        const transcript = await transcriptResponse.json();
        const emotion = transcript.sentiment || 'No emotion detected';
        console.log("Transcript:", transcript.text);
        console.log("Emotion:", emotion);

        return new Response(JSON.stringify({ message: emotion, transcript: transcript.text }), { status: 200 });
    } catch (error) {
        console.error("AssemblyAI API error:", error);
        return new Response(JSON.stringify({ error: "Emotion detection failed", details: error.message }), { status: 500 });
    }
}
