"use client"
import React, { useEffect, useRef, useState } from 'react';

const FaceRecognition = ({ onEmotionChange }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [emotion, setEmotion] = useState('No face detected');
    const sadnessThreshold = 0.4;

    useEffect(() => {
        const loadFaceApiScript = () => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = '/face-api.min.js';
                script.async = true;
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            });
        };

        const loadModels = async () => {
            await loadFaceApiScript();
            const faceapi = window.faceapi;

            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
            await faceapi.nets.faceExpressionNet.loadFromUri('/models');
        };

        const startVideo = () => {
            navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            });
        };

        const handlePlay = async () => {
            const faceapi = window.faceapi;
            const video = videoRef.current;
            const canvas = canvasRef.current;

            canvas.width = video.width;
            canvas.height = video.height;
            const displaySize = { width: video.width, height: video.height };
            faceapi.matchDimensions(canvas, displaySize);

            setInterval(async () => {
                const detections = await faceapi
                    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceExpressions();

                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                const context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);

                faceapi.draw.drawDetections(canvas, resizedDetections);
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
                faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

                if (detections.length > 0) {
                    const expressions = detections[0].expressions;
                    const sadnessLevel = expressions.sad || 0;
                    const happinessLevel = expressions.happy || 0;
                    const neutralLevel = expressions.neutral || 0;

                    let detectedEmotion = 'Neutral';
                    if (happinessLevel < 0.5 && sadnessLevel > sadnessThreshold) {
                        detectedEmotion = 'Sad';
                    } else if (happinessLevel < 0.5 && neutralLevel < 0.95) {
                        detectedEmotion = 'Sad';
                    } else if (happinessLevel >= 0.5) {
                        detectedEmotion = 'Happy';
                    }

                    setEmotion(detectedEmotion);
                    if (onEmotionChange) {
                        onEmotionChange(detectedEmotion);
                    }
                } else {
                    setEmotion('No face detected');
                }
            }, 100);
        };

        const handleResize = () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (video && canvas) {
                canvas.width = video.clientWidth;
                canvas.height = video.clientHeight;
            }
        };

        loadModels().then(() => {
            startVideo();
        });

        videoRef.current?.addEventListener('play', handlePlay);
        window.addEventListener('resize', handleResize);

        return () => {
            videoRef.current?.removeEventListener('play', handlePlay);
            window.removeEventListener('resize', handleResize);
        };
    }, [onEmotionChange]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <video ref={videoRef} autoPlay muted width="720" height="560" style={{ position: 'relative', zIndex: 1 }} />
                <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }} />
            </div>
            <div style={{ marginTop: '20px', fontSize: '24px', fontWeight: 'bold' }}>
                Emotion Recognized : {emotion}
            </div>
        </div>
    );
};

export default FaceRecognition;
















