"use client"

import { useState, useEffect, useRef } from "react";
import styles from "../page.module.css";
import Head from "next/head";
import {useRouter} from "next/navigation";
import Link from "next/link";


export default function Chatbot({ dominantEmotion }) {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatBodyRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        if (!sessionStorage.getItem('user')){
            router.push('/login')
        }
    }, []);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = () => {
        if (!userInput.trim()) return;

        setMessages((prevMessages) => [
            ...prevMessages,
            { text: userInput, sender: "user" },
        ]);

        setUserInput("");
        setLoading(true);

        setTimeout(async () => {
            const botReply = await generateBotResponse(userInput);
            setLoading(false)
            typeOutMessage(botReply);
        }, 500);
    };

    const generateBotResponse = async (message) => {
        const reply = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message, emotion: dominantEmotion }),
        })
            .then((res) => res.json())
            .then((data) => data.message)
            .catch(() => {
                setLoading(false);
                return "I'm sorry, something went wrong. Please try again later.";
            });

        return reply;
    };

    const typeOutMessage = (message) => {
        let index = 0;
        const typedMessage = { text: "", sender: "bot" };

        setMessages((prevMessages) => [...prevMessages, typedMessage]);

        const typingInterval = setInterval(() => {
            if (index < message.length) {
                typedMessage.text += message[index];
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages];
                    updatedMessages[updatedMessages.length - 1] = { ...typedMessage };
                    return updatedMessages;
                });
                index++;
            } else {
                clearInterval(typingInterval);
            }
        }, 50);
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.chatbotContainer}>
                <Head>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
                        rel="stylesheet"
                    />
                </Head>
                <div style={{display:"flex", justifyContent:'space-evenly', alignItems:'center', backgroundColor:'#3a3a3a'}}>
                    <div className={styles.chatHeader}>Carie: The Space Pet</div>
                    <Link href={"/emotion-recog"}>
                        <button className={styles.sendButton} >
                            Emotion Recognition
                        </button>
                    </Link>

                </div>
                <div className={styles.chatBody} ref={chatBodyRef}>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`${styles.message} ${
                                msg.sender === "user" ? styles.userMessage : styles.botMessage
                            }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    {loading && (
                        <div className={`${styles.message} ${styles.botMessage}`}>
                            <div className={styles.typingAnimation}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}
                </div>
                <div className={styles.chatInputContainer}>
                    <input
                        type="text"
                        className={styles.userInput}
                        placeholder="Type a message..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button className={styles.sendButton} onClick={handleSend}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
