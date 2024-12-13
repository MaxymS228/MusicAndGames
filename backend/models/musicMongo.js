const mongoose = require('mongoose');

const MusicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    artist: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    audioUrl: {
        type: String,
        required: true, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Music', MusicSchema);