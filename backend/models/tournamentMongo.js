const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    createdBy: { 
        type: String, 
        required: true 
    },
    players: { 
        type: [String], 
        default: [] 
    },
    maxPlayers: { 
        type: Number, 
        required: true 
    },
    prizePool: { 
        type: Number, 
        default: 0 
    },
    location: { 
        type: String, 
        default: 'Online' 
    },
    status: { 
        type: String, 
        enum: ['waiting', 'in-progress', 'completed'], 
        default: 'waiting' 
    },
}, { timestamps: true });

module.exports = mongoose.model('Tournament', TournamentSchema);
