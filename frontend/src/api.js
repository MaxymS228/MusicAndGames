import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

// Реєстрація користувача
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (err) {
        if (err.response && err.response.data) {
            throw new Error(err.response.data.message || "Error during registration");
        }
        throw new Error("Error during registration");
    }
};

// Логін користувача
export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (err) {
        if (err.response && err.response.data) {
            throw new Error(err.response.data.message || "Error during login");
        }
        throw new Error("Error during login");
    }
};

// Отримання даних із захищеного ресурсу
export const fetchData = async (endpoint) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${API_URL}/${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; 
    } catch (err) {
        if (err.response && err.response.data) {
            throw new Error(err.response.data.message || "Error fetching data");
        }
        throw new Error("Error fetching data");
    }
};
