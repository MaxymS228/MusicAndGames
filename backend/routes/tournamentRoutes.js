const express = require('express');
const router = express.Router();
const Tournament = require('../models/tournamentMongo');

// Створення нового турніру
router.post('/create', async (req, res) => {
    const { name, createdBy, maxPlayers, prizePool, location } = req.body;

    if (!name || !createdBy || !maxPlayers) {
        return res.status(400).json({ error: 'Name, createdBy, and maxPlayers are required.' });
    }

    try {
        const tournament = new Tournament({
            name,
            createdBy,
            players: [createdBy],
            maxPlayers,
            prizePool: prizePool || 0,
            location: location || 'Online',
        });

        await tournament.save();
        res.status(201).json(tournament);
    } catch (error) {
        console.error('Error creating tournament:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Отримання всіх турнірів
router.get('/', async (req, res) => {
    try {
        const tournaments = await Tournament.find();
        res.status(200).json(tournaments);
    } catch (error) {
        console.error('Error fetching tournaments:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Приєднання до турніру
router.post('/:tournamentId/join', async (req, res) => {
    const { tournamentId } = req.params;
    const { player } = req.body;

    if (!player) {
        return res.status(400).json({ error: 'Player name is required.' });
    }

    try {
        const tournament = await Tournament.findById(tournamentId);

        if (!tournament) {
            return res.status(404).json({ error: 'Tournament not found.' });
        }

        if (tournament.players.includes(player)) {
            return res.status(400).json({ error: 'Player already joined this tournament.' });
        }

        if (tournament.players.length >= tournament.maxPlayers) {
            return res.status(403).json({ error: 'Tournament is full.' });
        }

        tournament.players.push(player);

        if (tournament.players.length === tournament.maxPlayers) {
            tournament.status = 'in-progress';
        }

        await tournament.save();
        res.status(200).json(tournament);
    } catch (error) {
        console.error('Error joining tournament:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;