import React, { useState, useEffect } from 'react';
import './Tournaments.css';

const Tournaments = () => {
    const [tournaments, setTournaments] = useState([]);
    const [newTournament, setNewTournament] = useState({
        name: '',
        createdBy: '',
        maxPlayers: 2,
        prizePool: 0,
        location: '',
    });
    const [playerName, setPlayerName] = useState('');
    const [joinTournamentId, setJoinTournamentId] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchTournaments = async () => {
            const response = await fetch('http://localhost:5000/api/tournaments');
            const data = await response.json();
            setTournaments(data);
        };
        fetchTournaments();
    }, []);

    const createTournament = async () => {
        const response = await fetch('http://localhost:5000/api/tournaments/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTournament),
        });
        const data = await response.json();
        setTournaments([...tournaments, data]);
        setMessage('Tournament created successfully!');
    };

    const joinTournament = async () => {
        const response = await fetch(`http://localhost:5000/api/tournaments/${joinTournamentId}/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ player: playerName }),
        });
        const data = await response.json();
        setTournaments((prev) =>
            prev.map((t) => (t._id === joinTournamentId ? data : t))
        );
        setMessage('Successfully joined the tournament!');
    };

    return (
        <div className="tournaments-container">
            <h1 className="title">Tournaments</h1>
            <p className="subtitle">"The best way to predict your future is to create it." - Abraham Lincoln</p>

            <div className="form-container">
                <h2 className="form-title">Create Tournament</h2>
                <input
                    className="input-field"
                    placeholder="Tournament Name"
                    onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
                />
                <input
                    className="input-field"
                    placeholder="Your Name"
                    onChange={(e) => setNewTournament({ ...newTournament, createdBy: e.target.value })}
                />
                <input
                    className="input-field"
                    type="number"
                    placeholder="Max Players"
                    onChange={(e) => setNewTournament({ ...newTournament, maxPlayers: e.target.value })}
                />
                <input
                    className="input-field"
                    type="number"
                    placeholder="Prize Pool"
                    onChange={(e) => setNewTournament({ ...newTournament, prizePool: e.target.value })}
                />
                <input
                    className="input-field"
                    placeholder="Location"
                    onChange={(e) => setNewTournament({ ...newTournament, location: e.target.value })}
                />
                <button className="submit-button" onClick={createTournament}>Create</button>
            </div>

            <h2 className="tournament-list-title">Available Tournaments</h2>
            <div className="tournament-list">
                {tournaments.map((t) => (
                    <div key={t._id} className="tournament-card">
                        <h3>{t.name}</h3>
                        <p>Location: {t.location}</p>
                        <p>Prize Pool: ${t.prizePool}</p>
                        <p>
                            Players: {t.players.length}/{t.maxPlayers}
                        </p>
                        <button onClick={() => setJoinTournamentId(t._id)}>Join</button>
                    </div>
                ))}
            </div>

            {joinTournamentId && (
                <div>
                    <h3>Join Tournament</h3>
                    <input
                        placeholder="Your Name"
                        onChange={(e) => setPlayerName(e.target.value)}
                    />
                    <button onClick={joinTournament}>Confirm</button>
                </div>
            )}

            {message && <p className="message">{message}</p>}
            <p className="quote">"Victory is reserved for those who are willing to pay its price." - Sun Tzu</p>
        </div>
    );
};

export default Tournaments;
