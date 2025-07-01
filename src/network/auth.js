import axios from "axios";
import { BASE_URL } from "../config/api";

export const adminLogin = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            email,
            password,
        });
        
        console.log("Successfully logged in");
        return response.data;
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        throw error;
    }
};
