const express = require("express");
const router = express.Router();
const Message = require("../models/messageMongo");

router.get("/", async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { text, sender, timestamp } = req.body; 
        const message = new Message({ text, sender, timestamp }); 
        await message.save();
        res.status(201).json({ message: "Message saved successfully!" });
    } catch (err) {
        console.error("Error saving message:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;