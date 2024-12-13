import React, { useState, useEffect, useRef } from "react";
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const socket = useRef(null);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch("/api/chat");
                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched messages:", data);
                    setMessages(data); 
                } else {
                    console.error("Failed to fetch messages:", response.status);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();

        // Ініціалізація WebSocket
        socket.current = new WebSocket("ws://localhost:5000");
        socket.current.onopen = () => {
            console.log("WebSocket connection established.");
        };

        socket.current.onmessage = (event) => {
            console.log("Message received from server:", event.data);
            const message = JSON.parse(event.data);
            setMessages((prev) => [...prev, message]); 
        };

        socket.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.current.onclose = (event) => {
            console.warn("WebSocket closed:", event);
        };

        // Отримання імені користувача з токена
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1])); 
                setUsername(decodedToken.username || "Anonymous");
            } catch (error) {
                console.error("Error decoding token:", error);
                setUsername("Anonymous");
            }
        } else {
            setUsername("Anonymous"); 
        }

        return () => {
            console.log("WebSocket connection cleanup.");
            socket.current.close();
        };
    }, []);

    const sendMessage = async () => {
        if (!newMessage.trim()) {
            alert("Message cannot be empty.");
            return;
        }
    
        const token = localStorage.getItem("token");
        let username = "";

        if (token) {
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            username = decodedToken.username || "Anonymous";
        }
        if (!token) {
            alert("User is not logged in.");
            return;
        }
    
        const messageData = {
            sender: username || "Anonymous",
            text: newMessage,
            timestamp: new Date().toISOString(),
        };
    
        socket.current.send(JSON.stringify(messageData)); 
        console.log("Message sent:", messageData);
        setNewMessage("");
    };

    return (
        <div className="chat-container">
            <h1 className="chat-header">Welcome to the Chat</h1>
            <p className="chat-quote">“Without music, life would be a mistake.” — Friedrich Nietzsche</p>
            
            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <strong className="message-sender">{msg.sender}:</strong> <span>{msg.text}</span> <br />
                        <small className="message-time">{new Date(msg.timestamp).toLocaleString()}</small>
                    </div>
                ))}
            </div>

            <div className="input-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message"
                    className="message-input"
                />
                <button
                    onClick={sendMessage}
                    className="send-button"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
