'use client'
import React, { useState } from 'react';
import FaceRecognition from '@/app/emotion-recog/page';
import Chatbot from '@/app/chat-section/page';

export default function EmotionChatPage() {
    const [emotion, setEmotion] = useState("Neutral");

    return (
        <>

            <Chatbot dominantEmotion={emotion} />
            <FaceRecognition onEmotionChange={setEmotion} />
        </>
    );
}
