const express = require('express');
const router = express.Router();
const multer = require('multer');
const Music = require('../models/musicMongo');
const path = require('path');

// Налаштування fileFilter
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
    const allowedExtensions = ['.mp3', '.wav', '.ogg'];

    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error('Only audio files are allowed (mp3, wav, ogg)'));
    }
};

// Налаштування Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Папка, де зберігаються файли
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ 
    storage,
    fileFilter
});

// Ендпоінт для створення музики із завантаженням файлу
router.post('/create', upload.single('audio'), async (req, res) => {
    try {
        const { title, artist, description } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded or invalid file type' });
        }

        const newMusic = new Music({
            title,
            artist,
            description,
            audioUrl: `/uploads/${req.file.filename}`,
        });

        await newMusic.save();
        res.status(201).json(newMusic);
    } catch (err) {
        console.error('Error creating music:', err);
        res.status(500).json({ error: err.message });
    }
});

// Отримання всіх музичних творів
router.get('/', async (req, res) => {
    try {
        const musicList = await Music.find().sort({ createdAt: -1 });
        res.status(200).json(musicList);
    } catch (err) {
        console.error('Error fetching music:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;