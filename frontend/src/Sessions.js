import React, { useState, useEffect } from 'react';
import './Sessions.css'; 

const Sessions = () => {
    const [sessions, setSessions] = useState([]);
    const [newSessionName, setNewSessionName] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [joinSessionId, setJoinSessionId] = useState(null);
    const [message, setMessage] = useState('');
    const [maxPlayers, setMaxPlayers] = useState(2);

    // Завантаження сесій із сервера
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/sessions'); 
                if (!response.ok) {
                    console.error('Failed to fetch sessions:', response.statusText);
                    return;
                }
                const data = await response.json();
                setSessions(data); 
            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        };

        fetchSessions();
    }, []);

    // Створення нової сесії
    const createSession = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/sessions/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newSessionName, creator: playerName, maxPlayers: parseInt(maxPlayers, 10) }),
            });

            if (!response.ok) {
                console.error('Failed to create session:', response.statusText);
                throw new Error(`Server error: ${response.status}`);
            }

            const newSession = await response.json();
            setSessions([...sessions, newSession]); 
            setNewSessionName('');
            setMaxPlayers('');
        } catch (error) {
            console.error('Error creating session:', error);
            alert('Failed to create session. Please check server logs.');
        }
    };

    // Приєднання до сесії
    const joinSession = async () => {
        if (!playerName) {
            setMessage('Please enter your name before joining a session.');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:5000/api/sessions/${joinSessionId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ player: playerName }),
            });
    
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
    
            const updatedSession = await response.json();
            setSessions((prevSessions) =>
                prevSessions.map((session) =>
                    session._id === joinSessionId ? updatedSession : session
                )
            );
            setMessage(`Successfully joined session: ${updatedSession.name}`);
            setJoinSessionId(null);
        } catch (error) {
            console.error('Error joining session:', error);
            setMessage(`Failed to join session: ${error.message}`);
        }
    };

    return (
        <div className="sessions-container">
            <h1>Game Sessions</h1>
            <p>Join or create a game session and start playing with others!</p>

            <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="input-field"
            />

            <div className="session-create">
                <input
                    type="text"
                    placeholder="Session name"
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                    className="input-field"
                />
                <input
                    type="number"
                    placeholder="Max players"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(e.target.value)}
                    className="input-field"
                />
                <button onClick={createSession} className="button">Create Session</button>
            </div>

            <div className="sessions-list">
                {sessions.map((session) => (
                    <div key={session._id} className="session-card">
                        <h2>{session.name}</h2>
                        <p>Status: {session.status === 'in-progress' ? 'In Progress' : 'Waiting'}</p>
                        <p>Players: {session.players.length} / {session.maxPlayers}</p>
                        <p>Players: {session.players.join(', ')}</p>

                        {session.status === 'waiting' && (
                            <button onClick={() => setJoinSessionId(session._id)} className="button join-btn">Join Session</button>
                        )}
                    </div>
                ))}
            </div>

            {joinSessionId && (
                <div className="join-session-form">
                    <h3>Join Session</h3>
                    <p>Enter your name to join:</p>
                    <input
                        type="text"
                        placeholder="Your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="input-field"
                    />
                    <button onClick={joinSession} className="button">Confirm</button>
                    <button onClick={() => setJoinSessionId(null)} className="button cancel-btn">Cancel</button>
                </div>
            )}

            {message && <p>{message}</p>}
        </div>
    );
};

export default Sessions;
