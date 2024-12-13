import React, { useState, useEffect } from 'react';
import './Music.css'; 

const Music = () => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [description, setDescription] = useState('');
    const [musicFile, setMusicFile] = useState(null);
    const [musicList, setMusicList] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchMusic = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/music');
                const data = await response.json();
                setMusicList(data);
            } catch (error) {
                console.error('Error downloading music:', error);
            }
        };

        fetchMusic();
    }, []);

    const createMusic = async () => {
        if (!title || !artist || !musicFile) {
            setMessage('Please fill in all the required fields.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('description', description);
        formData.append('audio', musicFile);

        try {
            const response = await fetch('http://localhost:5000/api/music/create', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to create music.');
            }

            const newMusic = await response.json();
            setMusicList([newMusic, ...musicList]);
            setTitle('');
            setArtist('');
            setDescription('');
            setMusicFile(null);
            setMessage('The music is successfully created!');
        } catch (error) {
            console.error('Error when creating music:', error);
            setMessage('Error when creating music.');
        }
    };

    return (
        <div className="music-container">
            <h1 className="title">Build Your Music Collection</h1>
            <p className="subtitle">Share your creativity with others! Download your tracks and listen to new hits from other artists.</p>

            {/* Форма створення музики */}
            <div className="form-container">
                <h2 className="form-title">Download new music</h2>
                <input
                    type="text"
                    placeholder="Song title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field"
                />
                <input
                    type="text"
                    placeholder="Artist's name"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="input-field"
                />
                <textarea
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field description-field"
                />
                <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setMusicFile(e.target.files[0])}
                    className="file-input"
                />
                <button onClick={createMusic} className="submit-button">
                    Download music
                </button>

                {message && <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</p>}
            </div>

            {/* Список музики */}
            <h2 className="music-list-title">Discover new music</h2>
            <div className="music-list">
                {musicList.map((music) => (
                    <div key={music._id} className="music-card">
                        <h3>{music.title}</h3>
                        <p>Artist: {music.artist}</p>
                        <p>Description: {music.description}</p>
                        <audio controls>
                            <source src={`http://localhost:5000${music.audioUrl}`} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Music;
