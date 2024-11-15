"use client";
import React, { useState } from 'react';

const LiveSpeechEmotionRecognition = () => {
    const [emotion, setEmotion] = useState('No emotion detected');
    const [transcriptText, setTranscriptText] = useState('');

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const base64Audio = await fileToBase64(file);

            const response = await fetch('/api/liveSpeechEmotion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audioData: base64Audio }),
            });
            const { emotion, text } = await response.json();

            setEmotion(emotion);
            setTranscriptText(text);
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <div>
            <h2>Speech Emotion Recognition from Uploaded Audio</h2>
            <input type="file" accept="audio/*" onChange={handleFileUpload} />
            <p>Detected Emotion: {emotion}</p>
            <p>Transcript: {transcriptText}</p>
        </div>
    );
};

export default LiveSpeechEmotionRecognition;
