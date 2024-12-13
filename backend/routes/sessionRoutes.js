const express = require('express');
const router = express.Router();
const Session = require('../models/sessionMongo');
const mongoose = require('mongoose');

// Створення нової ігрової сесії
router.post('/create', async (req, res) => {
    console.log('Received request to create session with data:', req.body);
    const { name, creator, maxPlayers } = req.body;
    
    if (!name || !creator) {
        return res.status(400).json({ error: 'Name and creator are required' });
    }
    if (!maxPlayers || maxPlayers <= 0) {
        return res.status(400).json({ error: 'Invalid maxPlayers value' });
    }

    try {
        const session = new Session({
            name,
            creator,
            players: [creator], 
            maxPlayers, 
        });

        await session.save();
        console.log('Session created successfully:', session);
        res.status(201).json(session);
    } catch (err) {
        console.error('Error creating session:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Перегляд всіх доступних сесій
router.get('/', async (req, res) => {
    try {
        const sessions = await Session.find();
        res.status(200).json(sessions);
    } catch (err) {
        console.error('Error fetching sessions:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Приєднання до ігрової сесії
router.post('/:sessionId/join', async (req, res) => {
    const { sessionId } = req.params;
    const { userID, player } = req.body;

    if (!player) {
        return res.status(400).json({ error: 'Player name is required.' });
    }

    try {
        const session = await Session.findById(sessionId);

        if (!session) {
            return res.status(404).json({ error: 'Session not found.' });
        }

        if (session.players.includes(player)) {
            return res.status(400).json({ error: 'Player already in this session.' });
        }

        const otherSession = await Session.findOne({ players: player, status: 'waiting' });
        if (otherSession) {
            return res.status(400).json({
                error: `Player is already in another session (${otherSession.name}).`,
            });
        }

        if (session.status === 'in-progress') {
            return res.status(403).json({ error: 'Cannot join. Session is in-progress.' });
        }

        if (session.players.length >= session.maxPlayers) {
            return res.status(403).json({ error: 'Cannot join. Session is full.' });
        }

        session.players.push(player);

        if (session.players.length >= session.maxPlayers) {
            session.status = 'in-progress';
        }

        await session.save();
        res.status(200).json(session);
    } catch (err) {
        console.error('Error joining session:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

