//222222
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http"); 
const WebSocket = require("ws"); 
const path = require('path');
require("dotenv").config();

// Імпорт маршрутів
const userRoutes = require("./routes/userRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const musicRoutes = require("./routes/musicRoutes");
const chatRoutes = require("./routes/chatRoutes");
const tournamentRoutes = require('./routes/tournamentRoutes');


// Імпорт моделі
const User = require("./models/userMongo");
const Session = require("./models/sessionMongo");
const Music = require("./models/musicMongo");
const Chat = require("./models/chatMongo");
const Message = require('./models/messageMongo');
const Tournament = require("./models/tournamentMongo");

// Налаштування Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

console.log("JWT_SECRET:", process.env.JWT_SECRET);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("API is working!");
});
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/chat", chatRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Створення HTTP-сервера
const server = http.createServer(app);

// Налаштування WebSocket
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("New WebSocket connection established.");

    ws.on("message", async (data) => {
        console.log("Received message:", data);
        try {
            const messageData = JSON.parse(data);

            if (!messageData.sender || !messageData.text) {
                console.warn("Invalid message format");
                ws.send(JSON.stringify({ error: "Invalid message format" }));
                return;
            }

            const newMessage = new Message({
                sender: messageData.sender,
                text: messageData.text,
                timestamp: new Date(),
            });

            await newMessage.save();

            console.log("Message saved to database:", newMessage);

            // Відправка повідомлення всім клієнтам
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(newMessage));
                }
            });
        } catch (err) {
            console.error("Error processing message:", err);
        }
    });

    ws.on("close", () => {
        console.log("WebSocket connection closed.");
    });

    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});