
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import Navbar from './Navbar';
import Home from './Home';
import Profile from './Profile';
import Sessions from './Sessions';
import Music from './Music';
import Chat from './Chat';
import Register from './Register'; 
import Login from './Login'; 
import Tournaments from './Tournament';
import ProtectedRoute from "./ProtectedRoute";



const App = () => {
    const [username, setUsername] = useState("");
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decoded = jwt_decode(token);
            setUsername(decoded.username);
        }
    }, []);
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
                <Route path="/music" element={<Music />} />
                <Route path="/chat" element={<ProtectedRoute><Chat username={username} /></ProtectedRoute>} />
                <Route path="/tournaments" element={<Tournaments />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login setUsername={setUsername} />} />  
            </Routes>
        </Router>
    );
};

export default App;