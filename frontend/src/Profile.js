import React, { useState, useEffect } from "react";
import { fetchData } from "./api";
import './Profile.css';  

const Profile = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true); 
                const result = await fetchData("profile"); 
                setData(result); 
            } catch (err) {
                console.error("Error fetching profile data:", err);
                setError(err.message || "Failed to fetch profile data"); 
            } finally {
                setLoading(false); 
            }
        };
    
        fetchProfileData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }
    
    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!data) {
        return <p>No profile data available</p>;
    }

    return (
        <div className="profile-container">
            <h1>Welcome back, {data.username}!</h1>
            <div className="profile-card">
                <img 
                    src={data.avatar || "https://www.gravatar.com/avatar?d=mp"} 
                    alt="User Avatar" 
                    className="avatar" 
                />
                <div className="profile-info">
                    <p><strong>Email:</strong> {data.email}</p>
                    <p><strong>Role:</strong> {data.role || "User"}</p>
                    <p><strong>Member Since:</strong> {new Date(data.createdAt).toLocaleDateString()}</p>
                    <p className="bio">"It's great to have you here! Keep exploring and enjoy your time!"</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
