const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    }, 
    players: [{ 
        userID: String, 
        playerName: String 
    }],
    maxPlayers: { 
        type: Number, 
        default: 4 
    }, 
    status: { 
        type: String, 
        default: 'waiting' 
    }, 
    creator: { 
        type: String, 
        required: true 
    }, 
    createdAt: { 
        type: Date, 
        default: Date.now 
    }, 
    players: { 
        type: [String], 
        default: [] 
    }, 
});

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;